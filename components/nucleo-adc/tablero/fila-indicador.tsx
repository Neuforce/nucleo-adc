// Fila de indicador — Uso 2 (lista agrupada, 7+ indicadores).
// Alto: 44px. Columnas: nombre | cifra | barra | M | A | avance
// font:500 12.5px Geist (nombre) · Geist Mono (datos)
// Ref: design.md §5, §11

import { colorEstado, monedaUnidad, formatComparativo } from '../indicadores/utils'
import { BarraProgreso } from '../indicadores/barra-progreso'
import type { Indicador, Alarma } from '../indicadores/types'

interface FilaIndicadorProps {
  indicador: Indicador
  alarma?: Alarma
  activa?: boolean
  onDetalle?: () => void
}

export function FilaIndicador({
  indicador,
  alarma,
  activa = false,
  onDetalle,
}: FilaIndicadorProps) {
  const sinOperacion = indicador.estatusCalculo === 'SIN_OPERACION'
  const sinObjetivo = indicador.objetivo === null
  const esDesempeno = indicador.claseClave === 'DESEMPENO'

  const bgRow = activa ? '#EEF2FB' : 'transparent'
  const borde = 'var(--nuc-border-sub)'
  const colorNombre = 'var(--nuc-ink)'
  const colorDato = 'var(--nuc-ink)'
  const colorSecundario = 'var(--nuc-ink-3)'

  const colorPunto =
    alarma?.nivel === 'CRITICA' ? 'var(--nuc-rojo)'
    : alarma?.nivel === 'ATENCION' ? 'var(--nuc-ambar)'
    : undefined

  const avance = sinObjetivo || sinOperacion ? null : indicador.avanceObjetivo
  const m = formatComparativo(indicador.varSPLM, indicador.direccionDeseable)
  const a = formatComparativo(indicador.varSPLY, indicador.direccionDeseable)

  return (
    <div
      onClick={onDetalle}
      style={{
        height: 44,
        display: 'grid',
        gridTemplateColumns: '1fr 100px 80px 52px 52px 56px',
        gap: 0,
        alignItems: 'center',
        padding: '0 12px',
        borderBottom: `1px solid ${borde}`,
        background: bgRow,
        cursor: onDetalle ? 'pointer' : 'default',
      }}
    >
      {/* Nombre con punto de alarma */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        {colorPunto && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: colorPunto,
              flexShrink: 0,
            }}
          />
        )}
        <span
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 12.5,
            fontWeight: 500,
            color: colorNombre,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {indicador.nombreIndicador}
        </span>
      </div>

      {/* Cifra */}
      <span
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 12.5,
          fontWeight: 500,
          color: sinOperacion ? colorSecundario : colorDato,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {sinOperacion ? '—' : monedaUnidad(indicador.valor, indicador.unidadMedidaFormato, true)}
      </span>

      {/* Barra — solo DESEMPEÑO con objetivo */}
      <div>
        {esDesempeno && !sinObjetivo && !sinOperacion ? (
          <BarraProgreso
            avance={indicador.avanceObjetivo}
            direccionDeseable={indicador.direccionDeseable}
            mostrarPorcentaje={false}
          />
        ) : (
          <span style={{ color: colorSecundario, fontSize: 11 }}>—</span>
        )}
      </div>

      {/* M */}
      <span
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 11,
          fontWeight: indicador.varSPLM !== null ? 700 : 500,
          color: m.color(),
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {m.texto}
      </span>

      {/* A */}
      <span
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 11,
          fontWeight: indicador.varSPLY !== null ? 700 : 500,
          color: a.color(),
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {a.texto}
      </span>

      {/* Avance % */}
      <span
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 12,
          fontWeight: 700,
          color: avance !== null
            ? colorEstado(avance).texto
            : colorSecundario,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {avance !== null ? `${(avance * 100).toFixed(0)}%` : '—'}
      </span>
    </div>
  )
}
