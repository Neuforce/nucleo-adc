// Feed de atención — panel del Hub con lista de alarmas.
// Máximo 5 alarmas visibles. El resto se cuentan pero no se enumeran.
// Columnas: 12px · 1fr · 128px · 96px
// Ref: design.md §12, §17 T1

import { FilaAtencion } from './fila-atencion'
import type { NivelAlarma } from '../indicadores/types'

interface ItemAtencion {
  id: string
  nivel: NivelAlarma
  titulo: string
  descripcion?: string
  fecha?: string
  accion?: string
  onAccion?: () => void
  onFila?: () => void
}

interface FeedAtencionProps {
  items: ItemAtencion[]
  total?: number            // total real (puede ser > 5)
  onVerTodas?: () => void
}

export function FeedAtencion({
  items,
  total,
  onVerTodas,
}: FeedAtencionProps) {
  // Solo 5 visibles
  const visibles = items.slice(0, 5)
  const restantes = (total ?? items.length) - visibles.length

  return (
    <section
      style={{
        border: '1px solid var(--nuc-border)',
        borderRadius: 6,
        background: 'var(--nuc-surface)',
        overflow: 'hidden',
      }}
    >
      {/* Encabezado del panel */}
      <div
        style={{
          padding: '11px 16px',
          borderBottom: '1px solid var(--nuc-border-sub)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '.08em',
            color: 'var(--nuc-ink-3)',
            textTransform: 'uppercase' as const,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          ATENCIÓN
        </span>
        {total !== undefined && total > 0 && (
          <span
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--nuc-ink-3)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {total} alarmas
          </span>
        )}
      </div>

      {/* Columnas header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '12px 1fr 128px 96px',
          gap: 12,
          padding: '6px 16px 2px',
          borderBottom: '1px solid var(--nuc-border-sub)',
        }}
      >
        {['', 'Indicador', 'Desde', 'Acción'].map((h, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '.06em',
              color: 'var(--nuc-ink-3)',
              textTransform: 'uppercase' as const,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Filas */}
      <div style={{ padding: '0 16px' }}>
        {visibles.length === 0 ? (
          <div
            style={{
              padding: '20px 0',
              textAlign: 'center',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 12.5,
              color: 'var(--nuc-ink-3)',
            }}
          >
            Sin alarmas activas
          </div>
        ) : (
          visibles.map((item) => (
            <FilaAtencion
              key={item.id}
              nivel={item.nivel}
              titulo={item.titulo}
              descripcion={item.descripcion}
              fecha={item.fecha}
              accion={item.accion}
              onAccion={item.onAccion}
              onFila={item.onFila}
            />
          ))
        )}
      </div>

      {/* Ver más */}
      {restantes > 0 && onVerTodas && (
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--nuc-border-sub)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 11.5,
              fontWeight: 400,
              color: 'var(--nuc-ink-3)',
            }}
          >
            {restantes} alarmas más
          </span>
          <button
            onClick={onVerTodas}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 11.5,
              fontWeight: 600,
              color: 'var(--nuc-acc-link)',
              padding: 0,
            }}
          >
            Ver todas
          </button>
        </div>
      )}
    </section>
  )
}
