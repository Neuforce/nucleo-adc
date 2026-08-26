// Bloque "Trayectoria y resumen" — bloque 5 del panel de detalle.
// Barras de 12 meses: navy #00244D border-radius:2px 2px 0 0
// Mes actual: rgba(0,36,77,.42). Línea objetivo: border-top:1px dashed #8A929E
// Etiquetas: font:500 11px Geist Mono color:#6B7482; mes actual bold #0E1116
// Resumen: grid repeat(3,1fr) border:1px solid #EEF0F3 border-radius:6px
// Ref: design.md §11 bloque 5

import { monedaUnidad, colorEstado } from '../indicadores/utils'
import type { Indicador } from '../indicadores/types'

interface DatoMes {
  mes: string      // "Ene", "Feb", etc.
  real: number | null
  objetivo: number | null
  esActual?: boolean
}

interface BloqueTrayectoriaProps {
  indicador: Indicador
  meses: DatoMes[]
  resumenMejor?: { periodo: string; valor: number }
  resumenPeor?: { periodo: string; valor: number }
  resumenPromedio?: number
}

export function BloqueTrayectoria({
  indicador,
  meses,
  resumenMejor,
  resumenPeor,
  resumenPromedio,
}: BloqueTrayectoriaProps) {
  const ALTURA_GRAFICA = 80

  // Calcular máximo para escalar barras
  const valores = meses.map((m) => m.real ?? 0)
  const objetivos = meses.filter((m) => m.objetivo !== null).map((m) => m.objetivo as number)
  const maxVal = Math.max(...valores, ...objetivos, 1)

  // Posición Y% de la línea de objetivo (tomar el primero no null)
  const objReferencia = meses.find((m) => m.objetivo !== null)?.objetivo ?? null
  const objY = objReferencia !== null ? (1 - objReferencia / maxVal) * 100 : null

  const coloresActual = colorEstado(indicador.avanceObjetivo)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Gráfica de barras */}
      <div
        style={{
          position: 'relative',
          height: ALTURA_GRAFICA + 20,
          background: 'var(--nuc-surface)',
        }}
      >
        {/* Línea de objetivo punteada */}
        {objY !== null && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${objY}%`,
              borderTop: '1px dashed #8A929E',
            }}
          />
        )}

        {/* Barras */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            top: 0,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
          }}
        >
          {meses.map((m) => {
            const h = m.real !== null
              ? Math.max((m.real / maxVal) * 100, 2)
              : 0
            const bgBarra = m.esActual
              ? 'rgba(0,36,77,.42)'
              : '#00244D'

            return (
              <div
                key={m.mes}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${h}%`,
                    background: bgBarra,
                    borderRadius: '2px 2px 0 0',
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Etiquetas de mes */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            gap: 3,
          }}
        >
          {meses.map((m) => (
            <div
              key={m.mes}
              style={{
                flex: 1,
                textAlign: 'center',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 11,
                fontWeight: m.esActual ? 700 : 500,
                color: m.esActual ? 'var(--nuc-ink)' : 'var(--nuc-ink-3)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {m.mes}
            </div>
          ))}
        </div>
      </div>

      {/* Resumen en grid 3 columnas */}
      {(resumenMejor || resumenPeor || resumenPromedio !== undefined) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            border: '1px solid var(--nuc-border-sub)',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          {[
            {
              titulo: 'Mejor mes',
              valor: resumenMejor
                ? monedaUnidad(resumenMejor.valor, indicador.unidadMedidaFormato, true)
                : '—',
              detalle: resumenMejor?.periodo,
            },
            {
              titulo: 'Promedio',
              valor: resumenPromedio !== undefined
                ? monedaUnidad(resumenPromedio, indicador.unidadMedidaFormato, true)
                : '—',
              detalle: '12 meses',
            },
            {
              titulo: 'Peor mes',
              valor: resumenPeor
                ? monedaUnidad(resumenPeor.valor, indicador.unidadMedidaFormato, true)
                : '—',
              detalle: resumenPeor?.periodo,
            },
          ].map((item, i) => (
            <div
              key={item.titulo}
              style={{
                padding: '10px 12px',
                borderLeft: i > 0 ? '1px solid var(--nuc-border-sub)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--nuc-ink-2)',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '.04em',
                }}
              >
                {item.titulo.toUpperCase()}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--nuc-ink)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {item.valor}
              </span>
              {item.detalle && (
                <span
                  style={{
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontSize: 11,
                    fontWeight: 400,
                    color: 'var(--nuc-ink-2)',
                  }}
                >
                  {item.detalle}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
