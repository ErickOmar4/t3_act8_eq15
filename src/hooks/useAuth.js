import { useState } from 'react'
import { loginRequest } from '../services/authService'

/**
 * Encapsula el estado de sesión (useState) y la lógica de login/logout.
 * No persiste nada en localStorage a propósito: la actividad pide simular
 * la entrada al sistema guardando los datos del usuario en el estado de la app.
 */
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login(username, password) {
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Completa usuario y contraseña antes de continuar.')
      return false
    }

    setLoading(true)
    try {
      const userData = await loginRequest(username.trim(), password)
      setUser(userData)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
    setError('')
  }

  return { user, loading, error, login, logout }
}
