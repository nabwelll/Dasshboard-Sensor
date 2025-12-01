import { useState } from 'react'
import { Save, RotateCcw, AlertCircle, CheckCircle, Thermometer, Droplets, Wind, Sun } from 'lucide-react'
import { Card } from '../components/Card'
import { supabase, isDemoMode } from '../lib/supabase'

interface CalibrationValue {
  offset: number
  scale: number
  minValue: number
  maxValue: number
}

interface CalibrationState {
  temperature: CalibrationValue
  humidity: CalibrationValue
  pressure: CalibrationValue
  light: CalibrationValue
}

const defaultCalibration: CalibrationState = {
  temperature: { offset: 0, scale: 1, minValue: -40, maxValue: 85 },
  humidity: { offset: 0, scale: 1, minValue: 0, maxValue: 100 },
  pressure: { offset: 0, scale: 1, minValue: 300, maxValue: 1100 },
  light: { offset: 0, scale: 1, minValue: 0, maxValue: 10000 }
}

const sensorConfig = [
  {
    key: 'temperature' as const,
    name: 'Sensor Suhu',
    icon: Thermometer,
    unit: '°C',
    color: 'orange',
    description: 'Kalibrasi sensor suhu untuk pembacaan yang akurat'
  },
  {
    key: 'humidity' as const,
    name: 'Sensor Kelembaban',
    icon: Droplets,
    unit: '%',
    color: 'blue',
    description: 'Kalibrasi sensor kelembaban relatif'
  },
  {
    key: 'pressure' as const,
    name: 'Sensor Tekanan',
    icon: Wind,
    unit: 'hPa',
    color: 'purple',
    description: 'Kalibrasi sensor tekanan atmosfer'
  },
  {
    key: 'light' as const,
    name: 'Sensor Cahaya',
    icon: Sun,
    unit: 'lux',
    color: 'cyan',
    description: 'Kalibrasi sensor intensitas cahaya'
  }
]

export function CalibrationPage() {
  const [calibration, setCalibration] = useState<CalibrationState>(defaultCalibration)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<keyof CalibrationState>('temperature')

  const handleChange = (
    sensor: keyof CalibrationState,
    field: keyof CalibrationValue,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0
    setCalibration(prev => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        [field]: numValue
      }
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (!isDemoMode) {
        // Save to Supabase
        for (const [sensor, values] of Object.entries(calibration)) {
          const record = {
            sensor_type: sensor,
            offset: values.offset,
            scale: values.scale,
            min_value: values.minValue,
            max_value: values.maxValue,
            unit: sensorConfig.find(s => s.key === sensor)?.unit || ''
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('calibration_settings') as any).upsert(record)
        }
      }
      
      // Simulate save delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving calibration:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = (sensor: keyof CalibrationState) => {
    setCalibration(prev => ({
      ...prev,
      [sensor]: defaultCalibration[sensor]
    }))
    setSaved(false)
  }

  const handleResetAll = () => {
    setCalibration(defaultCalibration)
    setSaved(false)
  }

  const activeSensor = sensorConfig.find(s => s.key === activeTab)!
  const activeValues = calibration[activeTab]

  const colorClasses = {
    orange: 'from-orange-500 to-orange-600 border-orange-500/30 bg-orange-500/10',
    blue: 'from-blue-500 to-blue-600 border-blue-500/30 bg-blue-500/10',
    purple: 'from-purple-500 to-purple-600 border-purple-500/30 bg-purple-500/10',
    cyan: 'from-cyan-500 to-cyan-600 border-cyan-500/30 bg-cyan-500/10'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Kalibrasi Sensor</h1>
          <p className="text-slate-400">Atur parameter kalibrasi untuk setiap sensor</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetAll}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Semua</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan'}</span>
          </button>
        </div>
      </div>

      {/* Info Alert */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
        <div>
          <p className="text-blue-400 font-medium">Informasi Kalibrasi</p>
          <p className="text-slate-400 text-sm mt-1">
            Kalibrasi memungkinkan Anda menyesuaikan pembacaan sensor dengan nilai referensi yang akurat. 
            Gunakan offset untuk koreksi nilai absolut dan scale untuk koreksi proporsional.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sensor Selection Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4" gradient>
            <h3 className="text-sm font-medium text-slate-400 mb-4 px-2">Pilih Sensor</h3>
            <div className="space-y-2">
              {sensorConfig.map((sensor) => {
                const Icon = sensor.icon
                const isActive = activeTab === sensor.key
                const colors = colorClasses[sensor.color as keyof typeof colorClasses]
                
                return (
                  <button
                    key={sensor.key}
                    onClick={() => setActiveTab(sensor.key)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      isActive
                        ? `${colors} border`
                        : 'hover:bg-slate-700/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.split(' ')[0]} ${colors.split(' ')[1]}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className={`font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {sensor.name}
                      </p>
                      <p className="text-xs text-slate-500">{sensor.unit}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Calibration Form */}
        <div className="lg:col-span-3">
          <Card className="p-6" gradient>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[activeSensor.color as keyof typeof colorClasses].split(' ')[0]} ${colorClasses[activeSensor.color as keyof typeof colorClasses].split(' ')[1]}`}>
                <activeSensor.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{activeSensor.name}</h2>
                <p className="text-sm text-slate-400">{activeSensor.description}</p>
              </div>
              <button
                onClick={() => handleReset(activeTab)}
                className="ml-auto flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Offset */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Offset ({activeSensor.unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={activeValues.offset}
                  onChange={(e) => handleChange(activeTab, 'offset', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="0.0"
                />
                <p className="text-xs text-slate-500">
                  Nilai yang ditambahkan ke pembacaan sensor
                </p>
              </div>

              {/* Scale */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Scale (Multiplier)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={activeValues.scale}
                  onChange={(e) => handleChange(activeTab, 'scale', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="1.0"
                />
                <p className="text-xs text-slate-500">
                  Faktor pengali untuk koreksi proporsional
                </p>
              </div>

              {/* Min Value */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Nilai Minimum ({activeSensor.unit})
                </label>
                <input
                  type="number"
                  value={activeValues.minValue}
                  onChange={(e) => handleChange(activeTab, 'minValue', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="0"
                />
                <p className="text-xs text-slate-500">
                  Batas bawah pembacaan sensor
                </p>
              </div>

              {/* Max Value */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Nilai Maximum ({activeSensor.unit})
                </label>
                <input
                  type="number"
                  value={activeValues.maxValue}
                  onChange={(e) => handleChange(activeTab, 'maxValue', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="100"
                />
                <p className="text-xs text-slate-500">
                  Batas atas pembacaan sensor
                </p>
              </div>
            </div>

            {/* Formula Preview */}
            <div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Formula Kalibrasi</h3>
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-slate-400">Nilai Terkalibrasi =</span>
                <span className="text-blue-400">(Nilai Mentah × {activeValues.scale})</span>
                <span className="text-slate-400">+</span>
                <span className="text-green-400">{activeValues.offset}</span>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Range valid: {activeValues.minValue} {activeSensor.unit} - {activeValues.maxValue} {activeSensor.unit}
              </div>
            </div>

            {/* Example Calculation */}
            <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Contoh Perhitungan</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Nilai Mentah</p>
                  <p className="text-lg font-semibold text-orange-400">25.0</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Proses</p>
                  <p className="text-slate-400">→ × {activeValues.scale} + {activeValues.offset} →</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Nilai Terkalibrasi</p>
                  <p className="text-lg font-semibold text-green-400">
                    {(25 * activeValues.scale + activeValues.offset).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
