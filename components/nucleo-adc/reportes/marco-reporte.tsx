'use client'

// MarcoReporte — cabeza y pie comunes a todos los 6 formatos de reporte fijo.
// Kicker mono (entidad·periodo) + título + descripción + botones Excel/PDF/Programar.
// Filtros como chips (height:26px border-radius:13px). Pie de linaje mono 11px.
// Ref: doc 10-reportes-fijos §01

import { ReactNode } from 'react'

export interface FiltroReporte {
  etiqueta: string
  porDefecto?: boolean   // false → lleva botón '×'
  onQuitar?: () => void
}

interface MarcoReporteProps {
  entidad: string          // e.g. 'MG CELAYA'
  periodo: string          // e.g. 'AGOSTO 2026'
  titulo: string
  descripcion?: string
  filtros?: FiltroReporte[]
  fuente?: string          // e.g. 'DWH · vw_EstadoResultados'
  corte?: string           // e.g. '27 AGO 04:12'
  unidad?: string          // e.g. 'CIFRAS EN MXN SIN IVA'
  generadoPor?: string     // e.g. 'J. RAMÍREZ'
  generadoEn?: string      // e.g. '27 AGO 09:14'
  onExcel?: () => void
  onPdf?: () => void
  onProgramar?: () => void
  children: ReactNode
}

export function MarcoReporte({
  entidad,
  periodo,
  titulo,
  descripcion,
  filtros = [],
  fuente,
  corte,
  unidad,
  generadoPor,
  generadoEn,
  onExcel,
  onPdf,
  onProgramar,
  children,
}: MarcoReporteProps) {
  return (
    <div style={{
      background: 'var(--nuc-surface)',
      border: '1px solid var(--nuc-border-input)',
      borderRadius: 6,
      overflow: 'hidden',
    }}>
      {/* Encabezado: kicker + título + acciones */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--nuc-border-input)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            font: '500 11px var(--font-geist-mono), monospace',
            letterSpacing: '.09em',
            color: 'var(--nuc-ink-3)',
            marginBottom: 6,
          }}>
            {entidad} · {periodo}
          </div>
          <h3 style={{
            margin: '0 0 5px',
            font: '600 20px/1.15 var(--font-geist-sans), sans-serif',
            letterSpacing: '-.02em',
            color: 'var(--nuc-ink)',
          }}>
            {titulo}
          </h3>
          {descripcion && (
            <div style={{
              font: '400 12.5px var(--font-geist-sans), sans-serif',
              color: 'var(--nuc-ink-2)',
            }}>
              {descripcion}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
          <button
            type="button"
            onClick={onExcel}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 32,
              padding: '0 12px',
              border: '1px solid var(--nuc-border-input)',
              borderRadius: 5,
              background: 'transparent',
              font: '500 11.5px var(--font-geist-sans), sans-serif',
              color: 'var(--nuc-ink)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            Excel
          </button>
          <button
            type="button"
            onClick={onPdf}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 32,
              padding: '0 12px',
              border: '1px solid var(--nuc-border-input)',
              borderRadius: 5,
              background: 'transparent',
              font: '500 11.5px var(--font-geist-sans), sans-serif',
              color: 'var(--nuc-ink)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            PDF
          </button>
          <button
            type="button"
            onClick={onProgramar}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 32,
              padding: '0 12px',
              borderRadius: 5,
              background: 'var(--nuc-acc)',
              border: 'none',
              font: '600 11.5px var(--font-geist-sans), sans-serif',
              color: '#FFFFFF',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            Programar envío
          </button>
        </div>
      </div>

      {/* Barra de filtros */}
      {filtros.length > 0 && (
        <div style={{
          padding: '10px 20px',
          borderBottom: '1px solid var(--nuc-border-input)',
          background: 'var(--nuc-surface-header)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}>
          <span style={{
            font: '600 11px var(--font-geist-mono), monospace',
            letterSpacing: '.07em',
            color: 'var(--nuc-ink-3)',
          }}>
            FILTROS
          </span>
          {filtros.map((f, i) => {
            const esAplicado = !f.porDefecto
            return (
              <span
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  height: 26,
                  padding: '0 10px',
                  border: `1px solid ${esAplicado ? '#D5DBF9' : 'var(--nuc-border-input)'}`,
                  borderRadius: 13,
                  background: esAplicado ? '#F7F8FF' : 'var(--nuc-surface)',
                  font: '500 11.5px var(--font-geist-sans), sans-serif',
                  color: 'var(--nuc-ink)',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.etiqueta}
                {esAplicado && f.onQuitar && (
                  <span
                    onClick={f.onQuitar}
                    style={{
                      color: 'var(--nuc-acc)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 13,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </span>
                )}
              </span>
            )
          })}
        </div>
      )}

      {/* Cuerpo (el formato) */}
      {children}

      {/* Pie de linaje */}
      {(fuente || corte || unidad || generadoPor) && (
        <div style={{
          padding: '11px 20px',
          background: 'var(--nuc-surface-header)',
          borderTop: '1px solid var(--nuc-border-input)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
        }}>
          {fuente && (
            <span style={{ font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)' }}>
              FUENTE: {fuente}
            </span>
          )}
          {corte && (
            <span style={{ font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)' }}>
              CORTE: {corte}
            </span>
          )}
          {unidad && (
            <span style={{ font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)' }}>
              {unidad}
            </span>
          )}
          {(generadoEn || generadoPor) && (
            <span style={{ marginLeft: 'auto', font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)' }}>
              GENERADO {generadoEn}{generadoPor ? ` · ${generadoPor}` : ''}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
