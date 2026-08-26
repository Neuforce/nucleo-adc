'use client'

// FormatoF6 — Desempeño de área: indicadores + desglose del que falla + trayectoria.
// Encabezado: cifra de cumplimiento ponderado 32px + comparativos M/A.
// Tarjetas 214×132px idénticas al tablero. Desglose del indicador que falla.
// Cierra con trayectoria mensual (mismo indicador como F3 embebido).
// Ref: doc 10-reportes-fijos §06

import { TarjetaIndicador } from '../indicadores/tarjeta'
import type { Indicador, Alarma } from '../indicadores/types'

export interface DesglosePuesto {
  puesto: string
  responsable: string
  personas: number
  real: number
  objetivo: number
  cumplimiento: number
}

export interface ComponenteF6 {
  nombre: string
  real: number
  objetivo: number
  cumplimiento: number
}

interface FormatoF6Props {
  entidad: string
  area?: string
  periodo: string
  responsable?: string
  personas?: number
  puestos?: number
  cumplimientoPonderado: number        // decimal 0-1
  varM?: number
  varA?: number
  indicadores: Array<{
    indicador: Indicador
    alarma?: Alarma
  }>
  // Desglose del indicador que falla (opcional)
  indicadorDesgloseNombre?: string
  indicadorDesgloseTexto?: string
  desglosesPuesto?: DesglosePuesto[]
  componentesCifra?: ComponenteF6[]
  // Trayectoria (opcional, F3 embebido)
  meses?: string[]
  mesActualIdx?: number
  trayectoriaFilas?: Array<{
    nombre: string
    valores: (number | null)[]
  }>
}

function colorCumpl(c: number) {
  if (c >= 1) return 'var(--nuc-verde-txt)'
  if (c >= 0.80) return 'var(--nuc-ambar-txt)'
  return 'var(--nuc-rojo)'
}

function colorVar(v: number) {
  return v >= 0 ? 'var(--nuc-verde-txt)' : 'var(--nuc-rojo)'
}

function Barra({ valor, max }: { valor: number; max: number }) {
  const pct = max > 0 ? Math.min((valor / max) * 100, 100) : 0
  return (
    <div style={{ flex: 1, height: 4, background: 'var(--nuc-border-sub)', borderRadius: 2, position: 'relative' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: `${pct}%`,
        background: 'var(--nuc-rojo)',
        borderRadius: 2,
      }} />
    </div>
  )
}

