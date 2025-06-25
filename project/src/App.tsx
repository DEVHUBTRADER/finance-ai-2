import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import Transactions from './components/Transactions';
import Income from './components/Income';
import Investments from './components/Investments';
import Retirement from './components/Retirement';
import RealEstate from './components/RealEstate';
import Loans from './components/Loans';
import Bills from './components/Bills';
import Documents from './components/Documents';
import AIInsights from './components/AIInsights';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Chat com IA Financeira</h1>
              <p className="text-gray-500 mt-1">Converse com nossa IA sobre planejamento financeiro, investimentos e previdência</p>
            </div>
            <AIChat />
          </div>
        );
      case 'transactions':
        return <Transactions />;
      case 'income':
        return <Income />;
      case 'investments':
        return <Investments />;
      case 'retirement':
        return <Retirement />;
      case 'real-estate':
        return <RealEstate />;
      case 'loans':
        return <Loans />;
      case 'bills':
        return <Bills />;
      case 'documents':
        return <Documents />;
      case 'insights':
        return <AIInsights />;
      case 'cards':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cartões</h2>
            <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configurações</h2>
            <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;