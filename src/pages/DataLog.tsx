import { useEffect, useState } from 'react'
import { Database, Download, Search, Calendar, ChevronLeft, ChevronRight, Filter, RefreshCw } from 'lucide-react'
import { Card } from '../components/Card'
import { supabase, isDemoMode, generateDemoData } from '../lib/supabase'
import type { SensorData } from '../types/database'

const ITEMS_PER_PAGE = 10

export function DataLogPage() {
  const [data, setData] = useState<SensorData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [sortField, setSortField] = useState<keyof SensorData>('timestamp')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (isDemoMode) {
        // Generate more demo data for log view
        const demoData: SensorData[] = []
        const now = new Date()
        for (let i = 0; i < 100; i++) {
          const time = new Date(now.getTime() - i * 15 * 60 * 1000) // Every 15 minutes
          demoData.push({
            id: crypto.randomUUID(),
            timestamp: time.toISOString(),
            temperature: 22 + Math.random() * 8 + Math.sin(i / 10) * 3,
            humidity: 45 + Math.random() * 20 + Math.cos(i / 10) * 5,
            pressure: 1010 + Math.random() * 10 + Math.sin(i / 15) * 5,
            light: Math.max(0, 500 + Math.sin((i - 20) / 10) * 400 + Math.random() * 100),
            created_at: time.toISOString()
          })
        }
        setData(demoData)
      } else {
        const { data: fetchedData, error } = await supabase
          .from('sensor_data')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(500)

        if (error) throw error
        setData(fetchedData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setData(generateDemoData())
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort data
  const filteredData = data
    .filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.temperature.toString().includes(searchQuery) ||
        item.humidity.toString().includes(searchQuery) ||
        item.pressure.toString().includes(searchQuery) ||
        item.light.toString().includes(searchQuery)
      
      const matchesDate = dateFilter === '' ||
        item.timestamp.startsWith(dateFilter)
      
      return matchesSearch && matchesDate
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSort = (field: keyof SensorData) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Pressure (hPa)', 'Light (lux)'].join(','),
      ...filteredData.map(row => [
        row.timestamp,
        row.temperature.toFixed(2),
        row.humidity.toFixed(2),
        row.pressure.toFixed(2),
        row.light.toFixed(2)
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `sensor_data_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const SortIcon = ({ field }: { field: keyof SensorData }) => {
    if (sortField !== field) return null
    return (
      <span className="ml-1 text-blue-400">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Data Log</h1>
          <p className="text-slate-400">Riwayat pembacaan sensor dengan fitur pencarian dan ekspor</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4" gradient>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Cari nilai sensor..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-xl border border-slate-600">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">{filteredData.length} data</span>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="overflow-hidden" gradient>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Memuat data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700/50 border-b border-slate-600">
                    <th 
                      className="px-6 py-4 text-left text-sm font-medium text-slate-300 cursor-pointer hover:text-white"
                      onClick={() => handleSort('timestamp')}
                    >
                      <div className="flex items-center">
                        Waktu
                        <SortIcon field="timestamp" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-medium text-slate-300 cursor-pointer hover:text-white"
                      onClick={() => handleSort('temperature')}
                    >
                      <div className="flex items-center">
                        Suhu (°C)
                        <SortIcon field="temperature" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-medium text-slate-300 cursor-pointer hover:text-white"
                      onClick={() => handleSort('humidity')}
                    >
                      <div className="flex items-center">
                        Kelembaban (%)
                        <SortIcon field="humidity" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-medium text-slate-300 cursor-pointer hover:text-white"
                      onClick={() => handleSort('pressure')}
                    >
                      <div className="flex items-center">
                        Tekanan (hPa)
                        <SortIcon field="pressure" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-medium text-slate-300 cursor-pointer hover:text-white"
                      onClick={() => handleSort('light')}
                    >
                      <div className="flex items-center">
                        Cahaya (lux)
                        <SortIcon field="light" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {paginatedData.map((row) => (
                    <tr 
                      key={row.id}
                      className="hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {new Date(row.timestamp).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'medium'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-sm font-medium">
                          {row.temperature.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium">
                          {row.humidity.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-medium">
                          {row.pressure.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium">
                          {row.light.toFixed(0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-700/30 border-t border-slate-700">
              <p className="text-sm text-slate-400">
                Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} dari {filteredData.length} data
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Summary Stats */}
      <Card className="p-6" gradient>
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Ringkasan Data</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-slate-400 text-sm mb-1">Total Data</p>
            <p className="text-2xl font-bold text-white">{data.length}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Data Hari Ini</p>
            <p className="text-2xl font-bold text-blue-400">
              {data.filter(d => 
                new Date(d.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Data Terfilter</p>
            <p className="text-2xl font-bold text-green-400">{filteredData.length}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Rentang Waktu</p>
            <p className="text-sm font-medium text-purple-400">
              {data.length > 0 && data[data.length - 1] && data[0] ? (
                <>
                  {new Date(data[data.length - 1].timestamp).toLocaleDateString('id-ID')} - {new Date(data[0].timestamp).toLocaleDateString('id-ID')}
                </>
              ) : '-'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
