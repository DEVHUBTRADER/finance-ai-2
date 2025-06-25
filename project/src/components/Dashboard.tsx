import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Brain,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Home,
  Building,
  Shield,
  CreditCard
} from 'lucide-react';
import { useFinancialData } from '../hooks/useFinancialData';
import { aiInsights } from '../data/mockData';
import WealthEvolutionChart from './WealthEvolutionChart';

export default function Dashboard() {
  const {
    totalMonthlyIncome,
    totalMonthlyExpenses,
    netMonthlyIncome,
    totalInvestmentValue,
    totalInvestmentIncome,
    totalRealEstateValue,
    totalRealEstateIncome,
    totalRetirementSaved,
    totalRetirementContribution,
    totalDebt,
    totalLoanPayments,
    totalBills,
    totalAssets,
    netWorth
  } = useFinancialData();

  // Calculate total monthly expenses including all categories
  const totalMonthlyExpensesComplete = totalMonthlyExpenses + totalLoanPayments + totalBills + totalRetirementContribution;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'achievement': return CheckCircle;
      case 'suggestion': return Lightbulb;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-orange-500 bg-orange-50';
      case 'achievement': return 'text-green-500 bg-green-50';
      case 'suggestion': return 'text-blue-500 bg-blue-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Visão geral das suas finanças</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Patrimônio Líquido</p>
          <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {netWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Renda Mensal</p>
              <p className="text-2xl font-bold mt-1">R$ {(totalMonthlyIncome + totalInvestmentIncome + totalRealEstateIncome).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Gastos Mensais</p>
              <p className="text-2xl font-bold mt-1">R$ {totalMonthlyExpensesComplete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${netMonthlyIncome >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Saldo Mensal</p>
              <p className="text-2xl font-bold mt-1">R$ {netMonthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Ativos</p>
              <p className="text-2xl font-bold mt-1">R$ {totalAssets.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Target className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Resumo por categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Investimentos</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">R$ {totalInvestmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-sm text-green-600 mt-1">+R$ {totalInvestmentIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Imóveis</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">R$ {totalRealEstateValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-sm text-green-600 mt-1">+R$ {totalRealEstateIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <Home className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Previdência</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">R$ {totalRetirementSaved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-sm text-blue-600 mt-1">R$ {totalRetirementContribution.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Dívidas</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-sm text-red-600 mt-1">R$ {totalLoanPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolução Patrimonial */}
      <WealthEvolutionChart />

      {/* Insights da IA */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-xl">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Insights da IA</h2>
        </div>
        
        <div className="space-y-4">
          {aiInsights.slice(0, 3).map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const colorClass = getInsightColor(insight.type);
            
            return (
              <div key={insight.id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{insight.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{insight.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                      insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Impacto {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Médio' : 'Baixo'}
                    </span>
                    <span className="text-xs text-gray-500">{insight.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}