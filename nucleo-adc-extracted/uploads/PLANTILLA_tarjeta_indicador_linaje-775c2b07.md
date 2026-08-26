# Tarjeta de indicador — contrato de datos y linaje

> Texto para pegar en Claude Design como brief del componente. Todo lo de abajo está
> verificado contra el DWH `adc-mx / DWH` y contra el código de las vistas en
> `src/databases/ADC.DWH/` (agosto 2026).

---

## 1. Qué es una tarjeta

**Una tarjeta = un indicador × un nivel de análisis × un mes.**

**El diseño consume la API, no la base.** Fuente única:

```
GET /api/tablero/indicadores/tarjetas?anio=2026&mes=8&sucursales=4     ← la pantalla
GET /api/tablero/indicadores/serie?idIndicador=1&idNivelAnalisis=96…   ← al abrir el detalle
```

**Dónde están, hoy.** Verificado el 2026-08-12 llamando a las cuatro instancias:

| Ambiente | Dirección | Datos que lee | ¿Tiene estos endpoints? |
|---|---|---|---|
| **Pruebas / desarrollo** | `https://adcapi-dev.azurewebsites.net` | `adc-mx-des` (**desarrollo**) | **Sí** — 401 sin token |
| Pre-producción | `https://adcapi-pre.azurewebsites.net` | **producción** | No — 404 |
| Producción (Azure) | `https://adcapi-prod.azurewebsites.net` | producción, sin tráfico | No — 404 |
| Instancia vieja | `https://adcmgapi-pruebas.azurewebsites.net` | — | No: no es destino de este despliegue |

Para desarrollar contra la API de pruebas:

```
https://adcapi-dev.azurewebsites.net/api/tablero/indicadores/tarjetas?anio=2026&mes=8&sucursales=4
https://adcapi-dev.azurewebsites.net/api/tablero/indicadores/serie?idIndicador=1&idNivelAnalisis=96&anio=2026&mes=8
```

Las dos con `Authorization: Bearer <token>`; sin él responden 401.

> ⚠ **Dos trampas de nombre.** La instancia que se llama `adcmgapi-**pruebas**` es la vieja
> y **no** es el ambiente de pruebas de este trabajo: hoy solo sirve *Preview* de Vercel,
> corre en plan gratuito y en la comprobación dejó de responder. Y `adcapi-**pre**`, pese al
> nombre, **lee la base de producción**: no es un ambiente aislado.

