// features/settings/components/KeywordsManager.tsx — Gestión monocromática
import { useState, useEffect } from 'react'
import { useKeywords } from '../hooks/useKeywords'

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '8px',
  backgroundColor: '#fafafa',
  border: '1px solid #e5e5e5',
  color: '#171717',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s',
}

export function KeywordsManager() {
  const { incomeKeywords, expenseKeywords, loading, saving, addKeyword, removeKeyword } = useKeywords()
  const [newKeyword, setNewKeyword] = useState('')
  const [newType, setNewType] = useState<'income' | 'expense'>('expense')

  const handleAdd = async () => {
    const success = await addKeyword(newKeyword, newType)
    if (success) {
      setNewKeyword('')
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '480px' }}>
        <div className="skeleton" style={{ height: '28px', width: '180px', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '280px', borderRadius: '14px' }} />
      </div>
    )
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <button
          onClick={() => window.history.back()}
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
          Atrás
        </button>
        <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>Palabras clave</h1>
        <p style={{ fontSize: '14px', color: '#737373', margin: '2px 0 0' }}>
          Cuando envíes un mensaje por WhatsApp con estas palabras, se clasificará automáticamente como ingreso o gasto.
        </p>
      </div>

      {/* Add keyword */}
      <div style={{
        backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5', padding: '20px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 12px' }}>Agregar palabra clave</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Ej: venta, compra, pago..."
            style={{ ...inputStyle, flex: 1 }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as 'income' | 'expense')}
            style={{ ...inputStyle, cursor: 'pointer', width: 'auto' }}
          >
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
          <button
            onClick={handleAdd}
            disabled={saving || !newKeyword.trim()}
            style={{
              padding: '10px 16px', borderRadius: '8px', border: 'none',
              backgroundColor: '#0a0a0a', color: '#fafafa', fontSize: '14px', fontWeight: 600,
              cursor: (saving || !newKeyword.trim()) ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s', opacity: (saving || !newKeyword.trim()) ? 0.4 : 1,
            }}
            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#262626' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a' }}
          >
            {saving ? '...' : '+'}
          </button>
        </div>
      </div>

      {/* Keywords lists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Income */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>Ingresos</h3>
            <span style={{ fontSize: '12px', color: '#a3a3a3' }}>({incomeKeywords.length})</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {incomeKeywords.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#a3a3a3' }}>Sin keywords de ingreso</p>
            ) : incomeKeywords.map((k) => (
              <div key={k.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: '8px', backgroundColor: '#f0fdf4',
                transition: 'background-color 0.15s',
              }}>
                <span style={{ fontSize: '13px', color: '#166534', fontWeight: 500 }}>{k.keyword}</span>
                <button
                  onClick={() => removeKeyword(k.id)}
                  style={{
                    padding: '2px', background: 'none', border: 'none', cursor: 'pointer',
                    color: '#a3a3a3', display: 'flex', transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#a3a3a3' }}
                >
                  <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Expense */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>Gastos</h3>
            <span style={{ fontSize: '12px', color: '#a3a3a3' }}>({expenseKeywords.length})</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {expenseKeywords.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#a3a3a3' }}>Sin keywords de gasto</p>
            ) : expenseKeywords.map((k) => (
              <div key={k.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: '8px', backgroundColor: '#fef2f2',
                transition: 'background-color 0.15s',
              }}>
                <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: 500 }}>{k.keyword}</span>
                <button
                  onClick={() => removeKeyword(k.id)}
                  style={{
                    padding: '2px', background: 'none', border: 'none', cursor: 'pointer',
                    color: '#a3a3a3', display: 'flex', transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#a3a3a3' }}
                >
                  <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
