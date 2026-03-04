export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info' | 'none'

export interface ThreatAnalysis {
  severity: ThreatSeverity
  keywords: string[]
  confidence: number
}

const SEVERITY_KEYWORDS = {
  critical: [
    'critical',
    'immediate threat',
    'imminent',
    'nuclear',
    'ballistic missile',
    'icbm',
    'wmd',
    'mass casualty',
    'catastrophic',
    'emergency',
    'defcon',
    'hostile launch',
    'incoming',
    'hypersonic missile',
    'strike imminent',
    'attack in progress'
  ],
  high: [
    'severe',
    'urgent',
    'high priority',
    'hostile',
    'enemy',
    'missile',
    'airstrike',
    'combat',
    'offensive',
    'invasion',
    'escalation',
    'military buildup',
    'aggressive',
    'threat level high',
    'countermeasures required',
    'defensive action',
    'scramble'
  ],
  medium: [
    'elevated',
    'moderate',
    'monitor',
    'surveillance',
    'patrol',
    'reconnaissance',
    'suspicious',
    'unusual activity',
    'increased activity',
    'potential threat',
    'caution',
    'alert',
    'watch',
    'standby'
  ],
  low: [
    'minimal',
    'routine',
    'standard',
    'normal',
    'peaceful',
    'training',
    'exercise',
    'low risk',
    'stable',
    'calm',
    'baseline'
  ],
  info: [
    'information',
    'update',
    'report',
    'briefing',
    'status',
    'overview',
    'summary',
    'analysis',
    'assessment',
    'intelligence'
  ]
}

export function analyzeThreatSeverity(content: string): ThreatAnalysis {
  const lowerContent = content.toLowerCase()
  const foundKeywords: string[] = []
  const severityScores: Record<ThreatSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
    none: 0
  }

  for (const [severity, keywords] of Object.entries(SEVERITY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        severityScores[severity as ThreatSeverity]++
        foundKeywords.push(keyword)
      }
    }
  }

  let maxScore = 0
  let detectedSeverity: ThreatSeverity = 'none'

  const priorityOrder: ThreatSeverity[] = ['critical', 'high', 'medium', 'low', 'info']
  
  for (const severity of priorityOrder) {
    if (severityScores[severity] > maxScore) {
      maxScore = severityScores[severity]
      detectedSeverity = severity
    }
  }

  const totalMatches = Object.values(severityScores).reduce((a, b) => a + b, 0)
  const confidence = totalMatches > 0 ? Math.min((maxScore / totalMatches) * 100, 100) : 0

  return {
    severity: detectedSeverity,
    keywords: foundKeywords,
    confidence
  }
}

export function getSeverityColor(severity: ThreatSeverity): string {
  switch (severity) {
    case 'critical':
      return 'text-destructive'
    case 'high':
      return 'text-warning'
    case 'medium':
      return 'text-accent'
    case 'low':
      return 'text-success'
    case 'info':
      return 'text-primary'
    default:
      return 'text-muted-foreground'
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
      return 'bg-card/10 border-border/50'
  }
}

export function getSeverityLabel(severity: ThreatSeverity): string {
  switch (severity) {
    case 'critical':
      return 'CRITICAL THREAT'
    case 'high':
      return 'HIGH PRIORITY'
    case 'medium':
      return 'ELEVATED ALERT'
    case 'low':
      return 'LOW RISK'
    case 'info':
      return 'INFORMATION'
    default:
      return 'STANDARD'
  }
}
