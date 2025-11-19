import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import ReservasList from './pages/ReservasList'
import ReservaForm from './pages/ReservaForm'
import SalasList from './pages/SalasList'
import Login from './pages/Login'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ReservasList />} />
            <Route path="/reservas" element={<ReservasList />} />
            <Route path="/reservas/nova" element={<ReservaForm />} />
            <Route path="/reservas/editar/:id" element={<ReservaForm />} />
            <Route path="/salas" element={<SalasList />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  )
}

export default App

