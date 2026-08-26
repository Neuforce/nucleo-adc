# AGENTS.md — Núcleo ADC

> Este archivo es el contexto que Claude Code, Cursor u otro AI debe leer **antes de escribir cualquier línea de código** en este proyecto. Refleja el estado real del repositorio al 25 de agosto de 2026.

---

## 1. Qué es este proyecto

**Núcleo ADC** es el sistema de gestión e indicadores del grupo automotriz ADC Traxión. Es una aplicación Next.js (App Router) que agrupa múltiples apps bajo un shell compartido.

**Stack:**
- Next.js 16 (App Router) · React 19
- Tailwind CSS 4 (solo para reset y variables globales; los componentes usan inline styles)
- Fuentes: Geist (sans) + Geist Mono — cargadas en `app/layout.tsx`
- Íconos: lucide-react
- Tema: next-themes (light/dark)

**Apps actuales:**
- `/` — Hub (T1): feed del día, cinta de indicadores
- `/indicadores` — Tablero (T2/T3): indicadores del puesto
- `/indicadores/tablero-puesto` — Tablero de puesto (T2): 6 indicadores, ritmo, composición
- `/formularios` — Demo de 11 controles y 8 estados
- `/reportes` — Demo de 6 formatos de reporte fijo (F1–F6)
- `/reportes/generados` — Demo de 3 plantillas de reporte IA (A/B/C)
- `/pantallas` — Catálogo de los 11 tipos de pantalla
- `/(public)/entrar` — Login

---

## 2. Estructura de archivos

```
app/
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
  (public)/
    page.tsx
    entrar/page.tsx                 ← Login

components/
  shell/
    shell.tsx                       ← Orquestador principal
    rail.tsx                        ← 56px, navy, nunca desaparece
    header.tsx                      ← 52px, fijo
    menu.tsx                        ← 296px, flota
    nucleo-panel.tsx                ← 340px, Núcleo AI
    busqueda-k.tsx                  ← Paleta ⌘K
    menu-usuario.tsx
    nucleo-logo.tsx
    types.ts                        ← App, MenuGrupo, MenuItem
    estados/
      cargando.tsx
      vacio.tsx
      sin-acceso.tsx
      error-panel.tsx
      sesion-expirada.tsx
      sin-conexion.tsx

  nucleo-adc/
    meta.ts                         ← Constantes del DS
    ui/
      campo.tsx                     ← Campo texto (8 estados)
      campo-cifra.tsx               ← Input numérico mono
      combobox.tsx                  ← Lista larga con búsqueda
      radio-tarjeta.tsx             ← Una de pocas con explicación
      campo-archivo.tsx             ← Drag-drop CSV
      campo-rejilla.tsx             ← Captura multi-fila
      pillora-filtro.tsx            ← Filtro píldora activo/inactivo
      selector-periodo.tsx          ← Mes contable + toggle
      chip-tipo.tsx
    indicadores/
      tarjeta.tsx                   ← 214×132px Form E
      tarjeta-operativa.tsx
      barra-progreso.tsx
      footer-comparativos.tsx
      franja-alarma.tsx
      cargando-tablero.tsx
      types.ts
      utils.ts
      index.ts
    tablero/
      uso1.tsx  uso2.tsx  uso4.tsx
      fila-indicador.tsx  celda-matriz.tsx
    formularios/
      panel-lateral.tsx             ← 480px, 2–5 campos
      dialogo-confirmacion.tsx      ← Solo destrucción
    reportes/
      marco-reporte.tsx             ← Cabeza+pie comunes F1–F6
      filtro-columna.tsx
      formato-f1.tsx  formato-f2.tsx  formato-f3.tsx
      formato-f4.tsx  formato-f5.tsx  formato-f6.tsx
    reportes-gen/
      marco-generado.tsx            ← 5 partes del reporte IA
      respuesta-directa.tsx         ← Tipo A
      listado-generado.tsx          ← Tipo B
      analisis-generado.tsx         ← Tipo C
    hub/
      cinta-indicadores.tsx
      feed-atencion.tsx  fila-atencion.tsx
      panel-nucleo-hub.tsx  cargando-hub.tsx
    panel-detalle/
      panel-detalle.tsx
      bloque-definicion.tsx
      bloque-nucleo-ficha.tsx
      bloque-periodos.tsx
      bloque-real-objetivo.tsx
      bloque-trayectoria.tsx

public/
  assets/                           ← Logos SVG/PNG
  fotos/                            ← Imágenes de vehículos
```

