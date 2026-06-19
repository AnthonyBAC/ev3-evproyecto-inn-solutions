export interface LoginPageProps {
  errorMessage: string | null
  onLogin: (username: string, password: string) => void
}
