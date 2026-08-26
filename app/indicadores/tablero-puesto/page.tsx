'use client'

// T2 Tablero de puesto — «¿Cómo voy yo este mes?»
// Hasta 6 indicadores del puesto en el orden del proceso.
// Ritmo del mes (acumulado diario) + calificación ponderada + composición.
// Ref: doc 12-pantallas §T2 · doc 13-detalle §T2

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, LayoutGrid, TrendingUp, Settings } from 'lucide-react'
import { Shell } from '@/components/shell'
import type { App, MenuGrupo } from '@/components/shell'

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface IndicadorPuesto {
  tipo: string        // RUMBO / EMPUJE / META / TRACCIÓN
  area: string        // código de área: AC / BDC / FI / VN / FIN / POST
  nombre: string
  real: string        // formateado para mostrar
  objetivo: string    // formateado (con "/" implícito)
  avance: number      // 0-1 decimal
  barColor: string    // color de relleno de la barra (light)
  barLabel?: string   // si no es porcentaje, e.g. 'DENTRO'
  markPct: number     // posición del marcador de días (0-100)
  varM?: { signo: '+' | '-' | '='; valor: string; color: string }
  varA?: { signo: '+' | '-' | '='; valor: string; color: string }
  clase: string       // DES / CTL / REF / PER
  alarma?: { texto: string }
}

interface FilaComposicion {
  nombre: string
  peso: string
  aporte: string
  colorAporte: string   // hex
  esProblema?: boolean  // resaltar fondo rojo
}

// ── Datos de ejemplo (MG Celaya · Gerente de sucursal · Ago 2026 · Corte 27) ──

const INDICADORES: IndicadorPuesto[] = [
  {
    tipo: 'RUMBO', area: 'AC', nombre: 'Afluencia',
    real: '1,010', objetivo: '1,456', avance: 0.69,
    barColor: '#C2352B', markPct: 87,
    varM: { signo: '+', valor: '▲12%', color: '#0B7A53' },
    varA: { signo: '+', valor: '▲6%', color: '#0B7A53' },
    clase: 'DES',
  },
  {
    tipo: 'EMPUJE', area: 'BDC', nombre: 'Citas asistidas',
    real: '464', objetivo: '424', avance: 1.09,
    barColor: '#0E8A5F', markPct: 87,
    varM: { signo: '+', valor: '▲15%', color: '#0B7A53' },
    varA: { signo: '+', valor: '▲21%', color: '#0B7A53' },
    clase: 'DES',
  },
  {
    tipo: 'EMPUJE', area: 'FI', nombre: 'Solicitudes de crédito',
    real: '240', objetivo: '726', avance: 0.33,
    barColor: '#C2352B', markPct: 87,
    clase: 'DES',
    alarma: { texto: 'No alcanza al mejor ritmo' },
  },
  {
    tipo: 'EMPUJE', area: 'VN', nombre: 'Ventas cerradas',
    real: '96', objetivo: '112', avance: 0.86,
    barColor: '#B7791F', markPct: 87,
    varM: { signo: '+', valor: '▲3%', color: '#0B7A53' },
    varA: { signo: '-', valor: '▼5%', color: '#C2352B' },
    clase: 'DES',
  },
  {
    tipo: 'META', area: 'FIN', nombre: 'Facturación',
    real: '$25.5M', objetivo: '28.0M', avance: 0.91,
    barColor: '#B7791F', markPct: 87,
    varM: { signo: '+', valor: '▲6%', color: '#0B7A53' },
    varA: { signo: '-', valor: '▼12%', color: '#C2352B' },
    clase: 'DES',
  },
  {
    tipo: 'TRACCIÓN', area: 'POST', nombre: 'Satisfacción',
    real: '9.1', objetivo: 'mín 8.8', avance: 1.0,
    barColor: '#0E8A5F', barLabel: 'DENTRO', markPct: 78,
    varM: { signo: '=', valor: '=0.0', color: '#6B7482' },
    varA: { signo: '+', valor: '▲0.3', color: '#0B7A53' },
    clase: 'CTL',
  },
]

