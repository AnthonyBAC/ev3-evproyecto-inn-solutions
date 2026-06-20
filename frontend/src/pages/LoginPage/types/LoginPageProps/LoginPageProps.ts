// Props de LoginPage — mensaje de error y handler de login
export interface LoginPageProps {
  errorMessage: string | null
  onLogin: (username: string, password: string) => void
}