> **Escritos y desplegados el 2026-08-12.** Viven en `adcmgapi`, rama
> `feat/tablero-indicadores`, [PR #13](https://github.com/ADC-Confianza-Autorama/adcmgapi/pull/13)
> (borrador), corriendo en **`adcapi-dev`**. Verificado: las dos rutas responden 401 sin
> token y una ruta inventada bajo la misma base responde 404. El razonamiento completo, en
> `IndicadoresADC/apps/indicadores/contrato/tablero-indicadores/LEEME.md`.
> **No hizo falta ningún cambio en el DWH**: las cinco vistas ya tenían todo.
> ⚠ `adcapi-dev` lee `adc-mx-des`, no producción.

**Endpoints nuevos, decisión del 2026-08-12.** El que ya existe,
`GET /api/dwh/indicadores/tarjetas`, **se queda como está**: alimenta los mosaicos del
Motor de Tracción en producción y cambiarle la forma rompe en silencio (los campos llegan
`undefined` y la pantalla sale vacía **sin error visible**, el modo de falla más caro). El
tablero nuevo estrena su propia familia de rutas; así no hay compatibilidad que respetar y
los campos se nombran bien desde la primera versión.

La serie va aparte y **solo se pide al abrir el detalle**: meterla en la tarjeta
multiplicaría por treinta una respuesta que casi siempre se pide para mirar seis números.
Se pide con **el mismo `idNivelAnalisis` que trajo la tarjeta**, no con la sucursal: así la
curva es del mismo nodo que el número grande por construcción, y queda una prueba
automatizable — *el último acumulado debe dar exactamente el valor de la tarjeta*
(verificado: 54 y 54).

Cada objeto del arreglo es **una tarjeta completa**: valor, objetivo, avance, comparativos,
formato de la unidad y dirección deseable. El front **no calcula nada**: solo formatea. Si
un dato no está en el JSON, no se inventa en el front — se agrega al endpoint, y si al
endpoint le falta, a la vista.

No es preferencia de estilo: **desde Vercel la app no alcanza `adc-mx`** (el firewall de
Azure SQL va por IP y Vercel las rota), así que en producción el único camino es la API.
El endpoint vive en [`adcmgapi`](https://github.com/ADC-Confianza-Autorama/adcmgapi)
(`IndicadoresDWHController` → `IndicadoresDWHService`), exige JWT y por dentro lee
`ai.vw_Indicador_Tarjeta`. Todo lo que sigue en este documento es **lo que hay detrás del
endpoint**: sirve para saber a dónde ir cuando un número se ve raro, no para conectarse.

> **Una tarjeta, un endpoint.** El otro camino, `GET /api/consola/reales`, lee
> `ai.vw_Indicador_Real_Mensual` y **no da los mismos números**: de 2,344 filas comparadas,
> 554 difieren (usa `Valor_Acum` en los acumulativos y une el objetivo en vivo en vez del
> congelado en el cálculo mensual). Está documentado en el encabezado de
> `ConsolaRealesController.cs`. Mezclar los dos en la misma pantalla produce dos cifras
> para el mismo indicador.

---

## 2. Anatomía: de dónde sale cada dato

Ejemplo de referencia (tarjeta del mockup):
`MG CELAYA · DESEMPEÑO` / `Afluencia` / `1,010 /1,456` / barra `69%` / `M ▲12%  A ▲6%`

El DTO de la API es espejo de la vista: el campo del JSON es la misma columna en
minúscula-camello — `IndicadorNombre` → `nombre`, `NivelNombre` → `nivel`,
`Avance_Objetivo` → `avanceObjetivo`, `Var_SPLM` → `varSPLM`. Por eso la columna de en
medio sirve para las dos cosas: es lo que pide el diseño y lo que hay que ir a buscar
cuando falta.

| Elemento visible | Ejemplo | Columna / campo | De dónde sale ese valor realmente |
|---|---|---|---|
| **Cintillo, primera parte: el nivel de análisis** — *a quién pertenece este número* | `MG CELAYA`, `AUTOS NUEVOS · MG CELAYA`, `AUTOMOTRIZ DEL CENTRO`, `GLOBAL`, y a futuro un colaborador | `NivelNombre` + `NivelTipo` (ver §2.1) | `dim.Indicador_NivelAnalisis`, maestreado en MDM. **No es el departamento dueño del indicador**: es el nodo donde está medido el valor |
| **Chip del tipo de indicador** | `RUMBO` | `TipoIndicadorClave` / `TipoIndicadorNombre` | MDM → `dim.Indicador`. El maestro lo guarda como `2 RUMBO`; **el número no se muestra** (ver §2.2) |
| Chip de la clase — qué naturaleza tiene la medición | `DESEMPEÑO` | `ClaseClave` / `ClaseNombre` | MDM → `dim.Indicador`. Categórica, sin orden |
| Título | `Afluencia` | **`nombre` y `nombreCorto`, los dos** | `ai.vw_Catalogo_Indicador` ← MDM. Ver el aviso de abajo |
| **Número grande (el real)** | `1,010` | `Valor` | Si el indicador es acumulativo (`IndicadorEsAcumulativo = 1`), es el **acumulado del mes hasta el último día con dato**; si no, el valor de ese día. Viene de `fact.Indicador_Real` (grano **diario**) agregado en `ai.vw_Indicador_Real_Diaria` |
| Número chico tras la diagonal (la meta) | `/1,456` | `Objetivo` | `fact.Indicador_Objetivo`, filtrando `FrecuenciaClave='MENSUAL'` y `TipoObjetivo='PRESUPUESTO'`. Se carga con `calc.usp_Cargar_Indicador_Objetivo` |
| Barra y porcentaje | `69%` | `Avance_Objetivo` | Calculado en la vista: `Valor / ABS(Objetivo)`. **Llega en decimal** (0.694), no en porcentaje |
| **`M ▲12%` — M es *mes anterior*** | | `Var_SPLM`, y el dato base en `Valor_SPLM` | Mismo indicador, mismo nivel, **mes anterior al mismo día del mes**. La vista toma el acumulado del mes pasado cortado en el mismo día, no el mes completo |
| **`A ▲6%` — A es *año anterior*** | | `Var_SPLY`, dato base en `Valor_SPLY` | Igual, doce meses atrás, también cortado al mismo día |
| Formato del número | `1,010` | `UnidadMedidaFormato` (`#,##0`) y `UnidadMedidaClave` (`CLI` clientes, `PORC` %, `MXN` pesos) | MDM → `dim.Indicador` |
| Color/sentido de la flecha | verde ▲ | `DireccionDeseable` (`Arriba` / `Abajo`) | MDM → `dim.Indicador` |
| Departamento dueño del indicador (opcional, para agrupar tarjetas) | `AC` = Atracción de Clientes | prefijo de `Id_ClaveIndicador` (`AC_AC_Afluencia_CLI`) | MDM → `dim.Indicador`. Es *quién responde por el indicador*, no dónde está medido |
| Mes / corte de la foto | `al 11-ago-2026` | `Fecha`, `Anio`, `Mes` | `Fecha` es el **último día con dato** de ese mes, no el último día del calendario |
| Numerador y denominador (para el detalle) | | `Numerador`, `Denominador` | Útil en indicadores de porcentaje: "12 de 87", no solo "14%" |

### 2.0 Cada indicador tiene DOS nombres, y los dos deben viajar

`ai.vw_Catalogo_Indicador` guarda ambos, y **los 415 indicadores del catálogo tienen los
dos** (verificado 2026-08-12):

| Campo | Tope | Ejemplo real |
|---|---|---|
| `IndicadorNombre` | 50 caracteres | `Porcentaje Ordenes Criticas Mantenimiento Incluido` |
| `NombreCorto` | **25 caracteres** | `Órdenes Críticas MI` |

El corto es el **curado a mano** —hasta los acentos están mejor puestos que en el largo— y
es el que va en la tarjeta; el largo, en listados y en el detalle.

> ⚠ **`ai.vw_Indicador_Tarjeta` los colapsa.** Su `SELECT` hace
> `COALESCE(i.NombreCorto, c.IndicadorNombre) AS IndicadorNombre`, así que la columna que
> se llama *nombre* trae en realidad **el corto**, y el largo no sale por ningún lado. El
> endpoint nuevo tiene que unir con `ai.vw_Catalogo_Indicador` por `Id_ClaveIndicador`
> para mandar los dos, exactamente como ya lo hace `ConsolaRealesController`.

De la misma vista sale `DescripcionCorta` (200 caracteres, 17 indicadores sin ella), que
**no es una definición sino una frase de alerta**: *"Absorción de posventa baja"*, *"Pocas
oportunidades por cerrar"*. Sirve para avisar cuando el indicador va mal, no como
subtítulo neutro.

### 2.1 El nivel de análisis es variable — el cintillo tiene que aguantarlo

El mismo indicador se mide en nodos de distinto tipo, y **el tipo cambia el ancho y la
jerarquía del texto**. Hoy en el DWH (228 niveles activos) existen:

| `NivelTipo` | Cuántos hay | Cómo se ve `NivelNombre` | Cómo debería leerse en el cintillo |
|---|---|---|---|
| `DepartamentoSucursal` | 206 | `MG Celaya - ATRACION DE CLIENTES` | dos partes: sucursal + departamento |
| `Sucursal` | 18 | `MG Celaya` | una parte |
| `Entidad` | 3 | `Automotriz del Centro` (marca / empresa) | una parte |
| `Global` | 1 | `Global` | una parte, todo el grupo |
| `Colaborador` | **aún no existe** | — | está previsto: asesor, jefe de piso |

Consecuencias de diseño:

- El cintillo **no puede asumir dos segmentos**. Debe verse bien con uno solo (`GLOBAL`) y
  con dos (`MG CELAYA · ATRACCIÓN DE CLIENTES`), y con un nombre de persona el día que
  exista el nivel de colaborador.
- Conviene mostrar **el tipo de nivel** como marca visual (icono o color del chip:
  grupo → entidad → sucursal → departamento → persona), porque dos tarjetas del mismo
  indicador con el mismo número significan cosas distintas según el nodo.
- **Pendiente de datos:** `ai.vw_Indicador_Tarjeta` hoy expone `NivelNombre`,
  `Id_Sucursal` e `Id_Departamento`, pero **no** `NivelTipo` ni `NivelClave`. Para pintar
  el chip por tipo hay que agregar esas dos columnas a la vista (viven en
  `dim.Indicador_NivelAnalisis`, ya expuestas en `ai.vw_Catalogo_Indicador_NivelAnalisis`).
  Es un cambio de vista, no de modelo.
- Los nombres de nivel traen erratas de captura (`ATRACION` / `ATRACCION` conviven). Se
  corrigen **en MDM**, no en el front, y no se deben usar para partir cadenas a ciegas.

### 2.2 Tipo y clase son dos ejes, no uno

Los dos viven en el maestro (MDM) y **cada indicador tiene uno de cada uno**. Verificado el
2026-08-12 sobre los 420 indicadores activos:

| `TipoIndicador` | Clave | Activos |
|---|---|---|
| **META** | `1ME` | 34 |
| **RUMBO** | `2RU` | 29 |
| **EMPUJE** | `3EM` | 161 |
| **ARRANQUE** | `4AR` | 93 |
| **REFERENCIA** | `5REF` | 103 |

| `Clase` — la naturaleza | Activos |
|---|---|
| Control | 146 |
| Desempeño | 142 |
| Referencia | 103 |
| Percepción | 29 |

Consecuencias para el diseño:

- **El número del maestro no se muestra.** Los nombres vienen como `2 RUMBO`, y ese número
  **no corresponde a un orden acordado por nadie**: la lectura de "cadena ordenada del 1 al
  5" fue una inferencia a partir del prefijo de la clave, y German no la reconoce. El
  endpoint entrega `RUMBO` a secas y **no expone ningún campo de orden**. La **clave** sí
  conserva el dígito (`2RU`) porque es identificador y con ella se filtra.
- **Ninguna de las dos clasificaciones tiene orden**: encodear cualquiera como escala
  inventa una jerarquía que no existe.
- **Todo lo que es tipo `REFERENCIA` tiene clase `Referencia`**: ahí el segundo chip es
  redundante y conviene colapsarlo.
- Los **29 de Percepción** son encuestas (satisfacción): casi no tienen movimiento diario,
  así que en esas tarjetas la gráfica del detalle sale escalonada, no continua.

---

## 3. La cadena completa, hasta la tabla (ejemplo: Afluencia)

```
SALE-U (CRM, portal + API)
   └─ stg.Cliente_Oportunidad_SaleU / stg.Cliente_Oportunidad_SaleU_Portal
        └─ fact.Cliente_Oportunidad   (Id_TipoOportunidad = 2 → "Piso")
           fact.Cliente_Actividad     (Id_TipoActividad  = 29 → "Cita asistida")
             └─ calc.ft_Cliente_Afluencia_CLI
                  · cuenta PERSONAS distintas que pisaron la agencia
                  · cada lead cuenta UNA sola vez por mes (v1.4, definición oficial)
                  └─ calc.usp_Procesar_Indicador_Real_Diario
                       └─ fact.Indicador_Real         ← grano DIARIO, por nivel de análisis
                            └─ ai.vw_Indicador_Real_Diaria   (acumulado del mes, SPLM, SPLY)
                                 └─ ai.vw_Indicador_Tarjeta  ← LO QUE CONSUME LA TARJETA

En paralelo, la meta:
   Presupuesto autorizado
     └─ calc.usp_Cargar_Indicador_Objetivo → fact.Indicador_Objetivo → columna Objetivo

En paralelo, los maestros (nombre, unidad, clase, dirección deseable, niveles):
   MDM (indicador.*) → pipeline ADF MDM_DWH_Mensual → dim.Indicador, dim.Indicador_NivelAnalisis
```

**Cada indicador tiene su propia función `calc.ft_*`**; el resto de la cadena
(`fact.Indicador_Real` → vista diaria → tarjeta) es idéntico para los 437. Es decir: para
documentar cualquier otra tarjeta solo cambia el primer tramo, el de la función y sus
tablas de origen.

### Dónde se muestra el linaje: al hacer clic, no en la cara de la tarjeta

**La cara de la tarjeta muestra solo seis cosas** y nada más: nivel de análisis, clase,
nombre del indicador, real, objetivo y avance, y las dos variaciones (M = mes anterior,
A = año anterior). Ni ruta de datos, ni fuente, ni fecha de corte compitiendo con el
número grande.

**Al hacer clic se abre el panel de detalle**, y ahí sí va el linaje completo, en cuatro
renglones y en ese orden — de lo que entiende un gerente a lo que necesita TI:

```
Qué mide    Personas distintas que pisaron la agencia. Cada cliente cuenta una sola
            vez al mes, aunque venga varias veces.
Este dato   Acumulado del 1 al 11 de agosto de 2026 · MG Celaya · Atracción de Clientes
Origen      SALE-U (CRM) — leads registrados como Piso y citas que sí se presentaron
Meta        1,456 · presupuesto mensual autorizado
Ruta        fact.Cliente_Oportunidad + fact.Cliente_Actividad
            → calc.ft_Cliente_Afluencia_CLI → fact.Indicador_Real
            → ai.vw_Indicador_Tarjeta
```

Los primeros cuatro renglones son lenguaje de negocio y se leen siempre; **la Ruta es
técnica y va al final, en tipografía menor o plegada**. El panel también es el lugar del
detalle que no cabe en la cara: `Numerador`/`Denominador`, el valor del mes anterior y del
año anterior en unidades (no solo el %), y la fecha exacta del corte.

Regla: cada dato del panel sale de la misma vista que la tarjeta. Los textos de "Qué mide"
y "Origen" salen de la definición del indicador en **MDM** (`IndicadorDescripcion`,
`MetodoObtencion`, `FuenteDatosPrincipal`); hoy varios están vacíos y se llenan en MDM, no
en el front.

---

## 4. Reglas que el diseño no puede romper

1. **Las tarjetas no se suman.** El indicador vive en un nivel de análisis concreto
   (`DepartamentoSucursal` en el caso de Afluencia). Un total de grupo o de marca **solo
   se muestra si existe ese nivel** en `dim.Indicador_NivelAnalisis`; sumar tarjetas en el
   front está prohibido, y en porcentajes y promedios da un número falso.

2. **M y A comparan días transcurridos contra días transcurridos.** Con el mes abierto hay
   tres formas de comparar y solo una sirve para una tarjeta:

   | Comparación | Columna | Agosto 2026, MG Celaya |
   |---|---|---|
   | Mes en curso contra **mes anterior completo** | `Var_SPLM` de `ai.vw_Indicador_Real_Mensual` | **−75 %** ← falso drama |
   | Mes en curso contra **mismo día del mes anterior** | `Valor_SPLM_MismoDia` (mensual) | **−18 %** ← lo correcto |
   | Igual, pero exigiendo el mismo *número* de día | `Var_SPLM` de `ai.vw_Indicador_Tarjeta` | −18 %, pero se queda en blanco si ese día no existió |

   La regla del negocio está en el **[ADR 0008](decisiones/0008-splm-mismodia-ultimo-dia-con-dato.md)**:
   se compara contra el **último día con dato** del mes anterior que sea menor o igual al día
   de corte, porque un domingo o un festivo sin operación no es un cero. La versión anual
   equivalente (`Valor_SPLY_MismoDia`) es el **[ADR 0009](decisiones/0009-sply-mismodia-comparacion-anual-pareja.md)**.
   Medido hoy: si la tarjeta se alimentara de `vw_Indicador_Tarjeta` tal como está, en
   agosto-2026 **734 tarjetas aparecerían sin el % de mes anterior** aunque el dato existe
   en la tabla mensual (613 en julio). Ver el pendiente en §5.

3. **`0` no siempre es cero.** Si `EstatusCalculo = 'SIN_OPERACION'` (existe en la vista
   mensual) la sucursal no operaba ese mes: se muestra un guion o "sin operación", nunca
   un cero con barra roja al 0%.

4. **Sin objetivo no hay barra.** `Objetivo` puede venir `NULL` (p. ej. el nivel
   `AUTOS NUEVOS` de Afluencia no tiene presupuesto propio). En ese caso: número grande y
   comparativos, **sin** diagonal, sin barra y sin porcentaje. No se pinta 0% ni 100%.

5. **El color lo manda `DireccionDeseable`, no el signo.** En indicadores con dirección
   `Abajo` (días de inventario, costo, quejas) una variación negativa es **buena** y va en
   verde. Nunca cablear "▲ = verde".

6. **Los porcentajes llegan en decimal.** `Avance_Objetivo`, `Var_SPLM` y `Var_SPLY` vienen
   como `0.694`, `0.12`, `0.06`. Multiplicar por 100 al pintar. Y `Var_*` es `NULL` cuando
   el comparativo es nulo o cero: se muestra "—", no "0%" ni "∞".

7. **Ojo con el objetivo duplicado.** `fact.Indicador_Objetivo` tiene `VersionPlan` en la
   llave, y hoy existen casos con dos versiones para el mismo indicador/nivel/mes; la vista
   de tarjeta no filtra versión, así que esos casos devuelven **dos renglones**. Quien
   consuma debe quedarse con una (la vigente) o la tarjeta aparecerá duplicada.

8. **Los datos tienen atraso distinto por fuente.** El pie de la tarjeta debe mostrar el
   corte (`Fecha`), no la fecha de hoy. Una tarjeta sin fecha de corte miente por omisión.

---

## 5. Esto ya existe una vez: el reporte *DWH CLIENTE Afluencia MG*

No se parte de cero. La misma tarjeta está construida en Power BI
(`BI/CLIENTE/DWH CLIENTE Afluencia MG.Report`) y llega hasta la base. Conviene copiar sus
decisiones y **no** repetir sus huecos.

**Cómo está hecha hoy.** Dos páginas, dos técnicas distintas:

| | Página 1 (tablero) | Página 2 (detalle por sucursal) |
|---|---|---|
| Visual | matriz cuyas celdas son una **imagen SVG de 120 × 44 px** generada por la medida DAX `[Tarjeta KPI]` / `[Tarjeta KPI Sucursal]` | `cardVisual` nativos de Power BI |
| Tabla que lee | `ai vw_Indicador_Tarjeta` | `ai vw_Indicador_Real_Mensual` |
| Medidas | `[Tarjeta KPI]` dibuja el SVG completo | `[Valor Mensual]`, `[Objetivo]`, `[% vs Objetivo]`, `[SPLM]`, `[% MTD vs SPLM]`, `[SPLY]` |
| Filtros | sucursal (`ai vw_Catalogo_Sucursal`), periodo (`ai vw_Catalogo_Fecha`), indicador (`Id_ClaveIndicador`) | iguales |

Las gráficas de la página 1 usan `[#Indicador_MTD]`, `[#Indicador_SPLM_Acum]` y
`[#Indicador_SPLY_Acum]` por día: son la **misma tarjeta desplegada en el tiempo**, y el
diseño nuevo debería poder abrirse hacia esa curva desde el panel de detalle.

**Lo que hay que heredar:** que el número grande sea el acumulado del mes (MTD), que el
comparativo del mes anterior sea `[% MTD vs SPLM]` (ya usa el criterio del ADR 0008), y el
juego de filtros sucursal × periodo × indicador.

**Lo que NO hay que heredar — tres huecos reales, medidos:**

1. **El % contra año anterior no existe en ningún reporte.** Las tarjetas actuales muestran
   el importe `[SPLY]` pero nunca el porcentaje: es el paso 2 pendiente del ADR 0009. **La
   `A ▲6%` del diseño nuevo sería la primera vez que ese dato se publica.**
2. **Y la medida que parece servir está rota.** `[SPLY MTD]` es un copy-paste sin terminar:
   hoy es literalmente idéntica a `[SPLY]` (mes completo) en los 7 modelos semánticos. Si
   la tarjeta nueva se cuelga de ella, compara días transcurridos contra un mes cerrado y
   **el signo se invierte**: MG Irapuato, Utilidad Bruta, julio-2026 daba −21.88 % contra
   el mes completo y **+42.87 %** contra el mismo día. Hay que crear la medida nueva sobre
   `Valor_SPLY_MismoDia`, como indica el ADR 0009.
3. **La vista de la tarjeta empareja por número de día exacto.** `ai.vw_Indicador_Tarjeta`
   hereda el defecto que el ADR 0008 ya corrigió en la tabla mensual: si el mismo día del
   mes pasado no tuvo operación, la variación sale en blanco. Son **734 tarjetas en
   agosto-2026 y 613 en julio** con el dato disponible pero no visible.

**Pendiente para que la tarjeta nueva no calcule nada en el front.** Cinco campos al JSON
de `GET /api/dwh/indicadores/tarjetas`; dos de ellos existen ya en la vista y solo hay que
seleccionarlos, los otros tres necesitan primero la columna:

| Campo del JSON | Estado | De dónde sale | Para qué |
|---|---|---|---|
| `clase` | falta solo en la API | `ai.vw_Indicador_Tarjeta.ClaseNombre` | el chip de Desempeño / Resultado |
| `fechaCorte` | falta solo en la API | `ai.vw_Indicador_Tarjeta.Fecha` | el pie: el corte casi nunca es hoy |
| `nivelTipo`, `nivelClave` | falta en los dos | `dim.Indicador_NivelAnalisis` | el chip según sea grupo, entidad, sucursal, departamento o persona (§2.1) |
| `estatusCalculo` | falta en los dos | `calc.Indicador_Real_Mensual` | distinguir un cero real de `SIN_OPERACION` |
| `varSPLMMismoDia`, `varSPLYMismoDia` | falta en los dos | `calc.Indicador_Real_Mensual.Valor_SPL*_MismoDia` | la **M** sin huecos y la **A**, que hoy no se publica |

**Y un defecto que ya está en producción:** el endpoint acepta `?pestana=Ventas` y filtra
por `t.Pestana`, una columna que la vista dejó de llenar cuando ese dato se movió a MDM.
Hoy las **23,086 filas** de `ai.vw_Indicador_Tarjeta` tienen `Pestana` en `NULL`: filtrar
por pestaña devuelve **cero tarjetas y ningún error**. El campo `pestana` del DTO viaja
siempre vacío. O se quita el parámetro, o se repone el dato desde MDM.

Mientras los campos no estén, el prototipo puede unir `ai.vw_Indicador_Tarjeta` con
`ai.vw_Indicador_Real_Mensual` por `Id_Indicador` + `Id_Indicador_NivelAnalisis` + `Anio` +
`Mes`, pero eso es andamio de laboratorio: **en producción la tarjeta lee un solo objeto
JSON de un solo endpoint**.

**Ojo con el formato del reporte.** Los `DWH CLIENTE * MG` tienen link público de *Publicar
en la web*, y publicarlos en formato PBIR lo rompe. Si el diseño nuevo se implementa sobre
esos reportes, se publica por la vía pbix/legacy (ver [powerbi/CLAUDE.md](../powerbi/CLAUDE.md)).
El DAX de `[Tarjeta KPI]` vive solo dentro de `BI/CLIENTE/CLIENTE.pbix`, que es binario y no
se versiona: si el diseño nuevo se va a construir sobre esa medida, conviene extraerla y
dejarla en git antes de tocarla.

---

## 6. Diccionario mínimo para quien lea la tarjeta

- **SPLM** — *same period last month*: el mismo tramo del mes anterior. Es lo que la
  tarjeta rotula **M**.
- **SPLY** — *same period last year*: el mismo tramo del año anterior. Es la **A**.
- **Nivel de análisis** — el nodo al que pertenece el número: el grupo entero, una entidad
  (marca/empresa), una sucursal, un departamento de una sucursal y, a futuro, un
  colaborador. Un real y un objetivo en niveles distintos **nunca se cruzan**.
- **Acumulativo** — el indicador se suma a lo largo del mes (afluencia, ventas). Los no
  acumulativos (porcentajes, promedios, inventarios) se leen como foto del día.
