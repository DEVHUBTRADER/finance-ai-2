export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt?: string;
  isRecurring?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'achievement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  date: string;
}

export interface Investment {
  id: string;
  type: 'renda-fixa' | 'acoes' | 'fundos-imobiliarios' | 'private-equity' | 'titulos-credito';
  name: string;
  broker: string;
  amount: number;
  purchasePrice?: number;
  currentPrice?: number;
  interestRate?: number;
  monthlyIncome?: number;
  purchaseDate: string;
  maturityDate?: string;
}

export interface Retirement {
  id: string;
  type: 'inss' | 'privada' | 'pgbl' | 'vgbl';
  name: string;
  company: string;
  monthlyContribution: number;
  totalContributed: number;
  expectedReturn?: number;
  startDate: string;
  retirementAge?: number;
}

export interface RealEstate {
  id: string;
  type: 'residencial' | 'comercial' | 'terreno' | 'fundo-imobiliario';
  address: string;
  purchasePrice: number;
  currentValue?: number;
  monthlyRent?: number;
  expenses: number;
  purchaseDate: string;
  isRented: boolean;
  attachments?: string[];
}

export interface Loan {
  id: string;
  type: 'pessoal' | 'consignado' | 'cartao' | 'financiamento' | 'cheque-especial';
  bank: string;
  amount: number;
  remainingAmount: number;
  interestRate: number;
  monthlyPayment: number;
  dueDate: string;
  startDate: string;
  endDate: string;
}

export interface Bill {
  id: string;
  name: string;
  company: string;
  amount: number;
  dueDay: number;
  category: string;
  isRecurring: boolean;
  isActive: boolean;
  lastPaid?: string;
  nextDue: string;
}

export interface Alert {
  id: string;
  type: 'bill' | 'loan' | 'investment' | 'budget';
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  folder: string;
  url?: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  documentCount: number;
}