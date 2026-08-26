'use client'

// Pantalla de Indicadores — tablero con los 4 usos.
// T2 (Puesto) + T3 (Gestión). La AI decide el uso según el contexto.
// Filtros: tipo (píldoras), periodo (selector).
// Ref: design.md §17 T2/T3, §11

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutGrid,
  TrendingUp,
  BarChart,
  Settings,
} from 'lucide-react'
import { Shell } from '@/components/shell'
import type { App, MenuGrupo } from '@/components/shell'
import { Uso1 } from '@/components/nucleo-adc/tablero/uso1'
import { Uso2 } from '@/components/nucleo-adc/tablero/uso2'
import { PilloraFiltro } from '@/components/nucleo-adc/ui/pillora-filtro'
import { SelectorPeriodo } from '@/components/nucleo-adc/ui/selector-periodo'
import { PanelDetalle } from '@/components/nucleo-adc/panel-detalle/panel-detalle'
import type { Indicador, Alarma } from '@/components/nucleo-adc/indicadores/types'

// ── Datos de ejemplo ─────────────────────────────────────────────────────────

const BASE: Omit<
  Indicador,
  'claveIndicador' | 'nombreIndicador' | 'tipoIndicadorClave' | 'tipoIndicadorNombre' | 'valor' | 'avanceObjetivo' | 'objetivo' | 'varSPLM' | 'varSPLY'
> = {
  nivelNombre: 'MG Celaya',
  nivelTipo: 'Sucursal',
  claseClave: 'DESEMPENO',
  unidadMedidaClave: 'UNI',
  unidadMedidaFormato: '#,##0',
  direccionDeseable: 'Arriba',
  nivelLectura: 'MANDO',
  peso: null,
  esAcumulativo: true,
  valorCentro: null,
  toleranciaInf: null,
  toleranciaSup: null,
  valorReferencia: null,
  numerador: null,
  denominador: null,
  responsable: 'Gerencia',
  periodicidad: 'MENSUAL',
  estatusCalculo: 'OK',
  fecha: '2026-08-25',
}

const INDICADORES: Indicador[] = [
  {
    ...BASE,
    claveIndicador: 'VTA_WALKIN',
    nombreIndicador: 'Tráfico Walk-In',
    tipoIndicadorClave: '3EM',
    tipoIndicadorNombre: 'EMPUJE',
    valor: 483,
    avanceObjetivo: 0.831,
    objetivo: 581,
    varSPLM: 0.28,
    varSPLY: 0.21,
  },
  {
    ...BASE,
    claveIndicador: 'VTA_UNIDADES',
    nombreIndicador: 'Unidades Vendidas',
    tipoIndicadorClave: '1META',
    tipoIndicadorNombre: 'META',
    valor: 42,
    avanceObjetivo: 1.05,
    objetivo: 40,
    varSPLM: 0.12,
    varSPLY: 0.30,
  },
  {
    ...BASE,
    claveIndicador: 'VTA_FINANCIAMIENTO',
    nombreIndicador: 'Penetración de Financiamiento',
    tipoIndicadorClave: '2RUMBO',
    tipoIndicadorNombre: 'RUMBO',
    unidadMedidaFormato: '#,##0.0%',
    valor: 0.64,
    avanceObjetivo: 0.914,
    objetivo: 0.70,
    varSPLM: -0.03,
    varSPLY: 0.07,
  },
  {
    ...BASE,
    claveIndicador: 'SATISFACCION',
    nombreIndicador: 'Satisfacción del Cliente',
    tipoIndicadorClave: '4ARR',
    tipoIndicadorNombre: 'ARRANQUE',
    claseClave: 'PERCEPCION',
    unidadMedidaFormato: '#,##0.0',
    valor: 78,
    avanceObjetivo: 0.779,
    objetivo: 100,
    varSPLM: -0.04,
    varSPLY: 0.03,
  },
  {
    ...BASE,
    claveIndicador: 'MARGEN_NUEVO',
    nombreIndicador: 'Margen en Vehículos Nuevos',
    tipoIndicadorClave: '1META',
    tipoIndicadorNombre: 'META',
    unidadMedidaFormato: '$#,##0',
    valor: 3_800_000,
    avanceObjetivo: 0.76,
    objetivo: 5_000_000,
    varSPLM: -0.11,
    varSPLY: 0.04,
  },
  {
    ...BASE,
    claveIndicador: 'VTA_POSVENTA',
    nombreIndicador: 'Ingresos Posventa',
    tipoIndicadorClave: '3EM',
    tipoIndicadorNombre: 'EMPUJE',
    unidadMedidaFormato: '$#,##0',
    valor: 2_100_000,
    avanceObjetivo: 0.966,
    objetivo: 2_173_000,
    varSPLM: 0.05,
    varSPLY: 0.18,
  },
  {
    ...BASE,
    claveIndicador: 'EFICIENCIA_TALLER',
    nombreIndicador: 'Eficiencia del Taller',
    tipoIndicadorClave: '2RUMBO',
    tipoIndicadorNombre: 'RUMBO',
    unidadMedidaFormato: '#,##0.0%',
    valor: 0.82,
    avanceObjetivo: 0.911,
    objetivo: 0.90,
    varSPLM: -0.02,
    varSPLY: 0.06,
  },
  {
    ...BASE,
    claveIndicador: 'ROTACION_INVENTARIO',
    nombreIndicador: 'Rotación de Inventario',
    tipoIndicadorClave: '4ARR',
    tipoIndicadorNombre: 'ARRANQUE',
    unidadMedidaFormato: '#,##0.0',
    valor: 45,
    avanceObjetivo: 0.817,
    objetivo: 55,
    varSPLM: 0.09,
    varSPLY: -0.04,
    estatusCalculo: 'OK',
  },
]

