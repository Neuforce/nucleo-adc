// Franja de alarma — 34px al pie de la tarjeta de indicador.
// La tarjeta NO se pinta de rojo: solo agrega punto + borde izquierdo + esta franja.
// Claro: background:#FDF5F4 border-top:1px solid #F6D5D2 padding:8px 15px margin:auto -15px -11px
// Texto: font:600 11px Geist color:#C2352B
// Link: font:500 11px Geist Mono color:#2F6BFF
// Ref: design.md §12

import type { NivelAlarma } from './types'

interface FranjaAlarmaProps {
  nivel: NivelAlarma
  motivo: string
  onDetalle?: () => void
}

const estilosPorNivel: Record<NivelAlarma, { bg: string; borde: string; colorTexto: string }> = {
  CRITICA: {
    bg: '#FDF5F4',
    borde: 'var(--nuc-alarma-border)',
    colorTexto: 'var(--nuc-rojo)',
  },
  ATENCION: {
    bg: '#FDF6E9',
    borde: '#F2E2C2',
    colorTexto: 'var(--nuc-ambar)',
  },
  NO_EVALUABLE: {
    bg: '#FBFBFC',
    borde: 'var(--nuc-border)',
    colorTexto: 'var(--nuc-ink-2)',
  },
}

export function FranjaAlarma({
  nivel,
  motivo,
  onDetalle,
}: FranjaAlarmaProps) {
  const e = estilosPorNivel[nivel]

  return (
    <div
      style={{
        height: 34,
        background: e.bg,
        borderTop: `1px solid ${e.borde}`,
        padding: '0 15px',
        margin: 'auto -15px -11px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-geist-sans), sans-serif',
          fontSize: 11,
          fontWeight: 600,
          color: e.colorTexto,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
        }}
      >
        {motivo}
      </span>

      {onDetalle && (
        <button
          onClick={onDetalle}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--primary)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Ver →
        </button>
      )}
    </div>
  )
}
