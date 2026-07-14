export default function ConfirmModal({ title, message, confirmLabel = 'Confirmar', danger = false, loading = false, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 20,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'var(--card)',
          border: '1px solid var(--border-soft)',
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
          {title}
        </h3>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: '0 0 22px', lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '9px 16px',
              background: 'var(--surface)',
              border: '1px solid var(--border-soft)',
              borderRadius: 9,
              color: 'var(--text-muted)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '9px 16px',
              background: danger ? 'var(--red-bg)' : 'var(--accent)',
              border: danger ? '1px solid rgba(224,92,92,0.3)' : '1px solid transparent',
              borderRadius: 9,
              color: danger ? 'var(--red)' : '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
