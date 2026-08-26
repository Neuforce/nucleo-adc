'use client'

// CampoRejilla — captura del mismo dato repetido en muchas filas.
// Siempre muestra el periodo anterior como referencia.
// Ref: doc 09-formularios §02 CAPTURA EN REJILLA

import { useState } from 'react'

export interface FilaRejilla {
  id: string
  nombre: string
  valorAnterior: number | null
  etiquetaAnterior: string  // e.g. 'JUL'
}

interface CampoRejillaProps {
  etiquetaColumnaActual: string  // e.g. 'AGO'
  filas: FilaRejilla[]
  valores: Record<string, string>  // id → valor capturado
  onCambiar: (id: string, valor: string) => void
}

export function CampoRejilla({
  etiquetaColumnaActual,
  filas,
  valores,
  onCambiar,
}: CampoRejillaProps) {
  const [focoId, setFocoId] = useState<string | null>(null)

  return (
    <div style={{
      border: `1px solid var(--nuc-border)`,
      borderRadius: 7,
      overflow: 'hidden',
    }}>
      {/* Encabezado */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 74px 74px',
        gap: 0,
        background: 'var(--nuc-surface-sub)',
        padding: '5px 8px',
        borderBottom: `1px solid var(--nuc-border-sub)`,
      }}>
        <span style={{ font: '600 10px var(--font-geist-mono), monospace', letterSpacing: '.06em', color: 'var(--nuc-ink-2)' }}>
          INDICADOR
        </span>
        <span style={{ textAlign: 'right', font: '600 10px var(--font-geist-mono), monospace', letterSpacing: '.06em', color: 'var(--nuc-ink-2)' }}>
          {filas[0]?.etiquetaAnterior ?? '—'}
        </span>
        <span style={{ textAlign: 'right', font: '600 10px var(--font-geist-mono), monospace', letterSpacing: '.06em', color: 'var(--nuc-ink-2)' }}>
          {etiquetaColumnaActual}
        </span>
      </div>

      {/* Filas */}
      {filas.map((fila) => {
        const enFoco = focoId === fila.id
        const val = valores[fila.id] ?? ''
        return (
          <div
            key={fila.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 74px 74px',
              alignItems: 'center',
              padding: '4px 8px',
              borderTop: `1px solid var(--nuc-border-sub)`,
              background: 'var(--nuc-surface)',
            }}
          >
            <span style={{ font: '400 11.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
              {fila.nombre}
            </span>
            {/* Periodo anterior (solo lectura) */}
            <span style={{
              textAlign: 'right',
              font: '500 11.5px var(--font-geist-mono), monospace',
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--nuc-ink-2)',
              paddingRight: 4,
            }}>
              {fila.valorAnterior !== null
                ? fila.valorAnterior.toLocaleString('es-MX')
                : '—'}
            </span>
            {/* Celda editable */}
            <div style={{
              height: 24,
              border: `1px solid ${enFoco ? 'var(--nuc-acc)' : 'var(--nuc-border-input)'}`,
              borderRadius: 5,
              boxShadow: enFoco ? '0 0 0 3px rgba(var(--nuc-acc-rgb), .16)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 6,
              background: 'var(--nuc-surface)',
              transition: 'border-color .12s, box-shadow .12s',
            }}>
              <input
                type="text"
                inputMode="numeric"
                value={val}
                onChange={(e) => onCambiar(fila.id, e.target.value)}
                onFocus={() => setFocoId(fila.id)}
                onBlur={() => setFocoId(null)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  font: '600 11.5px var(--font-geist-mono), monospace',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--nuc-ink)',
                  textAlign: 'right',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
