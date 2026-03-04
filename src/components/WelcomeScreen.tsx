import { Button } from '@/components/ui/button'
import { Sparkle, Image as ImageIcon, Palette, Code } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface WelcomeScreenProps {
  onExampleClick: (prompt: string) => void
}

const examples = [
  {
    icon: ImageIcon,
    title: 'Design Critique',
    prompt: 'Analyze this design and provide feedback on color contrast, typography hierarchy, and overall visual balance.',
    color: 'bg-blue-500/10 text-blue-600'
  },
  {
    icon: Palette,
    title: 'Design Ideation',
    prompt: 'Help me design a modern fitness tracking app. I want it to feel energetic and motivational.',
    color: 'bg-purple-500/10 text-purple-600'
  },
  {
    icon: Code,
    title: 'Code Generation',
    prompt: 'Generate Tailwind CSS code for a glassmorphism card component with a subtle gradient background.',
    color: 'bg-green-500/10 text-green-600'
  }
]

export function WelcomeScreen({ onExampleClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-2xl"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6">
          <Sparkle size={32} weight="fill" className="text-white md:w-10 md:h-10" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          Gradient AI Design Studio
        </h1>
        
        <p className="text-base md:text-lg text-muted-foreground mb-12 leading-relaxed">
          Get instant, intelligent feedback on your UI/UX designs powered by DigitalOcean's Gradient AI.
          Receive expert critiques, explore creative directions, and generate production-ready code.
        </p>
        
        <div className="grid gap-4 md:gap-6 md:grid-cols-3 mb-8">
          {examples.map((example, index) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
            >
              <Button
                variant="outline"
                className="h-auto w-full flex flex-col items-start gap-3 p-4 md:p-6 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                onClick={() => onExampleClick(example.prompt)}
              >
                <div className={`w-10 h-10 rounded-lg ${example.color} flex items-center justify-center`}>
                  <example.icon size={20} weight="bold" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm mb-1">{example.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {example.prompt.substring(0, 60)}...
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground">
          Or start typing your own message below
        </p>
      </motion.div>
    </div>
  )
}
