'use client'

// Campo Cifra — input numérico mono, tabular, alineado a la derecha.
// Prefijo $ o sufijo % se muestra dentro del control.
// Ref: doc 09-formularios §02 CIFRA

import { useState } from 'react'

interface CampoCifraProps {
  etiqueta: string
  requerido?: boolean
  valor?: string
  onChange?: (v: string) => void
  ayuda?: string
  error?: string
  prefijo?: string    // e.g. '$'
  sufijo?: string     // e.g. '%'
  ancho?: number
  deshabilitado?: boolean
}

export function CampoCifra({
  etiqueta,
  requerido,
  valor = '',
  onChange,
  ayuda,
  error,
  prefijo,
  sufijo,
  ancho = 150,
  deshabilitado = false,
}: CampoCifraProps) {
  const [enfocado, setEnfocado] = useState(false)

  const tieneError = !!error
  const colorEtq = tieneError ? 'var(--nuc-rojo)' : 'var(--nuc-ink)'

  let borde = 'var(--nuc-border-input)'
  let anillo = 'none'
  if (enfocado && !tieneError) { borde = 'var(--nuc-acc)'; anillo = '0 0 0 3px rgba(var(--nuc-acc-rgb), .18)' }
  if (valor && !enfocado && !tieneError) borde = 'var(--nuc-border-input-val)'
  if (tieneError) { borde = 'var(--nuc-rojo)'; anillo = '0 0 0 3px rgba(var(--nuc-rojo-rgb), .18)' }
  if (deshabilitado) { borde = 'var(--nuc-border)'; anillo = 'none' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: ancho }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ font: '500 11.5px var(--font-geist-sans), sans-serif', color: colorEtq }}>
          {etiqueta}
          {requerido && <span style={{ color: 'var(--nuc-rojo)', marginLeft: 4 }}>*</span>}
        </span>
      </div>

      <div style={{
        height: 32,
        border: `1px solid ${borde}`,
        borderRadius: 8,
        background: deshabilitado ? 'var(--nuc-surface-sub)' : 'var(--nuc-surface)',
        boxShadow: anillo,
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        gap: 6,
        transition: 'border-color .12s, box-shadow .12s',
      }}>
        {prefijo && (
          <span style={{
            font: '500 12px var(--font-geist-mono), monospace',
            color: 'var(--nuc-ink-4)',
            flexShrink: 0,
          }}>
            {prefijo}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          value={valor}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setEnfocado(true)}
          onBlur={() => setEnfocado(false)}
          disabled={deshabilitado}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            font: '600 13px var(--font-geist-mono), monospace',
            fontVariantNumeric: 'tabular-nums',
            color: deshabilitado ? 'var(--nuc-ink-5)' : 'var(--nuc-ink)',
            textAlign: 'right',
            minWidth: 0,
          }}
        />
        {sufijo && (
          <span style={{
            font: '500 12px var(--font-geist-mono), monospace',
            color: 'var(--nuc-ink-4)',
            flexShrink: 0,
          }}>
            {sufijo}
          </span>
        )}
      </div>

      {tieneError ? (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke='var(--nuc-rojo)'
            strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
          </svg>
          <span style={{ font: '500 11.5px/1.45 var(--font-geist-sans), sans-serif', color: 'var(--nuc-rojo)' }}>
            {error}
          </span>
        </div>
      ) : ayuda ? (
        <span style={{ font: '400 11.5px/1.5 var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-2)' }}>
          {ayuda}
        </span>
      ) : null}
    </div>
  )
}