const COMPOSICION: FilaComposicion[] = [
  { nombre: 'Ventas cerradas',          peso: '30%', aporte: '25.8', colorAporte: '#8A5A12' },
  { nombre: 'Facturación',              peso: '25%', aporte: '22.8', colorAporte: '#8A5A12' },
  { nombre: 'Solicitudes de crédito',   peso: '15%', aporte: '5.0',  colorAporte: '#C2352B', esProblema: true },
  { nombre: 'Citas asistidas',          peso: '15%', aporte: '16.4', colorAporte: '#0B7A53' },
  { nombre: 'Afluencia',                peso: '10%', aporte: '6.9',  colorAporte: '#C2352B' },
  { nombre: 'Satisfacción',             peso: '5%',  aporte: '5.0',  colorAporte: '#0B7A53' },
]

// Barras ritmo (31 días de agosto): [height%, color, hatched]
type Barra = { h: number; c: string; hatched?: boolean }
const BARRAS: Barra[] = [
  // Días 1-13: rojo claro
  { h: 3,    c: '#e7b0ab' }, { h: 5,    c: '#e7b0ab' }, { h: 7,    c: '#e7b0ab' },
  { h: 9,    c: '#e7b0ab' }, { h: 10,   c: '#e7b0ab' }, { h: 12,   c: '#e7b0ab' },
  { h: 14,   c: '#e7b0ab' }, { h: 16,   c: '#e7b0ab' }, { h: 17,   c: '#e7b0ab' },
  { h: 18,   c: '#e7b0ab' }, { h: 20,   c: '#e7b0ab' }, { h: 21,   c: '#e7b0ab' },
  { h: 22,   c: '#e7b0ab' },
  // Días 14-20: rojo medio
  { h: 23,   c: '#d97f77' }, { h: 24,   c: '#d97f77' }, { h: 25,   c: '#d97f77' },
  { h: 26,   c: '#d97f77' }, { h: 27,   c: '#d97f77' }, { h: 28,   c: '#d97f77' },
  { h: 29,   c: '#d97f77' },
  // Días 21-27: rojo vivo (hoy)
  { h: 29.5, c: '#C2352B' }, { h: 30,   c: '#C2352B' }, { h: 30.5, c: '#C2352B' },
  { h: 31,   c: '#C2352B' }, { h: 32,   c: '#C2352B' }, { h: 32.5, c: '#C2352B' },
  { h: 33,   c: '#C2352B' },
  // Días 28-31: futuro (rayado)
  { h: 100, c: '', hatched: true }, { h: 100, c: '', hatched: true },
  { h: 100, c: '', hatched: true }, { h: 100, c: '', hatched: true },
]

// ── Apps y menú ────────────────────────────────────────────────────────────────

const APPS: App[] = [
  { id: 'hub',            nombre: 'Hub',            Icono: LayoutGrid },
  { id: 'finanzas',       nombre: 'Finanzas',       Icono: TrendingUp, badge: 3 },
  { id: 'indicadores',    nombre: 'Indicadores',    Icono: BarChart },
  { id: 'configuracion',  nombre: 'Configuración',  Icono: Settings },
]

const GRUPOS: MenuGrupo[] = [
  {
    items: [
      { id: 'puesto',    etiqueta: 'Mi puesto' },
      { id: 'equipo',    etiqueta: 'Mi equipo' },
      { id: 'sucursal',  etiqueta: 'Sucursal' },
    ],
  },
]

// ── Sub-componentes ────────────────────────────────────────────────────────────

