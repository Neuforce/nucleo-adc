# Cómo consumir el Design System de Núcleo

**Si solo lees un archivo de este repo, es este.**

Este repositorio **es el Design System**. No lo edites. No abras su catálogo (`app/`) como si fuera el producto. Copia dos archivos a tu app y trabaja allá.

---

## Ingeniero: qué hacer

### Una vez (setup)

En disco, el DS y tu app son carpetas hermanas:

```
disco/
  nucleo-adc/     ← este repo (no se abre en Cursor)
  mi-app/         ← aquí trabajas
```

1. Copia [`rule_to_consume.md`](./rule_to_consume.md) → `mi-app/.cursor/rules/nucleo-ds.mdc`
2. Copia [`skills/prd-nucleo-ds/`](./skills/prd-nucleo-ds/) → `mi-app/.cursor/skills/prd-nucleo-ds/`

### Cada PRD

1. Abre **solo** `mi-app` en Cursor.
2. En el chat pega la spec de negocio y pide el PRD.
3. Recibes un PRD con pantallas T1–T11, `Shell` y las 13 reglas del DS.

Sin esos dos archivos en `mi-app`, el asistente no usa el Design System.

---

## Asistente: el resto de esta guía

Lo de abajo lo usa el skill/la rule. El ingeniero no tiene que leerlo para saber qué copiar.

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

Si no cabe, parar y nombrar el hueco. Alcance típico: T2 + T4 + T5 + T6. Toda pantalla de app en `Shell`. Un primario navy. Errores en el campo. Componentes solo de `components/shell` y `components/nucleo-adc`.

### Las 9 secciones del PRD

Sin la tabla del punto 3, no está listo.

1. Pregunta de la app — una frase.
2. Cápsula del rail — `id`, nombre, ícono Lucide.
3. Mapa: pregunta → T# → ruta → componentes → datos.
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
| Código | `Shell` + `components/nucleo-adc`, tokens `--nuc-*`, `CLAUDE.md` |

Hoy no hay paquete npm. `packages/ui` / `packages/shell` son futuro. El PRD no cambia cuando existan: solo cambia el import.
