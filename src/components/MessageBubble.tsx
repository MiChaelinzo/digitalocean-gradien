import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkle, User } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  isStreaming?: boolean
}

export function MessageBubble({ role, content, timestamp, isStreaming }: MessageBubbleProps) {
  const isUser = role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Sparkle size={18} weight="fill" className="text-primary-foreground" />
        </div>
      )}
      
      <div className={cn('flex flex-col max-w-[85%] md:max-w-[70%]', isUser && 'items-end')}>
        <Card className={cn(
          'p-4 md:p-6',
          isUser 
            ? 'bg-accent text-accent-foreground' 
            : 'bg-card text-card-foreground'
        )}>
          <div className={cn(
            'whitespace-pre-wrap break-words',
            isUser ? 'text-[15px] md:text-base' : 'text-[15px] md:text-base leading-relaxed'
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
        
        <Badge variant="outline" className="mt-2 text-xs text-muted-foreground border-none bg-transparent">
          {timestamp}
        </Badge>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User size={18} weight="fill" className="text-secondary-foreground" />
        </div>
      )}
    </motion.div>
  )
}
