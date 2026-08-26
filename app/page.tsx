'use client'

// Hub (T1) — página de demo completa.
// Muestra todos los componentes construidos en las Rondas A–F.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  LayoutGrid,
  TrendingUp,
  BarChart,
  Settings,
} from 'lucide-react'
import { Shell } from '@/components/shell'
import type { App, MenuGrupo } from '@/components/shell'
import { CintaIndicadores } from '@/components/nucleo-adc/hub/cinta-indicadores'
import { FeedAtencion } from '@/components/nucleo-adc/hub/feed-atencion'
import { PanelNucleoHub } from '@/components/nucleo-adc/hub/panel-nucleo-hub'
import { PanelDetalle } from '@/components/nucleo-adc/panel-detalle/panel-detalle'
import { CargandoTablero } from '@/components/nucleo-adc/indicadores/cargando-tablero'
import { MenuUsuario } from '@/components/shell/menu-usuario'
import { BusquedaK } from '@/components/shell/busqueda-k'
import { Vacio } from '@/components/shell/estados/vacio'
import type { Indicador, Alarma } from '@/components/nucleo-adc/indicadores/types'

// ── 6 indicadores de demo ────────────────────────────────────────────────────

const INDICADORES_DEMO: Indicador[] = [
  {
    claveIndicador: 'VTA_WALKIN',
    nombreIndicador: 'Tráfico Walk-In',
    nivelNombre: 'MG Celaya',
    nivelTipo: 'Sucursal',
    tipoIndicadorClave: '3EM',
    tipoIndicadorNombre: 'EMPUJE',
    claseClave: 'DESEMPENO',
    unidadMedidaClave: 'CLI',
    unidadMedidaFormato: '#,##0',
    direccionDeseable: 'Arriba',
    nivelLectura: 'MANDO',
    peso: 0.20,
    valor: 483,
    esAcumulativo: true,
    avanceObjetivo: 0.831,
    objetivo: 581,
    valorCentro: null, toleranciaInf: null, toleranciaSup: null, valorReferencia: null,
    varSPLM: 0.28, varSPLY: 0.21,
    numerador: null, denominador: null,
    responsable: 'Gerencia de Sucursal',
    periodicidad: 'DIARIA',
    estatusCalculo: 'OK',
    fecha: '2026-08-25',
  },
  {
    claveIndicador: 'UTILIDAD_OP',
    nombreIndicador: 'Utilidad Operativa',
    nivelNombre: 'Grupo ADC',
    nivelTipo: 'Global',
    tipoIndicadorClave: '1META',
    tipoIndicadorNombre: 'META',
    claseClave: 'DESEMPENO',
    unidadMedidaClave: 'MXN',
    unidadMedidaFormato: '$#,##0',
    direccionDeseable: 'Arriba',
    nivelLectura: 'MANDO',
    peso: 0.35,
    valor: 14_200_000,
    esAcumulativo: true,
    avanceObjetivo: 1.04,
    objetivo: 13_650_000,
    valorCentro: null, toleranciaInf: null, toleranciaSup: null, valorReferencia: null,
    varSPLM: 0.08, varSPLY: 0.15,
    numerador: null, denominador: null,
    responsable: 'Dirección Financiera',
    periodicidad: 'MENSUAL',
    estatusCalculo: 'OK',
    fecha: '2026-08-25',
  },
  {
    claveIndicador: 'SATISFACCION',
    nombreIndicador: 'Satisfacción del Cliente',
    nivelNombre: 'MG Celaya · Posventa',
    nivelTipo: 'DepartamentoSucursal',
    tipoIndicadorClave: '2RUMBO',
    tipoIndicadorNombre: 'RUMBO',
    claseClave: 'PERCEPCION',
    unidadMedidaClave: 'PTS',
    unidadMedidaFormato: '#,##0.0',
    direccionDeseable: 'Arriba',
    nivelLectura: 'MANDO',
    peso: 0.15,
    valor: 78,
    esAcumulativo: false,
    avanceObjetivo: 0.779,
    objetivo: 100,
    valorCentro: null, toleranciaInf: null, toleranciaSup: null, valorReferencia: null,
    varSPLM: -0.04, varSPLY: 0.03,
    numerador: null, denominador: null,
    responsable: 'Jefe de Posventa',
    periodicidad: 'MENSUAL',
    estatusCalculo: 'OK',
    fecha: '2026-08-25',
  },
  {
    claveIndicador: 'EFICIENCIA_SERV',
    nombreIndicador: 'Eficiencia de Servicio',
    nivelNombre: 'Taller · MG Celaya',
    nivelTipo: 'DepartamentoSucursal',
    tipoIndicadorClave: '4ARR',
    tipoIndicadorNombre: 'ARRANQUE',
    claseClave: 'CONTROL',
    unidadMedidaClave: 'HRS',
    unidadMedidaFormato: '#,##0.0',
    direccionDeseable: 'Arriba',
    nivelLectura: 'MANDO',
    peso: null,
    valor: 2.4,
    esAcumulativo: false,
    avanceObjetivo: null,
    objetivo: null,
    valorCentro: 2.5, toleranciaInf: 2.0, toleranciaSup: 3.0, valorReferencia: null,
    varSPLM: -0.08, varSPLY: null,
    numerador: null, denominador: null,
    responsable: 'Gerente de Taller',
    periodicidad: 'DIARIA',
    estatusCalculo: 'OK',
    fecha: '2026-08-25',
  },
  {
    // Indicador sin objetivo → no muestra barra ni porcentaje
    claveIndicador: 'MARGEN_NUEVO',
    nombreIndicador: 'Margen en Vehículos Nuevos',
    nivelNombre: 'MG Celaya',
    nivelTipo: 'Sucursal',
    tipoIndicadorClave: '1META',
    tipoIndicadorNombre: 'META',
    claseClave: 'DESEMPENO',
    unidadMedidaClave: 'MXN',
    unidadMedidaFormato: '$#,##0',
    direccionDeseable: 'Arriba',
    nivelLectura: 'MANDO',
    peso: 0.20,
    valor: 3_800_000,
    esAcumulativo: true,
    avanceObjetivo: 0.76,
    objetivo: 5_000_000,
    valorCentro: null, toleranciaInf: null, toleranciaSup: null, valorReferencia: null,
    varSPLM: -0.11, varSPLY: 0.04,
    numerador: null, denominador: null,
    responsable: 'Dirección Comercial',
    periodicidad: 'MENSUAL',
    estatusCalculo: 'OK',
    fecha: '2026-08-25',
  },
  {
    // Indicador SIN_OPERACION → muestra "—", nunca barra roja
    claveIndicador: 'REFACCIONES_ROT',
    nombreIndicador: 'Rotación de Refacciones',
    nivelNombre: 'Almacén · MG Celaya',
    nivelTipo: 'DepartamentoSucursal',
    tipoIndicadorClave: '4ARR',
    tipoIndicadorNombre: 'ARRANQUE',
    claseClave: 'DESEMPENO',
    unidadMedidaClave: 'DIAS',
    unidadMedidaFormato: '#,##0',
    direccionDeseable: 'Abajo',
    nivelLectura: 'MANDO',
    peso: null,
    valor: null,
    esAcumulativo: false,
    avanceObjetivo: null,
    objetivo: 30,
    valorCentro: null, toleranciaInf: null, toleranciaSup: null, valorReferencia: null,
    varSPLM: null, varSPLY: null,
    numerador: null, denominador: null,
    responsable: 'Jefe de Almacén',
    periodicidad: 'MENSUAL',
    estatusCalculo: 'SIN_OPERACION',
    fecha: '2026-08-25',
  },
]

