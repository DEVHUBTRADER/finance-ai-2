import React, { useState } from 'react';
import { Plus, Home, MapPin, DollarSign, Calendar, Edit, Trash2, TrendingUp, Paperclip, Upload } from 'lucide-react';
import { RealEstate as RealEstateType } from '../types';

const mockRealEstate: RealEstateType[] = [
  {
    id: '1',
    type: 'residencial',
    address: 'Rua das Flores, 123 - Centro',
    purchasePrice: 350000,
    currentValue: 420000,
    monthlyRent: 2500,
    expenses: 800,
    purchaseDate: '2022-03-15',
    isRented: true,
    attachments: ['Escritura.pdf', 'IPTU 2024.pdf']
  },
  {
    id: '2',
    type: 'comercial',
    address: 'Av. Principal, 456 - Comercial',
    purchasePrice: 180000,
    currentValue: 200000,
    monthlyRent: 1800,
    expenses: 400,
    purchaseDate: '2023-01-10',
    isRented: true,
    attachments: ['Contrato Locação.pdf']
  }
];

const propertyTypes = [
  { value: 'residencial', label: 'Residencial', color: 'bg-blue-500' },
  { value: 'comercial', label: 'Comercial', color: 'bg-green-500' },
  { value: 'terreno', label: 'Terreno', color: 'bg-yellow-500' },
  { value: 'fundo-imobiliario', label: 'Fundo Imobiliário', color: 'bg-purple-500' }
];

export default function RealEstate() {
  const [properties, setProperties] = useState<RealEstateType[]>(mockRealEstate);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<RealEstateType | null>(null);

  const totalInvested = properties.reduce((sum, prop) => sum + prop.purchasePrice, 0);
  const totalCurrentValue = properties.reduce((sum, prop) => sum + (prop.currentValue || prop.purchasePrice), 0);
  const totalMonthlyRent = properties.reduce((sum, prop) => sum + (prop.monthlyRent || 0), 0);
  const totalExpenses = properties.reduce((sum, prop) => sum + prop.expenses, 0);
  const netMonthlyIncome = totalMonthlyRent - totalExpenses;
  const totalReturn = totalCurrentValue - totalInvested;

  const handleAddProperty = (newProperty: Omit<RealEstateType, 'id'>) => {
    const property: RealEstateType = {
      ...newProperty,
      id: Date.now().toString(),
    };
    setProperties([...properties, property]);
    setShowAddModal(false);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(prop => prop.id !== id));
  };

  const handleAddAttachment = (propertyId: string, fileName: string) => {
    setProperties(properties.map(prop => {
      if (prop.id === propertyId) {
        return {
          ...prop,
          attachments: [...(prop.attachments || []), fileName]
        };
      }
      return prop;
    }));
  };

  const handleRemoveAttachment = (propertyId: string, fileName: string) => {
    setProperties(properties.map(prop => {
      if (prop.id === propertyId) {
        return {
          ...prop,
          attachments: (prop.attachments || []).filter(att => att !== fileName)
        };
      }
      return prop;
    }));
  };

  const getTypeLabel = (type: string) => {
    return propertyTypes.find(t => t.value === type)?.label || type;
  };

  const getTypeColor = (type: string) => {
    return propertyTypes.find(t => t.value === type)?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Imóveis</h1>
          <p className="text-gray-500 mt-1">Gerencie seu portfólio imobiliário</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Imóvel</span>
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Valor Investido</p>
              <p className="text-3xl font-bold mt-1">R$ {totalInvested.toLocaleString('pt-BR')}</p>
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
              <p className="text-3xl font-bold mt-1">R$ {totalCurrentValue.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Renda Bruta</p>
              <p className="text-3xl font-bold mt-1">R$ {totalMonthlyRent.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Home className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Renda Líquida</p>
              <p className="text-3xl font-bold mt-1">R$ {netMonthlyIncome.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de imóveis */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Seu Portfólio</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {properties.map((property) => {
            const currentValue = property.currentValue || property.purchasePrice;
            const appreciation = currentValue - property.purchasePrice;
            const appreciationPercentage = ((appreciation / property.purchasePrice) * 100);
            const netRent = (property.monthlyRent || 0) - property.expenses;
            
            return (
              <div key={property.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(property.type)}`}>
                      <Home className="h-6 w-6 text-white" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-800">{property.address}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full text-white ${getTypeColor(property.type)}`}>
                          {getTypeLabel(property.type)}
                        </span>
                        {property.isRented && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                            Alugado
                          </span>
                        )}
                        {property.attachments && property.attachments.length > 0 && (
                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setShowAttachmentsModal(true);
                            }}
                            className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-1"
                          >
                            <Paperclip className="h-3 w-3" />
                            <span>{property.attachments.length} anexos</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Compra: {new Date(property.purchaseDate).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          Valorização: {appreciationPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold text-lg text-gray-800">
                          R$ {currentValue.toLocaleString('pt-BR')}
                        </p>
                        <p className={`text-sm ${appreciation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {appreciation >= 0 ? '+' : ''}R$ {appreciation.toLocaleString('pt-BR')}
                        </p>
                        {property.monthlyRent && (
                          <p className="text-sm text-purple-600">
                            Líquido: R$ {netRent.toLocaleString('pt-BR')}/mês
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowAttachmentsModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Paperclip className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProperty(property.id)}
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

      {/* Modal de anexos */}
      {showAttachmentsModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Anexos - {selectedProperty.address}</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-3 mb-6">
                {selectedProperty.attachments?.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{attachment}</span>
                    <button
                      onClick={() => handleRemoveAttachment(selectedProperty.id, attachment)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">Nenhum anexo encontrado</p>
                )}
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const file = formData.get('file') as File;
                if (file) {
                  handleAddAttachment(selectedProperty.id, file.name);
                  e.currentTarget.reset();
                }
              }} className="space-y-4">
                <input
                  type="file"
                  name="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAttachmentsModal(false)}
                    className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de adicionar imóvel */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Novo Imóvel</h2>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddProperty({
                type: formData.get('type') as any,
                address: formData.get('address') as string,
                purchasePrice: Number(formData.get('purchasePrice')),
                currentValue: Number(formData.get('currentValue')) || undefined,
                monthlyRent: Number(formData.get('monthlyRent')) || undefined,
                expenses: Number(formData.get('expenses')),
                purchaseDate: formData.get('purchaseDate') as string,
                isRented: formData.has('isRented'),
                attachments: [],
              });
            }} className="p-6 space-y-4">
              <select
                name="type"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="">Tipo de Imóvel</option>
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              
              <input
                type="text"
                name="address"
                placeholder="Endereço completo"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="purchasePrice"
                  placeholder="Preço de compra (R$)"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                
                <input
                  type="number"
                  name="currentValue"
                  placeholder="Valor atual (R$) - opcional"
                  step="0.01"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="monthlyRent"
                  placeholder="Aluguel mensal (R$) - opcional"
                  step="0.01"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                
                <input
                  type="number"
                  name="expenses"
                  placeholder="Despesas mensais (R$)"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de compra</label>
                <input
                  type="date"
                  name="purchaseDate"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="isRented" className="rounded text-orange-600" />
                <span className="text-gray-700">Imóvel está alugado</span>
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
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
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