'use client'

// Sesión caducada — único diálogo modal permitido sobre la mesa.
// bg #FFFFFF, border 1px solid #E4E6EA, border-radius 8px.
// box-shadow: 0 12px 30px rgba(0,36,77,.16), padding 16px 18px.
// Mesa de fondo: opacity .35.
// Título: font 600 13.5px Geist. Body: 400 12px/1.6 Geist. Botón: 600 11.5px.
// Botón: background #2F6BFF (azul, no navy). Texto: "Entrar de nuevo".

interface SesionExpiradaProps {
  onRenovar: () => void
}

export function SesionExpirada({ onRenovar }: SesionExpiradaProps) {
  return (
    <>
      {/* Overlay sobre la mesa */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--nuc-mesa)',
          opacity: 0.35,
          zIndex: 50,
          pointerEvents: 'none',
        }}
      />

      {/* Modal centrado */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sesion-titulo"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 51,
          background: 'var(--nuc-surface)',
          border: '1px solid var(--nuc-border)',
          borderRadius: 8,
          boxShadow: '0 12px 30px rgba(0,36,77,.16)',
          padding: '16px 18px',
          width: 340,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <p
          id="sesion-titulo"
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 13.5,
            fontWeight: 600,
            color: 'var(--nuc-ink)',
            margin: 0,
            marginBottom: 6,
            lineHeight: 1.35,
          }}
        >
          Tu sesión expiró
        </p>

        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 12,
            fontWeight: 400,
            color: 'var(--nuc-ink-2)',
            margin: 0,
            marginBottom: 11,
            lineHeight: 1.6,
          }}
        >
          Vuelve a entrar y regresas{' '}
          <strong style={{ fontWeight: 600, color: 'var(--nuc-ink)' }}>
            a esta misma pantalla
          </strong>
          ; lo que estabas capturando se conserva.
        </p>

        <div>
          <button
            onClick={onRenovar}
            style={{
              padding: '7px 13px',
              borderRadius: 5,
              border: 'none',
              background: 'var(--nuc-acc)',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 11.5,
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            Entrar de nuevo
          </button>
        </div>
      </div>
    </>
  )
}
