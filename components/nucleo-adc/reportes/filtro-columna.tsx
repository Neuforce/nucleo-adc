'use client'

// FiltroColumna — popup de filtro que se abre al hacer clic en un encabezado de columna.
// 3 tipos: grupo-valores | rango | contiene
// Header azul, pie con Aplicar/Cancelar.
// Ref: doc 10-reportes-fijos §01 cada encabezado de columna es un filtro

import { useState, useRef, useEffect } from 'react'

// Tipo A: grupo de valores (catálogo/estatus)
export interface ValorGrupo {
  valor: string
  count: number
}

// Tipo B: rango
// Tipo C: contiene

type TipoFiltro = 'grupo-valores' | 'rango' | 'contiene'

interface FiltroColumnaBaseProps {
  columna: string
  onAplicar: (filtro: unknown) => void
  onCancelar: () => void
}

interface FiltroGrupoValoresProps extends FiltroColumnaBaseProps {
  tipo: 'grupo-valores'
  valores: ValorGrupo[]
  seleccionados: string[]
  onCambiarSeleccion: (vals: string[]) => void
}

interface FiltroRangoProps extends FiltroColumnaBaseProps {
  tipo: 'rango'
  desde?: number
  hasta?: number
  onCambiarDesde: (v?: number) => void
  onCambiarHasta: (v?: number) => void
  distribucion?: number[]  // alturas relativas para mini histograma
  atajos?: { etiqueta: string; desde?: number; hasta?: number }[]
}

interface FiltroContieneProps extends FiltroColumnaBaseProps {
  tipo: 'contiene'
  modo: 'contiene' | 'empieza-con' | 'exacto'
  onCambiarModo: (m: 'contiene' | 'empieza-con' | 'exacto') => void
  texto: string
  onCambiarTexto: (t: string) => void
  coincidencias?: number
}

type FiltroColumnaProps = FiltroGrupoValoresProps | FiltroRangoProps | FiltroContieneProps

