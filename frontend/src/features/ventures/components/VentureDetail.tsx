// features/ventures/components/VentureDetail.tsx — Vista de detalle monochrome
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/shared/lib/supabase'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'
import { TransactionForm } from '@/features/transactions/components/TransactionForm'
import { formatCurrency, formatDate, formatROI } from '@/shared/lib/formatters'
import { VENTURE_TYPE_LABELS, VENTURE_STATUS_LABELS } from '@/shared/lib/constants'
import { calculateROI, breakEven, netProfit, ventureHealth } from '../utils'
import { VentureForm } from './VentureForm'
import type { Venture, CreateVentureInput } from '../types'

export function VentureDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [venture, setVenture] = useState<Venture | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTxForm, setShowTxForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  const { transactions, loading: txLoading, fetchTransactions, createTransaction, deleteTransaction } = useTransactions(id)

  useEffect(() => {
    if (!id) return
    const fetchVenture = async () => {
      setLoading(true)
      const { data, error } = await supabase.functions.invoke(`ventures/${id}`, {
        method: 'GET',
      })
      if (error || !data) { navigate('/ventures'); return }
      setVenture(data.data)
      setLoading(false)
    }
    fetchVenture()
    fetchTransactions(id)
  }, [id, navigate, fetchTransactions])

  const handleEditVenture = async (input: CreateVentureInput) => {
    if (!id) return
    const { data, error } = await supabase.functions.invoke(`ventures/${id}`, {
      method: 'PUT',
      body: input,
    })
    if (error) throw new Error(error.message || 'Error updating venture')
    setVenture(data.data)
  }

  const handleDeleteVenture = async () => {
    if (!id || !confirm('¿Eliminar este venture y todas sus transacciones?')) return
    await supabase.functions.invoke(`ventures/${id}`, {
      method: 'DELETE',
    })
    navigate('/ventures')
  }

  if (loading || !venture) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="skeleton" style={{ height: '28px', width: '180px' }} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '14px' }} />)}
        </div>
        <div className="skeleton" style={{ height: '320px', borderRadius: '14px' }} />
      </div>
    )
  }

  const roi = calculateROI(venture.invested, venture.returned)
  const health = ventureHealth(roi)
  const net = netProfit(venture.invested, venture.returned)
  const remaining = breakEven(venture.invested, venture.returned)

  const healthColor = health === 'positive' ? '#16a34a' : health === 'negative' ? '#dc2626' : '#525252'
  const netColor = net >= 0 ? '#16a34a' : '#dc2626'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="animate-fade-in" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <button
            onClick={() => navigate('/ventures')}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#737373',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '4px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#0a0a0a' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#737373' }}
          >
            <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Ventures
          </button>
          <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>{venture.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '13px', color: '#737373' }}>{VENTURE_TYPE_LABELS[venture.type]}</span>
            <span style={{ color: '#d4d4d4' }}>·</span>
            <span style={{ fontSize: '13px', color: '#737373' }}>{VENTURE_STATUS_LABELS[venture.status]}</span>
            {venture.notes && (
              <>
                <span style={{ color: '#d4d4d4' }}>·</span>
                <span style={{ fontSize: '13px', color: '#a3a3a3' }}>{venture.notes}</span>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowEditForm(true)}
            style={{
              padding: '8px 14px', borderRadius: '10px', border: '1px solid #e5e5e5',
              backgroundColor: '#fff', color: '#525252', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff' }}
          >
            Editar
          </button>
          <button
            onClick={handleDeleteVenture}
            style={{
              padding: '8px 14px', borderRadius: '10px', border: '1px solid #fecaca',
              backgroundColor: '#fff', color: '#dc2626', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff' }}
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="animate-fade-in grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ animationDelay: '50ms' }}>
        {[
          { label: 'Invertido', value: formatCurrency(venture.invested), color: '#0a0a0a' },
          { label: 'Retornado', value: formatCurrency(venture.returned), color: '#0a0a0a' },
          { label: 'ROI', value: formatROI(roi), color: healthColor },
          { label: net >= 0 ? 'Ganancia' : 'Por recuperar', value: formatCurrency(net >= 0 ? net : remaining), color: netColor },
        ].map((stat) => (
          <div key={stat.label} style={{
            backgroundColor: '#fff', borderRadius: '14px', padding: '16px 20px',
            border: '1px solid #e5e5e5',
          }}>
            <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 4px' }}>{stat.label}</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: stat.color, margin: 0, letterSpacing: '-0.02em' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="animate-fade-in" style={{
        backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5',
        overflow: 'hidden', animationDelay: '100ms',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid #f5f5f5',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>
            Transacciones
            <span style={{ color: '#a3a3a3', fontWeight: 400, marginLeft: '6px' }}>({transactions.length})</span>
          </h2>
          <button
            onClick={() => setShowTxForm(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '8px',
              backgroundColor: '#f5f5f5', color: '#525252', fontSize: '13px', fontWeight: 500,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e5e5e5'; e.currentTarget.style.color = '#0a0a0a' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.color = '#525252' }}
          >
            <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Agregar
          </button>
        </div>

        {txLoading ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '48px', borderRadius: '10px' }} />)}
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 20px' }}>
            <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>Sin transacciones aún</p>
            <button
              onClick={() => setShowTxForm(true)}
              style={{
                marginTop: '8px', fontSize: '14px', color: '#0a0a0a', fontWeight: 500,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                textDecoration: 'underline', textUnderlineOffset: '4px',
              }}
            >
              Registrar la primera →
            </button>
          </div>
        ) : (
          <div>
            {transactions.map((tx, i) => (
              <div
                key={tx.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 20px', transition: 'background-color 0.15s',
                  borderTop: i > 0 ? '1px solid #fafafa' : 'none',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fafafa' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', flexShrink: 0,
                  backgroundColor: tx.type === 'income' ? '#f0fdf4' : '#fef2f2',
                  color: tx.type === 'income' ? '#16a34a' : '#dc2626',
                }}>
                  {tx.type === 'income' ? '↑' : '↓'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tx.description || 'Sin descripción'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '2px 0 0' }}>{formatDate(tx.date)}</p>
                </div>
                <p style={{
                  fontSize: '13px', fontWeight: 600, flexShrink: 0, margin: 0,
                  color: tx.type === 'income' ? '#16a34a' : '#dc2626',
                }}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  style={{
                    padding: '4px', borderRadius: '6px', background: 'none', border: 'none',
                    cursor: 'pointer', color: '#d4d4d4', display: 'flex',
                    transition: 'color 0.15s',
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#d4d4d4'; e.currentTarget.style.opacity = '0' }}
                  title="Eliminar"
                  className="group-hover:opacity-100"
                >
                  <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showTxForm && (
        <TransactionForm
          ventureId={venture.id}
          onSubmit={createTransaction}
          onClose={() => setShowTxForm(false)}
        />
      )}
      {showEditForm && (
        <VentureForm
          venture={venture}
          onSubmit={handleEditVenture}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  )
}
