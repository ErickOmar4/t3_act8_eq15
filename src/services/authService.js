// Servicio de autenticación.
// Toda la comunicación con la API de login vive aquí, separada de los
// componentes de UI (buenas prácticas: no hacer fetch dentro de los componentes).

const AUTH_URL = 'https://dummyjson.com/auth/login'

/**
 * Inicia sesión contra DummyJSON.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} datos del usuario autenticado (incluye "image")
 * @throws {Error} con un mensaje legible si las credenciales son incorrectas
 *                 o si ocurre un problema de red.
 */
export async function loginRequest(username, password) {
  let response
  try {
    response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
    })
  } catch (networkError) {
    throw new Error('No se pudo conectar con el servidor. Revisa tu conexión a internet.')
  }

  if (!response.ok) {
    if (response.status === 400 || response.status === 401) {
      throw new Error('Usuario o contraseña incorrectos')
    }
    throw new Error('Ocurrió un error al iniciar sesión. Intenta de nuevo más tarde.')
  }

  return response.json()
}
