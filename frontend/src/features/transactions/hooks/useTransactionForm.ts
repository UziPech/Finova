// features/transactions/hooks/useTransactionForm.ts
// Hook del formulario guiado de 3 pasos (Decisión D2)
// Regla 10: tipos desde @backend/_shared/types.ts
// Regla 21: toda lógica de negocio aquí, no en la vista

import { useState, useCallback, useMemo } from 'react'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/features/auth/store'
import type { Transaction, TransactionCategory } from '@backend/_shared/types'

// ── Tipos del formulario ──────────────────────────────────────────────────────

export type TransactionStep = 'type_selection' | 'details' | 'confirmation'

export type MovementType =
  | 'income'
  | 'operating_expense'
  | 'capital_investment'
  | 'transfer'

export interface TransactionDraft {
  movementType: MovementType | null
  amount: number | null
  date: string
  description: string
  categoryId: string | null
  evidence: File | null
  // Campos específicos por tipo
  isRecurring: boolean
  recurringFrequency: 'weekly' | 'biweekly' | 'monthly' | null
  isDepreciable: boolean
  transferTargetVentureId: string | null
}

export interface ImpactPreview {
  currentMonthFlow: number
  projectedMonthFlow: number
  flowDelta: number
  categoryAverage: number | null
  categoryDeviation: number | null
  warning: string | null
}

const INITIAL_DRAFT: TransactionDraft = {
  movementType: null,
  amount: null,
  date: new Date().toISOString().split('T')[0],
  description: '',
  categoryId: null,
  evidence: null,
  isRecurring: false,
  recurringFrequency: null,
  isDepreciable: false,
  transferTargetVentureId: null,
}

// ── Hook principal ────────────────────────────────────────────────────────────

