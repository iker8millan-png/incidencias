import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { NuevaIncidenciaPage } from './pages/NuevaIncidenciaPage'
import { ListadoPage } from './pages/ListadoPage'
import { EstadisticasPage } from './pages/EstadisticasPage'
import { PersonasPage } from './pages/PersonasPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-slate-500">
        Cargando…
      </div>
    )
  }
  if (!session) return <Navigate to="/login" replace />
  return children
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-slate-500">
        Cargando…
      </div>
    )
  }
  if (session) return <Navigate to="/nueva" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/nueva" replace />} />
        <Route path="nueva" element={<NuevaIncidenciaPage />} />
        <Route path="listado" element={<ListadoPage />} />
        <Route path="estadisticas" element={<EstadisticasPage />} />
        <Route path="personas" element={<PersonasPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/nueva" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
