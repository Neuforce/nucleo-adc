'use client'

// FormatoF1 — Estado jerárquico: cuentas que suman a un total.
// Grid: 1fr 116px 116px 92px 116px 92px
// Grupo: font:700/bg:#FBFBFC. Detalle: padding-left:18px font:400. Total: border-top:2px solid #0e1116 font:700 16px
// El color de variación lo gobierna direccionDeseable, no el signo.
// Ref: doc 10-reportes-fijos §02

export interface ConceptoF1 {
  id: string
  nombre: string
  esGrupo?: boolean
  sangria?: boolean
  real: number
  presupuesto?: number
  varPresupuesto?: number   // decimal, e.g. -0.09
  anterior?: number
  varAnterior?: number      // decimal
  esTotal?: boolean
  direccionDeseable?: 'Arriba' | 'Abajo'  // governs color
}

interface FormatoF1Props {
  conceptos: ConceptoF1[]
  columnas?: {
    colA?: string  // default 'CONCEPTO'
    colB?: string  // default 'REAL'
    colC?: string  // default 'PRESUPUESTO'
    colD?: string  // default 'VAR'
    colE?: string  // default periodo anterior label
    colF?: string  // default 'VAR'
  }
}

function fmtNum(n: number) {
  return n.toLocaleString('es-MX', { maximumFractionDigits: 0 })
}

function colorVar(variacion: number, direccion?: 'Arriba' | 'Abajo'): string {
  // Para cuentas de ingreso/activo: bajar es malo (Arriba deseable).
  // Para cuentas de gasto/pasivo: bajar es bueno (Abajo deseable).
  const umbralAmb = -0.10  // dentro de ±10%

  if (direccion === 'Arriba') {
    if (variacion >= 0) return 'var(--nuc-verde-txt)'
    if (variacion >= umbralAmb) return 'var(--nuc-ambar-txt)'
    return 'var(--nuc-rojo)'
  } else if (direccion === 'Abajo') {
    if (variacion <= 0) return 'var(--nuc-verde-txt)'
    if (variacion <= -umbralAmb) return 'var(--nuc-ambar-txt)'
    return 'var(--nuc-rojo)'
  }
  // Sin dirección: estándar por signo
  if (variacion >= 0) return 'var(--nuc-verde-txt)'
  if (variacion >= umbralAmb) return 'var(--nuc-ambar-txt)'
  return 'var(--nuc-rojo)'
}

function fmtVar(variacion: number, direccion?: 'Arriba' | 'Abajo'): string {
  const signo = variacion >= 0 ? '▲' : '▼'
  const pct = Math.abs(Math.round(variacion * 100))
  return `${signo} ${pct}%`
}

export function FormatoF1({
  conceptos,
  columnas,
}: FormatoF1Props) {
  const c = {
    colA: 'CONCEPTO',
    colB: 'REAL',
    colC: 'PRESUPUESTO',
    colD: 'VAR',
    colE: 'ANTERIOR',
    colF: 'VAR',
    ...columnas,
  }

  const grid = '1fr 116px 116px 92px 116px 92px'

  return (
    <div style={{ background: 'var(--nuc-surface)', overflow: 'hidden' }}>
      {/* Encabezados */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: grid,
        padding: '9px 18px',
        background: 'var(--nuc-surface-header)',
        borderBottom: '1px solid var(--nuc-border)',
      }}>
        {[c.colA, c.colB, c.colC, c.colD, c.colE, c.colF].map((col, i) => (
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
      {conceptos.map((con) => {
        const bgFila = con.esGrupo || con.esTotal ? 'var(--nuc-surface-header)' : 'var(--nuc-surface)'
        const isTotal = con.esTotal

        return (
          <div
            key={con.id}
            style={{
              display: 'grid',
              gridTemplateColumns: grid,
              padding: isTotal ? '13px 18px' : '8px 18px',
              borderBottom: `1px solid ${isTotal ? 'var(--nuc-border)' : 'var(--nuc-surface-sub)'}`,
              background: bgFila,
              borderTop: isTotal ? '2px solid var(--nuc-ink)' : 'none',
            }}
          >
            {/* Concepto */}
            <div style={{
              paddingLeft: con.sangria ? 18 : 0,
              font: `${con.esGrupo || isTotal ? '700' : '400'} ${isTotal ? '13.5' : '12.5'}px/1 var(--font-geist-sans), sans-serif`,
              color: con.esGrupo || isTotal ? 'var(--nuc-ink)' : 'var(--nuc-ink-2)',
            }}>
              {con.nombre}
            </div>

            {/* Real */}
            <div style={{
              textAlign: 'right',
              font: `${con.esGrupo || isTotal ? '700' : '400'} ${isTotal ? '16' : '12.5'}px/1 var(--font-geist-mono), monospace`,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--nuc-ink)',
            }}>
              {fmtNum(con.real)}
            </div>

            {/* Presupuesto */}
            <div style={{
              textAlign: 'right',
              font: `${con.esGrupo ? '500' : '400'} 12.5px/1 var(--font-geist-mono), monospace`,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--nuc-ink-2)',
            }}>
              {con.presupuesto !== undefined ? fmtNum(con.presupuesto) : '—'}
            </div>

            {/* Var presupuesto */}
            <div style={{
              textAlign: 'right',
              font: `${con.esGrupo || isTotal ? '700' : '600'} ${isTotal ? '13' : '12'}px/1 var(--font-geist-mono), monospace`,
              color: con.varPresupuesto !== undefined
                ? colorVar(con.varPresupuesto, con.direccionDeseable)
                : 'var(--nuc-ink-2)',
            }}>
              {con.varPresupuesto !== undefined ? fmtVar(con.varPresupuesto, con.direccionDeseable) : '—'}
            </div>

            {/* Anterior */}
            <div style={{
              textAlign: 'right',
              font: `${con.esGrupo ? '500' : '400'} 12.5px/1 var(--font-geist-mono), monospace`,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--nuc-ink-2)',
            }}>
              {con.anterior !== undefined ? fmtNum(con.anterior) : '—'}
            </div>

            {/* Var anterior */}
            <div style={{
              textAlign: 'right',
              font: `${con.esGrupo || isTotal ? '700' : '600'} ${isTotal ? '13' : '12'}px/1 var(--font-geist-mono), monospace`,
              color: con.varAnterior !== undefined
                ? colorVar(con.varAnterior, con.direccionDeseable)
                : 'var(--nuc-ink-2)',
            }}>
              {con.varAnterior !== undefined ? fmtVar(con.varAnterior, con.direccionDeseable) : '—'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
