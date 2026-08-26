'use client'

// DialogoConfirmacion — único modal permitido. Solo para acciones destructivas.
// El botón dice el acto ('Rechazar los 3'), nunca 'Aceptar'.
// 0-2 campos opcionales para capturar un motivo.
// Ref: doc 09-formularios §05 DIÁLOGO, CLAUDE.md §Formularios

import { useEffect, ReactNode } from 'react'

interface DialogoConfirmacionProps {
  abierto: boolean
  titulo: string
  descripcion?: string
  etiquetaConfirmar: string   // e.g. 'Eliminar las 3 cuentas'
  onConfirmar: () => void
  onCancelar: () => void
  peligroso?: boolean         // true → botón rojo relleno
  confirmando?: boolean
  children?: ReactNode        // campos opcionales (0-2)
}

export function DialogoConfirmacion({
  abierto,
  titulo,
  descripcion,
  etiquetaConfirmar,
  onConfirmar,
  onCancelar,
  peligroso = true,
  confirmando = false,
  children,
}: DialogoConfirmacionProps) {
  useEffect(() => {
    if (!abierto) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancelar()
    }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [abierto, onCancelar])

  if (!abierto) return null

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        background: 'rgba(3,9,16,.62)',
        backdropFilter: 'blur(4px)',
      }} />

      {/* Diálogo */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 90,
        width: 420,
        background: 'var(--nuc-surface)',
        borderRadius: 8,
        boxShadow: '0 12px 26px rgba(0,36,77,.24)',
        overflow: 'hidden',
        border: peligroso ? '1px solid #F6D5D2' : '1px solid var(--nuc-border)',
      }}>
        {/* Encabezado */}
        <div style={{ padding: '18px 20px 14px' }}>
          <div style={{
            font: '600 17px/1.2 var(--font-geist-sans), sans-serif',
            letterSpacing: '-.015em',
            color: peligroso ? 'var(--nuc-rojo)' : 'var(--nuc-ink)',
            marginBottom: descripcion ? 6 : 0,
          }}>
            {titulo}
          </div>
          {descripcion && (
            <div style={{
              font: '400 12.5px/1.6 var(--font-geist-sans), sans-serif',
              color: 'var(--nuc-ink-2)',
            }}>
              {descripcion}
            </div>
          )}
        </div>

        {/* Campos opcionales */}
        {children && (
          <div style={{
            padding: '0 20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            borderTop: '1px solid var(--nuc-border)',
            paddingTop: 16,
          }}>
            {children}
          </div>
        )}

        {/* Pie */}
        <div style={{
          borderTop: '1px solid var(--nuc-border)',
          background: 'var(--nuc-surface-header)',
          padding: '11px 20px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 10,
        }}>
          <button
            type="button"
            onClick={onCancelar}
            style={{
              height: 32,
              padding: '0 14px',
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
            onClick={onConfirmar}
            disabled={confirmando}
            style={{
              height: 32,
              padding: '0 16px',
              borderRadius: 7,
              background: peligroso ? '#C2352B' : '#00244D',
              border: 'none',
              font: '600 12.5px var(--font-geist-sans), sans-serif',
              color: '#FFFFFF',
              cursor: confirmando ? 'wait' : 'pointer',
              outline: 'none',
              opacity: confirmando ? .7 : 1,
            }}
          >
            {confirmando ? 'Procesando…' : etiquetaConfirmar}
          </button>
        </div>
      </div>
    </>
  )
}
