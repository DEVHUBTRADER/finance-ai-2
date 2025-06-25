import React, { useState } from 'react';
import { Plus, Shield, TrendingUp, Calendar, Building, Edit, Trash2 } from 'lucide-react';
import { Retirement as RetirementType } from '../types';

const mockRetirement: RetirementType[] = [
  {
    id: '1',
    type: 'inss',
    name: 'INSS',
    company: 'Governo Federal',
    monthlyContribution: 800,
    totalContributed: 48000,
    expectedReturn: 3500,
    startDate: '2019-01-01',
    retirementAge: 65
  },
  {
    id: '2',
    type: 'privada',
    name: 'Previdência Bradesco',
    company: 'Bradesco Seguros',
    monthlyContribution: 500,
    totalContributed: 18000,
    expectedReturn: 2800,
    startDate: '2021-06-01',
    retirementAge: 60
  }
];

const retirementTypes = [
  { value: 'inss', label: 'INSS', color: 'bg-blue-500' },
  { value: 'privada', label: 'Previdência Privada', color: 'bg-green-500' },
  { value: 'pgbl', label: 'PGBL', color: 'bg-purple-500' },
  { value: 'vgbl', label: 'VGBL', color: 'bg-orange-500' }
];

const companies = [
  'Governo Federal', 'Bradesco Seguros', 'Itaú Seguros', 'SulAmérica', 'Porto Seguro',
  'Caixa Seguros', 'Santander Seguros', 'Mongeral Aegon', 'Icatu Seguros'
];

export default function Retirement() {
  const [retirements, setRetirements] = useState<RetirementType[]>(mockRetirement);
  const [showAddModal, setShowAddModal] = useState(false);

  const totalMonthlyContribution = retirements.reduce((sum, ret) => sum + ret.monthlyContribution, 0);
  const totalContributed = retirements.reduce((sum, ret) => sum + ret.totalContributed, 0);
  const totalExpectedReturn = retirements.reduce((sum, ret) => sum + (ret.expectedReturn || 0), 0);

  const handleAddRetirement = (newRetirement: Omit<RetirementType, 'id'>) => {
    const retirement: RetirementType = {
      ...newRetirement,
      id: Date.now().toString(),
    };
    setRetirements([...retirements, retirement]);
    setShowAddModal(false);
  };

  const handleDeleteRetirement = (id: string) => {
    setRetirements(retirements.filter(ret => ret.id !== id));
  };

  const getTypeLabel = (type: string) => {
    return retirementTypes.find(t => t.value === type)?.label || type;
  };

  const getTypeColor = (type: string) => {
    return retirementTypes.find(t => t.value === type)?.color || 'bg-gray-500';
  };

  const calculateYearsContributing = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Previdência</h1>
          <p className="text-gray-500 mt-1">Planeje sua aposentadoria com segurança</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Previdência</span>
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Contribuição Mensal</p>
              <p className="text-3xl font-bold mt-1">R$ {totalMonthlyContribution.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Contribuído</p>
              <p className="text-3xl font-bold mt-1">R$ {totalContributed.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Shield className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Renda Esperada</p>
              <p className="text-3xl font-bold mt-1">R$ {totalExpectedReturn.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de previdências */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Seus Planos de Previdência</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {retirements.map((retirement) => {
            const yearsContributing = calculateYearsContributing(retirement.startDate);
            
            return (
              <div key={retirement.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(retirement.type)}`}>
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-800">{retirement.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full text-white ${getTypeColor(retirement.type)}`}>
                          {getTypeLabel(retirement.type)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">{retirement.company}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {yearsContributing} anos contribuindo
                        </span>
                        {retirement.retirementAge && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">
                              Aposentadoria aos {retirement.retirementAge} anos
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold text-lg text-gray-800">
                          R$ {retirement.monthlyContribution.toLocaleString('pt-BR')}/mês
                        </p>
                        <p className="text-sm text-gray-500">
                          Total: R$ {retirement.totalContributed.toLocaleString('pt-BR')}
                        </p>
                        {retirement.expectedReturn && (
                          <p className="text-sm text-green-600">
                            Renda: R$ {retirement.expectedReturn.toLocaleString('pt-BR')}/mês
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRetirement(retirement.id)}
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
          })}
        </div>
      </div>

      {/* Modal de adicionar previdência */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Nova Previdência</h2>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddRetirement({
                type: formData.get('type') as any,
                name: formData.get('name') as string,
                company: formData.get('company') as string,
                monthlyContribution: Number(formData.get('monthlyContribution')),
                totalContributed: Number(formData.get('totalContributed')),
                expectedReturn: Number(formData.get('expectedReturn')) || undefined,
                startDate: formData.get('startDate') as string,
                retirementAge: Number(formData.get('retirementAge')) || undefined,
              });
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="type"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="">Tipo de Previdência</option>
                  {retirementTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                
                <select
                  name="company"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="">Empresa/Seguradora</option>
                  {companies.map(company => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
              
              <input
                type="text"
                name="name"
                placeholder="Nome do plano"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="monthlyContribution"
                  placeholder="Contribuição mensal (R$)"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                
                <input
                  type="number"
                  name="totalContributed"
                  placeholder="Total já contribuído (R$)"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="expectedReturn"
                  placeholder="Renda esperada (R$/mês) - opcional"
                  step="0.01"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                
                <input
                  type="number"
                  name="retirementAge"
                  placeholder="Idade de aposentadoria - opcional"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de início</label>
                <input
                  type="date"
                  name="startDate"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
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
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
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