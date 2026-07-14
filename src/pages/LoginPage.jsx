import { useState } from 'react'

export default function LoginPage({ onLogin, loading, error }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)

  const usernameMissing = touched && !username.trim()
  const passwordMissing = touched && !password.trim()

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    onLogin(username, password)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              margin: '0 auto 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NewspaperIcon />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 5px',
              letterSpacing: -0.3,
            }}
          >
            Daily Intelligence Bot
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>Tu dashboard de noticias con IA</p>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border-soft)', borderRadius: 16, padding: '28px 28px 24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 22px' }}>
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }} noValidate>
            <div>
              <label style={labelStyle}>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej. emilys"
                style={{ ...inputStyle, borderColor: usernameMissing ? 'var(--red)' : 'var(--border-soft)' }}
                autoComplete="username"
              />
              {usernameMissing && <FieldError>Ingresa tu usuario.</FieldError>}
            </div>

            <div>
              <label style={labelStyle}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, borderColor: passwordMissing ? 'var(--red)' : 'var(--border-soft)' }}
                autoComplete="current-password"
              />
              {passwordMissing && <FieldError>Ingresa tu contraseña.</FieldError>}
            </div>

            {error && (
              <p
                style={{
                  color: 'var(--red)',
                  fontSize: 13,
                  margin: 0,
                  padding: '8px 12px',
                  background: 'var(--red-bg)',
                  borderRadius: 8,
                  border: '1px solid rgba(224,92,92,0.2)',
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: 11,
                background: loading ? 'var(--surface)' : 'var(--accent)',
                border: `1px solid ${loading ? 'var(--border-soft)' : 'transparent'}`,
                borderRadius: 9,
                color: loading ? 'var(--text-muted)' : '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'default' : 'pointer',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar →'}
            </button>
          </form>

          <p
            style={{
              marginTop: 18,
              fontSize: 11.5,
              color: 'var(--text-dim)',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Demo: usa un usuario válido de{' '}
            <a href="https://dummyjson.com/users" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-light)' }}>
              dummyjson.com/users
            </a>
            , por ejemplo <strong style={{ color: 'var(--text-muted)' }}>emilys</strong> /{' '}
            <strong style={{ color: 'var(--text-muted)' }}>emilyspass</strong>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-dim)', marginTop: 22 }}>© 2026 Daily Intelligence Bot · v2.1.0</p>
      </div>
    </div>
  )
}

function FieldError({ children }) {
  return <p style={{ color: 'var(--red)', fontSize: 11.5, margin: '5px 0 0' }}>{children}</p>
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-dim)',
  marginBottom: 5,
  letterSpacing: 0.6,
  textTransform: 'uppercase',
}

const inputStyle = {
  width: '100%',
  padding: '10px 13px',
  background: 'var(--surface)',
  border: '1px solid var(--border-soft)',
  borderRadius: 9,
  color: 'var(--text-primary)',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'var(--font-body)',
}

function NewspaperIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
    </svg>
  )
}
