const PREFERENCIAS = [
  { label: 'Idioma preferido', value: 'Español' },
  { label: 'Categorías de interés', value: 'Tecnología, Economía, Ciencia' },
  { label: 'Frecuencia de actualizaciones', value: 'Cada hora' },
  { label: 'Notificaciones de alertas', value: 'Activadas' },
]

export default function ConfiguracionPage() {
  return (
    <div style={{ padding: '36px 32px', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border-soft)', borderRadius: 16, padding: '28px 28px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 22px' }}>
          Preferencias
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PREFERENCIAS.map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '13px 15px',
                background: 'var(--surface)',
                borderRadius: 10,
                border: '1px solid var(--border-soft)',
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 20, textAlign: 'center' }}>
          Sección simulada — sin conexión a una API real.
        </p>
      </div>
    </div>
  )
}