const ALARMA_SATISFACCION: Alarma = {
  nivel: 'ATENCION',
  motivo: 'Cerrará bajo meta al ritmo actual',
  desde: '2026-08-20',
}

const ALARMA_MARGEN: Alarma = {
  nivel: 'CRITICA',
  motivo: 'Brecha no recuperable este mes',
  desde: '2026-08-15',
}

// ── Shell config ─────────────────────────────────────────────────────────────

const APPS: App[] = [
  { id: 'hub', nombre: 'Hub', Icono: LayoutGrid },
  { id: 'finanzas', nombre: 'Finanzas', Icono: TrendingUp, badge: 3 },
  { id: 'indicadores', nombre: 'Indicadores', Icono: BarChart },
  { id: 'configuracion', nombre: 'Configuración', Icono: Settings },
]

const GRUPOS_HUB: MenuGrupo[] = [
  {
    rotulo: 'GENERAL',
    items: [
      { id: 'resumen', etiqueta: 'Resumen ejecutivo' },
      { id: 'pendientes', etiqueta: 'Pendientes', badge: 4 },
    ],
  },
  {
    rotulo: 'VISTAS',
    items: [
      { id: 'tablero', etiqueta: 'Tablero de mando' },
      { id: 'comparativo', etiqueta: 'Comparativo' },
    ],
  },
]

// ── Pantalla ─────────────────────────────────────────────────────────────────

