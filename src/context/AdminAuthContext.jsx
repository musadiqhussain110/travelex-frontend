import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { adminApi } from "../services/api"

const AdminAuthContext = createContext(null)

const TOKEN_KEY = "travelex_admin_token"
const ADMIN_KEY = "travelex_admin_user"

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem(ADMIN_KEY)
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  const isAuthenticated = Boolean(token && admin)

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const data = await adminApi.me()
        const adminUser = data.admin || data.user || data.data?.admin

        if (adminUser) {
          setAdmin(adminUser)
          localStorage.setItem(ADMIN_KEY, JSON.stringify(adminUser))
        }
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(ADMIN_KEY)
        setToken(null)
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    }

    verifyAdmin()
  }, [token])

  const login = async ({ email, password }) => {
    const data = await adminApi.login({ email, password })

    const receivedToken =
      data.token || data.accessToken || data.data?.token || data.data?.accessToken

    const adminUser =
      data.admin || data.user || data.data?.admin || data.data?.user

    if (!receivedToken) {
      throw new Error("Login token not received from backend.")
    }

    localStorage.setItem(TOKEN_KEY, receivedToken)
    setToken(receivedToken)

    if (adminUser) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(adminUser))
      setAdmin(adminUser)
    }

    return data
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ADMIN_KEY)
    setToken(null)
    setAdmin(null)
  }

  const value = useMemo(
    () => ({
      admin,
      token,
      loading,
      isAuthenticated,
      login,
      logout,
    }),
    [admin, token, loading, isAuthenticated]
  )

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)

  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider")
  }

  return context
}