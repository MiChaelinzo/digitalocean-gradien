import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, User, Warning, Info, CheckCircle, ShieldWarning, Siren } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { analyzeThreatSeverity, getSeverityColor, getSeverityBgColor, getSeverityLabel, type ThreatSeverity } from '@/lib/threat-analysis'
import { useMemo } from 'react'

interface IntelligenceBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  isStreaming?: boolean
}

function getSeverityIcon(severity: ThreatSeverity) {
  switch (severity) {
    case 'critical':
      return <Siren size={14} weight="fill" />
    case 'high':
      return <ShieldWarning size={14} weight="fill" />
    case 'medium':
      return <Warning size={14} weight="fill" />
    case 'low':
      return <CheckCircle size={14} weight="fill" />
    case 'info':
      return <Info size={14} weight="fill" />
    default:
      return null
  }
}

export function IntelligenceBubble({ role, content, timestamp, isStreaming }: IntelligenceBubbleProps) {
  const isUser = role === 'user'
  
  const threatAnalysis = useMemo(() => {
    if (!isUser && !isStreaming) {
      return analyzeThreatSeverity(content)
    }
    return null
  }, [content, isUser, isStreaming])

  const showSeverityIndicator = threatAnalysis && threatAnalysis.severity !== 'none' && !isUser
  
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
        {showSeverityIndicator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="mb-2"
          >
            <Badge 
              variant="outline" 
              className={cn(
                'gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border',
                getSeverityBgColor(threatAnalysis.severity),
                getSeverityColor(threatAnalysis.severity),
                threatAnalysis.severity === 'critical' && 'severity-pulse'
              )}
            >
              {getSeverityIcon(threatAnalysis.severity)}
              {getSeverityLabel(threatAnalysis.severity)}
            </Badge>
          </motion.div>
        )}
        
        <Card className={cn(
          'p-4 md:p-5',
          isUser 
            ? 'bg-secondary border-border' 
            : showSeverityIndicator 
              ? cn('bg-card', getSeverityBgColor(threatAnalysis!.severity))
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
        
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs text-muted-foreground border-none bg-transparent font-mono">
            {timestamp}
          </Badge>
          
          {showSeverityIndicator && threatAnalysis.keywords.length > 0 && (
            <Badge variant="outline" className="text-[10px] text-muted-foreground/70 border-none bg-transparent font-mono uppercase">
              {threatAnalysis.keywords.length} indicator{threatAnalysis.keywords.length > 1 ? 's' : ''} detected
            </Badge>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-secondary flex items-center justify-center border border-border">
          <User size={18} weight="fill" className="text-secondary-foreground" />
        </div>
      )}
    </motion.div>
  )
}
