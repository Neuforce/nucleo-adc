'use client'

// Pantalla de Reportes fijos — 6 formatos (F1–F6) con datos de muestra.
// Ref: design.md §17, doc 10-reportes-fijos

import { useRouter } from 'next/navigation'
import {
  LayoutGrid,
  BarChart,
  Settings,
  FileText,
} from 'lucide-react'
import { Shell } from '@/components/shell'
import type { App, MenuGrupo } from '@/components/shell'
import { MarcoReporte } from '@/components/nucleo-adc/reportes/marco-reporte'
import { FormatoF1 } from '@/components/nucleo-adc/reportes/formato-f1'
import { FormatoF2 } from '@/components/nucleo-adc/reportes/formato-f2'
import { FormatoF3 } from '@/components/nucleo-adc/reportes/formato-f3'
import { FormatoF4 } from '@/components/nucleo-adc/reportes/formato-f4'
import { FormatoF5 } from '@/components/nucleo-adc/reportes/formato-f5'
import { FormatoF6 } from '@/components/nucleo-adc/reportes/formato-f6'
import type { Indicador, Alarma } from '@/components/nucleo-adc/indicadores/types'

// ── Apps y menú ───────────────────────────────────────────────────────────────

const APPS: App[] = [
  { id: 'hub', nombre: 'Hub', Icono: LayoutGrid },
  { id: 'indicadores', nombre: 'Indicadores', Icono: BarChart },
  { id: 'reportes', nombre: 'Reportes', Icono: FileText },
  { id: 'configuracion', nombre: 'Configuración', Icono: Settings },
]

const GRUPOS: MenuGrupo[] = [
  {
    items: [
      { id: 'f1', etiqueta: 'F1 · Estado jerárquico' },
      { id: 'f2', etiqueta: 'F2 · Padrón operativo' },
      { id: 'f3', etiqueta: 'F3 · Evolución mensual' },
      { id: 'f4', etiqueta: 'F4 · Comparativo' },
      { id: 'f5', etiqueta: 'F5 · Conciliación' },
      { id: 'f6', etiqueta: 'F6 · Desempeño de área' },
    ],
  },
]

// ── Datos F1 — Estado de resultados ──────────────────────────────────────────

import type { ConceptoF1 } from '@/components/nucleo-adc/reportes/formato-f1'

