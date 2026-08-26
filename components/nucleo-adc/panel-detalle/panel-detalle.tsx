'use client'

// Panel de detalle de indicador — 460px, entra por la derecha.
// width:460px border:1px solid #E4E6EA border-radius:8px background:#FFFFFF
// box-shadow:0 8px 30px rgba(0,36,77,.1)
// 6 bloques en orden fijo: encabezado · real/objetivo · periodos · definición · trayectoria · núcleo
// Ref: design.md §11

import { BloqueRealObjetivo } from './bloque-real-objetivo'
import { BloquePeriodos } from './bloque-periodos'
import { BloqueDefinicion } from './bloque-definicion'
import { BloqueTrayectoria } from './bloque-trayectoria'
import { BloqueNucleoFicha } from './bloque-nucleo-ficha'
import type { Indicador } from '../indicadores/types'

interface DatoMes {
  mes: string
  real: number | null
  objetivo: number | null
  esActual?: boolean
}

interface FilaPeriodo {
  periodo: string
  real: number | null
  objetivo: number | null
  avance: number | null
}

interface PanelDetalleProps {
  indicador: Indicador
  meses?: DatoMes[]
  filasPeriodos?: FilaPeriodo[]
  definicion?: string
  resumenNucleo?: string
  fuenteNucleo?: string
  onCerrar: () => void
  onPreguntarNucleo?: () => void
}

export function PanelDetalle({
  indicador,
  meses = [],
  filasPeriodos = [],
  definicion,
  resumenNucleo,
  fuenteNucleo,
  onCerrar,
  onPreguntarNucleo,
}: PanelDetalleProps) {
  // Calcular resumen para la trayectoria
  const valoresReales = meses.map((m) => m.real).filter((v): v is number => v !== null)
  const resumenMejor = valoresReales.length > 0
    ? {
        valor: Math.max(...valoresReales),
        periodo: meses.find((m) => m.real === Math.max(...valoresReales))?.mes ?? '',
      }
    : undefined
  const resumenPeor = valoresReales.length > 0
    ? {
        valor: Math.min(...valoresReales),
        periodo: meses.find((m) => m.real === Math.min(...valoresReales))?.mes ?? '',
      }
    : undefined
  const resumenPromedio = valoresReales.length > 0
    ? valoresReales.reduce((a, b) => a + b, 0) / valoresReales.length
    : undefined

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onCerrar}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 39,
        }}
      />

      {/* Panel */}
      <div
        role="complementary"
        aria-label={`Detalle: ${indicador.nombreIndicador}`}
        style={{
          position: 'fixed',
          top: 52,            // debajo del encabezado
          right: 0,
          bottom: 0,
          zIndex: 40,
          width: 460,
          background: 'var(--nuc-surface)',
          border: '1px solid var(--nuc-border)',
          borderRadius: '8px 0 0 8px',
          boxShadow: '0 8px 30px rgba(0,36,77,.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Encabezado del panel */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--nuc-border)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 19,
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: '-.015em',
                color: 'var(--nuc-ink)',
                margin: '0 0 4px',
              }}
            >
              {indicador.nombreIndicador}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 12,
                fontWeight: 400,
                lineHeight: 1.45,
                color: 'var(--nuc-ink-2)',
                margin: 0,
              }}
            >
              {indicador.nivelNombre} · {indicador.tipoIndicadorNombre} · {indicador.fecha}
            </p>
          </div>

          <button
            onClick={onCerrar}
            aria-label="Cerrar panel"
            style={{
              width: 28,
              height: 28,
              borderRadius: 5,
              border: '1px solid var(--nuc-border)',
              background: 'transparent',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 14,
              color: 'var(--nuc-ink-2)',
            }}
          >
            ×
          </button>
        </div>

        {/* Cuerpo scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Bloque 2: Real y objetivo */}
          <BloqueRealObjetivo indicador={indicador} />

          {/* Bloque 3: Periodos comparables */}
          {filasPeriodos.length > 0 && (
            <BloquePeriodos indicador={indicador} filas={filasPeriodos} />
          )}

          {/* Bloque 4: Qué cuenta y qué no */}
          {definicion && (
            <BloqueDefinicion descripcion={definicion} />
          )}

          {/* Bloque 5: Trayectoria */}
          {meses.length > 0 && (
            <BloqueTrayectoria
              indicador={indicador}
              meses={meses}
              resumenMejor={resumenMejor}
              resumenPeor={resumenPeor}
              resumenPromedio={resumenPromedio}
            />
          )}

          {/* Bloque 6: Núcleo y ficha */}
          {resumenNucleo && (
            <BloqueNucleoFicha
              resumen={resumenNucleo}
              fuente={fuenteNucleo}
              onPregunta={onPreguntarNucleo}
            />
          )}
        </div>
      </div>
    </>
  )
}