---

## 3. Cómo usar el Shell

**Toda pantalla de app lleva Shell.** No hay excepciones documentadas dentro de las rutas de app.

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutGrid, TrendingUp, BarChart, Settings } from 'lucide-react'
import { Shell } from '@/components/shell'
import type { App, MenuGrupo } from '@/components/shell'

const APPS: App[] = [
  { id: 'hub', nombre: 'Hub', Icono: LayoutGrid },
  { id: 'finanzas', nombre: 'Finanzas', Icono: TrendingUp, badge: 3 },
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
      appActiva="hub"
      nombreApp="Hub"
      periodo="Ago 2026"
      grupos={GRUPOS}
      itemActivo="puesto"
      onAppChange={(id) => { if (id === 'hub') router.push('/') }}
      onItemChange={(id) => console.log(id)}
    >
      {/* contenido de la mesa */}
    </Shell>
  )
}
```

**Tipos del Shell** (`components/shell/types.ts`):

```ts
interface App {
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
}
```

---

## 4. Componentes de captura

### Campo (texto corto)

```tsx
import { Campo } from '@/components/nucleo-adc/ui/campo'
import type { EstadoCampo } from '@/components/nucleo-adc/ui/campo'
```

**`EstadoCampo`:** `'reposo' | 'foco' | 'con-valor' | 'deshabilitado' | 'invalido' | 'advertencia' | 'guardando' | 'guardado'`

**Props clave:**

| Prop | Tipo | Notas |
|---|---|---|
| `etiqueta` | `string` | Requerido |
| `requerido` | `boolean` | Marca el campo como obligatorio |
| `ayuda` | `string` | Texto de ayuda bajo el control |
| `error` | `string` | Activa estado `invalido`, borde `#C2352B` |
| `advertencia` | `string` | Activa estado `advertencia` |
| `valor` | `string` | Valor controlado |
| `onChange` | `(v: string) => void` | |
| `placeholder` | `string` | |
| `maxLength` | `number` | |
| `deshabilitado` | `boolean` | |
| `estadoExterno` | `EstadoCampo` | Para controlar el estado desde fuera |
| `isDark` | `boolean` | |
| `ancho` | `number \| string` | |
| `tipo` | `'text' \| 'email' \| 'password' \| 'tel'` | |
| `children` | `ReactNode` | Slot para lista, combobox, etc. |

Errores van en el campo con borde rojo. **Nunca en toast.**

### CampoCifra

```tsx
import { CampoCifra } from '@/components/nucleo-adc/ui/campo-cifra'
```

Input numérico alineado a la derecha, Geist Mono, `tabular-nums`. Admite prefijo (`$`) o sufijo (`%`) dentro del control.

**Props clave:**

| Prop | Tipo | Notas |
|---|---|---|
| `etiqueta` | `string` | Requerido |
| `requerido` | `boolean` | |
| `valor` | `string` | |
| `onChange` | `(v: string) => void` | |
| `ayuda` | `string` | |
| `error` | `string` | |
| `prefijo` | `string` | e.g. `'$'` |
| `sufijo` | `string` | e.g. `'%'` |
| `ancho` | `number` | |
| `deshabilitado` | `boolean` | |
| `isDark` | `boolean` | |

### Combobox

```tsx
import { Combobox } from '@/components/nucleo-adc/ui/combobox'
import type { OpcionCombobox } from '@/components/nucleo-adc/ui/combobox'
```

