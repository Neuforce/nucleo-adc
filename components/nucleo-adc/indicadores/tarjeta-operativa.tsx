// Tarjeta operativa — nivel 1, personal de piso.
// padding:22px 24px border-radius:8px border:1px solid #E4E6EA
// Número grande: font:600 48px/1 Geist Mono letter-spacing:-.035em
// Frase: font:600 17px/1.3 Geist color de estado — siempre en 2ª persona
// Barra: height:12px background:#EEF0F3 border-radius:6px
// Footer: font:500 12px Geist color:#6B7482 — «Quedan N días» + «Meta NNN»
// Insight: border-top:1px solid #F1F3F6 font:400 12.5px/1.55 Geist color:#5B6472
// Ref: design.md §11

import { colorEstado, monedaUnidad, avancePorcentaje } from './utils'
import type { Indicador } from './types'

interface TarjetaOperativaProps {
  indicador: Indicador
  diasRestantes?: number
  insight?: string
}

export function TarjetaOperativa({
  indicador,
  diasRestantes,
  insight,
}: TarjetaOperativaProps) {
  const sinOperacion = indicador.estatusCalculo === 'SIN_OPERACION'
  const sinObjetivo = indicador.objetivo === null
  const avance = sinObjetivo || sinOperacion ? null : indicador.avanceObjetivo
  const colores = colorEstado(avance)

  const pctAncho = avance !== null ? Math.min(avance * 100, 100) : 0

  // Frase de estado en segunda persona
  function frase(): string {
    if (sinOperacion) return 'Sin operación este periodo.'
    if (sinObjetivo) return 'Sin objetivo definido.'
    if (avance === null) return 'Sin dato disponible.'
    const pct = avance * 100
    if (pct >= 100) return '¡Lo lograste! Objetivo alcanzado.'
    const faltante = (indicador.objetivo ?? 0) - (indicador.valor ?? 0)
    return `Te faltan ${monedaUnidad(faltante, indicador.unidadMedidaFormato, true)}.`
  }

  return (
    <article
      style={{
        borderRadius: 8,
        border: `1px solid var(--nuc-border)`,
        background: 'var(--nuc-surface)',
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* Etiqueta */}
      <p
        style={{
          fontFamily: 'var(--font-geist-sans), sans-serif',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--nuc-ink-2)',
          margin: '0 0 16px',
        }}
      >
        {indicador.nombreIndicador}
      </p>

      {/* Número grande */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 48,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-.035em',
            color: sinOperacion ? 'var(--nuc-ink-2)' : 'var(--nuc-ink)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {sinOperacion ? '—' : monedaUnidad(indicador.valor, indicador.unidadMedidaFormato, false)}
        </span>
        {!sinObjetivo && indicador.objetivo !== null && (
          <span
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 16,
              fontWeight: 500,
              color: 'var(--nuc-ink-3)',
            }}
          >
            de {monedaUnidad(indicador.objetivo, indicador.unidadMedidaFormato, false)}
          </span>
        )}
      </div>

      {/* Frase de estado */}
      <p
        style={{
          fontFamily: 'var(--font-geist-sans), sans-serif',
          fontSize: 17,
          fontWeight: 600,
          lineHeight: 1.3,
          color: colores.texto,
          margin: '0 0 16px',
        }}
      >
        {frase()}
      </p>

      {/* Barra */}
      {!sinObjetivo && !sinOperacion && (
        <div
          style={{
            position: 'relative',
            height: 12,
            background: 'var(--nuc-surface-hover)',
            borderRadius: 6,
            marginBottom: 12,
            overflow: 'visible',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pctAncho}%`,
              background: colores.relleno,
              borderRadius: 6,
            }}
          />
          {/* Marca de meta */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '100%',
              transform: 'translateX(-1px)',
              width: 2,
              height: '100%',
              background: 'var(--nuc-ink)',
            }}
          />
        </div>
      )}

      {/* Footer */}
      {(diasRestantes !== undefined || indicador.objetivo !== null) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: insight ? 12 : 0,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--nuc-ink-3)',
            }}
          >
            {diasRestantes !== undefined ? `Quedan ${diasRestantes} días` : ''}
          </span>
          {indicador.objetivo !== null && (
            <span
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--nuc-ink-3)',
              }}
            >
              Meta {monedaUnidad(indicador.objetivo, indicador.unidadMedidaFormato, false)}
            </span>
          )}
        </div>
      )}

      {/* Insight */}
      {insight && (
        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 12.5,
            fontWeight: 400,
            lineHeight: 1.55,
            color: 'var(--nuc-ink-2)',
            margin: 0,
            paddingTop: 12,
            borderTop: `1px solid var(--nuc-border-sub)`,
          }}
        >
          {insight}
        </p>
      )}
    </article>
  )
}
