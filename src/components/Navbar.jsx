export default function Navbar({ user, title, subtitle, collapsed, onToggleSidebar, onLogout }) {
  const sideW = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 'var(--navbar-h)',
        background: 'rgba(13,17,23,0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        paddingRight: 24,
      }}
    >
      <div
        style={{
          width: sideW,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12,
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={onToggleSidebar}
          aria-label="Colapsar menú"
          style={{
            width: 34,
            height: 34,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--surface)',
            border: '1px solid var(--border-soft)',
            borderRadius: 9,
            cursor: 'pointer',
            color: 'var(--text-muted)',
          }}
        >
          <MenuBoxIcon />
        </button>

        {!collapsed && (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              letterSpacing: -0.2,
            }}
          >
            Daily<span style={{ color: 'var(--accent-light)' }}>Intel</span>
          </span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            margin: '2px 0 0',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '5px 12px 5px 5px',
            background: 'var(--surface)',
            border: '1px solid var(--border-soft)',
            borderRadius: 999,
          }}
        >
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', display: 'block', flexShrink: 0 }}
          />
          <div style={{ lineHeight: 1.25 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {user.firstName} {user.lastName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>@{user.username}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            padding: '7px 14px',
            background: 'var(--red-bg)',
            border: '1px solid rgba(224,92,92,0.2)',
            borderRadius: 8,
            color: 'var(--red)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Salir
        </button>
      </div>
    </header>
  )
}

function MenuBoxIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7" y1="9" x2="17" y2="9" />
      <line x1="7" y1="13" x2="17" y2="13" />
      <line x1="7" y1="17" x2="17" y2="17" />
    </svg>
  )
}
