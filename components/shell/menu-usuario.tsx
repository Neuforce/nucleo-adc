'use client'

// Menú de usuario — flotante 280px, fondo #FFFFFF, sombra.
// Avatar 36×36px border-radius:50% fondo:#00244D
// Nombre: font:600 13.5px Geist. Email: font:400 11.5px Geist color:#6B7482
// Rótulos: font:500 10.5px Geist Mono letter-spacing:.06em color:#6B7482
// Switch tema: height:26px border:1px solid #E4E6EA border-radius:6px
// Cerrar sesión: font:600 12px Geist color:#C2352B
// Ref: design.md §9

import { useTheme } from 'next-themes'

interface MenuUsuarioProps {
  nombre: string
  email: string
  initiales: string
  onCerrarSesion: () => void
  onCerrar: () => void
  isDark: boolean
}

export function MenuUsuario({
  nombre,
  email,
  initiales,
  onCerrarSesion,
  onCerrar,
  isDark,
}: MenuUsuarioProps) {
  const { setTheme } = useTheme()

  return (
    <>
      {/* Backdrop para cerrar */}
      <div
        aria-hidden="true"
        onClick={onCerrar}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 59,
        }}
      />

      {/* Menú */}
      <div
        role="menu"
        aria-label="Menú de usuario"
        style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          right: 0,
          zIndex: 60,
          width: 280,
          background: 'var(--nuc-surface)',
          border: '1px solid var(--nuc-border)',
          borderRadius: 8,
          boxShadow: isDark
            ? '0 18px 44px rgba(0,0,0,.46)'
            : '0 18px 44px rgba(0,36,77,.22)',
          overflow: 'hidden',
        }}
      >
        {/* Bloque de perfil */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--nuc-border)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#00244D',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 12,
                fontWeight: 700,
                color: '#FFFFFF',
              }}
            >
              {initiales}
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: 'var(--nuc-ink)',
                  margin: 0,
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {nombre}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 11.5,
                  fontWeight: 400,
                  color: 'var(--nuc-ink-3)',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {email}
              </p>
            </div>
          </div>
        </div>

        {/* Preferencias */}
        <div style={{ padding: '10px 0', borderBottom: '1px solid var(--nuc-border)' }}>
          <p
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 10.5,
              fontWeight: 500,
              letterSpacing: '.06em',
              color: 'var(--nuc-ink-3)',
              margin: '0 0 4px',
              padding: '0 16px',
              textTransform: 'uppercase' as const,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            PREFERENCIAS
          </p>

          {/* Switch de tema */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '5px 16px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--nuc-ink-2)',
              }}
            >
              Tema
            </span>
            <div
              style={{
                height: 26,
                display: 'flex',
                border: '1px solid var(--nuc-border)',
                borderRadius: 6,
                overflow: 'hidden',
              }}
            >
              {(['light', 'dark'] as const).map((t) => {
                const esActivo = isDark === (t === 'dark')
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    style={{
                      padding: '0 10px',
                      border: 'none',
                      background: esActivo ? 'var(--nuc-surface-hover)' : 'transparent',
                      fontFamily: 'var(--font-geist-sans), sans-serif',
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: esActivo ? 'var(--nuc-ink)' : 'var(--nuc-ink-2)',
                      cursor: 'pointer',
                    }}
                  >
                    {t === 'light' ? 'Claro' : 'Oscuro'}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Pie */}
        <div style={{ background: 'var(--nuc-surface-header)', padding: '10px 0' }}>
          {/* Versión */}
          <div style={{ padding: '0 16px 8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 10.5,
                fontWeight: 500,
                color: 'var(--nuc-ink-3)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              Núcleo ADC v0.1.0
            </span>
          </div>

          {/* Cerrar sesión */}
          <button
            onClick={onCerrarSesion}
            style={{
              width: '100%',
              padding: '6px 16px',
              background: 'none',
              border: 'none',
              textAlign: 'left' as const,
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--nuc-rojo)',
              cursor: 'pointer',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  )
}
