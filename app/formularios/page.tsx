'use client'

// Pantalla de Formularios — catálogo de los 11 controles, 8 estados y 3 formatos.
// Ref: design.md §09, doc 09-formularios

import { useState } from 'react'
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
import { Campo } from '@/components/nucleo-adc/ui/campo'
import { CampoCifra } from '@/components/nucleo-adc/ui/campo-cifra'
import { Combobox } from '@/components/nucleo-adc/ui/combobox'
import { RadioTarjeta } from '@/components/nucleo-adc/ui/radio-tarjeta'
import { CampoArchivo } from '@/components/nucleo-adc/ui/campo-archivo'
import { CampoRejilla } from '@/components/nucleo-adc/ui/campo-rejilla'
import type { FilaRejilla } from '@/components/nucleo-adc/ui/campo-rejilla'
import { PanelLateral } from '@/components/nucleo-adc/formularios/panel-lateral'
import { DialogoConfirmacion } from '@/components/nucleo-adc/formularios/dialogo-confirmacion'

// ── Apps y menú ──────────────────────────────────────────────────────────────

const APPS: App[] = [
  { id: 'hub', nombre: 'Hub', Icono: LayoutGrid },
  { id: 'finanzas', nombre: 'Finanzas', Icono: TrendingUp, badge: 3 },
  { id: 'indicadores', nombre: 'Indicadores', Icono: BarChart },
  { id: 'configuracion', nombre: 'Configuración', Icono: Settings },
  { id: 'formularios', nombre: 'Formularios', Icono: FileText },
]

const GRUPOS: MenuGrupo[] = [
  {
    items: [
      { id: 'controles', etiqueta: 'Controles' },
      { id: 'estados', etiqueta: 'Estados' },
      { id: 'formatos', etiqueta: 'Formatos' },
    ],
  },
]

// ── Datos de demostración ────────────────────────────────────────────────────

const OPCIONES_SUCURSAL = [
  { clave: 'CEL-N', etiqueta: 'MG Celaya Norte' },
  { clave: 'CEL-S', etiqueta: 'MG Celaya Sur' },
  { clave: 'QRO-1', etiqueta: 'MG Querétaro Centro' },
  { clave: 'QRO-2', etiqueta: 'MG Querétaro Peñuelas' },
  { clave: 'SLP-1', etiqueta: 'MG San Luis Potosí' },
  { clave: 'AGS-1', etiqueta: 'MG Aguascalientes' },
  { clave: 'LEO-1', etiqueta: 'MG León Norte' },
  { clave: 'LEO-2', etiqueta: 'MG León Sur' },
  { clave: 'GDL-1', etiqueta: 'MG Guadalajara Centro' },
  { clave: 'GDL-2', etiqueta: 'MG Guadalajara Zapopan' },
  { clave: 'MTY-1', etiqueta: 'MG Monterrey Valle' },
  { clave: 'MTY-2', etiqueta: 'MG Monterrey San Nicolás' },
  { clave: 'CDM-1', etiqueta: 'MG CDMX Satélite' },
  { clave: 'CDM-2', etiqueta: 'MG CDMX Pedregal' },
]

const OPCIONES_RADIO = [
  {
    valor: 'directa',
    titulo: 'Venta directa',
    descripcion: 'El cliente paga el total al contado. Sin financiamiento.',
  },
  {
    valor: 'credito',
    titulo: 'Crédito automotriz',
    descripcion: 'Financiado por institución bancaria o GMAC. Requiere enganche.',
  },
  {
    valor: 'arrendamiento',
    titulo: 'Arrendamiento puro',
    descripcion: 'El cliente renta el vehículo. Al término puede comprarlo.',
  },
]

const FILAS_REJILLA: FilaRejilla[] = [
  { id: 'walkin', nombre: 'Tráfico Walk-In', valorAnterior: 505, etiquetaAnterior: 'JUL' },
  { id: 'unidades', nombre: 'Unidades Vendidas', valorAnterior: 38, etiquetaAnterior: 'JUL' },
  { id: 'financiamiento', nombre: 'Penetración de Financiamiento', valorAnterior: null, etiquetaAnterior: 'JUL' },
  { id: 'satisfaccion', nombre: 'Satisfacción del Cliente', valorAnterior: 81, etiquetaAnterior: 'JUL' },
]

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// ── Estilos compartidos ──────────────────────────────────────────────────────

