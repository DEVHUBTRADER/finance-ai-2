import React, { useState } from 'react';
import { Plus, CreditCard, AlertTriangle, Calendar, Building, Edit, Trash2, Calculator } from 'lucide-react';
import { Loan } from '../types';

const mockLoans: Loan[] = [
  {
    id: '1',
    type: 'pessoal',
    bank: 'Banco do Brasil',
    amount: 15000,
    remainingAmount: 8500,
    interestRate: 2.5,
    monthlyPayment: 650,
    dueDate: '2024-02-15',
    startDate: '2023-01-15',
    endDate: '2025-01-15'
  },
  {
    id: '2',
    type: 'cartao',
    bank: 'Nubank',
    amount: 3500,
    remainingAmount: 3500,
    interestRate: 12.5,
    monthlyPayment: 350,
    dueDate: '2024-02-10',
    startDate: '2024-01-10',
    endDate: '2024-12-10'
  }
];

const loanTypes = [
  { value: 'pessoal', label: 'Empréstimo Pessoal', color: 'bg-blue-500' },
  { value: 'consignado', label: 'Consignado', color: 'bg-green-500' },
  { value: 'cartao', label: 'Cartão de Crédito', color: 'bg-red-500' },
  { value: 'financiamento', label: 'Financiamento', color: 'bg-purple-500' },
  { value: 'cheque-especial', label: 'Cheque Especial', color: 'bg-orange-500' }
];

const banks = [
  'Banco do Brasil', 'Caixa Econômica', 'Itaú', 'Bradesco', 'Santander',
  'Nubank', 'Inter', 'C6 Bank', 'BTG Pactual', 'Sicoob'
];

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [showAddModal, setShowAddModal] = useState(false);

  const totalDebt = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const totalMonthlyPayment = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  const averageInterestRate = loans.length > 0 
    ? loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length 
    : 0;

  const handleAddLoan = (newLoan: Omit<Loan, 'id'>) => {
    const loan: Loan = {
      ...newLoan,
      id: Date.now().toString(),
    };
    setLoans([...loans, loan]);
    setShowAddModal(false);
  };

  const handleDeleteLoan = (id: string) => {
    setLoans(loans.filter(loan => loan.id !== id));
  };

  const getTypeLabel = (type: string) => {
    return loanTypes.find(t => t.value === type)?.label || type;
  };

  const getTypeColor = (type: string) => {
    return loanTypes.find(t => t.value === type)?.color || 'bg-gray-500';
  };

  const calculateRemainingMonths = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diffMonths);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Empréstimos e Dívidas</h1>
          <p className="text-gray-500 mt-1">Controle suas dívidas e planeje quitações</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Dívida</span>
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Dívida Total</p>
              <p className="text-3xl font-bold mt-1">R$ {totalDebt.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pagamento Mensal</p>
              <p className="text-3xl font-bold mt-1">R$ {totalMonthlyPayment.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Taxa Média</p>
              <p className="text-3xl font-bold mt-1">{averageInterestRate.toFixed(1)}%</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Calculator className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de empréstimos */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Suas Dívidas</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {loans.map((loan) => {
            const remainingMonths = calculateRemainingMonths(loan.endDate);
            const daysUntilDue = getDaysUntilDue(loan.dueDate);
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 5 && daysUntilDue >= 0;
            
            return (
              <div key={loan.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(loan.type)}`}>
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-800">{loan.bank}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full text-white ${getTypeColor(loan.type)}`}>
                          {getTypeLabel(loan.type)}
                        </span>
                        {isOverdue && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                            Vencido
                          </span>
                        )}
                        {isDueSoon && (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                            Vence em {daysUntilDue} dias
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">
                          Taxa: {loan.interestRate}% a.m.
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {remainingMonths} meses restantes
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          Próximo vencimento: {new Date(loan.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold text-lg text-red-600">
                          R$ {loan.remainingAmount.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-500">
                          de R$ {loan.amount.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-sm text-orange-600">
                          R$ {loan.monthlyPayment.toLocaleString('pt-BR')}/mês
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteLoan(loan.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Barra de progresso */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progresso de pagamento</span>
                    <span>{((loan.amount - loan.remainingAmount) / loan.amount * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((loan.amount - loan.remainingAmount) / loan.amount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de adicionar empréstimo */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Nova Dívida</h2>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddLoan({
                type: formData.get('type') as any,
                bank: formData.get('bank') as string,
                amount: Number(formData.get('amount')),
                remainingAmount: Number(formData.get('remainingAmount')),
                interestRate: Number(formData.get('interestRate')),
                monthlyPayment: Number(formData.get('monthlyPayment')),
                dueDate: formData.get('dueDate') as string,
                startDate: formData.get('startDate') as string,
                endDate: formData.get('endDate') as string,
              });
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="type"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                >
                  <option value="">Tipo de Dívida</option>
                  {loanTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                
                <select
                  name="bank"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                >
                  <option value="">Banco/Instituição</option>
                  {banks.map(bank => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="amount"
                  placeholder="Valor total (R$)"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
                
                <input
                  type="number"
                  name="remainingAmount"
                  placeholder="Valor restante (R$)"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="interestRate"
                  placeholder="Taxa de juros (% a.m.)"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
                
                <input
                  type="number"
                  name="monthlyPayment"
                  placeholder="Pagamento mensal (R$)"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de início</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Próximo vencimento</label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data final</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
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
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
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