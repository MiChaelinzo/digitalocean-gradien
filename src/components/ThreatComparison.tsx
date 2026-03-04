import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { X, ArrowsLeftRight, CheckCircle, Warning, Target } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface ThreatData {
  id: string
  name: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: string
  distance: number
  speed: number
  altitude?: number
  detected: string
  description: string
}

interface ThreatComparisonProps {
  isOpen: boolean
  onClose: () => void
  threats: ThreatData[]
}

export function ThreatComparison({ isOpen, onClose, threats }: ThreatComparisonProps) {
  const [selectedThreats, setSelectedThreats] = useState<string[]>([])

  const toggleThreatSelection = (id: string) => {
    setSelectedThreats(prev => {
      if (prev.includes(id)) {
        return prev.filter(t => t !== id)
      } else if (prev.length < 3) {
        return [...prev, id]
      } else {
        return prev
      }
    })
  }

  const compareSelectedThreats = threats.filter(t => selectedThreats.includes(t.id))

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive border-destructive/50 bg-destructive/10'
      case 'high': return 'text-warning border-warning/50 bg-warning/10'
      case 'medium': return 'text-primary border-primary/50 bg-primary/10'
      case 'low': return 'text-success border-success/50 bg-success/10'
      default: return 'text-muted-foreground'
    }
  }

  const getSeverityScore = (severity: string) => {
    switch (severity) {
      case 'critical': return 100
      case 'high': return 75
      case 'medium': return 50
      case 'low': return 25
      default: return 0
    }
  }

  const getComparisonMetric = (threat: ThreatData, metric: string) => {
    switch (metric) {
      case 'severity': return getSeverityScore(threat.severity)
      case 'distance': return Math.max(0, 100 - (threat.distance / 10))
      case 'speed': return Math.min(100, (threat.speed / 100))
      case 'altitude': return threat.altitude ? Math.min(100, (threat.altitude / 1000)) : 0
      default: return 0
    }
  }

  const metrics = [
    { key: 'severity', label: 'Threat Severity', unit: '' },
    { key: 'distance', label: 'Proximity Threat', unit: 'km' },
    { key: 'speed', label: 'Speed Factor', unit: 'km/h' },
    { key: 'altitude', label: 'Altitude Factor', unit: 'ft' }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-7xl max-h-[90vh]"
        >
          <Card className="bg-card/95 backdrop-blur-md border-primary/30">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-primary/20 border border-primary/50 flex items-center justify-center">
                  <ArrowsLeftRight size={20} weight="bold" className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold uppercase tracking-wide">Threat Comparison Analysis</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {selectedThreats.length}/3 THREATS SELECTED • COMPARE UP TO 3
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X size={20} />
              </Button>
            </div>

            <ScrollArea className="h-[calc(90vh-180px)]">
              <div className="p-6">
                {selectedThreats.length === 0 ? (
                  <div className="mb-6">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ArrowsLeftRight size={64} weight="thin" className="text-muted-foreground mb-4" />
                      <h4 className="text-lg font-semibold mb-2">Select Threats to Compare</h4>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Choose up to 3 threats from the list below to analyze and compare their characteristics side-by-side.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {compareSelectedThreats.map((threat) => (
                        <Card key={threat.id} className="p-4 border-primary/50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm uppercase tracking-wide mb-1">
                                {threat.name}
                              </h4>
                              <p className="text-xs text-muted-foreground font-mono">
                                {threat.type}
                              </p>
                            </div>
                            <Badge className={`text-xs font-mono uppercase ${getSeverityColor(threat.severity)}`}>
                              {threat.severity}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-xs font-mono">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Distance:</span>
                              <span className="font-semibold">{threat.distance} km</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Speed:</span>
                              <span className="font-semibold">{threat.speed} km/h</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Altitude:</span>
                              <span className="font-semibold">{threat.altitude?.toLocaleString() || 'N/A'} ft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <span className="font-semibold uppercase">{threat.status}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Card className="p-6 bg-muted/30 border-primary/30">
                      <h4 className="text-sm font-semibold uppercase tracking-wide mb-4 flex items-center gap-2">
                        <Target size={16} weight="fill" className="text-primary" />
                        Comparative Threat Analysis
                      </h4>
                      
                      <div className="space-y-6">
                        {metrics.map((metric) => (
                          <div key={metric.key}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono uppercase text-muted-foreground">
                                {metric.label}
                              </span>
                              {metric.unit && (
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  UNIT: {metric.unit}
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              {compareSelectedThreats.map((threat) => {
                                const value = getComparisonMetric(threat, metric.key)
                                const actualValue = metric.key === 'distance' ? threat.distance :
                                                  metric.key === 'speed' ? threat.speed :
                                                  metric.key === 'altitude' ? threat.altitude :
                                                  getSeverityScore(threat.severity)
                                
                                return (
                                  <div key={threat.id}>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-mono">
                                        {threat.name.length > 25 ? threat.name.slice(0, 25) + '...' : threat.name}
                                      </span>
                                      <span className="text-xs font-mono font-semibold">
                                        {metric.key === 'severity' ? threat.severity.toUpperCase() : 
                                         `${actualValue}${metric.unit ? ' ' + metric.unit : ''}`}
                                      </span>
                                    </div>
                                    <Progress 
                                      value={value} 
                                      className={`h-2 ${
                                        threat.severity === 'critical' ? '[&>div]:bg-destructive' :
                                        threat.severity === 'high' ? '[&>div]:bg-warning' :
                                        '[&>div]:bg-primary'
                                      }`}
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4 bg-primary/10 border-primary/50">
                      <div className="flex items-start gap-3">
                        <CheckCircle size={20} weight="fill" className="text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Comparative Assessment</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {compareSelectedThreats.filter(t => t.severity === 'critical').length > 0 ? (
                              <>
                                <strong className="text-destructive">{compareSelectedThreats.filter(t => t.severity === 'critical').length} CRITICAL threat(s)</strong> require immediate attention. 
                                Highest priority: <strong>{compareSelectedThreats.sort((a, b) => getSeverityScore(b.severity) - getSeverityScore(a.severity))[0].name}</strong>.
                              </>
                            ) : (
                              <>
                                All selected threats are under monitoring. 
                                Highest priority: <strong>{compareSelectedThreats.sort((a, b) => getSeverityScore(b.severity) - getSeverityScore(a.severity))[0].name}</strong> ({compareSelectedThreats[0].severity.toUpperCase()}).
                              </>
                            )}
                            {' '}Closest threat is <strong>{compareSelectedThreats.sort((a, b) => a.distance - b.distance)[0].name}</strong> at {compareSelectedThreats.sort((a, b) => a.distance - b.distance)[0].distance} km.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide mb-3">Available Threats</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {threats.map((threat) => {
                      const isSelected = selectedThreats.includes(threat.id)
                      const canSelect = selectedThreats.length < 3 || isSelected
                      
                      return (
                        <Card
                          key={threat.id}
                          onClick={() => canSelect && toggleThreatSelection(threat.id)}
                          className={`p-4 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/10' 
                              : canSelect 
                                ? 'hover:border-primary/50' 
                                : 'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-xs uppercase tracking-wide truncate">
                                {threat.name}
                              </h5>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                {threat.type}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge className={`text-[10px] font-mono uppercase ${getSeverityColor(threat.severity)}`}>
                                {threat.severity}
                              </Badge>
                              {isSelected && (
                                <CheckCircle size={16} weight="fill" className="text-primary" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {threat.description}
                          </p>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-mono">
                {selectedThreats.length === 0 
                  ? 'Select threats to begin comparison analysis'
                  : `${selectedThreats.length} threat${selectedThreats.length > 1 ? 's' : ''} selected for comparison`
                }
              </p>
              {selectedThreats.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedThreats([])}
                  className="gap-2 font-mono uppercase text-xs"
                >
                  <X size={14} />
                  Clear Selection
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
