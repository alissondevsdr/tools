import { Router } from 'express';
import pool from '../database/connection.js';
import { checkPort } from '../services/networkService.js';
import { fetchCNPJ } from '../services/cnpjService.js';
import type { PortResult } from '../models/types.js';

const router = Router();

// Groups
router.get('/groups', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT g.*, COUNT(c.id) as client_count 
            FROM \`groups\` g 
            LEFT JOIN clients c ON c.group_id = g.id 
            GROUP BY g.id
        `);
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/groups', async (req, res) => {
    try {
        const { name } = req.body;
        const [result]: any = await pool.query('INSERT INTO \`groups\` (name) VALUES (?)', [name]);
        res.json({ id: result.insertId, name });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Clients
router.get('/clients', async (req, res) => {
    try {
        const [rows]: any = await pool.query('SELECT * FROM clients ORDER BY name ASC');
        res.json(rows.map((c: any) => ({
            ...c,
            ports: typeof c.ports === 'string' ? c.ports.split(',').map(Number) : []
        })));
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/clients', async (req, res) => {
    try {
        const { name, cnpj, host, ports, group_id, ip_interno, provedor_internet } = req.body;
        const portsStr = Array.isArray(ports) ? ports.join(',') : ports;
        
        const [result]: any = await pool.query(`
            INSERT INTO clients (name, cnpj, host, ports, group_id, ip_interno, provedor_internet)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [name, cnpj, host, portsStr, group_id || null, ip_interno || '', provedor_internet || '']);
        
        res.json({ id: result.insertId, ...req.body });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/clients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, cnpj, host, ports, group_id, ip_interno, provedor_internet } = req.body;
        const portsStr = Array.isArray(ports) ? ports.join(',') : ports;
        
        await pool.query(`
            UPDATE clients 
            SET name = ?, cnpj = ?, host = ?, ports = ?, group_id = ?, ip_interno = ?, provedor_internet = ?
            WHERE id = ?
        `, [name, cnpj, host, portsStr, group_id || null, ip_interno || '', provedor_internet || '', id]);
        
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/clients/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM clients WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Test Execution (Single or All)
async function performTest(client: any) {
    const ports = client.ports.split(',').map(Number);
    const results: PortResult[] = [];
    
    for (const port of ports) {
        results.push(await checkPort(client.host, port));
    }
    
    const openPorts = results.filter(r => r.open);
    const avgResponse = openPorts.length > 0 
        ? openPorts.reduce((acc, r) => acc + (r.response_time || 0), 0) / openPorts.length 
        : null;
    
    let status = 'PENDING';
    if (openPorts.length === results.length) status = 'OK';
    else if (openPorts.length === 0) status = 'ERROR';
    else status = 'PARTIAL';
    
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await pool.query(`
        UPDATE clients 
        SET status = ?, last_test = ?, avg_response_ms = ? 
        WHERE id = ?
    `, [status, timestamp, avgResponse, client.id]);
    
    const [logResult]: any = await pool.query(`
        INSERT INTO test_logs (client_id, client_name, timestamp, status, duration_ms, details)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [client.id, client.name, timestamp, status, avgResponse || 0, JSON.stringify(results)]);
    
    const logId = logResult.insertId;
    for (const r of results) {
        await pool.query(`
            INSERT INTO port_results (log_id, port, is_open, response_ms, error)
            VALUES (?, ?, ?, ?, ?)
        `, [logId, r.port, r.open ? 1 : 0, r.response_time, r.error]);
    }
    return { status, results, last_test: timestamp };
}

router.post('/clients/test-all', async (req, res) => {
    try {
        const [clients]: any = await pool.query('SELECT * FROM clients');
        for (const client of clients) {
            await performTest(client);
        }
        res.json({ success: true, count: clients.length });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/clients/:id/test', async (req, res) => {
    try {
        const { id } = req.params;
        const [clients]: any = await pool.query('SELECT * FROM clients WHERE id = ?', [id]);
        if (!clients[0]) return res.status(404).json({ error: 'Client not found' });
        
        const result = await performTest(clients[0]);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// CNPJ Lookup robusto
router.get('/cnpj/:cnpj', async (req, res) => {
    try {
        const data = await fetchCNPJ(req.params.cnpj);
        // BrasilAPI costuma retornar razao_social ou nome_fantasia
        const name = data.razao_social || data.nome_fantasia || data.nome || "Empresa não identificada";
        res.json({
            razao_social: name,
            nome_fantasia: data.nome_fantasia || name,
            logradouro: data.logradouro || "",
            numero: data.numero || "",
            municipio: data.municipio || "",
            uf: data.uf || ""
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
