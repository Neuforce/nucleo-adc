'use client'

// Pantalla Reportes generados — 3 plantillas de salida del MCP.
// Tipo A: Respuesta directa · Tipo B: Listado · Tipo C: Análisis
// Ref: design.md §11 reportes-gen, §17 pantallas

import { useRouter } from 'next/navigation'
import {
  LayoutGrid,
  TrendingUp,
  BarChart,
  Settings,
  FileText,
} from 'lucide-react'
import { Shell } from '@/components/shell'
import type { App, MenuGrupo } from '@/components/shell'
import { MarcoGenerado } from '@/components/nucleo-adc/reportes-gen/marco-generado'
import { RespuestaDirecta } from '@/components/nucleo-adc/reportes-gen/respuesta-directa'
import { ListadoGenerado } from '@/components/nucleo-adc/reportes-gen/listado-generado'
import { AnalisisGenerado } from '@/components/nucleo-adc/reportes-gen/analisis-generado'
import type { ColumnaListado, FilaListado, TotalListado } from '@/components/nucleo-adc/reportes-gen/listado-generado'

// ── Apps del rail ─────────────────────────────────────────────────────────────

const APPS: App[] = [
  { id: 'hub', nombre: 'Hub', Icono: LayoutGrid },
  { id: 'indicadores', nombre: 'Indicadores', Icono: TrendingUp },
  { id: 'reportes', nombre: 'Reportes', Icono: FileText },
  { id: 'graficas', nombre: 'Gráficas', Icono: BarChart },
  { id: 'configuracion', nombre: 'Configuración', Icono: Settings },
]

// ── Menú de la pantalla ───────────────────────────────────────────────────────

const GRUPOS: MenuGrupo[] = [
  {
    items: [
      { id: 'generados', etiqueta: 'Reportes generados' },
    ],
  },
  {
    rotulo: 'FIJOS',
    items: [
      { id: 'fijos', etiqueta: 'Ver reportes fijos' },
    ],
  },
]

// ── Datos Tipo B — columnas y filas ──────────────────────────────────────────

const COLUMNAS_LISTADO: ColumnaListado[] = [
  { clave: 'sucursal', etiqueta: 'SUCURSAL', alineacion: 'left', esIdentificador: true },
  { clave: 'unidades', etiqueta: 'UNIDADES', alineacion: 'right' },
  { clave: 'meta', etiqueta: 'META', alineacion: 'right' },
  { clave: 'avance', etiqueta: 'AVANCE', alineacion: 'right', esRespuesta: true },
]

const FILAS_LISTADO: FilaListado[] = [
  { id: 'celaya',     sucursal: 'MG Celaya',       unidades: 185, meta: 240, avance: 0.77 },
  { id: 'puebla',     sucursal: 'MG Puebla',        unidades:  98, meta: 160, avance: 0.61 },
  { id: 'queretaro',  sucursal: 'MG Querétaro',     unidades: 210, meta: 250, avance: 0.84 },
  { id: 'leon',       sucursal: 'MG León',          unidades: 302, meta: 340, avance: 0.89 },
  { id: 'morelia',    sucursal: 'MG Morelia',       unidades: 143, meta: 210, avance: 0.68 },
  { id: 'bajio',      sucursal: 'MG Bajío Norte',   unidades: 302, meta: 380, avance: 0.79 },
]

const TOTAL_LISTADO: TotalListado = {
  _etiqueta: '4 de 6 sucursales',
  unidades: 1240,
  meta: 1580,
  avance: 0.785,
}

// ── Datos Tipo C — serie de 12 meses ─────────────────────────────────────────

const SERIE_TALLER = [
  { etiqueta: 'Sep 25', valor: 0.91 },
  { etiqueta: 'Oct 25', valor: 0.89 },
  { etiqueta: 'Nov 25', valor: 0.90 },
  { etiqueta: 'Dic 25', valor: 0.88 },
  { etiqueta: 'Ene 26', valor: 0.86 },
  { etiqueta: 'Feb 26', valor: 0.87 },
  { etiqueta: 'Mar 26', valor: 0.89 },
  { etiqueta: 'Abr 26', valor: 0.88 },
  { etiqueta: 'May 26', valor: 0.86 },
  { etiqueta: 'Jun 26', valor: 0.85 },
  { etiqueta: 'Jul 26', valor: 0.84 },
  { etiqueta: 'Ago 26', valor: 0.82, esActual: true },
]

const DESCOMPOSICION_TALLER = [
  { nombre: 'Ausentismo técnicos', variacion: -0.034, esPrincipal: true, direccionDeseable: 'Arriba' as const },
  { nombre: 'Órdenes canceladas', variacion: -0.028, direccionDeseable: 'Arriba' as const },
  { nombre: 'Capacidad instalada',  variacion: -0.016, direccionDeseable: 'Arriba' as const },
  { nombre: 'Mejora en diagnóstico', variacion: 0.012, direccionDeseable: 'Arriba' as const },
]

// ── Rótulo de sección ────────────────────────────────────────────────────────

function RotuloSeccion({ texto }: { texto: string }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-geist-mono), monospace',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '.07em',
        color: '#98A0AC',
        marginBottom: 12,
      }}
    >
      {texto}
    </div>
  )
}

// ── Pregunta de ejemplo ───────────────────────────────────────────────────────

