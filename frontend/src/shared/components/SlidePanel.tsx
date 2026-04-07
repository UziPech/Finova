import { useEffect, type ReactNode } from 'react'

interface SlidePanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function SlidePanel({ isOpen, onClose, title, children }: SlidePanelProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent scrolling on body when panel is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Backdrop */}
      <div 
        className="animate-fade-in"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
        }} 
        onClick={onClose} 
      />

      {/* Sliding Panel */}
      <div 
        className="animate-panel-slide" 
        style={{
          position: 'relative',
          backgroundColor: '#0a0a0a',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
          border: '1px solid #262626',
          borderTop: 'none',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90dvh',
          display: 'flex',
          flexDirection: 'column',
          color: '#fafafa'
        }}
      >
        {/* Decorative Top Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #fafafa, transparent)',
          opacity: 0.15
        }} />

        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '24px',
          borderBottom: '1px solid #171717' 
        }}>
          <div>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#fafafa', 
              letterSpacing: '-0.02em',
              margin: 0 
            }}>
              {title}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            style={{ 
              padding: '6px', 
              borderRadius: '8px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#737373', 
              display: 'flex', 
              transition: 'all 0.15s',
              backgroundColor: 'rgba(255,255,255,0.05)'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.color = '#fafafa'
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.color = '#737373'
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}
