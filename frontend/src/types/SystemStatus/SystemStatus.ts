// Interfaz de health check del backend
export interface SystemStatus {
  name: 'backend'
  status: 'ok'
  timestamp: string
}
