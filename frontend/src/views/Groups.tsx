import React, { useState, useEffect } from 'react';
import { Plus, FolderTree, Trash2, Users } from 'lucide-react';
import { getGroups, createGroup } from '../services/api';

const Groups = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    try {
      const res = await getGroups();
      setGroups(res.data);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createGroup(newName);
      setNewName('');
      loadGroups();
    } catch (error) {
      alert('Erro ao criar grupo');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white">Grupos</h2>
        <p className="text-slate-500 mt-1">Organize seus clientes por categorias</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Novo Grupo */}
        <div className="lg:col-span-1">
          <div className="dark-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus size={20} className="text-blue-400" />
              Novo Grupo
            </h3>
            <form onSubmit={handleAddGroup} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-400 block mb-2">Nome do Grupo</label>
                <input 
                  type="text" 
                  className="dark-input" 
                  placeholder="Ex: Servidores Matriz"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
              >
                Criar Grupo
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Grupos */}
        <div className="lg:col-span-2">
          <div className="dark-card overflow-hidden">
            <div className="p-4 border-b border-border-dark bg-sidebar/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderTree size={20} className="text-blue-400" />
                Grupos Existentes
              </h3>
            </div>
            <div className="divide-y divide-border-dark">
              {groups.map((group) => (
                <div key={group.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <FolderTree className="text-blue-400" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{group.name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {group.client_count || 0} clientes
                        </span>
                        <span>•</span>
                        <span>Criado em {new Date(group.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {groups.length === 0 && !loading && (
                <div className="p-12 text-center text-slate-500">
                  Nenhum grupo cadastrado.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
