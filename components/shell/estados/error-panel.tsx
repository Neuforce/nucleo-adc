// Error de datos — border-left 3px rojo, título en español, folio al pie.
// border: 1px solid #F6D5D2, border-left: 3px solid #C2352B, border-radius: 6px.
// Fondo: #FFFFFF (no tintado). Padding: 16px uniforme. Gap: 9px.
// Título: font 600 14px Geist. Body: 400 12px/1.6 Geist. Botones: 600 11.5px.
// Folio: font 500 11px Geist Mono color #6B7482, al pie con margin-top:auto.

interface ErrorPanelProps {
  titulo: string
  descripcion?: string
  folio?: string
  onReintentar?: () => void
  onReportar?: () => void
}

export function ErrorPanel({
  titulo,
  descripcion,
  folio,
  onReintentar,
  onReportar,
}: ErrorPanelProps) {
  return (
    <div
      role="alert"
      style={{
        border: '1px solid #F6D5D2',
        borderLeft: '3px solid var(--nuc-rojo)',
        borderRadius: 6,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        background: 'var(--nuc-surface)',
        maxWidth: 480,
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
          }}
        >
          {descripcion}
        </p>
      )}

      {(onReintentar || onReportar) && (
        <div style={{ display: 'flex', gap: 7, marginTop: 4 }}>
          {onReintentar && (
            <button
              onClick={onReintentar}
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
              }}
            >
              Reintentar
            </button>
          )}
          {onReportar && (
            <button
              onClick={onReportar}
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
              Reportar a TI
            </button>
          )}
        </div>
      )}

      {folio && (
        <p
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--nuc-ink-3)',
            margin: 0,
            marginTop: 'auto',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {folio}
        </p>
      )}
    </div>
  )
}
