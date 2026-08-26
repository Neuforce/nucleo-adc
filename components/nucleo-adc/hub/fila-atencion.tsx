// Fila de atención — feed del Hub (alarmas y pendientes).
// grid: 12px 1fr 128px 96px gap:12px height:~44px
// Punto: 8×8px border-radius:50%
// Encabezado: font:600 12.5px Geist color:#0E1116
// Descripción: font:400 11.5px Geist color:#5B6472
// Fecha: font:500 11px Geist Mono color:#6B7482
// Acción: font:600 11.5px Geist color:#2F6BFF
// Ref: design.md §12

import type { NivelAlarma } from '../indicadores/types'

interface FilaAtencionProps {
  nivel: NivelAlarma
  titulo: string
  descripcion?: string
  fecha?: string
  accion?: string
  onAccion?: () => void
  onFila?: () => void
}

const COLOR_PUNTO: Record<NivelAlarma, string> = {
  CRITICA:      'var(--nuc-rojo)',
  ATENCION:     'var(--nuc-ambar-atencion)',
  NO_EVALUABLE: 'var(--nuc-ink-4)',
}

export function FilaAtencion({
  nivel,
  titulo,
  descripcion,
  fecha,
  accion,
  onAccion,
  onFila,
}: FilaAtencionProps) {
  const colorPunto = COLOR_PUNTO[nivel]

  // Punto vacío para NO_EVALUABLE
  const esNoEval = nivel === 'NO_EVALUABLE'

  return (
    <div
      onClick={onFila}
      style={{
        display: 'grid',
        gridTemplateColumns: '12px 1fr 128px 96px',
        gap: 12,
        alignItems: 'center',
        minHeight: 44,
        padding: '8px 0',
        borderBottom: '1px solid var(--nuc-border-sub)',
        cursor: onFila ? 'pointer' : 'default',
      }}
    >
      {/* Punto de nivel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: esNoEval ? 'transparent' : colorPunto,
            border: esNoEval ? `1.5px solid ${colorPunto}` : 'none',
            flexShrink: 0,
          }}
        />
      </div>

      {/* Título + descripción */}
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 12.5,
            fontWeight: 600,
            color: 'var(--nuc-ink)',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {titulo}
        </p>
        {descripcion && (
          <p
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 11.5,
              fontWeight: 400,
              color: 'var(--nuc-ink-2)',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {descripcion}
          </p>
        )}
      </div>

      {/* Fecha */}
      <span
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--nuc-ink-3)',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
      >
        {fecha ?? ''}
      </span>

      {/* Acción */}
      {accion && onAccion && (
        <button
          onClick={(e) => { e.stopPropagation(); onAccion() }}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 11.5,
            fontWeight: 600,
            color: 'var(--nuc-acc-link)',
            textAlign: 'left' as const,
            whiteSpace: 'nowrap',
          }}
        >
          {accion}
        </button>
      )}
    </div>
  )
}
