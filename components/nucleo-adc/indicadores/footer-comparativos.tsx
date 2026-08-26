// Footer de comparativos M / A de la tarjeta de indicador.
// font:500 11px Geist Mono color:#6B7482
// Tendencias: font:700 en color de estado
// > 300%: "×N". Base cero o null: "—"
// Ref: design.md §11

import { formatComparativo } from './utils'
import type { DireccionDeseable } from './types'

interface FooterComparativosProps {
  varSPLM: number | null
  varSPLY: number | null
  direccionDeseable: DireccionDeseable
}

export function FooterComparativos({
  varSPLM,
  varSPLY,
  direccionDeseable,
}: FooterComparativosProps) {
  const m = formatComparativo(varSPLM, direccionDeseable)
  const a = formatComparativo(varSPLY, direccionDeseable)

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        fontFamily: 'var(--font-geist-mono), monospace',
        fontSize: 11,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {/* Mes anterior */}
      <span style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <span style={{ fontWeight: 500, color: 'var(--nuc-ink-3)' }}>M</span>
        <span
          style={{
            fontWeight: varSPLM !== null ? 700 : 500,
            color: m.color(),
          }}
        >
          {m.texto}
        </span>
      </span>

      {/* Año anterior */}
      <span style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <span style={{ fontWeight: 500, color: 'var(--nuc-ink-3)' }}>A</span>
        <span
          style={{
            fontWeight: varSPLY !== null ? 700 : 500,
            color: a.color(),
          }}
        >
          {a.texto}
        </span>
      </span>
    </div>
  )
}
