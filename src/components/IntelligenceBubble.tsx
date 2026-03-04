import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, User } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface IntelligenceBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  isStreaming?: boolean
}

export function IntelligenceBubble({ role, content, timestamp, isStreaming }: IntelligenceBubbleProps) {
  const isUser = role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary flex items-center justify-center border border-primary/50">
          <Shield size={18} weight="fill" className="text-primary-foreground" />
        </div>
      )}
      
      <div className={cn('flex flex-col max-w-[85%] md:max-w-[75%]', isUser && 'items-end')}>
        <Card className={cn(
          'p-4 md:p-5',
          isUser 
            ? 'bg-secondary border-border' 
            : 'bg-card border-primary/30'
        )}>
          <div className={cn(
            'whitespace-pre-wrap break-words font-mono text-sm md:text-[15px] leading-relaxed',
            isUser ? 'text-foreground' : 'text-foreground'
          )}>
            {content}
            {isStreaming && (
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block ml-1"
              >
                ▋
              </motion.span>
            )}
          </div>
        </Card>
        
        <Badge variant="outline" className="mt-2 text-xs text-muted-foreground border-none bg-transparent font-mono">
          {timestamp}
        </Badge>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-secondary flex items-center justify-center border border-border">
          <User size={18} weight="fill" className="text-secondary-foreground" />
        </div>
      )}
    </motion.div>
  )
}
