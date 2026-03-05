import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Shield, Globe, Target, ChartLine, CheckCircle, ArrowRight } from '@phosphor-icons/react'

interface OnboardingFlowProps {
  onComplete: () => void
  userName: string
  userRole: string
}

export function OnboardingFlow({ onComplete, userName, userRole }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      icon: Shield,
      title: 'Welcome to SENTINEL',
      description: `Welcome, ${userName}. You have been granted access to the SENTINEL military intelligence platform as ${userRole}.`,
      features: [
        'Real-time threat monitoring',
        'AI-powered intelligence analysis',
        'Strategic defense recommendations',
        'Global conflict tracking'
      ]
    },
    {
      icon: Globe,
      title: '3D Globe Visualization',
      description: 'Monitor threats on an interactive 3D globe with real-time tracking of missiles, aircraft, drones, and UAPs.',
      features: [
        'Rotate and zoom to any location',
        'View threat trajectories in 3D',
        'Track multiple threats simultaneously',
        'Access detailed threat information'
      ]
    },
    {
      icon: Target,
      title: 'Threat Dashboard',
      description: 'Access comprehensive threat analysis with severity indicators, status updates, and tactical details.',
      features: [
        'Filter by threat type and severity',
        'Real-time status updates',
        'Detailed threat specifications',
        'Strategic countermeasures'
      ]
    },
    {
      icon: ChartLine,
      title: 'Intelligence Chat',
      description: 'Query the AI analyst for threat assessments, strategic recommendations, and conflict analysis.',
      features: [
        'Natural language queries',
        'Voice input support',
        'Contextual threat analysis',
        'Export intelligence reports'
      ]
    }
  ]

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.25_0.05_240),transparent_50%)] opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.3_0.01_240_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.3_0.01_240_/_0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="w-full max-w-2xl relative z-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="font-mono text-xs">
              STEP {currentStep + 1} OF {steps.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="font-mono text-xs"
            >
              Skip Tutorial
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-xl border-border/50">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                  <currentStepData.icon size={40} weight="fill" className="text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{currentStepData.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {currentStepData.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 bg-muted/30 rounded-lg p-4"
                  >
                    <CheckCircle size={20} weight="fill" className="text-success flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1 font-mono"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  size="lg"
                  onClick={handleNext}
                  className={`gap-2 font-mono ${currentStep === 0 ? 'flex-1' : 'flex-1'}`}
                >
                  {currentStep === steps.length - 1 ? 'Access Platform' : 'Continue'}
                  <ArrowRight size={18} weight="bold" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
            Powered by DigitalOcean Gradient™ AI
          </p>
        </div>
      </div>
    </div>
  )
}
