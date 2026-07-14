import { useEffect, useState } from 'react'
import { fetchNews } from '../services/newsService'
import { translatePosts } from '../services/translateService'

const SAMPLE_SIZE = 30
const HIGHLIGHT_COUNT = 6

export default function ResumenDiarioPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ total: 0, categorias: 0, oportunidades: 0, alertas: 0 })
  const [destacadas, setDestacadas] = useState([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    fetchNews({ page: 1, limit: SAMPLE_SIZE, search: '', category: 'Todas' })
      .then(async ({ items, total }) => {
        if (cancelled) return

        const categorias = new Set(items.flatMap((n) => n.tags || [])).size
        const oportunidades = items.filter((n) => (n.reactions?.likes || 0) > (n.reactions?.dislikes || 0) * 2).length
        const alertas = items.filter((n) => (n.reactions?.dislikes || 0) > (n.reactions?.likes || 0)).length

        const top = [...items]
          .sort((a, b) => (b.reactions?.likes || 0) - (a.reactions?.likes || 0))
          .slice(0, HIGHLIGHT_COUNT)
        const translatedTop = await translatePosts(top)

        if (cancelled) return
        setStats({ total, categorias, oportunidades, alertas })
        setDestacadas(translatedTop)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const statCards = [
    { label: 'Noticias', value: stats.total, sub: 'Artículos disponibles', color: '#8b5cf6' },
    { label: 'Categorías', value: stats.categorias, sub: 'Temas cubiertos (muestra)', color: '#3b82f6' },
    { label: 'Oportunidades', value: stats.oportunidades, sub: 'Alta reacción positiva', color: '#10b981' },
    { label: 'Alertas', value: stats.alertas, sub: 'Reacción mayormente negativa', color: '#e05c5c' },
  ]

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border-soft)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: s.color }}>{loading ? '—' : s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>
        Noticias destacadas
      </h2>

      {loading && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Cargando noticias...</p>}
      {!loading && error && (
        <p
          style={{
            color: 'var(--red)',
            fontSize: 13,
            padding: '10px 14px',
            background: 'var(--red-bg)',
            borderRadius: 8,
            border: '1px solid rgba(224,92,92,0.2)',
          }}
        >
          {error}
        </p>
      )}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {destacadas.map((n) => {
            const likes = n.reactions?.likes || 0
            const dislikes = n.reactions?.dislikes || 0
            const sentimiento = likes > dislikes * 2 ? '↑ Positivo' : dislikes > likes ? '↓ Negativo' : '→ Neutro'
            const sentimientoColor = sentimiento.includes('Positivo') ? 'var(--green)' : sentimiento.includes('Negativo') ? 'var(--red)' : 'var(--text-muted)'

            return (
              <div key={n.id} style={{ background: 'var(--card)', border: '1px solid var(--border-soft)', borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                  <Badge color="var(--accent)">{n.tags?.[0] || 'General'}</Badge>
                  <Badge color="var(--text-muted)">ES</Badge>
                  <Badge color={sentimientoColor}>{sentimiento}</Badge>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px', lineHeight: 1.35 }}>{n.title}</h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.5 }}>{n.body}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-dim)' }}>
                  <span>👁 {n.views ?? 0} vistas</span>
                  <span>
                    👍 {likes} · 👎 {dislikes}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Badge({ children, color }) {
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        color,
        background: 'rgba(255,255,255,0.06)',
        padding: '3px 8px',
        borderRadius: 999,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
      }}
    >
      {children}
    </span>
  )
}
