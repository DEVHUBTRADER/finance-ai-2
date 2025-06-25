import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';

interface WealthData {
  month: string;
  patrimonio: number;
  inflacao: number;
  cdi: number;
  patrimonioReal: number; // Patrimônio ajustado pela inflação
}

// Dados simulados de evolução patrimonial (em uma aplicação real, viriam do backend)
const generateWealthData = (): WealthData[] => {
  const months = [
    'Jan 2023', 'Fev 2023', 'Mar 2023', 'Abr 2023', 'Mai 2023', 'Jun 2023',
    'Jul 2023', 'Ago 2023', 'Set 2023', 'Out 2023', 'Nov 2023', 'Dez 2023',
    'Jan 2024'
  ];

  // Taxas históricas aproximadas (CDI e inflação)
  const cdiRates = [13.75, 13.75, 13.75, 13.75, 13.75, 13.75, 13.75, 13.25, 12.75, 12.25, 11.75, 11.25, 10.75];
  const inflationRates = [5.77, 5.60, 4.65, 4.18, 3.94, 3.16, 3.99, 4.24, 5.19, 4.82, 4.68, 4.62, 4.50];

  let baseWealth = 500000; // Patrimônio inicial
  
  return months.map((month, index) => {
    // Simula crescimento patrimonial baseado em investimentos e poupança
    const monthlyGrowth = (baseWealth * (cdiRates[index] / 100 / 12)) + 2000; // CDI + aportes mensais
    baseWealth += monthlyGrowth;
    
    // Calcula patrimônio real (descontando inflação acumulada)
    const inflationAdjustment = index === 0 ? 1 : (1 - (inflationRates[index] / 100 / 12));
    const realWealth = baseWealth * Math.pow(inflationAdjustment, index + 1);

    return {
      month,
      patrimonio: Math.round(baseWealth),
      inflacao: inflationRates[index],
      cdi: cdiRates[index],
      patrimonioReal: Math.round(realWealth)
    };
  });
};

export default function WealthEvolutionChart() {
  const [data, setData] = useState<WealthData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'6m' | '1y' | '2y'>('1y');

  useEffect(() => {
    const wealthData = generateWealthData();
    
    // Filtra dados baseado no período selecionado
    let filteredData = wealthData;
    if (selectedPeriod === '6m') {
      filteredData = wealthData.slice(-6);
    } else if (selectedPeriod === '1y') {
      filteredData = wealthData.slice(-12);
    }
    
    setData(filteredData);
  }, [selectedPeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const currentWealth = data[data.length - 1]?.patrimonio || 0;
  const previousWealth = data[data.length - 2]?.patrimonio || 0;
  const wealthGrowth = currentWealth - previousWealth;
  const wealthGrowthPercentage = previousWealth > 0 ? ((wealthGrowth / previousWealth) * 100) : 0;

  const currentRealWealth = data[data.length - 1]?.patrimonioReal || 0;
  const previousRealWealth = data[data.length - 2]?.patrimonioReal || 0;
  const realWealthGrowth = currentRealWealth - previousRealWealth;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Evolução Patrimonial</h2>
          <p className="text-gray-500 mt-1">Acompanhe o crescimento do seu patrimônio vs inflação e CDI</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="6m">Últimos 6 meses</option>
            <option value="1y">Último ano</option>
            <option value="2y">Últimos 2 anos</option>
          </select>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Patrimônio Atual</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(currentWealth)}</p>
              <p className={`text-sm mt-1 ${wealthGrowth >= 0 ? 'text-green-100' : 'text-red-200'}`}>
                {wealthGrowth >= 0 ? '+' : ''}{formatCurrency(wealthGrowth)} ({wealthGrowthPercentage.toFixed(2)}%)
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Patrimônio Real</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(currentRealWealth)}</p>
              <p className="text-sm text-blue-100 mt-1">Ajustado pela inflação</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Proteção Inflação</p>
              <p className="text-2xl font-bold mt-1">
                {realWealthGrowth >= 0 ? '+' : ''}{formatCurrency(realWealthGrowth)}
              </p>
              <p className="text-sm text-purple-100 mt-1">Ganho real no período</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Evolução Patrimonial vs Indicadores</h3>
          <p className="text-gray-500 text-sm">Compare o crescimento do seu patrimônio com a inflação e CDI</p>
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                yAxisId="wealth"
                orientation="left"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                yAxisId="rate"
                orientation="right"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'patrimonio' || name === 'patrimonioReal') {
                    return [formatCurrency(value), name === 'patrimonio' ? 'Patrimônio' : 'Patrimônio Real'];
                  }
                  return [formatPercentage(value), name === 'inflacao' ? 'Inflação' : 'CDI'];
                }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              
              {/* Linhas do patrimônio */}
              <Line
                yAxisId="wealth"
                type="monotone"
                dataKey="patrimonio"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                name="Patrimônio"
              />
              <Line
                yAxisId="wealth"
                type="monotone"
                dataKey="patrimonioReal"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                name="Patrimônio Real"
              />
              
              {/* Linhas dos indicadores */}
              <Line
                yAxisId="rate"
                type="monotone"
                dataKey="cdi"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                name="CDI"
              />
              <Line
                yAxisId="rate"
                type="monotone"
                dataKey="inflacao"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                name="Inflação"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Análise */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Análise de Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Proteção contra Inflação</h4>
            <p className="text-sm text-gray-600">
              {realWealthGrowth >= 0 
                ? `Seu patrimônio está crescendo acima da inflação, mantendo seu poder de compra.`
                : `Atenção: Seu patrimônio está perdendo poder de compra devido à inflação.`
              }
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Performance vs CDI</h4>
            <p className="text-sm text-gray-600">
              Compare o crescimento do seu patrimônio com a taxa CDI para avaliar se seus investimentos estão performando adequadamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}