import { useState } from 'react'

const fieldLabel = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-dim)',
  marginBottom: 5,
  letterSpacing: 0.6,
  textTransform: 'uppercase',
  display: 'block',
}

const fieldInput = {
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

export default function NewsFormModal({ initialValues, mode, loading = false, error = '', onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialValues.title || '')
  const [body, setBody] = useState(initialValues.body || '')
  const [tag, setTag] = useState(initialValues.tags?.[0] || '')
  const [formError, setFormError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !body.trim() || !tag.trim()) {
      setFormError('Completa título, contenido y categoría antes de guardar.')
      return
    }
    setFormError('')
    onSubmit({ title: title.trim(), body: body.trim(), tags: [tag.trim()], userId: initialValues.userId || 1 })
  }

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
          maxWidth: 460,
          background: 'var(--card)',
          border: '1px solid var(--border-soft)',
          borderRadius: 16,
          padding: 26,
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px' }}>
          {mode === 'edit' ? 'Editar noticia' : 'Agregar noticia'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={fieldLabel}>Título</label>
            <input style={fieldInput} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título de la noticia" />
          </div>

          <div>
            <label style={fieldLabel}>Contenido</label>
            <textarea
              style={{ ...fieldInput, resize: 'vertical', minHeight: 90 }}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Cuerpo / resumen de la noticia"
            />
          </div>

          <div>
            <label style={fieldLabel}>Categoría (tag)</label>
            <input style={fieldInput} value={tag} onChange={(e) => setTag(e.target.value)} placeholder="ej. tecnologia" />
          </div>

          {(formError || error) && (
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
              {formError || error}
            </p>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
            <button
              type="button"
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
              type="submit"
              disabled={loading}
              style={{
                padding: '9px 18px',
                background: 'var(--accent)',
                border: '1px solid transparent',
                borderRadius: 9,
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Guardando...' : mode === 'edit' ? 'Guardar cambios' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
