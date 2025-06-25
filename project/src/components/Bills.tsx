import React, { useState } from 'react';
import { Plus, Receipt, Calendar, Building, Bell, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Bill } from '../types';

const mockBills: Bill[] = [
  {
    id: '1',
    name: 'Energia Elétrica',
    company: 'CEMIG',
    amount: 180,
    dueDay: 15,
    category: 'Utilidades',
    isRecurring: true,
    isActive: true,
    lastPaid: '2024-01-15',
    nextDue: '2024-02-15'
  },
  {
    id: '2',
    name: 'Internet',
    company: 'Vivo Fibra',
    amount: 120,
    dueDay: 10,
    category: 'Telecomunicações',
    isRecurring: true,
    isActive: true,
    lastPaid: '2024-01-10',
    nextDue: '2024-02-10'
  },
  {
    id: '3',
    name: 'Cartão de Crédito',
    company: 'Nubank',
    amount: 850,
    dueDay: 20,
    category: 'Cartão',
    isRecurring: true,
    isActive: true,
    nextDue: '2024-02-20'
  }
];

const categories = [
  'Utilidades', 'Telecomunicações', 'Cartão', 'Financiamento', 'Seguro',
  'Assinatura', 'Educação', 'Saúde', 'Transporte', 'Outros'
];

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [showAddModal, setShowAddModal] = useState(false);

  const totalMonthlyBills = bills
    .filter(bill => bill.isActive && bill.isRecurring)
    .reduce((sum, bill) => sum + bill.amount, 0);

  const upcomingBills = bills
    .filter(bill => bill.isActive)
    .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())
    .slice(0, 5);

  const overdueBills = bills.filter(bill => {
    const dueDate = new Date(bill.nextDue);
    const today = new Date();
    return bill.isActive && dueDate < today;
  });

  const handleAddBill = (newBill: Omit<Bill, 'id' | 'nextDue'>) => {
    const today = new Date();
    const nextDue = new Date(today.getFullYear(), today.getMonth(), newBill.dueDay);
    if (nextDue <= today) {
      nextDue.setMonth(nextDue.getMonth() + 1);
    }

    const bill: Bill = {
      ...newBill,
      id: Date.now().toString(),
      nextDue: nextDue.toISOString().split('T')[0],
    };
    setBills([...bills, bill]);
    setShowAddModal(false);
  };

  const handleDeleteBill = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const markAsPaid = (billId: string) => {
    setBills(bills.map(bill => {
      if (bill.id === billId) {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, bill.dueDay);
        return {
          ...bill,
          lastPaid: today.toISOString().split('T')[0],
          nextDue: nextMonth.toISOString().split('T')[0]
        };
      }
      return bill;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Contas a Pagar</h1>
          <p className="text-gray-500 mt-1">Gerencie suas contas e nunca mais esqueça um pagamento</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Conta</span>
        </button>
      </div>

      {/* Alertas */}
      {overdueBills.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-800">Contas em Atraso</h2>
          </div>
          <div className="space-y-2">
            {overdueBills.map(bill => (
              <div key={bill.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                <div>
                  <span className="font-medium text-gray-800">{bill.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    Venceu em {new Date(bill.nextDue).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-red-600">
                    R$ {bill.amount.toLocaleString('pt-BR')}
                  </span>
                  <button
                    onClick={() => markAsPaid(bill.id)}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    Marcar como Pago
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Mensal</p>
              <p className="text-3xl font-bold mt-1">R$ {totalMonthlyBills.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Receipt className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Contas Ativas</p>
              <p className="text-3xl font-bold mt-1">{bills.filter(b => b.isActive).length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Building className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Próximas</p>
              <p className="text-3xl font-bold mt-1">{upcomingBills.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Bell className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Próximas contas */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Próximas Contas</h2>
        <div className="space-y-4">
          {upcomingBills.map((bill) => {
            const daysUntilDue = getDaysUntilDue(bill.nextDue);
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
            
            return (
              <div key={bill.id} className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isOverdue ? 'border-red-200 bg-red-50' :
                isDueSoon ? 'border-yellow-200 bg-yellow-50' :
                'border-gray-100 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isOverdue ? 'bg-red-500' :
                      isDueSoon ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}>
                      <Receipt className="h-5 w-5 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800">{bill.name}</h3>
                      <p className="text-sm text-gray-500">{bill.company} • {bill.category}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-800">
                      R$ {bill.amount.toLocaleString('pt-BR')}
                    </p>
                    <p className={`text-sm ${
                      isOverdue ? 'text-red-600' :
                      isDueSoon ? 'text-yellow-600' :
                      'text-gray-500'
                    }`}>
                      {isOverdue ? `${Math.abs(daysUntilDue)} dias em atraso` :
                       isDueSoon ? `Vence em ${daysUntilDue} dias` :
                       `Vence em ${daysUntilDue} dias`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista completa de contas */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Todas as Contas</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {bills.map((bill) => (
            <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    bill.isActive ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    <Receipt className="h-6 w-6 text-white" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-800">{bill.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {bill.category}
                      </span>
                      {!bill.isActive && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          Inativa
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">{bill.company}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        Vence dia {bill.dueDay}
                      </span>
                      {bill.lastPaid && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">
                            Último pagamento: {new Date(bill.lastPaid).toLocaleDateString('pt-BR')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-800">
                      R$ {bill.amount.toLocaleString('pt-BR')}
                    </p>
                    {bill.isActive && (
                      <p className="text-sm text-gray-500">
                        Próximo: {new Date(bill.nextDue).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {bill.isActive && (
                      <button
                        onClick={() => markAsPaid(bill.id)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors duration-200"
                      >
                        Pagar
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBill(bill.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de adicionar conta */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Nova Conta</h2>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddBill({
                name: formData.get('name') as string,
                company: formData.get('company') as string,
                amount: Number(formData.get('amount')),
                dueDay: Number(formData.get('dueDay')),
                category: formData.get('category') as string,
                isRecurring: formData.has('isRecurring'),
                isActive: true,
                lastPaid: undefined,
              });
            }} className="p-6 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nome da conta (ex: Energia Elétrica)"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              
              <input
                type="text"
                name="company"
                placeholder="Empresa (ex: CEMIG)"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="amount"
                  placeholder="Valor (R$)"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                
                <input
                  type="number"
                  name="dueDay"
                  placeholder="Dia do vencimento"
                  min="1"
                  max="31"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              
              <select
                name="category"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="isRecurring" className="rounded text-blue-600" defaultChecked />
                <span className="text-gray-700">Conta recorrente (mensal)</span>
              </label>
              
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