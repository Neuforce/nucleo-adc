'use client'

// Campo — componente base para formularios del núcleo.
// Anatomía: etiqueta (11.5px/500/Geist) → control (32px/r:8px) → ayuda/error.
// 8 estados: reposo | foco | con-valor | deshabilitado | inválido | advertencia | guardando | guardado
// Ref: design.md §9, doc 09-formularios §01-03

import { useState, useRef, useEffect, ReactNode } from 'react'

export type EstadoCampo =
  | 'reposo'
  | 'foco'
  | 'con-valor'
  | 'deshabilitado'
  | 'invalido'
  | 'advertencia'
  | 'guardando'
  | 'guardado'

interface CampoProps {
  etiqueta: string
  requerido?: boolean
  ayuda?: string
  error?: string
  advertencia?: string
  valor?: string
  onChange?: (v: string) => void
  placeholder?: string
  maxLength?: number
  deshabilitado?: boolean
  estadoExterno?: EstadoCampo
  ancho?: number | string
  tipo?: 'text' | 'email' | 'password' | 'tel'
  children?: ReactNode  // para slots personalizados (lista, combobox, etc.)
}

function IconoInfo({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.2" strokeLinecap="round" style={{ flex: 'none', marginTop: 1 }}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  )
}

function IconoCheck({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.6" strokeLinecap="round" style={{ marginLeft: 'auto', flexShrink: 0 }}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function Campo({
  etiqueta,
  requerido,
  ayuda,
  error,
  advertencia,
  valor = '',
  onChange,
  placeholder,
  maxLength,
  deshabilitado = false,
  estadoExterno,
  ancho,
  tipo = 'text',
}: CampoProps) {
  const [enfocado, setEnfocado] = useState(false)
  const [guardadoVisible, setGuardadoVisible] = useState(false)

  // Calcular estado
  const estado: EstadoCampo = estadoExterno ?? (() => {
    if (deshabilitado) return 'deshabilitado'
    if (error) return 'invalido'
    if (advertencia) return 'advertencia'
    if (guardadoVisible) return 'guardado'
    if (enfocado) return 'foco'
    if (valor) return 'con-valor'
    return 'reposo'
  })()

  // Simular guardado
  useEffect(() => {
    if (estadoExterno === 'guardado') {
      setGuardadoVisible(true)
      const t = setTimeout(() => setGuardadoVisible(false), 2000)
      return () => clearTimeout(t)
    }
  }, [estadoExterno])

  // Borde y anillo según estado
  let borde = 'var(--nuc-border-input)'
  let anillo = 'none'
  if (estado === 'foco') { borde = 'var(--nuc-acc)'; anillo = '0 0 0 3px rgba(var(--nuc-acc-rgb), .18)' }
  if (estado === 'con-valor') { borde = 'var(--nuc-border-input-val)' }
  if (estado === 'invalido') { borde = 'var(--nuc-rojo)'; anillo = '0 0 0 3px rgba(var(--nuc-rojo-rgb), .18)' }
  if (estado === 'advertencia') { borde = 'var(--nuc-ambar)' }
  if (estado === 'deshabilitado') { borde = 'var(--nuc-border)' }

  const etqColor = estado === 'invalido' ? 'var(--nuc-rojo)' : 'var(--nuc-ink)'

  const mensajeAyuda = estado === 'invalido' ? error :
    estado === 'advertencia' ? advertencia :
    estado === 'guardando' ? null :
    ayuda

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: ancho ?? '100%' }}>
      {/* Etiqueta */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          font: '500 11.5px/1 var(--font-geist-sans), sans-serif',
          color: etqColor,
        }}>
          {etiqueta}
          {requerido && (
            <span style={{ color: 'var(--nuc-rojo)', marginLeft: 4, fontFamily: 'var(--font-geist-mono), monospace' }}>*</span>
          )}
        </span>
        {maxLength && (
          <span style={{
            marginLeft: 'auto',
            font: `500 10.5px var(--font-geist-mono), monospace`,
            color: 'var(--nuc-ink-4)',
          }}>
            {valor.length} / {maxLength}
          </span>
        )}
      </div>

      {/* Control */}
      <div style={{
        height: 32,
        border: `1px solid ${borde}`,
        borderRadius: 8,
        background: deshabilitado ? 'var(--nuc-surface-sub)' : 'var(--nuc-surface)',
        boxShadow: anillo,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        gap: 6,
        transition: 'border-color .12s, box-shadow .12s',
      }}>
        <input
          type={tipo}
          value={valor}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setEnfocado(true)}
          onBlur={() => setEnfocado(false)}
          placeholder={placeholder}
          disabled={deshabilitado}
          maxLength={maxLength}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            font: `500 13px/1 var(--font-geist-mono), monospace`,
            fontVariantNumeric: 'tabular-nums',
            color: deshabilitado ? 'var(--nuc-ink-5)' : (valor ? 'var(--nuc-ink)' : 'var(--nuc-ink-4)'),
            minWidth: 0,
          }}
        />
        {/* Indicadores de estado */}
        {estado === 'guardando' && (
          <span style={{ font: '500 10.5px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-4)', whiteSpace: 'nowrap' }}>
            guardando…
          </span>
        )}
        {estado === 'guardado' && <IconoCheck color='var(--nuc-verde-txt)' />}
      </div>

      {/* Ayuda / Error */}
      {estado === 'invalido' && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <IconoInfo color='var(--nuc-rojo)' />
          <span style={{ font: `500 11.5px/1.45 var(--font-geist-sans), sans-serif`, color: 'var(--nuc-rojo)' }}>
            {error}
          </span>
        </div>
      )}
      {estado === 'advertencia' && advertencia && (
        <span style={{ font: `400 11.5px/1.5 var(--font-geist-sans), sans-serif`, color: 'var(--nuc-ambar-txt)' }}>
          {advertencia}
        </span>
      )}
      {estado !== 'invalido' && estado !== 'advertencia' && mensajeAyuda && (
        <span style={{ font: `400 11.5px/1.5 var(--font-geist-sans), sans-serif`, color: 'var(--nuc-ink-2)' }}>
          {mensajeAyuda}
        </span>
      )}
    </div>
  )
}
