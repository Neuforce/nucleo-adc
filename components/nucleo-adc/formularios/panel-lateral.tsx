'use client'

// PanelLateral — formulario de 480px que entra desde la derecha.
// Para editar un renglón de una lista larga sin perderla de vista.
// 2-5 campos. Ref: doc 09-formularios §05 PANEL LATERAL

import { useEffect, ReactNode } from 'react'

interface PanelLateralProps {
  titulo: string
  subtitulo?: string
  abierto: boolean
  onCerrar: () => void
  onGuardar?: () => void
  etiquetaGuardar?: string
  advertenciaGuardar?: string   // e.g. "Queda pendiente de aplicar al DWH"
  guardando?: boolean
  children: ReactNode
}

export function PanelLateral({
  titulo,
  subtitulo,
  abierto,
  onCerrar,
  onGuardar,
  etiquetaGuardar = 'Guardar',
  advertenciaGuardar,
  guardando = false,
  children,
}: PanelLateralProps) {
  // Cerrar con Escape
  useEffect(() => {
    if (!abierto) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <>
      {/* Overlay semitransparente */}
      <div
        onClick={onCerrar}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'transparent',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 52,
        right: 0,
        bottom: 0,
        width: 480,
        zIndex: 50,
        background: 'var(--nuc-surface)',
        border: '1px solid var(--nuc-border)',
        borderRadius: '8px 0 0 8px',
        boxShadow: '-10px 0 24px rgba(0,36,77,.12)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Encabezado */}
        <div style={{
          padding: '16px 20px 14px',
          borderBottom: '1px solid var(--nuc-border-sub)',
          flexShrink: 0,
        }}>
          <div style={{
            font: '600 15px/1 var(--font-geist-sans), sans-serif',
            letterSpacing: '-.015em',
            color: 'var(--nuc-ink)',
            marginBottom: subtitulo ? 4 : 0,
          }}>
            {titulo}
          </div>
          {subtitulo && (
            <div style={{
              font: '500 11px var(--font-geist-mono), monospace',
              color: 'var(--nuc-ink-2)',
              letterSpacing: '.05em',
            }}>
              {subtitulo}
            </div>
          )}
        </div>

        {/* Cuerpo scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '18px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          {children}
        </div>

        {/* Pie de acciones */}
        <div style={{
          borderTop: '1px solid var(--nuc-border-sub)',
          background: 'var(--nuc-surface-header)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}>
          {advertenciaGuardar && (
            <div style={{
              font: '400 11.5px var(--font-geist-sans), sans-serif',
              color: 'var(--nuc-ambar-atencion)',
            }}>
              {advertenciaGuardar}
            </div>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 9 }}>
            <button
              type="button"
              onClick={onCerrar}
              style={{
                height: 32,
                padding: '0 13px',
                borderRadius: 7,
                border: '1px solid #D8DCE2',
                background: 'transparent',
                font: '600 12.5px var(--font-geist-sans), sans-serif',
                color: '#3D4551',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onGuardar}
              disabled={guardando}
              style={{
                height: 32,
                padding: '0 15px',
                borderRadius: 7,
                background: '#00244D',
                border: 'none',
                font: '600 12.5px var(--font-geist-sans), sans-serif',
                color: '#FFFFFF',
                cursor: guardando ? 'wait' : 'pointer',
                outline: 'none',
                opacity: guardando ? .7 : 1,
              }}
            >
              {guardando ? 'Guardando…' : etiquetaGuardar}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
