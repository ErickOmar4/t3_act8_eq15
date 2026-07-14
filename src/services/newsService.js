// Servicio de "Noticias".
// Usamos el endpoint /posts de DummyJSON (https://dummyjson.com/docs/posts)
// como fuente de datos "parecida a noticias": cada post tiene título, cuerpo,
// tags (los usamos como categoría) y estadísticas (vistas/reacciones).
// Igual que las demás colecciones "simuladas" de DummyJSON, las escrituras
// (POST/PUT/DELETE) responden como si se hubieran guardado, pero no persisten
// realmente en el servidor — por eso además de llamarlas, reflejamos el
// cambio en el estado local de la app.

const BASE_URL = 'https://dummyjson.com/posts'

async function parseOrThrow(response, fallbackMessage) {
  if (!response.ok) {
    throw new Error(fallbackMessage)
  }
  return response.json()
}

/**
 * Obtiene noticias paginadas.
 * Prioridad de filtros (la API de DummyJSON no permite combinarlos):
 *   1. Si hay texto de búsqueda -> /posts/search?q=
 *   2. Si hay categoría (tag)   -> /posts/tag/{tag}
 *   3. Si no hay filtros        -> /posts
 */
export async function fetchNews({ page = 1, limit = 10, search = '', category = '' }) {
  const skip = (page - 1) * limit
  let url

  if (search.trim()) {
    url = `${BASE_URL}/search?q=${encodeURIComponent(search.trim())}&limit=${limit}&skip=${skip}`
  } else if (category && category !== 'Todas') {
    url = `${BASE_URL}/tag/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
  } else {
    url = `${BASE_URL}?limit=${limit}&skip=${skip}`
  }

  let response
  try {
    response = await fetch(url)
  } catch (networkError) {
    throw new Error('No se pudo conectar con el servidor de noticias.')
  }

  const data = await parseOrThrow(response, 'No se pudieron cargar las noticias. Intenta de nuevo.')
  return {
    items: data.posts ?? [],
    total: data.total ?? 0,
    limit: data.limit ?? limit,
    skip: data.skip ?? skip,
  }
}

/** Lista de tags disponibles, usada para poblar el filtro de categoría. */
export async function fetchTags() {
  const response = await fetch(`${BASE_URL}/tag-list`)
  const data = await parseOrThrow(response, 'No se pudieron cargar las categorías.')
  return Array.isArray(data) ? data : []
}

/** Crea una noticia nueva (simulado por la API, no persiste). */
export async function createNews(payload) {
  const response = await fetch(`${BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseOrThrow(response, 'No se pudo agregar la noticia. Intenta de nuevo.')
}

/** Edita una noticia existente (simulado por la API, no persiste). */
export async function updateNews(id, payload) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseOrThrow(response, 'No se pudo editar la noticia. Intenta de nuevo.')
}

/** Elimina una noticia (simulado por la API, no persiste). */
export async function deleteNews(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  return parseOrThrow(response, 'No se pudo eliminar la noticia. Intenta de nuevo.')
}
