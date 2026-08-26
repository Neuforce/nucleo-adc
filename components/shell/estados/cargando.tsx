// Cargando — esqueleto con la forma real de la pantalla, no spinner genérico.
// Bloques: background #EEF0F3 o #F4F5F7, border-radius 3–5px.
// Sin animación de pulso (cansa a las 8 horas de trabajo).

export function Cargando() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando"
      style={{
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
      }}
    >
      {/* Título de sección */}
      <div
        style={{
          width: 180,
          height: 20,
          borderRadius: 4,
          background: 'var(--nuc-border-sub)',
        }}
      />

      {/* Fila de tarjetas de indicador */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(196px, 1fr))',
          gap: 12,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 132,
              borderRadius: 6,
              background: 'var(--nuc-mesa)',
              display: 'flex',
              flexDirection: 'column',
              padding: '11px 15px',
              gap: 8,
            }}
          >
            {/* Cintillo */}
            <div
              style={{
                width: '60%',
                height: 10,
                borderRadius: 3,
                background: 'var(--nuc-border-sub)',
              }}
            />
            {/* Nombre */}
            <div
              style={{
                width: '80%',
                height: 14,
                borderRadius: 3,
                background: 'var(--nuc-border-sub)',
              }}
            />
            <div
              style={{
                width: '55%',
                height: 14,
                borderRadius: 3,
                background: 'var(--nuc-border-sub)',
              }}
            />
            {/* Spacer */}
            <div style={{ flex: 1 }} />
            {/* Valor */}
            <div
              style={{
                width: '45%',
                height: 22,
                borderRadius: 4,
                background: 'var(--nuc-border-sub)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Segunda fila — grupo */}
      <div
        style={{
          width: 140,
          height: 16,
          borderRadius: 3,
          background: 'var(--nuc-border-sub)',
          marginTop: 8,
        }}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(196px, 1fr))',
          gap: 12,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 132,
              borderRadius: 6,
              background: 'var(--nuc-mesa)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
