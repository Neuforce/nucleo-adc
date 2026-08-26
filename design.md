# Design System — Núcleo ADC

> Fuente: documentos 00–13 del archivo `Nucleo ADC.zip` + `PLANTILLA_tarjeta_indicador_linaje.md`.
> Todo lo que aparece aquí está documentado en los archivos fuente. No se ha inferido nada.

---

## Índice

1. [Principios](#1-principios)
2. [Identidad visual](#2-identidad-visual)
3. [Colores](#3-colores)
4. [Tipografía](#4-tipografía)
5. [Espaciado y retícula](#5-espaciado-y-retícula)
6. [Radios de borde](#6-radios-de-borde)
7. [Sombras](#7-sombras)
8. [Shell](#8-shell)
9. [Componentes](#9-componentes)
10. [Estados del sistema](#10-estados-del-sistema)
11. [Indicadores](#11-indicadores)
12. [Alarmas](#12-alarmas)
13. [Gráficas](#13-gráficas)
14. [Formularios](#14-formularios)
15. [Navegación](#15-navegación)
16. [La web pública](#16-la-web-pública)
17. [Pantallas (tipos)](#17-pantallas-tipos)
18. [Modo oscuro](#18-modo-oscuro)
19. [Variables CSS](#19-variables-css)
20. [API y datos](#20-api-y-datos)
21. [Paquetes y componentes React](#21-paquetes-y-componentes-react)
22. [Voz y copy](#22-voz-y-copy)

---

## 1. Principios

1. **La mesa antes que el cromo.** El píxel es del contenido. Nada permanente además del rail y el encabezado.
2. **Una pregunta por pantalla.** Si no se puede escribir en una línea qué contesta la pantalla, hay dos pantallas mezcladas.
3. **Abre en el trabajo.** Sin saludos ni portadas: lo primero que se ve es el pendiente y la brecha de hoy.
4. **El color es estado.** Navy estructura, azul acción y AI, verde/ámbar/rojo solo desviación. Nada decorativo.
5. **Toda cifra trae su marco.** Valor, meta, brecha y tendencia viajan juntos — dichos en el nivel de lectura del puesto.
6. **El asistente se posa, no ocupa.** Siempre a un clic, siempre colapsable, nunca una pantalla propia.
7. **Cómodo a las seis de la tarde.** Contraste alto, tipos ≥ 11 px, blancos sin brillo, tema oscuro real. Sin animación que no informe.
8. **Ocho apps, un producto.** Mismo rail, mismo encabezado, mismos componentes. Cambiar de app se siente cambiar de pestaña.

---

## 2. Identidad visual

### Símbolo Núcleo

Dos pesos. No intercambiables.

| Peso | viewBox | Trazo | Nodo r | Núcleo r | Uso mínimo |
|---|---|---|---|---|---|
| Sólido | `0 0 100 100` | 3.4 | 6.5 | 12 | 16 px — UI, íconos, favicon |
| Fino | `0 0 100 100` | 2.3 | 5.0 | 10 | 48 px — marca, portadas, gran formato |

**Gradiente (solo peso fino):**
```
linear-gradient(135deg, #3ED0EA → #2F6BFF 62% → #2A57C4)
gradientUnits="userSpaceOnUse" · x1=20,y1=16 → x2=80,y2=84
```

**Variantes de color:**
- `nucleo-solido-navy.svg` — `#00244D`
- `nucleo-solido-white.svg` — `#FFFFFF`
- `nucleo-solido-azul.svg` — `#2F6BFF`
- `nucleo-mono-navy.svg` / `nucleo-mono-white.svg` / `nucleo-mono-cian.svg`
- `nucleo-fino-navy.svg` / `nucleo-fino-gradiente.svg`

**Área de respiro:** 0.35 × el ancho del símbolo en todos los lados.

**Tamaños vivos:** 16 · 22 · 32 · 44 · 180 px

**Prohibido:**
- Rotar (el nodo superior siempre arriba)
- Deformar (proporción 1:1 siempre)
- Usar cian sobre fondos claros
- Usar gradiente en tamaños UI (< 48 px)
- Mezclar peso sólido y fino en la misma composición
- Cursivas en el lockup con texto

El símbolo Núcleo no es el ícono de una app: firma el sistema y la AI.

### Logotipo ADC Traxión

- Archivo: `assets/logo-adc-traxion.png`, `web/public/logo-adc.png`
- Color navy medido del logo: `#00244D`

### Íconos de app

- Glifo único por app, nunca cambia con rediseños
- Trazo 1.5, sin relleno (salvo favicon), sin degradados, sin color de marca
- Fuente: Lucide, mapeados en `packages/api-client/src/lib/icon-map.tsx`
- Prueba de silueta: reconocible a 16 px, diferenciable solo por forma

| App | Ícono Lucide | Estado |
|---|---|---|
| Hub | `layout-grid` | — |
| Finanzas | `trending-up` | EN DISEÑO |
| Indicadores | `bar-chart` | EN DISEÑO |
| Servicio | `box` | PREVISTA |
| Inventario | `briefcase` | PREVISTA |
| Talento | `users` | PREVISTA |
| Refacciones | `wrench` | PREVISTA |
| Clientes | `message-square` | PREVISTA |
| Seguros | `shield` | PREVISTA |
| Configuración | `settings` | TRANSVERSAL — siempre al final del rail |

---

## 3. Colores

### Colores de marca y estructura

| Token | Hex | Uso |
|---|---|---|
| Navy ADC | `#00244D` | Rail, encabezado, tarjeta destacada, primario de estructura |
| Navy profundo | `#0B1420` | Secciones oscuras en documentación |
| Azul núcleo | `#2F6BFF` | Botón primario, enlaces, foco, superficies AI |
| Cian chispa | `#3ED0EA` | Solo dentro del gradiente del símbolo |

### Superficies y tintas (tema claro)

| Token | Hex | Uso |
|---|---|---|
| Tinta | `#0E1116` | Títulos y cifras principales |
| Tinta suave | `#3D4551` | Cuerpo de texto, listas |
| Texto secundario | `#5B6472` | Párrafos de apoyo |
| Rótulo | `#6B7482` | Rótulos mono, labels de formulario |
| Apoyo / muted | `#98A0AC` | Texto deshabilitado, timestamps |
| Borde / hairline | `#E4E6EA` | Divisiones entre superficies |
| Línea interna | `#EEF0F3` | Divisiones dentro de componentes |
| Selección activa | `#EEF2FB` | Fila activa, pantalla activa en menú |
| Mesa (fondo de trabajo) | `#F4F5F7` | Background de la mesa de la app |
| Tarjeta sutil | `#FBFBFC` | Tarjetas de baja jerarquía |
| Blanco superficies | `#FFFFFF` | Tarjetas principales, encabezado |
| Fondo Núcleo AI | `#F7F8FF` | Superficie del panel del asistente |

### Colores de estado (calculados del dato — nunca asignados a mano)

| Estado | Condición | Hex texto | Hex borde | Hex fondo |
|---|---|---|---|---|
| Cumple (verde) | ≥ 100% | `#0B7A53` | `#CFE8DE` | `#F4FAF7` |
| En riesgo (ámbar) | 80–99% | `#8A5A12` | `#F2E2C2` | `#FDF6E9` |
| Fuera (rojo) | < 80% | `#C2352B` | `#F6D5D2` | `#FDF5F4` |

**Nota:** Los hex de relleno de barra (`#0E8A5F` verde, `#B7791F` ámbar, `#C2352B` rojo) no alcanzan contraste AA en tipografía, por eso el texto usa los valores más oscuros de arriba.

### Colores del rail (tema claro)

| Hex | Uso |
|---|---|
| `#7F9CC0` | Íconos del rail en reposo |
| `#A8C4E0` | Texto de apoyo sobre fondos navy |
| `#6BA3D8` | Kickers en fondos navy |
| `rgba(255,255,255,.16)` | Fondo cápsula activa en rail |

### Colores semánticos adicionales

| Hex | Uso |
|---|---|
| `#D5DBF9` | Borde del panel de Núcleo AI |
| `#CDD9FB` | Borde de cápsula de app activa/seleccionada |
| `#EEF3FF` | Fondo de cápsula de app activa/seleccionada |
| `#EAF0FB` | Fondo de banda de control (gráfica Control) |

### Colores del tema oscuro

| Hex | Uso |
|---|---|
| `#070F18` | Mesa (fondo de trabajo en dark) |
| `#0D1826` | Rail en dark |
| `#101C2B` | Superficies, encabezado, tarjetas en dark |
| `#16253A` | Tarjeta elevada / cápsula hub activa en dark |
| `#1D2836` | Borde hairline en dark |
| `#24344A` | Borde de controles en dark (segunda capa) |
| `#E9EEF4` | Texto principal en dark |
| `#A8B6C6` | Texto de apoyo en dark |
| `#8B98A8` | Rótulos y texto muted en dark |
| `#55677F` | Timestamps, texto terciario en dark |
| `#2FBE86` | Estado cumple en dark |
| `#E0A640` | Estado en riesgo en dark (también `#E0A32E`) |
| `#FF8B80` | Estado fuera en dark |
| `#7C8DFF` | Azul acción en dark |
| `#4D8DFF` | Anillo de foco / borde activo en dark |

### Colores de la web pública

| Hex | Uso |
|---|---|
| `#050D16` | Fondo de portada y ventana de login |
| `rgba(10,20,32,.86)` | Card de login (translúcido) |
| `rgba(3,9,16,.62)` | Overlay de backdrop blur al hacer login |

---

## 4. Tipografía

### Familias

| Familia | Pesos cargados | Uso |
|---|---|---|
| `Geist` | 300, 400, 500, 600, 700 | Todo texto: títulos, cuerpo, etiquetas, UI |
| `Geist Mono` | 400, 500, 600, 700 | **Todo número**: importes, porcentajes, fechas, folios, claves, comparativos |

**Regla absoluta:** `font-variant-numeric: tabular-nums` en todo Geist Mono. Geist para texto, Geist Mono para datos.

Cargadas desde `next/font/google` en `app/layout.tsx`:
- `--font-geist-sans` → Geist
- `--font-geist-mono` → Geist Mono

### Escala tipográfica

| Rol | CSS exacto | Uso |
|---|---|---|
| Hero portada | `600 54px/1.02 'Geist'` `letter-spacing:-.035em` | Encabezado principal de portada |
| H1 de sección | `600 42–46px/1.05 'Geist'` `letter-spacing:-.035em` | Encabezados de sección en docs |
| H2 de sección | `600 27px/1.15 'Geist'` `letter-spacing:-.025em` | Bloques de contenido |
| H2 shell | `600 26px/1.15 'Geist'` `letter-spacing:-.025em` | Encabezados dentro de la app |
| H3 / título de pantalla | `600 22px/1.15 'Geist'` `letter-spacing:-.02em` | Pantallas, primero visible de la mesa |
| Cifra grande indicador (mando) | `600 27–30px/1 'Geist Mono'` `letter-spacing:-.035em` | Dato principal de tarjeta estándar |
| Cifra grande indicador (operativo) | `600 48px/1 'Geist Mono'` `letter-spacing:-.035em` | Tarjeta operativa nivel 1 |
| Cifra grande panel detalle | `600 30px/1 'Geist Mono'` `letter-spacing:-.035em` | Valor REAL en panel de detalle |
| Nombre del indicador | `600 14.5px/1.25 'Geist'` | Nombre en tarjeta 214×132 px |
| Nombre de app (encabezado) | `700 12.5px 'Geist'` `letter-spacing:.04em` | Rail, encabezado |
| Cuerpo / lectura larga | `400 14px/1.65 'Geist'` | Párrafos de documentación |
| Secundario / celdas | `400 12.5px/1.6 'Geist'` | Notas, celdas, filas de lista |
| Interfaz / etiquetas | `500 12.5px/1.55 'Geist'` | Etiquetas, botones, filas de tabla |
| Ayuda / notas al pie | `400 11.5px/1.55–1.6 'Geist'` | Texto de apoyo |
| Rótulo mono (kicker) | `600 11px 'Geist Mono'` `letter-spacing:.09em` mayúsculas | Labels de sección, cintillos de tarjeta |
| Kicker de identidad | `700 10.5px 'Geist Mono'` `letter-spacing:.16em` mayúsculas | «Finanzas · EEFF» |
| Dato tabular | `400 12.5px/1.7 'Geist Mono'` `font-variant-numeric:tabular-nums` | Tablas financieras |
| Comparativos (chips M / A) | `700 12.5px/1 'Geist Mono'` | Tendencias en tarjeta de indicador |
| Texto mínimo | `500 11px 'Geist Mono'` | Solo rótulos mono. No bajar de 11 px. Cuerpo mínimo: 11.5 px |

### Reglas de formato numérico

- Dinero abreviado en tarjetas: `$25.5M` (1 decimal, misma unidad que la meta). Función `monedaUnidad()`.
- Dinero exacto en tabla y en panel de detalle.
- Porcentajes llegan como decimales de la API (0.831 → mostrar 83.1%).
- Variación > 300% se escribe como `×N` (ej. `×48`), no como porcentaje.
- Base cero o nulo → `—` (guión largo), nunca `0%` ni `∞`.

---

## 5. Espaciado y retícula

### Base

- **Todo múltiplo de 4 px.** No usar valores fuera de la cuadrícula de 4 px.

### Zonas del shell (1440 px de referencia)

| Zona | Medida fija |
|---|---|
| Rail de apps | **56 px** ancho — navy sólido, siempre fijo |
| Encabezado | **52 px** alto — fijo, nunca hace scroll |
| Menú de pantallas (hoja) | **296 px** ancho — nace encogido, flota sobre la mesa |
| Mesa con menú encogido (1440) | **1,384 px** — estado por defecto |
| Mesa con menú fijado (1440) | **1,088 px** |
| Panel Núcleo AI | **340 px** ancho |
| Panel detalle de indicador | **460 px** ancho — entra por la derecha |
| Menú de usuario | **280 px** ancho |

### Breakpoints responsive

| Nombre | Ancho | Comportamiento |
|---|---|---|
| Pantalla ancha | ≥ 1600 px | Único ancho donde menú fijado + Núcleo caben juntos |
| Escritorio (referencia) | ≥ 1280 px | Rail 56 · menú encogido · mesa 1,384. Vista de referencia |
| Tableta | 900–1279 px | Menú nunca se puede fijar. Tarjetas de 3 en 3 |
| Celular | < 900 px | Rail baja a barra inferior de 56 px. Menú desde abajo |

### Retícula de tarjetas de indicador

```css
grid-template-columns: repeat(auto-fit, minmax(196px, 1fr));
gap: 12px;
```

| Situación | Columnas | Ancho de tarjeta |
|---|---|---|
| Mesa 1,384 (menú encogido) | 6 | ~212 px |
| Mesa 1,088 (menú fijado) | 5 | ~198 px |
| Mesa 1,004 (Núcleo abierto) | 4 | — |
| Tableta | 3 | — |

- Ancho mínimo de tarjeta: **196 px** (debajo, el nombre se corta y la meta se pierde)
- Máximo 6 tarjetas por fila (más: se divide en grupos con header propio)
- Máximo 2 tarjetas navy por fila

### Alturas de controles

| Contexto | Alto |
|---|---|
| Control desktop (botones, campos, filtros) | **30 px** |
| Control táctil (< 1,279 px) | **44 px** — todos los objetivos táctiles sin excepción |
| Fila modo resumen (tablero, bandeja) | **44 px** |
| Fila modo mesa (estado financiero, listados) | **34 px** |

### Padding y gap general

| Contexto | Valor |
|---|---|
| Padding de la mesa | **20 px** |
| Gap entre tarjetas de indicador | **12–14 px** |
| Íconos del rail (gap vertical) | **9 px** |
| Menú de pantallas — ítems margen horizontal | **6 px** |
| Menú de pantallas — padding de ítem | `0 8–9 px` |
| Separadores de sección en rail | **20 px** |

---

## 6. Radios de borde

| Valor | Elementos |
|---|---|
| **3 px** | Teclas de atajo (`kbd`), badges de tag en índice |
| **4 px** | Chips pequeños, cápsulas ADC, celdas de estado en tabla |
| **5 px** | Botones, campos, filtros, controles en formularios densos |
| **6 px** | Tarjetas, paneles, superficies en general — el radio por defecto (`--radius: 0.375rem`) |
| **7 px** | Cápsulas de app en el rail (34×34 px) |
| **8 px** | Tarjetas de sección en docs, bloques de estado, tarjeta operativa |
| **12 px** | Ventana de login |
| **15–18 px** | Botón CTA redondeado en portada, píldoras de filtro |
| **50%** | Avatar de usuario, badges de contador circular |

---

## 7. Sombras

Regla: **solo para elementos que se posan sobre la UI** (menús abiertos, Núcleo AI, paleta ⌘K). Las tarjetas y paneles en reposo usan borde, no sombra.

| Elemento | `box-shadow` |
|---|---|
| Menú de pantallas (flotante) | `14px 0 34px rgba(0,36,77,.14), 0 -1px 0 #e4e6ea` |
| Panel Núcleo AI | — (borde + fondo) |
| Menú de usuario | `0 18px 44px rgba(0,36,77,.22)` |
| Ventana de login | `0 30px 70px rgba(0,0,0,.6)` |
| Hub pantalla completa | `0 10px 34px rgba(0,36,77,.09)` |
| Panel sesión caducada | `0 12px 30px rgba(0,36,77,.16)` |
| Disco `+n` (overflow de apps) | `0 18px 44px rgba(0,36,77,.2)` |
| Foco en avatar (claro) | `0 0 0 2px #fff` |
| Foco en avatar (dark) | `0 0 0 2px #4D8DFF` |
| Menú de usuario dark | `0 18px 44px rgba(0,0,0,.46)` |

---

## 8. Shell

El shell es permanente. Sus cuatro zonas (rail, encabezado, menú de pantallas, Núcleo) son las únicas piezas que no cambian entre pantallas.

### Rail de apps

- Ancho: **56 px**, fondo `#00244D` (claro) / `#0D1826` (dark)
- Nunca hace scroll. Nunca desaparece.
- Lo que no cabe va en disco `+n`: `width:34px height:26px border-radius:7px border:1px dashed rgba(255,255,255,.34)` texto `font:700 10.5px 'Geist Mono' color:#B9CEE3`
- Orden de apps: calculado por uso en los últimos 30 días, recalculado semanalmente
- Configuración siempre al final del rail — nunca reorderable

**Cápsula de app:**
- Tamaño: **34×34 px**, `border-radius: 7px`
- Activa (sobre navy): `background: rgba(255,255,255,.16)`, borde `rgba(255,255,255,.2)`
- Activa en encabezado: `background: #EEF3FF`, borde `1px solid #CDD9FB`, glifo `#2F6BFF`
- Glifo: 24 px, `stroke-width:1.5`, sin relleno
- Indicador de app activa: barra lateral `3px` ancho `border-radius:2px` blanca

**Badge de pendientes en rail:**
- Mínimo `15×15 px`, `border-radius:8px`, `padding:0 3px`
- `font:700 9.5px 'Geist Mono' color:#FFFFFF`
- Borde separador: `1.5px solid #00244D`
- Urgente: `background:#C2352B` / Atención: `background:#B7791F`

### Encabezado

- Alto: **52 px**, fondo `#FFFFFF` (claro) / `#101C2B` (dark)
- Borde inferior: `1px solid #E4E6EA`
- Fijo, nunca hace scroll
- Contiene: nombre de la app, selector de periodo, búsqueda ⌘K, botón Núcleo AI, avatar

**Búsqueda ⌘K:**
- `height:30px`, `border:1px solid #E4E6EA`, `border-radius:5–6px`
- `font:400 12px 'Geist' color:#98A0AC`
- Badge tecla: `font:500 11px 'Geist Mono' border:1px solid #E4E6EA border-radius:3px padding:1px 4px`

### Menú de pantallas (hoja lateral)

- Ancho: **296 px**, posición `absolute left:56px top:52px bottom:0`
- Fondo: `#FFFFFF` (claro) / `#0F1A29` (dark)
- Nace siempre encogido. Se cierra al elegir destino.
- Fijar el menú es preferencia global del usuario, no por app.
- Se posa sobre la mesa sin empujarla.
- Sombra cuando flotante: `14px 0 34px rgba(0,36,77,.14), 0 -1px 0 #e4e6ea`

**Ítems del menú:**
- Alto: **28 px**, `margin:1px 6px`, `padding:0 8–9px`, `border-radius:6px`
- Activo claro: `background:#EEF2FB`, `font:600 12px 'Geist' color:#00244D`, chip `13×13px background:#00244D`
- Activo dark: `background:#1D3350`
- Inactivo: `font:500 12px 'Geist' color:#3D4551`, chip `background:#DFE3EA`
- Grupos (rótulo): `font:600 10px 'Geist Mono' letter-spacing:.09em color:#98A0AC padding:0 12px 4px`
- Subitems (nivel 2): `padding-left:24px`, sin chip cuadrado
- Solo un nivel de anidado. Siempre se marca la hoja activa, nunca el grupo.
- Al pasar cursor por otro ícono del rail, la hoja cambia de contenido sin cerrarse.

### Panel Núcleo AI

- Ancho: **340 px**, se posa sobre la mesa
- Atajo: `⌘J`
- Fondo: `#F7F8FF`, `border:1px solid #D5DBF9`, `border-radius:6px`
- Respuesta AI: `background:#F7F8FF border:1px solid #D5DBF9 padding:14px 15px`
- Botón enviar: `24×24px border-radius:4px background:#00244D` (claro) / `#2F6BFF` (dark)
- Todo lo que escribe la máquina lleva el símbolo Núcleo y cita su fuente.
- Máximo 3 acciones ejecutables por respuesta.
- La AI no promete: explica y ofrece una acción.
- Si no se puede citar la fuente, no se publica.

### Atajo de teclado

| Atajo | Acción |
|---|---|
| `⌘B` | Abrir/cerrar menú de pantallas |
| `⌘⇧B` | Fijar el menú |
| `⌘K` | Búsqueda global |
| `⌘J` | Abrir/cerrar Núcleo AI |

---

## 9. Componentes

### Botones

| Variante | Alto | Padding H | Fondo | Texto | Borde | Radio |
|---|---|---|---|---|---|---|
| Primario (desktop) | **30 px** | 13–14 px | `#00244D` | `#FFFFFF` | — | 5 px |
| Primario azul | 30 px | 13 px | `#2F6BFF` | `#FFFFFF` | — | 5 px |
| Contorno | 30 px | 13 px | `#FFFFFF` | `#0E1116` | `1px solid #D8DCE2` | 5 px |
| Ghost / texto | 30 px | 10 px | transparente | `#2F6BFF` | — | 5 px |
| Destructivo contorno | 30 px | 13 px | `#FDF6F5` | `#C2352B` | `1px solid #E8C9C6` | 5 px |
| Primario táctil | **44 px** | — | `#FFFFFF` | `#00244D` | — | 6 px |
| CTA portada | **36 px** | 20 px | `#FFFFFF` | `#00244D` | — | 18 px |

**Reglas:**
- Un solo botón primario navy por pantalla. El resto son contorno o texto.
- Rojo relleno (`background:#C2352B`) solo dentro del modal de confirmación destructiva.
- Foco: `box-shadow:0 0 0 3px rgba(47,107,255,.14)`, borde `#2F6BFF`. Nunca se quita.

### Menú de usuario

- Ancho: **280 px**, fondo `#FFFFFF`, borde `1px solid #E4E6EA`, sombra `0 18px 44px rgba(0,36,77,.22)`, `border-radius:8px`
- Avatar: **36×36 px**, `border-radius:50%`, fondo `#00244D` (claro) / `#16253A` (dark)
- Nombre: `font:600 13.5px 'Geist'`
- Email: `font:400 11.5px 'Geist' color:#6B7482`
- Rótulos de sección: `font:500 10.5px 'Geist Mono' letter-spacing:.06em color:#6B7482`
- Switch de tema: `height:26px border:1px solid #E4E6EA border-radius:6px`
- Pie: `background:#FBFBFC`; versión: `font:500 10.5px 'Geist Mono' color:#6B7482`
- "Cerrar sesión": `font:600 12px 'Geist' color:#C2352B`

### Selector de periodo / filtro

- `height:30px border-radius:6px border:1px solid #D8DCE2`
- `font:500 12px 'Geist Mono' color:#0E1116`

### Chip de tipo / clase

- Base: `padding:3px 8px border-radius:4px font:600 11px 'Geist Mono' letter-spacing:.05em`
- Tipo (META/RUMBO/EMPUJE/ARRANQUE): `color:#00244D background:#EEF1F6 border:1px solid #DDE3EC`
- Tipo REFERENCIA: `color:#5B6472 background:#FBFBFC border:1px solid #E4E6EA`
- Clase CONTROL: `color:#2F6BFF background:#F4F7FF border:1px solid #D5DBF9`
- Clase otras: `color:#5B6472 background:#FBFBFC border:1px solid #E4E6EA`
- En indicadores REFERENCIA el chip de clase se colapsa (redundante)

### Píldoras de filtro

- `height:24px padding:0 9px border-radius:12px`
- Activa: `background:#0E1116 color:#FFFFFF font:600 11px 'Geist'`
- Inactiva: `border:1px solid #E4E6EA color:#3D4551 font:500 11px 'Geist'`

---

## 10. Estados del sistema

Seis estados. Todos comparten estructura: **título que dice qué pasó** + línea explicativa + **una acción**. El shell nunca desaparece en ningún estado.

### 1. Cargando — `<Cargando/>` en `packages/shell`

- Esqueleto con la forma real de la pantalla, no spinner genérico
- Bloques: `background:#EEF0F3` o `#F4F5F7`, `border-radius:3–5px`
- Sin animación de pulso (cansa a las 8 horas de trabajo)

### 2. Vacío — `<Vacio/>` en `packages/shell`

- Vacío por filtro → acción «quitar filtros»
- Vacío real → acción «crear» (`background:#2F6BFF color:#FFFFFF border-radius:5px padding:7px 13px`)
- Título: qué va a aparecer ahí y cómo se crea

### 3. Sin permiso — `<SinAcceso/>` en `packages/shell`

- Círculo decorativo: `30×30px border:1.5px solid #C8CED7 border-radius:50%`
- Muestra el rol actual del usuario y quién puede cambiar el acceso
- Nunca muestra «403» ni «no autorizado»
- El módulo no aparece en el rail si no hay permiso

### 4. Error de datos — `<ErrorPanel/>` en `packages/shell`

- `border:1px solid #F6D5D2 border-left:3px solid #C2352B border-radius:6px`
- Título del error en español
- Folio de referencia al pie: `font:500 11px 'Geist Mono' color:#6B7482`
- Dos botones: «Reintentar» (primario azul) + «Reportar a TI» (contorno)

### 5. Sesión caducada — `<SesionExpirada/>` en `packages/shell`

- Único diálogo permitido sobre la mesa (modal centrado)
- `background:#FFFFFF border:1px solid #E4E6EA border-radius:8px box-shadow:0 12px 30px rgba(0,36,77,.16) padding:16px 18px`
- Mesa de fondo: `opacity:.35`
- Al reautenticar vuelve a la misma ruta; jamás al inicio

### 6. Sin conexión — `<SinConexion/>` en `packages/shell`

- Banda ámbar en la parte superior de la mesa
- `border:1px solid #F2E2C2 background:#FDF6E9 border-radius:6px`
- Punto: `7×7px background:#B7791F`
- `font:600 11.5px 'Geist' color:#8A5A12`
- Datos atenuados: `opacity:.75`. Las acciones de escritura se deshabilitan.

---

## 11. Indicadores

### Tarjeta de indicador — forma oficial (Form E)

**Dimensiones:** `214×132 px` — proporción 1.6:1

```
padding: 11px 15px
border-radius: 6px
border: 1px solid #E4E6EA
background: #FFFFFF
```

**Estructura interna (de arriba a abajo):**

1. **Cintillo** — rótulos mono `font:500–600 11px 'Geist Mono' letter-spacing:.07em`:
   - Izquierda: tipo de indicador (META / RUMBO / EMPUJE / ARRANQUE / REFERENCIA), sin el dígito ordinal
   - Derecha: nombre del nivel de análisis (ej. "MG Celaya · Atracción de Clientes")

2. **Nombre** — `font:600 14.5px/1.25 'Geist'`, máximo 2 líneas; la fila se estira a la tarjeta más alta

3. **Cifra y meta** —
   - Valor real: `font:600 27px/1 'Geist Mono' letter-spacing:-.035em color:#0E1116`
   - Valor monetario: `font:600 24px/1 'Geist Mono'` (baja cuando la unidad es moneda)
   - Meta: `font:500 11px 'Geist Mono' color:#6B7482`

4. **Barra de progreso** — solo en clase DESEMPEÑO
   - `height:4px background:#EEF0F3 border-radius:2px`
   - Relleno: color de estado
   - Marca de meta: `width:1px height:full background:#0E1116`
   - Porcentaje: `font:700 12.5px/14px 'Geist Mono'` color de estado

5. **Footer de comparativos** — `font:500 11px 'Geist Mono' color:#6B7482`
   - M (mes anterior mismo día): valor y tendencia
   - A (año anterior mismo día): valor y tendencia
   - Tendencias positivas/negativas: `font:700` en color de estado
   - > 300%: se escribe `×N`, no porcentaje. Base cero → `—`

**Variante destacada (navy):**
- `background:#00244D color:#FFFFFF`
- Máximo 2 por fila
- 1 tarjeta navy activa como acción primaria por zona

**Alerta de incumplimiento:**
- `border-left:3px solid #C2352B`
- Añade solo: punto de color, borde izquierdo y franja de motivo de 34 px al pie
- El cuerpo de la tarjeta nunca se pinta de rojo

**Formas descartadas (documentadas):**
- Form A (mosaico 326×104): "ERA MUY ANCHA"
- Form B (strip 56px): para layouts estrechos únicamente
- Form C (mínimo 176×84): "Solo para pantallas de sala, nunca para trabajar"
- Form D (184×180): "ERA MUY ALTA"

### Tres clases de indicador

#### DESEMPEÑO (avance hacia un objetivo)

- Barra de avance + mark de meta
- Compliance: ≥ 100% verde / 80–99% ámbar / < 80% rojo
- Comparativos: M y A cortados al mismo día del mes

#### CONTROL (permanecer dentro de una banda)

- Geometría de banda: fondo tintado `#EAF0FB`, línea de centro navy `stroke:1.5`, valor actual como punto
- Punto dentro banda: `background:#0E8A5F` / dentro pero < 10% del borde: `#B7791F` / fuera: `#C2352B border:2px solid #fff`
- No hay porcentaje de cumplimiento: muestra desviación en puntos
- Etiquetas: "dentro" / "a <10% del borde" / "fuera"
- Chip de clase en azul: `color:#2F6BFF background:#F4F7FF border:1px solid #D5DBF9`

#### REFERENCIA (comparación, sin bueno/malo)

- Dos barras paralelas a la misma escala
- Barra entidad: navy `#00244D` cuando está por encima de la referencia
- Barra referencia: gris `#C8CED7`
- Nunca verde ni rojo — no hay bueno/malo, solo más o menos que la referencia
- Delta: `font:700 12.5px 'Geist Mono' color:#00244D` (navy siempre)
- Chip de clase colapsado cuando tipo = REFERENCIA

#### PERCEPCIÓN (distribución, no promedio)

- Barras horizontales apiladas `height:16px border-radius:3px overflow:hidden`
- Satisfechos: `#0E8A5F` / Neutros: `#DFE3E8` / Insatisfechos: `#C2352B`
- Tamaño de muestra siempre visible: "n = N respuestas"
- "Un índice con n = 9 no se presenta en una junta"

### Cinco tipos de indicador (Tipo)

| Clave | Nombre | Ordinal (solo para filtros) |
|---|---|---|
| `1META` | META | 1 |
| `2RUMBO` | RUMBO | 2 |
| `3EM` | EMPUJE | 3 |
| `4ARR` | ARRANQUE | 4 |
| `5REF` | REFERENCIA | 5 |

El dígito ordinal existe para filtrado interno, nunca se muestra en la UI.

**Catálogo activo verificado 2026-08-12:** 34 META · 29 RUMBO · 161 EMPUJE · 93 ARRANQUE · 103 REFERENCIA = **420 activos**. Por clase: 146 Control · 142 Desempeño · 103 Referencia · 29 Percepción.

### Cuatro usos / vistas del tablero

La AI decide el uso, no el usuario.

| Uso | Cuándo | Formato |
|---|---|---|
| 1 — Tira de tarjetas | Entidad única + ≤ 6 indicadores | Tira horizontal de tarjetas |
| 2 — Lista agrupada | Entidad única + 7 o más indicadores | Filas agrupadas con encabezado |
| 3 — Matriz ponderada | Múltiples entidades distintas con sus propios indicadores | Matriz con ponderación y global |
| 4 — Matriz de cumplimiento | Mismas entidades comparando en los mismos indicadores | Tabla de cumplimiento con fila de grupo |

**Uso 4 — célula de la matriz:**
- Verde: `background:#12332A border:1px solid #1D5344` (dark) / equivalente claro
- Ámbar: `background:#33280F border:1px solid #57451C`
- Rojo: `background:#331A18 border:1px solid #5A2B27`
- Valor: `font:600 17px/1 'Geist Mono' color:#fff`
- Compliance: `font:700 12px/1 'Geist Mono'` color de estado
- Comparativos: `font:500 11px/1 'Geist Mono' color:#8B98A8`
- GLOBAL column: `font:700 16px 'Geist Mono'`
- Minibar: `background:#1A2637 height:3px border-radius:2px`; relleno en color de estado
- Fila de totales: `font:700 12.5px 'Geist'`, cumplimiento en gris `#8B98A8` (nunca en color de estado)

### Panel de detalle de indicador

`width:460px border:1px solid #E4E6EA border-radius:8px background:#FFFFFF box-shadow:0 8px 30px rgba(0,36,77,.1)`
Entra por la derecha. Compartido por los 4 usos.

**6 bloques en orden fijo:**

1. **Encabezado** — nombre `font:600 19px/1.2 'Geist' letter-spacing:-.015em color:#0E1116`; contexto `font:400 12px/1.45 'Geist' color:#6B7482`
2. **Real y objetivo** — bloque `background:#FBFBFC border:1px solid #EEF0F3 border-radius:6px padding:14px 16px`; REAL: `font:600 30px/1 'Geist Mono' letter-spacing:-.035em color:#0E1116`; OBJETIVO: `font:500 22px/1 'Geist Mono' color:#5B6472`; frase: `font:500 12px 'Geist' color:#5B6472`
3. **Periodos comparables** — grid `1fr 76px 66px 74px`; encabezado: `font:600 11px 'Geist Mono' letter-spacing:.07em color:#6B7482`; periodo: `font:500 12.5px 'Geist'`; real: `font:500 12.5px 'Geist Mono'`; delta: `font:700 12.5px 'Geist Mono'` color de estado
4. **Qué cuenta y qué no** — colapsable; `border:1px solid #EEF0F3 border-radius:6px`; título: `font:600 11px 'Geist Mono' letter-spacing:.07em text-transform:uppercase`; descripción: `font:400 13px/1.6 'Geist'`
5. **Trayectoria y resumen** — gráfica de barras de 12 meses; barras navy `#00244D border-radius:2px 2px 0 0`; mes actual: `rgba(0,36,77,.42)`; línea objetivo: `border-top:1px dashed #8A929E`; etiquetas: `font:500 11px 'Geist Mono' color:#6B7482`; mes actual bold `#0E1116`; resumen en grid `repeat(3,1fr)` con `border:1px solid #EEF0F3 border-radius:6px`
6. **Núcleo y ficha** — `border:1px solid #D5DBF9 background:#F7F8FF border-radius:6px padding:14px 16px`; texto: `font:400 12.5px/1.6 'Geist' color:#2C3340`; botón primario: `background:#2F6BFF color:#FFFFFF border-radius:5px`; footer: `font:400 11.5px/1.7 'Geist' color:#6B7482`

### Tarjeta operativa (nivel 1 — personal de piso)

```
padding: 22px 24px
border-radius: 8px
border: 1px solid #E4E6EA
```

- Etiqueta: `font:500 13px 'Geist' color:#5B6472 margin-bottom:16px`
- Número grande: `font:600 48px/1 'Geist Mono' letter-spacing:-.035em color:#0E1116`
- "De N": `font:500 16px 'Geist' color:#6B7482`
- Frase de estado: `font:600 17px/1.3 'Geist'` color de estado — siempre en segunda persona
- Barra: `height:12px background:#EEF0F3 border-radius:6px`; relleno en color de estado; marca de meta: `width:2px background:#0E1116`
- Footer: `font:500 12px 'Geist' color:#6B7482` — «Quedan N días» izq, «Meta NNN» der
- Insight: `border-top:1px solid #F1F3F6 font:400 12.5px/1.55 'Geist' color:#5B6472`

**Reglas operativas:**
1. Máximo 3 indicadores — más es una evaluación, no una meta
2. Siempre en segunda persona: "Te faltan", "vas mejor", "llegas"
3. El tiempo siempre visible: "Quedan 9 días"
4. Nunca comparar personas: muestra tu meta, no el ranking del equipo

### Especificación de componentes

| Elemento | Spec |
|---|---|
| Tarjeta mando | `alto 132 · radio 6 · padding 14/15` |
| Cifra (mando) | `Geist Mono 30 · 600 · letter-spacing -3.5%` |
| Chips comparativos | `alto 30 · radio 4 · Geist Mono 10.5` |
| Tarjeta operativa | `cifra 48 · barra 12 · radio 8` |
| Panel de detalle | `460px · entra por la derecha` |

### API del componente

```jsx
<TarjetaIndicador
  indicador={kpi}        // valor, meta, mesAnt, anioAnt
  tono="destacado"       // "normal" | "destacado"
  onDetalle={abrirPanel}
/>
// Nivel operativo automático si el puesto es operativo
<TarjetaIndicador indicador={kpi} nivel="auto" />
```

Vive en `packages/ui`. El nivel de lectura viene del puesto del usuario, no de la pantalla.

---

## 12. Alarmas

> "Un indicador en rojo no es una alarma: es un estado. La alarma es una decisión —esto hay que atenderlo hoy— y se calcula, no se declara."

### Tres niveles

| Nivel | Encabezado | Cuándo |
|---|---|---|
| **CRÍTICA** — "ACTUAR HOY" | `background:#FDEEED border-bottom:1px solid #F6D5D2` punto `9×9px #C2352B` título `color:#C2352B` | Desempeño: brecha que ya no se puede cubrir al mejor ritmo mensual. Control: fuera de banda. |
| **ATENCIÓN** — "ESTA SEMANA" | `background:#FDF6E9 border-bottom:1px solid #F2E2C2` punto `#B7791F` título `color:#8A5A12` | Desempeño: cerrará bajo meta al ritmo actual. Control: < 10% del borde y moviéndose hacia afuera. Referencia: cambio > 20% vs. referencia. |
| **NO EVALUABLE** — "GRIS, NO ROJO" | `background:#FBFBFC border-bottom:1px solid #E4E6EA` punto: solo contorno `border:1.5px solid #98A0AC` título `color:#5B6472` | Dato no disponible. "Falta de dato no es incumplimiento." |

### Cómo vive la alarma en la tarjeta

La tarjeta no se llena de rojo. La alarma solo agrega:
- Punto de color (nivel)
- `border-left:3px solid #C2352B` (o ámbar)
- **Franja de motivo de 34 px** al pie de la tarjeta

```
Franja claro: background:#FDF5F4 border-top:1px solid #F6D5D2 padding:8px 15px margin:auto -15px -11px
Texto: font:600 11px 'Geist' color:#C2352B
Link: font:500 11px 'Geist Mono' color:#2F6BFF
```

Click en la franja → abre el panel de detalle §06.

### Feed de alarmas (panel de atención)

`grid-template-columns: 12px 1fr 128px 96px gap:12px height:~44px/fila`

- Punto: `8×8px border-radius:50%`
- Encabezado: `font:600 12.5px 'Geist' color:#0E1116`
- Descripción: `font:400 11.5px 'Geist' color:#5B6472`
- Fecha: `font:500 11px 'Geist Mono' color:#6B7482`
- Acción: `font:600 11.5px 'Geist' color:#2F6BFF`

### Cuatro reglas de alarma

1. **La alarma vive en la tarjeta.** El cuerpo nunca se pinta. Solo punto, borde izquierdo 3px y franja de 34px.
2. **Siempre con motivo.** Frase que explica por qué y desde cuándo. "Una alarma sin motivo se ignora a la tercera vez."
3. **Máximo 5 visibles.** Ordenadas por impacto en la meta del puesto. El resto se cuentan pero no se enumeran: "veinte alarmas son cero alarmas."
4. **Se silencian con motivo.** Posponer requiere razón y fecha. Queda en el log del indicador y reaparece automáticamente al vencer.

---

## 13. Gráficas

### Series (tema claro)

| Serie | Trazo | Grosor | Dash |
|---|---|---|---|
| Mes actual / Real | `#00244D` | 2.5 | sólido |
| Objetivo (ritmo) | `#5B6472` | 1.5 | `stroke-dasharray:7 4` |
| SPLM (mes anterior) | `#A8AFBA` | 2 | sólido |
| SPLY (año anterior) | `#C8CED7` | 2 | `stroke-dasharray:1 4 stroke-linecap:round` |

### Series (tema oscuro)

| Serie | Trazo | Grosor | Dash |
|---|---|---|---|
| Mes actual | `#7C8DFF` | 2.5 | sólido |
| Objetivo | `#8B98A8` | 1.5 | `stroke-dasharray:7 4` |
| SPLM | `#55677F` | 2 | sólido |
| SPLY | `#3C4C62` | 2 | `stroke-dasharray:1 4` |

**Punto actual:** `fill:#00244D r:4` (claro) / `fill:#7C8DFF r:4` (dark)
**Punto fuera de banda:** `fill:#C2352B r:3.5–4.5` (claro) / `fill:#FF8B80` (dark)

### Cuatro tipos de gráfica por clase

**1. Desempeño — carrera contra el ritmo**
- Gráfica de líneas acumulativas
- Vistas: MES (por defecto) o AÑO — selector toggle `height:30px`
- Etiquetas al final de cada serie. Leyenda abajo como respaldo.
- Regla: "Un solo bloque con selector, nunca dos gráficas."

**2. Control — oscilación alrededor del centro**
- Fondo de banda: `#EAF0FB rect`; línea de centro navy sólida; SPLM y SPLY como líneas fijas de referencia
- Puntos marcan salidas de la banda
- Regla: "Lo que se lee es la dispersión, no la pendiente."
- Dark: banda `#182A44`, centro `#7C8DFF`; puntos fuera `fill:#FF8B80`

**3. Referencia — brecha contra el patrón**
- Barras por mes: entidad navy `#00244D` cuando está por encima; gris `#C8CED7` por debajo
- Referencia: línea horizontal `border-top:2px dashed #8A929E`; label `font:600 11px 'Geist Mono' color:#5B6472 background:#FFFFFF`

**4. Percepción — distribución, no promedio**
- Barras horizontales apiladas `height:16px border-radius:3px`
- Satisfechos `#0E8A5F` / Neutros `#DFE3E8` / Insatisfechos `#C2352B`
- Muestra `n` siempre visible; mes: `font:500 11px 'Geist Mono'`; total: `font:600 11.5px 'Geist Mono' color:#0E1116`

### Cuatro reglas de gráfica

1. **Cada serie, un trazo distinto.** Real sólido 2.5; objetivo long-dash; SPLM sólido gris; SPLY punteado. "Tres patrones, no tres grises parecidos."
2. **Nombre al final de la línea.** Cada serie se etiqueta donde termina; la leyenda es respaldo.
3. **Mismo periodo, no mes completo.** SPLM y SPLY cortados al mismo día del mes. "Comparar 27 días contra 31 es el error más común."
4. **Percepción lleva su n.** "Un índice con n = 9 no se presenta en una junta."

---

## 14. Formularios

### Campo de texto

| Estado | Alto | Borde | Shadow | Radio |
|---|---|---|---|---|
| Reposo | **34 px** | `1px solid #D8DCE2` | — | 5 px |
| Foco | 34 px | `1px solid #2F6BFF` | `0 0 0 3px rgba(47,107,255,.14)` | 5 px |
| Error | 34 px | `1px solid #C2352B` | — | 5 px |
| Deshabilitado | 34 px | `1px solid #E4E6EA` | — | 5 px |

- Padding interior: `0 11–13px`
- Tipografía: `400 12.5px 'Geist' color:#0E1116`
- Texto de error: `font:400 11px 'Geist' color:#C2352B margin-top:5px`

### Campo en tema oscuro (login)

| Estado | Alto | Borde | Shadow | Radio |
|---|---|---|---|---|
| Reposo | **40 px** | `1px solid rgba(255,255,255,.18)` | — | 6 px |
| Foco | 40 px | `1px solid #4D8DFF` | `0 0 0 3px rgba(77,141,255,.16)` | 6 px |
| Error | 40 px | `1px solid #FF8B80` | — | 6 px |

### Reglas de formularios

- Cero modales para trabajar. Los modales solo confirman destrucción.
- 44 px donde se toca (táctil) — sin excepción.
- El foco siempre visible: `0 0 0 3px rgba(47,107,255,.14)`.

---

## 15. Navegación

### Rutas

- `/` → si sesión válida: hub. Si no: portada pública.
- `/entrar` → ventana de login sobre la portada.

### Reglas del menú de pantallas

- Un solo nivel de anidado.
- Siempre se marca la hoja activa, nunca el grupo.
- Al pasar cursor por otro ícono del rail, la hoja cambia sin cerrarse.
- Al elegir destino, el menú flotante se cierra.
- Fijar el menú es preferencia global, no por app.

### Búsqueda ⌘K

No es un tipo de pantalla: es una capa que se posa sobre cualquier pantalla.

---

## 16. La web pública

**URL:** `nucleoadc.ai`

- Con sesión activa: redirige al hub sin pintar la portada
- Sin sesión: portada con foto, headline, tres puntos de «qué es» — sin scroll
- La ventana de login: `width:376px`, aparece sobre la portada atenuada y desenfocada
- Nunca pide sucursal ni rol en el login: vienen del alta de usuarios
- Error de credenciales: vive en el campo (borde `#FF8B80` dark / `#C2352B` claro), no en toast

**Portada:**
- Fondo: `#050D16`
- Headline: `600 40px/1.1 'Geist' letter-spacing:-.03em`
- Bajada: `300 15–16px/1.65 'Geist'`
- CTA: `height:36px padding:0 20px border-radius:18px background:#FFFFFF color:#00244D`

**Ventana de login:**
- `background:rgba(10,20,32,.86) border-radius:12px box-shadow:0 30px 70px rgba(0,0,0,.6)`
- Overlay de backdrop: `rgba(3,9,16,.62) backdrop-filter:blur`

---

## 17. Pantallas (tipos)

Once tipos. Se combinan, no se acumulan.

| Tipo | Pregunta que responde | Cuándo |
|---|---|---|
| T1 — Hub | "¿qué me espera?" | Entrada de cada app |
| T2 — Puesto | "¿cómo voy?" | Indicadores del propio puesto |
| T3 — Gestión | "¿cómo va mi equipo?" | Solo si el rol gestiona a otros |
| T4 — Listado | "búscame…" | Catálogos, historiales, filas de trabajo |
| T5 — Expediente | "ábreme el caso" | Detalle de un registro |
| T6 — Captura | "voy a registrar" | Formulario de creación |
| T7 — Flujo | (un paso depende del anterior) | Solo si T6 requiere secuencia |
| T8 — Bandeja | "apruebo o no" | Solo para autorizadores |
| T9 — Reporte fijo | "el de siempre" | Estados financieros, reportes recurrentes |
| T10 — Núcleo | "tengo una duda" | Consulta al asistente AI |
| T11 — Configuración | "cámbialo" | Ajustes de la app |

**Combinación típica:** T2 de entrada + T4 con el trabajo + T5 al abrir una fila + T6 al crear. Menos de cuatro es lo normal; más de nueve indica que no se decidió el alcance.

**Lo que NO es un tipo de pantalla:**
- ⌘K — capa sobre cualquier pantalla
- Los 6 estados del sistema — estados de un tipo, no tipos
- Panel de detalle de indicador — capa sobre T2, T3 o T9
- Confirmación destructiva — un diálogo, no una pantalla

**Extensibilidad:** "Si la misma pantalla nueva aparece en dos apps distintas y no encaja en ninguno de los once, el tipo doce existe y hay que documentarlo aquí antes de construirlo la segunda vez."

---

## 18. Modo oscuro

Diferencias sistemáticas respecto al tema claro:

| Zona | Claro | Oscuro |
|---|---|---|
| Rail | `#00244D` | `#0D1826` |
| Encabezado | `#FFFFFF` | `#101C2B` |
| Mesa | `#F4F5F7` | `#070F18` |
| Tarjeta | `#FFFFFF border:#E4E6EA` | `#101C2B border:#1D2836` |
| Tarjeta elevada | — | `#16253A` |
| Menú de pantallas | `#FFFFFF` | `#0F1A29` |
| Ítem activo en menú | `#EEF2FB` | `#1D3350` |
| Texto principal | `#0E1116` | `#E9EEF4` |
| Texto secundario | `#5B6472` | `#A8B6C6` |
| Rótulos | `#6B7482` | `#8B98A8` |
| Borde rail activo | `#FFFFFF` | `#4D8DFF` |
| Botón enviar Núcleo | `#00244D` | `#2F6BFF` |
| Estado cumple | `#0B7A53` | `#2FBE86` |
| Estado riesgo | `#8A5A12` | `#E0A640` |
| Estado fuera | `#C2352B` | `#FF8B80` |
| Azul acción | `#2F6BFF` | `#7C8DFF` |

**Regla documentada:** "La calificación ponderada es navy en claro y hueso en oscuro: siempre el elemento de mayor contraste, nunca un color de estado."

---

## 19. Variables CSS

### Variables operativas (`:root` en Doc 07)

```css
:root {
  --sup: #fff;
  --mesa: #f4f5f7;
  --bd: #e4e6ea;
  --line: #eef0f3;
  --ink: #0e1116;
  --mut: #6b7482;
  --soft: #3d4551;
  --acc: #2f6bff;
  --rail: #00244d;
  --railIcon: #7f9cc0;
  --hoja: #fff;
  --activo: #eef2fb;
  --activoInk: #00244d;
  --dang: #c2352b;
  --amb: #b7791f;
  --ok: #0b7a53;
  --sombra: rgba(0,36,77,.16);
  --velo: rgba(11,20,32,.28);
}
```

### Tokens oklch — `packages/ui/src/styles/theme.css`

```css
:root {
  --background: oklch(0.988 0.001 265);      /* #FBFBFC */
  --foreground: oklch(0.188 0.012 265);      /* #0E1116 */
  --card: oklch(1 0 0);
  --primary: oklch(0.548 0.212 262);         /* #2F6BFF */
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.962 0.003 265);
  --secondary-foreground: oklch(0.262 0.074 258);   /* #00244D */
  --accent: oklch(0.958 0.020 258);
  --accent-foreground: oklch(0.548 0.212 262);
  --ring: oklch(0.548 0.212 262);
  --muted: oklch(0.968 0.002 265);
  --muted-foreground: oklch(0.565 0.014 265);        /* #98A0AC */
  --border: oklch(0.918 0.004 265);
  --input: oklch(0.918 0.004 265);
  --success: oklch(0.520 0.115 158);         /* #0E8A5F */
  --warning: oklch(0.610 0.115 75);          /* #B7791F */
  --destructive: oklch(0.505 0.175 27);      /* #C2352B */
  --chart-1: oklch(0.262 0.074 258);         /* navy ADC */
  --chart-2: oklch(0.548 0.212 262);         /* azul núcleo */
  --chart-3: oklch(0.780 0.115 210);         /* cian chispa */
  --chart-4: oklch(0.520 0.115 158);
  --chart-5: oklch(0.700 0.020 265);
  --radius: 0.375rem;                        /* 6 px */
  --sidebar: oklch(1 0 0);
  --sidebar-primary: oklch(0.262 0.074 258); /* #00244D */
  --sidebar-accent: oklch(0.958 0.020 258);
  --sidebar-border: oklch(0.918 0.004 265);
}

.dark {
  --background: oklch(0.212 0.032 258);
  --foreground: oklch(0.975 0.004 265);
  --card: oklch(0.248 0.034 258);
  --primary: oklch(0.640 0.185 250);
  --secondary: oklch(0.292 0.032 258);
  --accent: oklch(0.312 0.042 258);
  --muted-foreground: oklch(0.672 0.018 258);
  --border: oklch(1 0 0 / 12%);
  --success: oklch(0.700 0.130 160);
  --warning: oklch(0.760 0.130 78);
  --destructive: oklch(0.660 0.185 25);
  --sidebar: oklch(0.228 0.032 258);
}
```

---

## 20. API y datos

### Endpoints

Solo dos endpoints para el tablero de indicadores:

| Endpoint | Cuándo se llama |
|---|---|
| `GET /api/tablero/indicadores/tarjetas?anio=2026&mes=8&sucursales=4` | Una vez por pantalla; alimenta los 4 usos y el encabezado del panel |
| `GET /api/tablero/indicadores/serie?idIndicador=1&idNivelAnalisis=96&anio=2026&mes=8` | Solo al abrir el panel de detalle |

Base dev: `adcapi-dev.azurewebsites.net`

### Campos del JSON y su origen

| Campo | Origen | Nota |
|---|---|---|
| `tipoIndicadorClave` / `tipoIndicadorNombre` | MDM → `dim.Indicador` | El dígito ordinal es solo para filtrado |
| `nivelNombre` · `nivelTipo` | `dim.Indicador_NivelAnalisis` | Falta en el endpoint actual |
| `nombreCorto` (25 ch) + `nombreIndicador` (50 ch) | `ai.vw_Catalogo_Indicador` | Ambos deben viajar. Bug actual: la vista colapsa ambos |
| `valor` | `fact.Indicador_Real` (grano diario) | Acumulado MTD si `esAcumulativo=1`; snapshot si no |
| `objetivo` | `fact.Indicador_Objetivo` | `null` → sin barra, sin porcentaje |
| `avanceObjetivo` | Calculado en la vista | Llega como decimal (0.694 = 69.4%) |
| `varSPLM` · `varSPLY` | Mismo indicador, mismo nivel, mismo día del mes | `null` → "—" nunca "0%" |
| `direccionDeseable` | MDM → `dim.Indicador` | "Arriba" / "Abajo" — gobierna sobre el signo |
| `claseClave` | MDM → `dim.Indicador` | DESEMPENO · CONTROL · REFERENCIA · PERCEPCION |
| `estatusCalculo` | `calc.Indicador_Real_Mensual` | Falta en endpoint; "SIN_OPERACION" → "—" nunca "0%" |
| `numerador` · `denominador` | `fact.Indicador_Real` | Para porcentajes: "12 de 87" no solo "14%" |
| `fecha` | Último día CON dato en ese mes | Mostrar esta fecha, no la de hoy |
| `esAcumulativo` | MDM → `dim.Indicador` | Decide si la gráfica es acumulativa o snapshot diario |

### Campos faltantes en el endpoint actual

| Campo | Status | Fuente | Para qué |
|---|---|---|---|
| `nivelTipo` · `nivelClave` | Falta en API y en vista | `dim.Indicador_NivelAnalisis` | Chip de nivel por tipo |
| `varSPLMMismoDia` · `varSPLYMismoDia` | Falta en API y en vista | `calc.Indicador_Real_Mensual` | M sin huecos; A nunca publicado |
| `estatusCalculo` | Falta en API y en vista | `calc.Indicador_Real_Mensual` | Distinguir cero real de SIN_OPERACION |
| `nombreIndicador` largo | Falta en API (vista lo colapsa) | `ai.vw_Catalogo_Indicador` | Panel de detalle |
| `fechaCorte` | Falta en API solo | `ai.vw_Indicador_Tarjeta.Fecha` | Footer de la tarjeta |

### Campos/endpoints prohibidos

- `GET /api/consola/reales` — lee una vista distinta; 554 de 2,344 filas difieren
- `GET /api/dwh/indicadores/tarjetas` — legacy para Motor de Tracción
- `?pestana=` — 23,086 filas tienen `Pestana = NULL`; devuelve cero tarjetas sin error
- `[SPLY MTD]` medida DAX — copia idéntica de `[SPLY]` de mes cerrado; el signo se invierte

### Ocho reglas de datos

1. Las tarjetas no suman — totales solo si ese nivel de análisis existe en `dim.Indicador_NivelAnalisis`
2. M y A comparan los mismos días transcurridos, no meses cerrados (ADR 0008 y ADR 0009)
3. `EstatusCalculo = 'SIN_OPERACION'` → mostrar "—" o "sin operación", nunca barra roja con 0%
4. Sin `Objetivo` (null) → sin barra, sin diagonal, sin porcentaje; no 0% ni 100%
5. El color lo rige `DireccionDeseable`, no el signo — nunca hardcodear "▲ = verde"
6. Porcentajes llegan como decimales; `Var_*` = null cuando es null o base cero → "—", no "0%" ni "∞"
7. Riesgo de objetivo duplicado: `fact.Indicador_Objetivo` tiene `VersionPlan` en la clave; hay indicadores con 2 versiones → el consumidor debe seleccionar la vigente
8. Cada fuente tiene lag distinto → mostrar `Fecha` (fecha de corte), no la fecha de hoy

### Jerarquía de niveles de análisis

| NivelTipo | Conteo | Formato de NivelNombre |
|---|---|---|
| DepartamentoSucursal | 206 | "MG Celaya - ATRACCION DE CLIENTES" |
| Sucursal | 18 | "MG Celaya" |
| Entidad | 3 | "Automotriz del Centro" |
| Global | 1 | "Global" |
| Colaborador | 0 (futuro) | asesor, jefe de piso |

El cintillo debe manejar 1 o 2 segmentos.

### Contrato JSON completo

```json
{
  "claveIndicador": "VTA_WALKIN",
  "nombreIndicador": "Tráfico Walk-In",
  "nivelNombre": "MG Celaya - Atracción de Clientes",
  "nivelTipo": "DepartamentoSucursal",
  "tipoIndicadorClave": "3EM",
  "tipoIndicadorNombre": "EMPUJE",
  "claseClave": "DESEMPENO",
  "unidadMedidaClave": "CLI",
  "unidadMedidaFormato": "#,##0",
  "direccionDeseable": "Arriba",
  "nivelLectura": "MANDO",    // ⚠ PENDIENTE EN MDM
  "peso": 0.20,               // ⚠ PENDIENTE EN MDM
  "valor": 483,
  "esAcumulativo": true,
  "avanceObjetivo": 0.831,    // DECIMAL — multiplicar × 100 para mostrar
  "objetivo": 581,            // null → sin barra
  "valorCentro": null,        // solo CONTROL
  "toleranciaInf": null,
  "toleranciaSup": null,
  "valorReferencia": null,    // solo REFERENCIA
  "varSPLM": 0.28,
  "varSPLY": 0.21,
  "numerador": null,
  "denominador": null,
  "responsable": "Gerencia de Sucursal",
  "periodicidad": "DIARIA",
  "estatusCalculo": "OK",     // OK | SIN_OPERACION
  "fecha": "2026-08-27"       // último día CON dato
}
```

---

## 21. Paquetes y componentes React

| Componente | Ubicación | Función |
|---|---|---|
| `<TarjetaIndicador />` | `packages/ui` | Tarjeta de mando y operativa; `nivel="auto"` detecta por puesto |
| `<AppIcon />` | `packages/ui/src/components/app-icon.tsx` | Cápsula de app (sm/md/lg); usa `resolveIcon()` |
| `<NucleoLogo />` | `nucleo-logo.tsx` | Símbolo en peso sólido, monocromo, `currentColor` |
| `<Cargando />` | `packages/shell` | Estado de carga (esqueleto) |
| `<Vacio />` | `packages/shell` | Estado vacío |
| `<SinAcceso />` | `packages/shell` | Estado sin permiso |
| `<ErrorPanel />` | `packages/shell` | Estado de error de datos |
| `<SesionExpirada />` | `packages/shell` | Único modal sobre la mesa |
| `<SinConexion />` | `packages/shell` | Estado sin red |
| `Skeleton` | `packages/ui/skeleton` | Primitiva de esqueleto |
| `ICON_MAP` | `packages/api-client/src/lib/icon-map.tsx` | Registro de glifos Lucide por módulo |
| `theme.css` | `packages/ui/src/styles/theme.css` | Tokens CSS (`:root` y `.dark`) |

---

## 22. Voz y copy

**Así sí:**
- "Utilidad operativa 11.8% bajo presupuesto. El costo de ventas explica 8 de los 9 puntos."
- "Periodo abierto — las cifras se mueven hasta el cierre."
- "2 solicitudes vencen hoy. Autorizar en lote."
- "Te faltan 98. Quedan 9 días."

**Así no:**
- "¡Ups! Algo no salió como esperábamos 😅"
- "Potencia tu gestión con insights impulsados por IA."
- "Tienes pendientes. Da clic aquí para saber más."

**Reglas:**
- Español claro, sin jerga sin traducir
- Siempre con el número enfrente
- Sin emojis de sistema
- Sin texto en inglés del framework visible al usuario
- La AI siempre en segunda persona: "Te faltan", "vas mejor", "llegas"
- Errores en el campo, nunca en toast
