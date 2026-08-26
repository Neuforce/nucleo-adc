'use client'

// Ventana de login — sobre la portada atenuada y desenfocada.
// width:376px background:rgba(10,20,32,.86) border-radius:12px
// box-shadow:0 30px 70px rgba(0,0,0,.6)
// Overlay: rgba(3,9,16,.62) backdrop-filter:blur
// Campo dark: height:40px border-radius:6px border:1px solid rgba(255,255,255,.18)
// Error: borde #FF8B80 — nunca toast
// Ref: design.md §16

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PaginaEntrar() {
  const router = useRouter()
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState(false)
  const [cargando, setCargando] = useState(false)

  const focusColor = '#4D8DFF'
  const errorColor = '#FF8B80'
  const bordeDefault = 'rgba(255,255,255,.18)'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!usuario || !contrasena) {
      setError(true)
      return
    }
    setCargando(true)
    setError(false)
    // TODO: llamar a la API de autenticación
    await new Promise((r) => setTimeout(r, 800))
    setCargando(false)
    // En producción: si credenciales incorrectas → setError(true)
    router.push('/')
  }

  const inputStyle = (conError: boolean): React.CSSProperties => ({
    width: '100%',
    height: 40,
    padding: '0 13px',
    borderRadius: 6,
    border: `1px solid ${conError ? errorColor : bordeDefault}`,
    background: 'rgba(255,255,255,.06)',
    fontFamily: 'var(--font-geist-sans), sans-serif',
    fontSize: 13,
    fontWeight: 400,
    color: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box' as const,
  })

  return (
    <>
      {/* Overlay difuminado */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3,9,16,.62)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 40,
        }}
      />

      {/* Portada detrás (fondo oscuro) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#050D16',
          zIndex: 30,
        }}
      />

      {/* Ventana de login */}
      <div
        role="main"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          width: 376,
          background: 'rgba(10,20,32,.86)',
          borderRadius: 12,
          boxShadow: '0 30px 70px rgba(0,0,0,.6)',
          border: '1px solid rgba(255,255,255,.1)',
          padding: '28px 28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Logo + título */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <svg
            viewBox="0 0 100 100"
            width={24}
            height={24}
            aria-hidden="true"
            fill="none"
          >
            <circle cx="50" cy="50" r="12" stroke="#FFFFFF" strokeWidth="3.4" />
            <line x1="50" y1="38" x2="50" y2="14" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
            <line x1="50" y1="62" x2="50" y2="86" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
            <line x1="39.6" y1="44" x2="17.5" y2="31.3" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
            <line x1="60.4" y1="56" x2="82.5" y2="68.7" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
            <line x1="39.6" y1="56" x2="17.5" y2="68.7" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
            <line x1="60.4" y1="44" x2="82.5" y2="31.3" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
            <circle cx="50" cy="14" r="6.5" stroke="#FFFFFF" strokeWidth="3.4" />
            <circle cx="50" cy="86" r="6.5" stroke="#FFFFFF" strokeWidth="3.4" />
            <circle cx="17.5" cy="31.3" r="6.5" stroke="#FFFFFF" strokeWidth="3.4" />
            <circle cx="82.5" cy="68.7" r="6.5" stroke="#FFFFFF" strokeWidth="3.4" />
            <circle cx="17.5" cy="68.7" r="6.5" stroke="#FFFFFF" strokeWidth="3.4" />
            <circle cx="82.5" cy="31.3" r="6.5" stroke="#FFFFFF" strokeWidth="3.4" />
          </svg>
          <h1
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 18,
              fontWeight: 600,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Núcleo ADC
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 13,
              fontWeight: 400,
              color: 'rgba(255,255,255,.5)',
              margin: 0,
            }}
          >
            Accede con tus credenciales de ADC Traxión
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label
              htmlFor="usuario"
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 12,
                fontWeight: 500,
                color: 'rgba(255,255,255,.6)',
              }}
            >
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              autoComplete="username"
              value={usuario}
              onChange={(e) => { setUsuario(e.target.value); setError(false) }}
              style={inputStyle(error && !usuario)}
              placeholder="usuario@adctraxion.com"
            />
            {error && !usuario && (
              <span
                style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 11,
                  fontWeight: 400,
                  color: errorColor,
                }}
              >
                Ingresa tu usuario
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label
              htmlFor="contrasena"
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 12,
                fontWeight: 500,
                color: 'rgba(255,255,255,.6)',
              }}
            >
              Contraseña
            </label>
            <input
              id="contrasena"
              type="password"
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => { setContrasena(e.target.value); setError(false) }}
              style={inputStyle(error && !contrasena)}
              placeholder="••••••••"
            />
            {error && !contrasena && (
              <span
                style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 11,
                  fontWeight: 400,
                  color: errorColor,
                }}
              >
                Ingresa tu contraseña
              </span>
            )}
          </div>

          {/* Error de credenciales — en el campo, nunca toast */}
          {error && usuario && contrasena && (
            <p
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 11.5,
                fontWeight: 400,
                color: errorColor,
                margin: 0,
              }}
            >
              Usuario o contraseña incorrectos. Intenta de nuevo.
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              marginTop: 4,
              height: 40,
              borderRadius: 6,
              border: 'none',
              background: cargando ? 'rgba(47,107,255,.6)' : '#2F6BFF',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 13.5,
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: cargando ? 'not-allowed' : 'pointer',
            }}
          >
            {cargando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 11.5,
            fontWeight: 400,
            color: 'rgba(255,255,255,.28)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          El acceso lo asigna tu administrador. Sin sucursal ni rol en este paso.
        </p>
      </div>
    </>
  )
}
