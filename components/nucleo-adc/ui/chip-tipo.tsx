// Chip de tipo / clase de indicador.
// Base: padding:3px 8px border-radius:4px font:600 11px Geist Mono letter-spacing:.05em
// Tipo (META/RUMBO/EMPUJE/ARRANQUE): color:#00244D background:#EEF1F6 border:1px solid #DDE3EC
// Tipo REFERENCIA: color:#5B6472 background:#FBFBFC border:1px solid #E4E6EA
// Clase CONTROL: color:#2F6BFF background:#F4F7FF border:1px solid #D5DBF9
// Clase otras: color:#5B6472 background:#FBFBFC border:1px solid #E4E6EA
// Ref: design.md §9

import type { ClaseClave } from '../indicadores/types'

type TipoIndicador = 'META' | 'RUMBO' | 'EMPUJE' | 'ARRANQUE' | 'REFERENCIA'

interface ChipTipoProps {
  tipo?: TipoIndicador
  clase?: ClaseClave
}

const estilosTipo: Record<
  TipoIndicador,
  { color: string; background: string; border: string }
> = {
  META:      { color: '#00244D', background: '#EEF1F6', border: '1px solid #DDE3EC' },
  RUMBO:     { color: '#00244D', background: '#EEF1F6', border: '1px solid #DDE3EC' },
  EMPUJE:    { color: '#00244D', background: '#EEF1F6', border: '1px solid #DDE3EC' },
  ARRANQUE:  { color: '#00244D', background: '#EEF1F6', border: '1px solid #DDE3EC' },
  REFERENCIA:{ color: 'var(--nuc-ink-2)', background: 'var(--nuc-surface-sub)', border: '1px solid var(--nuc-border)' },
}

const estilosClase: Record<
  ClaseClave,
  { color: string; background: string; border: string }
> = {
  DESEMPENO:  { color: 'var(--nuc-ink-2)', background: 'var(--nuc-surface-sub)', border: '1px solid var(--nuc-border)' },
  CONTROL:    { color: 'var(--nuc-acc-link)', background: '#F4F7FF', border: '1px solid #D5DBF9' },
  REFERENCIA: { color: 'var(--nuc-ink-2)', background: 'var(--nuc-surface-sub)', border: '1px solid var(--nuc-border)' },
  PERCEPCION: { color: 'var(--nuc-ink-2)', background: 'var(--nuc-surface-sub)', border: '1px solid var(--nuc-border)' },
}

export function ChipTipo({ tipo, clase }: ChipTipoProps) {
  // Chip de tipo tiene prioridad. En REFERENCIA el chip de clase se colapsa.
  let etiqueta: string
  let estilo: { color: string; background: string; border: string }

  if (tipo) {
    etiqueta = tipo
    estilo = estilosTipo[tipo]
  } else if (clase) {
    // En tipo REFERENCIA el chip de clase se colapsa (redundante)
    etiqueta = clase === 'DESEMPENO' ? 'DESEMPEÑO' : clase
    estilo = estilosClase[clase]
  } else {
    return null
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        borderRadius: 4,
        border: estilo.border,
        background: estilo.background,
        fontFamily: 'var(--font-geist-mono), monospace',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '.05em',
        color: estilo.color,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
      }}
    >
      {etiqueta}
    </span>
  )
}
