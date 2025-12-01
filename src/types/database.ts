export interface SensorData {
  id: string
  timestamp: string
  temperature: number
  humidity: number
  pressure: number
  light: number
  created_at: string
}

export interface CalibrationSettings {
  id: string
  sensor_type: 'temperature' | 'humidity' | 'pressure' | 'light'
  offset: number
  scale: number
  min_value: number
  max_value: number
  unit: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      sensor_data: {
        Row: SensorData
        Insert: Omit<SensorData, 'id' | 'created_at'>
        Update: Partial<Omit<SensorData, 'id' | 'created_at'>>
      }
      calibration_settings: {
        Row: CalibrationSettings
        Insert: Omit<CalibrationSettings, 'id' | 'updated_at'>
        Update: Partial<Omit<CalibrationSettings, 'id' | 'updated_at'>>
      }
    }
  }
}
