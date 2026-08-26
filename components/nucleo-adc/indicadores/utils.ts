// Utilidades de datos para indicadores
// Ref: design.md §3, §4, §11, §20

import type { ColorEstado, DireccionDeseable } from './types'

// ── colorEstado ────────────────────────────────────────────────────────────────
// Determina el color según avance y dirección deseable.
// El color lo rige direccionDeseable, NUNCA el signo aritmético.
// ≥ 100% verde · 80–99% ámbar · < 80% rojo
// Retorna CSS custom properties para compatibilidad con modo claro/oscuro.

export function colorEstado(
  avance: number | null
): ColorEstado {
  if (avance === null) {
    // Sin dato — usar colores neutros
    return {
      texto: 'var(--nuc-ink-3)',
      relleno: 'var(--nuc-surface-hover)',
      borde: 'var(--nuc-border)',
      fondo: 'var(--nuc-surface-sub)',
    }
  }

  const pct = avance * 100

  if (pct >= 100) {
    return {
      texto: 'var(--nuc-verde-txt)',
      relleno: '#0E8A5F',
      borde: '#CFE8DE',
      fondo: '#F4FAF7',
    }
  }

  if (pct >= 80) {
    return {
      texto: 'var(--nuc-ambar)',
      relleno: '#B7791F',
      borde: '#F2E2C2',
      fondo: '#FDF6E9',
    }
  }

  return {
    texto: 'var(--nuc-rojo)',
    relleno: 'var(--nuc-rojo)',
    borde: 'var(--nuc-alarma-border)',
    fondo: 'var(--nuc-surface-sub)',
  }
}

// ── monedaUnidad ───────────────────────────────────────────────────────────────
// Formatea un valor numérico según la unidad de medida.
// En tarjeta: abreviado "$25.5M". En tabla/panel: exacto.
// Ref: design.md §4 "Dinero abreviado en tarjetas"

export function monedaUnidad(
  valor: number | null,
  formato: string,
  abreviado = true
): string {
  if (valor === null) return '—'

  const esDinero = formato.includes('$')
  const esPorcentaje = formato.includes('%')

  if (esPorcentaje) {
    // Los porcentajes ya llegan como decimales (0.831) — multiplicar × 100
    return `${(valor * 100).toFixed(1)}%`
  }

  if (esDinero && abreviado) {
    const abs = Math.abs(valor)
    const signo = valor < 0 ? '-' : ''
    if (abs >= 1_000_000_000) return `${signo}$${(abs / 1_000_000_000).toFixed(1)}B`
    if (abs >= 1_000_000) return `${signo}$${(abs / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${signo}$${(abs / 1_000).toFixed(1)}K`
    return `${signo}$${abs.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`
  }

  if (esDinero && !abreviado) {
    return `$${valor.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Número entero con separador de miles
  if (formato === '#,##0') {
    return valor.toLocaleString('es-MX', { maximumFractionDigits: 0 })
  }

  // Número con un decimal
  if (formato === '#,##0.0') {
    return valor.toLocaleString('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  }

  return valor.toLocaleString('es-MX')
}

// ── formatComparativo ──────────────────────────────────────────────────────────
// Formatea un comparativo (varSPLM / varSPLY).
// null → "—"
// > 300% o < -300% → "×N" (magnitud, no signo)
// Base cero → "—"
// Positivo/negativo según direccionDeseable

export interface ComparativoFormateado {
  texto: string
  color: () => string
}

export function formatComparativo(
  variacion: number | null,
  direccionDeseable: DireccionDeseable
): ComparativoFormateado {
  if (variacion === null) {
    return {
      texto: '—',
      color: () => 'var(--nuc-ink-3)',
    }
  }

  const abs = Math.abs(variacion)

  // Variación > 300% → "×N"
  if (abs > 3) {
    const n = Math.round(abs)
    const esBueno =
      (variacion > 0 && direccionDeseable === 'Arriba') ||
      (variacion < 0 && direccionDeseable === 'Abajo')
    const colores = colorEstado(esBueno ? 1 : 0.5)
    return {
      texto: `×${n}`,
      color: () => colores.texto,
    }
  }

  const pct = (variacion * 100).toFixed(1)
  const signo = variacion > 0 ? '▲' : '▼'

  // Si va en la dirección deseable → color positivo
  const esBueno =
    (variacion > 0 && direccionDeseable === 'Arriba') ||
    (variacion < 0 && direccionDeseable === 'Abajo')

  const colores = colorEstado(esBueno ? 1 : 0.5)

  return {
    texto: `${signo} ${Math.abs(parseFloat(pct))}%`,
    color: () =>
      variacion === 0 ? 'var(--nuc-ink-3)' : colorEstado(esBueno ? 1 : 0.5).texto,
  }
}

// ── avancePorcentaje ───────────────────────────────────────────────────────────
// Convierte avanceObjetivo decimal a porcentaje display con 1 decimal.
// null → "—"

export function avancePorcentaje(avance: number | null): string {
  if (avance === null) return '—'
  return `${(avance * 100).toFixed(1)}%`
}

// ── formatNumerador ────────────────────────────────────────────────────────────
// "12 de 87" cuando numerador y denominador están disponibles

export function formatNumerador(
  numerador: number | null,
  denominador: number | null
): string | null {
  if (numerador === null || denominador === null) return null
  return `${numerador.toLocaleString('es-MX')} de ${denominador.toLocaleString('es-MX')}`
}
