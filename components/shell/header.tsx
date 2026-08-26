'use client'

// Encabezado — 52 px fijo, nunca hace scroll.
// Fondo #FFFFFF (claro) / #101C2B (dark). Borde inferior 1px #E4E6EA / #1D2836.
// Padding horizontal: 20px.
// Izquierda: ☰ toggle menú · nombre app · separador · ruta.
// Derecha: ⌘K · selector de periodo · botón Núcleo AI · avatar.

import { Search, ChevronDown, Menu } from 'lucide-react'
import { NucleoLogo } from './nucleo-logo'

interface HeaderProps {
  nombreApp: string
  periodo: string
  onMenuToggle: () => void
  onPeriodoClick: () => void
  onBusquedaClick: () => void
  onNucleoClick: () => void
  onAvatarClick: () => void
  menuAbierto: boolean
  nucleoAbierto: boolean
}

export function Header({
  nombreApp,
  periodo,
  onMenuToggle,
  onPeriodoClick,
  onBusquedaClick,
  onNucleoClick,
  onAvatarClick,
  menuAbierto,
  nucleoAbierto,
}: HeaderProps) {
  return (
    <header
      style={{
        height: 52,
        minHeight: 52,
        background: 'var(--nuc-surface)',
        borderBottom: '1px solid var(--nuc-border)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        gap: 12,
        flexShrink: 0,
        position: 'relative',
        zIndex: 9,
      }}
    >
      {/* ☰ Toggle menú de pantallas */}
      <button
        onClick={onMenuToggle}
        aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuAbierto}
        style={{
          width: 28,
          height: 28,
          borderRadius: 5,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'var(--nuc-ink-2)',
          padding: 0,
        }}
      >
        <Menu size={15} strokeWidth={1.75} />
      </button>

      {/* Nombre de la app */}
      <span
        style={{
          fontFamily: 'var(--font-geist-sans), sans-serif',
          fontSize: 12.5,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '.04em',
          color: 'var(--nuc-ink)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          textTransform: 'uppercase',
        }}
      >
        {nombreApp}
      </span>

      {/* Separador vertical */}
      <div
        aria-hidden="true"
        style={{ width: 1, height: 16, background: 'var(--nuc-border-input)', flexShrink: 0 }}
      />

      {/* Ruta / contexto navegable */}
      <span
        style={{
          fontFamily: 'var(--font-geist-sans), sans-serif',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--nuc-ink-2)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0,
        }}
      >
        {/* placeholder — se pasará como prop cuando exista navegación real */}
      </span>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Búsqueda ⌘K */}
      <button
        onClick={onBusquedaClick}
        aria-label="Búsqueda global (⌘K)"
        style={{
          height: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 10px',
          borderRadius: 5,
          border: '1px solid var(--nuc-border)',
          background: 'var(--nuc-surface)',
          cursor: 'pointer',
          width: 190,
          flexShrink: 0,
        }}
      >
        <Search size={13} strokeWidth={1.5} color='var(--nuc-ink-2)' />
        <span
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 12,
            fontWeight: 400,
            color: 'var(--nuc-ink-2)',
            flex: 1,
            textAlign: 'left',
          }}
        >
          Buscar en todo el núcleo
        </span>
        <kbd
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--nuc-ink-2)',
            border: '1px solid var(--nuc-border)',
            borderRadius: 3,
            padding: '1px 4px',
            lineHeight: 1.4,
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Selector de periodo */}
      <button
        onClick={onPeriodoClick}
        style={{
          height: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '0 10px',
          borderRadius: 6,
          border: '1px solid var(--nuc-border-input)',
          background: 'transparent',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--nuc-ink)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontVariantNumeric: 'tabular-nums',
          flexShrink: 0,
        }}
        aria-label="Cambiar periodo"
      >
        {periodo}
        <ChevronDown size={13} strokeWidth={2} />
      </button>

      {/* Botón Núcleo AI ⌘J */}
      <button
        onClick={onNucleoClick}
        aria-label="Núcleo AI (⌘J)"
        aria-pressed={nucleoAbierto}
        style={{
          height: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 11px',
          borderRadius: 5,
          border: nucleoAbierto
            ? '1px solid #CDD9FB'
            : '1px solid var(--nuc-border)',
          background: nucleoAbierto ? '#EEF3FF' : 'transparent',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <NucleoLogo
          size={15}
          variant="solido"
          style={{ color: nucleoAbierto ? 'var(--nuc-acc)' : 'var(--nuc-ink-2)' }}
        />
        <span
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 12,
            fontWeight: 500,
            color: nucleoAbierto ? 'var(--nuc-acc)' : 'var(--nuc-ink-2)',
            whiteSpace: 'nowrap',
          }}
        >
          Núcleo
        </span>
        <kbd
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 11,
            fontWeight: 500,
            color: nucleoAbierto ? 'var(--nuc-acc)' : 'var(--nuc-ink-2)',
            border: `1px solid ${nucleoAbierto ? '#CDD9FB' : 'var(--nuc-border)'}`,
            borderRadius: 3,
            padding: '1px 4px',
            lineHeight: 1.4,
          }}
        >
          ⌘J
        </kbd>
      </button>

      {/* Avatar */}
      <button
        onClick={onAvatarClick}
        aria-label="Menú de usuario"
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: '#00244D',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 10,
            fontWeight: 600,
            color: '#FFFFFF',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          U
        </span>
      </button>
    </header>
  )
}