function TarjetaT2({ ind }: { ind: IndicadorPuesto }) {
  const colorBarra = ind.barColor === '#C2352B' ? 'var(--nuc-rojo)'
    : ind.barColor === '#B7791F' ? 'var(--nuc-ambar)'
    : 'var(--nuc-verde-txt)'

  const pct = Math.min(ind.avance, 1) * 100
  const pctLabel = ind.barLabel ?? `${Math.round(ind.avance * 100)}%`
  const pctColor = ind.avance >= 1 ? 'var(--nuc-verde-txt)' : ind.avance >= 0.8 ? 'var(--nuc-ambar-txt)' : 'var(--nuc-rojo)'

  const colorAporte = (c: string) => {
    if (c === '#C2352B') return 'var(--nuc-rojo)'
    if (c === '#0B7A53') return 'var(--nuc-verde-txt)'
    return 'var(--nuc-ambar-txt)'
  }

  const tieneAlarma = Boolean(ind.alarma)

  return (
    <div style={{
      border: `1px solid ${tieneAlarma ? 'var(--nuc-alarma-border)' : 'var(--nuc-border)'}`,
      borderLeft: tieneAlarma ? `3px solid var(--nuc-rojo)` : undefined,
      background: 'var(--nuc-surface)',
      borderRadius: 6,
      padding: '11px 14px',
      height: 132,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Tipo · Área */}
      <div style={{ display: 'flex', alignItems: tieneAlarma ? 'center' : 'baseline', gap: 6, flex: 'none' }}>
        {tieneAlarma && (
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--nuc-rojo)', flexShrink: 0 }} />
        )}
        <span style={{ font: '500 11px var(--font-geist-mono), monospace', letterSpacing: '.07em', color: 'var(--nuc-ink-2)' }}>
          {ind.tipo}
        </span>
        <span style={{ marginLeft: 'auto', font: '500 11px var(--font-geist-mono), monospace', letterSpacing: '.06em', color: 'var(--nuc-ink-2)' }}>
          {ind.area}
        </span>
      </div>

      {/* Nombre */}
      <div style={{
        font: '600 14.5px/1.25 var(--font-geist-sans), sans-serif',
        color: 'var(--nuc-ink)',
        flex: 'none',
        marginTop: 6,
        overflow: 'hidden',
        maxHeight: 36,
      }}>
        {ind.nombre}
      </div>

      {/* Cifra real / objetivo */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: tieneAlarma ? 6 : 7 }}>
        <span style={{
          font: `600 ${ind.real.startsWith('$') ? 24 : 27}px/1 var(--font-geist-mono), monospace`,
          letterSpacing: '-.035em',
          color: 'var(--nuc-ink)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {ind.real}
        </span>
        <span style={{ font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-2)' }}>
          /{ind.objetivo}
        </span>
      </div>

      {/* Barra de progreso + marcador de días + porcentaje */}
      {!tieneAlarma ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 7, height: 14 }}>
          <div style={{ flex: 1, height: 4, background: 'var(--nuc-surface-hover)', borderRadius: 2, position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${Math.min(pct, 100)}%`,
              background: colorBarra,
              borderRadius: 2,
            }} />
            <div style={{
              position: 'absolute',
              left: `${ind.markPct}%`,
              top: -3, bottom: -3,
              width: 1,
              background: 'var(--nuc-ink)',
            }} />
          </div>
          <span style={{ font: '700 12.5px/14px var(--font-geist-mono), monospace', color: pctColor, flexShrink: 0 }}>
            {pctLabel}
          </span>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 6, height: 14 }}>
            <div style={{ flex: 1, height: 4, background: 'var(--nuc-surface-hover)', borderRadius: 2, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${Math.min(pct, 100)}%`,
                background: colorBarra,
                borderRadius: 2,
              }} />
              <div style={{
                position: 'absolute',
                left: `${ind.markPct}%`,
                top: -3, bottom: -3,
                width: 1,
                background: 'var(--nuc-ink)',
              }} />
            </div>
            <span style={{ font: '700 12.5px/14px var(--font-geist-mono), monospace', color: pctColor, flexShrink: 0 }}>
              {pctLabel}
            </span>
          </div>
          {/* Franja de alarma */}
          <div style={{
            margin: 'auto -14px -11px',
            padding: '7px 14px',
            background: 'var(--nuc-alarma-bg)',
            borderTop: `1px solid var(--nuc-alarma-border)`,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}>
            <span style={{
              font: '600 11px var(--font-geist-sans), sans-serif',
              color: 'var(--nuc-rojo)',
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}>
              {ind.alarma!.texto}
            </span>
            <span style={{ font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-acc)', flexShrink: 0 }}>
              ver ›
            </span>
          </div>
        </>
      )}

      {/* Footer: comparativos M/A + clase */}
      {!tieneAlarma && (
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {ind.varM && (
            <span style={{ font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-2)', flexShrink: 0 }}>
              M <b style={{ color: colorAporte(ind.varM.color), fontWeight: 600 }}>{ind.varM.valor}</b>
            </span>
          )}
          {ind.varA && (
            <span style={{ font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-2)', flexShrink: 0 }}>
              A <b style={{ color: colorAporte(ind.varA.color), fontWeight: 600 }}>{ind.varA.valor}</b>
            </span>
          )}
          <span style={{ marginLeft: 'auto', font: '500 11px var(--font-geist-mono), monospace', letterSpacing: '.05em', color: 'var(--nuc-ink-2)' }}>
            {ind.clase}
          </span>
        </div>
      )}
    </div>
  )
}

function GraficoRitmo() {
  return (
    <div style={{ background: 'var(--nuc-surface)', border: `1px solid var(--nuc-border)`, borderRadius: 6, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '11px 16px', borderBottom: `1px solid var(--nuc-border-sub)`, display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <div style={{ font: '600 13px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
          Ritmo del mes
        </div>
        <div style={{ font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-2)' }}>
          SOLICITUDES DE CRÉDITO · ACUMULADO DIARIO
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, font: '500 10.5px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-2)' }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: 'var(--nuc-rojo)' }} />
            REAL
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, font: '500 10.5px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-2)' }}>
            <span style={{ width: 12, height: 0, borderTop: `1.5px dashed var(--nuc-ink)`, display: 'inline-block' }} />
            RITMO PARA LA META
          </span>
        </div>
      </div>

      {/* Área del gráfico */}
      <div style={{ flex: 1, minHeight: 0, padding: '14px 16px 10px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 16, right: 16, top: 14, bottom: 26 }}>
          {/* Línea punteada de ritmo (SVG) */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
          >
            <line
              x1="0" y1="100" x2="87" y2="12"
              stroke="var(--nuc-ink)"
              strokeWidth="1"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Barras */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
            {BARRAS.map((b, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${b.h}%`,
                  background: b.hatched
                    ? `repeating-linear-gradient(135deg,var(--nuc-surface-sub),var(--nuc-surface-sub) 3px,var(--nuc-surface) 3px,var(--nuc-surface) 6px)`
                    : b.c,
                  borderLeft: b.hatched && i === BARRAS.findIndex((x) => x.hatched) ? `1px solid var(--nuc-border-input)` : undefined,
                }}
              />
            ))}
          </div>

          {/* Etiquetas de días */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: -20, height: 12,
            font: '500 10px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-4)',
          }}>
            <span style={{ position: 'absolute', left: 0 }}>1 AGO</span>
            <span style={{ position: 'absolute', left: '32%', transform: 'translateX(-50%)' }}>10</span>
            <span style={{ position: 'absolute', left: '64.5%', transform: 'translateX(-50%)' }}>20</span>
            <span style={{ position: 'absolute', left: '87%', transform: 'translateX(-50%)' }}>27 HOY</span>
            <span style={{ position: 'absolute', right: 0 }}>31</span>
          </div>
        </div>

        {/* Callout de alerta */}
        <div style={{
          position: 'absolute', right: 22, top: 20,
          background: 'var(--nuc-alarma-bg)',
          border: `1px solid var(--nuc-alarma-border)`,
          borderRadius: 6,
          padding: '9px 11px',
          width: 238,
        }}>
          <div style={{ font: '600 11.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-rojo)', marginBottom: 4 }}>
            Faltan 486 en 4 días
          </div>
          <div style={{ font: '400 11px/1.5 var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-2)' }}>
            Al mejor ritmo del mes (18/día) llegarías a 312. La meta exige 121 diarias.
          </div>
        </div>
      </div>
    </div>
  )
}

function PanelComposicion() {
  function colorAporte(hex: string) {
    if (hex === '#C2352B') return 'var(--nuc-rojo)'
    if (hex === '#0B7A53') return 'var(--nuc-verde-txt)'
    return 'var(--nuc-ambar-txt)'
  }

  return (
    <div style={{ background: 'var(--nuc-surface)', border: `1px solid var(--nuc-border)`, borderRadius: 6, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '11px 14px', borderBottom: `1px solid var(--nuc-border-sub)`, display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{ font: '600 13px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
          Qué mueve tu 85%
        </div>
        <div style={{ marginLeft: 'auto', font: '500 10.5px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-2)' }}>
          PESO · APORTE
        </div>
      </div>

      {/* Filas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {COMPOSICION.map((fila, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 34px 44px',
              gap: 8,
              alignItems: 'center',
              padding: '8px 14px',
              borderBottom: `1px solid var(--nuc-surface-sub)`,
              background: fila.esProblema ? 'var(--nuc-alarma-bg)' : undefined,
            }}
          >
            <span style={{
              font: `${fila.esProblema ? '500' : '400'} 11.5px var(--font-geist-sans), sans-serif`,
              color: fila.esProblema ? 'var(--nuc-rojo)' : 'var(--nuc-ink)',
            }}>
              {fila.nombre}
            </span>
            <span style={{
              font: '500 11px var(--font-geist-mono), monospace',
              color: 'var(--nuc-ink-2)',
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {fila.peso}
            </span>
            <span style={{
              font: '600 11.5px var(--font-geist-mono), monospace',
              color: colorAporte(fila.colorAporte),
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {fila.aporte}
            </span>
          </div>
        ))}

        {/* Total */}
        <div style={{
          marginTop: 'auto',
          padding: '10px 14px',
          borderTop: `1px solid var(--nuc-border)`,
          background: 'var(--nuc-surface-header)',
          display: 'flex',
          alignItems: 'baseline',
        }}>
          <span style={{ font: '600 11.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
            Total ponderado
          </span>
          <span style={{ marginLeft: 'auto', font: '700 14px var(--font-geist-mono), monospace', color: 'var(--nuc-ink)', fontVariantNumeric: 'tabular-nums' }}>
            85%
          </span>
        </div>

        {/* Nota de palanca */}
        <div style={{ padding: '11px 14px', borderTop: `1px solid var(--nuc-border)`, font: '400 11px/1.55 var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-2)' }}>
          Subir crédito a 60% te pondría en <b style={{ color: 'var(--nuc-ink)' }}>89%</b> sin tocar nada más.
        </div>
      </div>
    </div>
  )
}

// ── Página ─────────────────────────────────────────────────────────────────────

export default function TableroPuestoPage() {
  const router = useRouter()

  const [modo, setModo] = useState<'mes' | 'acumulado'>('mes')

  return (
    <Shell
      apps={APPS}
      appActiva="indicadores"
      nombreApp="Indicadores"
      periodo="Ago 2026"
      grupos={GRUPOS}
      itemActivo="puesto"
      onAppChange={(id) => { if (id === 'hub') router.push('/'); else if (id === 'indicadores') router.push('/indicadores') }}
      onItemChange={(id) => { if (id === 'equipo' || id === 'sucursal') router.push('/indicadores') }}
    >
      {/* Contenedor principal: mesa + tira Núcleo */}
      <div style={{ display: 'flex', height: '100%', background: 'var(--nuc-mesa)' }}>

        {/* Mesa */}
        <div style={{
          flex: 1,
          minWidth: 0,
          padding: '18px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          overflow: 'hidden',
        }}>

          {/* Encabezado de pantalla */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <div>
              <h3 style={{
                margin: '0 0 3px',
                font: '600 19px/1 var(--font-geist-sans), sans-serif',
                letterSpacing: '-.02em',
                color: 'var(--nuc-ink)',
              }}>
                Tu desempeño de agosto
              </h3>
              <div style={{ font: '500 11px var(--font-geist-mono), monospace', letterSpacing: '.05em', color: 'var(--nuc-ink-2)' }}>
                CORTE 27 AGO 04:12 · 6 INDICADORES DEL PUESTO · DÍA 27 DE 31
              </div>
            </div>

            {/* Chips de días y calificación */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'stretch', gap: 10 }}>
              {/* Días transcurridos */}
              <div style={{
                border: `1px solid var(--nuc-border)`,
                borderRadius: 7,
                padding: '8px 13px',
                background: 'var(--nuc-surface)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <div style={{ font: '500 10.5px var(--font-geist-mono), monospace', letterSpacing: '.06em', color: 'var(--nuc-ink-2)' }}>
                  DÍAS TRANSCURRIDOS
                </div>
                <div style={{ font: '600 15px var(--font-geist-mono), monospace', color: 'var(--nuc-ink)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                  87%
                  <span style={{ font: '500 11px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-2)', marginLeft: 6 }}>
                    27 de 31
                  </span>
                </div>
              </div>

              {/* Calificación ponderada — siempre navy */}
              <div style={{
                background: '#00244D',
                borderRadius: 7,
                padding: '8px 15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <div style={{ font: '500 10.5px var(--font-geist-mono), monospace', letterSpacing: '.06em', color: '#A8C4E0' }}>
                  CALIFICACIÓN PONDERADA
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                  <span style={{ font: '600 19px var(--font-geist-mono), monospace', letterSpacing: '-.03em', color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
                    85%
                  </span>
                  <span style={{ font: '500 11px var(--font-geist-mono), monospace', color: '#8FE3BF' }}>
                    ▲4 vs jul
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Controles de vista (Mes / Acumulado) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex',
              height: 30,
              border: `1px solid var(--nuc-border)`,
              borderRadius: 6,
              overflow: 'hidden',
              alignSelf: 'flex-start',
            }}>
              {(['mes', 'acumulado'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModo(m)}
                  style={{
                    padding: '0 11px',
                    display: 'grid',
                    placeItems: 'center',
                    background: modo === m ? 'var(--nuc-ink)' : 'transparent',
                    color: modo === m ? 'var(--nuc-surface)' : 'var(--nuc-ink-2)',
                    font: `${modo === m ? '600' : '500'} 11.5px var(--font-geist-sans), sans-serif`,
                    border: 'none',
                    borderLeft: m === 'acumulado' ? `1px solid var(--nuc-border)` : 'none',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {m === 'mes' ? 'Mes' : 'Acumulado'}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de 6 tarjetas de indicadores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 11 }}>
            {INDICADORES.map((ind) => (
              <TarjetaT2 key={ind.area} ind={ind} />
            ))}
          </div>

          {/* Fila inferior: ritmo del mes + composición */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 300px', gap: 12 }}>
            <GraficoRitmo />
            <PanelComposicion />
          </div>
        </div>

        {/* Tira Núcleo AI (44px) */}
        <div style={{
          width: 44,
          flexShrink: 0,
          background: 'var(--nuc-surface)',
          borderLeft: `1px solid var(--nuc-border)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 0',
          gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'var(--nuc-surface-hover)',
            border: `1px solid var(--nuc-border-input)`,
            display: 'grid',
            placeItems: 'center',
          }}>
            {/* Logo Núcleo (placeholder SVG) */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" fill="#2F6BFF" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#2F6BFF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{
            font: '500 10px var(--font-geist-mono), monospace',
            color: 'var(--nuc-ink-2)',
            writingMode: 'vertical-rl',
            letterSpacing: '.14em',
          }}>
            NÚCLEO
          </div>
        </div>
      </div>
    </Shell>
  )
}
