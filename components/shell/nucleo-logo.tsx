// Símbolo Núcleo — dos pesos, no intercambiables.
// Sólido: UI (16–44 px). Fino: marca/gran formato (≥ 48 px).
// Nunca rotar. Nunca deformar (proporción 1:1). No cian sobre fondos claros.
// No gradiente en tamaños UI. No mezclar pesos en la misma composición.

interface NucleoLogoProps {
  size?: number
  className?: string
  style?: React.CSSProperties
  // 'solido' para UI (≥ 16 px), 'fino' para marca (≥ 48 px)
  variant?: 'solido' | 'fino'
}

export function NucleoLogo({
  size = 24,
  className,
  style,
  variant = 'solido',
}: NucleoLogoProps) {
  // Spec: sólido sw=3.4 nodo r=6.5 núcleo r=12 | fino sw=2.3 nodo r=5 núcleo r=10
  const sw = variant === 'solido' ? 3.4 : 2.3
  const nr = variant === 'solido' ? 6.5 : 5
  const cr = variant === 'solido' ? 12 : 10

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Trazos — hexágono + radios al centro */}
      <g
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
        opacity={0.65}
      >
        {/* Radios al centro */}
        <line x1="50" y1="50" x2="50" y2="19" />
        <line x1="50" y1="50" x2="76.85" y2="34.5" />
        <line x1="50" y1="50" x2="76.85" y2="65.5" />
        <line x1="50" y1="50" x2="50" y2="81" />
        <line x1="50" y1="50" x2="23.15" y2="65.5" />
        <line x1="50" y1="50" x2="23.15" y2="34.5" />
        {/* Perímetro hexagonal */}
        <line x1="50" y1="19" x2="76.85" y2="34.5" />
        <line x1="76.85" y1="34.5" x2="76.85" y2="65.5" />
        <line x1="76.85" y1="65.5" x2="50" y2="81" />
        <line x1="50" y1="81" x2="23.15" y2="65.5" />
        <line x1="23.15" y1="65.5" x2="23.15" y2="34.5" />
        <line x1="23.15" y1="34.5" x2="50" y2="19" />
      </g>
      {/* Nodos exteriores */}
      <g fill="currentColor">
        <circle cx="50" cy="19" r={nr} />
        <circle cx="76.85" cy="34.5" r={nr} />
        <circle cx="76.85" cy="65.5" r={nr} />
        <circle cx="50" cy="81" r={nr} />
        <circle cx="23.15" cy="65.5" r={nr} />
        <circle cx="23.15" cy="34.5" r={nr} />
      </g>
      {/* Núcleo central */}
      <circle cx="50" cy="50" r={cr} fill="currentColor" />
    </svg>
  )
}
