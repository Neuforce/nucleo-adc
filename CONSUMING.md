# Cómo consumir el Design System de Núcleo

**Si solo lees un archivo de este repo, es este.**

Este repositorio **es el Design System**. No lo edites. No abras su catálogo (`app/`) como si fuera el producto.

Las apps instalan el paquete **`@nucleo/adc`**. No hace falta un checkout hermano ni copiar `components/`.

---

## Ingeniero: qué hacer

### Si tu app ya consume Núcleo

Clona **solo esa app** (p. ej. `neuforce-app-platform`) y corre su `npm install`. El DS entra como dependencia (`@nucleo/adc` en su `package.json`). No clones este repo. No instales el DS a mano.

Imports:

```ts
import { Shell } from '@nucleo/adc/shell'
import { Rail } from '@nucleo/adc/shell/rail'
import { Campo } from '@nucleo/adc/ui/campo'
```

### Solo la primera vez (app nueva)

Quien **engancha** Núcleo agrega la dep una vez al `package.json` del front y deja `transpilePackages: ['@nucleo/adc']` en Next:

```bash
npm install github:Neuforce/nucleo-adc#<sha-o-tag>
```

Fija un commit o un tag. Repo privado: token de GitHub en CI y Vercel.

Peers: `react` 19, `react-dom` 19, `lucide-react`, `next-themes`.

Quien desarrolla **este** DS puede instalar desde disco. Eso no es el camino de las apps.

### Asistente (una vez por app, si aún no está)

Si el repo de trabajo **aún no** tiene rule/skill en `.cursor/`, cópialos desde el paquete que ya trajo `npm install` — no desde un clone de este repo:

```bash
mkdir -p .cursor/rules .cursor/skills
cp node_modules/@nucleo/adc/rule_to_consume.md .cursor/rules/nucleo-ds.mdc
cp -R node_modules/@nucleo/adc/skills/prd-nucleo-ds .cursor/skills/
```

Si ya viajan en el repo de la app, no hay que volver a copiarlos. Next compila sin ellos.

### Cada PRD

1. Abre **solo** la app en Cursor (no este repo).
2. En el chat pega la spec de negocio y pide el PRD.
3. Recibes un PRD con pantallas T1–T11, `Shell` y las 13 reglas del DS.

---

## Asistente: el resto de esta guía

Lo de abajo lo usa el skill/la rule. El ingeniero de una app que ya declara `@nucleo/adc` no tiene que leerlo.

`DS_ROOT` = `node_modules/@nucleo/adc` (o el path de la app, p. ej. `apps/web/node_modules/@nucleo/adc`).

### Qué leer (si hace falta más detalle que la rule)

| Prioridad | Archivo | Para qué |
|---|---|---|
| 1 | [`CLAUDE.md`](./CLAUDE.md) | Las 13 reglas |
| 2 | [`AGENTS.md`](./AGENTS.md) §1, §7, §9 | T1–T11 y composición |
| 3 | [`design.md`](./design.md) §1, §8, §17, §22 | Principios, shell, tipos, voz |
| 4 | [`AGENTS.md`](./AGENTS.md) APIs | Componentes que el PRD nombre |
| 5 | [`design.md`](./design.md) §11 / §14 / §13 | Indicadores, captura o gráficas |

Brief vago → [`skills/clarify`](./skills/clarify/SKILL.md). Luego el PRD.

### De spec a pantalla

La frase del usuario elige el tipo, no el módulo. T1–T11:

| Código | Pregunta |
|--------|----------|
| T1 Hub | ¿Qué me espera hoy? |
| T2 Puesto | ¿Cómo voy yo este mes? |
| T3 Área | ¿Cómo va mi gente? |
| T4 Listado | Encuéntrame el caso. |
| T5 Expediente | Todo sobre este caso. |
| T6 Captura | Necesito registrar algo. |
| T7 Flujo | Trámite con pasos dependientes. |
| T8 Bandeja | Autorizo o no. |
| T9 Reporte | El de siempre (solo F1–F6). |
| T10 Núcleo | Déjame preguntar. |
| T11 Config | Cambiar cómo funciona. |

Si no cabe, parar y nombrar el hueco. Alcance típico: T2 + T4 + T5 + T6. Toda pantalla de app en `Shell`. Un primario navy. Errores en el campo. Imports solo `@nucleo/adc/...`.

### Las 9 secciones del PRD

Sin la tabla del punto 3, no está listo.

1. Pregunta de la app — una frase.
2. Cápsula del rail — `id`, nombre, ícono Lucide.
3. Mapa: pregunta → T# → ruta → import `@nucleo/adc/...` → datos.
4. Composición (`AGENTS.md` §9).
5. Shell — menú, ítem activo.
6. Seis estados, copy en español.
7. Voz — 3 «así sí» y 3 «así no» (`design.md` §22).
8. Fuera de alcance — tipo 12, F7, modal de trabajo.
9. Hecho cuando — contra las 13 reglas de `CLAUDE.md`.

### Después del PRD

| Paso | Dónde |
|---|---|
| Mock | [`skills/prototype`](./skills/prototype/SKILL.md) |
| Usabilidad | [`skills/usability`](./skills/usability/SKILL.md) |
| Gráficas | [`skills/data-viz`](./skills/data-viz/SKILL.md), `design.md` §13 |
| Código | `@nucleo/adc` (`Shell`, `ui`, `indicadores`, …), tokens `--nuc-*`, `CLAUDE.md` |

El PRD nombra componentes. El import es `@nucleo/adc/...`. No copies el catálogo `app/`.
