import { useEffect, useState, useRef } from 'react'
import { Thermometer, Droplets, Wind, Sun, Activity, Pause, Play, RefreshCw } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, StatCard } from '../components/Card'
import { supabase, isDemoMode, generateRealtimeData } from '../lib/supabase'
import type { SensorData } from '../types/database'

const MAX_DATA_POINTS = 60

export function RealtimePage() {
  const [data, setData] = useState<SensorData[]>([])
  const [isLive, setIsLive] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Initialize with some data points
    const initialData: SensorData[] = []
    for (let i = 0; i < 10; i++) {
      initialData.push(generateRealtimeData())
    }
    setData(initialData)
    setConnectionStatus('connected')

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isLive) {
      if (isDemoMode) {
        // Demo mode: generate fake data every 2 seconds
        intervalRef.current = setInterval(() => {
          const newData = generateRealtimeData()
          setData(prev => {
            const updated = [...prev, newData]
            return updated.slice(-MAX_DATA_POINTS)
          })
        }, 2000)
      } else {
        // Real Supabase subscription
        const channel = supabase
          .channel('sensor_data_realtime')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'sensor_data'
            },
            (payload) => {
              const newData = payload.new as SensorData
              setData(prev => {
                const updated = [...prev, newData]
                return updated.slice(-MAX_DATA_POINTS)
              })
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setConnectionStatus('connected')
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
              setConnectionStatus('disconnected')
            }
          })

        return () => {
          supabase.removeChannel(channel)
        }
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isLive])

  const latestData = data[data.length - 1]

  const chartData = data.map((d, index) => ({
    index,
    time: new Date(d.timestamp).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }),
    temperature: d.temperature,
    humidity: d.humidity,
    pressure: d.pressure,
    light: d.light
  }))

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500'
      case 'disconnected': return 'bg-red-500'
      default: return 'bg-yellow-500'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Terhubung'
      case 'disconnected': return 'Terputus'
      default: return 'Menghubungkan...'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Realtime Data</h1>
          <p className="text-slate-400">Pantau data sensor secara langsung dengan update otomatis</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
            <span className="text-sm text-slate-300">{getStatusText()}</span>
          </div>
          
          {/* Live/Pause Toggle */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              isLive
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {isLive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Resume</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Indicator */}
      {isLive && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <Activity className="w-5 h-5 text-green-400 animate-pulse" />
          <div>
            <p className="text-green-400 font-medium">Mode Realtime Aktif</p>
            <p className="text-slate-400 text-sm">
              Data diperbarui setiap 2 detik • {data.length} data points
            </p>
          </div>
          <div className="ml-auto">
            <RefreshCw className="w-5 h-5 text-green-400 animate-spin" />
          </div>
        </div>
      )}

      {/* Current Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Suhu"
          value={latestData?.temperature || 0}
          unit="°C"
          icon={<Thermometer className="w-6 h-6 text-white" />}
          color="orange"
        />
        <StatCard
          title="Kelembaban"
          value={latestData?.humidity || 0}
          unit="%"
          icon={<Droplets className="w-6 h-6 text-white" />}
          color="blue"
        />
        <StatCard
          title="Tekanan"
          value={latestData?.pressure || 0}
          unit="hPa"
          icon={<Wind className="w-6 h-6 text-white" />}
          color="purple"
        />
        <StatCard
          title="Cahaya"
          value={latestData?.light || 0}
          unit="lux"
          icon={<Sun className="w-6 h-6 text-white" />}
          color="cyan"
        />
      </div>

      {/* Realtime Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <Card className="p-6" gradient>
          <div className="flex items-center gap-2 mb-6">
            <Thermometer className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">Suhu Realtime</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}°C`, 'Suhu']}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Humidity Chart */}
        <Card className="p-6" gradient>
          <div className="flex items-center gap-2 mb-6">
            <Droplets className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Kelembaban Realtime</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Kelembaban']}
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pressure Chart */}
        <Card className="p-6" gradient>
          <div className="flex items-center gap-2 mb-6">
            <Wind className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Tekanan Realtime</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} hPa`, 'Tekanan']}
                />
                <Line 
                  type="monotone" 
                  dataKey="pressure" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Light Chart */}
        <Card className="p-6" gradient>
          <div className="flex items-center gap-2 mb-6">
            <Sun className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Cahaya Realtime</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  domain={[0, 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value: number) => [`${value.toFixed(0)} lux`, 'Cahaya']}
                />
                <Line 
                  type="monotone" 
                  dataKey="light" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