const CONCEPTOS_F1: ConceptoF1[] = [
  // Ingresos
  {
    id: 'ing-grupo',
    nombre: 'Ingresos',
    esGrupo: true,
    real: 42_180_500,
    presupuesto: 40_000_000,
    varPresupuesto: 0.054,
    anterior: 38_420_000,
    varAnterior: 0.098,
    direccionDeseable: 'Arriba',
  },
  {
    id: 'ing-nuevos',
    nombre: 'Vehículos nuevos',
    sangria: true,
    real: 28_340_000,
    presupuesto: 26_500_000,
    varPresupuesto: 0.069,
    anterior: 25_800_000,
    varAnterior: 0.099,
    direccionDeseable: 'Arriba',
  },
  {
    id: 'ing-seminuevos',
    nombre: 'Vehículos seminuevos',
    sangria: true,
    real: 7_620_000,
    presupuesto: 7_200_000,
    varPresupuesto: 0.058,
    anterior: 6_930_000,
    varAnterior: 0.099,
    direccionDeseable: 'Arriba',
  },
  {
    id: 'ing-posventa',
    nombre: 'Posventa y refacciones',
    sangria: true,
    real: 6_220_500,
    presupuesto: 6_300_000,
    varPresupuesto: -0.013,
    anterior: 5_690_000,
    varAnterior: 0.093,
    direccionDeseable: 'Arriba',
  },
  // Costo de ventas
  {
    id: 'cv-grupo',
    nombre: 'Costo de ventas',
    esGrupo: true,
    real: 34_061_800,
    presupuesto: 32_400_000,
    varPresupuesto: 0.051,
    anterior: 31_020_000,
    varAnterior: 0.098,
    direccionDeseable: 'Abajo',
  },
  {
    id: 'cv-nuevos',
    nombre: 'Costo vehículos nuevos',
    sangria: true,
    real: 24_890_000,
    presupuesto: 23_300_000,
    varPresupuesto: 0.068,
    anterior: 22_650_000,
    varAnterior: 0.098,
    direccionDeseable: 'Abajo',
  },
  {
    id: 'cv-seminuevos',
    nombre: 'Costo vehículos seminuevos',
    sangria: true,
    real: 6_520_000,
    presupuesto: 6_180_000,
    varPresupuesto: 0.055,
    anterior: 5_950_000,
    varAnterior: 0.096,
    direccionDeseable: 'Abajo',
  },
  {
    id: 'cv-posventa',
    nombre: 'Costo posventa',
    sangria: true,
    real: 2_651_800,
    presupuesto: 2_920_000,
    varPresupuesto: -0.092,
    anterior: 2_420_000,
    varAnterior: 0.095,
    direccionDeseable: 'Abajo',
  },
  // Utilidad bruta
  {
    id: 'ub-total',
    nombre: 'Utilidad bruta',
    esTotal: true,
    real: 8_118_700,
    presupuesto: 7_600_000,
    varPresupuesto: 0.068,
    anterior: 7_400_000,
    varAnterior: 0.097,
    direccionDeseable: 'Arriba',
  },
  // Gastos operativos
  {
    id: 'go-grupo',
    nombre: 'Gastos operativos',
    esGrupo: true,
    real: 5_240_000,
    presupuesto: 5_100_000,
    varPresupuesto: 0.027,
    anterior: 4_980_000,
    varAnterior: 0.052,
    direccionDeseable: 'Abajo',
  },
  {
    id: 'go-personal',
    nombre: 'Nómina y prestaciones',
    sangria: true,
    real: 3_120_000,
    presupuesto: 3_050_000,
    varPresupuesto: 0.023,
    anterior: 2_940_000,
    varAnterior: 0.061,
    direccionDeseable: 'Abajo',
  },
  {
    id: 'go-mktg',
    nombre: 'Mercadotecnia',
    sangria: true,
    real: 780_000,
    presupuesto: 820_000,
    varPresupuesto: -0.049,
    anterior: 760_000,
    varAnterior: 0.026,
    direccionDeseable: 'Abajo',
  },
  {
    id: 'go-admin',
    nombre: 'Administración y otros',
    sangria: true,
    real: 1_340_000,
    presupuesto: 1_230_000,
    varPresupuesto: 0.089,
    anterior: 1_280_000,
    varAnterior: 0.047,
    direccionDeseable: 'Abajo',
  },
  // Utilidad operativa
  {
    id: 'uo-total',
    nombre: 'Utilidad operativa',
    esTotal: true,
    real: 2_878_700,
    presupuesto: 2_500_000,
    varPresupuesto: 0.151,
    anterior: 2_420_000,
    varAnterior: 0.189,
    direccionDeseable: 'Arriba',
  },
]

// ── Datos F2 — Padrón de unidades ─────────────────────────────────────────────

import type { FilaF2 } from '@/components/nucleo-adc/reportes/formato-f2'

const FILAS_F2: FilaF2[] = [
  { id: 'u01', vin: '3VW217AT8FM123401', nombre: 'Jetta 2024 · Plata Reflex', costo: 398_000, dias: 12, estatus: 'En piso', responsable: 'L. Torres' },
  { id: 'u02', vin: '3VW217AT8FM123402', nombre: 'Tiguan 2024 · Blanco Platino', costo: 612_000, dias: 28, estatus: 'Apartada', responsable: 'M. García' },
  { id: 'u03', vin: '3VW217AT8FM123403', nombre: 'Polo 2024 · Gris Plata', costo: 284_000, dias: 5, estatus: 'En piso', responsable: 'R. López' },
  { id: 'u04', vin: '3VW217AT8FM123404', nombre: 'Taos 2024 · Negro Profundo', costo: 510_000, dias: 67, estatus: 'Detenida', responsable: 'J. Ramírez' },
  { id: 'u05', vin: '3VW217AT8FM123405', nombre: 'Vento 2024 · Blanco Platino', costo: 316_000, dias: 3, estatus: 'En piso', responsable: 'L. Torres' },
  { id: 'u06', vin: '3VW217AT8FM123406', nombre: 'Tiguan R-Line 2024 · Rojo', costo: 698_000, dias: 45, estatus: 'Apartada', responsable: 'M. García' },
  { id: 'u07', vin: '3VW217AT8FM123407', nombre: 'Jetta Gli 2024 · Gris Platino', costo: 484_000, dias: 19, estatus: 'Vendida', responsable: 'R. López' },
  { id: 'u08', vin: '3VW217AT8FM123408', nombre: 'ID.4 2024 · Verde Amanecer', costo: 820_000, dias: 98, estatus: 'Detenida', responsable: 'C. Herrera' },
  { id: 'u09', vin: '3VW217AT8FM123409', nombre: 'Virtus 2024 · Blanco Orquídea', costo: 298_000, dias: 8, estatus: 'En piso', responsable: 'L. Torres' },
  { id: 'u10', vin: '3VW217AT8FM123410', nombre: 'Amarok 2024 · Gris Luna', costo: 985_000, dias: 55, estatus: 'Apartada', responsable: 'J. Ramírez' },
  { id: 'u11', vin: '3VW217AT8FM123411', nombre: 'Taos Highline 2024 · Azul Noche', costo: 572_000, dias: 31, estatus: 'En piso', responsable: 'M. García' },
  { id: 'u12', vin: '3VW217AT8FM123412', nombre: 'Golf GTI 2024 · Blanco Platino', costo: 556_000, dias: 112, estatus: 'Detenida', responsable: 'C. Herrera' },
]

