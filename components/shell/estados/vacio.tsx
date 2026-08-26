// Vacío — dos variantes según el origen del estado.
// Por filtro → acción «Quitar filtros» (contorno).
// Real → acción «Crear» (background #2F6BFF, border-radius 5px, padding 7px 13px).
// Título: font 600 14px Geist. Body: 400 12px/1.6. Botones: 600 11.5px Geist.

interface VacioProps {
  titulo: string
  descripcion?: string
  accion?: string
  porFiltro?: boolean
  onAccion?: () => void
}

export function Vacio({
  titulo,
  descripcion,
  accion,
  porFiltro = false,
  onAccion,
}: VacioProps) {
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
        {titulo}
      </p>

      {descripcion && (
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
          {descripcion}
        </p>
      )}

      {onAccion && (
        <div style={{ marginTop: 6 }}>
          <button
            onClick={onAccion}
            style={
              porFiltro
                ? {
                    padding: '7px 13px',
                    borderRadius: 5,
                    border: '1px solid var(--nuc-border-input)',
                    background: 'var(--nuc-surface)',
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: 'var(--nuc-ink)',
                    cursor: 'pointer',
                  }
                : {
                    padding: '7px 13px',
                    borderRadius: 5,
                    border: 'none',
                    background: 'var(--nuc-acc)',
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                  }
            }
          >
            {accion ?? (porFiltro ? 'Quitar filtros' : 'Crear')}
          </button>
        </div>
      )}
    </div>
  )
}
