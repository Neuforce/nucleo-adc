'use client'

// Combobox — lista larga (12+ ítems) con búsqueda.
// Muestra la clave en mono (lo que se dicta por teléfono).
// Ref: doc 09-formularios §02 LISTA LARGA

import { useState, useRef, useEffect } from 'react'

export interface OpcionCombobox {
  clave: string
  etiqueta: string
  grupo?: string
}

interface ComboboxProps {
  etiqueta: string
  requerido?: boolean
  opciones: OpcionCombobox[]
  valor?: string           // clave seleccionada
  onSeleccionar: (clave: string, etiqueta: string) => void
  ayuda?: string
  error?: string
  placeholder?: string
  ancho?: number | string
}

export function Combobox({
  etiqueta,
  requerido,
  opciones,
  valor,
  onSeleccionar,
  ayuda,
  error,
  placeholder = 'Buscar…',
  ancho = '100%',
}: ComboboxProps) {
  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const tieneError = !!error
  const opcionSeleccionada = opciones.find((o) => o.clave === valor)

  // Cerrar al clic externo
  useEffect(() => {
    if (!abierto) return
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [abierto])

  // Cerrar con Escape
  useEffect(() => {
    if (!abierto) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [abierto])

  const filtradas = opciones.filter((o) => {
    const q = busqueda.toLowerCase()
    return o.clave.toLowerCase().includes(q) || o.etiqueta.toLowerCase().includes(q)
  })

  const colorEtq = tieneError ? 'var(--nuc-rojo)' : 'var(--nuc-ink)'

  const borde = tieneError ? 'var(--nuc-rojo)' :
    abierto ? 'var(--nuc-acc)' :
    valor ? 'var(--nuc-border-input-val)' :
    'var(--nuc-border-input)'

  const anilloActivo = abierto ? '0 0 0 3px rgba(var(--nuc-acc-rgb), .18)' : 'none'

  function abrir() {
    setAbierto(true)
    setBusqueda('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function seleccionar(op: OpcionCombobox) {
    onSeleccionar(op.clave, op.etiqueta)
    setAbierto(false)
    setBusqueda('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: ancho }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ font: '500 11.5px var(--font-geist-sans), sans-serif', color: colorEtq }}>
          {etiqueta}
          {requerido && <span style={{ color: 'var(--nuc-rojo)', marginLeft: 4 }}>*</span>}
        </span>
      </div>

      <div ref={ref} style={{ position: 'relative' }}>
        {/* Trigger / Input */}
        {abierto ? (
          <div style={{
            border: `1px solid var(--nuc-acc)`,
            borderRadius: '8px 8px 0 0',
            borderBottom: 'none',
            background: 'var(--nuc-surface)',
            boxShadow: anilloActivo,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 10,
            gap: 7,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke='var(--nuc-ink-2)'
              strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por clave o nombre…"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                font: '400 13px var(--font-geist-sans), sans-serif',
                color: 'var(--nuc-ink)',
                minWidth: 0,
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={abrir}
            style={{
              width: '100%',
              height: 32,
              border: `1px solid ${borde}`,
              borderRadius: 8,
              background: 'var(--nuc-surface)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              gap: 8,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {opcionSeleccionada ? (
              <>
                <span style={{ font: '500 12.5px var(--font-geist-mono), monospace', color: 'var(--nuc-acc-link)', flexShrink: 0 }}>
                  {opcionSeleccionada.clave}
                </span>
                <span style={{ font: '400 13px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)', flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {opcionSeleccionada.etiqueta}
                </span>
              </>
            ) : (
              <span style={{ font: '400 13px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-4)', flex: 1, textAlign: 'left' }}>
                {placeholder}
              </span>
            )}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke='var(--nuc-ink-2)'
              strokeWidth="2" strokeLinecap="round" style={{ marginLeft: 'auto', flexShrink: 0 }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        )}

        {/* Lista desplegable */}
        {abierto && (
          <div style={{
            position: 'absolute',
            top: 32,
            left: 0,
            right: 0,
            zIndex: 90,
            border: `1px solid var(--nuc-acc)`,
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            background: 'var(--nuc-surface)',
            maxHeight: 220,
            overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0,36,77,.12)',
            padding: '4px 0',
          }}>
            {filtradas.length === 0 ? (
              <div style={{ padding: '8px 10px', font: '400 12px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-2)' }}>
                Sin resultados
              </div>
            ) : filtradas.map((op) => {
              const activa = op.clave === valor
              return (
                <div
                  key={op.clave}
                  onClick={() => seleccionar(op)}
                  style={{
                    padding: '5px 7px',
                    borderRadius: 5,
                    margin: '0 4px',
                    background: activa ? 'var(--nuc-surface-hover)' : 'transparent',
                    display: 'flex',
                    gap: 8,
                    cursor: 'pointer',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    if (!activa) (e.currentTarget as HTMLElement).style.background = 'var(--nuc-surface-sub)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = activa ? 'var(--nuc-surface-hover)' : 'transparent'
                  }}
                >
                  <span style={{
                    font: '500 11.5px var(--font-geist-mono), monospace',
                    color: activa ? 'var(--nuc-acc-link)' : 'var(--nuc-ink-2)',
                    flexShrink: 0,
                    width: 48,
                  }}>
                    {op.clave}
                  </span>
                  <span style={{
                    font: `${activa ? '500' : '400'} 11.5px var(--font-geist-sans), sans-serif`,
                    color: activa ? 'var(--nuc-ink)' : 'var(--nuc-ink-3)',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {op.etiqueta}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {tieneError ? (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke='var(--nuc-rojo)'
            strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
          </svg>
          <span style={{ font: '500 11.5px/1.45 var(--font-geist-sans), sans-serif', color: 'var(--nuc-rojo)' }}>{error}</span>
        </div>
      ) : ayuda ? (
        <span style={{ font: '400 11.5px/1.5 var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-2)' }}>{ayuda}</span>
      ) : null}
    </div>
  )
}
