'use client'

// Catálogo de los 11 tipos de pantalla del núcleo.
// Ref: design.md §17

import { useRouter } from 'next/navigation'
import {
  LayoutGrid,
  TrendingUp,
  BarChart,
  Settings,
} from 'lucide-react'
import { Shell } from '@/components/shell'
import type { App, MenuGrupo } from '@/components/shell'

// ── Apps y menú ───────────────────────────────────────────────────────────────

const APPS: App[] = [
  { id: 'hub', nombre: 'Hub', Icono: LayoutGrid },
  { id: 'finanzas', nombre: 'Finanzas', Icono: TrendingUp, badge: 3 },
  { id: 'indicadores', nombre: 'Indicadores', Icono: BarChart },
  { id: 'configuracion', nombre: 'Configuración', Icono: Settings },
]

const GRUPOS: MenuGrupo[] = [
  {
    items: [
      { id: 'catalogo', etiqueta: 'Catálogo' },
      { id: 'como-elegir', etiqueta: 'Cómo elegir' },
    ],
  },
]

// ── Datos de los 11 tipos ─────────────────────────────────────────────────────

interface TipoPantalla {
  id: string
  numero: string
  nombre: string
  frecuencia: string
  pregunta: string
  reglas: string[]
}

const TIPOS: TipoPantalla[] = [
  {
    id: 't1',
    numero: 'T1',
    nombre: 'Hub del núcleo',
    frecuencia: '1 POR USUARIO',
    pregunta: '¿Qué me espera hoy?',
    reglas: [
      'Feed de atención ocupa el centro',
      'Sin bloque de accesos: el rail navega',
      'Nunca datos de una sola app',
    ],
  },
  {
    id: 't2',
    numero: 'T2',
    nombre: 'Tablero de puesto',
    frecuencia: 'INICIO DE CADA APP',
    pregunta: '¿Cómo voy yo este mes?',
    reglas: [
      'Hasta 6 indicadores en orden del proceso',
      'Con 7 o más, pasa a lista',
      'Con ritmo y calificación ponderada',
    ],
  },
  {
    id: 't3',
    numero: 'T3',
    nombre: 'Tablero de área o sucursal',
    frecuencia: 'PARA QUIEN DIRIGE',
    pregunta: '¿Cómo va mi gente?',
    reglas: [
      'Una fila por puesto o área',
      'Columnas de indicador y global ponderado',
      'La fila se despliega al tablero del puesto',
    ],
  },
  {
    id: 't4',
    numero: 'T4',
    nombre: 'Listado de trabajo',
    frecuencia: 'LA MÁS FRECUENTE',
    pregunta: 'Encuéntrame el caso.',
    reglas: [
      'Búsqueda + filtros en cada encabezado',
      'Estatus en píldora',
      'Pie que suma lo filtrado · La fila abre el expediente',
    ],
  },
  {
    id: 't5',
    numero: 'T5',
    nombre: 'Expediente',
    frecuencia: 'DETALLE DE UN REGISTRO',
    pregunta: 'Todo sobre este caso.',
    reglas: [
      'Identidad y estatus arriba',
      'Pestañas, nunca más de cuatro',
      'Datos a la izquierda, bitácora a la derecha · Una sola acción primaria',
    ],
  },
  {
    id: 't6',
    numero: 'T6',
    nombre: 'Captura',
    frecuencia: 'UNA SOLA PANTALLA',
    pregunta: 'Necesito registrar algo.',
    reglas: [
      'Dos columnas máximo · Error junto al campo',
      'Borrador automático',
      'Barra de acción fija al pie · Nunca en modal',
    ],
  },
  {
    id: 't7',
    numero: 'T7',
    nombre: 'Flujo por pasos',
    frecuencia: 'SOLO SI HAY DEPENDENCIA',
    pregunta: 'Un trámite largo.',
    reglas: [
      '3 a 5 pasos · Cada paso guarda al avanzar',
      'Se puede retomar',
      'Si los pasos no dependen entre sí, era T6',
    ],
  },
  {
    id: 't8',
    numero: 'T8',
    nombre: 'Bandeja de autorizaciones',
    frecuencia: 'DECIDIR EN SERIE',
    pregunta: 'Autorizo o no.',
    reglas: [
      'Cola a la izquierda, caso completo a la derecha',
      'Todo lo necesario para decidir sin abrir otra pantalla',
      'Teclado obligatorio: al resolver salta al siguiente',
    ],
  },
  {
    id: 't9',
    numero: 'T9',
    nombre: 'Reporte fijo',
    frecuencia: 'SEIS FORMATOS',
    pregunta: 'El reporte de siempre.',
    reglas: [
      'Cabeza con entidad y periodo',
      'Cuerpo en uno de los 6 formatos',
      'Pie de linaje · Se imprime y se defiende solo',
    ],
  },
  {
    id: 't10',
    numero: 'T10',
    nombre: 'Núcleo a pantalla completa',
    frecuencia: 'CUANDO SE INVESTIGA',
    pregunta: 'Déjame preguntar.',
    reglas: [
      'Conversación centrada, columna estrecha',
      'Cada respuesta con tabla o gráfica embebida',
      'Todo lo generado usa los formatos del catálogo · Con sus fuentes',
    ],
  },
  {
    id: 't11',
    numero: 'T11',
    nombre: 'Configuración',
    frecuencia: 'CATÁLOGOS Y ROLES',
    pregunta: 'Cambiar cómo funciona.',
    reglas: [
      'Índice a la izquierda',
      'Un ajuste por sección · Quién lo cambió al pie',
      'Todo lo que se toca se audita',
    ],
  },
]

