'use client'

// Menú de pantallas — 296 px, posición absolute, flota sobre la mesa.
// Nace siempre encogido. Se cierra al elegir destino.
// Sombra cuando flotante: 14px 0 34px rgba(0,36,77,.14), 0 -1px 0 #e4e6ea.
// Ítem: 28 px alto, margin 1px 6px, padding 0 8–9px, border-radius 6px.
// Activo: bg #EEF2FB, font 600 12px Geist color #00244D, chip 13×13px bg #00244D.
// Inactivo: font 500 12px Geist color #3D4551, chip bg #DFE3EA.
// Rótulo grupo: font 600 10px Geist Mono letter-spacing .09em color #98A0AC.
// Subitems: padding-left 24px, sin chip.

import type { MenuGrupo } from './types'

interface MenuProps {
  grupos: MenuGrupo[]
  itemActivo: string
  onItemChange: (id: string) => void
  fijado: boolean
}

export function Menu({ grupos, itemActivo, onItemChange, fijado }: MenuProps) {
  return (
    <nav
      aria-label="Menú de pantallas"
      style={{
        position: 'absolute',
        left: 56,
        top: 52,
        bottom: 0,
        width: 296,
        background: 'var(--nuc-surface)',
        borderRight: '1px solid var(--nuc-border)',
        boxShadow: fijado
          ? 'none'
          : `14px 0 34px rgba(0,36,77,.14), 0 -1px 0 var(--nuc-border)`,
        zIndex: 8,
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      {grupos.map((grupo, gi) => (
        <div key={gi} style={{ marginBottom: gi < grupos.length - 1 ? 8 : 0 }}>
          {/* Rótulo de grupo */}
          {grupo.rotulo && (
            <div
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '.09em',
                color: 'var(--nuc-ink-4)',
                textTransform: 'uppercase',
                padding: '0 12px 4px',
                marginTop: gi > 0 ? 8 : 0,
              }}
            >
              {grupo.rotulo}
            </div>
          )}

          {/* Ítems */}
          {grupo.items.map((item) => {
            const activo = item.id === itemActivo
            return (
              <div key={item.id}>
                <button
                  onClick={() => onItemChange(item.id)}
                  aria-current={activo ? 'page' : undefined}
                  style={{
                    width: 'calc(100% - 12px)',
                    height: 28,
                    margin: '1px 6px',
                    padding: '0 9px',
                    borderRadius: 6,
                    border: 'none',
                    background: activo ? 'var(--nuc-surface-hover)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    textAlign: 'left',
                  }}
                >
                  {/* Chip cuadrado */}
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: 3,
                      background: activo ? '#00244D' : 'var(--nuc-border-sub)',
                      flexShrink: 0,
                    }}
                  />

                  {/* Etiqueta */}
                  <span
                    style={{
                      fontFamily: 'var(--font-geist-sans), sans-serif',
                      fontSize: 12,
                      fontWeight: activo ? 600 : 500,
                      color: activo ? '#00244D' : 'var(--nuc-ink-3)',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.etiqueta}
                  </span>

                  {/* Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      style={{
                        fontFamily: 'var(--font-geist-mono), monospace',
                        fontSize: 10,
                        fontWeight: 600,
                        background: activo ? '#00244D' : 'var(--nuc-border-sub)',
                        color: '#FFFFFF',
                        borderRadius: 8,
                        padding: '0 4px',
                        minWidth: 15,
                        height: 15,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Subitems — solo un nivel */}
                {item.subitems?.map((sub) => {
                  const subActivo = sub.id === itemActivo
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onItemChange(sub.id)}
                      aria-current={subActivo ? 'page' : undefined}
                      style={{
                        width: 'calc(100% - 12px)',
                        height: 28,
                        margin: '1px 6px',
                        padding: '0 9px 0 24px',
                        borderRadius: 6,
                        border: 'none',
                        background: subActivo ? 'var(--nuc-surface-hover)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-geist-sans), sans-serif',
                          fontSize: 12,
                          fontWeight: subActivo ? 600 : 500,
                          color: subActivo ? '#00244D' : 'var(--nuc-ink-3)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {sub.etiqueta}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
