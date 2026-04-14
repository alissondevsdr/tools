import React, { useState, useEffect } from 'react';
import { X, Search, Building2, Globe, Hash, Server, Wifi } from 'lucide-react';
import { lookupCNPJ, createClient, updateClient } from '../services/api';

interface ClientModalProps {
  client?: any;
  groups: any[];
  onClose: () => void;
  onSave: () => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ client, groups, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    host: '',
    ports: '',
    group_id: '',
    ip_interno: '',
    provedor_internet: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
        ports: Array.isArray(client.ports) ? client.ports.join(', ') : client.ports,
        group_id: client.group_id || ''
      });
    }
  }, [client]);

  const handleCNPJLookup = async () => {
    const cleanCnpj = formData.cnpj.replace(/\D/g, '');
    if (cleanCnpj.length !== 14) {
      alert('Informe um CNPJ válido com 14 dígitos');
      return;
    }
    setLoading(true);
    try {
      const res = await lookupCNPJ(cleanCnpj);
      const companyName = res.data.razao_social || res.data.nome_fantasia || "Empresa não encontrada";
      setFormData(prev => ({
        ...prev,
        cnpj: cleanCnpj,
        name: companyName
      }));
    } catch (error) {
      alert('Erro na consulta do CNPJ. Verifique a conexão ou se o número está correto.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ports = formData.ports.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
    const data = { ...formData, ports };
    
    try {
      if (client?.id) {
        await updateClient(client.id, data);
      } else {
        await createClient(data);
      }
      onSave();
    } catch (error) {
      alert('Erro ao salvar cliente');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000]/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="dark-card w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-white/5 bg-[#1e1e2e]">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-sidebar/50">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">
            {client ? 'Editar Cliente' : 'Novo Cliente'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Hash size={14} className="text-blue-500" /> CNPJ
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  className="dark-input pr-12"
                  value={formData.cnpj}
                  onChange={e => setFormData({...formData, cnpj: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={handleCNPJLookup}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                >
                  {loading ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Building2 size={14} className="text-blue-500" /> Nome / Razão Social
              </label>
              <input 
                type="text" required
                className="dark-input"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Globe size={14} className="text-blue-500" /> Host / IP
              </label>
              <input 
                type="text" required
                placeholder="ex: matriz.dns.com"
                className="dark-input"
                value={formData.host}
                onChange={e => setFormData({...formData, host: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Server size={14} className="text-blue-500" /> Portas (ex: 80, 443)
              </label>
              <input 
                type="text" required
                className="dark-input"
                value={formData.ports}
                onChange={e => setFormData({...formData, ports: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Grupo</label>
              <select 
                className="dark-input appearance-none"
                value={formData.group_id}
                onChange={e => setFormData({...formData, group_id: e.target.value})}
              >
                <option value="">Sem Grupo</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Wifi size={14} className="text-blue-500" /> Provedor
              </label>
              <input 
                type="text"
                className="dark-input"
                value={formData.provedor_internet}
                onChange={e => setFormData({...formData, provedor_internet: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-white/5 text-slate-400 rounded-2xl font-bold hover:bg-white/5 transition-colors uppercase text-xs tracking-widest"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/30 uppercase text-xs tracking-widest"
            >
              {client ? 'Atualizar' : 'Salvar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
