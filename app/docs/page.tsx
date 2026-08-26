'use client'

import { useState, useEffect, useRef } from 'react'
import { Campo } from '@/components/nucleo-adc/ui/campo'
import { CampoCifra } from '@/components/nucleo-adc/ui/campo-cifra'
import { Combobox } from '@/components/nucleo-adc/ui/combobox'
import { RadioTarjeta } from '@/components/nucleo-adc/ui/radio-tarjeta'
import { CampoArchivo } from '@/components/nucleo-adc/ui/campo-archivo'
import { CampoRejilla } from '@/components/nucleo-adc/ui/campo-rejilla'
import { SelectorPeriodo } from '@/components/nucleo-adc/ui/selector-periodo'
import { PilloraFiltro } from '@/components/nucleo-adc/ui/pillora-filtro'
import { TarjetaIndicador } from '@/components/nucleo-adc/indicadores/tarjeta'
import { PanelLateral } from '@/components/nucleo-adc/formularios/panel-lateral'
import { DialogoConfirmacion } from '@/components/nucleo-adc/formularios/dialogo-confirmacion'
import type { Indicador, Alarma } from '@/components/nucleo-adc/indicadores/types'

// ─── Utilidades de UI local ───────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div style={{ position: 'relative', background: '#0E1116', borderRadius: 6, marginBottom: 16 }}>
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
        style={{
          position: 'absolute', top: 8, right: 8,
          background: 'transparent', border: '1px solid #24344A', borderRadius: 4,
          color: copied ? '#34D399' : '#55677F',
          font: '500 11px var(--font-geist-mono), monospace', padding: '3px 8px', cursor: 'pointer',
        }}
      >
        {copied ? 'Copiado' : 'Copiar'}
      </button>
      <pre style={{
        margin: 0, padding: '16px 20px', overflowX: 'auto',
        fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12.5,
        lineHeight: 1.7, color: '#E9EEF4', whiteSpace: 'pre',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function PropsTable({ rows }: { rows: { nombre: string; tipo: string; defecto?: string; descripcion: string }[] }) {
  return (
    <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '140px 160px 100px 1fr', background: '#FAFBFC', borderBottom: '1px solid #EEF0F3', padding: '8px 16px', gap: 16 }}>
        {['Prop', 'Tipo', 'Default', 'Descripción'].map(h => (
          <span key={h} style={{ font: '600 11px/1 var(--font-geist-mono), monospace', color: '#55677F', letterSpacing: '.05em' }}>{h.toUpperCase()}</span>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={r.nombre} style={{
          display: 'grid', gridTemplateColumns: '140px 160px 100px 1fr',
          padding: '10px 16px', borderBottom: i < rows.length - 1 ? '1px solid #F4F5F7' : 'none',
          gap: 16, background: i % 2 === 0 ? '#FFF' : '#FAFBFC', alignItems: 'start',
        }}>
          <code style={{ font: '600 12px var(--font-geist-mono), monospace', color: '#2F6BFF' }}>{r.nombre}</code>
          <code style={{ font: '400 12px var(--font-geist-mono), monospace', color: '#0B7A53' }}>{r.tipo}</code>
          <code style={{ font: '400 12px var(--font-geist-mono), monospace', color: '#8A5A12' }}>{r.defecto ?? '—'}</code>
          <span style={{ font: '400 12.5px/1.5 var(--font-geist-sans), sans-serif', color: '#5B6472' }}>{r.descripcion}</span>
        </div>
      ))}
    </div>
  )
}

function Prevista({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #EEF0F3', borderRadius: 6, padding: 24, marginBottom: 12 }}>
      {children}
    </div>
  )
}

function ReglaCard({ num, titulo, texto }: { num: string; titulo: string; texto: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: '1px solid #EEF0F3' }}>
      <span style={{ font: '700 13px var(--font-geist-mono), monospace', color: '#98A0AC', minWidth: 28 }}>{num}</span>
      <div>
        <p style={{ font: '600 13.5px/1 var(--font-geist-sans), sans-serif', color: '#0E1116', margin: '0 0 4px' }}>{titulo}</p>
        <p style={{ font: '400 12.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', margin: 0 }}>{texto}</p>
      </div>
    </div>
  )
}

function SectionH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      font: '600 20px/1 var(--font-geist-sans), sans-serif', color: '#0E1116',
      borderBottom: '2px solid #EEF0F3', paddingBottom: 12, marginBottom: 24, marginTop: 0,
    }}>
      {children}
    </h2>
  )
}

function SubH({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ font: '600 15px/1 var(--font-geist-sans), sans-serif', color: '#0E1116', marginTop: 32, marginBottom: 12 }}>
      {children}
    </h3>
  )
}

function AlertaRegla({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#FDE8E7', borderLeft: '3px solid #C2352B', borderRadius: 6,
      padding: '12px 16px', marginBottom: 16,
    }}>
      {children}
    </div>
  )
}

// ─── Datos de nav ─────────────────────────────────────────────────────────────

interface NavItem { id: string; label: string }
interface NavGroup { rotulo: string; items: NavItem[] }

const NAV_GROUPS: NavGroup[] = [
  {
    rotulo: 'NÚCLEO ADC',
    items: [{ id: 'intro', label: 'Introducción' }],
  },
  {
    rotulo: 'SHELL',
    items: [
      { id: 'shell-rail', label: 'Rail' },
      { id: 'shell-header', label: 'Encabezado' },
      { id: 'shell-menu', label: 'Menú de pantallas' },
      { id: 'shell-nucleo', label: 'Panel Núcleo AI' },
      { id: 'shell-atajos', label: 'Atajos de teclado' },
    ],
  },
  {
    rotulo: 'TOKENS',
    items: [
      { id: 'tokens-colores', label: 'Colores' },
      { id: 'tokens-tipografia', label: 'Tipografía' },
      { id: 'tokens-espaciado', label: 'Espaciado' },
      { id: 'tokens-radios', label: 'Radios y sombras' },
    ],
  },
  {
    rotulo: 'COMPONENTES',
    items: [
      { id: 'comp-campo', label: 'Campo (texto corto)' },
      { id: 'comp-campo-cifra', label: 'Campo cifra' },
      { id: 'comp-combobox', label: 'Combobox' },
      { id: 'comp-radio-tarjeta', label: 'Radio tarjeta' },
      { id: 'comp-campo-archivo', label: 'Campo archivo' },
      { id: 'comp-campo-rejilla', label: 'Campo rejilla' },
      { id: 'comp-selector-periodo', label: 'Selector periodo' },
      { id: 'comp-pillora-filtro', label: 'Píldora filtro' },
    ],
  },
  {
    rotulo: 'INDICADORES',
    items: [
      { id: 'ind-tarjeta', label: 'Tarjeta indicador' },
      { id: 'ind-panel-detalle', label: 'Panel de detalle' },
      { id: 'ind-alarmas', label: 'Alarmas' },
    ],
  },
  {
    rotulo: 'FORMULARIOS',
    items: [
      { id: 'form-panel', label: 'Panel lateral' },
      { id: 'form-dialogo', label: 'Diálogo de confirmación' },
    ],
  },
  {
    rotulo: 'ESTADOS DEL SISTEMA',
    items: [{ id: 'estados', label: 'Los 6 estados' }],
  },
  {
    rotulo: 'REPORTES',
    items: [
      { id: 'rep-fijos', label: 'Formatos fijos F1–F6' },
      { id: 'rep-ia', label: 'Plantillas IA A/B/C' },
    ],
  },
  {
    rotulo: 'REGLAS',
    items: [{ id: 'reglas', label: 'Las 13 reglas' }],
  },
  {
    rotulo: 'AGENTS.MD',
    items: [
      { id: 'agents-contexto', label: 'Contexto del proyecto' },
      { id: 'agents-componentes', label: 'Cómo usar componentes' },
      { id: 'agents-pantallas', label: 'Los 11 tipos de pantalla' },
      { id: 'agents-reglas', label: 'Las 13 reglas (texto exacto)' },
      { id: 'agents-patrones', label: 'Patrones de composición' },
      { id: 'agents-prohibido', label: 'Lo que está prohibido' },
      { id: 'agents-medidas', label: 'Medidas de referencia' },
    ],
  },
  {
    rotulo: 'PLUGIN',
    items: [
      { id: 'plugin-qa', label: '/qa-diseno' },
      { id: 'plugin-comandos', label: 'Comandos' },
      { id: 'plugin-agentes', label: 'Agentes' },
      { id: 'plugin-skills', label: 'Skills' },
      { id: 'plugin-scripts', label: 'Scripts' },
    ],
  },
]

// ─── Datos de demo ────────────────────────────────────────────────────────────

const IND_NORMAL: Indicador = {
  claveIndicador: 'VNT-001',
  nombreIndicador: 'Unidades vendidas',
  nivelNombre: 'MG CELAYA',
  nivelTipo: 'Sucursal',
  tipoIndicadorClave: '1META',
  tipoIndicadorNombre: 'META',
  claseClave: 'DESEMPENO',
  unidadMedidaClave: 'UNI',
  unidadMedidaFormato: '#,##0',
  direccionDeseable: 'Arriba',
  nivelLectura: 'MANDO',
  peso: null,
  valor: 185,
  esAcumulativo: true,
  avanceObjetivo: 0.831,
  objetivo: 222,
  numerador: null,
  denominador: null,
  valorCentro: null,
  toleranciaInf: null,
  toleranciaSup: null,
  valorReferencia: null,
  varSPLM: 0.042,
  varSPLY: -0.031,
  responsable: 'J. Ramírez',
  periodicidad: 'MENSUAL',
  estatusCalculo: 'OK',
  fecha: '2026-08-25',
}

const IND_ALARMA_ATENCION: Indicador = { ...IND_NORMAL, claveIndicador: 'VNT-002', nombreIndicador: 'Satisfacción de cliente', avanceObjetivo: 0.86, valor: 86, objetivo: 100, unidadMedidaFormato: '#,##0.0%' }
const ALARMA_ATENCION: Alarma = { nivel: 'ATENCION', motivo: 'Lleva 3 días bajo meta', desde: '2026-08-22' }

const IND_ALARMA_CRITICA: Indicador = { ...IND_NORMAL, claveIndicador: 'VNT-003', nombreIndicador: 'Eficiencia taller', avanceObjetivo: 0.68, valor: 68, objetivo: 100, unidadMedidaFormato: '#,##0.0%' }
const ALARMA_CRITICA: Alarma = { nivel: 'CRITICA', motivo: 'Por debajo del umbral mínimo', desde: '2026-08-19' }

const IND_SIN_OBJETIVO: Indicador = { ...IND_NORMAL, claveIndicador: 'VNT-004', nombreIndicador: 'Precio promedio unidad', avanceObjetivo: null, objetivo: null, unidadMedidaFormato: '$#,##0', valor: 385000, varSPLM: null, varSPLY: null }

// ─── Página principal ─────────────────────────────────────────────────────────

