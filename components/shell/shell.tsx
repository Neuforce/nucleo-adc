'use client'

// Shell — orquestador principal.
// Zonas: Rail 56px | Header 52px | Menu 296px (abs, flota) | Mesa | Núcleo 340px (flota).
// Atajos: ⌘B toggle menú, ⌘⇧B fijar menú, ⌘K búsqueda, ⌘J Núcleo AI.
// El shell nunca desaparece en ningún estado del sistema.

import { useEffect, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Rail } from './rail'
import { Header } from './header'
import { Menu } from './menu'
import { NucleoPanel } from './nucleo-panel'
import type { App, MenuGrupo } from './types'

interface ShellProps {
  apps: App[]
  appActiva: string
  nombreApp: string
  periodo: string
  grupos: MenuGrupo[]
  itemActivo: string
  onAppChange: (id: string) => void
  onItemChange: (id: string) => void
  onPeriodoClick?: () => void
  onBusquedaClick?: () => void
  onAvatarClick?: () => void
  children: React.ReactNode
}

export function Shell({
  apps,
  appActiva,
  nombreApp,
  periodo,
  grupos,
  itemActivo,
  onAppChange,
  onItemChange,
  onPeriodoClick,
  onBusquedaClick,
  onAvatarClick,
  children,
}: ShellProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const [menuAbierto, setMenuAbierto] = useState(false)
  const [menuFijado, setMenuFijado] = useState(false)
  const [nucleoAbierto, setNucleoAbierto] = useState(false)

  // Atajos de teclado
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const cmd = e.metaKey || e.ctrlKey

      if (cmd && !e.shiftKey && e.key === 'b') {
        e.preventDefault()
        if (menuFijado) {
          setMenuFijado(false)
          setMenuAbierto(false)
        } else {
          setMenuAbierto((prev) => !prev)
        }
      }

      if (cmd && e.shiftKey && e.key === 'B') {
        e.preventDefault()
        setMenuFijado((prev) => !prev)
        setMenuAbierto(true)
      }

      if (cmd && !e.shiftKey && e.key === 'k') {
        e.preventDefault()
        onBusquedaClick?.()
      }

      if (cmd && !e.shiftKey && e.key === 'j') {
        e.preventDefault()
        setNucleoAbierto((prev) => !prev)
      }
    },
    [menuFijado, onBusquedaClick],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Cerrar menú al elegir destino (solo si no está fijado)
  const handleItemChange = (id: string) => {
    onItemChange(id)
    if (!menuFijado) {
      setMenuAbierto(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100dvh',
        overflow: 'hidden',
        background: 'var(--nuc-mesa)',
      }}
    >
      {/* Rail — siempre visible */}
      <Rail
        apps={apps}
        appActiva={appActiva}
        onAppChange={onAppChange}
        onAvatarClick={() => {
          onAvatarClick?.()
        }}
        isDark={isDark}
      />

      {/* Columna derecha: header + (menú flotante) + mesa */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header */}
        <Header
          nombreApp={nombreApp}
          periodo={periodo}
          onMenuToggle={() => {
            if (menuFijado) {
              setMenuFijado(false)
              setMenuAbierto(false)
            } else {
              setMenuAbierto((prev) => !prev)
            }
          }}
          onPeriodoClick={() => onPeriodoClick?.()}
          onBusquedaClick={() => onBusquedaClick?.()}
          onNucleoClick={() => setNucleoAbierto((prev) => !prev)}
          onAvatarClick={() => onAvatarClick?.()}
          menuAbierto={menuAbierto || menuFijado}
          nucleoAbierto={nucleoAbierto}
        />

        {/* Área bajo el header: menú (abs) + mesa + núcleo */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Menú flotante (absolute) */}
          {(menuAbierto || menuFijado) && (
            <Menu
              grupos={grupos}
              itemActivo={itemActivo}
              onItemChange={handleItemChange}
              fijado={menuFijado}
            />
          )}

          {/* Overlay para cerrar menú no fijado al hacer clic fuera */}
          {menuAbierto && !menuFijado && (
            <div
              aria-hidden="true"
              onClick={() => setMenuAbierto(false)}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 7,
              }}
            />
          )}

          {/* Mesa — contenido de la app */}
          <main
            id="mesa-contenido"
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: 20,
              // Si el menú está fijado, desplazar el contenido
              marginLeft: menuFijado ? 296 : 0,
              transition: 'margin-left 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {children}
          </main>

          {/* Panel Núcleo AI */}
          {nucleoAbierto && (
            <div
              style={{
                padding: '12px 12px 12px 0',
                flexShrink: 0,
              }}
            >
              <NucleoPanel
                onCerrar={() => setNucleoAbierto(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