Para listas largas (12+ ítems) con búsqueda. Muestra la clave en Geist Mono (lo que se dicta por teléfono).

**`OpcionCombobox`:** `{ clave: string; etiqueta: string; grupo?: string }`

**Props clave:**

| Prop | Tipo | Notas |
|---|---|---|
| `etiqueta` | `string` | Requerido |
| `requerido` | `boolean` | |
| `opciones` | `OpcionCombobox[]` | |
| `valor` | `string` | Clave seleccionada |
| `onSeleccionar` | `(clave: string, etiqueta: string) => void` | |
| `ayuda` | `string` | |
| `error` | `string` | |
| `placeholder` | `string` | |
| `isDark` | `boolean` | |
| `ancho` | `number \| string` | |

### RadioTarjeta

```tsx
import { RadioTarjeta } from '@/components/nucleo-adc/ui/radio-tarjeta'
```

Radio group en formato de tarjeta con explicación. Usar cuando la elección cambia el significado del registro.

**`OpcionRadio`:** `{ valor: string; titulo: string; descripcion?: string }`

**Props clave:**

| Prop | Tipo | Notas |
|---|---|---|
| `etiqueta` | `string` | Requerido |
| `opciones` | `OpcionRadio[]` | |
| `valor` | `string` | |
| `onCambiar` | `(v: string) => void` | |
| `isDark` | `boolean` | |
| `ayuda` | `string` | |

### CampoArchivo

```tsx
import { CampoArchivo } from '@/components/nucleo-adc/ui/campo-archivo'
```

Carga masiva CSV con drag-drop. Declara columnas esperadas antes de cargar; muestra resultado fila por fila.

**`ResultadoFila`:** `{ fila: number; estado: 'ok' | 'error'; mensaje?: string }`

**Props clave:**

| Prop | Tipo | Notas |
|---|---|---|
| `etiqueta` | `string` | Requerido |
| `columnasEsperadas` | `string[]` | e.g. `['CTA', 'SCTA', 'DESTINO', 'NOTAS']` |
| `onArchivo` | `(archivo: File) => void` | |
| `resultados` | `ResultadoFila[]` | Para mostrar estado fila por fila tras carga |
| `isDark` | `boolean` | |

### CampoRejilla

```tsx
import { CampoRejilla } from '@/components/nucleo-adc/ui/campo-rejilla'
import type { FilaRejilla } from '@/components/nucleo-adc/ui/campo-rejilla'
```

Captura del mismo dato repetido en muchas filas. Siempre muestra el periodo anterior como referencia.

**`FilaRejilla`:** `{ id: string; nombre: string; valorAnterior: number | null; etiquetaAnterior: string }`

**Props clave:**

| Prop | Tipo | Notas |
|---|---|---|
| `etiquetaColumnaActual` | `string` | e.g. `'AGO'` |
| `filas` | `FilaRejilla[]` | |
| `valores` | `Record<string, string>` | `id → valor capturado` |
| `onCambiar` | `(id: string, valor: string) => void` | |
| `isDark` | `boolean` | |

---

## 5. Componentes de indicadores

### TarjetaIndicador

```tsx
import { TarjetaIndicador } from '@/components/nucleo-adc/indicadores/tarjeta'
import type { Indicador, Tono, Alarma } from '@/components/nucleo-adc/indicadores/types'
```

**Props clave:**

| Prop | Tipo | Notas |
|---|---|---|
| `indicador` | `Indicador` | Datos del indicador desde la API |
| `tono` | `'normal' \| 'destacado'` | `'destacado'` → fondo navy `#00244D` |
| `alarma` | `Alarma` | Agrega punto + `border-left: 3px` + franja 34px al pie |
| `onDetalle` | `() => void` | Abre el panel de detalle (460px) |
| `isDark` | `boolean` | |