export function FormatoF6({
  entidad,
  area,
  periodo,
  responsable,
  personas,
  puestos,
  cumplimientoPonderado,
  varM,
  varA,
  indicadores,
  indicadorDesgloseNombre,
  indicadorDesgloseTexto,
  desglosesPuesto = [],
  componentesCifra = [],
  meses = [],
  mesActualIdx,
  trayectoriaFilas = [],
}: FormatoF6Props) {
  const colorPonderado = colorCumpl(cumplimientoPonderado)
  const actualIdx = mesActualIdx ?? meses.length - 1

  return (
    <div style={{ background: 'var(--nuc-surface)' }}>
      {/* Encabezado: cumplimiento ponderado */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--nuc-border)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ font: '500 11px var(--font-geist-mono), monospace', letterSpacing: '.09em', color: 'var(--nuc-ink-3)', marginBottom: 6 }}>
            {entidad}{area ? ` · ${area}` : ''} · {periodo}
          </div>
          {(personas || puestos) && (
            <div style={{ font: '400 12.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-3)' }}>
              {personas && `${personas} personas`}{puestos && ` en ${puestos} puestos`}{responsable && ` · responsable ${responsable}`}
            </div>
          )}
        </div>
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ font: '500 11px var(--font-geist-mono), monospace', letterSpacing: '.06em', color: 'var(--nuc-ink-3)' }}>
            CUMPLIMIENTO PONDERADO
          </div>
          <div style={{
            font: '600 32px/1 var(--font-geist-mono), monospace',
            letterSpacing: '-.035em',
            color: colorPonderado,
            marginTop: 6,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {Math.round(cumplimientoPonderado * 100)}%
          </div>
          {(varM !== undefined || varA !== undefined) && (
            <div style={{ font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)', marginTop: 5 }}>
              {varM !== undefined && (
                <>M <strong style={{ color: colorVar(varM), fontWeight: 600 }}>{varM >= 0 ? '▲' : '▼'}{Math.round(Math.abs(varM) * 100)}%</strong></>
              )}
              {varM !== undefined && varA !== undefined && ' · '}
              {varA !== undefined && (
                <>A <strong style={{ color: colorVar(varA), fontWeight: 600 }}>{varA >= 0 ? '▲' : '▼'}{Math.round(Math.abs(varA) * 100)}%</strong></>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas de indicadores */}
      {indicadores.length > 0 && (
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--nuc-border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 214px)',
          gap: 12,
        }}>
          {indicadores.map(({ indicador, alarma }) => (
            <TarjetaIndicador
              key={indicador.claveIndicador}
              indicador={indicador}
              alarma={alarma}
            />
          ))}
        </div>
      )}

      {/* Desglose del indicador que falla */}
      {indicadorDesgloseNombre && desglosesPuesto.length > 0 && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--nuc-border)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
            <div style={{ font: '600 13px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
              {indicadorDesgloseNombre} · desglose
            </div>
            {indicadorDesgloseTexto && (
              <div style={{ font: '400 12px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-3)' }}>
                {indicadorDesgloseTexto}
              </div>
            )}
            <div style={{ marginLeft: 'auto', font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)' }}>
              POR PUESTO
            </div>
          </div>

          <div style={{ border: '1px solid var(--nuc-border-sub)', borderRadius: 6, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 68px 150px 62px',
              gap: 10,
              alignItems: 'center',
              padding: '8px 14px',
              background: 'var(--nuc-surface-header)',
              borderBottom: '1px solid var(--nuc-surface-sub)',
            }}>
              {['PUESTO', 'REAL', 'AVANCE / META', 'CUMPL'].map((col, i) => (
                <div key={i} style={{
                  textAlign: i === 1 || i === 3 ? 'right' : 'left',
                  font: '600 11px var(--font-geist-mono), monospace',
                  letterSpacing: '.07em',
                  color: 'var(--nuc-ink-3)',
                }}>
                  {col}
                </div>
              ))}
            </div>

            {desglosesPuesto.map((d) => (
              <div
                key={d.puesto}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 68px 150px 62px',
                  gap: 10,
                  alignItems: 'center',
                  padding: '0 14px',
                  height: 42,
                  borderBottom: '1px solid var(--nuc-surface-sub)',
                }}
              >
                <div>
                  <div style={{ font: '500 12.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
                    {d.puesto}
                  </div>
                  <div style={{ font: '400 11px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-3)' }}>
                    {d.responsable} · {d.personas} personas
                  </div>
                </div>
                <div style={{ textAlign: 'right', font: '500 12.5px var(--font-geist-mono), monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--nuc-ink)' }}>
                  {d.real.toLocaleString('es-MX')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Barra valor={d.real} max={d.objetivo} />
                  <span style={{ font: '400 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)', flexShrink: 0 }}>
                    {d.objetivo.toLocaleString('es-MX')}
                  </span>
                </div>
                <div style={{
                  textAlign: 'right',
                  font: '700 12px var(--font-geist-mono), monospace',
                  color: colorCumpl(d.cumplimiento),
                }}>
                  {Math.round(d.cumplimiento * 100)}%
                </div>
              </div>
            ))}

            {/* Pie del desglose */}
            {desglosesPuesto.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 68px 150px 62px',
                gap: 10,
                alignItems: 'center',
                padding: '9px 14px',
                background: 'var(--nuc-surface-header)',
              }}>
                <div style={{ font: '700 12.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>Área</div>
                <div style={{ textAlign: 'right', font: '700 12.5px var(--font-geist-mono), monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--nuc-ink)' }}>
                  {desglosesPuesto.reduce((s, d) => s + d.real, 0).toLocaleString('es-MX')}
                </div>
                <div style={{ font: '400 11px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink-3)' }}>
                  de {desglosesPuesto.reduce((s, d) => s + d.objetivo, 0).toLocaleString('es-MX')}
                </div>
                <div style={{
                  textAlign: 'right',
                  font: '700 12px var(--font-geist-mono), monospace',
                  color: colorCumpl(
                    desglosesPuesto.reduce((s, d) => s + d.real, 0) /
                    Math.max(desglosesPuesto.reduce((s, d) => s + d.objetivo, 0), 1)
                  ),
                }}>
                  {Math.round(desglosesPuesto.reduce((s, d) => s + d.real, 0) / Math.max(desglosesPuesto.reduce((s, d) => s + d.objetivo, 0), 1) * 100)}%
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trayectoria (F3 embebido) */}
      {meses.length > 0 && trayectoriaFilas.length > 0 && (
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
            <div style={{ font: '600 13px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
              Indicadores mes a mes
            </div>
            <div style={{ marginLeft: 'auto', font: '500 11px var(--font-geist-mono), monospace', color: 'var(--nuc-ink-3)' }}>
              CUMPLIMIENTO · {meses[0]} A {meses[meses.length - 1]}
            </div>
          </div>

          <div style={{ border: '1px solid var(--nuc-border-sub)', borderRadius: 6, overflow: 'hidden', overflowX: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `196px repeat(${meses.length},1fr) 76px`,
              gap: 6,
              padding: '8px 14px',
              background: 'var(--nuc-surface-header)',
              borderBottom: '1px solid var(--nuc-surface-sub)',
              minWidth: 600,
            }}>
              <div style={{ font: '600 11px var(--font-geist-mono), monospace', letterSpacing: '.07em', color: 'var(--nuc-ink-3)' }}>INDICADOR</div>
              {meses.map((m, i) => (
                <div key={m} style={{
                  textAlign: 'right',
                  font: `${i === actualIdx ? '700' : '600'} 11px var(--font-geist-mono), monospace`,
                  color: i === actualIdx ? 'var(--nuc-ink)' : 'var(--nuc-ink-3)',
                }}>
                  {m}
                </div>
              ))}
              <div style={{ textAlign: 'right', font: '600 11px var(--font-geist-mono), monospace', letterSpacing: '.07em', color: 'var(--nuc-ink-3)' }}>TEND</div>
            </div>

            {trayectoriaFilas.map((fila) => {
              const max = Math.max(...fila.valores.filter((v): v is number => v !== null).map(Math.abs), 1)
              return (
                <div key={fila.nombre} style={{
                  display: 'grid',
                  gridTemplateColumns: `196px repeat(${meses.length},1fr) 76px`,
                  gap: 6,
                  alignItems: 'center',
                  padding: '8px 14px',
                  borderBottom: '1px solid var(--nuc-surface-sub)',
                  minWidth: 600,
                }}>
                  <div style={{ font: '500 12.5px var(--font-geist-sans), sans-serif', color: 'var(--nuc-ink)' }}>
                    {fila.nombre}
                  </div>
                  {fila.valores.map((v, i) => (
                    <div key={i} style={{
                      textAlign: 'right',
                      font: `${i === actualIdx ? '700' : '400'} 12px var(--font-geist-mono), monospace`,
                      color: i === actualIdx
                        ? colorCumpl(v ?? 0)
                        : 'var(--nuc-ink)',
                    }}>
                      {v !== null ? `${Math.round(v * 100)}%` : '—'}
                    </div>
                  ))}
                  {/* Mini barra de tendencia */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 2, height: 18 }}>
                    {fila.valores.map((v, i) => {
                      const h = v !== null ? Math.max(4, Math.round((v / max) * 100)) : 4
                      return (
                        <div key={i} style={{
                          width: 5,
                          height: `${h}%`,
                          background: i === actualIdx ? '#00244D' : '#C8CED7',
                          borderRadius: 1,
                        }} />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