// ── Tabla de decisión ─────────────────────────────────────────────────────────

const DECISION: { frase: string; tipo: string }[] = [
  { frase: '¿Qué me espera?', tipo: 'T1 Hub' },
  { frase: '¿Cómo voy?', tipo: 'T2 · T3 si es la gente a cargo' },
  { frase: 'Búscame…', tipo: 'T4 Listado' },
  { frase: 'Ábreme el caso', tipo: 'T5 Expediente' },
  { frase: 'Voy a registrar', tipo: 'T6 · T7 si hay pasos dependientes' },
  { frase: 'Autoriza esto', tipo: 'T8 Bandeja' },
  { frase: 'El reporte de siempre', tipo: 'T9 Reporte fijo' },
  { frase: 'Déjame preguntar', tipo: 'T10 Núcleo' },
  { frase: 'Cambiar cómo funciona', tipo: 'T11 Configuración' },
]

// ── Rutas existentes ──────────────────────────────────────────────────────────

const RUTAS: { ruta: string; descripcion: string }[] = [
  { ruta: '/', descripcion: 'Hub (T1)' },
  { ruta: '/indicadores', descripcion: 'Tablero (T2/T3)' },
  { ruta: '/indicadores/tablero-puesto', descripcion: 'Tablero de puesto (T2)' },
  { ruta: '/formularios', descripcion: 'T6 Captura — demo' },
  { ruta: '/reportes', descripcion: 'T9 Reporte fijo — demo' },
  { ruta: '/reportes/generados', descripcion: 'demo MCP' },
  { ruta: '/pantallas', descripcion: 'este catálogo' },
]

// ── Estilos compartidos ───────────────────────────────────────────────────────

const S = {
  sans: 'var(--font-geist-sans), sans-serif',
  mono: 'var(--font-geist-mono), monospace',
} as const

// ── Página ────────────────────────────────────────────────────────────────────

