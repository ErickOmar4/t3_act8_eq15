import { useEffect, useRef, useState } from 'react'
import { fetchNews, fetchTags, createNews, updateNews, deleteNews } from '../services/newsService'
import { translatePosts, translateTagList } from '../services/translateService'
import { useUrlParams } from '../hooks/useUrlParams'
import Pagination from '../components/Pagination'
import ConfirmModal from '../components/ConfirmModal'
import NewsFormModal from '../components/NewsFormModal'

const DEFAULT_PARAMS = { page: 1, limit: 10, search: '', category: 'Todas' }

export default function NoticiasPage() {
  const [params, setParams] = useUrlParams(DEFAULT_PARAMS)
  const { page, limit, category } = params

  const [searchInput, setSearchInput] = useState(params.search)
  const debounceRef = useRef(null)

  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [tags, setTags] = useState([])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [confirmEditPayload, setConfirmEditPayload] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  // Cargar categorías (tags) una sola vez para el filtro.
  // Se guarda { value, label }: value es el slug en inglés que entiende la
  // API de DummyJSON para filtrar, label es la traducción para mostrar.
  useEffect(() => {
    fetchTags()
      .then((list) => translateTagList(list.slice(0, 25)))
      .then((translated) => setTags(translated))
      .catch(() => setTags([]))
  }, [])

  // Cargar noticias cada vez que cambian los parámetros de la URL, y
  // traducirlas al español antes de mostrarlas (DummyJSON solo da inglés).
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    fetchNews(params)
      .then(async ({ items: fetchedItems, total: fetchedTotal }) => {
        const translated = await translatePosts(fetchedItems)
        if (cancelled) return
        setItems(translated)
        setTotal(fetchedTotal)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setItems([])
        setTotal(0)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [params.page, params.limit, params.search, params.category])

  // Debounce del buscador de texto
  function handleSearchChange(value) {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setParams({ search: value, page: 1 })
    }, 450)
  }

  function handleCategoryChange(value) {
    setParams({ category: value, page: 1 })
  }

  function handlePageChange(newPage) {
    if (newPage < 1) return
    setParams({ page: newPage })
  }

  function handleLimitChange(newLimit) {
    setParams({ limit: newLimit, page: 1 })
  }

  // ---- CRUD ----
  async function handleCreate(payload) {
    setActionLoading(true)
    setActionError('')
    try {
      const created = await createNews(payload)
      // La API no persiste, así que la reflejamos al inicio del listado local
      setItems((prev) => [created, ...prev])
      setTotal((prev) => prev + 1)
      setShowAddModal(false)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  function requestEdit(item, payload) {
    setConfirmEditPayload({ item, payload })
  }

  async function confirmEdit() {
    if (!confirmEditPayload) return
    const { item, payload } = confirmEditPayload
    setActionLoading(true)
    setActionError('')
    try {
      const updated = await updateNews(item.id, payload)
      setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, ...updated } : n)))
      setEditTarget(null)
      setConfirmEditPayload(null)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setActionLoading(true)
    setActionError('')
    try {
      await deleteNews(deleteTarget.id)
      setItems((prev) => prev.filter((n) => n.id !== deleteTarget.id))
      setTotal((prev) => Math.max(0, prev - 1))
      setDeleteTarget(null)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Tabla de noticias
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '4px 0 0' }}>{total} registros totales</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={primaryBtn}>
          + Agregar noticia
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Buscar por título o contenido..."
          style={{ ...filterInput, flex: '1 1 240px' }}
        />
        <select value={category} onChange={(e) => handleCategoryChange(e.target.value)} style={{ ...filterInput, flex: '0 0 200px' }}>
          <option value="Todas">Todas las categorías</option>
          {tags.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {actionError && <p style={errorBanner}>{actionError}</p>}

      {/* Estado de carga / error / tabla */}
      {loading && <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: '20px 0' }}>Cargando noticias...</p>}

      {!loading && error && <p style={errorBanner}>{error}</p>}

      {!loading && !error && (
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-soft)', borderRadius: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--surface)' }}>
                <Th>#</Th>
                <Th>Título</Th>
                <Th>Categoría</Th>
                <Th>Usuario</Th>
                <Th>Vistas</Th>
                <Th>Reacciones</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'var(--text-dim)' }}>
                    No se encontraron noticias con estos filtros.
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} style={{ borderTop: '1px solid var(--border-soft)' }}>
                  <Td>{item.id}</Td>
                  <Td style={{ maxWidth: 320 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.body}
                    </div>
                  </Td>
                  <Td>{item.tags?.[0] || '—'}</Td>
                  <Td>{item.userId}</Td>
                  <Td>{item.views ?? '—'}</Td>
                  <Td>
                    {typeof item.reactions === 'object'
                      ? `👍 ${item.reactions?.likes ?? 0} · 👎 ${item.reactions?.dislikes ?? 0}`
                      : item.reactions ?? '—'}
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setEditTarget(item)} style={iconBtn}>
                        Editar
                      </button>
                      <button onClick={() => setDeleteTarget(item)} style={{ ...iconBtn, color: 'var(--red)' }}>
                        Eliminar
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && <Pagination page={page} limit={limit} total={total} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />}

      {/* Modal: agregar */}
      {showAddModal && (
        <NewsFormModal
          mode="add"
          initialValues={{}}
          loading={actionLoading}
          error={actionError}
          onCancel={() => {
            setShowAddModal(false)
            setActionError('')
          }}
          onSubmit={handleCreate}
        />
      )}

      {/* Modal: formulario de edición -> pide confirmación antes de guardar */}
      {editTarget && !confirmEditPayload && (
        <NewsFormModal
          mode="edit"
          initialValues={editTarget}
          loading={actionLoading}
          error={actionError}
          onCancel={() => {
            setEditTarget(null)
            setActionError('')
          }}
          onSubmit={(payload) => requestEdit(editTarget, payload)}
        />
      )}

      {/* Confirmación de edición */}
      {confirmEditPayload && (
        <ConfirmModal
          title="Confirmar edición"
          message={`¿Guardar los cambios en la noticia "${confirmEditPayload.item.title}"?`}
          confirmLabel="Guardar cambios"
          loading={actionLoading}
          onCancel={() => setConfirmEditPayload(null)}
          onConfirm={confirmEdit}
        />
      )}

      {/* Confirmación de eliminación */}
      {deleteTarget && (
        <ConfirmModal
          title="Eliminar noticia"
          message={`¿Seguro que quieres eliminar "${deleteTarget.title}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          danger
          loading={actionLoading}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  )
}

function Th({ children }) {
  return (
    <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
      {children}
    </th>
  )
}

function Td({ children, style }) {
  return (
    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', verticalAlign: 'top', ...style }}>{children}</td>
  )
}

const primaryBtn = {
  padding: '9px 16px',
  background: 'var(--accent)',
  border: '1px solid transparent',
  borderRadius: 9,
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const filterInput = {
  padding: '9px 13px',
  background: 'var(--surface)',
  border: '1px solid var(--border-soft)',
  borderRadius: 9,
  color: 'var(--text-primary)',
  fontSize: 13,
  outline: 'none',
}

const iconBtn = {
  padding: '5px 10px',
  background: 'var(--surface)',
  border: '1px solid var(--border-soft)',
  borderRadius: 7,
  color: 'var(--text-primary)',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
}

const errorBanner = {
  color: 'var(--red)',
  fontSize: 13,
  margin: '0 0 16px',
  padding: '10px 14px',
  background: 'var(--red-bg)',
  borderRadius: 8,
  border: '1px solid rgba(224,92,92,0.2)',
}
