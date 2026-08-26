'use client'

// FormatoF3 — Evolución mensual: el mismo concepto mes a mes.
// Grid: 196px repeat(8,1fr) 104px 76px.
// Mes actual en negrita, barra de tendencia navy para el mes actual.
// Miniatura de tendencia (5px barras) sin ejes — comunica forma, no magnitud.
// Ref: doc 10-reportes-fijos §04

export interface FilaF3 {
  id: string
  nombre: string
  esGrupo?: boolean
  valores: (number | string | null)[]   // uno por mes, mismo orden que `meses`
  acumulado?: number | string
  ocultarTendencia?: boolean
}

interface FormatoF3Props {
  meses: string[]          // e.g. ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO']
  mesActualIdx?: number    // índice del mes actual (lo pinta en navy en miniatura)
  filas: FilaF3[]
}

function Miniatura({ valores, mesActualIdx }: { valores: (number | null)[], mesActualIdx: number }) {
  const nums = valores.filter((v): v is number => v !== null)
  if (nums.length === 0) return <div style={{ width: 76, height: 20 }} />
  const max = Math.max(...nums)
  if (max === 0) return <div style={{ width: 76, height: 20 }} />

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 2, height: 20 }}>
      {valores.map((v, i) => {
        const h = v !== null && max > 0 ? Math.max(4, Math.round((v / max) * 100)) : 4
        const esActual = i === mesActualIdx
        return (
          <div
            key={i}
            style={{
              width: 5,
              height: `${h}%`,
              background: esActual ? '#00244D' : '#C8CED7',
              borderRadius: 1,
              flexShrink: 0,
            }}
          />
        )
      })}
    </div>
  )
}

export function FormatoF3({
  meses,
  mesActualIdx,
  filas,
}: FormatoF3Props) {
  const actualIdx = mesActualIdx ?? meses.length - 1

  const grid = `196px repeat(${meses.length},1fr) 104px 76px`

  function fmtVal(v: number | string | null) {
    if (v === null || v === undefined) return '—'
    if (typeof v === 'string') return v
    // Abreviar si > 999
    if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
    if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K`
    return v.toLocaleString('es-MX', { maximumFractionDigits: 1 })
  }

  return (
    <div style={{ background: 'var(--nuc-surface)', overflowX: 'auto' }}>
      {/* Encabezados */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: grid,
        padding: '8px 18px',
        background: 'var(--nuc-surface-header)',
        borderBottom: '1px solid var(--nuc-border)',
        gap: 6,
        minWidth: 700,
      }}>
        <div style={{ font: '600 11px var(--font-geist-mono), monospace', letterSpacing: '.07em', color: 'var(--nuc-ink-3)' }}>CONCEPTO</div>
        {meses.map((m, i) => (
          <div key={m} style={{
            textAlign: 'right',
            font: `${i === actualIdx ? '700' : '600'} 11px var(--font-geist-mono), monospace`,
            color: i === actualIdx ? 'var(--nuc-ink)' : 'var(--nuc-ink-3)',
          }}>
            {m}
          </div>
        ))}
        <div style={{ textAlign: 'right', font: '600 11px var(--font-geist-mono), monospace', letterSpacing: '.07em', color: 'var(--nuc-ink-3)' }}>ACUM</div>
        <div style={{ textAlign: 'right', font: '600 11px var(--font-geist-mono), monospace', letterSpacing: '.07em', color: 'var(--nuc-ink-3)' }}>TEND</div>
      </div>

      {/* Filas */}
      {filas.map((fila) => {
        const numericos = fila.valores.map(v => typeof v === 'number' ? v : null)
        return (
          <div
            key={fila.id}
            style={{
              display: 'grid',
              gridTemplateColumns: grid,
              alignItems: 'center',
              padding: fila.esGrupo ? '11px 18px' : '9px 18px',
              borderBottom: `1px solid ${fila.esGrupo ? 'var(--nuc-border)' : 'var(--nuc-surface-sub)'}`,
              background: fila.esGrupo ? 'var(--nuc-surface-header)' : 'var(--nuc-surface)',
              gap: 6,
              minWidth: 700,
            }}
          >
            <div style={{
              font: `${fila.esGrupo ? '700' : '600'} 12.5px var(--font-geist-sans), sans-serif`,
              color: 'var(--nuc-ink)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {fila.nombre}
            </div>
            {fila.valores.map((v, i) => (
              <div key={i} style={{
                textAlign: 'right',
                font: `${i === actualIdx ? '700' : (fila.esGrupo ? '600' : '400')} 12px var(--font-geist-mono), monospace`,
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--nuc-ink)',
              }}>
                {fmtVal(v)}
              </div>
            ))}
            <div style={{
              textAlign: 'right',
              font: `${fila.esGrupo ? '700' : '600'} 12px var(--font-geist-mono), monospace`,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--nuc-ink)',
            }}>
              {fila.acumulado !== undefined ? fmtVal(fila.acumulado) : '—'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {!fila.ocultarTendencia && (
                <Miniatura valores={numericos} mesActualIdx={actualIdx} />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
