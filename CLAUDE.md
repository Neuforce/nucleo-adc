# Núcleo ADC

> **Lee esta sección de reglas antes de escribir cualquier línea de código o JSX.**
> La referencia completa está en `design.md`. Estas reglas son los puntos no negociables.

---

## ⛔ Reglas estrictas del Design System

### Color — lo que el color puede y no puede hacer

- **Navy `#00244D` es estructura**, no decoración: rail, encabezado, tarjeta destacada. Máximo **1 elemento navy por zona visual** y **2 tarjetas navy por fila**.
- **Azul `#2F6BFF` es acción**: botón primario, foco, enlaces. Aparece **una sola vez por pantalla** como acción principal. No se usa como decorativo ni en múltiples controles simultáneos.
- **Verde / ámbar / rojo son estado calculado**, nunca asignado a mano:
  - ≥ 100% → verde (`#0B7A53` texto, `#0E8A5F` relleno)
  - 80–99% → ámbar (`#8A5A12` texto, `#B7791F` relleno)
  - < 80% → rojo (`#C2352B`)
  - El color lo gobierna `direccionDeseable` del dato, no el signo aritmético. Nunca hardcodear `▲ = verde`.
- **Cian `#3ED0EA` solo dentro del gradiente del símbolo.** Nunca sobre fondos claros.
- **Sin color decorativo.** Navy estructura, azul acción, verde/ámbar/rojo solo desviación. Si un color no cumple ninguna de estas funciones, no va.

### Tipografía — la división es absoluta

- **Geist** para todo texto: títulos, cuerpo, etiquetas, UI.
- **Geist Mono** para todo dato: números, importes, porcentajes, fechas, folios, claves, comparativos M/A.
- `font-variant-numeric: tabular-nums` en **todo** Geist Mono sin excepción.
- Tamaño mínimo absoluto: **11 px** (solo rótulos mono). Cuerpo mínimo: **11.5 px**. Nunca bajar de ahí.
- Dinero en tarjetas: abreviado `$25.5M`. En tabla y panel: exacto.
- Variación > 300%: escribir `×N`, no porcentaje. Base cero o nulo: `—`, nunca `0%` ni `∞`.

### Espaciado — una sola ley

- **Todo múltiplo de 4 px.** Ningún valor fuera de la cuadrícula de 4 px: ni 3, ni 5, ni 10, ni 18.
- Excepción documentada: gap de íconos en el rail es 9 px (definido en el DS, no inventado aquí).

### Radios de borde — mapa fijo

- **5 px** → botones, campos, filtros, controles.
- **6 px** → tarjetas, paneles, superficies. Es el radio por defecto (`--radius: 0.375rem`).
- **7 px** → cápsulas de app en el rail (34×34 px) únicamente.
- No inventar radios intermedios. Si el elemento no aparece en la tabla de `design.md §6`, usar 6 px.

### Sombras — solo lo que flota

- Sombra **únicamente** en elementos que se posan sobre la UI: menús abiertos, Núcleo AI, paleta ⌘K, menú de usuario, panel de sesión caducada.
- Tarjetas, paneles y superficies en reposo: **borde, nunca sombra**.

### Botones — un primario por pantalla

- **Un solo botón primario navy por pantalla.** El resto son contorno (`border: 1px solid #D8DCE2`) o ghost (`color: #2F6BFF`, sin fondo).
- Rojo relleno (`background: #C2352B`) solo en el interior del modal de confirmación destructiva. En la mesa: solo contorno rojo.
- El anillo de foco **nunca se quita**: `box-shadow: 0 0 0 3px rgba(47,107,255,.14)`.

### Shell — zonas inamovibles

- Rail: **56 px** ancho, navy sólido. **Nunca desaparece. Nunca hace scroll.**
- Encabezado: **52 px** alto. **Fijo siempre.** No hace scroll. No se duplica por pantalla.
- Menú de pantallas: **296 px**, nace encogido, se posa sobre la mesa sin empujarla.
- Núcleo AI: **340 px**, se posa sobre la mesa. No reserva espacio permanente.
- Panel de detalle de indicador: **460 px**, entra por la derecha.
- **La página no hace scroll: lo hace la mesa.** El encabezado y los filtros siempre visibles.

### Indicadores — reglas de la tarjeta

- Dimensiones oficiales (Form E): **214×132 px**. `padding: 11px 15px` · `border-radius: 6px`.
- Sin `objetivo` (null en la API) → **sin barra, sin porcentaje, sin diagonal**. No mostrar 0% ni 100%.
- `EstatusCalculo = 'SIN_OPERACION'` → mostrar `—` o "sin operación". **Nunca barra roja con 0%.**
- La alarma no pinta la tarjeta de rojo. Solo agrega: punto de color + `border-left: 3px` + franja de motivo de **34 px** al pie.
- `avanceObjetivo` llega como decimal (0.831). Multiplicar × 100 antes de mostrar.
- `varSPLM` / `varSPLY` = null → mostrar `—`. Nunca `0%` ni `∞`.

### Datos — lo que el color no puede decidir

- El color de estado lo determina `direccionDeseable` del catálogo, **no el signo del número**.
- Los comparativos M y A comparan **el mismo número de días transcurridos**, no meses cerrados.
- Las tarjetas no suman: totales solo si ese nivel de análisis existe en `dim.Indicador_NivelAnalisis`.
- Mostrar siempre `fecha` (fecha de corte del dato), nunca la fecha de hoy.

