import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  gradient?: boolean
}

export function Card({ children, className = '', gradient = false }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border border-slate-700/50 backdrop-blur-sm
        ${gradient 
          ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80' 
          : 'bg-slate-800/60'
        }
        ${className}
      `}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  unit: string
  icon: ReactNode
  color: 'blue' | 'green' | 'orange' | 'purple' | 'cyan'
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
}

const colorClasses = {
  blue: {
    bg: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    icon: 'from-blue-500 to-blue-600',
    text: 'text-blue-400'
  },
  green: {
    bg: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/30',
    icon: 'from-green-500 to-green-600',
    text: 'text-green-400'
  },
  orange: {
    bg: 'from-orange-500/20 to-orange-600/10',
    border: 'border-orange-500/30',
    icon: 'from-orange-500 to-orange-600',
    text: 'text-orange-400'
  },
  purple: {
    bg: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/30',
    icon: 'from-purple-500 to-purple-600',
    text: 'text-purple-400'
  },
  cyan: {
    bg: 'from-cyan-500/20 to-cyan-600/10',
    border: 'border-cyan-500/30',
    icon: 'from-cyan-500 to-cyan-600',
    text: 'text-cyan-400'
  }
}

export function StatCard({ title, value, unit, icon, color, trend, trendValue }: StatCardProps) {
  const colors = colorClasses[color]
  
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br ${colors.bg}
        border ${colors.border}
        backdrop-blur-sm
      `}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.icon} shadow-lg`}>
            {icon}
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm ${
              trend === 'up' ? 'text-green-400' : 
              trend === 'down' ? 'text-red-400' : 
              'text-slate-400'
            }`}>
              <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {typeof value === 'number' ? value.toFixed(1) : value}
            </span>
            <span className={`text-lg font-medium ${colors.text}`}>{unit}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
