// Esqueleto del Hub (T1) — sin spinner, sin pulso.
// Muestra la forma real de la pantalla: cinta de indicadores + feed de atención.
// Ref: design.md §10, §17

interface CargandoHubProps {
  tarjetas?: number
}

function Rect({
  w,
  h,
  r = 4,
}: {
  w: number | string
  h: number
  r?: number
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background: 'var(--nuc-surface-hover)',
        flexShrink: 0,
      }}
    />
  )
}

function TarjetaCintaEsq() {
  return (
    <div
      style={{
        width: 214,
        height: 132,
        borderRadius: 6,
        border: `1px solid var(--nuc-border)`,
        background: 'var(--nuc-surface)',
        padding: '11px 15px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Rect w={48} h={10} r={3} />
        <Rect w={60} h={10} r={3} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Rect w="100%" h={12} r={3} />
        <Rect w="65%" h={12} r={3} />
      </div>
      <Rect w={72} h={20} r={3} />
      <Rect w="100%" h={4} r={2} />
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <Rect w={32} h={10} r={3} />
        <Rect w={32} h={10} r={3} />
      </div>
    </div>
  )
}

function FilaAtencionEsq() {
  return (
    <div
      style={{
        height: 44,
        display: 'grid',
        gridTemplateColumns: '12px 1fr 128px 96px',
        gap: 12,
        alignItems: 'center',
        borderBottom: `1px solid var(--nuc-surface-hover)`,
      }}
    >
      <Rect w={8} h={8} r={50} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Rect w="80%" h={11} r={3} />
        <Rect w="55%" h={9} r={3} />
      </div>
      <Rect w={88} h={10} r={3} />
      <Rect w={72} h={10} r={3} />
    </div>
  )
}

export function CargandoHub({ tarjetas = 4 }: CargandoHubProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Título de sección */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Rect w={200} h={14} r={4} />
        <Rect w={320} h={11} r={3} />
      </div>

      {/* Cinta de indicadores — scroll horizontal */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'hidden',
        }}
      >
        {Array.from({ length: tarjetas }).map((_, i) => (
          <TarjetaCintaEsq key={i} />
        ))}
      </div>

      {/* Panel de atención */}
      <div
        style={{
          border: `1px solid var(--nuc-border)`,
          borderRadius: 6,
          background: 'var(--nuc-surface)',
          overflow: 'hidden',
        }}
      >
        {/* Encabezado del panel */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: `1px solid var(--nuc-surface-hover)`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Rect w={120} h={11} r={3} />
          <div style={{ marginLeft: 'auto' }}>
            <Rect w={64} h={11} r={3} />
          </div>
        </div>

        {/* Filas de atención */}
        <div style={{ padding: '0 16px' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <FilaAtencionEsq key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
