'use client'

// CampoArchivo — carga masiva de archivos CSV.
// Declara columnas esperadas antes de cargar; muestra resultado fila por fila.
// Ref: doc 09-formularios §02 ARCHIVO

import { useRef, useState } from 'react'

interface ResultadoFila {
  fila: number
  estado: 'ok' | 'error'
  mensaje?: string
}

interface CampoArchivoProps {
  etiqueta: string
  columnasEsperadas: string[]   // e.g. ['CTA', 'SCTA', 'DESTINO', 'NOTAS']
  onArchivo?: (archivo: File) => void
  resultados?: ResultadoFila[]
}

export function CampoArchivo({
  etiqueta,
  columnasEsperadas,
  onArchivo,
  resultados,
}: CampoArchivoProps) {
  const [arrastrado, setArrastrado] = useState(false)
  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function manejarArchivo(archivo: File) {
    setNombreArchivo(archivo.name)
    onArchivo?.(archivo)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ font: '500 11.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
        {etiqueta}
      </span>

      {/* Zona de carga */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setArrastrado(true) }}
        onDragLeave={() => setArrastrado(false)}
        onDrop={(e) => {
          e.preventDefault()
          setArrastrado(false)
          const f = e.dataTransfer.files[0]
          if (f) manejarArchivo(f)
        }}
        style={{
          border: `1px dashed ${arrastrado ? 'var(--nuc-acc)' : 'var(--nuc-border-input-val)'}`,
          borderRadius: 8,
          background: arrastrado ? 'var(--nuc-surface-hover)' : 'var(--nuc-surface-sub)',
          padding: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          transition: 'border-color .12s, background .12s',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke='var(--nuc-ink-2)'
          strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <path d="M12 16V4M8 8l4-4 4 4" />
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
        <div>
          <div style={{ font: '600 12px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
            {nombreArchivo ?? 'Arrastra el CSV o elígelo'}
          </div>
          <div style={{ font: '500 10.5px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-2)', marginTop: 2 }}>
            {columnasEsperadas.join(' · ')}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) manejarArchivo(f)
          }}
        />
      </div>

      {/* Resultados fila por fila */}
      {resultados && resultados.length > 0 && (
        <div style={{
          border: `1px solid var(--nuc-border)`,
          borderRadius: 8,
          overflow: 'hidden',
          marginTop: 4,
        }}>
          <div style={{
            padding: '6px 12px',
            background: 'var(--nuc-surface-sub)',
            borderBottom: `1px solid var(--nuc-border-sub)`,
            font: '600 10.5px var(--font-geist-mono), monospace',
            letterSpacing: '.06em',
            color: 'var(--nuc-ink-2)',
          }}>
            {resultados.filter(r => r.estado === 'ok').length} OK · {resultados.filter(r => r.estado === 'error').length} errores
          </div>
          {resultados.slice(0, 20).map((r) => (
            <div key={r.fila} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '5px 12px',
              borderBottom: `1px solid var(--nuc-surface-sub)`,
            }}>
              <span style={{
                font: '500 11px var(--font-geist-mono), monospace',
                color: 'var(--nuc-ink-2)',
                flexShrink: 0,
                width: 32,
              }}>
                {r.fila}
              </span>
              <span style={{
                font: '400 11.5px var(--font-geist-sans), sans-serif',
                color: r.estado === 'ok'
                  ? 'var(--nuc-verde-txt)'
                  : 'var(--nuc-rojo)',
                flex: 1,
              }}>
                {r.estado === 'ok' ? 'Importado' : (r.mensaje ?? 'Error')}
              </span>
            </div>
          ))}
          {resultados.length > 20 && (
            <div style={{
              padding: '6px 12px',
              font: '400 11px var(--font-geist-sans), sans-serif',
              color: 'var(--nuc-ink-2)',
            }}>
              +{resultados.length - 20} filas más
            </div>
          )}
        </div>
      )}
    </div>
  )
}
