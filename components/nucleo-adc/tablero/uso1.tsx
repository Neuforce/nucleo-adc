// Uso 1 — Tira de tarjetas.
// Cuándo: entidad única + ≤ 6 indicadores.
// Formato: tira horizontal de tarjetas 214×132px con gap:12px.
// La AI decide el uso, no el usuario.
// Ref: design.md §11

import { TarjetaIndicador } from '../indicadores/tarjeta'
import type { Indicador, Tono, Alarma } from '../indicadores/types'

interface ItemUso1 {
  indicador: Indicador
  tono?: Tono
  alarma?: Alarma
}

interface Uso1Props {
  items: ItemItemUso1[]
  onDetalle?: (claveIndicador: string) => void
}

// Alias para el tipo de item
type ItemItemUso1 = ItemUso1

export function Uso1({ items, onDetalle }: Uso1Props) {
  if (items.length === 0) return null
  if (items.length > 6) {
    console.warn('Uso1: recibió más de 6 indicadores. Usar Uso2 para 7+.')
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      {items.map(({ indicador, tono, alarma }) => (
        <TarjetaIndicador
          key={indicador.claveIndicador}
          indicador={indicador}
          tono={tono}
          alarma={alarma}
          onDetalle={onDetalle ? () => onDetalle(indicador.claveIndicador) : undefined}
        />
      ))}
    </div>
  )
}
