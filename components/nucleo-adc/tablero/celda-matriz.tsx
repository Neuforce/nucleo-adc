// Celda de la matriz — Uso 4 (mismo indicador, múltiples entidades).
// Verde: background:#12332A border:1px solid #1D5344 (dark)
// Ámbar: background:#33280F border:1px solid #57451C
// Rojo: background:#331A18 border:1px solid #5A2B27
// Valor: font:600 17px/1 Geist Mono color:#fff
// Compliance: font:700 12px/1 Geist Mono
// Comparativos: font:500 11px/1 Geist Mono color:#8B98A8
// Minibar: background:#1A2637 height:3px border-radius:2px
// Fila GLOBAL: font:700 16px Geist Mono
// Ref: design.md §11

import { colorEstado, monedaUnidad } from '../indicadores/utils'
import type { DireccionDeseable } from '../indicadores/types'

interface CeldaMatrizProps {
  valor: number | null
  avance: number | null
  varSPLM?: number | null
  varSPLY?: number | null
  formato: string
  direccionDeseable: DireccionDeseable
  esGlobal?: boolean
}

export function CeldaMatriz({
  valor,
  avance,
  varSPLM,
  varSPLY,
  formato,
  direccionDeseable,
  esGlobal = false,
}: CeldaMatrizProps) {
  const colores = colorEstado(avance)

  // Fondos de celda por estado — spec exacta dark
  const bgCelda =
    avance === null ? '#16253A'
    : avance >= 1 ? '#12332A'
    : avance >= 0.8 ? '#33280F'
    : '#331A18'

  const bordeCelda =
    avance === null ? '1px solid #24344A'
    : avance >= 1 ? '1px solid #1D5344'
    : avance >= 0.8 ? '1px solid #57451C'
    : '1px solid #5A2B27'

  const pct = avance !== null ? `${(avance * 100).toFixed(1)}%` : '—'
  const anchoBar = avance !== null ? Math.min(avance * 100, 100) : 0

  return (
    <div
      style={{
        background: bgCelda,
        border: bordeCelda,
        borderRadius: 4,
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minHeight: 68,
      }}
    >
      {/* Valor */}
      <span
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: esGlobal ? 16 : 17,
          fontWeight: esGlobal ? 700 : 600,
          lineHeight: 1,
          color: '#FFFFFF',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {valor !== null ? monedaUnidad(valor, formato, true) : '—'}
      </span>

      {/* Compliance */}
      <span
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 12,
          fontWeight: 700,
          lineHeight: 1,
          color: colores.texto,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {pct}
      </span>

      {/* Comparativos M/A */}
      {(varSPLM !== undefined || varSPLY !== undefined) && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 11,
            fontWeight: 500,
            color: '#8B98A8',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {varSPLM !== undefined && (
            <span>M {varSPLM !== null ? `${(varSPLM * 100).toFixed(0)}%` : '—'}</span>
          )}
          {varSPLY !== undefined && (
            <span>A {varSPLY !== null ? `${(varSPLY * 100).toFixed(0)}%` : '—'}</span>
          )}
        </div>
      )}

      {/* Minibar */}
      <div
        style={{
          height: 3,
          background: '#1A2637',
          borderRadius: 2,
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${anchoBar}%`,
            background: colores.relleno,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  )
}
