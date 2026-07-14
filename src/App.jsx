import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ResumenDiarioPage from './pages/ResumenDiarioPage'
import NoticiasPage from './pages/NoticiasPage'
import ConfiguracionPage from './pages/ConfiguracionPage'

const TAB_META = {
  resumen: { title: 'Resumen Diario', subtitle: 'Tu resumen de inteligencia personalizado para hoy' },
  noticias: { title: 'Noticias', subtitle: 'Descubre las noticias más relevantes de tu sector' },
  configuracion: { title: 'Configuración', subtitle: 'Personaliza tu experiencia en Daily Intelligence Bot' },
}

export default function App() {
  const { user, loading, error, login, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('resumen')
  const [collapsed, setCollapsed] = useState(false)

  // FASE 2: si no hay sesión iniciada, no se puede ver el sistema.
  if (!user) {
    return <LoginPage onLogin={login} loading={loading} error={error} />
  }

  const { title, subtitle } = TAB_META[activeTab]
  const sideW = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)'

  function handleLogout() {
    logout()
    setActiveTab('resumen')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar
        user={user}
        title={title}
        subtitle={subtitle}
        collapsed={collapsed}
        onToggleSidebar={() => setCollapsed((c) => !c)}
        onLogout={handleLogout}
      />

      <Sidebar collapsed={collapsed} activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />

      <main
        style={{
          paddingTop: 'var(--navbar-h)',
          marginLeft: sideW,
          transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
          minHeight: '100vh',
        }}
      >
        {activeTab === 'resumen' && <ResumenDiarioPage />}
        {activeTab === 'noticias' && <NoticiasPage />}
        {activeTab === 'configuracion' && <ConfiguracionPage />}
      </main>
    </div>
  )
}
