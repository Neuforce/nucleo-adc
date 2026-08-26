'use client'

// Paleta de búsqueda ⌘K — se posa sobre cualquier pantalla.
// No es un tipo de pantalla: es una capa.
// Sombra al flotar. Atajo ⌘K abre/cierra.
// Ref: design.md §8, §15

import { useEffect, useRef, useState } from 'react'

interface ResultadoBusqueda {
  id: string
  titulo: string
  descripcion?: string
  tipo: 'pantalla' | 'indicador' | 'accion'
  href?: string
}

interface BusquedaKProps {
  onCerrar: () => void
}

// Resultados de ejemplo — en producción vendrían de la API
const RESULTADOS_EJEMPLO: ResultadoBusqueda[] = [
  { id: '1', titulo: 'Hub', descripcion: 'Resumen del día', tipo: 'pantalla', href: '/' },
  { id: '2', titulo: 'Indicadores', descripcion: 'Tablero de indicadores', tipo: 'pantalla', href: '/indicadores' },
  { id: '3', titulo: 'Tablero de puesto', descripcion: 'Gerente de sucursal · MG Celaya', tipo: 'pantalla', href: '/indicadores/tablero-puesto' },
  { id: '4', titulo: 'Formularios', descripcion: '11 controles · 8 estados', tipo: 'pantalla', href: '/formularios' },
  { id: '5', titulo: 'Reportes fijos', descripcion: '6 formatos · catálogo cerrado', tipo: 'pantalla', href: '/reportes' },
  { id: '6', titulo: 'Reportes generados', descripcion: '3 plantillas · salidas del MCP', tipo: 'pantalla', href: '/reportes/generados' },
  { id: '7', titulo: 'Pantallas', descripcion: 'Los 11 tipos · catálogo', tipo: 'pantalla', href: '/pantallas' },
  { id: '10', titulo: 'Docs', descripcion: 'Referencia técnica para ingenieros', tipo: 'pantalla', href: '/docs' },
  { id: '8', titulo: 'Tráfico Walk-In', descripcion: 'EMPUJE · MG Celaya', tipo: 'indicador' },
  { id: '9', titulo: 'Utilidad Operativa', descripcion: 'META · Grupo ADC', tipo: 'indicador' },
]

const ICONOS_TIPO: Record<ResultadoBusqueda['tipo'], string> = {
  pantalla: '⊞',
  indicador: '◎',
  accion: '⌘',
}

export function BusquedaK({ onCerrar }: BusquedaKProps) {
  const [query, setQuery] = useState('')
  const [seleccionado, setSeleccionado] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const resultados = query.trim()
    ? RESULTADOS_EJEMPLO.filter(
        (r) =>
          r.titulo.toLowerCase().includes(query.toLowerCase()) ||
          r.descripcion?.toLowerCase().includes(query.toLowerCase())
      )
    : RESULTADOS_EJEMPLO.slice(0, 5)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar()
      if (e.key === 'ArrowDown') setSeleccionado((s) => Math.min(s + 1, resultados.length - 1))
      if (e.key === 'ArrowUp') setSeleccionado((s) => Math.max(s - 1, 0))
      if (e.key === 'Enter' && resultados[seleccionado]?.href) {
        window.location.href = resultados[seleccionado].href!
        onCerrar()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [resultados, seleccionado, onCerrar])

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onCerrar}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--nuc-mesa)',
          opacity: 0.8,
          zIndex: 79,
        }}
      />

      {/* Paleta */}
      <div
        role="dialog"
        aria-label="Búsqueda global"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 80,
          width: 560,
          background: 'var(--nuc-surface)',
          border: '1px solid var(--nuc-border)',
          borderRadius: 8,
          boxShadow: '0 24px 60px rgba(0,36,77,.18)',
          overflow: 'hidden',
        }}
      >
        {/* Campo de búsqueda */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 16px',
            borderBottom: '1px solid var(--nuc-border)',
            height: 52,
          }}
        >
          <span style={{ color: 'var(--nuc-ink-4)', fontSize: 16, lineHeight: 1 }}>⌕</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSeleccionado(0) }}
            placeholder="Buscar en todo el núcleo…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 14,
              fontWeight: 400,
              color: 'var(--nuc-ink)',
            }}
          />
          <kbd
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--nuc-ink-4)',
              border: '1px solid var(--nuc-border)',
              borderRadius: 3,
              padding: '1px 5px',
              lineHeight: 1.4,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Resultados */}
        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          {resultados.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: 'center',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 13,
                color: 'var(--nuc-ink-2)',
              }}
            >
              Sin resultados para "{query}"
            </div>
          ) : (
            <div style={{ padding: 6 }}>
              {resultados.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => {
                    if (r.href) window.location.href = r.href
                    onCerrar()
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: 'none',
                    background: i === seleccionado ? 'var(--nuc-surface-hover)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left' as const,
                  }}
                  onMouseEnter={() => setSeleccionado(i)}
                >
                  <span
                    style={{
                      width: 20,
                      textAlign: 'center',
                      fontSize: 14,
                      color: 'var(--nuc-ink-4)',
                      flexShrink: 0,
                    }}
                  >
                    {ICONOS_TIPO[r.tipo]}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-geist-sans), sans-serif',
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--nuc-ink)',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {r.titulo}
                    </p>
                    {r.descripcion && (
                      <p
                        style={{
                          fontFamily: 'var(--font-geist-sans), sans-serif',
                          fontSize: 11.5,
                          fontWeight: 400,
                          color: 'var(--nuc-ink-2)',
                          margin: 0,
                        }}
                      >
                        {r.descripcion}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: 10.5,
                      fontWeight: 500,
                      color: 'var(--nuc-ink-4)',
                      flexShrink: 0,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {r.tipo.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
