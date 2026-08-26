// Panel Núcleo en el Hub — resumen del día generado por la AI.
// Mismo lenguaje que el panel Núcleo pero en modo tarjeta embebida.
// Símbolo Núcleo + texto + máx 3 acciones ejecutables.
// Ref: design.md §22, §8

import { NucleoLogo } from '../../shell/nucleo-logo'

interface AccionNucleo {
  id: string
  etiqueta: string
  onClick: () => void
}

interface PanelNucleoHubProps {
  resumen: string           // Frase de apertura del día
  acciones?: AccionNucleo[] // Máximo 3
  fuente?: string
}

export function PanelNucleoHub({
  resumen,
  acciones = [],
  fuente,
}: PanelNucleoHubProps) {
  return (
    <section
      style={{
        border: '1px solid #D5DBF9',
        background: '#F7F8FF',
        borderRadius: 6,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Símbolo + texto */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <NucleoLogo size={16} variant="solido" style={{ color: '#2F6BFF' }} />
        </div>
        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 12.5,
            fontWeight: 400,
            lineHeight: 1.6,
            color: '#2C3340',
            margin: 0,
          }}
        >
          {resumen}
        </p>
      </div>

      {/* Acciones ejecutables — máximo 3 */}
      {acciones.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {acciones.slice(0, 3).map((a, i) => (
            <button
              key={a.id}
              onClick={a.onClick}
              style={{
                padding: '6px 12px',
                borderRadius: 5,
                border: i === 0 ? 'none' : '1px solid #D5DBF9',
                background: i === 0 ? '#2F6BFF' : '#FFFFFF',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 11.5,
                fontWeight: 600,
                color: i === 0 ? '#FFFFFF' : '#0E1116',
                cursor: 'pointer',
              }}
            >
              {a.etiqueta}
            </button>
          ))}
        </div>
      )}

      {/* Fuente — obligatoria si la AI publicó algo */}
      {fuente && (
        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 11.5,
            fontWeight: 400,
            color: 'var(--nuc-ink-3)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {fuente}
        </p>
      )}
    </section>
  )
}
