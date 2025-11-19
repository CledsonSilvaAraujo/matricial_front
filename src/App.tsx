import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import ReservasList from './pages/ReservasList'
import ReservaForm from './pages/ReservaForm'
import SalasList from './pages/SalasList'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Componente para redirecionar baseado em autenticação
function HomeRedirect() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return <Navigate to={isAuthenticated ? '/reservas' : '/login'} replace />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota de login (sem layout) */}
          <Route path="/login" element={<Login />} />
          
          {/* Rota raiz - redireciona baseado em autenticação */}
          <Route path="/" element={<HomeRedirect />} />
          
          {/* Rotas protegidas (com layout) */}
          <Route
            path="/reservas"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReservasList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas/nova"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReservaForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas/editar/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReservaForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/salas"
            element={
              <ProtectedRoute>
                <Layout>
                  <SalasList />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  )
}

export default App