export function FiltroColumna(props: FiltroColumnaProps) {
  const { columna, onAplicar, onCancelar } = props

  const estiloBase: React.CSSProperties = {
    background: 'var(--nuc-surface)',
    border: '1px solid var(--nuc-border-input)',
    borderRadius: 6,
    boxShadow: '0 6px 20px rgba(0,36,77,.08)',
    overflow: 'hidden',
    width: 240,
  }

  const Header = () => (
    <div style={{
      padding: '8px 12px',
      borderBottom: '1px solid var(--nuc-border)',
      background: '#EAF0FB',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    }}>
      <span style={{ font: '700 11px var(--font-geist-mono), monospace', letterSpacing: '.07em', color: 'var(--nuc-acc)', flex: 1 }}>
        {columna}
      </span>
      {props.tipo === 'grupo-valores' && (
        <span
          onClick={() => props.onCambiarSeleccion([])}
          style={{ font: '600 11px var(--font-geist-sans), sans-serif', color: 'var(--nuc-acc)', cursor: 'pointer' }}
        >
          Limpiar
        </span>
      )}
    </div>
  )

  const Pie = () => (
    <div style={{
      padding: '9px 12px',
      borderTop: '1px solid var(--nuc-border)',
      display: 'flex',
      gap: 7,
      background: 'var(--nuc-surface-header)',
    }}>
      <button
        type="button"
        onClick={() => onAplicar(null)}
        style={{
          padding: '5px 11px',
          borderRadius: 4,
          background: 'var(--nuc-acc)',
          border: 'none',
          color: '#FFFFFF',
          font: '600 11px var(--font-geist-sans), sans-serif',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        Aplicar
      </button>
      <button
        type="button"
        onClick={onCancelar}
        style={{
          padding: '5px 11px',
          borderRadius: 4,
          border: '1px solid var(--nuc-border-input)',
          background: 'transparent',
          color: 'var(--nuc-ink)',
          font: '600 11px var(--font-geist-sans), sans-serif',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        Cancelar
      </button>
    </div>
  )

  if (props.tipo === 'grupo-valores') {
    const [busquedaLocal, setBusquedaLocal] = useState('')
    const filtrados = props.valores.filter(v =>
      v.valor.toLowerCase().includes(busquedaLocal.toLowerCase())
    )
    const mostrarBuscador = props.valores.length >= 8

    return (
      <div style={estiloBase}>
        <Header />
        {mostrarBuscador && (
          <div style={{
            padding: '8px 12px',
            borderBottom: '1px solid var(--nuc-border)',
            font: '400 11.5px var(--font-geist-sans), sans-serif',
            color: 'var(--nuc-ink-3)',
          }}>
            <input
              type="text"
              value={busquedaLocal}
              onChange={(e) => setBusquedaLocal(e.target.value)}
              placeholder="Buscar valor…"
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                font: 'inherit', color: 'inherit', width: '100%',
              }}
            />
          </div>
        )}
        <div style={{ padding: '4px 0', maxHeight: 200, overflowY: 'auto' }}>
          {filtrados.map((v) => {
            const seleccionado = props.seleccionados.includes(v.valor)
            return (
              <div
                key={v.valor}
                onClick={() => {
                  const nuevos = seleccionado
                    ? props.seleccionados.filter(s => s !== v.valor)
                    : [...props.seleccionados, v.valor]
                  props.onCambiarSeleccion(nuevos)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '7px 12px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--nuc-surface-hover)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <div style={{
                  width: 13, height: 13, borderRadius: 3,
                  background: seleccionado ? 'var(--nuc-acc)' : 'transparent',
                  border: seleccionado ? 'none' : '1.5px solid var(--nuc-border-input)',
                  boxSizing: 'border-box',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}>
                  {seleccionado && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span style={{ flex: 1, font: `${seleccionado ? '500' : '400'} 12px var(--font-geist-sans), sans-serif`, color: seleccionado ? 'var(--nuc-ink)' : 'var(--nuc-ink-2)' }}>
                  {v.valor}
                </span>
                <span style={{ font: '400 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)' }}>
                  {v.count}
                </span>
              </div>
            )
          })}
        </div>
        <Pie />
      </div>
    )
  }

  if (props.tipo === 'rango') {
    return (
      <div style={estiloBase}>
        <Header />
        <div style={{ padding: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 11 }}>
            {[
              { label: 'DESDE', val: props.desde, set: props.onCambiarDesde },
              { label: 'HASTA', val: props.hasta, set: props.onCambiarHasta },
            ].map(({ label, val, set }) => (
              <div key={label} style={{
                flex: 1,
                border: '1px solid var(--nuc-border-input)',
                borderRadius: 5,
                padding: '7px 10px',
              }}>
                <div style={{ font: '500 10px var(--font-geist-mono), monospace', letterSpacing: '.06em', color: 'var(--nuc-ink-3)' }}>
                  {label}
                </div>
                <input
                  type="number"
                  value={val ?? ''}
                  onChange={(e) => set(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="sin límite"
                  style={{
                    border: 'none', outline: 'none', background: 'transparent',
                    font: '500 13px var(--font-geist-mono), monospace',
                    color: val !== undefined ? 'var(--nuc-ink)' : 'var(--nuc-ink-5)',
                    width: '100%', marginTop: 2,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Mini histograma */}
          {props.distribucion && props.distribucion.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 34, marginBottom: 9 }}>
              {props.distribucion.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    background: 'var(--nuc-border-sub)',
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
          )}

          {/* Atajos */}
          {props.atajos && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {props.atajos.map((a) => {
                const activo = props.desde === a.desde && props.hasta === a.hasta
                return (
                  <span
                    key={a.etiqueta}
                    onClick={() => { props.onCambiarDesde(a.desde); props.onCambiarHasta(a.hasta) }}
                    style={{
                      padding: '4px 9px',
                      border: `1px solid ${activo ? '#D5DBF9' : 'var(--nuc-border-input)'}`,
                      background: activo ? '#F7F8FF' : 'transparent',
                      borderRadius: 11,
                      font: `${activo ? '600' : '500'} 11px var(--font-geist-sans), sans-serif`,
                      color: activo ? 'var(--nuc-acc)' : 'var(--nuc-ink-2)',
                      cursor: 'pointer',
                    }}
                  >
                    {a.etiqueta}
                  </span>
                )
              })}
            </div>
          )}
        </div>
        <Pie />
      </div>
    )
  }

  // tipo: contiene
  const modos: { valor: 'contiene' | 'empieza-con' | 'exacto'; etiqueta: string }[] = [
    { valor: 'contiene', etiqueta: 'Contiene' },
    { valor: 'empieza-con', etiqueta: 'Empieza con' },
    { valor: 'exacto', etiqueta: 'Exacto' },
  ]

  return (
    <div style={estiloBase}>
      <Header />
      <div style={{ padding: 12 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {modos.map((m) => {
            const activo = props.modo === m.valor
            return (
              <span
                key={m.valor}
                onClick={() => props.onCambiarModo(m.valor)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 4,
                  background: activo ? 'var(--nuc-ink)' : 'transparent',
                  border: activo ? 'none' : '1px solid var(--nuc-border-input)',
                  font: `${activo ? '600' : '500'} 11px var(--font-geist-sans), sans-serif`,
                  color: activo ? 'var(--nuc-surface)' : 'var(--nuc-ink-2)',
                  cursor: 'pointer',
                }}
              >
                {m.etiqueta}
              </span>
            )
          })}
        </div>
        <div style={{
          border: '1px solid var(--nuc-acc)',
          borderRadius: 5,
          padding: '8px 10px',
          marginBottom: 9,
        }}>
          <input
            type="text"
            value={props.texto}
            onChange={(e) => props.onCambiarTexto(e.target.value)}
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              font: '500 12.5px var(--font-geist-mono), monospace',
              color: 'var(--nuc-ink)', width: '100%',
            }}
          />
        </div>
        {props.coincidencias !== undefined && (
          <div style={{ font: '400 11.5px/1.6 var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-2)' }}>
            Coincide con <strong style={{ color: 'var(--nuc-ink)' }}>{props.coincidencias} filas</strong> · no distingue mayúsculas ni acentos
          </div>
        )}
      </div>
      <Pie />
    </div>
  )
}
