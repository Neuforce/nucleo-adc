// Contrato JSON completo del endpoint /api/tablero/indicadores/tarjetas
// Ref: design.md §20

export type DireccionDeseable = 'Arriba' | 'Abajo'
export type ClaseClave = 'DESEMPENO' | 'CONTROL' | 'REFERENCIA' | 'PERCEPCION'
export type EstatusCalculo = 'OK' | 'SIN_OPERACION'
export type NivelLectura = 'MANDO' | 'OPERATIVO'
export type Periodicidad = 'DIARIA' | 'SEMANAL' | 'MENSUAL' | 'TRIMESTRAL' | 'ANUAL'

export interface Indicador {
  claveIndicador: string
  nombreIndicador: string
  nivelNombre: string
  nivelTipo: 'DepartamentoSucursal' | 'Sucursal' | 'Entidad' | 'Global' | 'Colaborador'
  tipoIndicadorClave: '1META' | '2RUMBO' | '3EM' | '4ARR' | '5REF'
  tipoIndicadorNombre: 'META' | 'RUMBO' | 'EMPUJE' | 'ARRANQUE' | 'REFERENCIA'
  claseClave: ClaseClave
  unidadMedidaClave: string
  unidadMedidaFormato: string   // ej. "#,##0" | "#,##0.0%" | "$#,##0"
  direccionDeseable: DireccionDeseable
  nivelLectura: NivelLectura    // ⚠ PENDIENTE EN MDM
  peso: number | null            // ⚠ PENDIENTE EN MDM

  // Valores
  valor: number | null
  esAcumulativo: boolean
  avanceObjetivo: number | null  // DECIMAL (0.831 = 83.1%). null → sin barra
  objetivo: number | null        // null → sin barra, sin %, sin diagonal
  numerador: number | null       // para mostrar "12 de 87"
  denominador: number | null

  // Solo CONTROL
  valorCentro: number | null
  toleranciaInf: number | null
  toleranciaSup: number | null

  // Solo REFERENCIA
  valorReferencia: number | null

  // Comparativos — null cuando base cero o sin dato → mostrar "—"
  varSPLM: number | null
  varSPLY: number | null

  // Metadatos
  responsable: string | null
  periodicidad: Periodicidad
  estatusCalculo: EstatusCalculo
  fecha: string                  // "YYYY-MM-DD" — último día CON dato
}

// Tono de la tarjeta
export type Tono = 'normal' | 'destacado'

// Nivel de alarma
export type NivelAlarma = 'CRITICA' | 'ATENCION' | 'NO_EVALUABLE'

export interface Alarma {
  nivel: NivelAlarma
  motivo: string
  desde: string    // "YYYY-MM-DD"
}

// Resultado de colorEstado — colores según avance y direccionDeseable
export interface ColorEstado {
  texto: string   // color del texto / porcentaje
  relleno: string // color de la barra de progreso
  borde: string   // borde de franja o chip
  fondo: string   // fondo de franja o chip
}
