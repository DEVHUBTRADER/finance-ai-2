import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Building, DollarSign, Calendar, Edit, Trash2, PieChart } from 'lucide-react';
import { Investment } from '../types';
import { saveToStorage, loadFromStorage } from '../utils/storage';

const investmentTypes = [
  { value: 'renda-fixa', label: 'Renda Fixa', color: 'bg-blue-500' },
  { value: 'acoes', label: 'Ações', color: 'bg-green-500' },
  { value: 'fundos-imobiliarios', label: 'Fundos Imobiliários', color: 'bg-purple-500' },
  { value: 'private-equity', label: 'Private Equity', color: 'bg-yellow-500' },
  { value: 'titulos-credito', label: 'Títulos de Crédito', color: 'bg-indigo-500' }
];

const brokers = [
  'XP Investimentos', 'Rico', 'Inter', 'BTG Pactual', 'Nubank', 'Clear', 'Toro', 'Easynvest'
];

export default function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load investments from localStorage on component mount
  useEffect(() => {
    const savedInvestments = loadFromStorage('investments', []);
    setInvestments(savedInvestments);
  }, []);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => {
    const currentValue = inv.currentPrice || inv.purchasePrice || inv.amount;
    return sum + currentValue;
  }, 0);
  const totalMonthlyIncome = investments.reduce((sum, inv) => sum + (inv.monthlyIncome || 0), 0);
  const totalReturn = totalCurrentValue - totalInvested;
  const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  const handleAddInvestment = (newInvestment: Omit<Investment, 'id'>) => {
    const investment: Investment = {
      ...newInvestment,
      id: Date.now().toString(),
    };
    const updatedInvestments = [...investments, investment];
    setInvestments(updatedInvestments);
    saveToStorage('investments', updatedInvestments);
    setShowAddModal(false);
  };

  const handleDeleteInvestment = (id: string) => {
    const updatedInvestments = investments.filter(inv => inv.id !== id);
    setInvestments(updatedInvestments);
    saveToStorage('investments', updatedInvestments);
  };

  const getTypeLabel = (type: string) => {
    return investmentTypes.find(t => t.value === type)?.label || type;
  };

  const getTypeColor = (type: string) => {
    return investmentTypes.find(t => t.value === type)?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Investimentos</h1>
          <p className="text-gray-500 mt-1">Gerencie sua carteira de investimentos</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Investimento</span>
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Investido</p>
              <p className="text-3xl font-bold mt-1">R$ {totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Valor Atual</p>
              <p className="text-3xl font-bold mt-1">R$ {totalCurrentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${returnPercentage >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600'} p-6 rounded-2xl text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Rentabilidade</p>
              <p className="text-2xl font-bold mt-1">
                {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <PieChart className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Renda Mensal</p>
              <p className="text-2xl font-bold mt-1">R$ {totalMonthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de investimentos */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Sua Carteira</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {investments.length === 0 ? (
            <div className="p-12 text-center">
              <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum investimento cadastrado</h3>
              <p className="text-gray-500">Adicione seus investimentos para acompanhar sua carteira.</p>
            </div>
          ) : (
            investments.map((investment) => {
              const currentValue = investment.currentPrice || investment.purchasePrice || investment.amount;
              const purchaseValue = investment.purchasePrice || investment.amount;
              const profit = currentValue - purchaseValue;
              const profitPercentage = ((profit / purchaseValue) * 100);
              
              return (
                <div key={investment.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(investment.type)}`}>
                        <Building className="h-6 w-6 text-white" />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-800">{investment.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full text-white ${getTypeColor(investment.type)}`}>
                            {getTypeLabel(investment.type)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">{investment.broker}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">
                            Compra: {new Date(investment.purchaseDate).toLocaleDateString('pt-BR')}
                          </span>
                          {investment.interestRate && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-500">{investment.interestRate}% a.a.</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-lg text-gray-800">
                            R$ {currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className={`text-sm ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {profit >= 0 ? '+' : ''}R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({profitPercentage.toFixed(2)}%)
                          </p>
                          {investment.monthlyIncome && (
                            <p className="text-sm text-purple-600">
                              +R$ {investment.monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteInvestment(investment.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de adicionar investimento */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Novo Investimento</h2>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddInvestment({
                type: formData.get('type') as any,
                name: formData.get('name') as string,
                broker: formData.get('broker') as string,
                amount: Number(formData.get('amount')),
                purchasePrice: Number(formData.get('purchasePrice')) || undefined,
                currentPrice: Number(formData.get('currentPrice')) || undefined,
                interestRate: Number(formData.get('interestRate')) || undefined,
                monthlyIncome: Number(formData.get('monthlyIncome')) || undefined,
                purchaseDate: formData.get('purchaseDate') as string,
                maturityDate: formData.get('maturityDate') as string || undefined,
              });
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="type"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                >
                  <option value="">Tipo de Investimento</option>
                  {investmentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                
                <select
                  name="broker"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                >
                  <option value="">Corretora</option>
                  {brokers.map(broker => (
                    <option key={broker} value={broker}>
                      {broker}
                    </option>
                  ))}
                </select>
              </div>
              
              <input
                type="text"
                name="name"
                placeholder="Nome do investimento (ex: PETR4, CDB Inter)"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="amount"
                  placeholder="Valor investido (R$)"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
                
                <input
                  type="number"
                  name="purchasePrice"
                  placeholder="Preço de compra (R$) - opcional"
                  step="0.01"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="currentPrice"
                  placeholder="Preço atual (R$) - opcional"
                  step="0.01"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
                
                <input
                  type="number"
                  name="interestRate"
                  placeholder="Taxa de juros (% a.a.) - opcional"
                  step="0.01"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
              
              <input
                type="number"
                name="monthlyIncome"
                placeholder="Renda mensal (R$) - opcional"
                step="0.01"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de compra</label>
                  <input
                    type="date"
                    name="purchaseDate"
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vencimento (opcional)</label>
                  <input
                    type="date"
                    name="maturityDate"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>
              </div>
              
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