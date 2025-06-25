import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  PiggyBank, 
  Brain, 
  Settings,
  CreditCard,
  Building,
  Shield,
  Home,
  AlertTriangle,
  FileText,
  FolderOpen
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat', label: 'Chat IA', icon: Brain },
  { id: 'transactions', label: 'Transações', icon: Receipt },
  { id: 'income', label: 'Renda', icon: TrendingUp },
  { id: 'investments', label: 'Investimentos', icon: Building },
  { id: 'retirement', label: 'Previdência', icon: Shield },
  { id: 'real-estate', label: 'Imóveis', icon: Home },
  { id: 'loans', label: 'Empréstimos', icon: AlertTriangle },
  { id: 'bills', label: 'Contas', icon: FileText },
  { id: 'documents', label: 'Documentos', icon: FolderOpen },
  { id: 'insights', label: 'IA Insights', icon: Brain },
  { id: 'cards', label: 'Cartões', icon: CreditCard },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-xl border-r border-gray-100 h-screen fixed left-0 top-0 z-30 overflow-y-auto">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-800">FinanceAI</h1>
            <p className="text-sm text-gray-500">Controle Inteligente</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}