**Reglas críticas de la tarjeta:**
- Dimensiones fijas: **214×132 px** · `padding: 11px 15px` · `border-radius: 6px`
- `avanceObjetivo` llega como decimal (e.g. `0.831`) — multiplicar ×100 antes de mostrar
- `indicador.objetivo === null` → sin barra, sin porcentaje, sin diagonal. No mostrar `0%` ni `100%`
- `estatusCalculo === 'SIN_OPERACION'` → mostrar `—`, **nunca barra roja con 0%**
- La alarma **no pinta la tarjeta de rojo**: solo agrega punto de color + `border-left: 3px` + franja de motivo de 34 px al pie
- `varSPLM` / `varSPLY` nulos → mostrar `—`, nunca `0%` ni `∞`
- El color de estado lo decide `direccionDeseable` del catálogo, **no el signo del número**
- Máximo 2 tarjetas navy (`tono='destacado'`) por fila

### PanelLateral (formularios)

```tsx
import { PanelLateral } from '@/components/nucleo-adc/formularios/panel-lateral'
```

Panel de 480 px que entra desde la derecha. Para editar un renglón de una lista sin perderla de vista. 2–5 campos.

**Props clave:**

| Prop | Tipo | Notas |
|---|---|---|
| `titulo` | `string` | |
| `subtitulo` | `string` | |
| `abierto` | `boolean` | |
| `onCerrar` | `() => void` | |
| `onGuardar` | `() => void` | |
| `etiquetaGuardar` | `string` | Default `'Guardar'` |
| `advertenciaGuardar` | `string` | e.g. `'Queda pendiente de aplicar al DWH'` |
| `guardando` | `boolean` | |
| `children` | `ReactNode` | Los campos del formulario |
| `isDark` | `boolean` | |

---

## 6. Reportes

### Formatos fijos (F1–F6)

```tsx
import { MarcoReporte } from '@/components/nucleo-adc/reportes/marco-reporte'
import type { FiltroReporte } from '@/components/nucleo-adc/reportes/marco-reporte'
import { FormatoF1 } from '@/components/nucleo-adc/reportes/formato-f1'
// Disponibles: formato-f1 … formato-f6
```

`MarcoReporte` envuelve cualquier formato: proporciona cabecera, filtros como chips, botones Excel/PDF/Programar y pie de linaje mono.

**Props de `MarcoReporte`:**

| Prop | Tipo | Notas |
|---|---|---|
| `entidad` | `string` | e.g. `'MG CELAYA'` |
| `periodo` | `string` | e.g. `'AGOSTO 2026'` |
| `titulo` | `string` | |
| `descripcion` | `string` | |
| `filtros` | `FiltroReporte[]` | `{ etiqueta, porDefecto?, onQuitar? }` |
| `fuente` | `string` | e.g. `'DWH · vw_EstadoResultados'` |
| `corte` | `string` | e.g. `'27 AGO 04:12'` |
| `unidad` | `string` | e.g. `'CIFRAS EN MXN SIN IVA'` |
| `generadoPor` | `string` | |
| `generadoEn` | `string` | |
| `onExcel` | `() => void` | |
| `onPdf` | `() => void` | |
| `onProgramar` | `() => void` | |
| `children` | `ReactNode` | El formato concreto (F1–F6) |
| `isDark` | `boolean` | |

Un reporte nuevo elige uno de los seis formatos existentes. **No se inventa un séptimo.**

### Reportes generados (MCP)

```tsx
import { MarcoGenerado } from '@/components/nucleo-adc/reportes-gen/marco-generado'
import type { AccionGenerada, AlcanceGenerado } from '@/components/nucleo-adc/reportes-gen/marco-generado'
import { RespuestaDirecta } from '@/components/nucleo-adc/reportes-gen/respuesta-directa'
import { ListadoGenerado } from '@/components/nucleo-adc/reportes-gen/listado-generado'
import { AnalisisGenerado } from '@/components/nucleo-adc/reportes-gen/analisis-generado'
```

