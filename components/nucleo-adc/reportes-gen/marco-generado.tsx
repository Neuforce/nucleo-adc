'use client'

// MarcoGenerado — wrapper de 5 partes para reportes generados por el MCP.
// 01 Respuesta · 02 Alcance · 03 Cuerpo · 04 Cómo se obtuvo (colapsable) · 05 Acciones (max 3)
// Ref: doc 11-reportes-gen §01

import { useState, ReactNode } from 'react'

export interface AccionGenerada {
  texto: string
  esPrimaria?: boolean   // primer botón → azul relleno
  onClick?: () => void
}

export interface AlcanceGenerado {
  entidad: string
  periodo: string
  corte?: string
  filtros?: string[]
}

interface MarcoGeneradoProps {
  respuesta: string          // frase que contesta la pregunta tal como se hizo
  alcance: AlcanceGenerado
  cuerpo: ReactNode
  comoSeObtuvo?: string      // plegado, siempre presente
  fuentes?: string[]
  acciones?: AccionGenerada[]  // máx 3
}

export function MarcoGenerado({
  respuesta,
  alcance,
  cuerpo,
  comoSeObtuvo,
  fuentes = [],
  acciones = [],
}: MarcoGeneradoProps) {
  const [comoAbierto, setComoAbierto] = useState(false)

  // Alcance como línea mono
  const alcanceLinea = [
    alcance.entidad,
    alcance.periodo,
    alcance.corte ? `AL DÍA ${alcance.corte}` : null,
    ...(alcance.filtros ?? []),
  ].filter(Boolean).join(' · ').toUpperCase()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* 01 Respuesta */}
      <div style={{
        font: '400 14.5px/1.6 var(--font-geist-sans), sans-serif',
        color: 'var(--nuc-ink)',
        marginBottom: 6,
      }}>
        {respuesta}
      </div>

      {/* 02 Alcance */}
      <div style={{
        font: '500 11px var(--font-geist-mono), monospace',
        color: 'var(--nuc-ink-2)',
        marginBottom: 16,
        letterSpacing: '.02em',
      }}>
        {alcanceLinea}
      </div>

      {/* 03 Cuerpo */}
      <div style={{ marginBottom: 14 }}>
        {cuerpo}
      </div>

      {/* 04 Cómo se obtuvo + 05 Acciones */}
      <div style={{
        paddingTop: 14,
        borderTop: '1px solid var(--nuc-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        {/* Acciones */}
        {acciones.slice(0, 3).map((acc, i) => (
          <button
            key={i}
            type="button"
            onClick={acc.onClick}
            style={{
              padding: '7px 12px',
              borderRadius: 5,
              border: acc.esPrimaria ? 'none' : '1px solid var(--nuc-border-input)',
              background: acc.esPrimaria ? 'var(--nuc-acc)' : 'transparent',
              font: '600 11.5px var(--font-geist-sans), sans-serif',
              color: acc.esPrimaria ? '#FFFFFF' : 'var(--nuc-ink)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {acc.texto}
          </button>
        ))}

        {/* Cómo se obtuvo */}
        {comoSeObtuvo && (
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setComoAbierto((v) => !v)}
              style={{
                border: 'none',
                background: 'transparent',
                font: '500 11px var(--font-geist-mono), monospace',
                color: 'var(--nuc-ink-2)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {fuentes.length > 0 ? `${fuentes.length} fuente${fuentes.length > 1 ? 's' : ''} · ` : ''}cómo se obtuvo {comoAbierto ? '▴' : '▾'}
            </button>
            {comoAbierto && (
              <div style={{
                marginTop: 8,
                maxWidth: 360,
                textAlign: 'right',
                font: '400 11.5px/1.6 var(--font-geist-sans), sans-serif',
                color: 'var(--nuc-ink-2)',
              }}>
                {comoSeObtuvo}
                {fuentes.length > 0 && (
                  <div style={{ marginTop: 4, font: '500 10.5px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-2)' }}>
                    {fuentes.join(' · ')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
