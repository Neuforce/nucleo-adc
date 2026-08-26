// Uso 4 — Matriz de cumplimiento.
// Cuándo: mismas entidades comparando en los mismos indicadores.
// Tabla de cumplimiento con fila de grupo (totales).
// Columna GLOBAL: font:700 16px Geist Mono
// Fila totales: font:700 12.5px Geist, cumplimiento en gris (nunca en color de estado)
// Ref: design.md §11

import { CeldaMatriz } from './celda-matriz'
import { monedaUnidad } from '../indicadores/utils'
import type { DireccionDeseable } from '../indicadores/types'

interface ColumnaIndicador {
  clave: string
  nombre: string
  formato: string
  direccionDeseable: DireccionDeseable
}

interface CeldaDato {
  valor: number | null
  avance: number | null
  varSPLM?: number | null
  varSPLY?: number | null
}

interface FilaEntidad {
  entidad: string
  celdas: Record<string, CeldaDato>  // clave → dato
  avanceGlobal?: number | null
}

interface Uso4Props {
  columnas: ColumnaIndicador[]
  filas: FilaEntidad[]
  onDetalle?: (claveIndicador: string, entidad: string) => void
}

export function Uso4({ columnas, filas, onDetalle }: Uso4Props) {
  // Promedios de avance por columna
  function avancePromedio(clave: string): number | null {
    const valores = filas
      .map((f) => f.celdas[clave]?.avance)
      .filter((v): v is number => v !== null)
    if (valores.length === 0) return null
    return valores.reduce((a, b) => a + b, 0) / valores.length
  }

  return (
    <div
      style={{
        border: '1px solid var(--nuc-border)',
        borderRadius: 6,
        overflow: 'auto',
      }}
    >
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
        {/* Encabezados */}
        <thead>
          <tr style={{ background: 'var(--nuc-surface-sub)' }}>
            <th
              style={{
                padding: '8px 12px',
                textAlign: 'left' as const,
                borderBottom: '1px solid var(--nuc-border)',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '.06em',
                color: 'var(--nuc-ink-3)',
                whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              ENTIDAD
            </th>
            {columnas.map((col) => (
              <th
                key={col.clave}
                style={{
                  padding: '8px 8px',
                  textAlign: 'center' as const,
                  borderBottom: '1px solid var(--nuc-border)',
                  borderLeft: '1px solid var(--nuc-border)',
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--nuc-ink-3)',
                  maxWidth: 120,
                }}
              >
                <span
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.3,
                  }}
                >
                  {col.nombre}
                </span>
              </th>
            ))}
            <th
              style={{
                padding: '8px 8px',
                textAlign: 'center' as const,
                borderBottom: '1px solid var(--nuc-border)',
                borderLeft: '1px solid var(--nuc-border)',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.06em',
                color: 'var(--nuc-ink-3)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              GLOBAL
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Filas de entidades */}
          {filas.map((fila) => (
            <tr key={fila.entidad}>
              <td
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid var(--nuc-border)',
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: 'var(--nuc-ink)',
                  whiteSpace: 'nowrap',
                }}
              >
                {fila.entidad}
              </td>
              {columnas.map((col) => (
                <td
                  key={col.clave}
                  style={{
                    padding: '4px 4px',
                    borderBottom: '1px solid var(--nuc-border)',
                    borderLeft: '1px solid var(--nuc-border)',
                  }}
                  onClick={onDetalle ? () => onDetalle(col.clave, fila.entidad) : undefined}
                >
                  <CeldaMatriz
                    valor={fila.celdas[col.clave]?.valor ?? null}
                    avance={fila.celdas[col.clave]?.avance ?? null}
                    varSPLM={fila.celdas[col.clave]?.varSPLM}
                    varSPLY={fila.celdas[col.clave]?.varSPLY}
                    formato={col.formato}
                    direccionDeseable={col.direccionDeseable}
                  />
                </td>
              ))}
              {/* Global */}
              <td
                style={{
                  padding: '4px 4px',
                  borderBottom: '1px solid var(--nuc-border)',
                  borderLeft: '1px solid var(--nuc-border)',
                }}
              >
                {fila.avanceGlobal !== undefined ? (
                  <div
                    style={{
                      textAlign: 'center',
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {fila.avanceGlobal !== null
                      ? `${(fila.avanceGlobal * 100).toFixed(1)}%`
                      : '—'}
                  </div>
                ) : null}
              </td>
            </tr>
          ))}

          {/* Fila de totales */}
          <tr style={{ background: 'var(--nuc-surface-sub)' }}>
            <td
              style={{
                padding: '8px 12px',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 12.5,
                fontWeight: 700,
                color: 'var(--nuc-ink)',
              }}
            >
              TOTAL / PROM.
            </td>
            {columnas.map((col) => {
              const prom = avancePromedio(col.clave)
              return (
                <td
                  key={col.clave}
                  style={{
                    padding: '8px 8px',
                    textAlign: 'center' as const,
                    borderLeft: '1px solid var(--nuc-border)',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--nuc-ink-2)',  // siempre gris, nunca color de estado
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {prom !== null ? `${(prom * 100).toFixed(1)}%` : '—'}
                </td>
              )
            })}
            <td
              style={{
                padding: '8px 8px',
                borderLeft: '1px solid var(--nuc-border)',
              }}
            />
          </tr>
        </tbody>
      </table>
    </div>
  )
}