const ALARMAS: Record<string, Alarma> = {
  SATISFACCION: { nivel: 'ATENCION', motivo: 'Cerrará bajo meta al ritmo actual', desde: '2026-08-20' },
  MARGEN_NUEVO: { nivel: 'CRITICA', motivo: 'Brecha no recuperable este mes', desde: '2026-08-15' },
  ROTACION_INVENTARIO: { nivel: 'ATENCION', motivo: '38 días sobre el umbral', desde: '2026-08-10' },
}

// ── Menú y apps ─────────────────────────────────────────────────────────────────

const APPS: App[] = [
  { id: 'hub', nombre: 'Hub', Icono: LayoutGrid },
  { id: 'finanzas', nombre: 'Finanzas', Icono: TrendingUp, badge: 3 },
  { id: 'indicadores', nombre: 'Indicadores', Icono: BarChart },
  { id: 'configuracion', nombre: 'Configuración', Icono: Settings },
]

const GRUPOS_IND: MenuGrupo[] = [
  {
    items: [
      { id: 'puesto', etiqueta: 'Mi puesto' },
      { id: 'equipo', etiqueta: 'Mi equipo' },
      { id: 'sucursal', etiqueta: 'Sucursal' },
    ],
  },
  {
    rotulo: 'FILTROS',
    items: [
      { id: 'meta', etiqueta: 'META' },
      { id: 'rumbo', etiqueta: 'RUMBO' },
      { id: 'empuje', etiqueta: 'EMPUJE' },
    ],
  },
]

type FiltroTipo = 'todos' | 'META' | 'RUMBO' | 'EMPUJE' | 'ARRANQUE' | 'REFERENCIA'

// ── Pantalla ─────────────────────────────────────────────────────────────────────

