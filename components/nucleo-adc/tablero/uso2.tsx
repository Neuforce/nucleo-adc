// Uso 2 — Lista agrupada.
// Cuándo: entidad única + 7 o más indicadores.
// Filas agrupadas con encabezado de grupo.
// Ref: design.md §11

import { FilaIndicador } from './fila-indicador'
import type { Indicador, Alarma } from '../indicadores/types'

interface ItemUso2 {
  indicador: Indicador
  alarma?: Alarma
  activa?: boolean
}

interface GrupoUso2 {
  rotulo?: string
  items: ItemUso2[]
}

interface Uso2Props {
  grupos: GrupoUso2[]
  onDetalle?: (claveIndicador: string) => void
}

export function Uso2({ grupos, onDetalle }: Uso2Props) {
  const COLS = '1fr 100px 80px 52px 52px 56px'
  const HEADERS = ['Indicador', 'Real', 'Objetivo', 'M', 'A', '%']

  return (
    <div
      style={{
        border: '1px solid var(--nuc-border)',
        borderRadius: 6,
        background: 'var(--nuc-surface)',
        overflow: 'hidden',
      }}
    >
      {/* Header de columnas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: COLS,
          gap: 0,
          padding: '0 12px',
          height: 32,
          alignItems: 'center',
          borderBottom: '1px solid var(--nuc-border-sub)',
        }}
      >
        {HEADERS.map((h) => (
          <span
            key={h}
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '.06em',
              color: 'var(--nuc-ink-3)',
              textTransform: 'uppercase' as const,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Grupos */}
      {grupos.map((grupo, gi) => (
        <div key={gi}>
          {/* Rótulo de grupo */}
          {grupo.rotulo && (
            <div
              style={{
                padding: '6px 12px 4px',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '.09em',
                color: 'var(--nuc-ink-5)',
                textTransform: 'uppercase' as const,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {grupo.rotulo}
            </div>
          )}

          {/* Filas */}
          {grupo.items.map(({ indicador, alarma, activa }) => (
            <FilaIndicador
              key={indicador.claveIndicador}
              indicador={indicador}
              alarma={alarma}
              activa={activa}
              onDetalle={onDetalle ? () => onDetalle(indicador.claveIndicador) : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