`MarcoGenerado` tiene 5 partes: Respuesta · Alcance · Cuerpo · Cómo se obtuvo (colapsable) · Acciones (máx 3).

**Props de `MarcoGenerado`:**

| Prop | Tipo | Notas |
|---|---|---|
| `respuesta` | `string` | Frase que contesta la pregunta tal como se hizo |
| `alcance` | `AlcanceGenerado` | `{ entidad, periodo, corte?, filtros? }` |
| `cuerpo` | `ReactNode` | El componente de tipo A, B o C |
| `comoSeObtuvo` | `string` | Plegado, siempre presente |
| `fuentes` | `string[]` | Sin fuente, no se publica |
| `acciones` | `AccionGenerada[]` | Máx 3. `{ texto, esPrimaria?, onClick? }` |
| `isDark` | `boolean` | |

**Elección del tipo de cuerpo:**
- **Tipo A** → una cifra directa → `RespuestaDirecta`
- **Tipo B** → lista → `ListadoGenerado` (máx 20 filas, máx 6 columnas)
- **Tipo C** → serie o comparación → `AnalisisGenerado`
- Si no encaja en ninguno: no se dibuja, se pregunta al usuario

---

## 7. Los 11 tipos de pantalla

| Código | Nombre | Pregunta del usuario | Cuándo |
|--------|--------|----------------------|--------|
| T1 | Hub del núcleo | ¿Qué me espera hoy? | 1 por usuario |
| T2 | Tablero de puesto | ¿Cómo voy yo este mes? | Inicio de cada app |
| T3 | Tablero de área o sucursal | ¿Cómo va mi gente? | Para quien dirige |
| T4 | Listado de trabajo | Encuéntrame el caso. | La más frecuente |
| T5 | Expediente | Todo sobre este caso. | Detalle de registro |
| T6 | Captura | Necesito registrar algo. | Una sola pantalla |
| T7 | Flujo por pasos | Un trámite largo. | Solo si hay dependencia |
| T8 | Bandeja de autorizaciones | Autorizo o no. | Decidir en serie |
| T9 | Reporte fijo | El reporte de siempre. | Seis formatos |
| T10 | Núcleo a pantalla completa | Déjame preguntar. | Cuando se investiga |
| T11 | Configuración | Cambiar cómo funciona. | Catálogos y roles |

**Regla de elección:** La frase del usuario decide el tipo, no el módulo. Si no encaja en ninguno de los 11, la conversación es sobre el tipo faltante, no sobre inventar uno nuevo.

---

## 8. Reglas no negociables (las 13)

### 1. Color — lo que el color puede y no puede hacer

- **Navy `#00244D` es estructura**, no decoración: rail, encabezado, tarjeta destacada. Máximo 1 elemento navy por zona visual y 2 tarjetas navy por fila.
- **Azul `#2F6BFF` es acción**: botón primario, foco, enlaces. Aparece una sola vez por pantalla como acción principal. No se usa como decorativo ni en múltiples controles simultáneos.
- **Verde / ámbar / rojo son estado calculado**, nunca asignado a mano:
  - ≥ 100% → verde (`#0B7A53` texto, `#0E8A5F` relleno)
  - 80–99% → ámbar (`#8A5A12` texto, `#B7791F` relleno)
  - < 80% → rojo (`#C2352B`)
  - El color lo gobierna `direccionDeseable` del dato, no el signo aritmético. Nunca hardcodear `▲ = verde`.
- **Cian `#3ED0EA` solo dentro del gradiente del símbolo.** Nunca sobre fondos claros.
- **Sin color decorativo.** Navy estructura, azul acción, verde/ámbar/rojo solo desviación. Si un color no cumple ninguna de estas funciones, no va.

### 2. Tipografía — la división es absoluta

