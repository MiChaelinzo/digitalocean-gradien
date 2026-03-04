import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Bell, 
  BellSlash, 
  Warning, 
  Rocket, 
  Shield,
  X,
  CheckCircle,
  Target,
  Airplane,
  Eye
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export interface ThreatNotification {
  id: string
  type: 'missile' | 'aircraft' | 'drone' | 'uap' | 'cyber' | 'naval'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  location: string
  distance: number
  timestamp: Date
  acknowledged: boolean
  dismissed: boolean
}

interface ThreatNotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ThreatNotificationPanel({ isOpen, onClose }: ThreatNotificationPanelProps) {
  const [notifications, setNotifications] = useKV<ThreatNotification[]>('threat-notifications', [])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low' | 'unacknowledged'>('all')

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'missile': return <Rocket weight="fill" size={18} />
      case 'aircraft': return <Airplane weight="fill" size={18} />
      case 'drone': return <Target weight="fill" size={18} />
      case 'uap': return <Eye weight="fill" size={18} />
      case 'cyber': return <Shield weight="fill" size={18} />
      default: return <Warning weight="fill" size={18} />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-destructive bg-destructive/10 text-destructive'
      case 'high': return 'border-warning bg-warning/10 text-warning'
      case 'medium': return 'border-primary bg-primary/10 text-primary'
      case 'low': return 'border-success bg-success/10 text-success'
      default: return 'border-muted bg-muted/10 text-muted-foreground'
    }
  }

  const acknowledgeNotification = (id: string) => {
    setNotifications(current =>
      (current || []).map(n => n.id === id ? { ...n, acknowledged: true } : n)
    )
    toast.success('Threat acknowledged')
  }

  const dismissNotification = (id: string) => {
    setNotifications(current =>
      (current || []).map(n => n.id === id ? { ...n, dismissed: true } : n)
    )
  }

  const clearAllAcknowledged = () => {
    setNotifications(current => (current || []).filter(n => !n.acknowledged))
    toast.success('Cleared acknowledged threats')
  }

  const getFilteredNotifications = () => {
    let filtered = (notifications || []).filter(n => !n.dismissed)
    
    if (filter === 'critical') {
      filtered = filtered.filter(n => n.severity === 'critical')
    } else if (filter === 'high') {
      filtered = filtered.filter(n => n.severity === 'high')
    } else if (filter === 'medium') {
      filtered = filtered.filter(n => n.severity === 'medium')
    } else if (filter === 'low') {
      filtered = filtered.filter(n => n.severity === 'low')
    } else if (filter === 'unacknowledged') {
      filtered = filtered.filter(n => !n.acknowledged)
    }
    
    return filtered.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity]
      if (severityDiff !== 0) return severityDiff
      return b.timestamp.getTime() - a.timestamp.getTime()
    })
  }

  const filteredNotifications = getFilteredNotifications()
  const criticalCount = (notifications || []).filter(n => !n.dismissed && n.severity === 'critical').length
  const highCount = (notifications || []).filter(n => !n.dismissed && n.severity === 'high').length
  const mediumCount = (notifications || []).filter(n => !n.dismissed && n.severity === 'medium').length
  const lowCount = (notifications || []).filter(n => !n.dismissed && n.severity === 'low').length
  const unacknowledgedCount = (notifications || []).filter(n => !n.dismissed && !n.acknowledged).length

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <Card className="border-2 border-destructive/50 bg-card shadow-2xl flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between bg-destructive/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/20 border-2 border-destructive flex items-center justify-center">
                <Bell weight="fill" size={20} className="text-destructive" />
              </div>
              <div>
                <h2 className="font-bold text-lg uppercase tracking-wide">Threat Alerts</h2>
                <p className="text-xs text-muted-foreground font-mono">
                  {criticalCount} CRITICAL // {unacknowledgedCount} UNACK
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="gap-2 font-mono text-xs"
              >
                {soundEnabled ? (
                  <>
                    <Bell size={16} weight="fill" />
                    <span className="hidden sm:inline">Sound On</span>
                  </>
                ) : (
                  <>
                    <BellSlash size={16} weight="fill" />
                    <span className="hidden sm:inline">Sound Off</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="gap-2"
              >
                <X size={16} weight="bold" />
              </Button>
            </div>
          </div>

          <div className="p-4 border-b border-border bg-secondary/30">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase">
                <Target size={14} weight="fill" />
                <span>Filter by Severity</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className="cursor-pointer text-xs font-mono uppercase px-3 py-1.5 transition-all hover:scale-105 select-none"
                >
                  All ({(notifications || []).filter(n => !n.dismissed).length})
                </Badge>
                
                <Badge
                  variant={filter === 'critical' ? 'default' : 'outline'}
                  onClick={() => setFilter('critical')}
                  className={`cursor-pointer text-xs font-mono uppercase px-3 py-1.5 transition-all hover:scale-105 select-none ${
                    filter !== 'critical' ? 'border-destructive text-destructive hover:bg-destructive/10' : 'bg-destructive border-destructive'
                  }`}
                >
                  Critical ({criticalCount})
                </Badge>
                
                <Badge
                  variant={filter === 'high' ? 'default' : 'outline'}
                  onClick={() => setFilter('high')}
                  className={`cursor-pointer text-xs font-mono uppercase px-3 py-1.5 transition-all hover:scale-105 select-none ${
                    filter !== 'high' ? 'border-warning text-warning hover:bg-warning/10' : 'bg-warning border-warning'
                  }`}
                >
                  High ({highCount})
                </Badge>
                
                <Badge
                  variant={filter === 'medium' ? 'default' : 'outline'}
                  onClick={() => setFilter('medium')}
                  className={`cursor-pointer text-xs font-mono uppercase px-3 py-1.5 transition-all hover:scale-105 select-none ${
                    filter !== 'medium' ? 'border-primary text-primary hover:bg-primary/10' : 'bg-primary border-primary'
                  }`}
                >
                  Medium ({mediumCount})
                </Badge>
                
                <Badge
                  variant={filter === 'low' ? 'default' : 'outline'}
                  onClick={() => setFilter('low')}
                  className={`cursor-pointer text-xs font-mono uppercase px-3 py-1.5 transition-all hover:scale-105 select-none ${
                    filter !== 'low' ? 'border-success text-success hover:bg-success/10' : 'bg-success border-success'
                  }`}
                >
                  Low ({lowCount})
                </Badge>
                
                <Badge
                  variant={filter === 'unacknowledged' ? 'default' : 'outline'}
                  onClick={() => setFilter('unacknowledged')}
                  className="cursor-pointer text-xs font-mono uppercase px-3 py-1.5 transition-all hover:scale-105 select-none border-accent text-accent hover:bg-accent/10"
                >
                  <Bell size={12} weight="fill" className="mr-1" />
                  Unack ({unacknowledgedCount})
                </Badge>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllAcknowledged}
                  className="text-xs font-mono h-8"
                  disabled={(notifications || []).filter(n => n.acknowledged && !n.dismissed).length === 0}
                >
                  Clear Acknowledged
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Shield size={48} weight="fill" className="text-success mb-4" />
                <h3 className="font-semibold text-lg mb-2">All Clear</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  No active threat notifications
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-4 rounded-lg border-2 ${getSeverityColor(notification.severity)} ${
                        !notification.acknowledged && notification.severity === 'critical' 
                          ? 'pulse-glow' 
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-0.5">
                            {getThreatIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-sm uppercase tracking-wide">
                                {notification.title}
                              </h4>
                              <Badge 
                                variant="outline" 
                                className={`text-[10px] font-mono ${getSeverityColor(notification.severity)}`}
                              >
                                {notification.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground mb-2">
                              {notification.description}
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs font-mono text-muted-foreground">
                              <span>📍 {notification.location}</span>
                              <span>📏 {notification.distance} km</span>
                              <span>🕐 {new Date(notification.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissNotification(notification.id)}
                          className="h-8 w-8 p-0"
                        >
                          <X size={16} />
                        </Button>
                      </div>

                      {!notification.acknowledged && (
                        <>
                          <Separator className="my-3" />
                          <Button
                            size="sm"
                            onClick={() => acknowledgeNotification(notification.id)}
                            className="w-full gap-2 font-mono text-xs"
                          >
                            <CheckCircle size={16} weight="fill" />
                            Acknowledge Threat
                          </Button>
                        </>
                      )}
                      
                      {notification.acknowledged && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-success font-mono">
                          <CheckCircle size={14} weight="fill" />
                          <span>ACKNOWLEDGED</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </ScrollArea>
        </Card>
      </motion.div>
    </motion.div>
  )
}
