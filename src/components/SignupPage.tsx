import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, ArrowLeft, Eye, EyeSlash, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SignupPageProps {
  onSignup: (userData: SignupData) => void
  onBack: () => void
  onLoginClick: () => void
}

export interface SignupData {
  email: string
  password: string
  fullName: string
  organization: string
  role: 'analyst' | 'commander' | 'operator' | 'admin'
  clearanceLevel: 'confidential' | 'secret' | 'top-secret'
}

export function SignupPage({ onSignup, onBack, onLoginClick }: SignupPageProps) {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    fullName: '',
    organization: '',
    role: 'analyst',
    clearanceLevel: 'confidential'
  })

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.password) {
        toast.error('Please fill in all required fields')
        return
      }
      if (!formData.email.includes('@')) {
        toast.error('Please enter a valid email address')
        return
      }
      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!formData.fullName || !formData.organization) {
        toast.error('Please fill in all required fields')
        return
      }
      setStep(3)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.role || !formData.clearanceLevel) {
      toast.error('Please complete all security fields')
      return
    }

    setIsLoading(true)
    
    setTimeout(() => {
      onSignup(formData)
      setIsLoading(false)
    }, 1500)
  }

  const updateFormData = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
          onClick={step === 1 ? onBack : () => setStep(step - 1)}
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
            <h1 className="text-2xl font-bold tracking-wider uppercase">Request Access</h1>
            <p className="text-sm text-muted-foreground font-mono mt-2">
              STEP {step} OF 3
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-12 bg-primary' : s < step ? 'w-8 bg-primary/50' : 'w-8 bg-muted'
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wide">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="analyst@organization.mil"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="font-mono"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-mono text-xs uppercase tracking-wide">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="font-mono pr-10"
                      autoComplete="new-password"
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
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full font-mono"
                  size="lg"
                >
                  CONTINUE
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-mono text-xs uppercase tracking-wide">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    className="font-mono"
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization" className="font-mono text-xs uppercase tracking-wide">
                    Organization *
                  </Label>
                  <Input
                    id="organization"
                    type="text"
                    placeholder="US Department of Defense"
                    value={formData.organization}
                    onChange={(e) => updateFormData('organization', e.target.value)}
                    className="font-mono"
                    autoComplete="organization"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full font-mono"
                  size="lg"
                >
                  CONTINUE
                </Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase tracking-wide">
                    Role *
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => updateFormData('role', value)}
                  >
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analyst" className="font-mono">Intelligence Analyst</SelectItem>
                      <SelectItem value="commander" className="font-mono">Operations Commander</SelectItem>
                      <SelectItem value="operator" className="font-mono">System Operator</SelectItem>
                      <SelectItem value="admin" className="font-mono">System Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase tracking-wide">
                    Clearance Level *
                  </Label>
                  <Select
                    value={formData.clearanceLevel}
                    onValueChange={(value) => updateFormData('clearanceLevel', value)}
                  >
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confidential" className="font-mono">CONFIDENTIAL</SelectItem>
                      <SelectItem value="secret" className="font-mono">SECRET</SelectItem>
                      <SelectItem value="top-secret" className="font-mono">TOP SECRET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} weight="fill" className="text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Your request will be reviewed by security personnel</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} weight="fill" className="text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Access approval typically takes 24-48 hours</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full font-mono"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'SUBMITTING REQUEST...' : 'SUBMIT REQUEST'}
                </Button>
              </motion.div>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have access?{' '}
              <button
                onClick={onLoginClick}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign In
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
