import React from 'react';
import { FileText, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 bg-[#0b0b10]">
      <header>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Relatórios</h2>
        <p className="text-slate-500 mt-1">Histórico de integridade da infraestrutura</p>
      </header>

      <div className="dark-card p-12 flex flex-col items-center justify-center text-slate-600 border-dashed border-2 border-white/5">
        <FileText size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-bold uppercase tracking-widest opacity-50">Histórico em processamento</p>
        <p className="text-sm mt-2 opacity-30">Os logs de testes aparecerão aqui em breve.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dark-card p-6 bg-emerald-500/5 border-emerald-500/10">
            <ShieldCheck className="text-emerald-500 mb-2" size={24} />
            <h4 className="text-white font-bold uppercase text-xs tracking-widest">Disponibilidade Média</h4>
            <p className="text-2xl font-black text-emerald-400 mt-1">99.8%</p>
        </div>
        <div className="dark-card p-6 bg-rose-500/5 border-rose-500/10">
            <ShieldAlert className="text-rose-500 mb-2" size={24} />
            <h4 className="text-white font-bold uppercase text-xs tracking-widest">Incidentes (24h)</h4>
            <p className="text-2xl font-black text-rose-400 mt-1">0</p>
        </div>
        <div className="dark-card p-6 bg-blue-500/5 border-blue-500/10">
            <Clock className="text-blue-500 mb-2" size={24} />
            <h4 className="text-white font-bold uppercase text-xs tracking-widest">Última Varredura</h4>
            <p className="text-sm font-bold text-blue-400 mt-1 uppercase">Agora mesmo</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