export default function HubPage() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [panelAbierto, setPanelAbierto] = useState<string | null>(null)
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
  const [busquedaAbierta, setBusquedaAbierta] = useState(false)

  function handleAppChange(id: string) {
    if (id === 'indicadores') router.push('/indicadores')
  }

  const indicadorDetalle = INDICADORES_DEMO.find(
    (i) => i.claveIndicador === panelAbierto
  )

  return (
    <>
      <Shell
        apps={APPS}
        appActiva="hub"
        nombreApp="Hub"
        periodo="Ago 2026"
        grupos={GRUPOS_HUB}
        itemActivo="resumen"
        onAppChange={handleAppChange}
        onItemChange={() => {}}
        onBusquedaClick={() => setBusquedaAbierta(true)}
        onAvatarClick={() => setMenuUsuarioAbierto((v) => !v)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Título + botones de demo */}
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
                Buenos días, esto es lo de hoy
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
                Datos al corte del 25 de agosto · 6 indicadores activos · 2 alarmas
              </p>
            </div>

            {/* Botones de demo */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => setBusquedaAbierta(true)}
                style={{
                  height: 30,
                  padding: '0 12px',
                  borderRadius: 5,
                  border: '1px solid #D8DCE2',
                  background: '#FFFFFF',
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#3D4551',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Búsqueda
                <kbd
                  style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: 10.5,
                    fontWeight: 500,
                    color: '#98A0AC',
                    border: '1px solid #E4E6EA',
                    borderRadius: 3,
                    padding: '1px 4px',
                    lineHeight: 1.4,
                  }}
                >
                  ⌘K
                </kbd>
              </button>
              <button
                onClick={() => setMenuUsuarioAbierto((v) => !v)}
                style={{
                  height: 30,
                  padding: '0 12px',
                  borderRadius: 5,
                  border: '1px solid #D8DCE2',
                  background: '#FFFFFF',
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#3D4551',
                  cursor: 'pointer',
                }}
              >
                Menú usuario
              </button>
            </div>
          </div>

          {/* Panel Núcleo — resumen del día */}
          <PanelNucleoHub
            resumen="Utilidad operativa 4 pp sobre presupuesto — el mejor agosto en 3 años. Walk-In en riesgo: al ritmo actual cierra en 83% de la meta. Satisfacción bajó 4 puntos en el mes; el dato de posventa explica 3 de los 4 puntos."
            acciones={[
              {
                id: 'walkin',
                etiqueta: 'Ver Walk-In',
                onClick: () => setPanelAbierto('VTA_WALKIN'),
              },
              {
                id: 'satisfaccion',
                etiqueta: 'Ver Satisfacción',
                onClick: () => setPanelAbierto('SATISFACCION'),
              },
              {
                id: 'margen',
                etiqueta: 'Ver Margen',
                onClick: () => setPanelAbierto('MARGEN_NUEVO'),
              },
            ]}
            fuente="Fuente: fact.Indicador_Real · dim.Indicador · Corte 25-ago-2026"
          />

          {/* Cinta de 6 indicadores */}
          <CintaIndicadores
            titulo="Mis indicadores"
            items={[
              { indicador: INDICADORES_DEMO[0] },
              { indicador: INDICADORES_DEMO[1], tono: 'destacado' },
              { indicador: INDICADORES_DEMO[2], alarma: ALARMA_SATISFACCION },
              { indicador: INDICADORES_DEMO[3] },
              { indicador: INDICADORES_DEMO[4], alarma: ALARMA_MARGEN },
              { indicador: INDICADORES_DEMO[5] },
            ]}
            onDetalle={(clave) => setPanelAbierto(clave)}
          />

          {/* Feed de atención — 5 items, total 8 */}
          <FeedAtencion
            items={[
              {
                id: 'a1',
                nivel: 'CRITICA',
                titulo: 'Margen en Vehículos Nuevos',
                descripcion: 'Brecha no recuperable al ritmo actual · 6 días restantes',
                fecha: '15-ago-2026',
                accion: 'Ver detalle',
                onAccion: () => setPanelAbierto('MARGEN_NUEVO'),
                onFila: () => setPanelAbierto('MARGEN_NUEVO'),
              },
              {
                id: 'a2',
                nivel: 'CRITICA',
                titulo: 'Tráfico Walk-In',
                descripcion: 'Brecha de 17 pp · cerrará en 83% del objetivo',
                fecha: '25-ago-2026',
                accion: 'Ver detalle',
                onAccion: () => setPanelAbierto('VTA_WALKIN'),
                onFila: () => setPanelAbierto('VTA_WALKIN'),
              },
              {
                id: 'a3',
                nivel: 'ATENCION',
                titulo: 'Satisfacción del Cliente',
                descripcion: 'Cerrará bajo meta al ritmo actual · MG Celaya',
                fecha: '20-ago-2026',
                accion: 'Ver detalle',
                onAccion: () => setPanelAbierto('SATISFACCION'),
                onFila: () => setPanelAbierto('SATISFACCION'),
              },
              {
                id: 'a4',
                nivel: 'ATENCION',
                titulo: 'Eficiencia de Servicio',
                descripcion: 'Tendencia descendente los últimos 5 días · Taller',
                fecha: '22-ago-2026',
                accion: 'Ver detalle',
                onAccion: () => setPanelAbierto('EFICIENCIA_SERV'),
                onFila: () => setPanelAbierto('EFICIENCIA_SERV'),
              },
              {
                id: 'a5',
                nivel: 'NO_EVALUABLE',
                titulo: 'Rotación de Refacciones',
                descripcion: 'Sin dato disponible para el periodo · Almacén',
                fecha: '01-ago-2026',
                accion: 'Ver detalle',
                onAccion: () => setPanelAbierto('REFACCIONES_ROT'),
                onFila: () => setPanelAbierto('REFACCIONES_ROT'),
              },
            ]}
            total={8}
            onVerTodas={() => router.push('/indicadores')}
          />

          {/* Estado: Cargando — skeleton de tablero */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '.08em',
                  color: '#98A0AC',
                  textTransform: 'uppercase' as const,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                ESTADO · CARGANDO
              </span>
              <div style={{ flex: 1, height: 1, background: '#EEF0F3' }} />
            </div>
            <CargandoTablero tarjetas={4} />
          </section>

          {/* Estado: Vacío por filtro */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '.08em',
                  color: '#98A0AC',
                  textTransform: 'uppercase' as const,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                ESTADO · VACÍO POR FILTRO
              </span>
              <div style={{ flex: 1, height: 1, background: '#EEF0F3' }} />
            </div>
            <div
              style={{
                border: '1px solid #E4E6EA',
                borderRadius: 6,
                background: '#FFFFFF',
              }}
            >
              <Vacio
                titulo="Sin indicadores para este filtro"
                descripcion="No hay indicadores de tipo REFERENCIA asignados a tu puesto en el periodo seleccionado."
                accion="Quitar filtros"
                porFiltro
                onAccion={() => {}}
              />
            </div>
          </section>

          {/* Estado: Vacío real */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '.08em',
                  color: '#98A0AC',
                  textTransform: 'uppercase' as const,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                ESTADO · VACÍO REAL
              </span>
              <div style={{ flex: 1, height: 1, background: '#EEF0F3' }} />
            </div>
            <div
              style={{
                border: '1px solid #E4E6EA',
                borderRadius: 6,
                background: '#FFFFFF',
              }}
            >
              <Vacio
                titulo="Aún no hay alertas registradas"
                descripcion="Cuando un indicador supere el umbral de alarma aparecerá aquí con el motivo y la fecha."
                accion="Crear alerta"
                porFiltro={false}
                onAccion={() => {}}
              />
            </div>
          </section>

        </div>

        {/* Panel de detalle */}
        {panelAbierto && indicadorDetalle && (
          <PanelDetalle
            indicador={indicadorDetalle}
            meses={[
              { mes: 'Sep', real: 480, objetivo: 550 },
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
            definicion="Definición del indicador según el catálogo MDM. Esta información proviene de dim.Indicador y describe exactamente qué se mide, con qué frecuencia y qué no incluye."
            resumenNucleo={`Al ritmo de los últimos 5 días, ${indicadorDetalle.nombreIndicador} cerrará en torno al ${indicadorDetalle.avanceObjetivo !== null ? Math.round(indicadorDetalle.avanceObjetivo * 100) : '—'}% del objetivo.`}
            fuenteNucleo="Fuente: fact.Indicador_Real · dim.Indicador · Corte 25-ago-2026"
            onCerrar={() => setPanelAbierto(null)}
            onPreguntarNucleo={() => {}}
          />
        )}
      </Shell>

      {/* Menú de usuario — fixed bajo el header, alineado a la derecha */}
      {menuUsuarioAbierto && (
        <div
          style={{
            position: 'fixed',
            top: 52,
            right: 0,
            zIndex: 60,
            padding: '4px 12px 0',
          }}
        >
          <MenuUsuario
            nombre="Rodrigo Martínez"
            email="rmartinez@adctraxion.com"
            initiales="RM"
            isDark={isDark}
            onCerrarSesion={() => setMenuUsuarioAbierto(false)}
            onCerrar={() => setMenuUsuarioAbierto(false)}
          />
        </div>
      )}

      {/* Paleta ⌘K */}
      {busquedaAbierta && (
        <BusquedaK
          onCerrar={() => setBusquedaAbierta(false)}
        />
      )}
    </>
  )
}