// ── Datos F3 — Evolución mensual ─────────────────────────────────────────────

import type { FilaF3 } from '@/components/nucleo-adc/reportes/formato-f3'

const MESES_F3 = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO']

const FILAS_F3: FilaF3[] = [
  {
    id: 'vta',
    nombre: 'Unidades vendidas',
    esGrupo: true,
    valores: [38, 41, 45, 39, 44, 48, 42, 42],
    acumulado: 339,
  },
  {
    id: 'vta-real',
    nombre: 'Real',
    valores: [38, 41, 45, 39, 44, 48, 42, 42],
    acumulado: 339,
  },
  {
    id: 'vta-obj',
    nombre: 'Objetivo',
    valores: [40, 40, 40, 40, 40, 40, 40, 40],
    acumulado: 320,
  },
  {
    id: 'ing',
    nombre: 'Ingresos totales',
    esGrupo: true,
    valores: [36_200_000, 38_400_000, 41_100_000, 37_900_000, 39_800_000, 43_200_000, 40_500_000, 42_180_500],
    acumulado: 319_280_500,
  },
  {
    id: 'ing-real',
    nombre: 'Real (MXN)',
    valores: [36_200_000, 38_400_000, 41_100_000, 37_900_000, 39_800_000, 43_200_000, 40_500_000, 42_180_500],
    acumulado: 319_280_500,
  },
  {
    id: 'ing-obj',
    nombre: 'Objetivo (MXN)',
    valores: [36_000_000, 37_500_000, 39_000_000, 38_500_000, 40_000_000, 41_500_000, 40_000_000, 40_000_000],
    acumulado: 312_500_000,
  },
  {
    id: 'ub',
    nombre: 'Utilidad bruta',
    esGrupo: true,
    valores: [7_200_000, 7_600_000, 8_300_000, 7_400_000, 7_900_000, 8_700_000, 7_800_000, 8_118_700],
    acumulado: 63_018_700,
  },
  {
    id: 'ub-real',
    nombre: 'Real (MXN)',
    valores: [7_200_000, 7_600_000, 8_300_000, 7_400_000, 7_900_000, 8_700_000, 7_800_000, 8_118_700],
    acumulado: 63_018_700,
  },
]

// ── Datos F4 — Comparativo de sucursales ─────────────────────────────────────

import type { FilaF4 } from '@/components/nucleo-adc/reportes/formato-f4'

const FILAS_F4: FilaF4[] = [
  { id: 'cel', nombre: 'MG Celaya',       valor: 2_878_700, cumplimiento: 1.151 },
  { id: 'qro', nombre: 'MG Querétaro',    valor: 2_640_000, cumplimiento: 1.056 },
  { id: 'slp', nombre: 'MG San Luis',     valor: 2_310_000, cumplimiento: 0.924 },
  { id: 'lej', nombre: 'MG León',         valor: 1_980_000, cumplimiento: 0.792 },
  { id: 'irl', nombre: 'MG Irapuato',     valor: 1_850_000, cumplimiento: 0.740 },
  { id: 'sal', nombre: 'MG Salamanca',    valor: 1_540_000, cumplimiento: 0.616 },
  { id: 'grp', nombre: 'Grupo ADC · Aug', valor: 2_199_783, cumplimiento: 0.880, esGrupo: true },
]

