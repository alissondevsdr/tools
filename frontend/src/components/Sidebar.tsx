import React from 'react';
import { LayoutDashboard, Users, FolderTree, FileText, Settings, Activity } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'groups', label: 'Grupos', icon: FolderTree },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar text-slate-500 flex flex-col fixed left-0 top-0 border-r border-border-dark">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
           <Activity className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">Port<span className="text-blue-500">Checker</span></h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/40' 
                : 'hover:bg-white/[0.03] hover:text-slate-300'
              }`}
            >
              <Icon size={22} className={`${isActive ? 'text-white' : 'text-slate-600 group-hover:text-blue-400'} transition-colors`} />
              <span className="font-bold uppercase text-xs tracking-widest">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-border-dark">
        <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/[0.03] transition-colors group">
          <Settings size={22} className="text-slate-600 group-hover:text-blue-400" />
          <span className="font-bold uppercase text-xs tracking-widest">Config</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
