# Núcleo ADC

Este repositorio **es el Design System de Núcleo**: tokens, 13 reglas, shell, componentes y 11 tipos de pantalla. La app Next.js es un **catálogo vivo** — Hub, tablero, reportes y formularios son ejemplos que ejercitan el sistema, con datos de muestra, no el producto.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) — App Router |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com) |
| Componentes base | [shadcn/ui](https://ui.shadcn.com) |
| Tipografía | [Geist](https://vercel.com/font) Sans + Mono |
| Tema | [next-themes](https://github.com/pacocoursey/next-themes) — dark mode automático vía CSS custom properties |

---

## Clonar y correr

```bash
# Clonar
git clone https://github.com/christiansilv4/nucleo-adc.git
cd nucleo-adc

# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

```bash
# Build de producción
npm run build
npm start

# Verificar tipos
./node_modules/.bin/tsc --noEmit
```

> **Node requerido:** ≥ 18.17

---

## Estructura de carpetas

```
nucleo-adc/
├── app/                        # Catálogo vivo (ejemplos de pantalla)
│   ├── page.tsx                # Ejemplo T1 Hub
│   ├── indicadores/            # Ejemplo T2/T3 tablero
│   │   └── tablero-puesto/     # Ejemplo T2 puesto
│   ├── formularios/            # Catálogo de controles y estados
│   ├── reportes/               # Catálogo F1–F6
│   │   └── generados/          # Catálogo reportes IA A/B/C
│   ├── pantallas/              # Catálogo de los 11 tipos de pantalla
│   ├── docs/                   # Referencia de ingeniería
│   └── (public)/               # Ejemplo login y landing
│
├── components/
│   ├── shell/                  # Shell inamovible: Rail, Header, Menú,
│   │   │                       # Núcleo AI, ⌘K, Menu usuario, 6 estados
│   │   └── estados/            # Cargando, Vacío, Error, Sin conexión…
│   └── nucleo-adc/             # Componentes propios del DS
│       ├── indicadores/        # TarjetaIndicador, BarraProgreso, Franja…
│       ├── hub/                # CintaIndicadores, FeedAtencion, Panel…
│       ├── tablero/            # FilaIndicador, CeldaMatriz, Uso1–4
│       ├── panel-detalle/      # BloqueDefinicion, BloqueReal, Trayectoria…
│       ├── formularios/        # PanelLateral, DialogoConfirmacion
│       ├── reportes/           # MarcoReporte, FiltroColumna, F1–F6
│       ├── reportes-gen/       # MarcoGenerado, RespuestaDirecta…
│       └── ui/                 # Campo, CampoCifra, Combobox, ChipTipo…
│
├── styles/
│   └── globals.css             # Variables CSS: shadcn + tokens --nuc-*
│
├── skills/                     # Skills del agente de diseño
│   ├── usability/              # Principios Nielsen, Fitts, Tufte
│   ├── prototype/              # Renderizado de mocks
│   ├── data-viz/               # Gráficas y dashboards
│   └── clarify/                # Facilitación de brief
│
├── scripts/
│   ├── detect.mjs              # Detector determinístico de AI-tells
│   ├── palette.mjs             # Validador de paleta
│   └── dealer.mjs              # Helper de distribución
│
├── nucleo-adc-extracted/       # Documentación de diseño original (HTML)
├── CLAUDE.md                   # 13 reglas del DS — ley para todo AI agent
├── AGENTS.md                   # Contexto completo para AI agents
└── design.md                   # Design System exhaustivo (22 secciones)
```

---

## Rutas del catálogo

Cada ruta es un ejemplo o un catálogo de componentes. Los datos son de muestra.

| Ruta | Qué demuestra |
|---|---|
| [`/`](http://localhost:3000) | Ejemplo T1 Hub |
| [`/indicadores`](http://localhost:3000/indicadores) | Ejemplo T2/T3 tablero |
| [`/formularios`](http://localhost:3000/formularios) | Catálogo de 11 controles y 8 estados |
| [`/reportes`](http://localhost:3000/reportes) | Catálogo de formatos fijos F1–F6 |
| [`/reportes/generados`](http://localhost:3000/reportes/generados) | Catálogo de plantillas IA (A, B, C) |
| [`/pantallas`](http://localhost:3000/pantallas) | Catálogo de los 11 tipos de pantalla T1–T11 |
| [`/docs`](http://localhost:3000/docs) | Referencia de ingeniería: tokens, componentes, props |

---

## Agente de QA con `/qa-diseno`

El comando `/qa-diseno` audita cualquier pantalla o componente en **5 dimensiones** contra el Design System de Núcleo ADC.

### Requisitos

```bash
# Claude Code CLI
npm install -g @anthropic-ai/claude-code   # o usa la extensión de VS Code
```

### Uso

```bash
# Abrir Claude Code en la raíz del proyecto
claude

# Auditar una página
/qa-diseno app/indicadores/tablero-puesto/page.tsx

# Auditar un componente
/qa-diseno components/nucleo-adc/indicadores/tarjeta.tsx

# Auditar formularios
/qa-diseno app/formularios/page.tsx
```

### Qué verifica

| # | Dimensión | Qué cubre |
|---|---|---|
| 1 | **DS — 13 Reglas** | Color estructural/acción/estado, tipografía Geist/Mono, espaciado 4px, radios fijos, sombras flotantes, un primario, copy con número |
| 2 | **Layout y Shell** | Rail 56px, Header 52px, Menú 296px, AI 340px, Panel 460px, mesa scroll, T1–T11 |
| 3 | **Composición** | Punto focal, jerarquía tipográfica ≤3 niveles, alineación, identidad visual nombrable |
| 4 | **Usabilidad** | Tufte data-ink, Fitts ≥44px táctil, Miller/Hick ≤7 ítems, Nielsen #1/#4/#5 |
| 5 | **Indicadores** | avanceObjetivo ×100, null objetivo, SIN_OPERACION, alarmas, varSPL null → `—` |

El reporte se escribe en `.code-foundations/qa/qa-[nombre]-[fecha].md` con veredicto **PASS / FAIL** y fix exacto por hallazgo.

### Otros comandos del agente

```bash
/plan    # Convierte un brief en un plan de fases con done-when criteria
/build   # Ejecuta un plan aprobado fase por fase (BUILD → REVIEW → commit)
/mock    # Renderiza un prototipo rápido para sign-off antes del build
/research  # Facilita el brief de diseño (qué, para quién, con qué sensación)
```

---

## Dark mode

El tema oscuro se genera automáticamente vía CSS custom properties. Al activar `.dark` en `<html>` (next-themes), los tokens `--nuc-*` cambian sin ningún código adicional en los componentes.

```css
/* styles/globals.css */
:root {
  --nuc-surface: #FFFFFF;
  --nuc-ink:     #0E1116;
  /* … */
}
.dark {
  --nuc-surface: #101C2B;
  --nuc-ink:     #E9EEF4;
  /* … */
}
```

---

## Design System

Las reglas completas están en [`CLAUDE.md`](./CLAUDE.md) (referencia rápida) y [`design.md`](./design.md) (22 secciones exhaustivas). La documentación interactiva con previews en vivo está en [`/docs`](http://localhost:3000/docs).

Para AI agents (Claude Code, Cursor, etc.), leer [`AGENTS.md`](./AGENTS.md) antes de construir cualquier cosa.
