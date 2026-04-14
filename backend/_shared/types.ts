// backend/_shared/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// Fuente de verdad central de tipos del dominio Finova.
// El frontend NO define tipos de dominio — solo re-exporta desde aquí.
// ─────────────────────────────────────────────────────────────────────────────

// ── Ventures ─────────────────────────────────────────────────────────────────

export type VentureType = 'software' | 'physical' | 'investment' | 'mixed'
export type VentureStatus = 'active' | 'paused' | 'closed' | 'idea'
export type VentureHealth = 'positive' | 'neutral' | 'negative'

/**
 * business: muestra ROI, inversión, retorno (lógica de negocio)
 * personal: muestra presupuesto, gasto, salud financiera
 */
export type VentureMode = 'business' | 'personal'

export interface Venture {
  id: string
  user_id: string
  name: string
  type: VentureType
  status: VentureStatus
  /** Determina etiquetas y métricas en la UI */
  mode: VentureMode
  invested: number
  returned: number
  currency: string
  start_date: string
  end_date?: string
  notes?: string
  /** Migration 007 — contexto asociado */
  context_id?: string | null
  created_at: string
  updated_at: string
}

export interface CreateVentureInput {
  name: string
  type: VentureType
  status?: VentureStatus
  mode?: VentureMode
  invested?: number
  returned?: number
  currency?: string
  start_date?: string
  end_date?: string
  notes?: string
}

export interface UpdateVentureInput extends Partial<CreateVentureInput> {
  id: string
}

// ── Transactions ──────────────────────────────────────────────────────────────

export type TransactionType = 'income' | 'expense'

/**
 * Tipo contable de la categoría:
 * - expense: gasto operativo (afecta flujo de caja)
 * - capital: inversión de capital (activo, afecta análisis de ROI)
 * - income: ingreso
 */
export type AccountingType = 'income' | 'expense' | 'capital'

export interface TransactionCategory {
  id: string
  user_id: string | null            // null = categoría del sistema
  name: string
  accounting_type: AccountingType
  icon?: string                      // admite emojis
  color?: string
  is_system: boolean
  /** Migration 007 — contextos donde aplica esta categoría */
  context_slugs: string[]
  /** 'global' = todos los ventures, 'venture_specific' = solo asignados */
  scope: 'global' | 'venture_specific'
  /** Dirección de la transacción donde aplica */
  transaction_direction: 'income' | 'expense' | 'both'
  created_at: string
}

export interface CreateCategoryInput {
  name: string
  accounting_type: AccountingType
  icon?: string
  color?: string
}

export interface Transaction {
  id: string
  venture_id: string
  user_id: string
  type: TransactionType
  amount: number
  description?: string
  date: string
  evidence_url?: string
  category_id?: string | null
  category?: TransactionCategory     // join opcional
  created_at: string
}

export interface CreateTransactionInput {
  venture_id: string
  type: TransactionType
  amount: number
  description?: string
  date: string
  evidence_url?: string
  category_id?: string | null
}

/** Respuesta paginada del endpoint GET /transactions */
export interface PaginatedTransactions {
  data: Transaction[]
  total: number
  page: number
  page_size: number
}

// ── Household (Fase 2 — tipos preparados, sin UI en MVP) ─────────────────────

export interface HouseholdExpense {
  id: string
  created_by: string
  amount: number
  category?: string
  description?: string
  split_ratio: number
  date: string
  created_at: string
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  created_at: string
}

// ── User Integrations (Multi-tenant) ─────────────────────────────────────────

export type IntegrationProvider = 'whatsapp'

export interface WhatsAppConfig {
  phone_number_id: string
  verify_token: string
  default_venture_id?: string
}