function PreguntaEjemplo({ texto }: { texto: string }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-geist-sans), sans-serif',
        fontSize: 12.5,
        fontWeight: 400,
        color: '#6B7482',
        marginBottom: 16,
        padding: '8px 12px',
        background: '#F4F5F7',
        borderRadius: 6,
        borderLeft: '3px solid #D8DCE2',
      }}
    >
      {texto}
    </div>
  )
}

// ── Pantalla ──────────────────────────────────────────────────────────────────

export default function ReportesGeneradosPage() {
  const router = useRouter()

  return (
    <Shell
      apps={APPS}
      appActiva="reportes"
      nombreApp="Reportes"
      periodo="Ago 2026"
      grupos={GRUPOS}
      itemActivo="generados"
      onAppChange={(id) => {
        if (id === 'hub') router.push('/')
        if (id === 'indicadores') router.push('/indicadores')
        if (id === 'reportes') router.push('/reportes')
      }}
      onItemChange={() => {}}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Encabezado de pantalla */}
        <div style={{ marginBottom: 32 }}>
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
            Reportes generados
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
            3 plantillas · salidas del MCP
          </p>
        </div>

        {/* ── Tipo A · Respuesta directa ────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <RotuloSeccion texto="TIPO A · RESPUESTA DIRECTA" />
          <PreguntaEjemplo texto="¿Cuántas unidades cerró Celaya este mes?" />
          <MarcoGenerado
            respuesta="MG Celaya lleva 185 unidades al 27 de agosto: 10% menos que el mes pasado al mismo día y 45% menos que agosto de 2025."
            alcance={{
              entidad: 'MG CELAYA',
              periodo: 'Ago 2026 · al 27',
              corte: '27 AGO 04:12',
              filtros: ['Venta directa y crédito'],
            }}
            comoSeObtuvo="Se contaron las unidades con EstatusVenta IN ('VENDIDA','ENTREGADA') con fecha_entrega entre el 01-ago y el 27-ago de 2026. Se excluyeron preventas sin enganche confirmado."
            fuentes={['fact.Ventas_Unidades', 'dim.Sucursal']}
            acciones={[
              { texto: 'Exportar a Excel', esPrimaria: true },
              { texto: 'Abrir en Ventas' },
              { texto: 'Guardar pregunta' },
            ]}
            cuerpo={
              <RespuestaDirecta
                unidad="UNIDADES"
                valor="185"
                comparativas={[
                  {
                    etiqueta: 'MES ANTERIOR',
                    valor: '206',
                    variacion: -0.10,
                    direccionDeseable: 'Arriba',
                  },
                  {
                    etiqueta: 'AÑO ANTERIOR',
                    valor: '336',
                    variacion: -0.45,
                    direccionDeseable: 'Arriba',
                  },
                ]}
                meta={null}
              />
            }
          />
        </div>

        {/* ── Tipo B · Listado ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <RotuloSeccion texto="TIPO B · LISTADO" />
          <PreguntaEjemplo texto="¿Qué sucursales están debajo del 80% de su meta de unidades?" />
          <MarcoGenerado
            respuesta="4 de 6 sucursales están debajo del 80% de la meta en agosto; la más rezagada es MG Puebla con 61%."
            alcance={{
              entidad: 'GRUPO ADC',
              periodo: 'Ago 2026 · al 27',
              corte: '27 AGO 04:12',
            }}
            comoSeObtuvo="Se calculó avance_objetivo = unidades_reales / meta_mes para cada sucursal con meta cargada. Se excluyeron sucursales sin meta en dim.Objetivo."
            fuentes={['fact.Ventas_Unidades', 'dim.Sucursal', 'dim.Objetivo']}
            acciones={[
              { texto: 'Exportar a Excel', esPrimaria: true },
              { texto: 'Abrir en Indicadores' },
              { texto: 'Guardar pregunta' },
            ]}
            cuerpo={
              <ListadoGenerado
                columnas={COLUMNAS_LISTADO}
                filas={FILAS_LISTADO}
                total={TOTAL_LISTADO}
              />
            }
          />
        </div>

        {/* ── Tipo C · Análisis ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <RotuloSeccion texto="TIPO C · ANÁLISIS" />
          <PreguntaEjemplo texto="¿Cómo ha evolucionado la Eficiencia del Taller en los últimos 12 meses?" />
          <MarcoGenerado
            respuesta="La Eficiencia del Taller bajó de 91% en septiembre a 82% en agosto; los últimos 3 meses muestran una tendencia descendente."
            alcance={{
              entidad: 'MG CELAYA',
              periodo: 'Sep 2025 – Ago 2026',
              corte: '27 AGO 04:12',
            }}
            comoSeObtuvo="Se calculó eficiencia = horas_productivas / horas_disponibles por mes para la sucursal MG Celaya. Se excluyeron días sin operación."
            fuentes={['fact.Taller_Eficiencia', 'dim.Calendario']}
            acciones={[
              { texto: 'Exportar a Excel', esPrimaria: true },
              { texto: 'Abrir en Taller' },
              { texto: 'Guardar pregunta' },
            ]}
            cuerpo={
              <AnalisisGenerado
                serieValores={SERIE_TALLER}
                metaValor={0.90}
                etiquetaMeta="META 90%"
                descomposicion={DESCOMPOSICION_TALLER}
                tituloDescomposicion="DÓNDE SE PIERDE"
              />
            }
          />
        </div>

      </div>
    </Shell>
  )
}
