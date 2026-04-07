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

// ── Loans (Módulo de Préstamos — Fase 2) ─────────────────────────────────────

export type LoanStatus = 'active' | 'paid' | 'overdue'
export type LoanPaymentStatus = 'pending' | 'paid' | 'overdue'

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
  created_at: string
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
  /** Pagos iniciales a crear con el préstamo */
  payments?: Array<{ amount: number; due_date: string }>
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
