// Sin permiso — muestra rol actual y quién puede cambiar el acceso.
// Círculo decorativo: 30×30px, border 1.5px solid #C8CED7, border-radius 50%.
// Nunca muestra «403» ni «no autorizado».
// Título: font 600 14px Geist. Body: 400 12px/1.6. Botón: 600 11.5px, contorno.
// El módulo no aparece en el rail si no hay permiso.

interface SinAccesoProps {
  modulo: string
  rol?: string
  onSolicitarAcceso?: () => void
}

export function SinAcceso({
  modulo,
  rol,
  onSolicitarAcceso,
}: SinAccesoProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        gap: 9,
        textAlign: 'center',
      }}
    >
      {/* Círculo decorativo */}
      <div
        aria-hidden="true"
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: '1.5px solid var(--nuc-border-input)',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--nuc-ink-3)',
        }}
      >
        ·
      </div>

      <p
        style={{
          fontFamily: 'var(--font-geist-sans), sans-serif',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--nuc-ink)',
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        No tienes acceso a {modulo}
      </p>

      <p
        style={{
          fontFamily: 'var(--font-geist-sans), sans-serif',
          fontSize: 12,
          fontWeight: 400,
          color: 'var(--nuc-ink-2)',
          margin: 0,
          lineHeight: 1.6,
          maxWidth: 250,
        }}
      >
        {rol ? (
          <>
            Tu rol es{' '}
            <strong style={{ fontWeight: 600, color: 'var(--nuc-ink)' }}>{rol}</strong>.{' '}
          </>
        ) : null}
        El acceso lo asigna Configuración → Roles.
      </p>

      {onSolicitarAcceso && (
        <div style={{ marginTop: 6 }}>
          <button
            onClick={onSolicitarAcceso}
            style={{
              padding: '7px 13px',
              borderRadius: 5,
              border: '1px solid var(--nuc-border-input)',
              background: 'var(--nuc-surface)',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 11.5,
              fontWeight: 600,
              color: 'var(--nuc-ink)',
              cursor: 'pointer',
            }}
          >
            Solicitar acceso
          </button>
        </div>
      )}
    </div>
  )
}
