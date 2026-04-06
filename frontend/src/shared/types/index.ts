// apps/web/src/shared/types/index.ts
// Tipos primitivos globales del frontend (no de dominio)

export type UUID = string
export type ISODate = string // formato 'YYYY-MM-DD'
export type ISOTimestamp = string // formato ISO 8601

// Re-exporta tipos de dominio desde la fuente de verdad (backend)
export type {
  Venture,
  VentureType,
  VentureStatus,
  VentureHealth,
  CreateVentureInput,
  UpdateVentureInput,
  Transaction,
  TransactionType,
  CreateTransactionInput,
  HouseholdExpense,
  AuthUser,
  ApiError,
  ApiResult,
} from '@backend/_shared/types'
