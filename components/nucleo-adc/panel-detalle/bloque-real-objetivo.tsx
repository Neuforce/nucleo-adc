// Bloque "Real y objetivo" — bloque 2 del panel de detalle.
// background:#FBFBFC border:1px solid #EEF0F3 border-radius:6px padding:14px 16px
// REAL: font:600 30px/1 Geist Mono letter-spacing:-.035em color:#0E1116
// OBJETIVO: font:500 22px/1 Geist Mono color:#5B6472
// Frase: font:500 12px Geist color:#5B6472
// Ref: design.md §11 bloque 2

import { colorEstado, monedaUnidad, avancePorcentaje } from '../indicadores/utils'
import type { Indicador } from '../indicadores/types'

interface BloqueRealObjetivoProps {
  indicador: Indicador
}

export function BloqueRealObjetivo({ indicador }: BloqueRealObjetivoProps) {
  const sinOperacion = indicador.estatusCalculo === 'SIN_OPERACION'
  const sinObjetivo = indicador.objetivo === null
  const avance = sinObjetivo || sinOperacion ? null : indicador.avanceObjetivo
  const colores = colorEstado(avance)

  const valorDisplay = sinOperacion
    ? '—'
    : monedaUnidad(indicador.valor, indicador.unidadMedidaFormato, false)

  const objetivoDisplay = indicador.objetivo !== null
    ? monedaUnidad(indicador.objetivo, indicador.unidadMedidaFormato, false)
    : null

  const pct = avancePorcentaje(avance)

  // Frase descriptiva del estado
  let frase = ''
  if (sinOperacion) {
    frase = 'Sin operación en el periodo.'
  } else if (sinObjetivo) {
    frase = 'Sin objetivo definido para este periodo.'
  } else if (avance !== null) {
    const pctNum = avance * 100
    if (pctNum >= 100) frase = 'Objetivo alcanzado.'
    else if (pctNum >= 80) frase = `Falta ${(100 - pctNum).toFixed(1)} pp para el objetivo.`
    else frase = `Brecha de ${(100 - pctNum).toFixed(1)} pp al objetivo.`
  }

  return (
    <div
      style={{
        background: 'var(--nuc-surface-header)',
        border: '1px solid var(--nuc-border-sub)',
        borderRadius: 6,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        {/* REAL */}
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-.035em',
            color: 'var(--nuc-ink)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {valorDisplay}
        </span>

        {/* OBJETIVO */}
        {objetivoDisplay && (
          <span
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 22,
              fontWeight: 500,
              lineHeight: 1,
              color: 'var(--nuc-ink-2)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            / {objetivoDisplay}
          </span>
        )}

        {/* Porcentaje — solo si hay objetivo */}
        {!sinObjetivo && !sinOperacion && avance !== null && (
          <span
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 14,
              fontWeight: 700,
              color: colores.texto,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pct}
          </span>
        )}
      </div>

      {frase && (
        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--nuc-ink-2)',
            margin: 0,
          }}
        >
          {frase}
        </p>
      )}
    </div>
  )
}
