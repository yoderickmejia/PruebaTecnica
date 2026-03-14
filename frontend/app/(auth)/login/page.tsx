import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/login-form'

export const metadata = { title: 'Iniciar sesión — Wiki Explorer' }

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Bienvenido de vuelta</CardTitle>
        <CardDescription>Inicia sesión para acceder a tus artículos guardados</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
