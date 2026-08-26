'use client'

// RespuestaDirecta — Tipo A: cuando el resultado es una cifra (1-3 medidas).
// Layout: cifra grande + comparativas M/A + meta + línea divisoria.
// Ref: doc 11-reportes-gen §02 Tipo A

interface MedidaComparativa {
  etiqueta: string   // e.g. 'MES ANTERIOR'
  valor: string      // e.g. '206'
  variacion?: number // decimal, governs color
  direccionDeseable?: 'Arriba' | 'Abajo'
}

interface RespuestaDirectaProps {
  unidad: string       // e.g. 'UNIDADES'
  valor: string        // e.g. '185'
  comparativas?: MedidaComparativa[]
  meta?: string | null   // null → 'sin cargar'
}

function colorVar(v: number, dir?: 'Arriba' | 'Abajo') {
  if (dir === 'Arriba') return v >= 0 ? 'var(--nuc-verde-txt)' : 'var(--nuc-rojo)'
  if (dir === 'Abajo') return v <= 0 ? 'var(--nuc-verde-txt)' : 'var(--nuc-rojo)'
  return v >= 0 ? 'var(--nuc-verde-txt)' : 'var(--nuc-rojo)'
}

export function RespuestaDirecta({
  unidad,
  valor,
  comparativas = [],
  meta,
}: RespuestaDirectaProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: 24,
      padding: '16px 0',
      borderTop: '1px solid var(--nuc-border)',
      borderBottom: '1px solid var(--nuc-border)',
    }}>
      {/* Cifra principal */}
      <div>
        <div style={{ font: '600 11px var(--font-geist-mono), monospace', letterSpacing: '.07em', color: 'var(--nuc-ink-3)' }}>
          {unidad}
        </div>
        <div style={{
          font: '600 40px/1 var(--font-geist-mono), monospace',
          letterSpacing: '-.04em',
          color: 'var(--nuc-ink)',
          marginTop: 8,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {valor}
        </div>
      </div>

      {/* Separador vertical */}
      {comparativas.length > 0 && (
        <div style={{ width: 1, height: 44, background: 'var(--nuc-border-input)', flexShrink: 0 }} />
      )}

      {/* Comparativas */}
      {comparativas.map((comp, i) => (
        <div key={i}>
          <div style={{ font: '600 11px var(--font-geist-mono), monospace', letterSpacing: '.07em', color: 'var(--nuc-ink-3)' }}>
            {comp.etiqueta}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 9 }}>
            <span style={{ font: '500 20px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)', fontVariantNumeric: 'tabular-nums' }}>
              {comp.valor}
            </span>
            {comp.variacion !== undefined && (
              <span style={{
                font: '600 13px var(--font-geist-mono), monospace',
                color: colorVar(comp.variacion, comp.direccionDeseable),
              }}>
                {comp.variacion >= 0 ? '▲' : '▼'}{Math.round(Math.abs(comp.variacion) * 100)}%
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Meta */}
      {meta !== undefined && (
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ font: '600 11px var(--font-geist-mono), monospace', letterSpacing: '.07em', color: 'var(--nuc-ink-3)' }}>
            META
          </div>
          <div style={{ font: '500 20px var(--font-geist-mono), monospace', color: meta ? 'var(--nuc-ink)' : 'var(--nuc-ink-3)', marginTop: 9, fontVariantNumeric: 'tabular-nums' }}>
            {meta ?? 'sin cargar'}
          </div>
        </div>
      )}
    </div>
  )
}
