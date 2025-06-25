import { useState, useEffect } from 'react';
import { Transaction, Investment, RealEstate as RealEstateType, Retirement, Loan, Bill } from '../types';

interface FinancialData {
  transactions: Transaction[];
  investments: Investment[];
  realEstate: RealEstateType[];
  retirement: Retirement[];
  loans: Loan[];
  bills: Bill[];
  income: any[];
}

interface CalculatedMetrics {
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  netMonthlyIncome: number;
  totalInvestmentValue: number;
  totalInvestmentIncome: number;
  totalRealEstateValue: number;
  totalRealEstateIncome: number;
  totalRetirementSaved: number;
  totalRetirementContribution: number;
  totalDebt: number;
  totalLoanPayments: number;
  totalBills: number;
  totalAssets: number;
  netWorth: number;
}

export function useFinancialData(): CalculatedMetrics {
  const [data, setData] = useState<FinancialData>({
    transactions: [],
    investments: [],
    realEstate: [],
    retirement: [],
    loans: [],
    bills: [],
    income: []
  });

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const investments = JSON.parse(localStorage.getItem('investments') || '[]');
        const realEstate = JSON.parse(localStorage.getItem('realEstate') || '[]');
        const retirement = JSON.parse(localStorage.getItem('retirement') || '[]');
        const loans = JSON.parse(localStorage.getItem('loans') || '[]');
        const bills = JSON.parse(localStorage.getItem('bills') || '[]');
        const income = JSON.parse(localStorage.getItem('income') || '[]');

        setData({
          transactions,
          investments,
          realEstate,
          retirement,
          loans,
          bills,
          income
        });
      } catch (error) {
        console.error('Error loading financial data:', error);
      }
    };

    loadData();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    window.addEventListener('financialDataUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('financialDataUpdate', handleStorageChange);
    };
  }, []);

  // Calculate metrics
  const calculations: CalculatedMetrics = {
    // Income calculations
    totalMonthlyIncome: data.income.reduce((sum, income) => {
      switch (income.frequency) {
        case 'monthly': return sum + income.amount;
        case 'weekly': return sum + (income.amount * 4.33);
        case 'yearly': return sum + (income.amount / 12);
        default: return sum;
      }
    }, 0),

    // Expense calculations from transactions
    totalMonthlyExpenses: data.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => {
        if (t.isRecurring) {
          return sum + t.amount;
        }
        // For non-recurring, estimate monthly based on current month
        const transactionDate = new Date(t.date);
        const currentDate = new Date();
        if (transactionDate.getMonth() === currentDate.getMonth() && 
            transactionDate.getFullYear() === currentDate.getFullYear()) {
          return sum + t.amount;
        }
        return sum;
      }, 0),

    // Investment calculations
    totalInvestmentValue: data.investments.reduce((sum, inv) => {
      return sum + (inv.currentPrice || inv.purchasePrice || inv.amount);
    }, 0),

    totalInvestmentIncome: data.investments.reduce((sum, inv) => {
      return sum + (inv.monthlyIncome || 0);
    }, 0),

    // Real Estate calculations
    totalRealEstateValue: data.realEstate.reduce((sum, prop) => {
      return sum + (prop.currentValue || prop.purchasePrice);
    }, 0),

    totalRealEstateIncome: data.realEstate.reduce((sum, prop) => {
      return sum + ((prop.monthlyRent || 0) - prop.expenses);
    }, 0),

    // Retirement calculations
    totalRetirementSaved: data.retirement.reduce((sum, ret) => {
      return sum + ret.totalContributed;
    }, 0),

    totalRetirementContribution: data.retirement.reduce((sum, ret) => {
      return sum + ret.monthlyContribution;
    }, 0),

    // Loan calculations
    totalDebt: data.loans.reduce((sum, loan) => {
      return sum + loan.remainingAmount;
    }, 0),

    totalLoanPayments: data.loans.reduce((sum, loan) => {
      return sum + loan.monthlyPayment;
    }, 0),

    // Bills calculations
    totalBills: data.bills
      .filter(bill => bill.isActive)
      .reduce((sum, bill) => sum + bill.amount, 0),

    // Derived calculations
    get netMonthlyIncome() {
      return this.totalMonthlyIncome + this.totalInvestmentIncome + this.totalRealEstateIncome - 
             this.totalMonthlyExpenses - this.totalLoanPayments - this.totalBills - this.totalRetirementContribution;
    },

    get totalAssets() {
      return this.totalInvestmentValue + this.totalRealEstateValue + this.totalRetirementSaved;
    },

    get netWorth() {
      return this.totalAssets - this.totalDebt;
    }
  };

  return calculations;
}