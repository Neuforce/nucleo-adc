repo: ADC-Confianza-Autorama/finanzas
branch: main
path: web

## Last sync
date: 2026-08-13T18:30:19Z

### Updated in this project
- Sistema de indicadores completo: tarjeta base, cuatro usos, panel de detalle, alarmas, clases (desempeño · control · percepción · referencia) y gráficas por clase, en tema claro y oscuro.
- Endpoints documentados contra la API real: `/api/tablero/indicadores/tarjetas` y `/serie`, con el mapeo zona → campo → origen y lo que falta en el endpoint.
- Identidad Núcleo (marca, dos pesos del símbolo, color medido #00244D, Geist/Geist Mono) y concepto de interfaz (rail, mesa, Núcleo).
- Formularios: anatomía del campo, once controles, ocho estados, tres formatos (página · panel · diálogo), validación y contrato — contra `ui/input`, `ui/field`, `ui/native-select`, `ui/switch`, `ui/textarea`, `lib/formato.ts` y `configuracion/cuentas/form-captura.tsx`.
- Hub rediseñado (feed como bloque central, sin bloque de accesos, contadores en el rail), menú de usuario (§01.2) y navegación dentro de la app (§01.3: cinta de secciones ≤5 destinos · panel de 232 px agrupado 6+, contra `app-sidebar.tsx` de Finanzas, 18 destinos en 5 grupos). El asistente se llama Núcleo en todos los documentos.
- Pantallas a detalle: T2 (tablero de puesto) a tamaño real en claro y oscuro; T3–T11 pendientes de revisión una por una.
- Shell y sus seis estados, contrastado contra `error-panel.tsx`, `sin-acceso.tsx`, `skeleton.tsx` y `app/(app)/loading.tsx`.

## Screen map
| Pantalla del proyecto | Archivos del repo |
|---|---|
| Nucleo ADC - Indicadores | web/components/finanzas/stat-cards.tsx, web/lib/formato.ts, web/lib/eeff.ts, docs/PLANTILLA_tarjeta_indicador_linaje.md (aportada por el usuario) |
| Nucleo ADC - Imagen | web/components/finanzas/app-sidebar.tsx, site-header.tsx, asistente-widget.tsx |
| Nucleo ADC - Shell y estados | web/components/finanzas/error-panel.tsx, sin-acceso.tsx, web/app/(app)/loading.tsx; adccore: packages/ui/src/components/ui/{skeleton,empty}.tsx, packages/shell/src/* |
| Nucleo ADC - Identidad | web/components/adc-traxion/nucleo-logo.tsx, web/public/nucleo-adc.svg, web/public/logo-adc.png, web/app/layout.tsx |
| Nucleo ADC - Concepto de interfaz | docs/ARCHITECTURE.md (adccore), web/styles/globals.css |
| Nucleo ADC - Formularios | web/components/ui/{input,field,native-select,switch,textarea}.tsx, web/lib/formato.ts, web/app/(app)/configuracion/cuentas/form-captura.tsx |
| Nucleo ADC - Pantallas | web/components/finanzas/app-sidebar.tsx, site-header.tsx, nav-user.tsx |
| Nucleo ADC - Pantallas a detalle | web/components/finanzas/stat-cards.tsx, app-sidebar.tsx, site-header.tsx |

## Sync history
- 2026-08-12 · ADC-Confianza-Autorama/adccore@main — lectura del monorepo (packages/ui, packages/shell, hub, talento) para la identidad y el turno 1.
