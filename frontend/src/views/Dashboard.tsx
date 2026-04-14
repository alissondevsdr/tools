import React from 'react';
import { Activity, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total de Clientes', value: '124', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Status OK', value: '112', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Com Erros', value: '5', icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Parciais', value: '7', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 bg-[#0b0b10]">
      <header>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Visão <span className="text-blue-500">Geral</span></h2>
        <p className="text-slate-500 mt-1">Status da infraestrutura em tempo real</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="dark-card p-6 border-white/5 bg-[#181825]/50 hover:bg-[#181825] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-2xl`}>
                <stat.icon className={`${stat.color} w-6 h-6`} />
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</h3>
            <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dark-card p-6 bg-[#181825]/50">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="text-blue-400" size={20} />
            Testes Recentes
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#11111b] hover:bg-[#1e1e2e] transition-colors border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                  <div>
                    <p className="font-bold text-slate-200">Cliente Matriz {i}</p>
                    <p className="text-[10px] text-slate-600 uppercase font-black">Há {i * 5} minutos</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-[#1e1e2e] px-2 py-1 rounded">45ms</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dark-card p-6 bg-[#181825]/50">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="text-amber-400" size={20} />
            Alertas Ativos
          </h3>
          <div className="flex flex-col items-center justify-center h-48 text-slate-600 italic">
            <p className="text-sm">Nenhum alerta crítico no momento.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
