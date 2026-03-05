import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Shield, ArrowLeft, Eye, EyeSlash } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface LoginPageProps {
  onLogin: (email: string, password: string) => void
  onBack: () => void
  onSignupClick: () => void
}

export function LoginPage({ onLogin, onBack, onSignupClick }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    
    setTimeout(() => {
      onLogin(email, password)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.25_0.05_240),transparent_50%)] opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.3_0.01_240_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.3_0.01_240_/_0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2 font-mono"
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        <Card className="p-8 bg-card/50 backdrop-blur-xl border-border/50">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
              <Shield size={32} weight="fill" className="text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-wider uppercase">Sign In</h1>
            <p className="text-sm text-muted-foreground font-mono mt-2">
              AUTHORIZED ACCESS REQUIRED
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wide">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="analyst@sentinel.mil"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-mono"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono text-xs uppercase tracking-wide">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-mono pr-10"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlash size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-mono"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'AUTHENTICATING...' : 'SIGN IN'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Don't have access?{' '}
              <button
                onClick={onSignupClick}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Request Access
              </button>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
              Classified System // Secure Connection
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
