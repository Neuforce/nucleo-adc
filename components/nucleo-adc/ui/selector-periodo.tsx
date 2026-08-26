'use client'

// Selector de periodo — control de 30px para la mesa.
// height:30px border-radius:6px border:1px solid #D8DCE2
// font:500 12px Geist Mono color:#0E1116
// Usa dropdown personalizado (position:absolute top:100%) para posicionamiento
// exacto — los <select> nativos calculan espacio desde la ventana y pueden
// abrir hacia arriba dentro de contenedores con overflow:auto.
// Ref: design.md §9, §5

import { useState, useRef, useEffect } from 'react'

interface SelectorPeriodoProps {
  anio: number
  mes: number              // 1–12
  onCambiar: (anio: number, mes: number) => void
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

interface DropdownProps {
  valor: string
  opciones: { valor: string; etiqueta: string }[]
  onChange: (v: string) => void
  ancho?: number
}

function Dropdown({ valor, opciones, onChange, ancho = 120 }: DropdownProps) {
  const [abierto, setAbierto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!abierto) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [abierto])

  // Cerrar con Escape
  useEffect(() => {
    if (!abierto) return
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [abierto])

  const etiquetaActual = opciones.find((o) => o.valor === valor)?.etiqueta ?? valor

  return (
    <div ref={ref} style={{ position: 'relative', width: ancho }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        style={{
          width: '100%',
          height: 30,
          paddingLeft: 10,
          paddingRight: 28,
          borderRadius: 6,
          border: `1px solid ${abierto ? 'var(--nuc-acc)' : 'var(--nuc-border-input)'}`,
          boxShadow: abierto ? '0 0 0 3px rgba(47,107,255,.14)' : 'none',
          background: 'var(--nuc-surface)',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--nuc-ink)',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          outline: 'none',
          fontVariantNumeric: 'tabular-nums',
          position: 'relative',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        aria-haspopup="listbox"
        aria-expanded={abierto}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {etiquetaActual}
        </span>
        {/* Chevron */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 9,
            top: '50%',
            transform: `translateY(-50%) rotate(${abierto ? '180deg' : '0deg'})`,
            transition: 'transform 0.12s',
            fontSize: 10,
            color: 'var(--nuc-ink-4)',
            lineHeight: 1,
            pointerEvents: 'none',
          }}
        >
          ▾
        </span>
      </button>

      {/* Lista — siempre abre hacia abajo */}
      {abierto && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 90,
            width: '100%',
            maxHeight: 220,
            overflowY: 'auto',
            background: 'var(--nuc-surface)',
            border: `1px solid var(--nuc-border-input)`,
            borderRadius: 6,
            boxShadow: '0 8px 24px rgba(0,36,77,.12)',
            listStyle: 'none',
            margin: 0,
            padding: '4px 0',
          }}
        >
          {opciones.map((op) => {
            const activa = op.valor === valor
            return (
              <li
                key={op.valor}
                role="option"
                aria-selected={activa}
                onClick={() => { onChange(op.valor); setAbierto(false) }}
                style={{
                  padding: '5px 10px',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 12,
                  fontWeight: activa ? 600 : 500,
                  color: activa ? '#00244D' : 'var(--nuc-ink)',
                  background: activa ? 'var(--nuc-surface-hover)' : 'transparent',
                  cursor: 'pointer',
                  fontVariantNumeric: 'tabular-nums',
                }}
                onMouseEnter={(e) => {
                  if (!activa) (e.currentTarget as HTMLElement).style.background = 'var(--nuc-surface-sub)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = activa ? 'var(--nuc-surface-hover)' : 'transparent'
                }}
              >
                {op.etiqueta}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function SelectorPeriodo({
  anio,
  mes,
  onCambiar,
}: SelectorPeriodoProps) {
  const anioActual = new Date().getFullYear()

  const opcionesMes = MESES.map((nombre, i) => ({
    valor: String(i + 1),
    etiqueta: nombre,
  }))

  const opcionesAnio = [anioActual - 1, anioActual, anioActual + 1].map((a) => ({
    valor: String(a),
    etiqueta: String(a),
  }))

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Dropdown
        valor={String(mes)}
        opciones={opcionesMes}
        onChange={(v) => onCambiar(anio, Number(v))}
        ancho={132}
      />
      <Dropdown
        valor={String(anio)}
        opciones={opcionesAnio}
        onChange={(v) => onCambiar(Number(v), mes)}
        ancho={76}
      />
    </div>
  )
}
