import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Upload, Receipt, Trash2, Edit } from 'lucide-react';
import { categories } from '../data/mockData';
import { Transaction } from '../types';
import { saveToStorage, loadFromStorage } from '../utils/storage';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = loadFromStorage('transactions', []);
    setTransactions(savedTransactions);
  }, []);

  const filteredTransactions = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    saveToStorage('transactions', updatedTransactions);
    setShowAddModal(false);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    saveToStorage('transactions', updatedTransactions);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Transações</h1>
          <p className="text-gray-500 mt-1">Gerencie suas receitas e despesas</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200">
            <Upload className="h-4 w-4" />
            <span>Upload Nota</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Transação</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="all">Todas</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de transações */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma transação encontrada</h3>
              <p className="text-gray-500">Adicione sua primeira transação para começar a acompanhar suas finanças.</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const category = categories.find(c => c.name === transaction.category);
              
              return (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: category?.color + '20' }}
                      >
                        <Receipt className="h-6 w-6" style={{ color: category?.color }} />
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-800">{transaction.description}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">{transaction.category}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </span>
                          {transaction.isRecurring && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Recorrente
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`font-semibold text-lg ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de adicionar transação */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Nova Transação</h2>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddTransaction({
                type: formData.get('type') as 'income' | 'expense',
                amount: Number(formData.get('amount')),
                category: formData.get('category') as string,
                description: formData.get('description') as string,
                date: formData.get('date') as string,
                isRecurring: formData.has('recurring'),
              });
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="type" value="income" className="text-green-600" required />
                  <span className="text-green-600 font-medium">Receita</span>
                </label>
                <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="type" value="expense" className="text-red-600" required />
                  <span className="text-red-600 font-medium">Despesa</span>
                </label>
              </div>
              
              <div className="space-y-4">
                <input
                  type="number"
                  name="amount"
                  placeholder="Valor (R$)"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                
                <select
                  name="category"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <input
                  type="text"
                  name="description"
                  placeholder="Descrição"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="recurring" className="rounded text-blue-600" />
                  <span className="text-gray-700">Transação recorrente</span>
                </label>
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
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
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