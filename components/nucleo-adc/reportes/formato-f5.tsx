'use client'

// FormatoF5 — Conciliación: dos fuentes, una diferencia.
// Grid: 1fr 96px 96px 92px. Filas que cuadran: '—' en gris, no en verde.
// Diferencias con bg tintado rojo y valor en rojo. Subfilas de detalle.
// Ref: doc 10-reportes-fijos §05 F5

export interface FilaF5 {
  id: string
  concepto: string
  fuente1: number | null
  fuente2: number | null
  diferencia?: number | null
  esSubfila?: boolean      // detalle sangrado de una diferencia
  accionLink?: string      // etiqueta del link "Ver"
  onAccion?: () => void
}

interface FormatoF5Props {
  filas: FilaF5[]
  etiquetaFuente1?: string   // default 'DMS'
  etiquetaFuente2?: string   // default 'CONTPAQ'
  diferenciaTotalLabel?: string
  diferenciaTotalValor?: number
}

export function FormatoF5({
  filas,
  etiquetaFuente1 = 'DMS',
  etiquetaFuente2 = 'CONTPAQ',
  diferenciaTotalLabel = 'Diferencia total',
  diferenciaTotalValor,
}: FormatoF5Props) {
  const grid = '1fr 96px 96px 92px'

  function fmtNum(n: number | null) {
    if (n === null) return '—'
    return n.toLocaleString('es-MX', { maximumFractionDigits: 1 })
  }

  return (
    <div style={{ background: 'var(--nuc-surface)' }}>
      {/* Encabezados */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: grid,
        alignItems: 'end',
        padding: '8px 14px',
        background: 'var(--nuc-surface-header)',
        borderBottom: '1px solid var(--nuc-border)',
        gap: 9,
      }}>
        {['CONCEPTO', etiquetaFuente1, etiquetaFuente2, 'DIF'].map((col, i) => (
          <div key={i} style={{
            textAlign: i > 0 ? 'right' : 'left',
            font: '600 11px var(--font-geist-mono), monospace',
            letterSpacing: '.07em',
            color: 'var(--nuc-ink-3)',
          }}>
            {col}
          </div>
        ))}
      </div>

      {/* Filas */}
      {filas.map((fila) => {
        const tieneDif = fila.diferencia !== null && fila.diferencia !== undefined && fila.diferencia !== 0

        return (
          <div
            key={fila.id}
            style={{
              display: 'grid',
              gridTemplateColumns: grid,
              alignItems: 'center',
              padding: `0 14px`,
              height: fila.esSubfila ? 36 : 40,
              borderBottom: '1px solid var(--nuc-surface-sub)',
              background: tieneDif ? '#FDF5F4' : 'var(--nuc-surface)',
              gap: 9,
            }}
          >
            <div style={{
              paddingLeft: fila.esSubfila ? 16 : 0,
              font: `${fila.esSubfila ? '400' : '500'} ${fila.esSubfila ? '12' : '12.5'}px var(--font-geist-${fila.esSubfila ? 'sans' : 'sans'}), sans-serif`,
              color: fila.esSubfila ? 'var(--nuc-ink-3)' : 'var(--nuc-ink)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {fila.esSubfila ? `↳ ${fila.concepto}` : fila.concepto}
            </div>
            <div style={{
              textAlign: 'right',
              font: '400 12.5px var(--font-geist-mono), monospace',
              fontVariantNumeric: 'tabular-nums',
              color: fila.esSubfila ? 'var(--nuc-ink-3)' : 'var(--nuc-ink)',
            }}>
              {fila.fuente1 !== null ? fmtNum(fila.fuente1) : '—'}
            </div>
            <div style={{
              textAlign: 'right',
              font: '400 12.5px var(--font-geist-mono), monospace',
              fontVariantNumeric: 'tabular-nums',
              color: fila.esSubfila ? 'var(--nuc-ink-3)' : 'var(--nuc-ink)',
            }}>
              {fila.fuente2 !== null ? fmtNum(fila.fuente2) : '—'}
            </div>
            <div style={{
              textAlign: 'right',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
            }}>
              {tieneDif ? (
                <span style={{ font: '700 12px var(--font-geist-mono), monospace', color: 'var(--nuc-rojo)' }}>
                  {fmtNum(fila.diferencia!)}
                </span>
              ) : fila.accionLink ? (
                <span
                  onClick={fila.onAccion}
                  style={{ font: '500 11.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-acc)', cursor: 'pointer' }}
                >
                  {fila.accionLink}
                </span>
              ) : (
                <span style={{ font: '500 12px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)' }}>—</span>
              )}
            </div>
          </div>
        )
      })}

      {/* Fila de diferencia total */}
      {diferenciaTotalValor !== undefined && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: grid,
          alignItems: 'center',
          padding: '11px 14px',
          background: 'var(--nuc-surface-header)',
          borderTop: '1px solid var(--nuc-border)',
          gap: 9,
        }}>
          <div style={{ font: '700 12.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
            {diferenciaTotalLabel}
          </div>
          <div /><div />
          <div style={{
            textAlign: 'right',
            font: '700 14px var(--font-geist-mono), monospace',
            color: diferenciaTotalValor !== 0 ? 'var(--nuc-rojo)' : 'var(--nuc-verde-txt)',
          }}>
            {diferenciaTotalValor !== 0 ? fmtNum(diferenciaTotalValor) : '—'}
          </div>
        </div>
      )}
    </div>
  )
}