// ── Datos F5 — Conciliación DMS vs. ContPaq ───────────────────────────────────

import type { FilaF5 } from '@/components/nucleo-adc/reportes/formato-f5'

const FILAS_F5: FilaF5[] = [
  { id: 'ing-dms',  concepto: 'Ingresos totales',            fuente1: 42_180_500,  fuente2: 42_180_500,  diferencia: 0 },
  { id: 'cv-dms',   concepto: 'Costo de ventas',             fuente1: 34_061_800,  fuente2: 34_061_800,  diferencia: 0 },
  { id: 'go-dms',   concepto: 'Gastos operativos',           fuente1: 5_240_000,   fuente2: 5_383_200,   diferencia: 143_200 },
  { id: 'go-sub1',  concepto: 'Nómina adicional dic.',       fuente1: null,        fuente2: 143_200,     diferencia: 143_200, esSubfila: true },
  { id: 'dep-dms',  concepto: 'Depreciación y amortización', fuente1: 380_000,     fuente2: 380_000,     diferencia: 0 },
  { id: 'imp-dms',  concepto: 'Impuestos y contribuciones',  fuente1: 218_400,     fuente2: 218_400,     diferencia: 0 },
  { id: 'oth-dms',  concepto: 'Otros resultados',            fuente1: 52_000,      fuente2: 52_000,      diferencia: 0 },
]

// ── Datos F6 — Desempeño de área ─────────────────────────────────────────────

import type { DesglosePuesto, ComponenteF6 } from '@/components/nucleo-adc/reportes/formato-f6'

const BASE_IND: Omit<
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

const INDICADORES_F6: Array<{ indicador: Indicador; alarma?: Alarma }> = [
  {
    indicador: {
      ...BASE_IND,
      claveIndicador: 'F6_VTA_UNI',
      nombreIndicador: 'Unidades Vendidas',
      tipoIndicadorClave: '1META',
      tipoIndicadorNombre: 'META',
      valor: 42,
      avanceObjetivo: 1.05,
      objetivo: 40,
      varSPLM: 0.12,
      varSPLY: 0.30,
    },
  },
  {
    indicador: {
      ...BASE_IND,
      claveIndicador: 'F6_TRAFICO',
      nombreIndicador: 'Tráfico Walk-In',
      tipoIndicadorClave: '3EM',
      tipoIndicadorNombre: 'EMPUJE',
      valor: 483,
      avanceObjetivo: 0.831,
      objetivo: 581,
      varSPLM: 0.28,
      varSPLY: 0.21,
    },
    alarma: { nivel: 'ATENCION', motivo: 'Cerrará bajo meta al ritmo actual', desde: '2026-08-20' },
  },
  {
    indicador: {
      ...BASE_IND,
      claveIndicador: 'F6_SATISFACCION',
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
    alarma: { nivel: 'CRITICA', motivo: 'Brecha no recuperable este mes', desde: '2026-08-15' },
  },
  {
    indicador: {
      ...BASE_IND,
      claveIndicador: 'F6_EFICIENCIA',
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
  },
]

const DESGLOSES_PUESTO: DesglosePuesto[] = [
  { puesto: 'Ventas nuevos', responsable: 'M. García',  personas: 6, real: 42, objetivo: 40, cumplimiento: 1.050 },
  { puesto: 'Ventas seminuevos', responsable: 'L. Torres', personas: 3, real: 18, objetivo: 20, cumplimiento: 0.900 },
  { puesto: 'Asesor de servicios', responsable: 'R. López', personas: 4, real: 210, objetivo: 250, cumplimiento: 0.840 },
  { puesto: 'Telemarketing', responsable: 'C. Herrera', personas: 2, real: 483, objetivo: 581, cumplimiento: 0.831 },
]

const MESES_F6 = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO']
const TRAYECTORIA_FILAS = [
  { nombre: 'Unidades Vendidas',       valores: [0.95, 1.025, 1.125, 0.975, 1.10, 1.20, 1.05, 1.05] },
  { nombre: 'Tráfico Walk-In',         valores: [0.91, 0.88, 0.93, 0.86, 0.90, 0.92, 0.87, 0.831] },
  { nombre: 'Satisfacción del Cliente',valores: [0.81, 0.80, 0.82, 0.79, 0.81, 0.80, 0.78, 0.779] },
  { nombre: 'Eficiencia del Taller',   valores: [0.88, 0.90, 0.92, 0.89, 0.91, 0.93, 0.90, 0.911] },
]

// ── Separador de sección ──────────────────────────────────────────────────────

function Separador({ rotulo }: { rotulo: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        font: '600 11px var(--font-geist-mono), monospace',
        letterSpacing: '.09em',
        color: '#98A0AC',
        textTransform: 'uppercase',
        marginBottom: 12,
      }}>
        {rotulo}
      </div>
    </div>
  )
}

