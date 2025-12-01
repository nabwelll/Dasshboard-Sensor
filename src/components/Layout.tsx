import { NavLink, Outlet } from 'react-router-dom'
import { Home, Activity, Settings, Database, Info, Menu, X, Gauge } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/realtime', icon: Activity, label: 'Realtime Data' },
  { to: '/calibration', icon: Settings, label: 'Calibration' },
  { to: '/datalog', icon: Database, label: 'Data Log' },
  { to: '/about', icon: Info, label: 'About' },
]

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl">
                <Gauge className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Dashboard Sensor
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-700 bg-slate-800/95 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 Dashboard Sensor. Powered by Supabase & React.
          </p>
        </div>
      </footer>
    </div>
  )
}