export function useTransactionForm(ventureId: string) {
  const [step, setStep] = useState<TransactionStep>('type_selection')
  const [draft, setDraft] = useState<TransactionDraft>({ ...INITIAL_DRAFT })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [impactPreview, setImpactPreview] = useState<ImpactPreview | null>(null)
  const { session } = useAuthStore()

  // ── Navegación de pasos ─────────────────────────────────────────
  const goToStep = useCallback((target: TransactionStep) => {
    setStep(target)
  }, [])

  const goNext = useCallback(() => {
    if (step === 'type_selection' && draft.movementType) {
      setStep('details')
    } else if (step === 'details') {
      setStep('confirmation')
    }
  }, [step, draft.movementType])

  const goBack = useCallback(() => {
    if (step === 'confirmation') setStep('details')
    else if (step === 'details') setStep('type_selection')
  }, [step])

  // ── Actualización del draft ─────────────────────────────────────
  const updateDraft = useCallback((updates: Partial<TransactionDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }))
    setError(null)
  }, [])

  const selectMovementType = useCallback((type: MovementType) => {
    setDraft(prev => ({
      ...prev,
      movementType: type,
      // Reset campos específicos al cambiar tipo
      isRecurring: false,
      recurringFrequency: null,
      isDepreciable: false,
      transferTargetVentureId: null,
    }))
    setStep('details')
  }, [])

  const reset = useCallback(() => {
    setDraft({ ...INITIAL_DRAFT })
    setStep('type_selection')
    setError(null)
    setImpactPreview(null)
  }, [])

  // ── Validación por paso ─────────────────────────────────────────
  const stepValidation = useMemo(() => {
    const step1Valid = draft.movementType !== null
    const step2Valid =
      draft.amount !== null &&
      draft.amount > 0 &&
      draft.date.length > 0 &&
      // Transfers requieren venture destino
      (draft.movementType !== 'transfer' || draft.transferTargetVentureId !== null)
    // Decisión D3: categoría es recomendada pero no bloqueante para WhatsApp
    // En el form guiado, SÍ se bloquea el avance al paso 3 sin categoría
    const step2CategoryValid = draft.categoryId !== null || draft.movementType === 'transfer'

    return { step1Valid, step2Valid, step2CategoryValid }
  }, [draft])

  // ── Mapeo de MovementType a datos de transacción ────────────────
  const resolvedTransactionType = useMemo(() => {
    switch (draft.movementType) {
      case 'income': return 'income' as const
      case 'operating_expense': return 'expense' as const
      case 'capital_investment': return 'expense' as const
      case 'transfer': return 'expense' as const
      default: return 'expense' as const
    }
  }, [draft.movementType])

  // ── Preview de impacto (paso 3) ─────────────────────────────────
  const calculateImpact = useCallback(async (
    currentTransactions: Transaction[],
    categories: TransactionCategory[]
  ) => {
    if (!draft.amount) return

    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    // Flujo del mes actual (sin la transacción nueva)
    const currentMonthTxs = currentTransactions.filter(t =>
      t.venture_id === ventureId && t.date.startsWith(currentMonth)
    )
    const currentMonthFlow = currentMonthTxs.reduce(
      (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0
    )

    // Flujo proyectado con la nueva transacción
    const delta = resolvedTransactionType === 'income' ? draft.amount : -draft.amount
    const projectedMonthFlow = currentMonthFlow + delta

    // Promedio de la categoría (si existe)
    let categoryAverage: number | null = null
    let categoryDeviation: number | null = null
    let warning: string | null = null

    if (draft.categoryId) {
      const catTxs = currentTransactions.filter(t =>
        t.category_id === draft.categoryId && t.venture_id === ventureId
      )
      if (catTxs.length >= 3) {
        const amounts = catTxs.map(t => t.amount)
        categoryAverage = amounts.reduce((s, a) => s + a, 0) / amounts.length

        if (draft.amount > categoryAverage * 2.5) {
          const pctAbove = ((draft.amount - categoryAverage) / categoryAverage * 100).toFixed(0)
          const cat = categories.find(c => c.id === draft.categoryId)
          warning = `Este monto es ${pctAbove}% mayor que tu promedio en ${cat?.name || 'esta categoria'} ($${categoryAverage.toFixed(0)}/mes). Verifica antes de confirmar.`
        }
      }
    }

    setImpactPreview({
      currentMonthFlow,
      projectedMonthFlow,
      flowDelta: delta,
      categoryAverage,
      categoryDeviation,
      warning,
    })
  }, [draft, ventureId, resolvedTransactionType])

  // ── Envío final ─────────────────────────────────────────────────
  const submit = useCallback(async (): Promise<Transaction | null> => {
    if (!session?.access_token || !draft.amount || !draft.movementType) {
      setError('Datos incompletos')
      return null
    }

    setSubmitting(true)
    setError(null)

    try {
      const input = {
        venture_id: ventureId,
        type: resolvedTransactionType,
        amount: draft.amount,
        date: draft.date,
        description: draft.description || undefined,
        category_id: draft.categoryId || undefined,
      }

      let responseData
      if (draft.evidence) {
        const formData = new FormData()
        formData.append('venture_id', input.venture_id)
        formData.append('type', input.type)
        formData.append('amount', String(input.amount))
        formData.append('date', input.date)
        if (input.description) formData.append('description', input.description)
        if (input.category_id) formData.append('category_id', input.category_id)
        formData.append('evidence', draft.evidence)

        const { data, error: invokeError } = await supabase.functions.invoke('transactions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: formData,
        })
        if (invokeError) throw new Error(invokeError.message)
        responseData = data
      } else {
        const { data, error: invokeError } = await supabase.functions.invoke('transactions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: input,
        })
        if (invokeError) throw new Error(invokeError.message)
        responseData = data
      }

      // Si es transferencia, crear la transacción de ingreso en el venture destino
      if (draft.movementType === 'transfer' && draft.transferTargetVentureId) {
        await supabase.functions.invoke('transactions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: {
            venture_id: draft.transferTargetVentureId,
            type: 'income',
            amount: draft.amount,
            date: draft.date,
            description: `Transferencia desde otro venture: ${draft.description || 'Sin concepto'}`,
          },
        })
      }

      reset()
      return responseData?.data ?? null
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar la transaccion'
      setError(message)
      return null
    } finally {
      setSubmitting(false)
    }
  }, [session, draft, ventureId, resolvedTransactionType, reset])

  return {
    // Estado
    step,
    draft,
    submitting,
    error,
    impactPreview,
    // Validación
    stepValidation,
    resolvedTransactionType,
    // Acciones
    goToStep,
    goNext,
    goBack,
    selectMovementType,
    updateDraft,
    calculateImpact,
    submit,
    reset,
  }
}
