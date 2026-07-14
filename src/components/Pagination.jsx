const PAGE_SIZE_OPTIONS = [10, 20, 40, 50]

export default function Pagination({ page, limit, total, onPageChange, onLimitChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        padding: '14px 4px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
        <span>Registros por página</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-soft)',
            borderRadius: 8,
            color: 'var(--text-primary)',
            fontSize: 13,
            padding: '6px 10px',
          }}
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          style={navBtnStyle(page <= 1)}
        >
          ← Anterior
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Página <strong style={{ color: 'var(--text-primary)' }}>{page}</strong> de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          style={navBtnStyle(page >= totalPages)}
        >
          Siguiente →
        </button>
      </div>
    </div>
  )
}

function navBtnStyle(disabled) {
  return {
    padding: '7px 14px',
    background: 'var(--surface)',
    border: '1px solid var(--border-soft)',
    borderRadius: 8,
    color: disabled ? 'var(--text-dim)' : 'var(--text-primary)',
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }
}
