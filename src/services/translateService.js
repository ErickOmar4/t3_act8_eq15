// Servicio de traducción.
// DummyJSON (la API de noticias que usamos) devuelve todo en inglés y no
// tiene una versión en español, así que traducimos lo que se muestra en
// pantalla usando MyMemory (https://mymemory.translated.net), una API de
// traducción gratuita que no requiere API key.
//
// Guardamos un cache en memoria para no volver a traducir el mismo texto
// dos veces (por ejemplo al cambiar de página y regresar).

const TRANSLATE_URL = 'https://api.mymemory.translated.net/get'
const MAX_CHARS = 480 // límite razonable por petición para la versión gratuita

const cache = new Map()

async function translateText(text, targetLang = 'es') {
  const original = (text || '').trim()
  if (!original) return original

  const trimmed = original.length > MAX_CHARS ? `${original.slice(0, MAX_CHARS)}…` : original
  const cacheKey = `${targetLang}:${trimmed}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  try {
    const url = `${TRANSLATE_URL}?q=${encodeURIComponent(trimmed)}&langpair=en|${targetLang}`
    const response = await fetch(url)
    if (!response.ok) return original

    const data = await response.json()
    const translated = data?.responseData?.translatedText

    // Si la API se queda sin cuota o devuelve un error, regresa el texto original
    // en vez de mostrar un mensaje de error confuso al usuario.
    const isUsable = translated && !/query length limit exceeded|invalid/i.test(translated)
    const result = isUsable ? translated : original

    cache.set(cacheKey, result)
    return result
  } catch (err) {
    return original
  }
}

/** Traduce título, contenido (recortado) y la primera categoría/tag de una noticia. */
export async function translatePost(post) {
  const [title, body, firstTag] = await Promise.all([
    translateText(post.title),
    translateText((post.body || '').slice(0, 300)),
    translateText(post.tags?.[0] || ''),
  ])

  return {
    ...post,
    title,
    body,
    tags: firstTag ? [firstTag, ...(post.tags?.slice(1) || [])] : post.tags,
  }
}

/** Traduce una lista de noticias en paralelo. */
export async function translatePosts(posts) {
  return Promise.all(posts.map(translatePost))
}

/**
 * Traduce una lista de tags (categorías) para mostrarlas en español,
 * conservando el valor original en inglés (necesario para filtrar contra
 * la API, que solo entiende los slugs en inglés).
 */
export async function translateTagList(tags) {
  const labels = await Promise.all(tags.map((t) => translateText(t)))
  return tags.map((original, i) => ({ value: original, label: labels[i] || original }))
}
