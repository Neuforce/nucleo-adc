// TarjetaIndicador — Form E oficial, 214×132px.
// padding:11px 15px border-radius:6px border:1px solid #E4E6EA background:#FFFFFF
// Variante destacada (navy): background:#00244D
// Alarma: border-left:3px solid + FranjaAlarma 34px al pie
// Ref: design.md §11, §12

import { colorEstado, monedaUnidad } from './utils'
import { BarraProgreso } from './barra-progreso'
import { FooterComparativos } from './footer-comparativos'
import { FranjaAlarma } from './franja-alarma'
import type { Indicador, Tono, Alarma } from './types'

interface TarjetaIndicadorProps {
  indicador: Indicador
  tono?: Tono
  alarma?: Alarma
  onDetalle?: () => void
}

export function TarjetaIndicador({
  indicador,
  tono = 'normal',
  alarma,
  onDetalle,
}: TarjetaIndicadorProps) {
  const esDestacado = tono === 'destacado'
  const esDesempeno = indicador.claseClave === 'DESEMPENO'
  const sinObjetivo = indicador.objetivo === null
  const sinOperacion = indicador.estatusCalculo === 'SIN_OPERACION'

  // Colores según tono
  const bgTarjeta = esDestacado
    ? '#00244D'
    : 'var(--nuc-surface)'

  const bordeBase = alarma
    ? `1px solid var(--nuc-alarma-border)`
    : `1px solid ${esDestacado ? '#193A6A' : 'var(--nuc-border)'}`

  const bordeLateral = alarma
    ? `3px solid ${alarma.nivel === 'ATENCION' ? 'var(--nuc-ambar)' : 'var(--nuc-rojo)'}`
    : undefined

  const colorCintillo = esDestacado ? '#7FA8C9' : 'var(--nuc-ink-3)'
  const colorNombre = esDestacado ? '#FFFFFF' : 'var(--nuc-ink)'
  const colorMeta = esDestacado ? '#7FA8C9' : 'var(--nuc-ink-3)'

  // Cifra principal
  const esDinero = indicador.unidadMedidaFormato?.includes('$')
  const fontSize = esDinero ? 24 : 27
  const colorCifra = esDestacado
    ? '#FFFFFF'
    : 'var(--nuc-ink)'

  // Avance (decimal → ya viene de la API)
  const avance = sinObjetivo || sinOperacion ? null : indicador.avanceObjetivo
  const colores = colorEstado(avance)

  // Punto de alarma
  const colorPunto =
    alarma?.nivel === 'CRITICA' ? 'var(--nuc-rojo)'
    : alarma?.nivel === 'ATENCION' ? 'var(--nuc-ambar-atencion)'
    : 'transparent'

  return (
    <article
      onClick={onDetalle}
      style={{
        width: 214,
        minHeight: 132,
        borderRadius: 6,
        border: bordeBase,
        borderLeft: bordeLateral ?? bordeBase.replace('1px', '1px'),
        background: bgTarjeta,
        padding: '11px 15px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        cursor: onDetalle ? 'pointer' : 'default',
        flexShrink: 0,
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Cintillo — tipo + nivel */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {/* Punto de alarma */}
          {alarma && (
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
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '.07em',
              color: colorCintillo,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {indicador.tipoIndicadorNombre}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '.04em',
            color: colorCintillo,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '55%',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {indicador.nivelNombre}
        </span>
      </div>

      {/* 2. Nombre */}
      <p
        style={{
          fontFamily: 'var(--font-geist-sans), sans-serif',
          fontSize: 14.5,
          fontWeight: 600,
          lineHeight: 1.25,
          color: colorNombre,
          margin: '0 0 8px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {indicador.nombreIndicador}
      </p>

      {/* 3. Cifra y meta */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-.035em',
              color: sinOperacion ? colorMeta : colorCifra,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {sinOperacion
              ? '—'
              : monedaUnidad(indicador.valor, indicador.unidadMedidaFormato, true)}
          </span>

          {!sinObjetivo && !sinOperacion && indicador.objetivo !== null && (
            <span
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 11,
                fontWeight: 500,
                color: colorMeta,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              / {monedaUnidad(indicador.objetivo, indicador.unidadMedidaFormato, true)}
            </span>
          )}
        </div>
      </div>

      {/* 4. Barra de progreso — solo DESEMPEÑO y con objetivo */}
      {esDesempeno && !sinObjetivo && !sinOperacion && (
        <div style={{ marginBottom: 6 }}>
          <BarraProgreso
            avance={indicador.avanceObjetivo}
            direccionDeseable={indicador.direccionDeseable}
            mostrarPorcentaje
          />
        </div>
      )}

      {/* 5. Footer de comparativos */}
      <div style={{ marginTop: 'auto' }}>
        <FooterComparativos
          varSPLM={indicador.varSPLM}
          varSPLY={indicador.varSPLY}
          direccionDeseable={indicador.direccionDeseable}
        />
      </div>

      {/* 6. Franja de alarma */}
      {alarma && (
        <FranjaAlarma
          nivel={alarma.nivel}
          motivo={alarma.motivo}
          onDetalle={onDetalle}
        />
      )}
    </article>
  )
}
