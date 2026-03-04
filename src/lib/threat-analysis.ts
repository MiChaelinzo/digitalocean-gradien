export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info' | 'none'

interface ThreatKeywords {
  critical: string[]
  high: string[]
  medium: string[]
  low: string[]
  info: string[]
}

const threatKeywords: ThreatKeywords = {
  critical: [
    'imminent', 'immediate threat', 'critical alert', 'missile launch', 'nuclear', 
    'hypersonic', 'ballistic missile', 'attack detected', 'red alert', 'emergency response',
    'active engagement', 'incoming', 'strike imminent', 'defcon', 'war declared',
    'active shooter', 'explosion', 'casualty', 'urgent evacuation'
  ],
  high: [
    'high priority', 'escalating', 'hostile', 'armed conflict', 'military buildup',
    'troop movement', 'fighter jet', 'bomber', 'naval assets', 'combat ready',
    'heightened alert', 'defensive posture', 'mobilization', 'air raid', 'missile defense',
    'cyber attack', 'infiltration', 'breach detected', 'drone swarm'
  ],
  medium: [
    'monitoring', 'elevated tension', 'surveillance', 'reconnaissance', 'patrol',
    'border incident', 'diplomatic crisis', 'sanctions', 'military exercise',
    'threat assessment', 'intelligence gathering', 'warning', 'potential threat',
    'suspicious activity', 'unidentified', 'tracking', 'investigation'
  ],
  low: [
    'routine patrol', 'standard operation', 'all clear', 'no immediate threat',
    'stable situation', 'de-escalation', 'peace talks', 'diplomatic solution',
    'normal operations', 'low risk', 'minimal threat', 'secure', 'cleared'
  ],
  info: [
    'update', 'report', 'briefing', 'status', 'assessment', 'analysis',
    'recommendation', 'strategy', 'tactical', 'operational', 'intelligence',
    'information', 'data', 'metrics', 'statistics'
  ]
}

export interface ThreatAnalysis {
  severity: ThreatSeverity
  keywords: string[]
  confidence: number
}

export function analyzeThreatSeverity(content: string): ThreatAnalysis {
  const lowerContent = content.toLowerCase()
  const foundKeywords: string[] = []
  let severity: ThreatSeverity = 'none'
  let maxScore = 0

  const severityOrder: ThreatSeverity[] = ['critical', 'high', 'medium', 'low', 'info']
  const severityScores = { critical: 5, high: 4, medium: 3, low: 2, info: 1, none: 0 }

  for (const level of severityOrder) {
    if (level === 'none') continue
    const keywords = threatKeywords[level as keyof ThreatKeywords]
    const matches = keywords.filter((keyword: string) => lowerContent.includes(keyword))
    
    if (matches.length > 0) {
      foundKeywords.push(...matches)
      const score = severityScores[level] * matches.length
      
      if (score > maxScore) {
        maxScore = score
        severity = level
      }
    }
  }

  const confidence = Math.min(100, maxScore * 10)

  return {
    severity,
    keywords: [...new Set(foundKeywords)],
    confidence
  }
}

export function getSeverityColor(severity: ThreatSeverity): string {
  switch (severity) {
    case 'critical':
      return 'text-destructive border-destructive'
    case 'high':
      return 'text-warning border-warning'
    case 'medium':
      return 'text-accent border-accent'
    case 'low':
      return 'text-success border-success'
    case 'info':
      return 'text-primary border-primary'
    default:
      return 'text-muted-foreground border-border'
  }
}

export function getSeverityBgColor(severity: ThreatSeverity): string {
  switch (severity) {
    case 'critical':
      return 'bg-destructive/10 border-destructive/50'
    case 'high':
      return 'bg-warning/10 border-warning/50'
    case 'medium':
      return 'bg-accent/10 border-accent/50'
    case 'low':
      return 'bg-success/10 border-success/50'
    case 'info':
      return 'bg-primary/10 border-primary/50'
    default:
      return ''
  }
}

export function getSeverityLabel(severity: ThreatSeverity): string {
  switch (severity) {
    case 'critical':
      return 'CRITICAL'
    case 'high':
      return 'HIGH'
    case 'medium':
      return 'MEDIUM'
    case 'low':
      return 'LOW'
    case 'info':
      return 'INFO'
    default:
      return 'NONE'
  }
}
