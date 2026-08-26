'use client'

// FormatoF2 — Padrón operativo: muchas filas, cada una un caso.
// Search bar 210px + filtros. Grid: 120px 1fr 116px 96px 104px 116px. Row height 44px.
// Estatus como píldora (fondo tintado + texto en color de estado).
// Pie fijo con total de filas y suma de columnas numéricas.
// Ref: doc 10-reportes-fijos §03

import { useState } from 'react'

export interface EstatusConfig {
  valor: string
  color: string       // texto
  bg: string          // fondo píldora
}

export interface FilaF2 {
  id: string
  vin: string         // o clave primaria
  nombre: string      // descripción principal
  costo?: number
  dias?: number
  estatus?: string
  responsable?: string
  [key: string]: unknown
}

const ESTATUSES_DEFAULT: EstatusConfig[] = [
  { valor: 'Detenida',  color: '#C2352B', bg: '#FDEEED' },
  { valor: 'Apartada',  color: '#8A5A12', bg: '#FDF6E9' },
  { valor: 'En piso',   color: '#3D4551', bg: '#F1F3F6' },
  { valor: 'Vendida',   color: '#0B7A53', bg: '#F4FAF7' },
]

interface FormatoF2Props {
  filas: FilaF2[]
  columnas?: {
    col1?: string  // default 'VIN'
    col2?: string  // default 'MODELO'
    col3?: string  // default 'COSTO'
    col4?: string  // default 'DÍAS'
    col5?: string  // default 'ESTATUS'
    col6?: string  // default 'RESPONSABLE'
  }
  estatuses?: EstatusConfig[]
  resumenExtra?: string  // e.g. '12 CRÍTICAS'
}

export function FormatoF2({
  filas,
  columnas,
  estatuses = ESTATUSES_DEFAULT,
  resumenExtra,
}: FormatoF2Props) {
  const [busqueda, setBusqueda] = useState('')

  const c = {
    col1: 'VIN',
    col2: 'MODELO',
    col3: 'COSTO',
    col4: 'DÍAS',
    col5: 'ESTATUS',
    col6: 'RESPONSABLE',
    ...columnas,
  }

  const filasFiltradas = busqueda
    ? filas.filter((f) =>
        f.vin.toLowerCase().includes(busqueda.toLowerCase()) ||
        f.nombre.toLowerCase().includes(busqueda.toLowerCase())
      )
    : filas

  const grid = '120px 1fr 116px 96px 104px 116px'

  const totalCosto = filasFiltradas.reduce((acc, f) => acc + (f.costo ?? 0), 0)
  const promDias = filasFiltradas.length > 0
    ? Math.round(filasFiltradas.reduce((acc, f) => acc + (f.dias ?? 0), 0) / filasFiltradas.length)
    : 0

  function getEstatusConfig(val?: string) {
    if (!val) return null
    return estatuses.find((e) => e.valor === val) ?? {
      valor: val,
      color: 'var(--nuc-ink-3)',
      bg: 'var(--nuc-surface-sub)',
    }
  }

  return (
    <div style={{ background: 'var(--nuc-surface)' }}>
      {/* Barra de búsqueda y filtros */}
      <div style={{
        padding: '10px 18px',
        borderBottom: '1px solid var(--nuc-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: 30,
          padding: '0 11px',
          border: '1px solid var(--nuc-border-input)',
          borderRadius: 5,
          width: 210,
          gap: 7,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--nuc-ink-2)"
            strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" /><path d="M20 20l-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar…"
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              font: '400 12px var(--font-geist-sans), sans-serif',
              color: 'var(--nuc-ink-3)', flex: 1,
            }}
          />
        </div>
        <div style={{ marginLeft: 'auto', font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-2)' }}>
          {filasFiltradas.length} {c.col1 !== 'VIN' ? 'FILAS' : 'UNIDADES'}{resumenExtra ? ` · ${resumenExtra}` : ''}
        </div>
      </div>

      {/* Encabezados */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: grid,
        gap: 14,
        padding: '8px 18px',
        background: 'var(--nuc-surface-header)',
        borderBottom: '1px solid var(--nuc-border)',
      }}>
        {[c.col1, c.col2, c.col3, c.col4, c.col5, c.col6].map((col, i) => (
          <div key={i} style={{
            textAlign: [2, 3, 5].includes(i) ? 'right' : 'left',
            font: '600 11px var(--font-geist-mono), monospace',
            letterSpacing: '.07em',
            color: 'var(--nuc-ink-3)',
          }}>
            {col}
          </div>
        ))}
      </div>

      {/* Filas */}
      {filasFiltradas.map((fila) => {
        const ec = getEstatusConfig(fila.estatus)
        return (
          <div
            key={fila.id}
            style={{
              display: 'grid',
              gridTemplateColumns: grid,
              gap: 14,
              alignItems: 'center',
              padding: '0 18px',
              height: 44,
              borderBottom: '1px solid var(--nuc-surface-sub)',
              background: 'var(--nuc-surface)',
            }}
          >
            <div style={{ font: '500 11.5px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fila.vin}
            </div>
            <div style={{ font: '500 12.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fila.nombre}
            </div>
            <div style={{ textAlign: 'right', font: '400 12.5px var(--font-geist-mono), monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--nuc-ink)' }}>
              {fila.costo !== undefined ? fila.costo.toLocaleString('es-MX', { maximumFractionDigits: 0 }) : '—'}
            </div>
            <div style={{
              textAlign: 'right',
              font: '700 12.5px var(--font-geist-mono), monospace',
              color: fila.dias !== undefined && fila.dias > 90
                ? 'var(--nuc-rojo)'
                : fila.dias !== undefined && fila.dias > 60
                  ? 'var(--nuc-ambar-txt)'
                  : 'var(--nuc-ink)',
            }}>
              {fila.dias ?? '—'}
            </div>
            <div>
              {ec && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 20,
                  padding: '0 8px',
                  borderRadius: 10,
                  background: ec.bg,
                  font: '600 11px var(--font-geist-sans), sans-serif',
                  color: ec.color,
                  whiteSpace: 'nowrap',
                }}>
                  {fila.estatus}
                </span>
              )}
            </div>
            <div style={{ textAlign: 'right', font: '400 12px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-2)' }}>
              {fila.responsable ?? '—'}
            </div>
          </div>
        )
      })}

      {/* Pie */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: grid,
        gap: 14,
        alignItems: 'center',
        padding: '11px 18px',
        background: 'var(--nuc-surface-header)',
        borderTop: '1px solid var(--nuc-border)',
      }}>
        <div style={{ font: '700 12px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
          {filasFiltradas.length} filas
        </div>
        <div />
        <div style={{ textAlign: 'right', font: '700 12.5px var(--font-geist-mono), monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--nuc-ink)' }}>
          {totalCosto > 0 ? totalCosto.toLocaleString('es-MX', { maximumFractionDigits: 0 }) : '—'}
        </div>
        <div style={{ textAlign: 'right', font: '700 12.5px var(--font-geist-mono), monospace', color: 'var(--nuc-ink)' }}>
          {promDias > 0 ? promDias : '—'}
        </div>
        <div style={{ font: '400 11px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-2)' }}>
          promedio
        </div>
        <div />
      </div>
    </div>
  )
}
