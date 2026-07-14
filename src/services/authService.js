
const AUTH_URL = 'https://dummyjson.com/auth/login'

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} 
 * @throws {Error} 
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