- **Geist** para todo texto: títulos, cuerpo, etiquetas, UI.
- **Geist Mono** para todo dato: números, importes, porcentajes, fechas, folios, claves, comparativos M/A.
- `font-variant-numeric: tabular-nums` en **todo** Geist Mono sin excepción.
- Tamaño mínimo absoluto: **11 px** (solo rótulos mono). Cuerpo mínimo: **11.5 px**. Nunca bajar de ahí.
- Dinero en tarjetas: abreviado `$25.5M`. En tabla y panel: exacto.
- Variación > 300%: escribir `×N`, no porcentaje. Base cero o nulo: `—`, nunca `0%` ni `∞`.

### 3. Espaciado — una sola ley

- **Todo múltiplo de 4 px.** Ningún valor fuera de la cuadrícula de 4 px: ni 3, ni 5, ni 10, ni 18.
- Excepción documentada: gap de íconos en el rail es 9 px (definido en el DS, no inventado aquí).

### 4. Radios de borde — mapa fijo

- **5 px** → botones, campos, filtros, controles.
- **6 px** → tarjetas, paneles, superficies. Es el radio por defecto (`--radius: 0.375rem`).
- **7 px** → cápsulas de app en el rail (34×34 px) únicamente.
- No inventar radios intermedios. Si el elemento no aparece en la tabla de `design.md §6`, usar 6 px.

### 5. Sombras — solo lo que flota

- Sombra **únicamente** en elementos que se posan sobre la UI: menús abiertos, Núcleo AI, paleta ⌘K, menú de usuario, panel de sesión caducada.
- Tarjetas, paneles y superficies en reposo: **borde, nunca sombra**.

### 6. Botones — un primario por pantalla

- **Un solo botón primario navy por pantalla.** El resto son contorno (`border: 1px solid #D8DCE2`) o ghost (`color: #2F6BFF`, sin fondo).
- Rojo relleno (`background: #C2352B`) solo en el interior del modal de confirmación destructiva. En la mesa: solo contorno rojo.
- El anillo de foco **nunca se quita**: `box-shadow: 0 0 0 3px rgba(47,107,255,.14)`.

### 7. Shell — zonas inamovibles

- Rail: **56 px** ancho, navy sólido. **Nunca desaparece. Nunca hace scroll.**
- Encabezado: **52 px** alto. **Fijo siempre.** No hace scroll. No se duplica por pantalla.
- Menú de pantallas: **296 px**, nace encogido, se posa sobre la mesa sin empujarla.
- Núcleo AI: **340 px**, se posa sobre la mesa. No reserva espacio permanente.
- Panel de detalle de indicador: **460 px**, entra por la derecha.
- **La página no hace scroll: lo hace la mesa.** El encabezado y los filtros siempre visibles.

### 8. Indicadores — reglas de la tarjeta

- Dimensiones oficiales (Form E): **214×132 px**. `padding: 11px 15px` · `border-radius: 6px`.
- Sin `objetivo` (null en la API) → **sin barra, sin porcentaje, sin diagonal**. No mostrar 0% ni 100%.
- `EstatusCalculo = 'SIN_OPERACION'` → mostrar `—` o "sin operación". **Nunca barra roja con 0%.**
- La alarma no pinta la tarjeta de rojo. Solo agrega: punto de color + `border-left: 3px` + franja de motivo de **34 px** al pie.
- `avanceObjetivo` llega como decimal (0.831). Multiplicar × 100 antes de mostrar.
- `varSPLM` / `varSPLY` = null → mostrar `—`. Nunca `0%` ni `∞`.

### 9. Datos — lo que el color no puede decidir

- El color de estado lo determina `direccionDeseable` del catálogo, **no el signo del número**.
- Los comparativos M y A comparan **el mismo número de días transcurridos**, no meses cerrados.
- Las tarjetas no suman: totales solo si ese nivel de análisis existe en `dim.Indicador_NivelAnalisis`.
- Mostrar siempre `fecha` (fecha de corte del dato), nunca la fecha de hoy.

### 10. Gráficas — una por clase, cuatro trazos distintos

