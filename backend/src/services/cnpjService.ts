import axios from 'axios';

const API_URL = "https://brasilapi.com.br/api/cnpj/v1/";

export async function fetchCNPJ(cnpj: string) {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) {
        throw new Error("CNPJ inválido. Informe 14 dígitos.");
    }

    try {
        // Usando um User-Agent real para evitar bloqueios da API
        const response = await axios.get(`${API_URL}${cleanCnpj}`, { 
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error("CNPJ não encontrado.");
            }
            if (error.response.status === 429) {
                throw new Error("Muitas consultas. Tente novamente em instantes.");
            }
        }
        throw new Error(`Erro na consulta: ${error.message}`);
    }
}

export function formatAddress(data: any): string {
    const parts = [];
    if (data.logradouro) {
        let end = data.logradouro;
        if (data.numero) end += `, ${data.numero}`;
        parts.push(end);
    }
    if (data.bairro) parts.push(data.bairro);
    if (data.municipio) parts.push(`${data.municipio} - ${data.uf}`);
    return parts.join('\n') || "—";
}
