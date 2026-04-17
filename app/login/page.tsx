'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Anchor, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sessió')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Error de connexió. Intenta-ho de nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Anchor className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">MatePro</h1>
          <p className="mt-1 text-muted-foreground">Organitza, controla, flueix. - Sistema de Gestió</p>
        </div>

        {/* Login form */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Correu electrònic
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuari@matepro.com"
                required
                className="h-11 w-full rounded-lg border border-input bg-input px-4 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                Contrasenya
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 w-full rounded-lg border border-input bg-input px-4 pr-11 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Iniciant sessió...
                </>
              ) : (
                'Iniciar sessió'
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-4">
            <p className="text-center text-sm text-muted-foreground mb-2">
              Mode demo - Credencials de prova:
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => { setEmail('admin@matepro.com'); setPassword('admin123'); }}
                className="w-full rounded-lg bg-muted/50 p-2 text-left text-sm hover:bg-muted transition-colors"
              >
                <span className="font-medium text-foreground">Admin:</span>{' '}
                <span className="text-muted-foreground">admin@matepro.com / admin123</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail('manager@matepro.com'); setPassword('manager123'); }}
                className="w-full rounded-lg bg-muted/50 p-2 text-left text-sm hover:bg-muted transition-colors"
              >
                <span className="font-medium text-foreground">Project Manager:</span>{' '}
                <span className="text-muted-foreground">manager@matepro.com / manager123</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail('operari@matepro.com'); setPassword('operari123'); }}
                className="w-full rounded-lg bg-muted/50 p-2 text-left text-sm hover:bg-muted transition-colors"
              >
                <span className="font-medium text-foreground">Operari:</span>{' '}
                <span className="text-muted-foreground">operari@matepro.com / operari123</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MatePro. Tots els drets reservats.
        </p>
      </div>
    </div>
  )
}