export default function DocsPage() {
  const [seccionActiva, setSeccionActiva] = useState('intro')

  // Estado de demos
  const [campoValor, setCampoValor] = useState('')
  const [campoError, setCampoError] = useState('')
  const [campoCifraValor, setCampoCifraValor] = useState('')
  const [comboValor, setComboValor] = useState('')
  const [radioValor, setRadioValor] = useState('')
  const [periodoAnio, setPeriodoAnio] = useState(2026)
  const [periodoMes, setPeriodoMes] = useState(8)
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>(['Agosto 2026'])
  const [rejillaValores, setRejillaValores] = useState<Record<string, string>>({})
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [panelCampoValor, setPanelCampoValor] = useState('')

  // IntersectionObserver para auto-highlight del sidebar
  useEffect(() => {
    const allIds = NAV_GROUPS.flatMap(g => g.items.map(i => i.id))
    const observers: IntersectionObserver[] = []

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setSeccionActiva(entry.target.id)
          }
        })
      },
      { rootMargin: '-52px 0px -60% 0px', threshold: 0 }
    )

    allIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  function irA(id: string) {
    setSeccionActiva(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleFiltro = (f: string) => {
    setFiltrosActivos(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  const FILTROS_DEMO = ['Agosto 2026', 'MG Celaya', 'META', 'DESEMPEÑO']

  const OPCIONES_COMBOBOX = [
    { clave: 'MG-CEL', etiqueta: 'MG Celaya' },
    { clave: 'MG-GDL', etiqueta: 'MG Guadalajara' },
    { clave: 'MG-MTY', etiqueta: 'MG Monterrey' },
    { clave: 'MG-QRO', etiqueta: 'MG Querétaro' },
    { clave: 'MG-SLP', etiqueta: 'MG San Luis Potosí' },
  ]

  const OPCIONES_RADIO = [
    { valor: 'alta', titulo: 'Alta prioridad', descripcion: 'Requiere atención en las próximas 24 h.' },
    { valor: 'media', titulo: 'Prioridad media', descripcion: 'Puede resolverse en los próximos 3 días.' },
    { valor: 'baja', titulo: 'Prioridad baja', descripcion: 'No bloquea operaciones.' },
  ]

  const FILAS_REJILLA = [
    { id: 'vnt', nombre: 'Ventas unidades', valorAnterior: 178, etiquetaAnterior: 'JUL' },
    { id: 'srv', nombre: 'Servicios taller', valorAnterior: 1243, etiquetaAnterior: 'JUL' },
    { id: 'rep', nombre: 'Refacciones', valorAnterior: 892, etiquetaAnterior: 'JUL' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7', fontFamily: 'var(--font-geist-sans), sans-serif' }}>

      {/* ── Header ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 52, background: '#00244D',
        display: 'flex', alignItems: 'center', padding: '0 24px',
        borderBottom: '1px solid #193A6A',
      }}>
        <a
          href="/"
          style={{
            font: '500 12px var(--font-geist-mono), monospace',
            color: '#8B98A8', textDecoration: 'none', letterSpacing: '.02em',
          }}
        >
          ← Hub
        </a>
        <span style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          font: '500 12px var(--font-geist-mono), monospace',
          color: '#E9EEF4', letterSpacing: '.12em',
        }}>
          NÚCLEO ADC · DOCS
        </span>
        <span style={{
          marginLeft: 'auto',
          font: '400 11px var(--font-geist-mono), monospace',
          color: '#55677F', letterSpacing: '.04em',
        }}>
          v0.1 · 25 AGO 2026
        </span>
      </header>

      {/* ── Sidebar ── */}
      <nav style={{
        position: 'fixed', top: 52, left: 0, bottom: 0,
        width: 240, background: '#FAFBFC',
        borderRight: '1px solid #EEF0F3',
        overflowY: 'auto', zIndex: 50,
        padding: '20px 0',
      }}>
        {NAV_GROUPS.map(group => (
          <div key={group.rotulo} style={{ marginBottom: 8 }}>
            <div style={{
              font: '600 10px var(--font-geist-mono), monospace',
              color: '#98A0AC', letterSpacing: '.08em',
              padding: '8px 20px',
            }}>
              {group.rotulo}
            </div>
            {group.items.map(item => (
              <button
                key={item.id}
                onClick={() => irA(item.id)}
                style={{
                  width: '100%', padding: '6px 20px',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  font: '400 13px var(--font-geist-sans), sans-serif',
                  background: seccionActiva === item.id ? '#EEF2FB' : 'transparent',
                  color: seccionActiva === item.id ? '#2F6BFF' : '#0E1116',
                  transition: 'background .1s',
                }}
                onMouseEnter={e => {
                  if (seccionActiva !== item.id) (e.currentTarget as HTMLElement).style.background = '#F4F5F7'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = seccionActiva === item.id ? '#EEF2FB' : 'transparent'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Contenido ── */}
      <main style={{
        marginLeft: 240, marginTop: 52,
        padding: '48px 64px', maxWidth: 960,
        background: '#F4F5F7', minHeight: 'calc(100vh - 52px)',
      }}>

        {/* ═══ INTRODUCCIÓN ═══ */}
        <section id="intro" style={{ marginBottom: 64 }}>
          <SectionH2>Introducción</SectionH2>
          <p style={{ font: '400 14px/1.7 var(--font-geist-sans), sans-serif', color: '#3D4551', marginBottom: 16, maxWidth: 680 }}>
            Este documento es la referencia técnica para ingenieros que construyen en Núcleo ADC.
            Cada componente se muestra en vivo con sus props y un ejemplo copy-paste.
            Las reglas del DS son no negociables.
          </p>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 24 }}>
            Páginas de referencia:{' '}
            <a href="/formularios" style={{ color: '#2F6BFF' }}>/formularios</a>
            {' · '}
            <a href="/reportes" style={{ color: '#2F6BFF' }}>/reportes</a>
            {' · '}
            <a href="/reportes/generados" style={{ color: '#2F6BFF' }}>/reportes/generados</a>
            {' · '}
            <a href="/pantallas" style={{ color: '#2F6BFF' }}>/pantallas</a>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { num: '11', label: 'tipos de pantalla documentados' },
              { num: '13', label: 'reglas no negociables' },
              { num: '6', label: 'formatos de reporte fijo' },
            ].map(({ num, label }) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #EEF0F3', borderRadius: 6, padding: '16px 20px' }}>
                <div style={{ font: '700 32px/1 var(--font-geist-mono), monospace', color: '#00244D', fontVariantNumeric: 'tabular-nums', marginBottom: 6 }}>{num}</div>
                <div style={{ font: '400 12.5px var(--font-geist-sans), sans-serif', color: '#5B6472' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SHELL — RAIL ═══ */}
        <section id="shell-rail" style={{ marginBottom: 64 }}>
          <SectionH2>Shell — Rail</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            Rail de 56 px · navy sólido (<code style={{ font: '500 12px var(--font-geist-mono), monospace', color: '#0B7A53' }}>#00244D</code>) · nunca desaparece · nunca hace scroll.
          </p>

          <SubH>Medidas</SubH>
          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 24 }}>
            {[
              { prop: 'Ancho del rail', valor: '56 px' },
              { prop: 'Cápsula de app (icon cap)', valor: '34 × 34 px' },
              { prop: 'Radio de cápsula', valor: '7 px' },
              { prop: 'Gap entre íconos', valor: '9 px (excepción documentada en el DS)' },
            ].map((row, i) => (
              <div key={row.prop} style={{
                display: 'flex', alignItems: 'center',
                padding: '10px 16px', gap: 24,
                borderBottom: i < 3 ? '1px solid #F4F5F7' : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFBFC',
              }}>
                <span style={{ font: '500 12.5px var(--font-geist-sans), sans-serif', color: '#5B6472', width: 200 }}>{row.prop}</span>
                <code style={{ font: '600 12px var(--font-geist-mono), monospace', color: '#0E1116' }}>{row.valor}</code>
              </div>
            ))}
          </div>

          <SubH>Importación</SubH>
          <CodeBlock code={`import { Shell } from '@/components/shell'
import type { App, MenuGrupo } from '@/components/shell'`} />
        </section>

        {/* ═══ SHELL — ENCABEZADO ═══ */}
        <section id="shell-header" style={{ marginBottom: 64 }}>
          <SectionH2>Shell — Encabezado</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            52 px · fijo · nunca hace scroll · no se duplica por pantalla. Contiene: selector de periodo, buscador global (⌘K), avatar del usuario.
          </p>
          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 24 }}>
            {[
              { prop: 'Alto del encabezado', valor: '52 px' },
              { prop: 'Posición', valor: 'fixed top:0, left:56px, right:0' },
              { prop: 'Fondo', valor: '#FFFFFF (claro) / #101C2B (oscuro)' },
            ].map((row, i) => (
              <div key={row.prop} style={{
                display: 'flex', alignItems: 'center', padding: '10px 16px', gap: 24,
                borderBottom: i < 2 ? '1px solid #F4F5F7' : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFBFC',
              }}>
                <span style={{ font: '500 12.5px var(--font-geist-sans), sans-serif', color: '#5B6472', width: 200 }}>{row.prop}</span>
                <code style={{ font: '600 12px var(--font-geist-mono), monospace', color: '#0E1116' }}>{row.valor}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SHELL — MENÚ ═══ */}
        <section id="shell-menu" style={{ marginBottom: 64 }}>
          <SectionH2>Shell — Menú de pantallas</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            296 px · nace encogido · flota sobre la mesa sin empujarla. Toggle con <kbd style={{ font: '500 11px var(--font-geist-mono), monospace', background: '#EEF0F3', border: '1px solid #D8DCE2', borderRadius: 4, padding: '2px 6px' }}>⌘B</kbd>. Se fija con <kbd style={{ font: '500 11px var(--font-geist-mono), monospace', background: '#EEF0F3', border: '1px solid #D8DCE2', borderRadius: 4, padding: '2px 6px' }}>⌘⇧B</kbd>.
          </p>
          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 24 }}>
            {[
              { prop: 'Ancho', valor: '296 px' },
              { prop: 'Posición', valor: 'absolute, top:52px, left:56px — flota sobre mesa' },
              { prop: 'Comportamiento', valor: 'Engogido por defecto. Fijable con ⌘⇧B.' },
            ].map((row, i) => (
              <div key={row.prop} style={{
                display: 'flex', alignItems: 'center', padding: '10px 16px', gap: 24,
                borderBottom: i < 2 ? '1px solid #F4F5F7' : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFBFC',
              }}>
                <span style={{ font: '500 12.5px var(--font-geist-sans), sans-serif', color: '#5B6472', width: 200 }}>{row.prop}</span>
                <code style={{ font: '600 12px var(--font-geist-mono), monospace', color: '#0E1116' }}>{row.valor}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SHELL — NÚCLEO AI ═══ */}
        <section id="shell-nucleo" style={{ marginBottom: 64 }}>
          <SectionH2>Shell — Panel Núcleo AI</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            340 px · flota sobre la mesa. No reserva espacio permanente. Se abre con <kbd style={{ font: '500 11px var(--font-geist-mono), monospace', background: '#EEF0F3', border: '1px solid #D8DCE2', borderRadius: 4, padding: '2px 6px' }}>⌘J</kbd>.
          </p>
          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 24 }}>
            {[
              { prop: 'Ancho', valor: '340 px' },
              { prop: 'Posición', valor: 'fixed, right:0, top:52px — flota sobre mesa' },
              { prop: 'Atajo', valor: '⌘J para abrir / cerrar' },
              { prop: 'Sombra', valor: '-10px 0 24px rgba(0,36,77,.14) — sí tiene sombra (flota)' },
            ].map((row, i) => (
              <div key={row.prop} style={{
                display: 'flex', alignItems: 'center', padding: '10px 16px', gap: 24,
                borderBottom: i < 3 ? '1px solid #F4F5F7' : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFBFC',
              }}>
                <span style={{ font: '500 12.5px var(--font-geist-sans), sans-serif', color: '#5B6472', width: 200 }}>{row.prop}</span>
                <code style={{ font: '600 12px var(--font-geist-mono), monospace', color: '#0E1116' }}>{row.valor}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SHELL — ATAJOS ═══ */}
        <section id="shell-atajos" style={{ marginBottom: 64 }}>
          <SectionH2>Shell — Atajos de teclado</SectionH2>

          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', background: '#FAFBFC', borderBottom: '1px solid #EEF0F3', padding: '8px 16px', gap: 16 }}>
              <span style={{ font: '600 11px var(--font-geist-mono), monospace', color: '#55677F', letterSpacing: '.05em' }}>ATAJO</span>
              <span style={{ font: '600 11px var(--font-geist-mono), monospace', color: '#55677F', letterSpacing: '.05em' }}>ACCIÓN</span>
            </div>
            {[
              { atajo: '⌘K', accion: 'Abrir búsqueda global' },
              { atajo: '⌘J', accion: 'Abrir/cerrar Núcleo AI' },
              { atajo: '⌘B', accion: 'Toggle menú de pantallas' },
              { atajo: '⌘⇧B', accion: 'Fijar menú de pantallas' },
              { atajo: 'Escape', accion: 'Cerrar paleta / panel activo' },
              { atajo: '↑ ↓', accion: 'Navegar resultados en ⌘K' },
              { atajo: 'Enter', accion: 'Seleccionar resultado en ⌘K' },
            ].map((row, i) => (
              <div key={row.atajo} style={{
                display: 'grid', gridTemplateColumns: '140px 1fr',
                padding: '10px 16px', gap: 16,
                borderBottom: i < 6 ? '1px solid #F4F5F7' : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFBFC',
                alignItems: 'center',
              }}>
                <kbd style={{ font: '600 12px var(--font-geist-mono), monospace', color: '#0E1116', background: '#EEF0F3', border: '1px solid #D8DCE2', borderRadius: 4, padding: '3px 8px', display: 'inline-block' }}>{row.atajo}</kbd>
                <span style={{ font: '400 13px var(--font-geist-sans), sans-serif', color: '#3D4551' }}>{row.accion}</span>
              </div>
            ))}
          </div>

          <SubH>Ejemplo completo de uso</SubH>
          <CodeBlock code={`import { Shell } from '@/components/shell'
import type { App, MenuGrupo } from '@/components/shell'
import { LayoutGrid, TrendingUp } from 'lucide-react'

const APPS: App[] = [
  { id: 'hub', nombre: 'Hub', Icono: LayoutGrid },
  { id: 'finanzas', nombre: 'Finanzas', Icono: TrendingUp, badge: 3 },
]

const GRUPOS: MenuGrupo[] = [
  { items: [{ id: 'puesto', etiqueta: 'Mi puesto' }] },
]

export default function MiPantalla() {
  return (
    <Shell
      apps={APPS}
      appActiva="hub"
      nombreApp="Hub"
      periodo="Ago 2026"
      grupos={GRUPOS}
      itemActivo="puesto"
      onAppChange={(id) => router.push(\`/\${id}\`)}
      onItemChange={(id) => console.log(id)}
    >
      {/* contenido */}
    </Shell>
  )
}`} />
        </section>

        {/* ═══ TOKENS — COLORES ═══ */}
        <section id="tokens-colores" style={{ marginBottom: 64 }}>
          <SectionH2>Tokens — Colores</SectionH2>

          {[
            {
              grupo: 'Estructura',
              swatches: [
                { nombre: 'Navy', hex: '#00244D' },
                { nombre: 'Mesa', hex: '#F4F5F7' },
                { nombre: 'Fondo', hex: '#FFFFFF' },
                { nombre: 'Fondo Alt', hex: '#FAFBFC' },
              ],
            },
            {
              grupo: 'Acción',
              swatches: [
                { nombre: 'Azul', hex: '#2F6BFF' },
                { nombre: 'Azul claro', hex: '#EEF2FB' },
              ],
            },
            {
              grupo: 'Estado ≥ 100%',
              swatches: [
                { nombre: 'Verde texto', hex: '#0B7A53' },
                { nombre: 'Verde relleno', hex: '#0E8A5F' },
              ],
            },
            {
              grupo: 'Estado 80–99%',
              swatches: [
                { nombre: 'Ámbar texto', hex: '#8A5A12' },
                { nombre: 'Ámbar relleno', hex: '#B7791F' },
              ],
            },
            {
              grupo: 'Estado < 80%',
              swatches: [
                { nombre: 'Rojo', hex: '#C2352B' },
                { nombre: 'Rojo claro', hex: '#FDE8E7' },
              ],
            },
            {
              grupo: 'Tinta',
              swatches: [
                { nombre: 'Ink', hex: '#0E1116' },
                { nombre: 'Secundario', hex: '#5B6472' },
                { nombre: 'Terciario', hex: '#98A0AC' },
                { nombre: 'Rail texto', hex: '#E9EEF4' },
              ],
            },
            {
              grupo: 'Borde',
              swatches: [
                { nombre: 'Borde base', hex: '#EEF0F3' },
                { nombre: 'Borde fuerte', hex: '#D8DCE2' },
              ],
            },
          ].map(grupo => (
            <div key={grupo.grupo} style={{ marginBottom: 24 }}>
              <div style={{ font: '600 11px var(--font-geist-mono), monospace', color: '#98A0AC', letterSpacing: '.07em', marginBottom: 12 }}>{grupo.grupo.toUpperCase()}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {grupo.swatches.map(s => (
                  <div key={s.hex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 6, background: s.hex,
                      border: s.hex === '#FFFFFF' || s.hex === '#FAFBFC' || s.hex === '#F4F5F7' || s.hex === '#EEF0F3' || s.hex === '#EEF2FB' || s.hex === '#FDE8E7' ? '1px solid #EEF0F3' : 'none',
                    }} />
                    <code style={{ font: '500 11px var(--font-geist-mono), monospace', color: '#0E1116', fontVariantNumeric: 'tabular-nums' }}>{s.hex}</code>
                    <span style={{ font: '400 11px var(--font-geist-sans), sans-serif', color: '#5B6472' }}>{s.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ═══ TOKENS — TIPOGRAFÍA ═══ */}
        <section id="tokens-tipografia" style={{ marginBottom: 64 }}>
          <SectionH2>Tokens — Tipografía</SectionH2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
            <div style={{ background: '#fff', border: '1px solid #EEF0F3', borderRadius: 6, padding: '16px 20px' }}>
              <div style={{ font: '700 18px var(--font-geist-sans), sans-serif', color: '#0E1116', marginBottom: 4 }}>Geist</div>
              <div style={{ font: '400 12.5px var(--font-geist-sans), sans-serif', color: '#5B6472' }}>Todo texto · UI · etiquetas · cuerpo</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #EEF0F3', borderRadius: 6, padding: '16px 20px' }}>
              <div style={{ font: '700 18px var(--font-geist-mono), monospace', color: '#0E1116', marginBottom: 4 }}>Geist Mono</div>
              <div style={{ font: '400 12.5px var(--font-geist-sans), sans-serif', color: '#5B6472' }}>Todo dato · número · fecha · clave</div>
            </div>
          </div>

          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 240px', background: '#FAFBFC', borderBottom: '1px solid #EEF0F3', padding: '8px 16px', gap: 16 }}>
              {['ROL', 'MUESTRA', 'ESPECIFICACIÓN'].map(h => (
                <span key={h} style={{ font: '600 11px var(--font-geist-mono), monospace', color: '#55677F', letterSpacing: '.05em' }}>{h}</span>
              ))}
            </div>
            {[
              { rol: 'H1 Título', muestra: 'Mis indicadores', spec: 'sans 22px/600 tracking -.02em', style: { font: '600 22px/1 var(--font-geist-sans), sans-serif', letterSpacing: '-.02em', color: '#0E1116' } },
              { rol: 'H2 Sección', muestra: 'Colores', spec: 'sans 18px/600', style: { font: '600 18px/1 var(--font-geist-sans), sans-serif', color: '#0E1116' } },
              { rol: 'Cuerpo', muestra: 'Texto de ejemplo para lectura', spec: 'sans 13.5px/400', style: { font: '400 13.5px/1.5 var(--font-geist-sans), sans-serif', color: '#0E1116' } },
              { rol: 'Etiqueta', muestra: 'NOMBRE DEL CLIENTE', spec: 'sans 11.5px/500 uppercase', style: { font: '500 11.5px/1 var(--font-geist-sans), sans-serif', color: '#0E1116' } },
              { rol: 'Cifra grande', muestra: '185', spec: 'mono 32px/700 tabular', style: { font: '700 32px/1 var(--font-geist-mono), monospace', color: '#0E1116', fontVariantNumeric: 'tabular-nums' } },
              { rol: 'Cifra tabla', muestra: '1,234,567', spec: 'mono 12.5px/500 tabular', style: { font: '500 12.5px/1 var(--font-geist-mono), monospace', color: '#0E1116', fontVariantNumeric: 'tabular-nums' } },
              { rol: 'Rótulo mono', muestra: 'AGOSTO 2026', spec: 'mono 11px/600 tracking .07em', style: { font: '600 11px/1 var(--font-geist-mono), monospace', color: '#0E1116', letterSpacing: '.07em' } },
              { rol: 'Ayuda', muestra: 'Texto de ayuda contextual', spec: 'sans 11.5px/400 #6B7482', style: { font: '400 11.5px/1 var(--font-geist-sans), sans-serif', color: '#6B7482' } },
            ].map((row, i) => (
              <div key={row.rol} style={{
                display: 'grid', gridTemplateColumns: '100px 1fr 240px',
                padding: '12px 16px', gap: 16,
                borderBottom: i < 7 ? '1px solid #F4F5F7' : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFBFC', alignItems: 'center',
              }}>
                <span style={{ font: '500 11.5px var(--font-geist-sans), sans-serif', color: '#5B6472' }}>{row.rol}</span>
                <span style={row.style as React.CSSProperties}>{row.muestra}</span>
                <code style={{ font: '400 11px var(--font-geist-mono), monospace', color: '#6B7482' }}>{row.spec}</code>
              </div>
            ))}
          </div>
          <p style={{ font: '400 12.5px var(--font-geist-sans), sans-serif', color: '#8A5A12', background: '#FFF8EC', border: '1px solid #F0D38A', borderRadius: 6, padding: '8px 12px' }}>
            Tamaño mínimo absoluto: 11 px (solo rótulos mono). Cuerpo mínimo: 11.5 px. Nunca bajar de ahí.
          </p>
        </section>

        {/* ═══ TOKENS — ESPACIADO ═══ */}
        <section id="tokens-espaciado" style={{ marginBottom: 64 }}>
          <SectionH2>Tokens — Espaciado</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 24 }}>
            Toda medida es múltiplo de 4 px. Excepción documentada: gap de íconos en el rail es 9 px (definido en el DS, no inventado).
          </p>
          <div style={{ background: '#fff', border: '1px solid #EEF0F3', borderRadius: 6, padding: '24px 20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end' }}>
              {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map(px => (
                <div key={px} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: px, height: 8, background: '#00244D', borderRadius: 2 }} />
                  <span style={{ font: '500 11px var(--font-geist-mono), monospace', color: '#5B6472', fontVariantNumeric: 'tabular-nums' }}>{px}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TOKENS — RADIOS Y SOMBRAS ═══ */}
        <section id="tokens-radios" style={{ marginBottom: 64 }}>
          <SectionH2>Tokens — Radios y sombras</SectionH2>

          <SubH>Radios de borde</SubH>
          <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
            {[
              { px: 5, label: '5 px', desc: 'Botones, campos, filtros, controles' },
              { px: 6, label: '6 px', desc: 'Tarjetas, paneles, superficies (default)' },
              { px: 7, label: '7 px', desc: 'Cápsulas de app en el rail (34×34 px)' },
            ].map(r => (
              <div key={r.px} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, border: '2px solid #00244D', borderRadius: r.px, background: '#EEF2FB' }} />
                <code style={{ font: '700 13px var(--font-geist-mono), monospace', color: '#0E1116' }}>{r.label}</code>
                <span style={{ font: '400 12px var(--font-geist-sans), sans-serif', color: '#5B6472', maxWidth: 140 }}>{r.desc}</span>
              </div>
            ))}
          </div>

          <SubH>Sombras válidas</SubH>
          <p style={{ font: '400 13px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            Sombra <strong>solo</strong> en elementos que flotan sobre la UI: menús abiertos, Núcleo AI, paleta ⌘K, menú de usuario, panel de sesión caducada.
            Tarjetas y paneles en reposo: <strong>borde, nunca sombra</strong>.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { nombre: 'Flotante', valor: '0 8px 24px rgba(0,36,77,.14)' },
              { nombre: 'Dialog', valor: '0 24px 60px rgba(0,36,77,.18)' },
              { nombre: 'Dark flotante', valor: '0 8px 24px rgba(0,0,0,.4)' },
            ].map(s => (
              <div key={s.nombre} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ width: 80, height: 56, background: '#fff', borderRadius: 6, boxShadow: s.valor }} />
                <span style={{ font: '500 12px var(--font-geist-sans), sans-serif', color: '#0E1116' }}>{s.nombre}</span>
                <code style={{ font: '400 10.5px var(--font-geist-mono), monospace', color: '#5B6472', maxWidth: 180, wordBreak: 'break-all' }}>{s.valor}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ COMP — CAMPO ═══ */}
        <section id="comp-campo" style={{ marginBottom: 64 }}>
          <SectionH2>Componentes — Campo (texto corto)</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            8 estados: reposo · foco · con-valor · deshabilitado · inválido · advertencia · guardando · guardado.
            Control de 32 px de alto, border-radius 8 px.
          </p>

          <SubH>Demo en vivo</SubH>
          <Prevista>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Campo
                etiqueta="Nombre del cliente"
                requerido
                placeholder="Ej. Juan Pérez"
                ayuda="Máx. 80 caracteres"
                maxLength={80}
                valor={campoValor}
                onChange={setCampoValor}
              />
              <Campo
                etiqueta="Correo electrónico"
                tipo="email"
                placeholder="correo@ejemplo.com"
                valor=""
                error={campoError || undefined}
                onChange={() => {}}
              />
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button
                onClick={() => setCampoError('')}
                style={{ font: '500 12px var(--font-geist-sans), sans-serif', border: '1px solid #D8DCE2', borderRadius: 5, padding: '4px 10px', background: 'transparent', cursor: 'pointer', color: '#0E1116' }}
              >
                Sin error
              </button>
              <button
                onClick={() => setCampoError('Formato de correo inválido')}
                style={{ font: '500 12px var(--font-geist-sans), sans-serif', border: '1px solid #C2352B', borderRadius: 5, padding: '4px 10px', background: 'transparent', cursor: 'pointer', color: '#C2352B' }}
              >
                Activar error
              </button>
            </div>
          </Prevista>

          <SubH>Props</SubH>
          <PropsTable rows={[
            { nombre: 'etiqueta', tipo: 'string', descripcion: 'Texto del rótulo sobre el campo.' },
            { nombre: 'requerido', tipo: 'boolean', defecto: 'false', descripcion: 'Muestra asterisco rojo junto a la etiqueta.' },
            { nombre: 'ayuda', tipo: 'string', descripcion: 'Texto de ayuda bajo el control (solo cuando no hay error).' },
            { nombre: 'error', tipo: 'string', descripcion: 'Mensaje de error. Pone el campo en estado inválido.' },
            { nombre: 'advertencia', tipo: 'string', descripcion: 'Mensaje de advertencia en ámbar.' },
            { nombre: 'valor', tipo: 'string', defecto: "''", descripcion: 'Valor controlado del input.' },
            { nombre: 'onChange', tipo: '(v: string) => void', descripcion: 'Callback al cambiar el valor.' },
            { nombre: 'placeholder', tipo: 'string', descripcion: 'Texto placeholder del input.' },
            { nombre: 'maxLength', tipo: 'number', descripcion: 'Máximo de caracteres. Muestra contador.' },
            { nombre: 'deshabilitado', tipo: 'boolean', defecto: 'false', descripcion: 'Deshabilita el campo.' },
            { nombre: 'estadoExterno', tipo: 'EstadoCampo', descripcion: 'Fuerza un estado externo (guardando, guardado, etc.).' },
            { nombre: 'isDark', tipo: 'boolean', defecto: 'false', descripcion: 'Modo oscuro.' },
            { nombre: 'ancho', tipo: 'number | string', descripcion: 'Ancho del campo. Por defecto 100%.' },
            { nombre: 'tipo', tipo: "'text' | 'email' | 'password' | 'tel'", defecto: "'text'", descripcion: 'Tipo del input HTML.' },
            { nombre: 'children', tipo: 'ReactNode', descripcion: 'Slot para contenido personalizado (lista, combobox, etc.).' },
          ]} />

          <SubH>Importación</SubH>
          <CodeBlock code={`import { Campo } from '@/components/nucleo-adc/ui/campo'
import type { EstadoCampo } from '@/components/nucleo-adc/ui/campo'`} />

          <SubH>Ejemplo</SubH>
          <CodeBlock code={`<Campo
  etiqueta="Nombre del cliente"
  requerido
  placeholder="Ej. Juan Pérez"
  ayuda="Máx. 80 caracteres"
  maxLength={80}
  valor={nombre}
  onChange={setNombre}
  error={error ? 'Ingresa solo letras y espacios · mín. 2 caracteres' : undefined}
/>`} />
        </section>

        {/* ═══ COMP — CAMPO CIFRA ═══ */}
        <section id="comp-campo-cifra" style={{ marginBottom: 64 }}>
          <SectionH2>Componentes — Campo cifra</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            Input numérico mono, tabular, alineado a la derecha. Prefijo $ o sufijo % dentro del control. Ancho fijo (default 150 px).
          </p>

          <SubH>Demo en vivo</SubH>
          <Prevista>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <CampoCifra
                etiqueta="Monto del descuento"
                prefijo="$"
                valor={campoCifraValor}
                onChange={setCampoCifraValor}
                ayuda="Sin IVA"
                ancho={160}
              />
              <CampoCifra
                etiqueta="Porcentaje de avance"
                sufijo="%"
                valor="83.1"
                onChange={() => {}}
                ancho={140}
              />
              <CampoCifra
                etiqueta="Campo con error"
                prefijo="$"
                valor=""
                onChange={() => {}}
                error="Ingresa un monto válido"
                ancho={160}
              />
            </div>
          </Prevista>

          <SubH>Props</SubH>
          <PropsTable rows={[
            { nombre: 'etiqueta', tipo: 'string', descripcion: 'Rótulo sobre el campo.' },
            { nombre: 'requerido', tipo: 'boolean', defecto: 'false', descripcion: 'Muestra asterisco rojo.' },
            { nombre: 'valor', tipo: 'string', defecto: "''", descripcion: 'Valor controlado.' },
            { nombre: 'onChange', tipo: '(v: string) => void', descripcion: 'Callback al cambiar.' },
            { nombre: 'ayuda', tipo: 'string', descripcion: 'Texto de ayuda.' },
            { nombre: 'error', tipo: 'string', descripcion: 'Mensaje de error.' },
            { nombre: 'prefijo', tipo: 'string', descripcion: "Prefijo dentro del control. Ej. '$'." },
            { nombre: 'sufijo', tipo: 'string', descripcion: "Sufijo dentro del control. Ej. '%'." },
            { nombre: 'ancho', tipo: 'number', defecto: '150', descripcion: 'Ancho en px.' },
            { nombre: 'deshabilitado', tipo: 'boolean', defecto: 'false', descripcion: 'Deshabilita el campo.' },
            { nombre: 'isDark', tipo: 'boolean', defecto: 'false', descripcion: 'Modo oscuro.' },
          ]} />

          <SubH>Importación y ejemplo</SubH>
          <CodeBlock code={`import { CampoCifra } from '@/components/nucleo-adc/ui/campo-cifra'

<CampoCifra
  etiqueta="Monto del descuento"
  prefijo="$"
  valor={monto}
  onChange={setMonto}
  ayuda="Sin IVA"
  ancho={160}
/>`} />
        </section>

        {/* ═══ COMP — COMBOBOX ═══ */}
        <section id="comp-combobox" style={{ marginBottom: 64 }}>
          <SectionH2>Componentes — Combobox</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            Para listas largas (12+ ítems) con búsqueda integrada. Muestra la clave en mono (lo que se dicta por teléfono). Cierra con Escape o clic exterior.
          </p>

          <SubH>Demo en vivo</SubH>
          <Prevista>
            <div style={{ maxWidth: 320 }}>
              <Combobox
                etiqueta="Sucursal"
                requerido
                opciones={OPCIONES_COMBOBOX}
                valor={comboValor}
                onSeleccionar={(clave) => setComboValor(clave)}
                ayuda="Selecciona la sucursal de origen"
              />
            </div>
          </Prevista>

          <SubH>Props</SubH>
          <PropsTable rows={[
            { nombre: 'etiqueta', tipo: 'string', descripcion: 'Rótulo sobre el control.' },
            { nombre: 'requerido', tipo: 'boolean', defecto: 'false', descripcion: 'Muestra asterisco rojo.' },
            { nombre: 'opciones', tipo: 'OpcionCombobox[]', descripcion: 'Lista de opciones {clave, etiqueta, grupo?}.' },
            { nombre: 'valor', tipo: 'string', descripcion: 'Clave seleccionada.' },
            { nombre: 'onSeleccionar', tipo: '(clave, etiqueta) => void', descripcion: 'Callback al seleccionar una opción.' },
            { nombre: 'ayuda', tipo: 'string', descripcion: 'Texto de ayuda.' },
            { nombre: 'error', tipo: 'string', descripcion: 'Mensaje de error.' },
            { nombre: 'placeholder', tipo: 'string', defecto: "'Buscar…'", descripcion: 'Placeholder del trigger cerrado.' },
            { nombre: 'isDark', tipo: 'boolean', defecto: 'false', descripcion: 'Modo oscuro.' },
            { nombre: 'ancho', tipo: 'number | string', defecto: "'100%'", descripcion: 'Ancho del control.' },
          ]} />

          <SubH>Importación y ejemplo</SubH>
          <CodeBlock code={`import { Combobox } from '@/components/nucleo-adc/ui/combobox'
import type { OpcionCombobox } from '@/components/nucleo-adc/ui/combobox'

const SUCURSALES: OpcionCombobox[] = [
  { clave: 'MG-CEL', etiqueta: 'MG Celaya' },
  { clave: 'MG-GDL', etiqueta: 'MG Guadalajara' },
]

<Combobox
  etiqueta="Sucursal"
  requerido
  opciones={SUCURSALES}
  valor={sucursal}
  onSeleccionar={(clave) => setSucursal(clave)}
/>`} />
        </section>

        {/* ═══ COMP — RADIO TARJETA ═══ */}
        <section id="comp-radio-tarjeta" style={{ marginBottom: 64 }}>
          <SectionH2>Componentes — Radio tarjeta</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            Radio group en formato de tarjeta. Úsalo cuando la elección cambia el significado del registro y se necesita mostrar una descripción de cada opción.
          </p>

          <SubH>Demo en vivo</SubH>
          <Prevista>
            <div style={{ maxWidth: 360 }}>
              <RadioTarjeta
                etiqueta="Nivel de prioridad"
                opciones={OPCIONES_RADIO}
                valor={radioValor}
                onCambiar={setRadioValor}
                ayuda="Determina el tiempo de respuesta esperado."
              />
            </div>
          </Prevista>

          <SubH>Props</SubH>
          <PropsTable rows={[
            { nombre: 'etiqueta', tipo: 'string', descripcion: 'Rótulo del grupo.' },
            { nombre: 'opciones', tipo: 'OpcionRadio[]', descripcion: 'Lista {valor, titulo, descripcion?}.' },
            { nombre: 'valor', tipo: 'string', descripcion: 'Valor seleccionado.' },
            { nombre: 'onCambiar', tipo: '(v: string) => void', descripcion: 'Callback al cambiar selección.' },
            { nombre: 'isDark', tipo: 'boolean', defecto: 'false', descripcion: 'Modo oscuro.' },
            { nombre: 'ayuda', tipo: 'string', descripcion: 'Texto de ayuda debajo del grupo.' },
          ]} />

          <SubH>Importación y ejemplo</SubH>
          <CodeBlock code={`import { RadioTarjeta } from '@/components/nucleo-adc/ui/radio-tarjeta'

const OPCIONES = [
  { valor: 'alta', titulo: 'Alta prioridad', descripcion: 'Requiere atención en 24 h.' },
  { valor: 'media', titulo: 'Prioridad media', descripcion: 'Puede resolverse en 3 días.' },
]

<RadioTarjeta
  etiqueta="Nivel de prioridad"
  opciones={OPCIONES}
  valor={prioridad}
  onCambiar={setPrioridad}
/>`} />
        </section>

        {/* ═══ COMP — CAMPO ARCHIVO ═══ */}
        <section id="comp-campo-archivo" style={{ marginBottom: 64 }}>
          <SectionH2>Componentes — Campo archivo</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            Carga masiva de archivos CSV. Declara columnas esperadas antes de cargar. Muestra resultado fila por fila (máx. 20 filas visibles).
          </p>

          <SubH>Demo en vivo</SubH>
          <Prevista>
            <CampoArchivo
              etiqueta="Carga de cuentas"
              columnasEsperadas={['CTA', 'SCTA', 'DESTINO', 'NOTAS']}
              onArchivo={(f) => console.log('archivo:', f.name)}
            />
          </Prevista>

          <SubH>Props</SubH>
          <PropsTable rows={[
            { nombre: 'etiqueta', tipo: 'string', descripcion: 'Rótulo sobre la zona de carga.' },
            { nombre: 'columnasEsperadas', tipo: 'string[]', descripcion: 'Columnas que debe tener el CSV. Se muestran antes de cargar.' },
            { nombre: 'onArchivo', tipo: '(archivo: File) => void', descripcion: 'Callback cuando se selecciona o suelta un archivo.' },
            { nombre: 'resultados', tipo: 'ResultadoFila[]', descripcion: 'Resultados fila por fila después de procesar el CSV.' },
            { nombre: 'isDark', tipo: 'boolean', defecto: 'false', descripcion: 'Modo oscuro.' },
          ]} />

          <SubH>Importación y ejemplo</SubH>
          <CodeBlock code={`import { CampoArchivo } from '@/components/nucleo-adc/ui/campo-archivo'

<CampoArchivo
  etiqueta="Carga de cuentas"
  columnasEsperadas={['CTA', 'SCTA', 'DESTINO', 'NOTAS']}
  onArchivo={async (archivo) => {
    const resultados = await procesarCSV(archivo)
    setResultados(resultados)
  }}
  resultados={resultados}
/>`} />
        </section>

        {/* ═══ COMP — CAMPO REJILLA ═══ */}
        <section id="comp-campo-rejilla" style={{ marginBottom: 64 }}>
          <SectionH2>Componentes — Campo rejilla</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            Captura del mismo dato repetido en muchas filas. Siempre muestra el periodo anterior como referencia para que el capturista valide la magnitud.
          </p>

          <SubH>Demo en vivo</SubH>
          <Prevista>
            <div style={{ maxWidth: 480 }}>
              <CampoRejilla
                etiquetaColumnaActual="AGO"
                filas={FILAS_REJILLA}
                valores={rejillaValores}
                onCambiar={(id, val) => setRejillaValores(prev => ({ ...prev, [id]: val }))}
              />
            </div>
          </Prevista>

          <SubH>Props</SubH>
          <PropsTable rows={[
            { nombre: 'etiquetaColumnaActual', tipo: 'string', descripcion: "Encabezado de la columna activa. Ej. 'AGO'." },
            { nombre: 'filas', tipo: 'FilaRejilla[]', descripcion: 'Lista {id, nombre, valorAnterior, etiquetaAnterior}.' },
            { nombre: 'valores', tipo: 'Record<string, string>', descripcion: 'Mapa id → valor capturado.' },
            { nombre: 'onCambiar', tipo: '(id, valor) => void', descripcion: 'Callback cuando cambia una celda.' },
            { nombre: 'isDark', tipo: 'boolean', defecto: 'false', descripcion: 'Modo oscuro.' },
          ]} />

          <SubH>Importación y ejemplo</SubH>
          <CodeBlock code={`import { CampoRejilla } from '@/components/nucleo-adc/ui/campo-rejilla'
import type { FilaRejilla } from '@/components/nucleo-adc/ui/campo-rejilla'

const FILAS: FilaRejilla[] = [
  { id: 'vnt', nombre: 'Ventas unidades', valorAnterior: 178, etiquetaAnterior: 'JUL' },
  { id: 'srv', nombre: 'Servicios taller', valorAnterior: 1243, etiquetaAnterior: 'JUL' },
]

<CampoRejilla
  etiquetaColumnaActual="AGO"
  filas={FILAS}
  valores={valores}
  onCambiar={(id, val) => setValores(prev => ({ ...prev, [id]: val }))}
/>`} />
        </section>

        {/* ═══ COMP — SELECTOR PERIODO ═══ */}
        <section id="comp-selector-periodo" style={{ marginBottom: 64 }}>
          <SectionH2>Componentes — Selector de periodo</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            Control de 30 px para la mesa. Dos dropdowns personalizados (mes + año) que siempre abren hacia abajo. Geist Mono 12 px.
          </p>

          <SubH>Demo en vivo</SubH>
          <Prevista>
            <SelectorPeriodo
              anio={periodoAnio}
              mes={periodoMes}
              onCambiar={(a, m) => { setPeriodoAnio(a); setPeriodoMes(m) }}
            />
          </Prevista>

          <SubH>Props</SubH>
          <PropsTable rows={[
            { nombre: 'anio', tipo: 'number', descripcion: 'Año seleccionado.' },
            { nombre: 'mes', tipo: 'number', descripcion: 'Mes seleccionado (1–12).' },
            { nombre: 'onCambiar', tipo: '(anio, mes) => void', descripcion: 'Callback al cambiar mes o año.' },
            { nombre: 'isDark', tipo: 'boolean', defecto: 'false', descripcion: 'Modo oscuro.' },
          ]} />

          <SubH>Importación y ejemplo</SubH>
          <CodeBlock code={`import { SelectorPeriodo } from '@/components/nucleo-adc/ui/selector-periodo'

<SelectorPeriodo
  anio={anio}
  mes={mes}
  onCambiar={(a, m) => { setAnio(a); setMes(m) }}
/>`} />
        </section>

        {/* ═══ COMP — PÍLDORA FILTRO ═══ */}
        <section id="comp-pillora-filtro" style={{ marginBottom: 64 }}>
          <SectionH2>Componentes — Píldora filtro</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            Filtro de chip. Activa: fondo negro (#0E1116), texto blanco, sin borde, font 600.
            Inactiva: contorno (#E4E6EA), texto #3D4551, font 500. Alto: 24 px, border-radius 12 px.
          </p>

          <SubH>Demo en vivo</SubH>
          <Prevista>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FILTROS_DEMO.map(f => (
                <PilloraFiltro
                  key={f}
                  etiqueta={f}
                  activa={filtrosActivos.includes(f)}
                  onClick={() => toggleFiltro(f)}
                />
              ))}
            </div>
          </Prevista>

          <SubH>Props</SubH>
          <PropsTable rows={[
            { nombre: 'etiqueta', tipo: 'string', descripcion: 'Texto de la píldora.' },
            { nombre: 'activa', tipo: 'boolean', defecto: 'false', descripcion: 'Estado activo (fondo negro).' },
            { nombre: 'onClick', tipo: '() => void', descripcion: 'Callback al hacer clic.' },
            { nombre: 'isDark', tipo: 'boolean', defecto: 'false', descripcion: 'Modo oscuro.' },
          ]} />

          <SubH>Importación y ejemplo</SubH>
          <CodeBlock code={`import { PilloraFiltro } from '@/components/nucleo-adc/ui/pillora-filtro'

const FILTROS = ['Agosto 2026', 'MG Celaya', 'META']
const [activos, setActivos] = useState(['Agosto 2026'])

{FILTROS.map(f => (
  <PilloraFiltro
    key={f}
    etiqueta={f}
    activa={activos.includes(f)}
    onClick={() => {
      setActivos(prev =>
        prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
      )
    }}
  />
))}`} />
        </section>

        {/* ═══ INDICADORES — TARJETA ═══ */}
        <section id="ind-tarjeta" style={{ marginBottom: 64 }}>
          <SectionH2>Indicadores — Tarjeta indicador</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            Form E oficial · 214 × 132 px · <code style={{ font: '500 12px var(--font-geist-mono), monospace' }}>padding: 11px 15px</code> · <code style={{ font: '500 12px var(--font-geist-mono), monospace' }}>border-radius: 6px</code>.
          </p>

          <AlertaRegla>
            <ul style={{ margin: 0, padding: '0 0 0 16px', listStyle: 'disc' }}>
              {[
                'Sin objetivo (null en la API) → sin barra, sin porcentaje, sin diagonal. No mostrar 0% ni 100%.',
                "EstatusCalculo = 'SIN_OPERACION' → mostrar — o 'sin operación'. Nunca barra roja con 0%.",
                'La alarma NO pinta la tarjeta de rojo. Solo agrega: punto de color + border-left 3px + franja 34px al pie.',
                'avanceObjetivo llega como decimal (0.831) → multiplicar × 100 antes de mostrar.',
                'varSPLM / varSPLY = null → mostrar —. Nunca 0% ni ∞.',
              ].map(r => (
                <li key={r} style={{ font: '400 12.5px/1.8 var(--font-geist-sans), sans-serif', color: '#C2352B' }}>{r}</li>
              ))}
            </ul>
          </AlertaRegla>

          <SubH>4 variantes</SubH>
          <Prevista>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ font: '500 11px var(--font-geist-mono), monospace', color: '#98A0AC', marginBottom: 8 }}>Normal</div>
                <TarjetaIndicador indicador={IND_NORMAL} />
              </div>
              <div>
                <div style={{ font: '500 11px var(--font-geist-mono), monospace', color: '#98A0AC', marginBottom: 8 }}>Alarma ATENCIÓN</div>
                <TarjetaIndicador indicador={IND_ALARMA_ATENCION} alarma={ALARMA_ATENCION} />
              </div>
              <div>
                <div style={{ font: '500 11px var(--font-geist-mono), monospace', color: '#98A0AC', marginBottom: 8 }}>Alarma CRÍTICA</div>
                <TarjetaIndicador indicador={IND_ALARMA_CRITICA} alarma={ALARMA_CRITICA} />
              </div>
              <div>
                <div style={{ font: '500 11px var(--font-geist-mono), monospace', color: '#98A0AC', marginBottom: 8 }}>Sin objetivo</div>
                <TarjetaIndicador indicador={IND_SIN_OBJETIVO} />
              </div>
            </div>
          </Prevista>

          <SubH>Tono destacado (navy)</SubH>
          <Prevista>
            <div style={{ display: 'flex', gap: 12 }}>
              <TarjetaIndicador indicador={IND_NORMAL} tono="destacado" />
            </div>
          </Prevista>

          <SubH>Props</SubH>
          <PropsTable rows={[
            { nombre: 'indicador', tipo: 'Indicador', descripcion: 'Objeto completo del indicador (ver types.ts).' },
            { nombre: 'tono', tipo: "'normal' | 'destacado'", defecto: "'normal'", descripcion: "Destacado → fondo navy #00244D." },
            { nombre: 'alarma', tipo: 'Alarma', descripcion: 'Objeto de alarma {nivel, motivo, desde}. Agrega borde lateral y franja.' },
            { nombre: 'onDetalle', tipo: '() => void', descripcion: 'Callback al hacer clic. Muestra cursor pointer.' },
            { nombre: 'isDark', tipo: 'boolean', defecto: 'false', descripcion: 'Modo oscuro.' },
          ]} />

          <SubH>Importación</SubH>
          <CodeBlock code={`import { TarjetaIndicador } from '@/components/nucleo-adc/indicadores/tarjeta'
import type { Indicador, Alarma } from '@/components/nucleo-adc/indicadores/types'`} />

          <SubH>Interfaz Indicador (abreviada)</SubH>
          <CodeBlock code={`interface Indicador {
  claveIndicador: string
  nombreIndicador: string
  nivelNombre: string
  claseClave: 'DESEMPENO' | 'CONTROL' | 'REFERENCIA' | 'PERCEPCION'
  unidadMedidaFormato: string        // "#,##0" | "#,##0.0%" | "$#,##0"
  direccionDeseable: 'Arriba' | 'Abajo'
  valor: number | null
  avanceObjetivo: number | null      // DECIMAL — 0.831 = 83.1%
  objetivo: number | null            // null → sin barra, sin %, sin diagonal
  varSPLM: number | null             // null → mostrar "—"
  varSPLY: number | null
  estatusCalculo: 'OK' | 'SIN_OPERACION'
  fecha: string                      // "YYYY-MM-DD"
  // ...más campos en types.ts
}`} />
        </section>

        {/* ═══ INDICADORES — PANEL DETALLE ═══ */}
        <section id="ind-panel-detalle" style={{ marginBottom: 64 }}>
          <SectionH2>Indicadores — Panel de detalle</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            460 px · entra por la derecha · flota sobre la mesa. Se abre al hacer clic en una <code style={{ font: '500 12px var(--font-geist-mono), monospace' }}>TarjetaIndicador</code> con <code style={{ font: '500 12px var(--font-geist-mono), monospace' }}>onDetalle</code>.
          </p>
          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
            {[
              { prop: 'Ancho', valor: '460 px' },
              { prop: 'Posición', valor: 'fixed right:0, top:52px — flota sobre mesa' },
              { prop: 'Apertura', valor: 'onDetalle prop de TarjetaIndicador' },
            ].map((row, i) => (
              <div key={row.prop} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', gap: 24, borderBottom: i < 2 ? '1px solid #F4F5F7' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                <span style={{ font: '500 12.5px var(--font-geist-sans), sans-serif', color: '#5B6472', width: 200 }}>{row.prop}</span>
                <code style={{ font: '600 12px var(--font-geist-mono), monospace', color: '#0E1116' }}>{row.valor}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ INDICADORES — ALARMAS ═══ */}
        <section id="ind-alarmas" style={{ marginBottom: 64 }}>
          <SectionH2>Indicadores — Alarmas</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            Dos niveles: ATENCIÓN (ámbar) y CRÍTICA (rojo).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div style={{ background: '#FFF8EC', border: '1px solid #F0D38A', borderLeft: '3px solid #B7791F', borderRadius: 6, padding: '12px 16px' }}>
              <div style={{ font: '600 12px var(--font-geist-mono), monospace', color: '#8A5A12', marginBottom: 4 }}>ATENCIÓN</div>
              <div style={{ font: '400 12.5px var(--font-geist-sans), sans-serif', color: '#8A5A12' }}>nivel: 'ATENCION' · borde ámbar (#B7791F) · franja ámbar al pie</div>
            </div>
            <div style={{ background: '#FDE8E7', border: '1px solid #F6D5D2', borderLeft: '3px solid #C2352B', borderRadius: 6, padding: '12px 16px' }}>
              <div style={{ font: '600 12px var(--font-geist-mono), monospace', color: '#C2352B', marginBottom: 4 }}>CRÍTICA</div>
              <div style={{ font: '400 12.5px var(--font-geist-sans), sans-serif', color: '#C2352B' }}>nivel: 'CRITICA' · borde rojo (#C2352B) · franja roja al pie</div>
            </div>
          </div>

          <SubH>Qué agrega una alarma a la tarjeta</SubH>
          <ul style={{ font: '400 13px/1.8 var(--font-geist-sans), sans-serif', color: '#3D4551', paddingLeft: 20, marginBottom: 16 }}>
            <li>Punto de color (6 × 6 px) junto al tipo de indicador</li>
            <li>border-left: 3px solid (ámbar o rojo)</li>
            <li>Franja de motivo de 34 px al pie de la tarjeta</li>
          </ul>

          <AlertaRegla>
            <p style={{ margin: 0, font: '600 12.5px var(--font-geist-sans), sans-serif', color: '#C2352B' }}>
              La alarma NO pinta la tarjeta de rojo. NO altera el avanceObjetivo. El color de estado sigue siendo del avance.
            </p>
          </AlertaRegla>

          <CodeBlock code={`import type { Alarma } from '@/components/nucleo-adc/indicadores/types'

const alarma: Alarma = {
  nivel: 'CRITICA',       // 'CRITICA' | 'ATENCION' | 'NO_EVALUABLE'
  motivo: 'Por debajo del umbral mínimo',
  desde: '2026-08-19',
}

<TarjetaIndicador
  indicador={indicador}
  alarma={alarma}
/>`} />
        </section>

        {/* ═══ FORMULARIOS — PANEL LATERAL ═══ */}
        <section id="form-panel" style={{ marginBottom: 64 }}>
          <SectionH2>Formularios — Panel lateral</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            480 px · entra desde la derecha · para editar un renglón de una lista larga sin perderla de vista.
            2–5 campos. Cierra con Escape o clic en el overlay.
          </p>

          <Prevista>
            <button
              onClick={() => setPanelAbierto(true)}
              style={{
                height: 32, padding: '0 16px', borderRadius: 5,
                background: '#00244D', border: 'none',
                font: '600 12.5px var(--font-geist-sans), sans-serif',
                color: '#fff', cursor: 'pointer',
              }}
            >
              Abrir panel lateral
            </button>
          </Prevista>

          <PanelLateral
            titulo="Editar indicador"
            subtitulo="VNT-001 · MG CELAYA"
            abierto={panelAbierto}
            onCerrar={() => setPanelAbierto(false)}
            onGuardar={() => setPanelAbierto(false)}
            etiquetaGuardar="Guardar cambios"
            advertenciaGuardar="Pendiente de sincronizar con el DWH"
          >
            <Campo
              etiqueta="Nombre del indicador"
              valor={panelCampoValor}
              onChange={setPanelCampoValor}
              placeholder="Ej. Unidades vendidas"
            />
            <CampoCifra etiqueta="Objetivo mensual" prefijo="" valor="222" onChange={() => {}} ancho={160} />
          </PanelLateral>

          <SubH>Props</SubH>
          <PropsTable rows={[
            { nombre: 'titulo', tipo: 'string', descripcion: 'Título del panel.' },
            { nombre: 'subtitulo', tipo: 'string', descripcion: 'Subtítulo en mono debajo del título.' },
            { nombre: 'abierto', tipo: 'boolean', descripcion: 'Controla la visibilidad del panel.' },
            { nombre: 'onCerrar', tipo: '() => void', descripcion: 'Callback al cerrar (Escape u overlay).' },
            { nombre: 'onGuardar', tipo: '() => void', descripcion: 'Callback del botón primario.' },
            { nombre: 'etiquetaGuardar', tipo: 'string', defecto: "'Guardar'", descripcion: 'Texto del botón primario.' },
            { nombre: 'advertenciaGuardar', tipo: 'string', descripcion: 'Advertencia ámbar en el pie del panel.' },
            { nombre: 'guardando', tipo: 'boolean', defecto: 'false', descripcion: 'Estado de carga del botón guardar.' },
            { nombre: 'children', tipo: 'ReactNode', descripcion: 'Campos del formulario (2–5).' },
            { nombre: 'isDark', tipo: 'boolean', defecto: 'false', descripcion: 'Modo oscuro.' },
          ]} />

          <SubH>Importación y ejemplo</SubH>
          <CodeBlock code={`import { PanelLateral } from '@/components/nucleo-adc/formularios/panel-lateral'

<PanelLateral
  titulo="Editar indicador"
  subtitulo="VNT-001 · MG CELAYA"
  abierto={panelAbierto}
  onCerrar={() => setPanelAbierto(false)}
  onGuardar={handleGuardar}
  etiquetaGuardar="Guardar cambios"
  guardando={guardando}
>
  <Campo etiqueta="Nombre" valor={nombre} onChange={setNombre} />
  <CampoCifra etiqueta="Objetivo" valor={objetivo} onChange={setObjetivo} />
</PanelLateral>`} />
        </section>

        {/* ═══ FORMULARIOS — DIÁLOGO ═══ */}
        <section id="form-dialogo" style={{ marginBottom: 64 }}>
          <SectionH2>Formularios — Diálogo de confirmación</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            El único modal permitido en el sistema. Solo para confirmar acciones destructivas.
            El botón dice el acto exacto ('Eliminar las 3 cuentas'), nunca 'Aceptar'.
          </p>

          <AlertaRegla>
            <p style={{ margin: 0, font: '600 12.5px var(--font-geist-sans), sans-serif', color: '#C2352B' }}>
              Cero modales para flujos de trabajo. Los modales solo confirman destrucción. Si necesitas campos, usa PanelLateral.
            </p>
          </AlertaRegla>

          <Prevista>
            <button
              onClick={() => setDialogoAbierto(true)}
              style={{
                height: 32, padding: '0 16px', borderRadius: 5,
                background: 'transparent', border: '1px solid #C2352B',
                font: '600 12.5px var(--font-geist-sans), sans-serif',
                color: '#C2352B', cursor: 'pointer',
              }}
            >
              Abrir diálogo destructivo
            </button>
          </Prevista>

          <DialogoConfirmacion
            abierto={dialogoAbierto}
            titulo="Eliminar las 3 cuentas seleccionadas"
            descripcion="Esta acción es permanente y no se puede deshacer. Las cuentas serán eliminadas del catálogo."
            etiquetaConfirmar="Eliminar las 3 cuentas"
            onConfirmar={() => setDialogoAbierto(false)}
            onCancelar={() => setDialogoAbierto(false)}
            peligroso
          />

          <SubH>Props</SubH>
          <PropsTable rows={[
            { nombre: 'abierto', tipo: 'boolean', descripcion: 'Controla la visibilidad del diálogo.' },
            { nombre: 'titulo', tipo: 'string', descripcion: 'Título del diálogo (en rojo si peligroso).' },
            { nombre: 'descripcion', tipo: 'string', descripcion: 'Texto descriptivo de la consecuencia.' },
            { nombre: 'etiquetaConfirmar', tipo: 'string', descripcion: "Texto del botón de confirmación. Ej. 'Eliminar las 3 cuentas'." },
            { nombre: 'onConfirmar', tipo: '() => void', descripcion: 'Callback al confirmar.' },
            { nombre: 'onCancelar', tipo: '() => void', descripcion: 'Callback al cancelar o presionar Escape.' },
            { nombre: 'peligroso', tipo: 'boolean', defecto: 'true', descripcion: 'Botón rojo relleno. false → botón navy.' },
            { nombre: 'confirmando', tipo: 'boolean', defecto: 'false', descripcion: 'Estado de carga.' },
            { nombre: 'children', tipo: 'ReactNode', descripcion: 'Campos opcionales (0–2) para capturar motivo.' },
            { nombre: 'isDark', tipo: 'boolean', defecto: 'false', descripcion: 'Modo oscuro.' },
          ]} />

          <SubH>Importación y ejemplo</SubH>
          <CodeBlock code={`import { DialogoConfirmacion } from '@/components/nucleo-adc/formularios/dialogo-confirmacion'

<DialogoConfirmacion
  abierto={confirmando}
  titulo="Eliminar las 3 cuentas seleccionadas"
  descripcion="Esta acción es permanente y no se puede deshacer."
  etiquetaConfirmar="Eliminar las 3 cuentas"
  onConfirmar={handleEliminar}
  onCancelar={() => setConfirmando(false)}
  peligroso
/>`} />
        </section>

        {/* ═══ ESTADOS DEL SISTEMA ═══ */}
        <section id="estados" style={{ marginBottom: 64 }}>
          <SectionH2>Estados del sistema</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            6 estados obligatorios. Todos mantienen el rail y el encabezado visibles — nunca los ocultan.
          </p>

          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 160px 1fr', background: '#FAFBFC', borderBottom: '1px solid #EEF0F3', padding: '8px 16px', gap: 16 }}>
              {['ESTADO', 'CUÁNDO', 'REGLA PRINCIPAL'].map(h => (
                <span key={h} style={{ font: '600 11px var(--font-geist-mono), monospace', color: '#55677F', letterSpacing: '.05em' }}>{h}</span>
              ))}
            </div>
            {[
              { estado: 'Cargando', cuando: 'Datos en tránsito', regla: 'Esqueleto con la forma real de la pantalla. Sin spinner genérico. Sin animación de pulso.' },
              { estado: 'Vacío', cuando: 'Sin datos que mostrar', regla: 'Dice qué aparecerá ahí y cómo se crea. Un solo botón de acción.' },
              { estado: 'Sin permiso', cuando: 'Sin autorización', regla: 'Muestra qué se necesita para acceder. No oculta el shell.' },
              { estado: 'Error', cuando: 'Fallo del sistema', regla: 'Título en español + folio de referencia en Geist Mono + 2 botones (reintentar / reportar).' },
              { estado: 'Sesión caducada', cuando: 'Token expirado', regla: 'Único modal permitido sobre la mesa. Al reautenticar vuelve a la misma ruta.' },
              { estado: 'Sin conexión', cuando: 'Red no disponible', regla: 'Distingue: sin internet vs. servidor caído. Reintentar automático al reconectar.' },
            ].map((row, i) => (
              <div key={row.estado} style={{
                display: 'grid', gridTemplateColumns: '120px 160px 1fr', padding: '12px 16px', gap: 16,
                borderBottom: i < 5 ? '1px solid #F4F5F7' : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFBFC', alignItems: 'start',
              }}>
                <span style={{ font: '600 12.5px var(--font-geist-sans), sans-serif', color: '#0E1116' }}>{row.estado}</span>
                <span style={{ font: '400 12.5px var(--font-geist-sans), sans-serif', color: '#5B6472' }}>{row.cuando}</span>
                <span style={{ font: '400 12.5px/1.5 var(--font-geist-sans), sans-serif', color: '#3D4551' }}>{row.regla}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #EEF0F3', borderRadius: 6, padding: '12px 16px', marginBottom: 16 }}>
            <div style={{ font: '600 12px var(--font-geist-mono), monospace', color: '#55677F', marginBottom: 4 }}>REGLA UNIVERSAL</div>
            <p style={{ margin: 0, font: '400 13px var(--font-geist-sans), sans-serif', color: '#3D4551' }}>
              Los 6 estados del sistema <strong>nunca ocultan el rail ni el encabezado</strong>. El shell siempre está presente.
            </p>
          </div>

          <SubH>Importaciones</SubH>
          <CodeBlock code={`import { Cargando } from '@/components/shell/estados/cargando'
import { Vacio } from '@/components/shell/estados/vacio'
import { SinAcceso } from '@/components/shell/estados/sin-acceso'
import { ErrorPanel } from '@/components/shell/estados/error-panel'
import { SesionExpirada } from '@/components/shell/estados/sesion-expirada'
import { SinConexion } from '@/components/shell/estados/sin-conexion'`} />
        </section>

        {/* ═══ REPORTES — FORMATOS FIJOS ═══ */}
        <section id="rep-fijos" style={{ marginBottom: 64 }}>
          <SectionH2>Reportes — Formatos fijos F1–F6</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            Un reporte nuevo elige uno de estos seis formatos. No se inventa un séptimo.
          </p>

          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 160px 1fr', background: '#FAFBFC', borderBottom: '1px solid #EEF0F3', padding: '8px 16px', gap: 16 }}>
              {['', 'NOMBRE', 'DESCRIPCIÓN'].map(h => (
                <span key={h} style={{ font: '600 11px var(--font-geist-mono), monospace', color: '#55677F', letterSpacing: '.05em' }}>{h}</span>
              ))}
            </div>
            {[
              { id: 'F1', nombre: 'Estado jerárquico', desc: 'Cuentas que suman a un total (estado de resultados, P&L).' },
              { id: 'F2', nombre: 'Padrón operativo', desc: 'Registros con columnas de estado (inventario, padrón de colaboradores).' },
              { id: 'F3', nombre: 'Evolución mensual', desc: '12 meses real vs objetivo. Una línea por métrica.' },
              { id: 'F4', nombre: 'Comparativo', desc: 'Entidades en columnas, métricas en filas. Máximo 8 entidades.' },
              { id: 'F5', nombre: 'Conciliación', desc: 'Dos fuentes alineadas, diferencias resaltadas.' },
              { id: 'F6', nombre: 'Desempeño de área', desc: 'Tarjetas de indicador + desglose por puesto.' },
            ].map((row, i) => (
              <div key={row.id} style={{
                display: 'grid', gridTemplateColumns: '40px 160px 1fr', padding: '12px 16px', gap: 16,
                borderBottom: i < 5 ? '1px solid #F4F5F7' : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFBFC', alignItems: 'start',
              }}>
                <code style={{ font: '700 13px var(--font-geist-mono), monospace', color: '#00244D' }}>{row.id}</code>
                <span style={{ font: '600 12.5px var(--font-geist-sans), sans-serif', color: '#0E1116' }}>{row.nombre}</span>
                <span style={{ font: '400 12.5px/1.5 var(--font-geist-sans), sans-serif', color: '#5B6472' }}>{row.desc}</span>
              </div>
            ))}
          </div>

          <SubH>Importación y uso con MarcoReporte</SubH>
          <CodeBlock code={`import { MarcoReporte } from '@/components/nucleo-adc/reportes/marco-reporte'
import { FormatoF1 } from '@/components/nucleo-adc/reportes/formato-f1'

<MarcoReporte
  entidad="MG CELAYA"
  periodo="AGOSTO 2026"
  titulo="Estado de resultados"
  fuente="DWH · vw_EstadoResultados"
  corte="27 AGO 04:12"
  filtros={[{ etiqueta: 'Agosto 2026', porDefecto: true }]}
  onExcel={handleExcel}
  onPdf={handlePdf}
  onProgramar={handleProgramar}
>
  <FormatoF1 conceptos={conceptos} />
</MarcoReporte>`} />

          <SubH>Props de MarcoReporte</SubH>
          <PropsTable rows={[
            { nombre: 'entidad', tipo: 'string', descripcion: "Entidad del reporte. Ej. 'MG CELAYA'." },
            { nombre: 'periodo', tipo: 'string', descripcion: "Periodo del reporte. Ej. 'AGOSTO 2026'." },
            { nombre: 'titulo', tipo: 'string', descripcion: 'Título del reporte.' },
            { nombre: 'descripcion', tipo: 'string', descripcion: 'Descripción breve opcional.' },
            { nombre: 'filtros', tipo: 'FiltroReporte[]', descripcion: 'Chips de filtro aplicados {etiqueta, porDefecto, onQuitar}.' },
            { nombre: 'fuente', tipo: 'string', descripcion: 'Linaje de datos. Ej. "DWH · vw_EstadoResultados".' },
            { nombre: 'corte', tipo: 'string', descripcion: 'Fecha y hora del último corte.' },
            { nombre: 'unidad', tipo: 'string', descripcion: "Unidad de medida. Ej. 'CIFRAS EN MXN SIN IVA'." },
            { nombre: 'generadoPor', tipo: 'string', descripcion: 'Nombre del generador.' },
            { nombre: 'generadoEn', tipo: 'string', descripcion: 'Timestamp de generación.' },
            { nombre: 'onExcel', tipo: '() => void', descripcion: 'Descargar Excel.' },
            { nombre: 'onPdf', tipo: '() => void', descripcion: 'Descargar PDF.' },
            { nombre: 'onProgramar', tipo: '() => void', descripcion: 'Programar envío.' },
            { nombre: 'children', tipo: 'ReactNode', descripcion: 'El formato (FormatoF1…FormatoF6).' },
          ]} />
        </section>

        {/* ═══ REPORTES — PLANTILLAS IA ═══ */}
        <section id="rep-ia" style={{ marginBottom: 64 }}>
          <SectionH2>Reportes — Plantillas IA A/B/C</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            El MCP de Núcleo AI genera reportes en uno de estos tres tipos. Si la respuesta no encaja en ninguno, no se dibuja: se pregunta.
          </p>

          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 160px 1fr', background: '#FAFBFC', borderBottom: '1px solid #EEF0F3', padding: '8px 16px', gap: 16 }}>
              {['TIPO', 'NOMBRE', 'CUÁNDO USAR'].map(h => (
                <span key={h} style={{ font: '600 11px var(--font-geist-mono), monospace', color: '#55677F', letterSpacing: '.05em' }}>{h}</span>
              ))}
            </div>
            {[
              { tipo: 'A', nombre: 'Respuesta directa', cuando: 'El resultado es una cifra o una frase corta.' },
              { tipo: 'B', nombre: 'Listado', cuando: 'Filas comparables. Máx. 20 filas, máx. 6 columnas.' },
              { tipo: 'C', nombre: 'Análisis', cuando: 'Serie temporal o comparación con gráfica.' },
            ].map((row, i) => (
              <div key={row.tipo} style={{
                display: 'grid', gridTemplateColumns: '60px 160px 1fr', padding: '12px 16px', gap: 16,
                borderBottom: i < 2 ? '1px solid #F4F5F7' : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFBFC', alignItems: 'start',
              }}>
                <code style={{ font: '700 14px var(--font-geist-mono), monospace', color: '#2F6BFF' }}>{row.tipo}</code>
                <span style={{ font: '600 12.5px var(--font-geist-sans), sans-serif', color: '#0E1116' }}>{row.nombre}</span>
                <span style={{ font: '400 12.5px/1.5 var(--font-geist-sans), sans-serif', color: '#5B6472' }}>{row.cuando}</span>
              </div>
            ))}
          </div>

          <SubH>Contrato del objeto MCP</SubH>
          <CodeBlock code={`interface ReporteGenerado {
  plantilla: 'A' | 'B' | 'C'
  respuesta: string          // frase que contesta la pregunta
  alcance: {
    entidad: string
    periodo: string
    corte?: string
    filtros?: string[]
  }
  cuerpo: ReactNode          // RespuestaDirecta | ListadoGenerado | AnalisisGenerado
  comoSeObtuvo?: string      // plegado, siempre presente
  fuentes?: string[]
  acciones?: AccionGenerada[]  // máx 3
}`} />

          <SubH>Importaciones</SubH>
          <CodeBlock code={`import { MarcoGenerado } from '@/components/nucleo-adc/reportes-gen/marco-generado'
import { RespuestaDirecta } from '@/components/nucleo-adc/reportes-gen/respuesta-directa'
import { ListadoGenerado } from '@/components/nucleo-adc/reportes-gen/listado-generado'
import { AnalisisGenerado } from '@/components/nucleo-adc/reportes-gen/analisis-generado'
import type { AccionGenerada, AlcanceGenerado } from '@/components/nucleo-adc/reportes-gen/marco-generado'`} />

          <SubH>Ejemplo (Tipo A)</SubH>
          <CodeBlock code={`<MarcoGenerado
  respuesta="Las ventas de agosto suman 185 unidades, 16.9% por debajo del objetivo de 222."
  alcance={{ entidad: 'MG CELAYA', periodo: 'AGOSTO 2026', corte: '25' }}
  cuerpo={<RespuestaDirecta cifra="185" unidad="unidades" />}
  comoSeObtuvo="Se consultó vw_Ventas filtrando por sucursal MG-CEL y periodo 2026-08."
  fuentes={['DWH · vw_Ventas']}
  acciones={[
    { texto: 'Ver desglose por asesor', esPrimaria: true, onClick: () => {} },
    { texto: 'Descargar CSV', onClick: () => {} },
  ]}
/>`} />
        </section>

        {/* ═══ REGLAS ═══ */}
        <section id="reglas" style={{ marginBottom: 64 }}>
          <SectionH2>Reglas del Design System</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 24 }}>
            13 reglas no negociables. Toda excepción requiere revisión del DS antes de proceder.
          </p>

          <ReglaCard
            num="01"
            titulo="Color estructural"
            texto="Navy (#00244D) es estructura: rail, encabezado, tarjeta destacada. Máximo 1 elemento navy por zona visual y 2 tarjetas navy por fila."
          />
          <ReglaCard
            num="02"
            titulo="Color de acción"
            texto="Azul (#2F6BFF) es acción: botón primario, foco, enlace. Una sola vez por pantalla. No decorativo. No en múltiples controles simultáneos."
          />
          <ReglaCard
            num="03"
            titulo="Color de estado"
            texto="Verde/ámbar/rojo son estado calculado, nunca asignado a mano. Lo gobierna direccionDeseable del catálogo, no el signo aritmético. Nunca hardcodear ▲ = verde."
          />
          <ReglaCard
            num="04"
            titulo="Sin color decorativo"
            texto="Si un color no cumple función (estructura / acción / estado), no va. Navy estructura, azul acción, verde/ámbar/rojo solo desviación."
          />
          <ReglaCard
            num="05"
            titulo="División tipográfica absoluta"
            texto="Geist para todo texto: títulos, cuerpo, etiquetas, UI. Geist Mono para todo dato: números, importes, porcentajes, fechas, folios, claves. Sin excepciones. tabular-nums en todo Mono."
          />
          <ReglaCard
            num="06"
            titulo="Tamaño mínimo"
            texto="11 px solo rótulos mono. Cuerpo mínimo 11.5 px. Nunca bajar de ahí en ningún elemento de texto."
          />
          <ReglaCard
            num="07"
            titulo="Espaciado en cuadrícula de 4 px"
            texto="Todo múltiplo de 4 px. Ningún valor fuera de la cuadrícula: ni 3, ni 5, ni 10, ni 18. Excepción: gap 9 px en íconos del rail (definido en el DS)."
          />
          <ReglaCard
            num="08"
            titulo="Mapa de radios fijo"
            texto="5 px botones/controles · 6 px tarjetas/superficies · 7 px cápsulas del rail. No inventar intermedios. Si el elemento no aparece en design.md §6, usar 6 px."
          />
          <ReglaCard
            num="09"
            titulo="Sombra solo en lo que flota"
            texto="Menús abiertos, paleta ⌘K, Núcleo AI, menú de usuario, panel de sesión caducada. Tarjetas y paneles en reposo: borde, nunca sombra."
          />
          <ReglaCard
            num="10"
            titulo="Un primario por pantalla"
            texto="Un solo botón navy por pantalla. El resto: contorno (border: 1px solid #D8DCE2) o ghost (color: #2F6BFF, sin fondo). Rojo relleno solo dentro del modal destructivo."
          />
          <ReglaCard
            num="11"
            titulo="Shell inamovible"
            texto="Rail 56 px nunca desaparece. Encabezado 52 px siempre fijo. Los 6 estados del sistema nunca ocultan el shell. La página no hace scroll: lo hace la mesa."
          />
          <ReglaCard
            num="12"
            titulo="Sin modal para trabajar"
            texto="Modales solo confirman destrucción. Formularios de trabajo: en página o PanelLateral. Nunca modal para crear, editar o ver detalle."
          />
          <ReglaCard
            num="13"
            titulo="Copy con número enfrente"
            texto="Siempre el número primero: '2 solicitudes vencen hoy', no 'Tienes pendientes'. La AI no promete: explica y ofrece máx. 3 acciones ejecutables."
          />
        </section>


        {/* ── AGENTS.MD ──────────────────────────────────────────────────── */}

        <section id="agents-contexto" style={{ marginBottom: 64 }}>
          <SectionH2>AGENTS.MD — Contexto del proyecto</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 20 }}>
            Este es el contenido de <code style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12.5, background: '#F4F5F7', padding: '1px 5px', borderRadius: 3 }}>AGENTS.md</code> en la raíz del proyecto — el contexto que Claude Code, Cursor u otro AI debe leer antes de construir cualquier cosa aquí.
          </p>

          <SubH>Qué es este proyecto</SubH>
          <p style={{ font: '400 13px/1.7 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 16 }}>
            <strong style={{ color: '#0E1116' }}>Núcleo ADC</strong> es el sistema de gestión e indicadores del grupo automotriz ADC Traxión. Es una aplicación Next.js 16 (App Router) con React 19 que agrupa múltiples apps bajo un shell compartido.
          </p>

          <SubH>Stack</SubH>
          <div style={{ background: '#FAFBFC', border: '1px solid #EEF0F3', borderRadius: 6, padding: '12px 16px', marginBottom: 20 }}>
            {[
              'Next.js 16 (App Router) · React 19',
              'Tailwind CSS 4 — solo para reset y variables globales; los componentes usan inline styles',
              'Fuentes: Geist (sans) + Geist Mono — cargadas en app/layout.tsx',
              'Íconos: lucide-react',
              'Tema: next-themes (light/dark)',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '4px 0', font: '400 13px/1.5 var(--font-geist-sans), sans-serif', color: '#5B6472' }}>
                <span style={{ color: '#2F6BFF', flexShrink: 0 }}>·</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <SubH>Apps actuales</SubH>
          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 20 }}>
            {[
              ['/', 'Hub (T1)', 'feed del día, cinta de indicadores'],
              ['/indicadores', 'Tablero (T2/T3)', 'indicadores del puesto'],
              ['/indicadores/tablero-puesto', 'Tablero de puesto (T2)', '6 indicadores, ritmo, composición'],
              ['/formularios', 'Demo formularios', '11 controles · 8 estados'],
              ['/reportes', 'Demo reportes fijos', '6 formatos F1–F6'],
              ['/reportes/generados', 'Demo reportes IA', '3 plantillas A/B/C'],
              ['/pantallas', 'Catálogo de pantallas', 'Los 11 tipos T1–T11'],
              ['/docs', 'Referencia técnica', 'Para ingenieros'],
            ].map(([ruta, nombre, desc], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 180px 1fr', padding: '9px 16px', background: i % 2 === 0 ? '#FFF' : '#FAFBFC', borderBottom: i < 7 ? '1px solid #F4F5F7' : 'none', gap: 16, alignItems: 'center' }}>
                <code style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, color: '#2F6BFF', fontVariantNumeric: 'tabular-nums' }}>{ruta}</code>
                <span style={{ font: '500 12.5px var(--font-geist-sans), sans-serif', color: '#0E1116' }}>{nombre}</span>
                <span style={{ font: '400 12px var(--font-geist-sans), sans-serif', color: '#5B6472' }}>{desc}</span>
              </div>
            ))}
          </div>

          <SubH>Estructura de archivos</SubH>
          <CodeBlock code={`app/
  layout.tsx                        ← Geist fonts, providers, globals
  page.tsx                          ← Hub (T1)
  indicadores/
    page.tsx                        ← Tablero (T2/T3)
    tablero-puesto/page.tsx         ← Tablero de puesto (T2)
  formularios/page.tsx
  reportes/
    page.tsx
    generados/page.tsx
  pantallas/page.tsx
  docs/page.tsx

components/
  shell/
    shell.tsx                       ← Orquestador principal
    rail.tsx                        ← 56px, navy, nunca desaparece
    header.tsx                      ← 52px, fijo
    menu.tsx                        ← 296px, flota
    nucleo-panel.tsx                ← 340px, Núcleo AI
    busqueda-k.tsx                  ← Paleta ⌘K
    types.ts                        ← App, MenuGrupo, MenuItem
    estados/
      cargando.tsx · vacio.tsx · sin-acceso.tsx
      error-panel.tsx · sesion-expirada.tsx · sin-conexion.tsx

  nucleo-adc/
    ui/
      campo.tsx · campo-cifra.tsx · combobox.tsx
      radio-tarjeta.tsx · campo-archivo.tsx · campo-rejilla.tsx
      pillora-filtro.tsx · selector-periodo.tsx
    indicadores/
      tarjeta.tsx · types.ts · utils.ts
    tablero/
      uso1.tsx · uso2.tsx · uso4.tsx
    formularios/
      panel-lateral.tsx · dialogo-confirmacion.tsx
    reportes/
      marco-reporte.tsx · filtro-columna.tsx
      formato-f1.tsx … formato-f6.tsx
    reportes-gen/
      marco-generado.tsx · respuesta-directa.tsx
      listado-generado.tsx · analisis-generado.tsx
    hub/
      cinta-indicadores.tsx · feed-atencion.tsx
    panel-detalle/
      panel-detalle.tsx · bloque-*.tsx

public/
  assets/   ← Logos SVG/PNG
  fotos/    ← Imágenes de vehículos`} />
        </section>

        <section id="agents-componentes" style={{ marginBottom: 64 }}>
          <SectionH2>AGENTS.MD — Cómo usar componentes</SectionH2>

          <SubH>Shell</SubH>
          <p style={{ font: '400 13px/1.7 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 12 }}>
            Toda pantalla de app lleva Shell. La única excepción es <code style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, background: '#F4F5F7', padding: '1px 4px', borderRadius: 3 }}>/docs</code> (standalone).
          </p>
          <CodeBlock code={`'use client'
import { useRouter } from 'next/navigation'
import { LayoutGrid, BarChart, Settings } from 'lucide-react'
import { Shell } from '@/components/shell'
import type { App, MenuGrupo } from '@/components/shell'

const APPS: App[] = [
  { id: 'hub', nombre: 'Hub', Icono: LayoutGrid },
  { id: 'indicadores', nombre: 'Indicadores', Icono: BarChart },
  { id: 'configuracion', nombre: 'Configuración', Icono: Settings },
]

const GRUPOS: MenuGrupo[] = [
  { items: [{ id: 'puesto', etiqueta: 'Mi puesto' }] },
  { rotulo: 'FILTROS', items: [{ id: 'meta', etiqueta: 'META' }] },
]

export default function MiPantalla() {
  const router = useRouter()
  return (
    <Shell
      apps={APPS}
      appActiva="indicadores"
      nombreApp="Indicadores"
      periodo="Ago 2026"
      grupos={GRUPOS}
      itemActivo="puesto"
      onAppChange={(id) => { if (id === 'hub') router.push('/') }}
      onItemChange={(id) => console.log(id)}
    >
      {/* contenido de la mesa */}
    </Shell>
  )
}`} />

          <SubH>Tipos del Shell</SubH>
          <CodeBlock code={`interface App {
  id: string
  nombre: string
  Icono: LucideIcon
  badge?: number
  urgente?: boolean
}

interface MenuItem {
  id: string
  etiqueta: string
  href?: string
  badge?: number
  subitems?: MenuItem[]
}

interface MenuGrupo {
  rotulo?: string
  items: MenuItem[]
}`} />

          <SubH>Campo (texto corto)</SubH>
          <p style={{ font: '400 13px/1.5 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 8 }}>
            <strong style={{ color: '#0E1116' }}>EstadoCampo:</strong> <code style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12 }}>&apos;reposo&apos; | &apos;foco&apos; | &apos;con-valor&apos; | &apos;deshabilitado&apos; | &apos;invalido&apos; | &apos;advertencia&apos; | &apos;guardando&apos; | &apos;guardado&apos;</code>
          </p>
          <CodeBlock code={`import { Campo } from '@/components/nucleo-adc/ui/campo'
import type { EstadoCampo } from '@/components/nucleo-adc/ui/campo'

<Campo
  etiqueta="Nombre del cliente"
  requerido
  placeholder="Ej. Juan Pérez"
  ayuda="Máx. 80 caracteres"
  maxLength={80}
  valor={nombre}
  onChange={setNombre}
  error={error ? 'Ingresa solo letras y espacios · mín. 2 caracteres' : undefined}
/>`} />

          <SubH>CampoCifra</SubH>
          <CodeBlock code={`import { CampoCifra } from '@/components/nucleo-adc/ui/campo-cifra'

// Input numérico Geist Mono, alineado derecha, tabular-nums
// prefijo/sufijo dentro del control
<CampoCifra etiqueta="Monto" prefijo="$" valor={monto} onChange={setMonto} />`} />

          <SubH>Combobox</SubH>
          <CodeBlock code={`import { Combobox } from '@/components/nucleo-adc/ui/combobox'
import type { OpcionCombobox } from '@/components/nucleo-adc/ui/combobox'

// Para listas largas (12+ ítems). Muestra clave en Geist Mono.
// OpcionCombobox: { clave: string; etiqueta: string; grupo?: string }
<Combobox
  etiqueta="Sucursal"
  opciones={sucursales}
  valor={sucursalClave}
  onSeleccionar={(clave, etiqueta) => setSucursal(clave)}
/>`} />

          <SubH>RadioTarjeta</SubH>
          <CodeBlock code={`import { RadioTarjeta } from '@/components/nucleo-adc/ui/radio-tarjeta'

// Una de pocas opciones con explicación. Cambia el significado del registro.
// OpcionRadio: { valor: string; titulo: string; descripcion?: string }
<RadioTarjeta
  etiqueta="Tipo de operación"
  opciones={[
    { valor: 'directa', titulo: 'Venta directa', descripcion: 'El cliente paga de contado' },
    { valor: 'credito', titulo: 'Crédito', descripcion: 'Financiamiento aprobado por el banco' },
  ]}
  valor={tipo}
  onCambiar={setTipo}
/>`} />

          <SubH>TarjetaIndicador</SubH>
          <div style={{ background: '#FDE8E7', borderLeft: '3px solid #C2352B', borderRadius: 6, padding: '12px 16px', marginBottom: 16 }}>
            <p style={{ font: '600 12.5px/1 var(--font-geist-sans), sans-serif', color: '#C2352B', margin: '0 0 8px' }}>Reglas críticas</p>
            {[
              'avanceObjetivo llega como decimal (0.831) — multiplicar ×100 antes de mostrar',
              'objetivo === null → sin barra, sin porcentaje, sin diagonal. Nunca mostrar 0% ni 100%',
              'estatusCalculo === "SIN_OPERACION" → mostrar —, nunca barra roja',
              'La alarma NO pinta la tarjeta de rojo: solo punto + border-left 3px + franja 34px al pie',
              'El color lo decide direccionDeseable del catálogo, no el signo del número',
            ].map((r, i) => (
              <p key={i} style={{ font: '400 12px/1.6 var(--font-geist-sans), sans-serif', color: '#C2352B', margin: '0 0 4px' }}>· {r}</p>
            ))}
          </div>
          <CodeBlock code={`import { TarjetaIndicador } from '@/components/nucleo-adc/indicadores/tarjeta'
import type { Indicador, Alarma } from '@/components/nucleo-adc/indicadores/types'

// 214×132 px · padding 11px 15px · border-radius 6px
<TarjetaIndicador
  indicador={indicador}
  tono="normal"          // 'normal' | 'destacado' (fondo navy)
  alarma={alarma}        // opcional
  onDetalle={() => setPanelAbierto(indicador.claveIndicador)}
/>`} />

          <SubH>MarcoReporte + Formatos F1–F6</SubH>
          <CodeBlock code={`import { MarcoReporte } from '@/components/nucleo-adc/reportes/marco-reporte'
import { FormatoF1 } from '@/components/nucleo-adc/reportes/formato-f1'
// Disponibles: formato-f1 … formato-f6

// Un reporte nuevo elige uno de los seis. No se inventa un séptimo.
<MarcoReporte
  entidad="MG CELAYA"
  periodo="AGOSTO 2026"
  titulo="Estado de resultados"
  fuente="DWH · vw_EstadoResultados"
  corte="27 AGO 04:12"
  unidad="CIFRAS EN MXN SIN IVA"
  filtros={[
    { etiqueta: 'Agosto 2026', porDefecto: true },
    { etiqueta: 'Solo cuentas con movimiento', porDefecto: false, onQuitar: () => {} },
  ]}
>
  <FormatoF1 conceptos={conceptos} />
</MarcoReporte>`} />

          <SubH>MarcoGenerado + Tipos A/B/C</SubH>
          <CodeBlock code={`import { MarcoGenerado } from '@/components/nucleo-adc/reportes-gen/marco-generado'
import { RespuestaDirecta } from '@/components/nucleo-adc/reportes-gen/respuesta-directa'
import { ListadoGenerado } from '@/components/nucleo-adc/reportes-gen/listado-generado'
import { AnalisisGenerado } from '@/components/nucleo-adc/reportes-gen/analisis-generado'

// Tipo A → cifra · Tipo B → lista (máx 20 filas, 6 col) · Tipo C → serie
// Si no encaja: no se dibuja, se pregunta al usuario.

<MarcoGenerado
  respuesta="MG Celaya lleva 185 unidades al 27 de agosto."
  alcance={{ entidad: 'MG CELAYA', periodo: 'Ago 2026 · al 27', corte: '27 AGO 04:12' }}
  cuerpo={<RespuestaDirecta ... />}
  comoSeObtuvo="Se contaron las unidades con EstatusVenta IN ('VENDIDA','ENTREGADA')..."
  fuentes={['fact.Ventas_Unidades', 'dim.Sucursal']}
  acciones={[
    { texto: 'Exportar a Excel', esPrimaria: true },
    { texto: 'Abrir en Ventas' },
    { texto: 'Guardar pregunta' },
  ]}
/>`} />
        </section>

        <section id="agents-pantallas" style={{ marginBottom: 64 }}>
          <SectionH2>AGENTS.MD — Los 11 tipos de pantalla</SectionH2>
          <p style={{ font: '400 13px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 20 }}>
            <strong style={{ color: '#0E1116' }}>Regla de elección:</strong> La frase del usuario decide el tipo, no el módulo. Si no encaja en ninguno de los 11, la conversación es sobre el tipo faltante, no sobre inventar uno nuevo.
          </p>
          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 200px 1fr 140px', background: '#FAFBFC', borderBottom: '1px solid #EEF0F3', padding: '8px 16px', gap: 16 }}>
              {['Código', 'Nombre', 'Pregunta del usuario', 'Cuándo'].map(h => (
                <span key={h} style={{ font: '600 11px var(--font-geist-mono), monospace', color: '#55677F', letterSpacing: '.05em' }}>{h.toUpperCase()}</span>
              ))}
            </div>
            {[
              ['T1', 'Hub del núcleo', '¿Qué me espera hoy?', '1 por usuario'],
              ['T2', 'Tablero de puesto', '¿Cómo voy yo este mes?', 'Inicio de cada app'],
              ['T3', 'Tablero de área o sucursal', '¿Cómo va mi gente?', 'Para quien dirige'],
              ['T4', 'Listado de trabajo', 'Encuéntrame el caso.', 'La más frecuente'],
              ['T5', 'Expediente', 'Todo sobre este caso.', 'Detalle de registro'],
              ['T6', 'Captura', 'Necesito registrar algo.', 'Una sola pantalla'],
              ['T7', 'Flujo por pasos', 'Un trámite largo.', 'Solo si hay dependencia'],
              ['T8', 'Bandeja de autorizaciones', 'Autorizo o no.', 'Decidir en serie'],
              ['T9', 'Reporte fijo', 'El reporte de siempre.', 'Seis formatos'],
              ['T10', 'Núcleo a pantalla completa', 'Déjame preguntar.', 'Cuando se investiga'],
              ['T11', 'Configuración', 'Cambiar cómo funciona.', 'Catálogos y roles'],
            ].map(([codigo, nombre, pregunta, cuando], i) => (
              <div key={codigo} style={{ display: 'grid', gridTemplateColumns: '60px 200px 1fr 140px', padding: '9px 16px', background: i % 2 === 0 ? '#FFF' : '#FAFBFC', borderBottom: i < 10 ? '1px solid #F4F5F7' : 'none', gap: 16, alignItems: 'center' }}>
                <code style={{ font: '700 13px var(--font-geist-mono), monospace', color: '#2F6BFF', fontVariantNumeric: 'tabular-nums' }}>{codigo}</code>
                <span style={{ font: '500 12.5px var(--font-geist-sans), sans-serif', color: '#0E1116' }}>{nombre}</span>
                <span style={{ font: '400 12px/1.4 var(--font-geist-sans), sans-serif', color: '#5B6472', fontStyle: 'italic' }}>{pregunta}</span>
                <span style={{ font: '400 12px var(--font-geist-mono), monospace', color: '#98A0AC', fontVariantNumeric: 'tabular-nums' }}>{cuando}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="agents-reglas" style={{ marginBottom: 64 }}>
          <SectionH2>AGENTS.MD — Las 13 reglas (texto exacto)</SectionH2>
          <p style={{ font: '400 13px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 24 }}>
            Estas reglas vienen de <code style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, background: '#F4F5F7', padding: '1px 4px', borderRadius: 3 }}>CLAUDE.md</code>. Son no negociables. Toda excepción requiere revisión del DS.
          </p>
          {[
            ['1. Color estructural', 'Navy #00244D es estructura: rail, encabezado, tarjeta destacada. Máx. 1 elemento navy por zona visual y 2 tarjetas navy por fila. Azul #2F6BFF es acción: botón primario, foco, enlace — una sola vez por pantalla. Verde/ámbar/rojo son estado calculado, nunca asignado a mano: lo gobierna direccionDeseable del catálogo. Cian #3ED0EA solo dentro del gradiente del símbolo.'],
            ['2. Sin color decorativo', 'Si un color no cumple función (estructura / acción / estado), no va.'],
            ['3. División tipográfica absoluta', 'Geist para todo texto: títulos, cuerpo, etiquetas, UI. Geist Mono para todo dato: números, importes, porcentajes, fechas, folios, claves. font-variant-numeric: tabular-nums en todo Mono sin excepción.'],
            ['4. Tamaño mínimo', '11 px solo rótulos mono. Cuerpo mínimo 11.5 px. Nunca bajar de ahí.'],
            ['5. Espaciado en cuadrícula de 4 px', 'Todo múltiplo de 4 px. Ni 3, ni 5, ni 10, ni 18. Excepción: gap 9 px en íconos del rail (definido en el DS).'],
            ['6. Mapa de radios fijo', '5 px → botones, campos, filtros, controles. 6 px → tarjetas, paneles, superficies. 7 px → cápsulas de app en el rail. No inventar intermedios.'],
            ['7. Sombra solo en lo que flota', 'Menús abiertos, Núcleo AI, paleta ⌘K, menú de usuario, panel de sesión caducada. Tarjetas y paneles en reposo: borde, nunca sombra.'],
            ['8. Un primario por pantalla', 'Un solo botón navy por pantalla. El resto: contorno (border: 1px solid #D8DCE2) o ghost (color: #2F6BFF, sin fondo). El anillo de foco nunca se quita.'],
            ['9. Shell inamovible', 'Rail 56 px nunca desaparece. Encabezado 52 px siempre fijo. Los 6 estados del sistema nunca ocultan el shell. La página no hace scroll: lo hace la mesa.'],
            ['10. Reglas de la tarjeta indicador', 'Dimensiones Form E: 214×132 px. Sin objetivo (null) → sin barra, sin porcentaje. EstatusCalculo = SIN_OPERACION → mostrar —. La alarma no pinta la tarjeta de rojo. avanceObjetivo llega como decimal (0.831) — multiplicar ×100.'],
            ['11. Gráficas por clase', 'DESEMPEÑO → líneas acumulativas. CONTROL → banda con dispersión. REFERENCIA → barras paralelas (nunca verde/rojo). PERCEPCIÓN → barras apiladas (n siempre visible). SPLM y SPLY se cortan al mismo día del mes.'],
            ['12. Sin modal para trabajar', 'Modales solo confirman destrucción. Formularios de trabajo: en página o PanelLateral. Errores de validación: en el campo, nunca en toast.'],
            ['13. Copy con número enfrente', 'Siempre el número primero: "2 solicitudes vencen hoy", no "Tienes pendientes". La AI no promete: explica y ofrece máx. 3 acciones ejecutables. Sin fuente, no se publica.'],
          ].map(([titulo, texto], i) => (
            <ReglaCard key={i} num={String(i + 1).padStart(2, '0')} titulo={titulo} texto={texto} />
          ))}
        </section>

        <section id="agents-patrones" style={{ marginBottom: 64 }}>
          <SectionH2>AGENTS.MD — Patrones de composición</SectionH2>

          {[
            ['T1 Hub', `Shell
  └─ CintaIndicadores    (scroll horizontal, ≤8 tarjetas)
  └─ FeedAtención        (pendientes de todas las apps)

// Nunca datos de una sola app. El rail navega y lleva el contador por app.`],
            ['T2 Tablero de puesto', `Shell
  └─ grid 6 columnas → 6× TarjetaIndicador (en orden del proceso)
  └─ GraficoRitmo        (31 barras, línea diagonal SVG)
  └─ PanelComposicion    (qué mueve mi X%)
  └─ Strip Núcleo 44px derecha

// Con 7 o más indicadores, la cinta pasa a lista (Uso2).`],
            ['T4 Listado de trabajo', `Shell
  └─ Header: búsqueda + filtros activos + resumen "N filas"
  └─ Tabla con FiltroColumna en cada encabezado
  └─ Pie: sumas de lo filtrado

// La fila abre el expediente (T5). Estatus en píldora.`],
            ['T6 Captura', `Shell
  └─ h1 + descripción
  └─ grid 2 columnas max
  └─ Campos (Campo, CampoCifra, Combobox, RadioTarjeta, etc.)
  └─ Barra de acción fija al pie (borrador auto + Guardar)

// Nunca en modal. Si hay dependencia entre pasos → T7.`],
            ['T9 Reporte fijo', `Shell
  └─ MarcoReporte (cabeza + filtros chips + acciones + pie linaje)
     └─ FormatoF1 | FormatoF2 | FormatoF3 | FormatoF4 | FormatoF5 | FormatoF6

// Un reporte nuevo elige uno de estos seis. No se inventa un séptimo.`],
          ].map(([tipo, codigo], i) => (
            <div key={i} style={{ marginBottom: 28 }}>
              <p style={{ font: '600 13.5px/1 var(--font-geist-sans), sans-serif', color: '#0E1116', margin: '0 0 8px' }}>{tipo}</p>
              <CodeBlock code={codigo} />
            </div>
          ))}
        </section>

        <section id="agents-prohibido" style={{ marginBottom: 64 }}>
          <SectionH2>AGENTS.MD — Lo que está prohibido</SectionH2>
          <p style={{ font: '400 13px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 20 }}>
            19 restricciones explícitas. Estas no tienen excepciones sin revisión del DS.
          </p>
          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden' }}>
            {[
              ['Colores decorativos o de marca aplicados a datos', 'Navy, azul, cian: solo en sus roles estructurales y de acción.'],
              ['Hardcodear ▲ = verde', 'El color lo decide direccionDeseable del catálogo, no el signo del número.'],
              ['Spinner genérico como estado de carga', 'Usar esqueleto con la forma real de la pantalla. Sin animación de pulso.'],
              ['Modal para flujos de trabajo', 'Modales solo confirman destrucción (dialogo-confirmacion.tsx).'],
              ['Más de un botón primario navy por pantalla', 'El resto son contorno o ghost.'],
              ['Rojo relleno fuera del modal destructivo', 'En la mesa: solo contorno rojo.'],
              ['Sombra en tarjetas o paneles en reposo', 'Solo en elementos flotantes sobre la mesa.'],
              ['Radios de borde inventados', 'Solo 5 px (controles), 6 px (tarjetas/paneles), 7 px (cápsulas del rail).'],
              ['Espaciado fuera de la cuadrícula de 4 px', 'Salvo gap 9 px del rail, definido en el DS.'],
              ['Texto de UI en inglés visible al usuario', 'Todo en español claro.'],
              ['Toast para errores de validación o credenciales', 'Error junto al campo, siempre.'],
              ['Tipos de pantalla que no sean T1–T11', 'Si no encaja, la conversación es sobre el tipo faltante.'],
              ['Un séptimo formato de reporte fijo', 'Máximo 6. Si el caso nuevo no encaja, revisar los formatos existentes.'],
              ['Mostrar 0% o ∞ cuando base es cero o nulo', 'Mostrar —.'],
              ['Variación > 300% como porcentaje', 'Escribir ×N.'],
              ['Comparar meses completos vs. días transcurridos', 'SPLM y SPLY se cortan al mismo día del mes.'],
              ['Publicar datos sin citar la fuente', 'Sin fuente, no se publica.'],
              ['Quitar el anillo de foco', 'box-shadow: 0 0 0 3px rgba(47,107,255,.14) siempre.'],
              ['Inventar un octavo estado del sistema', 'Solo los 6 en components/shell/estados/.'],
            ].map(([titulo, desc], i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '11px 16px', background: i % 2 === 0 ? '#FFF' : '#FAFBFC', borderBottom: i < 18 ? '1px solid #F4F5F7' : 'none', alignItems: 'flex-start' }}>
                <span style={{ font: '700 11.5px var(--font-geist-mono), monospace', color: '#C2352B', minWidth: 24, marginTop: 1, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>✕</span>
                <div>
                  <p style={{ font: '600 12.5px/1 var(--font-geist-sans), sans-serif', color: '#0E1116', margin: '0 0 3px' }}>{titulo}</p>
                  <p style={{ font: '400 12px/1.5 var(--font-geist-sans), sans-serif', color: '#5B6472', margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="agents-medidas" style={{ marginBottom: 64 }}>
          <SectionH2>AGENTS.MD — Medidas de referencia</SectionH2>
          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden' }}>
            {[
              ['Rail', '56 px ancho'],
              ['Encabezado', '52 px alto'],
              ['Menú de pantallas', '296 px ancho'],
              ['Panel Núcleo AI', '340 px ancho'],
              ['Panel de detalle indicador', '460 px ancho'],
              ['Panel lateral de formulario', '480 px ancho'],
              ['Tarjeta de indicador (Form E)', '214×132 px'],
              ['Cápsula de app en el rail', '34×34 px'],
              ['Franja de alarma', '34 px alto'],
              ['Control desktop', '32 px alto'],
              ['Control táctil (< 1,279 px)', '44 px alto'],
              ['Radio botones/campos', '5 px'],
              ['Radio tarjetas/paneles', '6 px'],
              ['Radio cápsulas rail', '7 px'],
              ['Espaciado', 'Múltiplos de 4 px'],
              ['Gap íconos rail', '9 px (excepción documentada)'],
            ].map(([elem, medida], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '240px 1fr', padding: '9px 16px', background: i % 2 === 0 ? '#FFF' : '#FAFBFC', borderBottom: i < 15 ? '1px solid #F4F5F7' : 'none', gap: 16 }}>
                <span style={{ font: '400 13px var(--font-geist-sans), sans-serif', color: '#5B6472' }}>{elem}</span>
                <code style={{ font: '600 13px var(--font-geist-mono), monospace', color: '#0E1116', fontVariantNumeric: 'tabular-nums' }}>{medida}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ── PLUGIN ─────────────────────────────────────────────────────── */}

        <section id="plugin-qa" style={{ marginBottom: 64 }}>
          <SectionH2>Plugin — /qa-diseno</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 20 }}>
            Auditoría completa de diseño en <strong>5 dimensiones</strong>: DS 13 reglas, Layout y zonas del Shell, Composición y jerarquía visual, Usabilidad, e Indicadores. Produce un reporte en español con severidad por hallazgo, fix exacto y veredicto PASS/FAIL.
          </p>

          <SubH>Uso</SubH>
          <CodeBlock code={`# Auditar una página
/qa-diseno app/indicadores/tablero-puesto/page.tsx

# Auditar un componente
/qa-diseno components/nucleo-adc/indicadores/tarjeta.tsx

# Auditar formularios
/qa-diseno app/formularios/page.tsx`} />

          <SubH>5 Dimensiones</SubH>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {[
              {
                num: '1',
                dim: 'DS — Las 13 Reglas',
                color: '#00244D',
                items: [
                  'Color estructural, acción y estado con valores hex exactos',
                  'División tipográfica Geist / Geist Mono absoluta',
                  'Espaciado solo múltiplos de 4px · radios del mapa fijo',
                  'Sombras solo flotantes · un primario por pantalla',
                  'Shell inamovible · sin modal de trabajo · copy con número',
                ],
              },
              {
                num: '2',
                dim: 'Layout y Zonas del Shell',
                color: '#1A3A5C',
                items: [
                  'Rail 56px navy · Header 52px fijo',
                  'Menú 296px · Panel AI 340px · Panel detalle 460px · Panel form 480px',
                  'Mesa hace scroll, no la página · header y filtros siempre visibles',
                  'Los 6 estados del sistema nunca ocultan rail ni header',
                  'Identificación del tipo de pantalla T1–T11 y verificación de su layout',
                ],
              },
              {
                num: '3',
                dim: 'Composición y Jerarquía Visual',
                color: '#2F4F6F',
                items: [
                  'Un punto focal claro por pantalla — una sola cosa más importante',
                  'Jerarquía tipográfica ≤3 niveles (título / subtítulo / cuerpo)',
                  'Alineación en grid — nada "a ojo"',
                  'Identidad visual nombrable — alguna decisión que un sistema genérico no tomaría',
                ],
              },
              {
                num: '4',
                dim: 'Usabilidad',
                color: '#3B6080',
                items: [
                  'Tufte data-ink: cada píxel no-dato que se puede quitar, se quita',
                  'Fitts: objetivos táctiles ≥44px · desktop ≥32px',
                  'Miller/Hick: ≤7 ítems por lista sin agrupar · ≤5 opciones por menú',
                  'Nielsen #4 consistencia: mismo patrón para la misma acción en toda la pantalla',
                  'Nielsen #1 feedback: cada acción tiene confirmación visible',
                  'Nielsen #5 prevención de errores: campos con validación inline, no toast',
                ],
              },
              {
                num: '5',
                dim: 'Indicadores',
                color: '#2F6BFF',
                items: [
                  'avanceObjetivo llega como decimal (0.831) — siempre ×100 antes de mostrar',
                  'Sin objetivo (null) → sin barra, sin porcentaje, sin diagonal. Nunca 0% ni 100%',
                  'EstatusCalculo = SIN_OPERACION → mostrar — o "sin operación". Nunca barra roja con 0%',
                  'La alarma no pinta tarjeta de rojo — solo punto + border-left 3px + franja 34px al pie',
                  'varSPLM / varSPLY = null → mostrar —. Variación >300% → ×N, no porcentaje',
                ],
              },
            ].map(({ num, dim, color, items }) => (
              <div key={num} style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ background: color, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <code style={{ font: '700 11px var(--font-geist-mono), monospace', color: 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums' }}>{num}</code>
                  <span style={{ font: '600 13px var(--font-geist-sans), sans-serif', color: '#FFF' }}>{dim}</span>
                </div>
                <div style={{ padding: '10px 16px 12px', background: '#FFF' }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '4px 0', borderBottom: i < items.length - 1 ? '1px solid #F4F5F7' : 'none' }}>
                      <span style={{ color: '#98A0AC', fontSize: 10, marginTop: 3, flexShrink: 0 }}>▸</span>
                      <span style={{ font: '400 12px/1.5 var(--font-geist-sans), sans-serif', color: '#5B6472' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <SubH>Output del reporte</SubH>
          <CodeBlock code={`# QA Diseño: app/indicadores/tablero-puesto/page.tsx
Fecha: 25 AGO 2026 · Dimensiones: DS · Layout · Composición · Usabilidad · Indicadores

## Assessment B — Detector
N/A (solo código fuente TSX disponible)

## Hallazgos
| Severidad | Dimensión    | Regla / Principio      | Problema                           | Línea | Fix                         |
|-----------|--------------|------------------------|------------------------------------|-------|-----------------------------|
| Crítico   | DS           | Regla 07 espaciado     | padding: 14px — no múltiplo 4      | 234   | Cambiar a 12px o 16px       |
| Crítico   | Layout       | Shell · Header 52px    | Header con height: 48px            | 12    | Cambiar a height: 52px      |
| Mayor     | DS           | Regla 10 un primario   | Dos botones navy simultáneos        | 312   | Uno contorno, uno primary   |
| Mayor     | Usabilidad   | Fitts objetivo táctil  | Botón 28px alto en vista móvil     | 401   | Mínimo 44px en < 1280px     |
| Menor     | Composición  | Jerarquía tipográfica  | 4 niveles de peso en un bloque     | 88    | Reducir a 3 niveles         |
| Menor     | DS           | Regla 13 copy          | "Tienes 3 pendientes"              | 98    | "3 pendientes sin resolver" |

## Cumplimiento DS (13 Reglas)
| Regla | Estado  |  Regla | Estado  |
|-------|---------|--------|---------|
| 01    | ✓ PASS  |  08    | ✓ PASS  |
| 02    | ✓ PASS  |  09    | ✓ PASS  |
| 03    | ✓ PASS  |  10    | ✗ FAIL  |
| 07    | ✗ FAIL  |  13    | ~ MENOR |

## Resumen
Críticos: 2 · Mayores: 2 · Menores: 2 · Reglas DS PASS: 11/13

Veredicto: FAIL — 4 issues bloqueantes`} />

          <div style={{ background: '#EEF2FB', border: '1px solid #C7D7F7', borderRadius: 6, padding: '12px 16px', marginTop: 8 }}>
            <p style={{ font: '600 12.5px var(--font-geist-sans), sans-serif', color: '#2F6BFF', margin: '0 0 4px' }}>Veredicto PASS requiere</p>
            <p style={{ font: '400 12px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', margin: 0 }}>0 hallazgos Críticos en cualquier dimensión · ≤3 hallazgos Mayores con fix claro asignado</p>
          </div>
        </section>

        <section id="plugin-comandos" style={{ marginBottom: 64 }}>
          <SectionH2>Plugin — Comandos</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 20 }}>
            5 comandos en <code style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, background: '#F4F5F7', padding: '1px 4px', borderRadius: 3 }}>.claude/commands/</code>. Se invocan con <code style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, background: '#F4F5F7', padding: '1px 4px', borderRadius: 3 }}>/nombre</code> desde Claude Code.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            {[
              {
                cmd: '/qa-diseno',
                archivo: '.claude/commands/qa-diseno.md',
                desc: 'Auditoría completa en 5 dimensiones: DS 13 reglas, Layout/Shell, Composición, Usabilidad e Indicadores. Produce reporte priorizado por severidad en español.',
                uso: '/qa-diseno app/indicadores/page.tsx',
              },
              {
                cmd: '/build',
                archivo: '.claude/commands/build.md',
                desc: 'Ejecuta un plan de diseño aprobado fase por fase. Cada fase: design-build-agent → design-review-agent → commit. Gates de DS en cada fase.',
                uso: '/build .code-foundations/plans/nueva-pantalla.md',
              },
              {
                cmd: '/plan',
                archivo: '.claude/commands/plan.md',
                desc: 'Convierte un brief de diseño en un plan de fases con done-when criteria, doctrine asignada y gates de DS.',
                uso: '/plan "nueva pantalla T4 listado de ventas"',
              },
              {
                cmd: '/mock',
                archivo: '.claude/commands/mock.md',
                desc: 'Renderiza un prototipo barato desde el plan. Gate de sign-off antes de proceder al build completo.',
                uso: '/mock .code-foundations/plans/nueva-pantalla.md',
              },
              {
                cmd: '/research',
                archivo: '.claude/commands/research.md',
                desc: 'Facilita el brief de diseño: qué debe hacer la pantalla, para quién, con qué sensación. Produce un research doc confirmado.',
                uso: '/research',
              },
            ].map(({ cmd, archivo, desc, uso }) => (
              <div key={cmd} style={{ border: '1px solid #EEF0F3', borderRadius: 6, padding: '16px 20px', background: '#FFF' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                  <code style={{ font: '700 14px var(--font-geist-mono), monospace', color: '#2F6BFF', fontVariantNumeric: 'tabular-nums' }}>{cmd}</code>
                  <code style={{ font: '400 11px var(--font-geist-mono), monospace', color: '#98A0AC' }}>{archivo}</code>
                </div>
                <p style={{ font: '400 13px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', margin: '0 0 10px' }}>{desc}</p>
                <div style={{ background: '#0E1116', borderRadius: 4, padding: '7px 12px' }}>
                  <code style={{ font: '400 12px var(--font-geist-mono), monospace', color: '#8B98A8' }}>{uso}</code>
                </div>
              </div>
            ))}
          </div>

          <SubH>Flujo recomendado</SubH>
          <CodeBlock code={`/research          → brief confirmado
    ↓
/plan              → plan de fases con DW criteria
    ↓
/mock              → prototipo barato + sign-off
    ↓
/build             → BUILD → REVIEW → commit (por fase)
    ↓
/qa-diseno         → auditoría DS antes de mergear`} />
        </section>

        <section id="plugin-agentes" style={{ marginBottom: 64 }}>
          <SectionH2>Plugin — Agentes</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 20 }}>
            2 agentes en <code style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, background: '#F4F5F7', padding: '1px 4px', borderRadius: 3 }}>.claude/agents/</code>. Son despachados por los comandos — no se invocan directamente.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, padding: '20px', background: '#FFF' }}>
              <p style={{ font: '700 14px var(--font-geist-mono), monospace', color: '#0E1116', margin: '0 0 4px', fontVariantNumeric: 'tabular-nums' }}>design-build-agent</p>
              <p style={{ font: '400 11px var(--font-geist-mono), monospace', color: '#98A0AC', margin: '0 0 12px' }}>.claude/agents/design-build-agent.md</p>
              <p style={{ font: '400 13px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', margin: '0 0 16px' }}>
                Produce el artifact de UNA fase del plan — DESIGN.md tokens, spec de página, o mock renderizado. Carga CLAUDE.md y AGENTS.md antes de cualquier trabajo. Traza cada DW item a evidencia de ejecución.
              </p>
              <div style={{ background: '#FAFBFC', border: '1px solid #EEF0F3', borderRadius: 6, padding: '12px 16px' }}>
                <p style={{ font: '600 11px var(--font-geist-mono), monospace', color: '#98A0AC', margin: '0 0 8px', letterSpacing: '.07em' }}>DOCTRINA QUE CARGA SIEMPRE</p>
                {['CLAUDE.md — 13 reglas del DS (ley)', 'AGENTS.md — APIs de componentes y prohibidos', 'La skill asignada en la fase (usability, data-viz, etc.)'].map((d, i) => (
                  <p key={i} style={{ font: '400 12px/1.5 var(--font-geist-sans), sans-serif', color: '#5B6472', margin: '0 0 2px' }}>· {d}</p>
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, padding: '20px', background: '#FFF' }}>
              <p style={{ font: '700 14px var(--font-geist-mono), monospace', color: '#0E1116', margin: '0 0 4px', fontVariantNumeric: 'tabular-nums' }}>design-review-agent</p>
              <p style={{ font: '400 11px var(--font-geist-mono), monospace', color: '#98A0AC', margin: '0 0 12px' }}>.claude/agents/design-review-agent.md</p>
              <p style={{ font: '400 13px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', margin: '0 0 16px' }}>
                Revisión dual-blind: Assessment A (crítica cross-pillar) + Assessment B (detector <code style={{ fontFamily: 'var(--font-geist-mono)' }}>scripts/detect.mjs</code>) se ejecutan en aislamiento y se sintetizan en un solo reporte ordenado por severidad. Las 13 reglas de CLAUDE.md son su doctrina primaria.
              </p>
              <div style={{ background: '#FAFBFC', border: '1px solid #EEF0F3', borderRadius: 6, padding: '12px 16px' }}>
                <p style={{ font: '600 11px var(--font-geist-mono), monospace', color: '#98A0AC', margin: '0 0 8px', letterSpacing: '.07em' }}>ARQUITECTURA DUAL-BLIND</p>
                {[
                  'Assessment A corre primero — crítica desde contexto limpio, sin ver B',
                  'Assessment B corre en paralelo — scripts/detect.mjs, 16 reglas AI-tell',
                  'Síntesis solo después de que A está congelado en escritura',
                  'Un detector omitido con .html existente → FAIL automático',
                ].map((d, i) => (
                  <p key={i} style={{ font: '400 12px/1.5 var(--font-geist-sans), sans-serif', color: '#5B6472', margin: '0 0 2px' }}>· {d}</p>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24 }} />
          <SubH>Diferencias respecto al plugin original</SubH>
          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#FAFBFC', borderBottom: '1px solid #EEF0F3', padding: '8px 16px', gap: 16 }}>
              {['Aspecto', 'Plugin original', 'Núcleo ADC'].map(h => (
                <span key={h} style={{ font: '600 11px var(--font-geist-mono), monospace', color: '#55677F', letterSpacing: '.05em' }}>{h.toUpperCase()}</span>
              ))}
            </div>
            {[
              ['Doctrina principal', 'design-dna + checklists genéricos', 'CLAUDE.md 13 reglas (siempre)'],
              ['Colores', 'WCAG + teoría general', 'Navy=estructura · Azul=acción · Estado calculado'],
              ['Tipografía', 'Medium-form genérico', 'Geist/Mono división absoluta · tabular-nums'],
              ['Espaciado', 'Proporciones generales', '4px grid · excepción 9px rail documentada'],
              ['Idioma del reporte', 'Inglés', 'Español'],
              ['APIs referenciadas', 'Genéricas', 'TarjetaIndicador, MarcoReporte, Campo…'],
            ].map(([aspecto, original, nucleo], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '9px 16px', background: i % 2 === 0 ? '#FFF' : '#FAFBFC', borderBottom: i < 5 ? '1px solid #F4F5F7' : 'none', gap: 16, alignItems: 'start' }}>
                <span style={{ font: '500 12.5px var(--font-geist-sans), sans-serif', color: '#0E1116' }}>{aspecto}</span>
                <span style={{ font: '400 12px/1.4 var(--font-geist-sans), sans-serif', color: '#98A0AC' }}>{original}</span>
                <span style={{ font: '500 12px/1.4 var(--font-geist-sans), sans-serif', color: '#0B7A53' }}>{nucleo}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="plugin-skills" style={{ marginBottom: 64 }}>
          <SectionH2>Plugin — Skills</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 20 }}>
            4 skills en <code style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, background: '#F4F5F7', padding: '1px 4px', borderRadius: 3 }}>skills/</code>. Son libraries de doctrina — los agentes las leen por nombre cuando la fase las requiere. No se invocan directamente.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              {
                nombre: 'usability',
                path: 'skills/usability/SKILL.md',
                cuando: 'Flujos multi-paso, formularios, navegación, auditoría heurística',
                refs: ['usability-principles.md — Nielsen 10, UX laws (Fitts, Hick, Miller)', 'ui-patterns.md — 8 familias de patrones + bridge table'],
              },
              {
                nombre: 'prototype',
                path: 'skills/prototype/SKILL.md',
                cuando: 'Producir un .html viewable desde tokens y page specs',
                refs: ['mock-recipe.md — wireframe vs. styled, estructura semántica', 'examples/sample-mock.html — referencia de output'],
              },
              {
                nombre: 'data-viz',
                path: 'skills/data-viz/SKILL.md',
                cuando: 'Gráficas, dashboards, tablas de datos numéricos',
                refs: ['chart-selection.md — qué gráfica para qué dato', 'viz-principles.md — data-ink ratio, chartjunk, encoding'],
              },
              {
                nombre: 'clarify',
                path: 'skills/clarify/SKILL.md',
                cuando: 'Brief subespeficado que necesita clarificación antes de diseñar',
                refs: ['adaptive-questioning.md — clasificación de gaps y preguntas dirigidas'],
              },
            ].map(({ nombre, path, cuando, refs }) => (
              <div key={nombre} style={{ border: '1px solid #EEF0F3', borderRadius: 6, padding: '16px', background: '#FFF' }}>
                <code style={{ font: '700 13px var(--font-geist-mono), monospace', color: '#2F6BFF', display: 'block', marginBottom: 2, fontVariantNumeric: 'tabular-nums' }}>{nombre}</code>
                <code style={{ font: '400 10.5px var(--font-geist-mono), monospace', color: '#98A0AC', display: 'block', marginBottom: 10 }}>{path}</code>
                <p style={{ font: '500 12px/1 var(--font-geist-sans), sans-serif', color: '#0E1116', margin: '0 0 8px' }}>Cuándo</p>
                <p style={{ font: '400 12px/1.5 var(--font-geist-sans), sans-serif', color: '#5B6472', margin: '0 0 10px' }}>{cuando}</p>
                <p style={{ font: '500 12px/1 var(--font-geist-sans), sans-serif', color: '#0E1116', margin: '0 0 6px' }}>Referencias</p>
                {refs.map((r, i) => (
                  <p key={i} style={{ font: '400 11.5px/1.4 var(--font-geist-sans), sans-serif', color: '#5B6472', margin: '0 0 2px' }}>· {r}</p>
                ))}
              </div>
            ))}
          </div>

          <SubH>Triage de skills por tipo de pantalla</SubH>
          <div style={{ border: '1px solid #EEF0F3', borderRadius: 6, overflow: 'hidden' }}>
            {[
              ['T2 Tablero de puesto', 'usability · data-viz (gráfico ritmo)', ''],
              ['T4 Listado de trabajo', 'usability (patrones de tabla/filtro)', ''],
              ['T6 Captura', 'usability (formularios, errores)', ''],
              ['T8 Bandeja de autorizaciones', 'usability · behavioral (decisión en serie)', ''],
              ['T9 Reporte fijo', 'data-viz (encoding de datos)', ''],
              ['T10 Núcleo a pantalla completa', 'usability · data-viz', ''],
              ['Cualquier pantalla', 'DS Núcleo ADC (CLAUDE.md) — siempre activo', 'siempre'],
            ].map(([tipo, skills, nota], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', padding: '9px 16px', background: i % 2 === 0 ? '#FFF' : '#FAFBFC', borderBottom: i < 6 ? '1px solid #F4F5F7' : 'none', gap: 16, alignItems: 'center' }}>
                <span style={{ font: i === 6 ? '600 12px var(--font-geist-sans), sans-serif' : '400 12.5px var(--font-geist-sans), sans-serif', color: i === 6 ? '#0E1116' : '#5B6472' }}>{tipo}</span>
                <code style={{ font: '400 12px var(--font-geist-mono), monospace', color: i === 6 ? '#2F6BFF' : '#0E1116', fontVariantNumeric: 'tabular-nums' }}>{skills}</code>
              </div>
            ))}
          </div>
        </section>

        <section id="plugin-scripts" style={{ marginBottom: 64 }}>
          <SectionH2>Plugin — Scripts</SectionH2>
          <p style={{ font: '400 13.5px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', marginBottom: 20 }}>
            3 scripts en <code style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, background: '#F4F5F7', padding: '1px 4px', borderRadius: 3 }}>scripts/</code>. Los ejecuta el design-review-agent como parte del Assessment B.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                script: 'detect.mjs',
                desc: 'Detector determinístico: 16 reglas AI-tell sobre HTML renderizado. Corre como Assessment B en el design-review-agent. Exit 0 = corrió · 3 = N/A (sin .html) · 1 = error (review FAIL).',
                uso: 'node scripts/detect.mjs mocks/tablero-puesto.html > .code-foundations/qa/detect.json',
              },
              {
                script: 'palette.mjs',
                desc: 'Generador de tokens de color con reporte de contraste WCAG AA. Exits non-zero si algún par está bajo el target. Usa para verificar que la paleta cumple contraste antes de publicar.',
                uso: 'node scripts/palette.mjs --seed "#00244D" --chroma 0.12',
              },
              {
                script: 'dealer.mjs',
                desc: 'Composition dealer: genera layouts con eje semilla para romper la convergencia del modelo hacia diseños genéricos. Qualquier eje se puede pinear antes del deal.',
                uso: 'node scripts/dealer.mjs --pin family=data-dense --pin hue=navy',
              },
            ].map(({ script, desc, uso }) => (
              <div key={script} style={{ border: '1px solid #EEF0F3', borderRadius: 6, padding: '16px 20px', background: '#FFF' }}>
                <code style={{ font: '700 13px var(--font-geist-mono), monospace', color: '#0E1116', display: 'block', marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>scripts/{script}</code>
                <p style={{ font: '400 13px/1.6 var(--font-geist-sans), sans-serif', color: '#5B6472', margin: '0 0 12px' }}>{desc}</p>
                <div style={{ background: '#0E1116', borderRadius: 4, padding: '7px 12px' }}>
                  <code style={{ font: '400 12px var(--font-geist-mono), monospace', color: '#8B98A8', fontVariantNumeric: 'tabular-nums' }}>{uso}</code>
                </div>
              </div>
            ))}
          </div>

          <SubH>Flujo de Assessment B en /qa-diseno</SubH>
          <CodeBlock code={`# 1. Renderizar el mock (si hay screenshot disponible)
#    /qa-diseno lo hace automáticamente si existe un .html

# 2. Correr el detector
node scripts/detect.mjs mocks/mi-pantalla.html \\
  > .code-foundations/qa/detect-mi-pantalla.json

# 3. El agente lee detect.json SOLO después de congelar Assessment A
#    (arquitectura dual-blind — A nunca ve B antes de escribir sus hallazgos)

# Exit codes:
# 0 → corrió, ver detect.json para hallazgos
# 3 → N/A (no se pasó .html)  → Assessment B = N/A, no es FAIL
# 1 → error interno           → review FAIL automático`} />
        </section>

      </main>
    </div>
  )
}
