'use client'

// AnalisisGenerado — Tipo C: cuando la pregunta es por qué o cómo va cambiando.
// Una gráfica (línea SVG simple) + una descomposición de barras horizontales.
// La lectura va arriba, no debajo de la gráfica.
// Ref: doc 11-reportes-gen §04 Tipo C

interface PuntoLinea {
  etiqueta: string   // e.g. 'jun'
  valor: number      // decimal 0-1 o número absoluto
  esMeta?: boolean   // si true → este punto es la meta, se muestra como línea punteada
  esActual?: boolean // último punto real
}

interface ComponenteDescomposicion {
  nombre: string
  variacion: number    // delta en puntos porcentuales (positivo = mejora, negativo = pérdida)
  esPrincipal?: boolean
  direccionDeseable?: 'Arriba' | 'Abajo'
}

interface AnalisisGeneradoProps {
  serieValores: PuntoLinea[]
  metaValor?: number     // nivel de la meta como fracción del máximo
  etiquetaMeta?: string  // e.g. 'META 24%'
  descomposicion?: ComponenteDescomposicion[]
  tituloDescomposicion?: string  // e.g. 'DÓNDE SE PIERDE'
}

function colorDelta(variacion: number, dir?: 'Arriba' | 'Abajo') {
  if (dir === 'Arriba') {
    if (variacion > 0) return 'var(--nuc-verde-txt)'
    if (variacion > -0.02) return 'var(--nuc-ambar-txt)'
    return 'var(--nuc-rojo)'
  }
  if (dir === 'Abajo') {
    if (variacion < 0) return 'var(--nuc-verde-txt)'
    if (variacion < 0.02) return 'var(--nuc-ambar-txt)'
    return 'var(--nuc-rojo)'
  }
  return variacion >= 0 ? 'var(--nuc-verde-txt)' : 'var(--nuc-rojo)'
}

function barFill(variacion: number, dir?: 'Arriba' | 'Abajo') {
  const verde = '#0E8A5F'
  const rojo = '#C2352B'
  const amb = '#B7791F'
  if (dir === 'Arriba') return variacion > 0 ? verde : (variacion > -0.02 ? amb : rojo)
  if (dir === 'Abajo') return variacion < 0 ? verde : (variacion < 0.02 ? amb : rojo)
  return variacion >= 0 ? verde : rojo
}

export function AnalisisGenerado({
  serieValores,
  metaValor,
  etiquetaMeta,
  descomposicion = [],
  tituloDescomposicion,
}: AnalisisGeneradoProps) {
  const vals = serieValores.map((p) => p.valor)
  const maxVal = Math.max(...vals)
  const minVal = 0

  const range = maxVal - minVal || 1

  // Viewport SVG 320×84
  const W = 320
  const H = 84
  const pad = { top: 12, bottom: 12, left: 0, right: 8 }
  const chartH = H - pad.top - pad.bottom
  const chartW = W - pad.left - pad.right
  const n = serieValores.length

  function x(i: number) { return pad.left + (i / (n - 1)) * chartW }
  function y(v: number) { return pad.top + (1 - (v - minVal) / range) * chartH }

  const puntos = serieValores.map((p, i) => `${x(i).toFixed(1)},${y(p.valor).toFixed(1)}`).join(' ')

  const metaY = metaValor !== undefined ? y(metaValor) : null

  // Magnitud máxima para las barras de descomposición
  const maxAbs = Math.max(...descomposicion.map((d) => Math.abs(d.variacion)), 0.01)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Gráfica de línea */}
      <div style={{
        border: '1px solid var(--nuc-border-sub)',
        borderRadius: 6,
        padding: '16px 18px',
      }}>
        <div style={{ position: 'relative' }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height={120}
            preserveAspectRatio="none"
            style={{ display: 'block', overflow: 'visible' }}
          >
            {/* Línea base */}
            <line
              vectorEffect="non-scaling-stroke"
              x1={0} y1={H - pad.bottom}
              x2={W} y2={H - pad.bottom}
              stroke="var(--nuc-border)"
              strokeWidth={1}
            />
            {/* Línea de meta */}
            {metaY !== null && (
              <line
                vectorEffect="non-scaling-stroke"
                x1={0} y1={metaY}
                x2={W} y2={metaY}
                stroke="var(--nuc-border-input)"
                strokeWidth={1.5}
                strokeDasharray="7 4"
              />
            )}
            {/* Línea de datos */}
            <polyline
              vectorEffect="non-scaling-stroke"
              points={puntos}
              fill="none"
              stroke="#00244D"
              strokeWidth={2.5}
            />
            {/* Punto final (actual) */}
            {serieValores.length > 0 && (() => {
              const last = serieValores[serieValores.length - 1]
              const lx = x(serieValores.length - 1)
              const ly = y(last.valor)
              return <circle vectorEffect="non-scaling-stroke" cx={lx} cy={ly} r={4} fill="var(--nuc-rojo)" />
            })()}
          </svg>

          {/* Etiqueta de meta */}
          {metaY !== null && etiquetaMeta && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: `${(metaY / H) * 100}%`,
              transform: 'translateY(-50%)',
              font: '700 11px var(--font-geist-mono), monospace',
              color: 'var(--nuc-ink-3)',
              background: 'var(--nuc-surface)',
              padding: '1px 3px',
            }}>
              {etiquetaMeta}
            </div>
          )}
        </div>

        {/* Etiquetas de inicio y fin */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 9,
        }}>
          {serieValores.length > 0 && (
            <>
              <span style={{ font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)' }}>
                {serieValores[0].etiqueta}
              </span>
              <span style={{ font: '600 11px var(--font-geist-mono), monospace', color: 'var(--nuc-rojo)' }}>
                {serieValores[serieValores.length - 1].etiqueta}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Descomposición */}
      {descomposicion.length > 0 && (
        <div>
          {tituloDescomposicion && (
            <div style={{
              font: '600 11px var(--font-geist-mono), monospace',
              letterSpacing: '.07em',
              color: 'var(--nuc-ink-3)',
              marginBottom: 10,
            }}>
              {tituloDescomposicion}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {descomposicion.map((comp, i) => {
              const anchoBarra = Math.abs(comp.variacion) / maxAbs * 100
              const fillColor = barFill(comp.variacion, comp.direccionDeseable)
              const textColor = colorDelta(comp.variacion, comp.direccionDeseable)
              const signo = comp.variacion >= 0 ? '+' : '−'
              const abs = Math.abs(comp.variacion * 100).toFixed(1)

              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 150, font: '500 12px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)', flexShrink: 0 }}>
                    {comp.nombre}
                  </span>
                  <div style={{
                    flex: 1,
                    height: 12,
                    background: 'var(--nuc-border-sub)',
                    borderRadius: 2,
                  }}>
                    <div style={{
                      width: `${anchoBarra}%`,
                      height: 12,
                      background: fillColor,
                      borderRadius: 2,
                    }} />
                  </div>
                  <span style={{
                    width: 74,
                    textAlign: 'right',
                    font: '600 12px var(--font-geist-mono), monospace',
                    color: textColor,
                    flexShrink: 0,
                  }}>
                    {signo}{abs} pp
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
