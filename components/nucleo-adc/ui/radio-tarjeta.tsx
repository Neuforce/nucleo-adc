'use client'

// RadioTarjeta — radio group en formato de tarjeta con explicación.
// Cuando la elección cambia el significado del registro, se muestra completa.
// Ref: doc 09-formularios §02 UNA DE POCAS

interface OpcionRadio {
  valor: string
  titulo: string
  descripcion?: string
}

interface RadioTarjetaProps {
  etiqueta: string
  opciones: OpcionRadio[]
  valor?: string
  onCambiar: (v: string) => void
  ayuda?: string
}

export function RadioTarjeta({
  etiqueta,
  opciones,
  valor,
  onCambiar,
  ayuda,
}: RadioTarjetaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ font: '500 11.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
        {etiqueta}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {opciones.map((op) => {
          const activa = op.valor === valor
          const bordeColor = activa ? 'var(--nuc-acc)' : 'var(--nuc-border)'
          const bg = activa ? 'var(--nuc-surface-hover)' : 'var(--nuc-surface)'

          return (
            <div
              key={op.valor}
              onClick={() => onCambiar(op.valor)}
              role="radio"
              aria-checked={activa}
              style={{
                border: `1px solid ${bordeColor}`,
                background: bg,
                borderRadius: 7,
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                cursor: 'pointer',
                transition: 'border-color .12s, background .12s',
              }}
            >
              {/* Botón radio */}
              <div style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: activa
                  ? `4px solid var(--nuc-acc)`
                  : `1.5px solid var(--nuc-ink-5)`,
                background: '#FFFFFF',
                boxSizing: 'border-box',
                flexShrink: 0,
                marginTop: 1,
                transition: 'border-color .12s',
              }} />
              <div>
                <div style={{
                  font: '600 12px var(--font-geist-sans), sans-serif',
                  color: 'var(--nuc-ink)',
                  lineHeight: 1.3,
                }}>
                  {op.titulo}
                </div>
                {op.descripcion && (
                  <div style={{
                    font: '400 11px var(--font-geist-sans), sans-serif',
                    color: 'var(--nuc-ink-2)',
                    marginTop: 2,
                    lineHeight: 1.45,
                  }}>
                    {op.descripcion}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {ayuda && (
        <span style={{ font: '400 11.5px/1.5 var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-2)' }}>
          {ayuda}
        </span>
      )}
    </div>
  )
}
