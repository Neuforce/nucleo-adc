---
description: Inyecta el Design System de Núcleo en todo PRD, módulo, app o UI. alwaysApply.
alwaysApply: true
---

# Design System Núcleo — inyección

Este repo consume Núcleo. El DS está en `../nucleo-adc` (`DS_ROOT`).

En el **primer paso** de cualquier PRD, módulo nuevo, app nueva o pantalla, leer (Read) en este orden:

1. `../nucleo-adc/CONSUMING.md`
2. `../nucleo-adc/CLAUDE.md`
3. `../nucleo-adc/AGENTS.md`
4. `../nucleo-adc/design.md`

Si un Read falla, aplicar igual todo lo que sigue en esta rule. El PRD no espera a que el usuario @mencione archivos.

`../nucleo-adc/app/` es catálogo de ejemplos. No es el producto.

---

## Entregar un PRD (obligatorio)

Nueve secciones. Sin la tabla del punto 3, el PRD no está listo.

1. Pregunta de la app — una frase.
2. Cápsula del rail — `id`, nombre, ícono Lucide (un glifo, trazo 1.5).
3. Mapa de pantallas — pregunta del usuario → T# → ruta → componentes de `../nucleo-adc/components/` → datos.
4. Composición de cada pantalla (abajo).
5. Shell — grupos del menú, ítem activo. No duplicar rail ni header.
6. Los 6 estados — copy en español; folio en Geist Mono si hay error.
7. Voz — 3 «así sí» y 3 «así no». Número al frente. Segunda persona en operativa.
8. Fuera de alcance — tipo 12, F7, modal de trabajo, color decorativo.
9. Hecho cuando — verificable contra las 13 reglas.

---

## Tipos T1–T11 (la frase del usuario elige)

| T | Pregunta |
|---|----------|
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

Si no cabe, parar y nombrar el hueco. No inventar un tipo 12.

Composición: T1 cinta+feed. T2 grid de `TarjetaIndicador`. T4 búsqueda+tabla+filtros. T6 dos columnas + barra al pie. T9 `MarcoReporte` + F1–F6. Toda pantalla de app en `Shell`.

---

## 13 reglas (UX del DS — van en el PRD)

1. Color: navy estructura, azul acción (una vez por pantalla), verde/ámbar/rojo solo estado (≥100 / 80–99 / <80). `direccionDeseable` gobierna. Cian solo en el símbolo.
2. Geist = texto. Geist Mono + `tabular-nums` = cifras, fechas, folios. Mínimo 11 px. Nulo → `—`. Variación >300% → `×N`.
3. Espacio en múltiplos de 4 px (gap 9 px del rail es la única excepción).
4. Radios: 5 controles, 6 tarjetas, 7 cápsulas del rail.
5. Sombra solo en lo que flota. Tarjetas en reposo: borde.
6. Un primario navy. Rojo relleno solo en confirmación destructiva. Foco: `0 0 0 3px rgba(47,107,255,.14)`.
7. Shell: rail 56, header 52, menú 296, AI 340. Scroll en la mesa, no en la página.
8. Tarjeta indicador 214×132. Sin objetivo o `SIN_OPERACION` → `—`, sin barra. Alarma = punto + borde 3 px + franja 34 px.
9. Color de dato por `direccionDeseable`. M/A = mismos días. Mostrar `fecha` de corte.
10. Una gráfica por clase (DESEMPEÑO / CONTROL / REFERENCIA / PERCEPCIÓN).
11. Seis estados, siempre con shell. Carga = esqueleto. Error en el campo, no toast.
12. Cero modales de trabajo. Táctil 44 px. Confirmación destructiva = único modal.
13. Copy en español, número delante. AI: máximo 3 acciones, con fuente.

Componentes: solo los de `../nucleo-adc/components/shell` y `../nucleo-adc/components/nucleo-adc`.
