// Portada pública — nucleoadc.ai sin sesión.
// Fondo: #050D16. Sin scroll. CTA "Entrar" → /entrar.
// Ref: design.md §16

import Link from 'next/link'

export default function Portada() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#050D16',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        gap: 28,
        overflow: 'hidden',
      }}
    >
      {/* Símbolo grande — fino con gradiente en formato grande */}
      <svg
        viewBox="0 0 100 100"
        width={64}
        height={64}
        aria-hidden="true"
        fill="none"
      >
        <defs>
          <linearGradient
            id="grad-portada"
            x1="20" y1="16" x2="80" y2="84"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#3ED0EA" />
            <stop offset="62%" stopColor="#2F6BFF" />
            <stop offset="100%" stopColor="#2A57C4" />
          </linearGradient>
        </defs>
        {/* Peso fino: sw=2.3, nodo r=5, núcleo r=10 */}
        <circle cx="50" cy="50" r="10" stroke="url(#grad-portada)" strokeWidth="2.3" />
        <line x1="50" y1="40" x2="50" y2="14" stroke="url(#grad-portada)" strokeWidth="2.3" strokeLinecap="round" />
        <line x1="50" y1="60" x2="50" y2="86" stroke="url(#grad-portada)" strokeWidth="2.3" strokeLinecap="round" />
        <line x1="40" y1="45" x2="17.5" y2="32" stroke="url(#grad-portada)" strokeWidth="2.3" strokeLinecap="round" />
        <line x1="60" y1="55" x2="82.5" y2="68" stroke="url(#grad-portada)" strokeWidth="2.3" strokeLinecap="round" />
        <line x1="40" y1="55" x2="17.5" y2="68" stroke="url(#grad-portada)" strokeWidth="2.3" strokeLinecap="round" />
        <line x1="60" y1="45" x2="82.5" y2="32" stroke="url(#grad-portada)" strokeWidth="2.3" strokeLinecap="round" />
        <circle cx="50" cy="14" r="5" stroke="url(#grad-portada)" strokeWidth="2.3" />
        <circle cx="50" cy="86" r="5" stroke="url(#grad-portada)" strokeWidth="2.3" />
        <circle cx="17.5" cy="32" r="5" stroke="url(#grad-portada)" strokeWidth="2.3" />
        <circle cx="82.5" cy="68" r="5" stroke="url(#grad-portada)" strokeWidth="2.3" />
        <circle cx="17.5" cy="68" r="5" stroke="url(#grad-portada)" strokeWidth="2.3" />
        <circle cx="82.5" cy="32" r="5" stroke="url(#grad-portada)" strokeWidth="2.3" />
      </svg>

      {/* Headline */}
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 520,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 40,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-.03em',
            color: '#FFFFFF',
            margin: 0,
          }}
        >
          Gestión e indicadores para ADC Traxión
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 16,
            fontWeight: 300,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,.62)',
            margin: 0,
          }}
        >
          Un solo sistema. Datos al corte del día. Lo que necesitas para actuar hoy.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/entrar"
        style={{
          height: 36,
          padding: '0 20px',
          borderRadius: 18,
          background: '#FFFFFF',
          fontFamily: 'var(--font-geist-sans), sans-serif',
          fontSize: 14,
          fontWeight: 600,
          color: '#00244D',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        Entrar
      </Link>

      {/* Tres puntos de qué es */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          marginTop: 8,
        }}
      >
        {[
          'Indicadores al corte del día',
          'Asistente AI incluido',
          'Sin Excel, sin correos',
        ].map((punto) => (
          <span
            key={punto}
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 12.5,
              fontWeight: 400,
              color: 'rgba(255,255,255,.4)',
            }}
          >
            {punto}
          </span>
        ))}
      </div>
    </main>
  )
}
