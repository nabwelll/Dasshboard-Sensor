import { 
  Info, 
  Gauge, 
  Github, 
  Globe, 
  Mail, 
  Cpu, 
  Wifi, 
  Database,
  Shield,
  Smartphone,
  Zap,
  CheckCircle
} from 'lucide-react'
import { Card } from '../components/Card'

const features = [
  {
    icon: Activity,
    title: 'Monitoring Realtime',
    description: 'Pantau data sensor secara langsung dengan pembaruan otomatis setiap detik'
  },
  {
    icon: Database,
    title: 'Penyimpanan Data',
    description: 'Semua data tersimpan aman di cloud dengan Supabase backend'
  },
  {
    icon: Smartphone,
    title: 'Progressive Web App',
    description: 'Install sebagai aplikasi native di perangkat mobile dan desktop'
  },
  {
    icon: Shield,
    title: 'Keamanan Data',
    description: 'Enkripsi end-to-end untuk menjaga kerahasiaan data sensor Anda'
  },
  {
    icon: Wifi,
    title: 'Mode Offline',
    description: 'Tetap berfungsi bahkan tanpa koneksi internet berkat service worker'
  },
  {
    icon: Zap,
    title: 'Performa Tinggi',
    description: 'Dibangun dengan React dan TypeScript untuk performa optimal'
  }
]

const techStack = [
  { name: 'React 18', color: 'from-cyan-500 to-blue-500' },
  { name: 'TypeScript', color: 'from-blue-600 to-blue-400' },
  { name: 'Vite', color: 'from-purple-500 to-pink-500' },
  { name: 'Tailwind CSS', color: 'from-cyan-400 to-teal-500' },
  { name: 'Supabase', color: 'from-green-500 to-emerald-500' },
  { name: 'Recharts', color: 'from-orange-500 to-amber-500' },
  { name: 'PWA', color: 'from-indigo-500 to-violet-500' },
  { name: 'Lucide Icons', color: 'from-rose-500 to-pink-500' }
]

const sensors = [
  { name: 'Suhu', unit: '°C', range: '-40 ~ 85', icon: '🌡️' },
  { name: 'Kelembaban', unit: '%', range: '0 ~ 100', icon: '💧' },
  { name: 'Tekanan', unit: 'hPa', range: '300 ~ 1100', icon: '🌀' },
  { name: 'Cahaya', unit: 'lux', range: '0 ~ 10000', icon: '☀️' }
]

import { Activity } from 'lucide-react'

export function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-lg shadow-blue-500/25">
            <Gauge className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Dashboard Sensor</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Platform monitoring sensor modern dengan teknologi Progressive Web App 
          untuk pemantauan data secara realtime
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
            v1.0.0
          </span>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
            PWA Ready
          </span>
        </div>
      </div>

      {/* Features */}
      <Card className="p-6" gradient>
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Fitur Utama</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/50 hover:border-blue-500/50 transition-all"
            >
              <div className="p-2 w-fit rounded-lg bg-blue-500/20 mb-3">
                <feature.icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Supported Sensors */}
      <Card className="p-6" gradient>
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Sensor yang Didukung</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sensors.map((sensor) => (
            <div 
              key={sensor.name}
              className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/50 text-center"
            >
              <span className="text-3xl mb-3 block">{sensor.icon}</span>
              <h3 className="font-semibold text-white">{sensor.name}</h3>
              <p className="text-sm text-slate-400">{sensor.unit}</p>
              <p className="text-xs text-slate-500 mt-1">Range: {sensor.range}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Tech Stack */}
      <Card className="p-6" gradient>
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Teknologi</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {techStack.map((tech) => (
            <span
              key={tech.name}
              className={`px-4 py-2 rounded-xl bg-gradient-to-r ${tech.color} text-white font-medium text-sm shadow-lg`}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </Card>

      {/* PWA Installation Guide */}
      <Card className="p-6" gradient>
        <div className="flex items-center gap-2 mb-6">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-semibold text-white">Install Aplikasi</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-white">Di Android / Chrome:</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-400">
              <li>Buka menu browser (⋮)</li>
              <li>Pilih "Install app" atau "Add to Home screen"</li>
              <li>Konfirmasi instalasi</li>
              <li>Buka dari home screen</li>
            </ol>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium text-white">Di iOS / Safari:</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-400">
              <li>Tap tombol Share (↑)</li>
              <li>Scroll dan pilih "Add to Home Screen"</li>
              <li>Beri nama aplikasi</li>
              <li>Tap "Add"</li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Supabase Setup Guide */}
      <Card className="p-6" gradient>
        <div className="flex items-center gap-2 mb-6">
          <Database className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Konfigurasi Supabase</h2>
        </div>
        <div className="space-y-4">
          <p className="text-slate-400">
            Untuk menggunakan data sensor nyata, konfigurasi Supabase dengan langkah berikut:
          </p>
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h4 className="font-medium text-white mb-3">1. Buat tabel sensor_data</h4>
            <pre className="text-sm text-slate-400 overflow-x-auto">
{`CREATE TABLE sensor_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  temperature DOUBLE PRECISION NOT NULL,
  humidity DOUBLE PRECISION NOT NULL,
  pressure DOUBLE PRECISION NOT NULL,
  light DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h4 className="font-medium text-white mb-3">2. Buat tabel calibration_settings</h4>
            <pre className="text-sm text-slate-400 overflow-x-auto">
{`CREATE TABLE calibration_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sensor_type TEXT NOT NULL UNIQUE,
  offset DOUBLE PRECISION DEFAULT 0,
  scale DOUBLE PRECISION DEFAULT 1,
  min_value DOUBLE PRECISION,
  max_value DOUBLE PRECISION,
  unit TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h4 className="font-medium text-white mb-3">3. Set environment variables</h4>
            <pre className="text-sm text-slate-400 overflow-x-auto">
{`VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key`}
            </pre>
          </div>
        </div>
      </Card>

      {/* Contact & Links */}
      <Card className="p-6" gradient>
        <div className="flex items-center gap-2 mb-6">
          <Info className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Informasi</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-700/30 border border-slate-600/50 hover:border-slate-500/50 transition-all"
          >
            <Github className="w-6 h-6 text-slate-300" />
            <div>
              <p className="font-medium text-white">GitHub</p>
              <p className="text-sm text-slate-400">Source code</p>
            </div>
          </a>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-700/30 border border-slate-600/50 hover:border-slate-500/50 transition-all"
          >
            <Globe className="w-6 h-6 text-green-400" />
            <div>
              <p className="font-medium text-white">Supabase</p>
              <p className="text-sm text-slate-400">Backend service</p>
            </div>
          </a>
          <a
            href="mailto:support@example.com"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-700/30 border border-slate-600/50 hover:border-slate-500/50 transition-all"
          >
            <Mail className="w-6 h-6 text-blue-400" />
            <div>
              <p className="font-medium text-white">Contact</p>
              <p className="text-sm text-slate-400">Get in touch</p>
            </div>
          </a>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-slate-500 text-sm">
          Made with ❤️ using React, TypeScript, and Supabase
        </p>
        <p className="text-slate-600 text-xs mt-2">
          © 2024 Dashboard Sensor. All rights reserved.
        </p>
      </div>
    </div>
  )
}
