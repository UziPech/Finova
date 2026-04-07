export interface Loan {
  id: string;
  user_id: string;
  venture_id: string;
  name: string;
  principal: number;
  interest_rate: number;
  start_date: string;
  end_date?: string | null;
  status: 'active' | 'paid' | 'defaulted';
  notes?: string | null;
  created_at: string;
  updated_at: string;
  loan_payments?: LoanPayment[];
}

export interface LoanPayment {
  id: string;
  loan_id: string;
  user_id: string;
  amount: number;
  payment_date?: string | null;
  due_date: string;
  status: 'pending' | 'paid' | 'late';
  evidence_url?: string | null;
  created_at: string;
}

export interface CreateLoanInput {
  venture_id: string;
  name: string;
  principal: number;
  interest_rate?: number;
  start_date: string;
  end_date?: string;
  status?: string;
  notes?: string;
  generate_payments?: boolean;
  payment_count?: number;
  payment_amount?: number;
}
