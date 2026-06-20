// Card de estado del sistema — muestra si el backend está online/offline con indicador visual
import { Alert, Card, Descriptions, Skeleton, Tag, Typography } from 'antd'
import type { SystemStatusCardProps } from './types/SystemStatusCardProps'
import './SystemStatusCard.css'

export function SystemStatusCard({
  errorMessage,
  isLoading,
  systemStatus,
}: SystemStatusCardProps) {
  if (isLoading) {
    return (
      <Card className="system-status-card" title="Estado de integracion">
        <Skeleton active paragraph={{ rows: 2 }} />
      </Card>
    )
  }

  if (errorMessage) {
    return (
      <Card className="system-status-card" title="Estado de integracion">
        <Alert message={errorMessage} type="error" showIcon />
      </Card>
    )
  }

  return (
    <Card className="system-status-card" title="Estado de integracion">
      {systemStatus ? (
        <div className="system-status-card__content">
          <div className="system-status-card__row">
            <Typography.Text type="secondary">Backend local</Typography.Text>
            <Tag color="success">{systemStatus.status}</Tag>
          </div>

          <Descriptions className="system-status-card__details" column={1} size="small">
            <Descriptions.Item label="Servicio">{systemStatus.name}</Descriptions.Item>
            <Descriptions.Item label="Ultima respuesta">
              {new Date(systemStatus.timestamp).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <Alert message="No hay datos disponibles del backend." type="warning" showIcon />
      )}
    </Card>
  )
}
