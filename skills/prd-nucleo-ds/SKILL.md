---
name: prd-nucleo-ds
description: >
  Writes a product PRD, screen map, or module spec using the Núcleo Design System
  (T1–T11, Shell, 13 rules, existing components). Use when the user asks for a PRD,
  product requirements, spec de producto, módulo nuevo, app nueva, mapa de pantallas,
  tipos de pantalla, or any UI/UX plan that must follow Núcleo. Also use when drafting
  screens, layout, or copy for an app that sits next to nucleo-adc.
disable-model-invocation: false
---

# PRD con el Design System Núcleo

Al pedir un PRD, un módulo nuevo o una app nueva, **este skill manda**. El prompt del usuario solo trae la spec de negocio.

`DS_ROOT` = `../nucleo-adc`

## Paso 1 — Inyectar el DS (obligatorio, primer tool call)

Leer, en paralelo:

- `../nucleo-adc/CONSUMING.md`
- `../nucleo-adc/CLAUDE.md`
- `../nucleo-adc/AGENTS.md`
- `../nucleo-adc/design.md`

Si el path no existe, leer los mismos archivos desde `DS_ROOT` que indique `rule_to_consume.md`. No preguntar al usuario por la ruta si `../nucleo-adc` está al lado.

## Paso 2 — Mapear

Cada frase del usuario → un tipo T1–T11 (`CONSUMING.md` §2). Si no cabe, parar y nombrar el hueco. No inventar un tipo 12 ni un F7.

## Paso 3 — Escribir el PRD

Las 9 secciones de `CONSUMING.md` §3, aplicadas las 13 reglas de `CLAUDE.md`. Nombrar solo componentes de `../nucleo-adc/components/shell` y `../nucleo-adc/components/nucleo-adc`.

No código. No copiar rutas de `../nucleo-adc/app/` como si fueran el producto.

## Instalación en la app hermana

Copiar esta carpeta a `.cursor/skills/prd-nucleo-ds/` y copiar `rule_to_consume.md` a `.cursor/rules/nucleo-ds.mdc` (`alwaysApply: true`).
