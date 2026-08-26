// Bloque "Qué cuenta y qué no" — colapsable, bloque 4 del panel de detalle.
// border:1px solid #EEF0F3 border-radius:6px
// Título: font:600 11px Geist Mono letter-spacing:.07em text-transform:uppercase
// Descripción: font:400 13px/1.6 Geist
// Ref: design.md §11

'use client'

import { useState } from 'react'

interface BloqueDefinicionProps {
  titulo?: string
  descripcion: string
}

export function BloqueDefinicion({
  titulo = 'QUÉ CUENTA Y QUÉ NO',
  descripcion,
}: BloqueDefinicionProps) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div
      style={{
        border: '1px solid var(--nuc-border-sub)',
        borderRadius: 6,
        background: 'var(--nuc-surface)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '.07em',
            textTransform: 'uppercase' as const,
            color: 'var(--nuc-ink-2)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {titulo}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 11,
            color: 'var(--nuc-ink-2)',
            lineHeight: 1,
            transform: abierto ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
          }}
        >
          ▾
        </span>
      </button>

      {abierto && (
        <div
          style={{
            padding: '0 14px 12px',
            borderTop: '1px solid var(--nuc-border-sub)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 13,
              fontWeight: 400,
              lineHeight: 1.6,
              color: '#3D4551',
              margin: '12px 0 0',
            }}
          >
            {descripcion}
          </p>
        </div>
      )}
    </div>
  )
}
