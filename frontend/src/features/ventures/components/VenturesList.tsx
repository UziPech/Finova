// features/ventures/components/VenturesList.tsx — Lista de ventures monochrome
import { useState } from 'react'
import { useVentures } from '../hooks/useVentures'
import { VentureCard } from './VentureCard'
import { VentureForm } from './VentureForm'
import type { CreateVentureInput } from '../types'

export function VenturesList() {
  const { ventures, loading, error, createVenture } = useVentures()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all'
    ? ventures
    : ventures.filter((v) => v.status === filter)

  const handleCreate = async (input: CreateVentureInput) => {
    await createVenture(input)
  }

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'active', label: 'Activos' },
    { key: 'paused', label: 'Pausados' },
    { key: 'idea', label: 'Ideas' },
    { key: 'closed', label: 'Cerrados' },
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="skeleton" style={{ height: '28px', width: '128px', marginBottom: '4px' }} />
            <div className="skeleton" style={{ height: '16px', width: '200px' }} />
          </div>
          <div className="skeleton" style={{ height: '40px', width: '144px', borderRadius: '10px' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '180px', borderRadius: '14px' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="animate-fade-in" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>Ventures</h1>
          <p style={{ fontSize: '14px', color: '#737373', margin: '2px 0 0' }}>
            {ventures.length} proyecto{ventures.length !== 1 ? 's' : ''} registrado{ventures.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '10px',
            backgroundColor: '#0a0a0a',
            color: '#fafafa',
            fontSize: '14px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#262626' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a' }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo venture
        </button>
      </div>

      {/* Filters */}
      <div className="animate-fade-in" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', animationDelay: '50ms' }}>
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              border: filter === f.key ? 'none' : '1px solid #e5e5e5',
              backgroundColor: filter === f.key ? '#0a0a0a' : '#fff',
              color: filter === f.key ? '#fafafa' : '#525252',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="animate-fade-in" style={{
          padding: '14px',
          borderRadius: '10px',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          fontSize: '13px',
          border: '1px solid #fecaca',
        }}>
          {error}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg style={{ width: '28px', height: '28px', color: '#a3a3a3' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>No hay ventures {filter !== 'all' ? 'con este filtro' : 'aún'}</p>
          {filter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                marginTop: '12px',
                fontSize: '14px',
                color: '#171717',
                fontWeight: 500,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                padding: 0,
              }}
            >
              Crear tu primer venture →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((v, i) => (
            <VentureCard key={v.id} venture={v} delay={i * 50} />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showForm && (
        <VentureForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
