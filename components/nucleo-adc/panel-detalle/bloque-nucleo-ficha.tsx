// Bloque "Núcleo y ficha" — bloque 6 del panel de detalle.
// border:1px solid #D5DBF9 background:#F7F8FF border-radius:6px padding:14px 16px
// Texto: font:400 12.5px/1.6 Geist color:#2C3340
// Botón primario: background:#2F6BFF color:#FFFFFF border-radius:5px
// Footer: font:400 11.5px/1.7 Geist color:#6B7482
// Ref: design.md §11

import { NucleoLogo } from '../../shell/nucleo-logo'

interface BloqueNucleoFichaProps {
  resumen: string            // Texto generado por la AI
  fuente?: string            // Cita de fuente
  onPregunta?: () => void   // Abre el panel Núcleo
}

export function BloqueNucleoFicha({
  resumen,
  fuente,
  onPregunta,
}: BloqueNucleoFichaProps) {
  return (
    <div
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

      {/* Botón de acción */}
      {onPregunta && (
        <div>
          <button
            onClick={onPregunta}
            style={{
              padding: '7px 13px',
              borderRadius: 5,
              border: 'none',
              background: '#2F6BFF',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 11.5,
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            Preguntarle a Núcleo
          </button>
        </div>
      )}

      {/* Fuente */}
      {fuente && (
        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 11.5,
            fontWeight: 400,
            lineHeight: 1.7,
            color: 'var(--nuc-ink-3)',
            margin: 0,
          }}
        >
          {fuente}
        </p>
      )}
    </div>
  )
}
