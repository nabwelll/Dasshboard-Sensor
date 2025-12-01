import { useEffect, useState } from 'react'
import { Thermometer, Droplets, Wind, Sun, TrendingUp, Clock, Zap, AlertTriangle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { StatCard, Card } from '../components/Card'
import { supabase, isDemoMode, generateDemoData } from '../lib/supabase'
import type { SensorData } from '../types/database'

export function HomePage() {
  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    async function fetchData() {
      try {
        if (isDemoMode) {
          setSensorData(generateDemoData())
        } else {
          const { data, error } = await supabase
            .from('sensor_data')
            .select('*')
            .order('timestamp', { ascending: true })
            .limit(24)

          if (error) throw error
          setSensorData(data || [])
        }
        setLastUpdate(new Date())
      } catch (error) {
        console.error('Error fetching data:', error)
        setSensorData(generateDemoData())
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const latestData = sensorData[sensorData.length - 1]
  const previousData = sensorData[sensorData.length - 2]

  const getTrend = (current?: number, previous?: number) => {
    if (!current || !previous) return 'stable'
    const diff = current - previous
    if (diff > 0.5) return 'up'
    if (diff < -0.5) return 'down'
    return 'stable'
  }

  const chartData = sensorData.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    temperature: d.temperature,
    humidity: d.humidity,
    pressure: d.pressure,
    light: d.light
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Memuat data sensor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-slate-400">Monitoring sensor secara realtime dengan data terintegrasi</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300">
            Update terakhir: {lastUpdate.toLocaleTimeString('id-ID')}
          </span>
        </div>
      </div>

      {/* Demo Mode Alert */}
      {isDemoMode && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-amber-400 font-medium">Mode Demo</p>
            <p className="text-slate-400 text-sm">
              Menampilkan data simulasi. Konfigurasi Supabase untuk data nyata.
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Suhu"
          value={latestData?.temperature || 0}
          unit="°C"
          icon={<Thermometer className="w-6 h-6 text-white" />}
          color="orange"
          trend={getTrend(latestData?.temperature, previousData?.temperature)}
          trendValue={`${Math.abs((latestData?.temperature || 0) - (previousData?.temperature || 0)).toFixed(1)}°C`}
        />
        <StatCard
          title="Kelembaban"
          value={latestData?.humidity || 0}
          unit="%"
          icon={<Droplets className="w-6 h-6 text-white" />}
          color="blue"
          trend={getTrend(latestData?.humidity, previousData?.humidity)}
          trendValue={`${Math.abs((latestData?.humidity || 0) - (previousData?.humidity || 0)).toFixed(1)}%`}
        />
        <StatCard
          title="Tekanan"
          value={latestData?.pressure || 0}
          unit="hPa"
          icon={<Wind className="w-6 h-6 text-white" />}
          color="purple"
          trend={getTrend(latestData?.pressure, previousData?.pressure)}
          trendValue={`${Math.abs((latestData?.pressure || 0) - (previousData?.pressure || 0)).toFixed(1)} hPa`}
        />
        <StatCard
          title="Cahaya"
          value={latestData?.light || 0}
          unit="lux"
          icon={<Sun className="w-6 h-6 text-white" />}
          color="cyan"
          trend={getTrend(latestData?.light, previousData?.light)}
          trendValue={`${Math.abs((latestData?.light || 0) - (previousData?.light || 0)).toFixed(0)} lux`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature & Humidity Chart */}
        <Card className="p-6" gradient>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Suhu & Kelembaban</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHumid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="temp"
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <YAxis 
                  yAxisId="humid"
                  orientation="right"
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
                />
                <Area 
                  yAxisId="temp"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  fill="url(#colorTemp)"
                  name="Suhu (°C)"
                />
                <Area 
                  yAxisId="humid"
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#colorHumid)"
                  name="Kelembaban (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pressure & Light Chart */}
        <Card className="p-6" gradient>
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Tekanan & Cahaya</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="pressure"
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <YAxis 
                  yAxisId="light"
                  orientation="right"
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
                />
                <Line 
                  yAxisId="pressure"
                  type="monotone" 
                  dataKey="pressure" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  dot={false}
                  name="Tekanan (hPa)"
                />
                <Line 
                  yAxisId="light"
                  type="monotone" 
                  dataKey="light" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={false}
                  name="Cahaya (lux)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="p-6" gradient>
        <h2 className="text-lg font-semibold text-white mb-4">Statistik Cepat (24 Jam Terakhir)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-1">Suhu Rata-rata</p>
            <p className="text-2xl font-bold text-orange-400">
              {(sensorData.reduce((a, b) => a + b.temperature, 0) / sensorData.length).toFixed(1)}°C
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-1">Kelembaban Rata-rata</p>
            <p className="text-2xl font-bold text-blue-400">
              {(sensorData.reduce((a, b) => a + b.humidity, 0) / sensorData.length).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-1">Tekanan Rata-rata</p>
            <p className="text-2xl font-bold text-purple-400">
              {(sensorData.reduce((a, b) => a + b.pressure, 0) / sensorData.length).toFixed(1)} hPa
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-1">Cahaya Rata-rata</p>
            <p className="text-2xl font-bold text-cyan-400">
              {(sensorData.reduce((a, b) => a + b.light, 0) / sensorData.length).toFixed(0)} lux
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
