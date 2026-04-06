// backend/_shared/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// Fuente de verdad central de tipos del dominio Finova.
// El frontend NO define tipos de dominio — solo re-exporta desde aquí.
// ─────────────────────────────────────────────────────────────────────────────

// ── Ventures ─────────────────────────────────────────────────────────────────

export type VentureType = 'software' | 'physical' | 'investment' | 'mixed'
export type VentureStatus = 'active' | 'paused' | 'closed' | 'idea'
export type VentureHealth = 'positive' | 'neutral' | 'negative'

export interface Venture {
  id: string
  user_id: string
  name: string
  type: VentureType
  status: VentureStatus
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

export interface Transaction {
  id: string
  venture_id: string
  user_id: string
  type: TransactionType
  amount: number
  description?: string
  date: string
  evidence_url?: string
  created_at: string
}

export interface CreateTransactionInput {
  venture_id: string
  type: TransactionType
  amount: number
  description?: string
  date: string
  evidence_url?: string
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
