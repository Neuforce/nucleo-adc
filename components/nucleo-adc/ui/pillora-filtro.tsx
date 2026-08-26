// Píldora de filtro — activa: fondo negro, inactiva: contorno.
// height:24px padding:0 9px border-radius:12px
// Activa: background:#0E1116 color:#FFFFFF font:600 11px Geist
// Inactiva: border:1px solid #E4E6EA color:#3D4551 font:500 11px Geist
// Ref: design.md §9

interface PilloraFiltroProps {
  etiqueta: string
  activa?: boolean
  onClick?: () => void
}

export function PilloraFiltro({
  etiqueta,
  activa = false,
  onClick,
}: PilloraFiltroProps) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 24,
        padding: '0 9px',
        borderRadius: 12,
        border: activa
          ? 'none'
          : `1px solid var(--nuc-border)`,
        background: activa
          ? 'var(--nuc-ink)'
          : 'transparent',
        fontFamily: 'var(--font-geist-sans), sans-serif',
        fontSize: 11,
        fontWeight: activa ? 600 : 500,
        color: activa
          ? 'var(--nuc-surface)'
          : 'var(--nuc-ink-3)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {etiqueta}
    </button>
  )
}
