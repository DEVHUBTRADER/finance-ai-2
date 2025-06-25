import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, DollarSign, Calendar, Edit, Trash2 } from 'lucide-react';
import { saveToStorage, loadFromStorage } from '../utils/storage';

interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'yearly' | 'one-time';
  category: string;
  nextPayment?: string;
  isActive: boolean;
}

export default function Income() {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load income sources from localStorage on component mount
  useEffect(() => {
    const savedIncome = loadFromStorage('income', []);
    setIncomeSources(savedIncome);
  }, []);

  const totalMonthlyIncome = incomeSources
    .filter(source => source.isActive)
    .reduce((sum, source) => {
      switch (source.frequency) {
        case 'monthly': return sum + source.amount;
        case 'weekly': return sum + (source.amount * 4.33);
        case 'yearly': return sum + (source.amount / 12);
        default: return sum;
      }
    }, 0);

  const handleAddIncomeSource = (newSource: Omit<IncomeSource, 'id'>) => {
    const source: IncomeSource = {
      ...newSource,
      id: Date.now().toString(),
    };
    const updatedSources = [...incomeSources, source];
    setIncomeSources(updatedSources);
    saveToStorage('income', updatedSources);
    setShowAddModal(false);
  };

  const handleDeleteSource = (id: string) => {
    const updatedSources = incomeSources.filter(s => s.id !== id);
    setIncomeSources(updatedSources);
    saveToStorage('income', updatedSources);
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return 'Mensal';
      case 'weekly': return 'Semanal';
      case 'yearly': return 'Anual';
      case 'one-time': return 'Única';
      default: return frequency;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return 'bg-blue-100 text-blue-700';
      case 'weekly': return 'bg-green-100 text-green-700';
      case 'yearly': return 'bg-purple-100 text-purple-700';
      case 'one-time': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fontes de Renda</h1>
          <p className="text-gray-500 mt-1">Gerencie suas receitas e projete seu futuro</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Fonte</span>
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Renda Mensal Total</p>
              <p className="text-3xl font-bold mt-1">R$ {totalMonthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Fontes Ativas</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {incomeSources.filter(s => s.isActive).length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Próximo Pagamento</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {incomeSources
                  .filter(s => s.nextPayment && s.isActive)
                  .sort((a, b) => new Date(a.nextPayment!).getTime() - new Date(b.nextPayment!).getTime())[0]
                  ?.nextPayment 
                  ? new Date(incomeSources
                      .filter(s => s.nextPayment && s.isActive)
                      .sort((a, b) => new Date(a.nextPayment!).getTime() - new Date(b.nextPayment!).getTime())[0]
                      .nextPayment!).toLocaleDateString('pt-BR')
                  : 'N/A'
                }
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de fontes de renda */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Suas Fontes de Renda</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {incomeSources.length === 0 ? (
            <div className="p-12 text-center">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma fonte de renda cadastrada</h3>
              <p className="text-gray-500">Adicione suas fontes de renda para acompanhar seus ganhos.</p>
            </div>
          ) : (
            incomeSources.map((source) => (
              <div key={source.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      source.isActive ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <TrendingUp className={`h-6 w-6 ${
                        source.isActive ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-800">{source.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getFrequencyColor(source.frequency)}`}>
                          {getFrequencyLabel(source.frequency)}
                        </span>
                        {!source.isActive && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                            Inativa
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">{source.category}</span>
                        {source.nextPayment && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">
                              Próximo: {new Date(source.nextPayment).toLocaleDateString('pt-BR')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-xl text-green-600">
                      R$ {source.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSource(source.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de adicionar fonte de renda */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Nova Fonte de Renda</h2>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddIncomeSource({
                name: formData.get('name') as string,
                amount: Number(formData.get('amount')),
                frequency: formData.get('frequency') as any,
                category: formData.get('category') as string,
                nextPayment: formData.get('nextPayment') as string || undefined,
                isActive: true,
              });
            }} className="p-6 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nome da fonte de renda"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="amount"
                  placeholder="Valor (R$)"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
                
                <select
                  name="frequency"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                >
                  <option value="">Frequência</option>
                  <option value="monthly">Mensal</option>
                  <option value="weekly">Semanal</option>
                  <option value="yearly">Anual</option>
                  <option value="one-time">Única</option>
                </select>
              </div>
              
              <input
                type="text"
                name="category"
                placeholder="Categoria (ex: Salário, Freelance)"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
              
              <input
                type="date"
                name="nextPayment"
                placeholder="Próximo pagamento"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}