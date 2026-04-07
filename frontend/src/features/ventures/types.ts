// apps/web/src/features/ventures/types.ts
// Re-exporta tipos de ventures desde la fuente de verdad (backend)

export type {
  Venture,
  VentureType,
  VentureStatus,
  VentureHealth,
  VentureMode,
  CreateVentureInput,
  UpdateVentureInput,
} from '@backend/_shared/types'
