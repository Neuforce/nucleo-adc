// Cinta de indicadores del Hub — scroll horizontal.
// Tarjetas 214×132px con gap:12px. Máximo 4–6 tarjetas visibles.
// Ref: design.md §17 T1 Hub, §11

import { TarjetaIndicador } from '../indicadores/tarjeta'
import type { Indicador, Tono, Alarma } from '../indicadores/types'

interface ItemCinta {
  indicador: Indicador
  tono?: Tono
  alarma?: Alarma
}

interface CintaIndicadoresProps {
  titulo?: string
  items: ItemCinta[]
  onDetalle?: (claveIndicador: string) => void
}

export function CintaIndicadores({
  titulo,
  items,
  onDetalle,
}: CintaIndicadoresProps) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {titulo && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--nuc-ink)',
              margin: 0,
            }}
          >
            {titulo}
          </h3>
          <span
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--nuc-ink-3)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {items.length}
          </span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 4,
          // Ocultar scrollbar en todos los navegadores
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        {items.map(({ indicador, tono, alarma }) => (
          <TarjetaIndicador
            key={indicador.claveIndicador}
            indicador={indicador}
            tono={tono}
            alarma={alarma}
            onDetalle={onDetalle ? () => onDetalle(indicador.claveIndicador) : undefined}
          />
        ))}
      </div>
    </section>
  )
}
