// Bloque "Periodos comparables" — bloque 3 del panel de detalle.
// grid 1fr 76px 66px 74px
// Encabezado: font:600 11px Geist Mono letter-spacing:.07em color:#6B7482
// Periodo: font:500 12.5px Geist
// Real: font:500 12.5px Geist Mono
// Delta: font:700 12.5px Geist Mono color de estado
// Ref: design.md §11 bloque 3

import { colorEstado, monedaUnidad } from '../indicadores/utils'
import type { Indicador } from '../indicadores/types'

interface FilaPeriodo {
  periodo: string
  real: number | null
  objetivo: number | null
  avance: number | null
}

interface BloquePeriodsProps {
  indicador: Indicador
  filas: FilaPeriodo[]
}

const COLS = '1fr 76px 66px 74px'
const COL_HEADERS = ['Periodo', 'Real', 'Objetivo', 'Avance']

export function BloquePeriodos({ indicador, filas }: BloquePeriodsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: COLS,
          gap: 0,
          padding: '0 0 6px',
          borderBottom: '1px solid var(--nuc-border-sub)',
        }}
      >
        {COL_HEADERS.map((h) => (
          <span
            key={h}
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '.07em',
              color: 'var(--nuc-ink-3)',
              textTransform: 'uppercase' as const,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Filas */}
      {filas.map((f, i) => {
        const colores = colorEstado(f.avance)
        return (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: COLS,
              gap: 0,
              padding: '8px 0',
              borderBottom: i < filas.length - 1 ? '1px solid var(--nuc-border-sub)' : 'none',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--nuc-ink)',
              }}
            >
              {f.periodo}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--nuc-ink)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {monedaUnidad(f.real, indicador.unidadMedidaFormato, false)}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--nuc-ink-2)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {f.objetivo !== null
                ? monedaUnidad(f.objetivo, indicador.unidadMedidaFormato, false)
                : '—'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 12.5,
                fontWeight: 700,
                color: f.avance !== null ? colores.texto : 'var(--nuc-ink-2)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {f.avance !== null ? `${(f.avance * 100).toFixed(1)}%` : '—'}
            </span>
          </div>
        )
      })}
    </div>
  )
}
