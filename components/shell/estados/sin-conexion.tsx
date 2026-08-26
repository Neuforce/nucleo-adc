// Sin conexión — banda ámbar en la parte superior de la mesa.
// border 1px solid #F2E2C2, background #FDF6E9, border-radius 6px.
// Punto: 7×7px, background #B7791F.
// font 600 11.5px Geist color #8A5A12.
// Datos atenuados: opacity .75 en el contenido de la mesa.
// Acciones de escritura se deshabilitan.

export function SinConexion() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 14px',
        height: 36,
        border: '1px solid #F2E2C2',
        background: '#FDF6E9',
        borderRadius: 6,
        flexShrink: 0,
      }}
    >
      {/* Punto de estado */}
      <div
        aria-hidden="true"
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: 'var(--nuc-ambar)',
          flexShrink: 0,
        }}
      />

      <span
        style={{
          fontFamily: 'var(--font-geist-sans), sans-serif',
          fontSize: 11.5,
          fontWeight: 600,
          color: '#8A5A12',
          lineHeight: 1,
        }}
      >
        Sin conexión — los datos pueden estar desactualizados. Las acciones de escritura están deshabilitadas.
      </span>
    </div>
  )
}
