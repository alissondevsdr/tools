import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, RefreshCw, Edit2, Trash2, 
  CheckCircle2, XCircle, AlertCircle, Play, 
  Globe, Hash, Filter, Zap
} from 'lucide-react';
import { getClients, testClient, deleteClient, getGroups, testAllClients } from '../services/api';
import ClientModal from '../components/ClientModal';

const Clients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [testingId, setTestingId] = useState<number | null>(null);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  const loadData = async () => {
    try {
      const [cRes, gRes] = await Promise.all([getClients(), getGroups()]);
      setClients(cRes.data);
      setGroups(gRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTest = async (id: number) => {
    setTestingId(id);
    try {
      await testClient(id);
      await loadData();
    } catch (error) {
      console.error(error);
    } finally {
      setTestingId(null);
    }
  };

  const handleTestAll = async () => {
    if (isTestingAll) return;
    setIsTestingAll(true);
    try {
      await testAllClients();
      await loadData();
    } catch (error) {
      alert('Erro ao testar todos');
    } finally {
      setIsTestingAll(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cnpj.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 bg-[#0b0b10]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Clientes</h2>
          <p className="text-slate-500 mt-1">Gerenciamento de pontos de monitoramento</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleTestAll}
            disabled={isTestingAll}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl ${
              isTestingAll 
              ? 'bg-[#1e1e2e] text-slate-500 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
            }`}
          >
            {isTestingAll ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
            {isTestingAll ? 'Testando...' : 'Testar Todos'}
          </button>
          <button 
            onClick={() => { setEditingClient(null); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-blue-900/20"
          >
            <Plus size={18} />
            Novo Cliente
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ClientModal 
          client={editingClient}
          groups={groups}
          onClose={() => setIsModalOpen(false)}
          onSave={() => { setIsModalOpen(false); loadData(); }}
        />
      )}

      <div className="dark-card overflow-hidden bg-[#181825]/50">
        <div className="p-4 border-b border-white/5 bg-[#11111b]/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome, host ou CNPJ..."
              className="dark-input pl-10 border-white/5 focus:border-blue-500/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <select className="dark-input pl-10 pr-8 appearance-none cursor-pointer bg-[#11111b] border-white/5">
                  <option value="">Todos os Grupos</option>
                  {groups.map(g => <option key={g.id} value={g.id} className="bg-[#11111b]">{g.name}</option>)}
                </select>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5 bg-[#11111b]/30">
                <th className="px-6 py-4">Cliente / CNPJ</th>
                <th className="px-6 py-4">Host / Portas</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Último Teste</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200">{client.name}</span>
                      <span className="text-[10px] text-slate-600 flex items-center gap-1 mt-1 font-mono">
                        <Hash size={10} /> {client.cnpj || '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-400 flex items-center gap-1.5 font-mono">
                        <Globe size={14} className="text-blue-500/30" /> {client.host}
                      </span>
                      <div className="flex gap-1 mt-2 flex-wrap max-w-xs">
                        {client.ports.map((p: number) => (
                          <span key={p} className="text-[9px] px-1.5 py-0.5 bg-[#0b0b10] text-slate-500 rounded border border-white/5 font-mono">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                      client.status === 'OK' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      client.status === 'ERROR' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {client.status}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400">
                        {client.last_test ? new Date(client.last_test).toLocaleString('pt-BR') : 'Nunca'}
                      </span>
                      {client.avg_response_ms && (
                        <span className="text-[10px] text-slate-600 font-mono mt-1">{Math.round(client.avg_response_ms)}ms</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleTest(client.id)}
                        disabled={testingId === client.id}
                        className={`p-2 rounded-xl transition-all ${
                          testingId === client.id ? 'bg-blue-500/20 text-blue-400 animate-spin' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white'
                        }`}
                      >
                        <Play size={16} fill="currentColor" />
                      </button>
                      <button 
                        onClick={() => { setEditingClient(client); setIsModalOpen(true); }}
                        className="p-2 bg-slate-800/50 text-slate-400 rounded-xl hover:bg-slate-700 hover:text-white transition-all border border-white/5"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteClient(client.id).then(loadData)}
                        className="p-2 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-500/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clients;
