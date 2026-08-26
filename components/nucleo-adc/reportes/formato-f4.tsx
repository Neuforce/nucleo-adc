'use client'

// FormatoF4 — Comparativo: sucursales/entidades ordenadas por la columna que importa.
// Grid: 24px 1fr 90px 1fr 76px. Barra con marca del promedio grupo.
// Pie anclado con el grupo como referencia.
// Ref: doc 10-reportes-fijos §05 F4

export interface FilaF4 {
  id: string
  nombre: string
  valor: number
  cumplimiento?: number  // decimal 0-1
  esGrupo?: boolean      // anclada al pie
}

interface FormatoF4Props {
  filas: FilaF4[]
  columnas?: {
    col1?: string   // default 'SUCURSAL'
    col2?: string   // default 'UTILIDAD'
    col3?: string   // default 'VS GRUPO'
    col4?: string   // default 'CUMPL'
  }
}

function colorCumpl(c: number) {
  if (c >= 1) return 'var(--nuc-verde-txt)'
  if (c >= 0.80) return 'var(--nuc-ambar-txt)'
  return 'var(--nuc-rojo)'
}

export function FormatoF4({
  filas,
  columnas,
}: FormatoF4Props) {
  const c = {
    col1: 'SUCURSAL',
    col2: 'UTILIDAD',
    col3: 'VS GRUPO',
    col4: 'CUMPL',
    ...columnas,
  }

  const grid = '24px 1fr 90px 1fr 76px'

  const entradasOrdenadas = filas.filter((f) => !f.esGrupo)
  const grupoTotal = filas.find((f) => f.esGrupo)

  const maxValor = Math.max(...entradasOrdenadas.map((f) => f.valor), grupoTotal?.valor ?? 0)

  // Posición del promedio grupo en la barra (0-1)
  const posGrupo = grupoTotal && maxValor > 0 ? grupoTotal.valor / maxValor : null

  return (
    <div style={{ background: 'var(--nuc-surface)' }}>
      {/* Encabezados */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: grid,
        alignItems: 'center',
        padding: '8px 14px',
        background: 'var(--nuc-surface-header)',
        borderBottom: '1px solid var(--nuc-border)',
        gap: 9,
      }}>
        <div />
        {[c.col1, c.col2, c.col3, c.col4].map((col, i) => (
          <div key={i} style={{
            textAlign: [1, 3].includes(i) ? 'right' : 'left',
            font: '600 11px var(--font-geist-mono), monospace',
            letterSpacing: '.07em',
            color: 'var(--nuc-ink-3)',
          }}>
            {col}
          </div>
        ))}
      </div>

      {/* Filas de entidades */}
      {entradasOrdenadas.map((fila, idx) => {
        const anchoBarra = maxValor > 0 ? fila.valor / maxValor : 0
        const esLider = idx === 0

        return (
          <div
            key={fila.id}
            style={{
              display: 'grid',
              gridTemplateColumns: grid,
              alignItems: 'center',
              padding: '0 14px',
              height: 40,
              borderBottom: '1px solid var(--nuc-surface-sub)',
              background: 'var(--nuc-surface)',
              gap: 9,
            }}
          >
            <div style={{ font: '600 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)' }}>
              {idx + 1}
            </div>
            <div style={{ font: '600 12.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fila.nombre}
            </div>
            <div style={{ textAlign: 'right', font: '500 12.5px var(--font-geist-mono), monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--nuc-ink)' }}>
              {fila.valor.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </div>
            {/* Barra comparativa */}
            <div style={{
              height: 6,
              background: 'var(--nuc-border-sub)',
              borderRadius: 3,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${anchoBarra * 100}%`,
                background: esLider ? '#00244D' : 'var(--nuc-ink-4)',
                borderRadius: 3,
              }} />
              {/* Marca del grupo */}
              {posGrupo !== null && (
                <div style={{
                  position: 'absolute',
                  left: `${posGrupo * 100}%`,
                  top: -3,
                  bottom: -3,
                  width: 1,
                  background: 'var(--nuc-ink)',
                }} />
              )}
            </div>
            <div style={{
              textAlign: 'right',
              font: '700 12px var(--font-geist-mono), monospace',
              color: fila.cumplimiento !== undefined ? colorCumpl(fila.cumplimiento) : 'var(--nuc-ink-3)',
            }}>
              {fila.cumplimiento !== undefined ? `${Math.round(fila.cumplimiento * 100)}%` : '—'}
            </div>
          </div>
        )
      })}

      {/* Fila del grupo (anclada al pie) */}
      {grupoTotal && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: grid,
          alignItems: 'center',
          padding: '9px 14px',
          background: 'var(--nuc-surface-header)',
          borderTop: '1px solid var(--nuc-border)',
          gap: 9,
        }}>
          <div />
          <div style={{ font: '700 12.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
            {grupoTotal.nombre}
          </div>
          <div style={{ textAlign: 'right', font: '700 12.5px var(--font-geist-mono), monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--nuc-ink)' }}>
            {grupoTotal.valor.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
          </div>
          <div style={{ font: '400 11px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-3)' }}>
            referencia
          </div>
          <div style={{
            textAlign: 'right',
            font: '700 12px var(--font-geist-mono), monospace',
            color: grupoTotal.cumplimiento !== undefined ? colorCumpl(grupoTotal.cumplimiento) : 'var(--nuc-ink-3)',
          }}>
            {grupoTotal.cumplimiento !== undefined ? `${Math.round(grupoTotal.cumplimiento * 100)}%` : '—'}
          </div>
        </div>
      )}
    </div>
  )
}