// ── Pantalla ─────────────────────────────────────────────────────────────────

export default function ReportesPage() {
  const router = useRouter()

  return (
    <Shell
      apps={APPS}
      appActiva="reportes"
      nombreApp="Reportes"
      periodo="Agosto 2026"
      grupos={GRUPOS}
      itemActivo="f1"
      onAppChange={(id) => {
        if (id === 'hub') router.push('/')
        if (id === 'indicadores') router.push('/indicadores')
      }}
      onItemChange={() => {}}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Encabezado de pantalla */}
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
            Reportes fijos
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
            6 formatos · catálogo cerrado
          </p>
        </div>

        {/* F1 — Estado jerárquico */}
        <div style={{ marginBottom: 32 }}>
          <Separador rotulo="F1 · Estado jerárquico" />
          <MarcoReporte
            entidad="MG CELAYA"
            periodo="AGOSTO 2026"
            titulo="Estado de resultados"
            descripcion="Comparado contra presupuesto y agosto de 2025"
            filtros={[
              { etiqueta: 'Agosto 2026', porDefecto: true },
              { etiqueta: 'MG Celaya', porDefecto: true },
              { etiqueta: 'Solo cuentas con movimiento', porDefecto: false, onQuitar: () => {} },
            ]}
            fuente="DWH · vw_EstadoResultados"
            corte="27 AGO 04:12"
            unidad="CIFRAS EN MXN SIN IVA"
            generadoPor="J. RAMÍREZ"
            generadoEn="27 AGO 09:14"
          >
            <FormatoF1
              conceptos={CONCEPTOS_F1}
              columnas={{
                colE: 'AGO 2025',
              }}
            />
          </MarcoReporte>
        </div>

        {/* F2 — Padrón operativo */}
        <div style={{ marginBottom: 32 }}>
          <Separador rotulo="F2 · Padrón operativo" />
          <MarcoReporte
            entidad="MG CELAYA"
            periodo="AGOSTO 2026"
            titulo="Padrón de unidades"
            descripcion="Inventario activo en piso al corte del día"
            filtros={[
              { etiqueta: 'Agosto 2026', porDefecto: true },
              { etiqueta: 'MG Celaya', porDefecto: true },
              { etiqueta: 'Solo vehículos nuevos', porDefecto: false, onQuitar: () => {} },
            ]}
            fuente="DMS · vw_InventarioPiso"
            corte="27 AGO 06:00"
            unidad="COSTO EN MXN SIN IVA"
            generadoPor="J. RAMÍREZ"
            generadoEn="27 AGO 09:14"
          >
            <FormatoF2
              filas={FILAS_F2}
              columnas={{
                col1: 'VIN',
                col2: 'MODELO',
                col3: 'COSTO',
                col4: 'DÍAS',
                col5: 'ESTATUS',
                col6: 'RESPONSABLE',
              }}
              resumenExtra="3 CRÍTICAS"
            />
          </MarcoReporte>
        </div>

        {/* F3 — Evolución mensual */}
        <div style={{ marginBottom: 32 }}>
          <Separador rotulo="F3 · Evolución mensual" />
          <MarcoReporte
            entidad="MG CELAYA"
            periodo="ENE–AGO 2026"
            titulo="Evolución mensual"
            descripcion="Real vs. objetivo mes a mes — ventas e ingresos"
            filtros={[
              { etiqueta: 'Ene–Ago 2026', porDefecto: true },
              { etiqueta: 'MG Celaya', porDefecto: true },
            ]}
            fuente="DWH · fact.Indicador_Real"
            corte="27 AGO 04:12"
            unidad="INGRESOS EN MXN · UNIDADES EN PIEZAS"
            generadoPor="J. RAMÍREZ"
            generadoEn="27 AGO 09:14"
          >
            <FormatoF3
              meses={MESES_F3}
              mesActualIdx={7}
              filas={FILAS_F3}
            />
          </MarcoReporte>
        </div>

        {/* F4 — Comparativo */}
        <div style={{ marginBottom: 32 }}>
          <Separador rotulo="F4 · Comparativo" />
          <MarcoReporte
            entidad="GRUPO ADC"
            periodo="AGOSTO 2026"
            titulo="Comparativo de utilidad operativa"
            descripcion="Sucursales ordenadas de mayor a menor cumplimiento"
            filtros={[
              { etiqueta: 'Agosto 2026', porDefecto: true },
              { etiqueta: 'Todas las sucursales', porDefecto: true },
            ]}
            fuente="DWH · vw_EstadoResultados"
            corte="27 AGO 04:12"
            unidad="CIFRAS EN MXN SIN IVA"
            generadoPor="J. RAMÍREZ"
            generadoEn="27 AGO 09:14"
          >
            <FormatoF4
              filas={FILAS_F4}
              columnas={{
                col1: 'SUCURSAL',
                col2: 'UTILIDAD OP.',
                col3: 'VS GRUPO',
                col4: 'CUMPL',
              }}
            />
          </MarcoReporte>
        </div>

        {/* F5 — Conciliación */}
        <div style={{ marginBottom: 32 }}>
          <Separador rotulo="F5 · Conciliación" />
          <MarcoReporte
            entidad="MG CELAYA"
            periodo="AGOSTO 2026"
            titulo="Conciliación DMS · ContPaq"
            descripcion="Diferencias entre el sistema de gestión y la contabilidad"
            filtros={[
              { etiqueta: 'Agosto 2026', porDefecto: true },
              { etiqueta: 'MG Celaya', porDefecto: true },
              { etiqueta: 'Solo con diferencias', porDefecto: false, onQuitar: () => {} },
            ]}
            fuente="DMS · ContPaq · cron diario 03:00"
            corte="27 AGO 03:18"
            unidad="CIFRAS EN MXN SIN IVA"
            generadoPor="J. RAMÍREZ"
            generadoEn="27 AGO 09:14"
          >
            <FormatoF5
              filas={FILAS_F5}
              etiquetaFuente1="DMS"
              etiquetaFuente2="CONTPAQ"
              diferenciaTotalLabel="Diferencia total del mes"
              diferenciaTotalValor={143_200}
            />
          </MarcoReporte>
        </div>

        {/* F6 — Desempeño de área */}
        <div style={{ marginBottom: 32 }}>
          <Separador rotulo="F6 · Desempeño de área" />
          <MarcoReporte
            entidad="MG CELAYA"
            periodo="AGOSTO 2026"
            titulo="Desempeño de área"
            descripcion="Cumplimiento ponderado de indicadores por puesto · Ventas"
            filtros={[
              { etiqueta: 'Agosto 2026', porDefecto: true },
              { etiqueta: 'Ventas', porDefecto: true },
              { etiqueta: 'MG Celaya', porDefecto: true },
            ]}
            fuente="DWH · fact.Indicador_Real · dim.Colaborador"
            corte="27 AGO 04:12"
            unidad="CUMPLIMIENTO DECIMAL — 1.00 = 100%"
            generadoPor="J. RAMÍREZ"
            generadoEn="27 AGO 09:14"
          >
            <FormatoF6
              entidad="MG CELAYA"
              area="Ventas"
              periodo="AGOSTO 2026"
              responsable="A. Méndez"
              personas={15}
              puestos={4}
              cumplimientoPonderado={0.896}
              varM={0.024}
              varA={0.051}
              indicadores={INDICADORES_F6}
              indicadorDesgloseNombre="Tráfico Walk-In"
              indicadorDesgloseTexto="483 visitantes de 581 objetivo — 98 pendientes, quedan 9 días"
              desglosesPuesto={DESGLOSES_PUESTO}
              meses={MESES_F6}
              mesActualIdx={7}
              trayectoriaFilas={TRAYECTORIA_FILAS}
            />
          </MarcoReporte>
        </div>

      </div>
    </Shell>
  )
}