- Clase DESEMPEÑO → líneas acumulativas, selector MES/AÑO. **Un solo bloque, nunca dos gráficas.**
- Clase CONTROL → banda con dispersión. **Lo que se lee es la dispersión, no la pendiente.**
- Clase REFERENCIA → barras paralelas. **Nunca verde ni rojo**: solo navy vs. gris.
- Clase PERCEPCIÓN → barras apiladas. **El `n` siempre visible.**
- SPLM y SPLY se cortan al **mismo día del mes**. Nunca comparar días desiguales.

### 11. Estados del sistema — seis, siempre con shell

- Los 6 estados (Cargando, Vacío, Sin permiso, Error, Sesión caducada, Sin conexión) **nunca ocultan el rail ni el encabezado**.
- Cargando: esqueleto con la forma real de la pantalla. **Sin spinner genérico. Sin animación de pulso.**
- Vacío: dice qué va a aparecer ahí y cómo se crea. Un solo botón de acción.
- Error: título en español + folio de referencia en Geist Mono + dos botones (reintentar / reportar).
- Sesión caducada: **único modal permitido sobre la mesa**. Al reautenticar vuelve a la misma ruta.

### 12. Formularios y controles

- **Cero modales para trabajar.** Los modales solo confirman destrucción.
- Todos los objetivos táctiles (< 1,279 px): **44 px** de alto sin excepción.
- Errores de validación: en el campo con borde `#C2352B`. **Nunca en toast.**
- Error de credenciales en login: borde del campo. **Nunca en toast.**

### 13. Copy y voz

- **Español claro**. Sin emojis de sistema. Sin texto en inglés del framework visible al usuario.
- **Siempre con el número enfrente.** "2 solicitudes vencen hoy" no "Tienes pendientes".
- Tarjeta operativa: **siempre en segunda persona**. "Te faltan 98. Quedan 9 días."
- La AI no promete: explica y ofrece una acción. **Máximo 3 acciones ejecutables por respuesta.**
- Todo lo que escribe la máquina lleva el símbolo Núcleo y cita su fuente. **Sin fuente, no se publica.**

---

## 9. Patrones de composición

### T1 Hub

```
Shell
  └─ CintaIndicadores    (scroll horizontal, ≤8 tarjetas)
  └─ FeedAtención        (pendientes de todas las apps)
```

### T2 Tablero de puesto

```
Shell
  └─ grid 6 columnas → 6× TarjetaIndicador (en orden del proceso)
  └─ GraficoRitmo        (31 barras, línea diagonal SVG)
  └─ PanelComposicion    (qué mueve mi X%)
  └─ Strip Núcleo 44px derecha
```

### T4 Listado de trabajo

```
Shell
  └─ Header: búsqueda + filtros activos + resumen "N filas"
  └─ Tabla con FiltroColumna en cada encabezado
  └─ Pie: sumas de lo filtrado
```

### T6 Captura

```
Shell
  └─ h1 + descripción
  └─ grid 2 columnas max
  └─ Campos (Campo, CampoCifra, Combobox, RadioTarjeta, etc.)
  └─ Barra de acción fija al pie (borrador auto + Guardar)
```

### T9 Reporte fijo

```
Shell
  └─ MarcoReporte (cabeza + filtros + pie)
     └─ FormatoF1 | F2 | F3 | F4 | F5 | F6
```

---

## 10. Qué está prohibido

