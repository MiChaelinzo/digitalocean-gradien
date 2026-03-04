import { Button } from '@/components/ui/button'
import { Shield, Target, Rocket, Globe } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface WelcomeScreenProps {
  onExampleClick: (prompt: string) => void
}

const examples = [
  {
    icon: Target,
    title: 'Threat Analysis',
    prompt: 'Analyze current hypersonic missile threats in the Middle East theater and recommend defensive countermeasures.',
    color: 'bg-destructive/20 text-destructive'
  },
  {
    icon: Globe,
    title: 'Conflict Assessment',
    prompt: 'Provide strategic intelligence on GCC-Iran tensions including naval positioning and escalation probability.',
    color: 'bg-warning/20 text-warning'
  },
  {
    icon: Rocket,
    title: 'Defense Strategy',
    prompt: 'Outline defensive protocols for ballistic missile attack scenario targeting Israel with response timeline.',
    color: 'bg-primary/20 text-primary'
  }
]

export function WelcomeScreen({ onExampleClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-3xl"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-md bg-primary/20 border-2 border-primary mb-6">
          <Shield size={32} weight="fill" className="text-primary md:w-10 md:h-10" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-wide uppercase">
          SENTINEL Intelligence Platform
        </h1>
        
        <p className="text-sm md:text-base text-muted-foreground mb-10 leading-relaxed font-mono">
          Advanced military intelligence and defense monitoring powered by DigitalOcean Gradient™ AI.
          Real-time threat detection, strategic analysis, and tactical recommendations.
        </p>
        
        <div className="grid gap-3 md:gap-4 md:grid-cols-3 mb-8">
          {examples.map((example, index) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
            >
              <Button
                variant="outline"
                className="h-auto w-full flex flex-col items-start gap-3 p-4 md:p-5 hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left"
                onClick={() => onExampleClick(example.prompt)}
              >
                <div className={`w-10 h-10 rounded-md ${example.color} flex items-center justify-center border border-current/30`}>
                  <example.icon size={20} weight="fill" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs uppercase tracking-wider mb-1.5">{example.title}</div>
                  <div className="text-xs text-foreground leading-[1.6] font-mono line-clamp-3">
                    {example.prompt}
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
          CLASSIFIED // QUERY INTELLIGENCE SYSTEM BELOW
        </p>
      </motion.div>
    </div>
  )
}
