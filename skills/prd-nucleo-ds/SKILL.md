---
name: prd-nucleo-ds
description: >
  Writes a product PRD, screen map, or module spec using the Núcleo Design System
  (T1–T11, Shell, 13 rules, existing components). Use when the user asks for a PRD,
  product requirements, spec de producto, módulo nuevo, app nueva, mapa de pantallas,
  tipos de pantalla, or any UI/UX plan that must follow Núcleo. Also use when drafting
  screens, layout, or copy for an app that consumes @nucleo/adc.
disable-model-invocation: false
---

# PRD con el Design System Núcleo

Al pedir un PRD, un módulo nuevo o una app nueva, **este skill manda**. El prompt del usuario solo trae la spec de negocio.

`DS_ROOT` = `node_modules/@nucleo/adc` (o `apps/web/node_modules/@nucleo/adc`)

## Paso 1 — Inyectar el DS (obligatorio, primer tool call)

Leer, en paralelo:

- `DS_ROOT/CONSUMING.md`
- `DS_ROOT/CLAUDE.md`
- `DS_ROOT/AGENTS.md`
- `DS_ROOT/design.md`

Si el path no existe, pedir `npm install` del paquete `@nucleo/adc`. No inventar un checkout hermano.

## Paso 2 — Mapear

Cada frase del usuario → un tipo T1–T11 (`CONSUMING.md`). Si no cabe, parar y nombrar el hueco. No inventar un tipo 12 ni un F7.

## Paso 3 — Escribir el PRD

Las 9 secciones de `CONSUMING.md`, aplicadas las 13 reglas de `CLAUDE.md`. Nombrar solo exports `@nucleo/adc/...`.

No código. No copiar rutas de `DS_ROOT/app/` como si fueran el producto.

## Instalación en la app

Dependencia: `@nucleo/adc` en el `package.json` del front. Copiar desde el paquete:

```bash
cp node_modules/@nucleo/adc/rule_to_consume.md .cursor/rules/nucleo-ds.mdc
cp -R node_modules/@nucleo/adc/skills/prd-nucleo-ds .cursor/skills/
```