- **Colores decorativos o de marca aplicados a datos.** Navy, azul, cian: solo en sus roles.
- **Hardcodear `▲ = verde`.** El color lo decide `direccionDeseable` del catálogo.
- **Spinner genérico como estado de carga.** Usar esqueleto con la forma real de la pantalla. Sin animación de pulso.
- **Modal para flujos de trabajo.** Modales solo confirman destrucción (`dialogo-confirmacion.tsx`).
- **Más de un botón primario navy por pantalla.**
- **Rojo relleno fuera del modal de confirmación destructiva.** En la mesa: solo contorno rojo.
- **Sombra en tarjetas o paneles en reposo.** Solo en elementos flotantes (menús, paneles que se posan sobre la mesa).
- **Radios de borde inventados.** Solo 5 px (controles), 6 px (tarjetas/paneles), 7 px (cápsulas del rail).
- **Espaciado fuera de la cuadrícula de 4 px** (salvo gap 9 px del rail, definido en el DS).
- **Texto de UI en inglés visible al usuario.** Todo en español claro.
- **Toast para errores de validación o credenciales.** Error junto al campo, siempre.
- **Tipos de pantalla que no sean T1–T11.** Si no encaja, la conversación es sobre el tipo faltante.
- **Un séptimo formato de reporte fijo.** Máximo 6. Si el caso nuevo no encaja, revisar los formatos existentes.
- **Mostrar `0%` o `∞` cuando base es cero o nulo.** Mostrar `—`.
- **Variación > 300% como porcentaje.** Escribir `×N`.
- **Comparar meses completos vs. días transcurridos.** SPLM y SPLY se cortan al mismo día del mes.
- **Publicar datos sin citar la fuente.** Sin fuente, no se publica.
- **Quitar el anillo de foco.** `box-shadow: 0 0 0 3px rgba(47,107,255,.14)` siempre.
- **Inventar un octavo estado del sistema.** Solo los 6 documentados en `components/shell/estados/`.
- **Duplicar el encabezado o el rail por pantalla.** Son zonas únicas del shell.

---

## 11. Convenciones de código

- Todas las pantallas: `'use client'` al inicio
- **Inline styles para valores exactos del DS** — no usar clases Tailwind en componentes propios
- `useRouter` de `next/navigation` para navegación programática
- `isDark` desde `useTheme()` de `next-themes` (`resolvedTheme === 'dark'`)
- **Datos de ejemplo en MAYÚSCULAS** como constante al nivel del módulo (ver `app/indicadores/page.tsx`)
- **Props en español**: `etiqueta`, `valor`, `isDark`, `onCerrar`, `onGuardar`, `abierto`, etc.
- **Exportaciones nombradas** en componentes; `export default` solo en pages (`app/**/page.tsx`)
- No usar Tailwind para colores, espaciados ni bordes del DS — esos van en `style={{}}` con los valores exactos de `design.md`

---

## 12. Referencia rápida de medidas

| Elemento | Medida |
|---|---|
| Rail | 56 px ancho |
| Encabezado | 52 px alto |
| Menú de pantallas | 296 px ancho |
| Panel Núcleo AI | 340 px ancho |
| Panel de detalle indicador | 460 px ancho |
| Panel lateral de formulario | 480 px ancho |
| Tarjeta de indicador (Form E) | 214×132 px |
| Cápsula de app en el rail | 34×34 px |
| Franja de alarma | 34 px alto |
| Control desktop | 30 px alto |
| Control táctil (< 1,279 px) | 44 px alto |
| Radio botones/campos | 5 px |
| Radio tarjetas/paneles | 6 px |
| Radio cápsulas rail | 7 px |
| Espaciado | Múltiplos de 4 px |
| Gap íconos rail | 9 px (excepción documentada) |

---

## 13. Documentación de referencia

- `CLAUDE.md` — Reglas no negociables del DS (este mismo conjunto, fuente de verdad)
- `design.md` — Design System exhaustivo (22 secciones): colores, tipografía, espaciado, shell, componentes, estados, indicadores, alarmas, gráficas, formularios, API, copy
- `styles/globals.css` — Variables CSS en oklch para Tailwind
- `components/nucleo-adc/meta.ts` — Constantes del DS en TypeScript
- `components/shell/types.ts` — Tipos `App`, `MenuGrupo`, `MenuItem`
- `components/nucleo-adc/indicadores/types.ts` — Tipos `Indicador`, `Tono`, `Alarma`
