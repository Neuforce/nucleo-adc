'use client'

// Rail — 56 px, navy sólido. Nunca desaparece. Nunca hace scroll.
// Orden: apps activas (por uso) → spacer → Settings → Avatar.
// Configuración siempre al final, nunca reorderable.
// Cápsula de app: 34×34 px, border-radius 7 px.
// Indicador de app activa: barra 3 px, border-radius 2 px.
// Badge de pendientes: min 15×15 px, Geist Mono 700 9.5 px.
// Lo que no cabe: disco +n (34×26 px, borde dashed).

import type { App } from './types'

const MAX_VISIBLE = 7

interface RailProps {
  apps: App[]
  appActiva: string
  onAppChange: (id: string) => void
  onAvatarClick: () => void
  isDark: boolean
}

export function Rail({ apps, appActiva, onAppChange, onAvatarClick, isDark }: RailProps) {
  const separador = 'rgba(255,255,255,.12)'

  const configApp = apps.find((a) => a.id === 'configuracion')
  const mainApps = apps.filter((a) => a.id !== 'configuracion')
  const visibles = mainApps.slice(0, MAX_VISIBLE)
  const overflow = mainApps.length > MAX_VISIBLE ? mainApps.length - MAX_VISIBLE : 0

  return (
    <nav
      aria-label="Aplicaciones"
      style={{
        width: 56,
        minWidth: 56,
        background: isDark ? '#0D1826' : '#00244D',
        borderRight: isDark ? '1px solid var(--nuc-border)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12,
        flexShrink: 0,
        height: '100%',
        position: 'relative',
        zIndex: 10,
        overflowY: 'visible',
      }}
    >
      {/* Apps principales */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 9,
          width: '100%',
        }}
      >
        {visibles.map((app) => (
          <Capsula
            key={app.id}
            app={app}
            activa={app.id === appActiva}
            isDark={isDark}
            onClick={() => onAppChange(app.id)}
          />
        ))}

        {/* Disco +n */}
        {overflow > 0 && (
          <button
            style={{
              width: 34,
              height: 26,
              borderRadius: 7,
              border: '1px dashed rgba(255,255,255,.34)',
              background: 'transparent',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 10.5,
              fontWeight: 700,
              color: '#B9CEE3',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={`${overflow} apps más`}
          >
            +{overflow}
          </button>
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Configuración — siempre al final */}
      {configApp && (
        <>
          <div
            style={{
              width: 28,
              height: 1,
              background: separador,
              marginBottom: 20,
            }}
          />
          <Capsula
            app={configApp}
            activa={configApp.id === appActiva}
            isDark={isDark}
            onClick={() => onAppChange(configApp.id)}
          />
        </>
      )}

      {/* Avatar */}
      <button
        onClick={onAvatarClick}
        aria-label="Menú de usuario"
        style={{
          marginTop: 9,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: isDark ? '#16253A' : '#7F9CC0',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {/* Iniciales placeholder */}
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 10,
            fontWeight: 600,
            color: isDark ? '#A8B6C6' : '#00244D',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          U
        </span>
      </button>
    </nav>
  )
}

// ─── Cápsula de app ──────────────────────────────────────────────────────────

interface CapsulaProps {
  app: App
  activa: boolean
  isDark: boolean
  onClick: () => void
}

function Capsula({ app, activa, isDark, onClick }: CapsulaProps) {
  const { Icono, badge, urgente, nombre } = app

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {/* Barra indicadora de activa — 3 px, border-radius 2 px */}
      {activa && (
        <div
          style={{
            position: 'absolute',
            left: -11,
            width: 3,
            height: 20,
            borderRadius: 2,
            background: isDark ? 'var(--nuc-acc)' : '#FFFFFF',
          }}
        />
      )}

      <button
        onClick={onClick}
        aria-label={nombre}
        aria-current={activa ? 'page' : undefined}
        title={nombre}
        style={{
          width: 34,
          height: 34,
          borderRadius: 7,
          border: activa
            ? '1px solid rgba(255,255,255,.20)'
            : '1px solid transparent',
          background: activa ? 'rgba(255,255,255,.16)' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Icono
          size={16}
          strokeWidth={2}
          color={activa ? '#FFFFFF' : (isDark ? '#55677F' : '#7F9CC0')}
        />

        {/* Badge de pendientes */}
        {badge !== undefined && badge > 0 && (
          <span
            aria-label={`${badge} pendientes`}
            style={{
              position: 'absolute',
              top: 1,
              right: 0,
              minWidth: 15,
              height: 15,
              borderRadius: 8,
              padding: '0 3px',
              background: urgente ? '#C2352B' : '#B7791F',
              border: `1.5px solid ${isDark ? '#0D1826' : '#00244D'}`,
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 9.5,
              fontWeight: 700,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              boxSizing: 'border-box',
            }}
          >
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </button>
    </div>
  )
}