const tarjeta: React.CSSProperties = {
  border: '1px solid #EEF0F3',
  borderRadius: 6,
  padding: 24,
  background: '#fff',
  marginBottom: 20,
}

const rotulo: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono), monospace',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '.08em',
  color: '#98A0AC',
  textTransform: 'uppercase' as const,
  marginBottom: 12,
}

const h2estilo: React.CSSProperties = {
  fontFamily: 'var(--font-geist-sans), sans-serif',
  fontSize: 16,
  fontWeight: 600,
  color: '#0E1116',
  margin: '0 0 16px',
  letterSpacing: '-.015em',
}

// ── Pantalla ─────────────────────────────────────────────────────────────────

export default function FormulariosPage() {
  const router = useRouter()

  // Valores de formulario de los controles
  const [nombreCliente, setNombreCliente] = useState('')
  const [monto, setMonto] = useState('')
  const [tipoOp, setTipoOp] = useState('directa')
  const [sucursal, setSucursal] = useState('')
  const [mesSelec, setMesSelec] = useState(8)
  const [acumMes, setAcumMes] = useState<'MES' | 'ACUM'>('MES')
  const [notas, setNotas] = useState('')
  const [siNo, setSiNo] = useState(false)
  const [tipoVenta, setTipoVenta] = useState('')
  const [rejillaValores, setRejillaValores] = useState<Record<string, string>>({})

  // Estado del panel y diálogo
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)

  // Campos del panel lateral de ejemplo
  const [panelNombre, setPanelNombre] = useState('MG Celaya Norte')
  const [panelMonto, setPanelMonto] = useState('25500000')

  // Item activo del menú
  const [itemActivo, setItemActivo] = useState('controles')

  return (
    <Shell
      apps={APPS}
      appActiva="formularios"
      nombreApp="Formularios"
      periodo="Ago 2026"
      grupos={GRUPOS}
      itemActivo={itemActivo}
      onAppChange={(id) => {
        if (id === 'hub') router.push('/')
        if (id === 'indicadores') router.push('/indicadores')
      }}
      onItemChange={(id) => setItemActivo(id)}
    >
      {/* Encabezado de pantalla */}
      <div style={{ marginBottom: 24 }}>
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
          Formularios
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
          11 controles · 8 estados · 3 formatos
        </p>
      </div>

      {/* ── Sección 1: Los 11 controles ──────────────────────────────────── */}
      <div style={tarjeta} id="controles">
        <p style={rotulo}>Sección 01</p>
        <h2 style={h2estilo}>11 controles de captura</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}
        >
          {/* 1. TEXTO CORTO */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>01 · Texto corto</p>
            <Campo
              etiqueta="Nombre del cliente"
              placeholder="Ej. Juan Pérez"
              ayuda="Máx. 80 caracteres"
              valor={nombreCliente}
              onChange={setNombreCliente}
              maxLength={80}
            />
          </div>

          {/* 2. CIFRA */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>02 · Cifra</p>
            <CampoCifra
              etiqueta="Monto del descuento"
              prefijo="$"
              ayuda="Sin IVA"
              valor={monto}
              onChange={setMonto}
              ancho={200}
            />
          </div>

          {/* 3. LISTA CORTA */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>03 · Lista corta</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span
                style={{
                  font: '500 11.5px/1 var(--font-geist-sans), sans-serif',
                  color: '#0E1116',
                }}
              >
                Tipo de operación
              </span>
              <div
                style={{
                  height: 32,
                  border: '1px solid #D8DCE2',
                  borderRadius: 8,
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 10,
                  paddingRight: 10,
                  position: 'relative',
                }}
              >
                <select
                  value={tipoOp}
                  onChange={(e) => setTipoOp(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    font: '500 13px var(--font-geist-mono), monospace',
                    color: tipoOp ? '#0E1116' : '#98A0AC',
                    appearance: 'none',
                    cursor: 'pointer',
                    minWidth: 0,
                  }}
                >
                  <option value="directa">Venta directa</option>
                  <option value="credito">Crédito</option>
                  <option value="arrendamiento">Arrendamiento</option>
                </select>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B7482"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ flexShrink: 0, pointerEvents: 'none' }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <span
                style={{
                  font: '400 11.5px/1.5 var(--font-geist-sans), sans-serif',
                  color: '#6B7482',
                }}
              >
                Máx. 5 opciones
              </span>
            </div>
          </div>

          {/* 4. LISTA LARGA */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>04 · Lista larga</p>
            <Combobox
              etiqueta="Sucursal"
              opciones={OPCIONES_SUCURSAL}
              valor={sucursal}
              onSeleccionar={(clave) => setSucursal(clave)}
              ayuda="Busca por clave o nombre"
            />
          </div>

          {/* 5. PERIODO */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>05 · Periodo</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span
                style={{
                  font: '500 11.5px/1 var(--font-geist-sans), sans-serif',
                  color: '#0E1116',
                }}
              >
                Periodo de referencia
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* Selector de mes */}
                <div
                  style={{
                    height: 32,
                    border: '1px solid #D8DCE2',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 10,
                    paddingRight: 10,
                    gap: 6,
                  }}
                >
                  <select
                    value={mesSelec}
                    onChange={(e) => setMesSelec(Number(e.target.value))}
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      font: '600 12.5px var(--font-geist-mono), monospace',
                      color: '#0E1116',
                      appearance: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {MESES.map((m, i) => (
                      <option key={m} value={i + 1}>{m} 2026</option>
                    ))}
                  </select>
                </div>
                {/* Toggle MES / ACUM */}
                <div
                  style={{
                    display: 'flex',
                    border: '1px solid #D8DCE2',
                    borderRadius: 8,
                    overflow: 'hidden',
                    height: 32,
                  }}
                >
                  {(['MES', 'ACUM'] as const).map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setAcumMes(op)}
                      style={{
                        height: '100%',
                        padding: '0 12px',
                        border: 'none',
                        background: acumMes === op ? '#00244D' : 'transparent',
                        font: '600 11px var(--font-geist-mono), monospace',
                        color: acumMes === op ? '#FFFFFF' : '#6B7482',
                        cursor: 'pointer',
                        letterSpacing: '.04em',
                        transition: 'background .12s, color .12s',
                      }}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>
              <span
                style={{
                  font: '400 11.5px/1.5 var(--font-geist-sans), sans-serif',
                  color: '#6B7482',
                }}
              >
                Mes suelto o acumulado al mes
              </span>
            </div>
          </div>

          {/* 6. TEXTO LARGO */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>06 · Texto largo</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span
                style={{
                  font: '500 11.5px/1 var(--font-geist-sans), sans-serif',
                  color: '#0E1116',
                }}
              >
                Notas adicionales
              </span>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Agrega contexto relevante para el seguimiento…"
                rows={3}
                maxLength={400}
                style={{
                  width: '100%',
                  border: notas ? '1px solid #C8CCD4' : '1px solid #D8DCE2',
                  borderRadius: 8,
                  background: '#FFFFFF',
                  padding: '8px 10px',
                  font: '400 13px/1.5 var(--font-geist-sans), sans-serif',
                  color: '#0E1116',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color .12s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2F6BFF'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47,107,255,.18)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = notas ? '#C8CCD4' : '#D8DCE2'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    font: '400 11.5px/1.5 var(--font-geist-sans), sans-serif',
                    color: '#6B7482',
                  }}
                >
                  Máx. 400 caracteres
                </span>
                <span
                  style={{
                    font: '500 10.5px var(--font-geist-mono), monospace',
                    color: '#98A0AC',
                  }}
                >
                  {notas.length} / 400
                </span>
              </div>
            </div>
          </div>

          {/* 7. SÍ / NO */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>07 · Sí / No</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span
                style={{
                  font: '500 11.5px/1 var(--font-geist-sans), sans-serif',
                  color: '#0E1116',
                }}
              >
                Requiere factura
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 32 }}>
                {/* Toggle switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={siNo}
                  onClick={() => setSiNo(!siNo)}
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 11,
                    background: siNo ? '#2F6BFF' : '#D8DCE2',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    flexShrink: 0,
                    transition: 'background .15s',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47,107,255,.18)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 3,
                      left: siNo ? 21 : 3,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      boxShadow: '0 1px 3px rgba(0,0,0,.18)',
                      transition: 'left .15s',
                    }}
                  />
                </button>
                <span
                  style={{
                    font: '500 13px var(--font-geist-sans), sans-serif',
                    color: siNo ? '#0E1116' : '#6B7482',
                  }}
                >
                  {siNo ? 'Sí' : 'No'}
                </span>
              </div>
              <span
                style={{
                  font: '400 11.5px/1.5 var(--font-geist-sans), sans-serif',
                  color: '#6B7482',
                }}
              >
                Si activas, se solicitará RFC al cerrar
              </span>
            </div>
          </div>

          {/* 8. UNA DE POCAS */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>08 · Una de pocas</p>
            <RadioTarjeta
              etiqueta="Modalidad de venta"
              opciones={OPCIONES_RADIO}
              valor={tipoVenta}
              onCambiar={setTipoVenta}
              ayuda="Define el tipo de contrato que se generará"
            />
          </div>

          {/* 9. ARCHIVO */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>09 · Archivo</p>
            <CampoArchivo
              etiqueta="Carga masiva de clientes"
              columnasEsperadas={['RFC', 'NOMBRE', 'SUCURSAL', 'IMPORTE']}
            />
          </div>

          {/* 10. CAPTURA EN REJILLA */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>10 · Captura en rejilla</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span
                style={{
                  font: '500 11.5px/1 var(--font-geist-sans), sans-serif',
                  color: '#0E1116',
                }}
              >
                Resultados de agosto
              </span>
              <CampoRejilla
                etiquetaColumnaActual="AGO"
                filas={FILAS_REJILLA}
                valores={rejillaValores}
                onCambiar={(id, val) =>
                  setRejillaValores((prev) => ({ ...prev, [id]: val }))
                }
              />
            </div>
          </div>

          {/* 11. SOLO LECTURA */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>11 · Solo lectura</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Campo
                etiqueta="Clave de indicador"
                valor="VTA_WALKIN"
                deshabilitado
                ayuda="Asignado automáticamente por el sistema"
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 4,
                }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#98A0AC"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ flexShrink: 0 }}
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <span
                  style={{
                    font: '400 11px var(--font-geist-mono), monospace',
                    color: '#98A0AC',
                  }}
                >
                  Fuente: dim.Indicador · MDM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sección 2: Los 8 estados ─────────────────────────────────────── */}
      <div style={tarjeta} id="estados">
        <p style={rotulo}>Sección 02</p>
        <h2 style={h2estilo}>Los 8 estados del campo</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 16,
          }}
        >
          {/* 1. Reposo */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>Reposo</p>
            <Campo etiqueta="Reposo" placeholder="Escribe aquí…" />
          </div>

          {/* 2. Foco */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>Foco</p>
            <Campo
              etiqueta="Foco"
              placeholder="Campo activo"
              estadoExterno="foco"
            />
          </div>

          {/* 3. Con valor */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>Con valor</p>
            <Campo
              etiqueta="Con valor"
              valor="Celaya Norte"
            />
          </div>

          {/* 4. Deshabilitado */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>Deshabilitado</p>
            <Campo
              etiqueta="Deshabilitado"
              valor="MG Celaya"
              deshabilitado
            />
          </div>

          {/* 5. Inválido */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>Inválido</p>
            <Campo
              etiqueta="Inválido"
              valor="celaya"
              error="«celaya» · nombre inválido · usa solo letras y espacios"
            />
          </div>

          {/* 6. Advertencia */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>Advertencia</p>
            <Campo
              etiqueta="Advertencia"
              valor="Juan Pérez"
              advertencia="Este cliente ya tiene 2 solicitudes abiertas"
            />
          </div>

          {/* 7. Guardando */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>Guardando</p>
            <Campo
              etiqueta="Guardando"
              valor="MG Celaya Norte"
              estadoExterno="guardando"
            />
          </div>

          {/* 8. Guardado */}
          <div>
            <p style={{ ...rotulo, marginBottom: 8 }}>Guardado</p>
            <Campo
              etiqueta="Guardado"
              valor="MG Celaya Norte"
              estadoExterno="guardado"
            />
          </div>
        </div>
      </div>

      {/* ── Sección 3: Formatos de formulario ────────────────────────────── */}
      <div style={{ ...tarjeta, marginBottom: 0 }} id="formatos">
        <p style={rotulo}>Sección 03</p>
        <h2 style={h2estilo}>Formatos de formulario</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Botón: abrir panel lateral */}
          <button
            type="button"
            onClick={() => setPanelAbierto(true)}
            style={{
              height: 32,
              padding: '0 15px',
              borderRadius: 5,
              border: '1px solid #D8DCE2',
              background: 'transparent',
              font: '600 12.5px var(--font-geist-sans), sans-serif',
              color: '#3D4551',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color .12s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#B0B6C0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D8DCE2'
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47,107,255,.14)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Abrir panel lateral
          </button>

          {/* Botón: abrir diálogo de confirmación */}
          <button
            type="button"
            onClick={() => setDialogoAbierto(true)}
            style={{
              height: 32,
              padding: '0 15px',
              borderRadius: 5,
              border: '1px solid #D8DCE2',
              background: 'transparent',
              font: '600 12.5px var(--font-geist-sans), sans-serif',
              color: '#3D4551',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color .12s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#B0B6C0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D8DCE2'
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47,107,255,.14)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Abrir diálogo de confirmación
          </button>

          {/* Nota de página completa */}
          <span
            style={{
              font: '400 11.5px var(--font-geist-sans), sans-serif',
              color: '#98A0AC',
            }}
          >
            Página completa:{' '}
            <span
              style={{
                font: '500 11.5px var(--font-geist-mono), monospace',
                color: '#6B7482',
              }}
            >
              /formularios/alta-mapeo
            </span>
          </span>
        </div>

        {/* Descripción de los 3 formatos */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12,
            marginTop: 20,
          }}
        >
          {[
            {
              rotulo: 'Panel lateral',
              desc: '480 px. 2–5 campos. Edita un renglón sin perder la lista de contexto.',
            },
            {
              rotulo: 'Diálogo de confirmación',
              desc: 'Solo para destrucción. Backdrop oscuro. El botón dice el acto.',
            },
            {
              rotulo: 'Página completa',
              desc: 'Más de 5 campos o pasos. Ocupa toda la mesa. Nunca un modal.',
            },
          ].map(({ rotulo: r, desc }) => (
            <div
              key={r}
              style={{
                border: '1px solid #EEF0F3',
                borderRadius: 6,
                padding: '12px 16px',
                background: '#FAFBFC',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: '.07em',
                  color: '#98A0AC',
                  textTransform: 'uppercase',
                  margin: '0 0 6px',
                }}
              >
                {r}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#5B6472',
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel lateral de ejemplo ─────────────────────────────────────── */}
      <PanelLateral
        titulo="Editar sucursal"
        subtitulo="CEL-N · MG CELAYA NORTE"
        abierto={panelAbierto}
        onCerrar={() => setPanelAbierto(false)}
        onGuardar={() => setPanelAbierto(false)}
        etiquetaGuardar="Guardar cambios"
        advertenciaGuardar="Pendiente de sincronizar con DWH"
      >
        <Campo
          etiqueta="Nombre de la sucursal"
          valor={panelNombre}
          onChange={setPanelNombre}
          requerido
          ayuda="Nombre comercial que aparece en reportes"
        />
        <CampoCifra
          etiqueta="Objetivo mensual de venta"
          prefijo="$"
          valor={panelMonto}
          onChange={setPanelMonto}
          ayuda="Sin IVA · miles de pesos"
          ancho={180}
        />
        <Campo
          etiqueta="Responsable"
          valor="Gerencia MG Celaya"
          deshabilitado
          ayuda="Asignado desde RRHH"
        />
      </PanelLateral>

      {/* ── Diálogo de confirmación de ejemplo ───────────────────────────── */}
      <DialogoConfirmacion
        abierto={dialogoAbierto}
        titulo="Eliminar el mapeo de cuenta"
        descripcion="Esta acción eliminará el mapeo entre la cuenta 4110-01 y el indicador VTA_WALKIN. Los registros históricos no se borran, pero dejarán de asociarse a este indicador."
        etiquetaConfirmar="Eliminar el mapeo"
        peligroso
        onConfirmar={() => setDialogoAbierto(false)}
        onCancelar={() => setDialogoAbierto(false)}
      />
    </Shell>
  )
}
