'use client'

// Panel Núcleo AI — 340 px, flota sobre la mesa por la derecha.
// Fondo #F7F8FF, border 1px solid #D5DBF9, border-radius 6px.
// Header: padding 13px 16px, gap 9px, logo 17px, label "CONTEXTO: …" a la derecha.
// Botón enviar: 24×24px, border-radius 4px, bg #00244D (claro) / #2F6BFF (dark).
// Input: una línea, placeholder "Pregunta lo que sea…".
// Símbolo Núcleo acompaña cada respuesta de la máquina. Fuente: ↑ o Send.

import { NucleoLogo } from './nucleo-logo'

interface NucleoPanelProps {
  onCerrar: () => void
}

export function NucleoPanel({ onCerrar }: NucleoPanelProps) {
  return (
    <aside
      aria-label="Núcleo AI"
      style={{
        width: 340,
        minWidth: 340,
        background: 'var(--nuc-surface)',
        border: '1px solid var(--nuc-border)',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Encabezado del panel */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '13px 16px',
          borderBottom: '1px solid var(--nuc-border)',
          flexShrink: 0,
        }}
      >
        <NucleoLogo
          size={17}
          variant="solido"
          style={{ color: 'var(--nuc-acc-link)' }}
        />
        <span
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 12.5,
            fontWeight: 600,
            color: 'var(--nuc-ink)',
          }}
        >
          Núcleo
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '.06em',
            color: 'var(--nuc-ink-3)',
            whiteSpace: 'nowrap',
          }}
        >
          CONTEXTO: TODO EL NÚCLEO
        </span>
      </div>

      {/* Área de mensajes */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 13,
        }}
      >
        {/* Mensaje de bienvenida de la AI */}
        <div
          style={{
            background: 'var(--nuc-surface-header)',
            border: '1px solid var(--nuc-border)',
            borderRadius: 6,
            padding: '14px 15px',
            display: 'flex',
            flexDirection: 'column',
            gap: 11,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 12.5,
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'var(--nuc-ink)',
              margin: 0,
            }}
          >
            Hola. Soy Núcleo, el asistente de ADC Traxión. Puedo explicarte
            indicadores, comparar periodos y orientarte sobre los datos del sistema.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              style={{
                padding: '6px 11px',
                borderRadius: 5,
                border: 'none',
                background: 'var(--nuc-acc)',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 11.5,
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              ¿En qué te ayudo?
            </button>
            <button
              style={{
                padding: '6px 11px',
                borderRadius: 5,
                border: '1px solid var(--nuc-border)',
                background: 'var(--nuc-surface)',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 11.5,
                fontWeight: 600,
                color: 'var(--nuc-ink)',
                cursor: 'pointer',
              }}
            >
              Ver fuentes
            </button>
          </div>
        </div>

        {/* Sugeridas */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '.06em',
              color: 'var(--nuc-ink-3)',
            }}
          >
            SUGERIDO
          </div>
          {['¿Cómo vamos este mes?', 'Comparar contra el mes anterior'].map((s) => (
            <button
              key={s}
              style={{
                padding: '9px 11px',
                borderRadius: 5,
                border: '1px solid var(--nuc-border)',
                background: 'transparent',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 11.5,
                fontWeight: 500,
                color: 'var(--nuc-ink-3)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Campo de entrada */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--nuc-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          placeholder="Pregunta lo que sea…"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 12,
            fontWeight: 400,
            color: 'var(--nuc-ink)',
          }}
        />
        <button
          aria-label="Enviar"
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            border: 'none',
            background: '#00244D',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 12,
            fontWeight: 600,
            color: '#FFFFFF',
            lineHeight: 1,
          }}
        >
          ↑
        </button>
      </div>
    </aside>
  )
}
