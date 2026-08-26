// Esqueleto del tablero de indicadores.
// Bloques con forma real de la pantalla — sin spinner, sin pulso.
// Ref: design.md §10 "Cargando"

interface CargandoTableroProps {
  tarjetas?: number   // cuántas tarjetas mostrar en el esqueleto
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

function TarjetaEsqueleto() {
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
      {/* Cintillo */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Rect w={48} h={10} r={3} />
        <Rect w={72} h={10} r={3} />
      </div>
      {/* Nombre */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Rect w="100%" h={12} r={3} />
        <Rect w="70%" h={12} r={3} />
      </div>
      {/* Cifra */}
      <Rect w={80} h={20} r={3} />
      {/* Barra */}
      <Rect w="100%" h={4} r={2} />
      {/* Footer comparativos */}
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <Rect w={36} h={10} r={3} />
        <Rect w={36} h={10} r={3} />
      </div>
    </div>
  )
}

export function CargandoTablero({
  tarjetas = 6,
}: CargandoTableroProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Barra de filtros */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Rect w={120} h={30} r={6} />
        <Rect w={88} h={24} r={12} />
        <Rect w={88} h={24} r={12} />
        <Rect w={88} h={24} r={12} />
        <div style={{ marginLeft: 'auto' }}>
          <Rect w={88} h={24} r={12} />
        </div>
      </div>

      {/* Rótulo de grupo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Rect w={160} h={11} r={3} />

        {/* Grid de tarjetas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(196px, 1fr))',
            gap: 12,
          }}
        >
          {Array.from({ length: tarjetas }).map((_, i) => (
            <TarjetaEsqueleto key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
