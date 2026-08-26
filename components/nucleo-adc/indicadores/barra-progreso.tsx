// Barra de progreso del indicador — solo clase DESEMPEÑO.
// height:4px background:#EEF0F3 border-radius:2px
// Relleno: color de estado. Marca de meta: width:1px height:full background:#0E1116
// Porcentaje: font:700 12.5px/14px Geist Mono, color de estado
// Ref: design.md §11

import { colorEstado, avancePorcentaje } from './utils'
import type { DireccionDeseable } from './types'

interface BarraProgresoProps {
  avance: number | null          // decimal: 0.831 = 83.1%
  direccionDeseable: DireccionDeseable
  mostrarPorcentaje?: boolean
}

export function BarraProgreso({
  avance,
  direccionDeseable,
  mostrarPorcentaje = true,
}: BarraProgresoProps) {
  const colores = colorEstado(avance)
  const pctDisplay = avancePorcentaje(avance)

  // Clamp entre 0 y 100 para la barra visual
  const anchoRelleno = avance === null
    ? 0
    : Math.min(Math.max(avance * 100, 0), 100)

  // La marca de meta (100%) va en la posición exacta del objetivo
  const posicionMeta = 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Barra */}
      <div
        style={{
          position: 'relative',
          height: 4,
          background: 'var(--nuc-surface-hover)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Relleno */}
        {avance !== null && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${anchoRelleno}%`,
              background: colores.relleno,
              borderRadius: 2,
            }}
          />
        )}

        {/* Marca de meta (en posición 100%) */}
        <div
          style={{
            position: 'absolute',
            left: `${posicionMeta}%`,
            top: 0,
            width: 1,
            height: '100%',
            background: 'var(--nuc-ink)',
            transform: 'translateX(-1px)',
          }}
        />
      </div>

      {/* Porcentaje */}
      {mostrarPorcentaje && avance !== null && (
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 12.5,
            fontWeight: 700,
            lineHeight: '14px',
            color: colores.texto,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {pctDisplay}
        </span>
      )}
    </div>
  )
}