export interface UserIntegration {
  id: string
  user_id: string
  provider: IntegrationProvider
  config: WhatsAppConfig
  encrypted_token: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SaveWhatsAppIntegrationInput {
  phone_number_id: string
  access_token: string
  verify_token: string
  default_venture_id?: string
}

// ── WhatsApp Keywords ────────────────────────────────────────────────────────

export interface WhatsAppKeyword {
  id: string
  user_id: string
  keyword: string
  maps_to: TransactionType
  created_at: string
}

export interface CreateKeywordInput {
  keyword: string
  maps_to: TransactionType
}

// ── Venture Contexts (Migration 007) ─────────────────────────────────────────

export interface VentureContext {
  id: string
  user_id: string | null       // null = contexto del sistema
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  is_system: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CreateVentureContextInput {
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
}

// ── Venture Category Assignments (Migration 007) ─────────────────────────────

export interface VentureCategoryAssignment {
  venture_id: string
  category_id: string
  created_at: string
}

// ── Loans (Módulo de Préstamos — Migration 006 + 008) ────────────────────────

export type LoanStatus = 'active' | 'paid' | 'overdue'
export type LoanPaymentStatus = 'pending' | 'paid' | 'overdue'
export type LoanType = 'credit_card' | 'personal' | 'mortgage' | 'auto' | 'business' | 'family'
export type AmortizationType = 'french' | 'revolving' | 'bullet' | 'custom'
export type PaymentFrequency = 'weekly' | 'biweekly' | 'monthly'

export interface LoanInstitution {
  id: string
  name: string
  short_name?: string
  loan_type: LoanType
  apr_min?: number
  apr_max?: number
  cat_approx?: number
  is_active: boolean
  notes?: string
  created_at: string
}

export interface Loan {
  id: string
  user_id: string
  venture_id?: string | null
  name: string
  lender?: string
  principal: number
  interest_rate: number
  start_date: string
  end_date?: string
  status: LoanStatus
  notes?: string
  // Migration 008 — campos extendidos
  loan_type: LoanType
  institution_id?: string | null
  amortization_type: AmortizationType
  payment_frequency: PaymentFrequency
  minimum_payment_pct?: number | null
  current_balance?: number | null
  credit_limit?: number | null
  // Relations
  loan_payments?: LoanPayment[]
  institution?: LoanInstitution | null
  created_at: string
  updated_at: string
}

export interface LoanPayment {
  id: string
  loan_id: string
  user_id: string
  amount: number
  due_date: string
  paid_date?: string | null
  status: LoanPaymentStatus
  notes?: string
  // Migration 008 — desglose de amortización
  principal_portion: number
  interest_portion: number
  balance_after?: number | null
  created_at: string
}

export interface AmortizationRow {
  period: number
  due_date: string
  payment_amount: number
  principal_part: number
  interest_part: number
  balance_after: number
}

export interface AmortizationSummary {
  monthly_payment: number
  total_to_pay: number
  total_interest: number
  total_periods: number
}

export interface CreateLoanInput {
  venture_id?: string
  name: string
  lender?: string
  principal: number
  interest_rate?: number
  start_date: string
  end_date?: string
  notes?: string
  // Migration 008 — campos nuevos
  loan_type?: LoanType
  institution_id?: string
  amortization_type?: AmortizationType
  payment_frequency?: PaymentFrequency
  minimum_payment_pct?: number
  current_balance?: number
  credit_limit?: number
  /** Número de períodos para amortización automática */
  periods?: number
  /** Legacy: pagos manuales */
  payments?: Array<{ amount: number; due_date: string }>
}

// ── Analytics — Detección de Anomalías (Migration 009) ───────────────────────

export type AnomalyType =
  | 'high_spend'
  | 'low_income'
  | 'flow_drop'
  | 'flow_spike'
  | 'duplicate'
  | 'category_shift'

export type AnomalySeverity = 'info' | 'warning' | 'critical'

export interface CategoryStats {
  id: string
  user_id: string
  category_id: string | null
  venture_id: string | null
  period_months: number
  mean_amount: number | null
  std_dev: number | null
  median_amount: number | null
  sample_count: number | null
  last_calculated: string
}

export interface AnomalyLog {
  id: string
  user_id: string
  transaction_id: string | null
  venture_id: string | null
  anomaly_type: AnomalyType
  severity: AnomalySeverity
  z_score: number | null
  description: string
  related_tx_id: string | null
  is_dismissed: boolean
  created_at: string
  // Joins desde la vista active_anomalies
  venture_name?: string
  transaction_amount?: number
  transaction_date?: string
  category_name?: string
}

// ── VPS — Venture Priority Score (Frontend only, nunca persistir) ────────────

export interface VPSResult {
  ventureId: string
  score: number
  rank: number
  roiWeighted: number
  capitalScore: number
  flowScore: number
  maturityScore: number
  interpretation: string
  warningReason: string | null
}

export interface VPSConfig {
  weightROI: number
  weightCapital: number
  weightFlow: number
  weightMaturity: number
}

// ── Rate Limiting ────────────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  reset_at: string
}

// ── API responses ─────────────────────────────────────────────────────────────

export interface ApiError {
  code: string
  message: string
}

export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: ApiError }
