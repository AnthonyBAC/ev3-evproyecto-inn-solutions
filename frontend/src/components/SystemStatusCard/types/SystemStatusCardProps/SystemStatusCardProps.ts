import type { SystemStatus } from '../../../../types/SystemStatus'

export interface SystemStatusCardProps {
  errorMessage: string | null
  isLoading: boolean
  systemStatus: SystemStatus | null
}
