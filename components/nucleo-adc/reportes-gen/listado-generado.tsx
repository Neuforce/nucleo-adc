'use client'

// ListadoGenerado — Tipo B: tabla de filas comparables (máx 20 filas, máx 6 columnas).
// Siempre ordenado por lo que se preguntó. Total al pie con regla gruesa.
// Color solo en la columna que responde; resto en tinta neutra.
// Ref: doc 11-reportes-gen §03 Tipo B

export interface ColumnaListado {
  clave: string
  etiqueta: string
  alineacion?: 'left' | 'right'
  esRespuesta?: boolean     // solo esta columna lleva color de estado
  esIdentificador?: boolean // primera columna: identifica la fila
}

export interface FilaListado {
  id: string
  [key: string]: unknown
}

export interface TotalListado {
  [key: string]: string | number | null | undefined
  _etiqueta?: string       // e.g. '4 de 6 sucursales'
}

interface ListadoGeneradoProps {
  columnas: ColumnaListado[]
  filas: FilaListado[]
  total?: TotalListado
}

function colorRespuesta(val: unknown): string {
  if (typeof val !== 'number' && typeof val !== 'string') return 'var(--nuc-ink)'
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace('%', '')) / 100
  if (isNaN(num)) return 'var(--nuc-ink)'
  if (num >= 1) return 'var(--nuc-verde-txt)'
  if (num >= 0.80) return 'var(--nuc-ambar-txt)'
  return 'var(--nuc-rojo)'
}

function formatearValor(val: unknown): string {
  if (val === null || val === undefined) return '—'
  return String(val)
}

export function ListadoGenerado({
  columnas,
  filas,
  total,
}: ListadoGeneradoProps) {
  // Máx 20 filas, máx 6 columnas
  const filasVisibles = filas.slice(0, 20)
  const colsVisibles = columnas.slice(0, 6)

  const gridTemplate = colsVisibles.map((col, i) => {
    if (col.esIdentificador || i === 0) return '1fr'
    return '90px'
  }).join(' ')

  return (
    <div style={{
      border: '1px solid var(--nuc-border-sub)',
      borderRadius: 6,
      overflow: 'hidden',
    }}>
      {/* Encabezados */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: gridTemplate,
        padding: '9px 14px',
        background: 'var(--nuc-surface-header)',
        borderBottom: '1px solid var(--nuc-border-sub)',
        gap: 0,
      }}>
        {colsVisibles.map((col) => (
          <div
            key={col.clave}
            style={{
              textAlign: col.alineacion ?? (col.esIdentificador ? 'left' : 'right'),
              font: '600 11px var(--font-geist-mono), monospace',
              letterSpacing: '.07em',
              color: 'var(--nuc-ink-3)',
              padding: '0 4px',
            }}
          >
            {col.etiqueta}
          </div>
        ))}
      </div>

      {/* Filas */}
      {filasVisibles.map((fila) => (
        <div
          key={fila.id}
          style={{
            display: 'grid',
            gridTemplateColumns: gridTemplate,
            alignItems: 'center',
            padding: '10px 14px',
            borderBottom: '1px solid var(--nuc-surface-sub)',
            background: 'var(--nuc-surface)',
            gap: 0,
          }}
        >
          {colsVisibles.map((col) => {
            const val = fila[col.clave]
            const esResp = col.esRespuesta
            const color = esResp ? colorRespuesta(val) : 'var(--nuc-ink)'

            return (
              <div
                key={col.clave}
                style={{
                  textAlign: col.alineacion ?? (col.esIdentificador ? 'left' : 'right'),
                  font: `${esResp ? '600' : '500'} ${col.esIdentificador ? '12.5' : '12.5'}px var(--font-geist-${col.esIdentificador ? 'sans' : 'mono'}), ${col.esIdentificador ? 'sans-serif' : 'monospace'}`,
                  fontVariantNumeric: 'tabular-nums',
                  color: col.esIdentificador ? 'var(--nuc-ink)' : color,
                  padding: '0 4px',
                }}
              >
                {formatearValor(val)}
              </div>
            )
          })}
        </div>
      ))}

      {/* Total al pie con regla gruesa */}
      {total && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: gridTemplate,
          alignItems: 'center',
          padding: '11px 14px',
          background: 'var(--nuc-surface-header)',
          borderTop: '1px solid var(--nuc-ink)',
          gap: 0,
        }}>
          {colsVisibles.map((col, i) => {
            const val = total[col.clave]
            const esIdent = col.esIdentificador || i === 0

            return (
              <div
                key={col.clave}
                style={{
                  textAlign: col.alineacion ?? (esIdent ? 'left' : 'right'),
                  font: `700 ${esIdent ? '12.5' : '12.5'}px var(--font-geist-${esIdent ? 'sans' : 'mono'}), ${esIdent ? 'sans-serif' : 'monospace'}`,
                  fontVariantNumeric: 'tabular-nums',
                  color: col.esRespuesta ? colorRespuesta(val) : 'var(--nuc-ink)',
                  padding: '0 4px',
                }}
              >
                {i === 0 && total._etiqueta
                  ? total._etiqueta
                  : formatearValor(val)}
              </div>
            )
          })}
        </div>
      )}

      {filas.length > 20 && (
        <div style={{
          padding: '8px 14px',
          font: '400 11px var(--font-geist-sans), sans-serif',
          color: 'var(--nuc-ink-3)',
          borderTop: '1px solid var(--nuc-border-sub)',
          background: 'var(--nuc-surface-header)',
        }}>
          +{filas.length - 20} filas en el export
        </div>
      )}
    </div>
  )
}
