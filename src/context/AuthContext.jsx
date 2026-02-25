import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check session on mount
  useEffect(() => {
    fetch('/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.login) setUser(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Redirect to GitHub OAuth
  const login = () => {
    window.location.href = '/auth/github'
  }

  // Clear session and redirect home
  const logout = () => {
    fetch('/auth/logout', { method: 'POST', credentials: 'include' }).finally(() => {
      setUser(null)
      window.location.href = '/'
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