export default function PantallasPage() {
  const router = useRouter()

  return (
    <Shell
      apps={APPS}
      appActiva="hub"
      nombreApp="Pantallas"
      periodo="2026"
      grupos={GRUPOS}
      itemActivo="catalogo"
      onAppChange={(id) => {
        if (id === 'hub') router.push('/')
        if (id === 'indicadores') router.push('/indicadores')
      }}
      onItemChange={() => {}}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* ── Encabezado de pantalla ────────────────────────────────────────── */}
        <div>
          <h1
            style={{
              fontFamily: S.sans,
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-.02em',
              color: '#0E1116',
              margin: '0 0 4px',
            }}
          >
            Los 11 tipos de pantalla
          </h1>
          <p
            style={{
              fontFamily: S.sans,
              fontSize: 12.5,
              fontWeight: 400,
              color: '#5B6472',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Toda pantalla del núcleo es una de estas once
          </p>
        </div>

        {/* ── Sección 1: Catálogo ───────────────────────────────────────────── */}
        <section>
          <p
            style={{
              fontFamily: S.mono,
              fontSize: 11,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '.07em',
              color: '#98A0AC',
              margin: '0 0 16px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            Catálogo
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}
          >
            {TIPOS.map((tipo) => (
              <div
                key={tipo.id}
                style={{
                  border: '1px solid #EEF0F3',
                  borderRadius: 6,
                  padding: 20,
                  background: '#fff',
                }}
              >
                {/* Badge de tipo */}
                <span
                  style={{
                    fontFamily: S.mono,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.04em',
                    color: '#2F6BFF',
                    background: 'rgba(47,107,255,.10)',
                    borderRadius: 4,
                    padding: '2px 6px',
                    display: 'inline-block',
                    marginBottom: 8,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {tipo.numero}
                </span>

                {/* Número + nombre */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: S.mono,
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#0E1116',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {tipo.numero}
                  </span>
                  <span
                    style={{
                      fontFamily: S.sans,
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#0E1116',
                    }}
                  >
                    {tipo.nombre}
                  </span>
                </div>

                {/* Frecuencia */}
                <p
                  style={{
                    fontFamily: S.mono,
                    fontSize: 10,
                    fontWeight: 400,
                    color: '#98A0AC',
                    margin: '0 0 8px',
                    textTransform: 'uppercase',
                    letterSpacing: '.04em',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {tipo.frecuencia}
                </p>

                {/* Pregunta del usuario */}
                <p
                  style={{
                    fontFamily: S.sans,
                    fontSize: 13,
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                    color: '#5B6472',
                    borderLeft: '3px solid #EEF0F3',
                    paddingLeft: 10,
                    margin: '0 0 12px',
                  }}
                >
                  {tipo.pregunta}
                </p>

                {/* Reglas */}
                <ul
                  style={{
                    fontFamily: S.sans,
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: '#0E1116',
                    margin: 0,
                    paddingLeft: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  {tipo.reglas.map((regla, i) => (
                    <li key={i}>{regla}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Sección 2: Cómo elegir ────────────────────────────────────────── */}
        <section>
          <p
            style={{
              fontFamily: S.mono,
              fontSize: 11,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '.07em',
              color: '#98A0AC',
              margin: '0 0 16px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            Cómo elegir el tipo
          </p>

          <div
            style={{
              border: '1px solid #EEF0F3',
              borderRadius: 6,
              background: '#fff',
              overflow: 'hidden',
            }}
          >
            {/* Encabezado de tabla */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: '#FAFBFC',
                borderBottom: '1px solid #EEF0F3',
              }}
            >
              <div
                style={{
                  fontFamily: S.mono,
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#5B6472',
                  textTransform: 'uppercase',
                  letterSpacing: '.04em',
                  padding: '8px 16px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                Frase del usuario
              </div>
              <div
                style={{
                  fontFamily: S.mono,
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#5B6472',
                  textTransform: 'uppercase',
                  letterSpacing: '.04em',
                  padding: '8px 16px',
                  borderLeft: '1px solid #EEF0F3',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                Tipo
              </div>
            </div>

            {/* Filas */}
            {DECISION.map((fila, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  background: i % 2 === 0 ? '#FAFBFC' : '#FFF',
                  borderBottom: i < DECISION.length - 1 ? '1px solid #EEF0F3' : undefined,
                }}
              >
                <div
                  style={{
                    fontFamily: S.sans,
                    fontSize: 12,
                    color: '#0E1116',
                    padding: '10px 16px',
                    lineHeight: 1.5,
                  }}
                >
                  {fila.frase}
                </div>
                <div
                  style={{
                    fontFamily: S.mono,
                    fontSize: 12,
                    color: '#0E1116',
                    padding: '10px 16px',
                    borderLeft: '1px solid #EEF0F3',
                    lineHeight: 1.5,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {fila.tipo}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Sección 3: Rutas existentes ───────────────────────────────────── */}
        <section>
          <p
            style={{
              fontFamily: S.mono,
              fontSize: 11,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '.07em',
              color: '#98A0AC',
              margin: '0 0 16px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            Rutas existentes
          </p>

          <div
            style={{
              border: '1px solid #EEF0F3',
              borderRadius: 6,
              background: '#fff',
              padding: '4px 0',
            }}
          >
            {RUTAS.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 20px',
                  borderBottom: i < RUTAS.length - 1 ? '1px solid #EEF0F3' : undefined,
                }}
              >
                <a
                  href={r.ruta}
                  style={{
                    fontFamily: S.mono,
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#2F6BFF',
                    textDecoration: 'none',
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: 220,
                  }}
                >
                  {r.ruta}
                </a>
                <span
                  style={{
                    fontFamily: S.sans,
                    fontSize: 12,
                    color: '#5B6472',
                    lineHeight: 1.5,
                  }}
                >
                  {r.descripcion}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </Shell>
  )
}
