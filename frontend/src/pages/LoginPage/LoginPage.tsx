import { Alert, Button, Card, Input, Typography } from 'antd'
import { LockKeyhole, ShieldUser } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { LoginPageProps } from './types/LoginPageProps'
import './LoginPage.css'

export function LoginPage({ errorMessage, onLogin }: LoginPageProps) {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    onLogin(username, password)
  }

  return (
    <div className="login-page">
      <Card className="login-page__card">
        <div className="login-page__header">
          <div className="login-page__icon">
            <ShieldUser size={22} />
          </div>

          <div>
            <Typography.Text className="login-page__eyebrow">Acceso al sistema</Typography.Text>
            <Typography.Title className="login-page__title" level={2}>
              Iniciar sesion
            </Typography.Title>
            <Typography.Paragraph className="login-page__description">
              Ingresa con el usuario administrador para acceder al panel del MVP.
            </Typography.Paragraph>
          </div>
        </div>

        <form className="login-page__form" onSubmit={handleSubmit}>
          <label className="login-page__field">
            <span>Usuario</span>
            <Input
              placeholder="admin"
              size="large"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label className="login-page__field">
            <span>Contrasena</span>
            <Input.Password
              placeholder="admin123"
              prefix={<LockKeyhole size={16} />}
              size="large"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {errorMessage ? <Alert message={errorMessage} showIcon type="error" /> : null}

          <Button block htmlType="submit" size="large" type="primary">
            Entrar al sistema
          </Button>
        </form>
      </Card>
    </div>
  )
}
