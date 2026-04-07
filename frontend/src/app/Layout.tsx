// app/Layout.tsx — Layout principal monocromático premium
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    to: '/ventures',
    label: 'Ventures',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
]

export function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: '#fafafa' }}>
      {/* ── Top Header ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#0a0a0a',
        borderBottom: '1px solid #1a1a1a',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          padding: '0 20px',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
        }}>
          {/* Left: Hamburger & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                padding: '8px',
                marginLeft: '-8px',
                borderRadius: '8px',
                color: '#d4d4d4',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                transition: 'all 0.15s',
                backgroundColor: sidebarOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fafafa' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sidebarOpen ? 'rgba(255,255,255,0.1)' : 'transparent'; e.currentTarget.style.color = '#d4d4d4' }}
            >
              {sidebarOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>

            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#fafafa" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <h1 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0, color: '#fafafa' }}>Finova</h1>
            </div>
          </div>

          {/* Right: User Settings */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px',
                borderRadius: '32px',
                transition: 'all 0.15s',
                color: '#d4d4d4',
                backgroundColor: settingsOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { if (!settingsOpen) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fafafa' } }}
              onMouseLeave={(e) => { if (!settingsOpen) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#d4d4d4' } }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                color: '#fafafa',
              }}>
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* Settings dropdown panel */}
            {settingsOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                  onClick={() => setSettingsOpen(false)}
                />
                <div className="animate-slide-down" style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '12px',
                  width: '280px',
                  backgroundColor: '#0a0a0a',
                  borderRadius: '14px',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px #262626',
                  zIndex: 50,
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #1a1a1a' }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#fafafa',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: 0,
                    }}>
                      {user?.email || 'Usuario'}
                    </p>
                    <p style={{ fontSize: '11px', color: '#737373', margin: '2px 0 0' }}>Integraciones y preferencias</p>
                  </div>
                  <nav style={{ padding: '8px' }}>
                    <NavLink
                      to="/settings/whatsapp"
                      onClick={() => setSettingsOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        color: '#d4d4d4',
                        textDecoration: 'none',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#f0fdf4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <svg className="w-4 h-4" style={{ color: '#16a34a' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </span>
                      <div>
                        <p style={{ fontWeight: 500, margin: 0 }}>WhatsApp</p>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/settings/keywords"
                      onClick={() => setSettingsOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        color: '#d4d4d4',
                        textDecoration: 'none',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <svg className="w-4 h-4" style={{ color: '#fafafa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                        </svg>
                      </span>
                      <div>
                        <p style={{ fontWeight: 500, margin: 0 }}>Palabras clave</p>
                      </div>
                    </NavLink>
                  </nav>
                  
                  <div style={{ padding: '8px', borderTop: '1px solid #1a1a1a' }}>
                    <button
                      onClick={handleSignOut}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Slide-Down Navigation Panel ── */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
        }}>
          {/* Backdrop */}
          <div
            className="animate-fade-in"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setSidebarOpen(false)}
          />
          {/* Menu */}
          <div className="animate-panel-slide" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#0a0a0a',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
            borderBottom: '1px solid #262626',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}>
            <nav style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '1400px', margin: '0 auto' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#525252', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '12px' }}>
                  Navegación
                </p>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px 16px',
                      borderRadius: '16px',
                      fontSize: '15px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                      color: isActive ? '#fafafa' : '#a3a3a3',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    })}
                    onMouseEnter={(e) => {
                      if (e.currentTarget.style.backgroundColor !== 'rgba(255, 255, 255, 0.08)') {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.color = '#fafafa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (e.currentTarget.style.backgroundColor !== 'rgba(255, 255, 255, 0.08)') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#a3a3a3';
                      }
                    }}
                  >
                    <div style={{ color: 'inherit' }}>{item.icon}</div>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: '24px 16px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