export default function IndicadoresPage() {
  const router = useRouter()
  const [filtro, setFiltro] = useState<FiltroTipo>('todos')
  const [anio, setAnio] = useState(2026)
  const [mes, setMes] = useState(8)
  const [panelAbierto, setPanelAbierto] = useState<string | null>(null)

  const indicadorDetalle = INDICADORES.find((i) => i.claveIndicador === panelAbierto)

  const indicadoresFiltrados = filtro === 'todos'
    ? INDICADORES
    : INDICADORES.filter((i) => i.tipoIndicadorNombre === filtro)

  // ≤6 → Uso 1 (tira). ≥7 → Uso 2 (lista agrupada)
  const usarUso1 = indicadoresFiltrados.length <= 6

  return (
    <Shell
      apps={APPS}
      appActiva="indicadores"
      nombreApp="Indicadores"
      periodo={`${['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][mes]} ${anio}`}
      grupos={GRUPOS_IND}
      itemActivo="puesto"
      onAppChange={(id) => { if (id === 'hub') router.push('/') }}
      onItemChange={(id) => { if (id === 'puesto') router.push('/indicadores/tablero-puesto') }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Encabezado de pantalla */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 22,
                fontWeight: 600,
                lineHeight: 1.15,
                letterSpacing: '-.02em',
                color: '#0E1116',
                margin: '0 0 4px',
              }}
            >
              Mis indicadores
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 12.5,
                fontWeight: 400,
                color: '#5B6472',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {indicadoresFiltrados.length} indicadores · MG Celaya · Al 25 de agosto
            </p>
          </div>

          <SelectorPeriodo
            anio={anio}
            mes={mes}
            onCambiar={(a, m) => { setAnio(a); setMes(m) }}
          />
        </div>

        {/* Filtros por tipo */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['todos', 'META', 'RUMBO', 'EMPUJE', 'ARRANQUE'] as FiltroTipo[]).map((f) => (
            <PilloraFiltro
              key={f}
              etiqueta={f === 'todos' ? 'Todos' : f}
              activa={filtro === f}
              onClick={() => setFiltro(f)}
            />
          ))}
        </div>

        {/* Uso 1 o Uso 2 según cantidad */}
        {usarUso1 ? (
          <Uso1
            items={indicadoresFiltrados.map((ind) => ({
              indicador: ind,
              tono: ind.tipoIndicadorNombre === 'META' ? 'destacado' : 'normal',
              alarma: ALARMAS[ind.claveIndicador],
            }))}
            onDetalle={(clave) => setPanelAbierto(clave)}
          />
        ) : (
          <Uso2
            grupos={[
              {
                rotulo: 'MG CELAYA',
                items: indicadoresFiltrados.map((ind) => ({
                  indicador: ind,
                  alarma: ALARMAS[ind.claveIndicador],
                  activa: panelAbierto === ind.claveIndicador,
                })),
              },
            ]}
            onDetalle={(clave) => setPanelAbierto(clave)}
          />
        )}
      </div>

      {/* Panel de detalle */}
      {panelAbierto && indicadorDetalle && (
        <PanelDetalle
          indicador={indicadorDetalle}
          meses={[
            { mes: 'Sep', real: null, objetivo: null },
            { mes: 'Oct', real: 510, objetivo: 560 },
            { mes: 'Nov', real: 490, objetivo: 558 },
            { mes: 'Dic', real: 520, objetivo: 570 },
            { mes: 'Ene', real: 445, objetivo: 540 },
            { mes: 'Feb', real: 460, objetivo: 545 },
            { mes: 'Mar', real: 495, objetivo: 550 },
            { mes: 'Abr', real: 500, objetivo: 555 },
            { mes: 'May', real: 515, objetivo: 560 },
            { mes: 'Jun', real: 490, objetivo: 565 },
            { mes: 'Jul', real: 505, objetivo: 570 },
            { mes: 'Ago', real: indicadorDetalle.valor, objetivo: indicadorDetalle.objetivo, esActual: true },
          ]}
          filasPeriodos={[
            {
              periodo: 'Ago 2026',
              real: indicadorDetalle.valor,
              objetivo: indicadorDetalle.objetivo,
              avance: indicadorDetalle.avanceObjetivo,
            },
            { periodo: 'Jul 2026', real: 505, objetivo: 570, avance: 0.886 },
            { periodo: 'Jun 2026', real: 490, objetivo: 565, avance: 0.867 },
          ]}
          definicion="Definición del indicador según el catálogo MDM. Esta información proviene de dim.Indicador y describe qué se mide y qué no."
          resumenNucleo={`Al ritmo de los últimos 5 días, ${indicadorDetalle.nombreIndicador} cerrará en el ${indicadorDetalle.avanceObjetivo !== null ? Math.round(indicadorDetalle.avanceObjetivo * 100) : '—'}% del objetivo.`}
          fuenteNucleo="Fuente: fact.Indicador_Real · dim.Indicador · Corte 25-ago-2026"
          onCerrar={() => setPanelAbierto(null)}
          onPreguntarNucleo={() => {}}
        />
      )}
    </Shell>
  )
}