### Gráficas — una por clase, cuatro trazos distintos

- Clase DESEMPEÑO → líneas acumulativas, selector MES/AÑO. **Un solo bloque, nunca dos gráficas.**
- Clase CONTROL → banda con dispersión. **Lo que se lee es la dispersión, no la pendiente.**
- Clase REFERENCIA → barras paralelas. **Nunca verde ni rojo**: solo navy vs. gris.
- Clase PERCEPCIÓN → barras apiladas. **El `n` siempre visible.**
- SPLM y SPLY se cortan al **mismo día del mes**. Nunca comparar días desiguales.

### Estados del sistema — seis, siempre con shell

- Los 6 estados (Cargando, Vacío, Sin permiso, Error, Sesión caducada, Sin conexión) **nunca ocultan el rail ni el encabezado**.
- Cargando: esqueleto con la forma real de la pantalla. **Sin spinner genérico. Sin animación de pulso.**
- Vacío: dice qué va a aparecer ahí y cómo se crea. Un solo botón de acción.
- Error: título en español + folio de referencia en Geist Mono + dos botones (reintentar / reportar).
- Sesión caducada: **único modal permitido sobre la mesa**. Al reautenticar vuelve a la misma ruta.

### Formularios y controles

- **Cero modales para trabajar.** Los modales solo confirman destrucción.
- Todos los objetivos táctiles (< 1,279 px): **44 px** de alto sin excepción.
- Errores de validación: en el campo con borde `#C2352B`. **Nunca en toast.**
- Error de credenciales en login: borde del campo. **Nunca en toast.**

### Copy y voz

- **Español claro**. Sin emojis de sistema. Sin texto en inglés del framework visible al usuario.
- **Siempre con el número enfrente.** "2 solicitudes vencen hoy" no "Tienes pendientes".
- Tarjeta operativa: **siempre en segunda persona**. "Te faltan 98. Quedan 9 días."
- La AI no promete: explica y ofrece una acción. **Máximo 3 acciones ejecutables por respuesta.**
- Todo lo que escribe la máquina lleva el símbolo Núcleo y cita su fuente. **Sin fuente, no se publica.**

### Lo que NO existe en este sistema

- Colores decorativos o de marca aplicados a datos.
- Spinner genérico como estado de carga.
- Modales para flujos de trabajo (solo para confirmación destructiva).
- Tipos de pantalla que no sean los 11 documentados en `design.md §17`.
- Toast para errores de validación o credenciales.
- Sombras en tarjetas o paneles en reposo.
- Radios de borde inventados fuera del mapa de `design.md §6`.
- `▲ = verde` hardcodeado — el color lo decide `direccionDeseable`.

---

## Proyecto

Aplicación Next.js para **Núcleo ADC** — sistema de gestión e indicadores para el grupo automotriz ADC Traxión.

## Stack

- Framework: Next.js (App Router)
- Estilos: Tailwind CSS
- Componentes: shadcn/ui
- Fuentes: Geist (sans) + Geist Mono — cargadas en `app/layout.tsx`

## Colores base

| Nombre | Hex | Variable CSS |
|---|---|---|
| Navy | `#00244D` | `--rail` / `--sidebar-primary` |
| Azul acción | `#2F6BFF` | `--primary` / `--acc` |
| Fondo de trabajo | `#F4F5F7` | `--mesa` |
| Texto | `#0E1116` | `--foreground` / `--ink` |

> Ver paleta completa (~60 colores con usos exactos) en `design.md §3`.

## Tipografía

| Variable CSS | Fuente | Aplica a |
|---|---|---|
| `--font-geist-sans` | Geist | Todo texto, UI, etiquetas |
| `--font-geist-mono` | Geist Mono | Todo número, fecha, folio, clave |

> Ver escala tipográfica completa (16 roles) en `design.md §4`.

## Estructura de componentes

- `components/nucleo-adc/` — Componentes propios del proyecto
- `components/nucleo-adc/meta.ts` — Constantes del DS (colores, fuentes)
- `components/ui/` — Componentes base de shadcn/ui
- `packages/ui` — (futuro) `<TarjetaIndicador/>`, `<AppIcon/>`, `<NucleoLogo/>`
- `packages/shell` — (futuro) estados del sistema: `<Cargando/>`, `<Vacio/>`, etc.

## Referencia rápida de medidas

| Elemento | Medida |
|---|---|
| Rail | 56 px ancho |
| Encabezado | 52 px alto |
| Menú de pantallas | 296 px ancho |
| Panel Núcleo AI | 340 px ancho |
| Panel de detalle indicador | 460 px ancho |
| Tarjeta de indicador (Form E) | 214×132 px |
| Control desktop | 30 px alto |
| Control táctil | 44 px alto |
| Radio por defecto | 6 px (`--radius: 0.375rem`) |
| Espaciado | múltiplos de 4 px |

## Documentación completa

- `design.md` — Design System exhaustivo (22 secciones): colores, tipografía, espaciado, shell, componentes, estados, indicadores, alarmas, gráficas, formularios, API, copy.
- `styles/globals.css` — Variables CSS en oklch para Tailwind.
