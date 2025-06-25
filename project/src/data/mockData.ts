import { Transaction, Category, Budget, AIInsight } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Alimentação', icon: 'UtensilsCrossed', color: '#FF6B6B', type: 'expense' },
  { id: '2', name: 'Transporte', icon: 'Car', color: '#4ECDC4', type: 'expense' },
  { id: '3', name: 'Moradia', icon: 'Home', color: '#45B7D1', type: 'expense' },
  { id: '4', name: 'Entretenimento', icon: 'Gamepad2', color: '#96CEB4', type: 'expense' },
  { id: '5', name: 'Saúde', icon: 'Heart', color: '#FFEAA7', type: 'expense' },
  { id: '6', name: 'Educação', icon: 'BookOpen', color: '#DDA0DD', type: 'expense' },
  { id: '7', name: 'Salário', icon: 'Briefcase', color: '#55A3FF', type: 'income' },
  { id: '8', name: 'Freelance', icon: 'Laptop', color: '#26D0CE', type: 'income' },
  { id: '9', name: 'Investimentos', icon: 'TrendingUp', color: '#FD79A8', type: 'income' },
];

export const transactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    category: 'Salário',
    description: 'Salário mensal',
    date: '2024-01-01',
    isRecurring: true,
  },
  {
    id: '2',
    type: 'expense',
    amount: 150,
    category: 'Alimentação',
    description: 'Supermercado',
    date: '2024-01-02',
  },
  {
    id: '3',
    type: 'expense',
    amount: 80,
    category: 'Transporte',
    description: 'Combustível',
    date: '2024-01-03',
  },
  {
    id: '4',
    type: 'income',
    amount: 800,
    category: 'Freelance',
    description: 'Projeto web',
    date: '2024-01-04',
  },
];

export const budgets: Budget[] = [
  { id: '1', category: 'Alimentação', limit: 800, spent: 650, period: 'monthly' },
  { id: '2', category: 'Transporte', limit: 400, spent: 320, period: 'monthly' },
  { id: '3', category: 'Entretenimento', limit: 300, spent: 180, period: 'monthly' },
];

export const aiInsights: AIInsight[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Gastos com alimentação acima da média',
    description: 'Seus gastos com alimentação aumentaram 23% este mês comparado ao anterior.',
    impact: 'medium',
    date: '2024-01-15',
  },
  {
    id: '2',
    type: 'suggestion',
    title: 'Oportunidade de economia',
    description: 'Considere usar transporte público 2x por semana para economizar R$ 120/mês.',
    impact: 'high',
    date: '2024-01-14',
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Meta de economia atingida!',
    description: 'Parabéns! Você economizou R$ 500 este mês, superando sua meta em 25%.',
    impact: 'high',
    date: '2024-01-13',
  },
];