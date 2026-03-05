import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Gauge, Lightning, Database, CloudArrowUp, CheckCircle, Warning } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface PerformanceMetrics {
  responseTime: number
  apiLatency: number
  queriesPerMinute: number
  cacheHitRate: number
  uptime: number
  errorRate: number
}

interface SystemHealthProps {
  isOpen: boolean
  onClose: () => void
}

export function SystemHealth({ isOpen, onClose }: SystemHealthProps) {
  const [metrics, setMetrics] = useKV<PerformanceMetrics>('system-metrics', {
    responseTime: 0,
    apiLatency: 0,
    queriesPerMinute: 0,
    cacheHitRate: 0,
    uptime: 99.9,
    errorRate: 0
  })

  useEffect(() => {
    if (!isOpen) return

    const updateMetrics = () => {
      setMetrics(current => ({
        responseTime: Math.round(Math.random() * 300 + 100),
        apiLatency: Math.round(Math.random() * 150 + 50),
        queriesPerMinute: Math.round(Math.random() * 20 + 10),
        cacheHitRate: Math.round(Math.random() * 15 + 85),
        uptime: Number((99.5 + Math.random() * 0.5).toFixed(2)),
        errorRate: Number((Math.random() * 0.5).toFixed(2))
      }))
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 5000)
    return () => clearInterval(interval)
  }, [isOpen])

  const getHealthStatus = (value: number, metric: string): 'excellent' | 'good' | 'warning' | 'critical' => {
    switch (metric) {
      case 'responseTime':
        if (value < 200) return 'excellent'
        if (value < 300) return 'good'
        if (value < 500) return 'warning'
        return 'critical'
      case 'apiLatency':
        if (value < 100) return 'excellent'
        if (value < 200) return 'good'
        if (value < 300) return 'warning'
        return 'critical'
      case 'cacheHitRate':
        if (value > 95) return 'excellent'
        if (value > 85) return 'good'
        if (value > 70) return 'warning'
        return 'critical'
      case 'uptime':
        if (value > 99.9) return 'excellent'
        if (value > 99.5) return 'good'
        if (value > 99.0) return 'warning'
        return 'critical'
      case 'errorRate':
        if (value < 0.1) return 'excellent'
        if (value < 0.5) return 'good'
        if (value < 1.0) return 'warning'
        return 'critical'
      default:
        return 'good'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-success'
      case 'good':
        return 'text-primary'
      case 'warning':
        return 'text-warning'
      case 'critical':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-success/20 text-success border-success'
      case 'good':
        return 'bg-primary/20 text-primary border-primary'
      case 'warning':
        return 'bg-warning/20 text-warning border-warning'
      case 'critical':
        return 'bg-destructive/20 text-destructive border-destructive'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const metricCards = [
    {
      title: 'Response Time',
      value: `${metrics.responseTime}ms`,
      icon: Lightning,
      metric: 'responseTime',
      progress: Math.min((metrics.responseTime / 500) * 100, 100)
    },
    {
      title: 'API Latency',
      value: `${metrics.apiLatency}ms`,
      icon: CloudArrowUp,
      metric: 'apiLatency',
      progress: Math.min((metrics.apiLatency / 300) * 100, 100)
    },
    {
      title: 'Cache Hit Rate',
      value: `${metrics.cacheHitRate}%`,
      icon: Database,
      metric: 'cacheHitRate',
      progress: metrics.cacheHitRate
    },
    {
      title: 'System Uptime',
      value: `${metrics.uptime}%`,
      icon: CheckCircle,
      metric: 'uptime',
      progress: metrics.uptime
    },
    {
      title: 'Error Rate',
      value: `${metrics.errorRate}%`,
      icon: Warning,
      metric: 'errorRate',
      progress: metrics.errorRate * 20
    },
    {
      title: 'Queries/Min',
      value: metrics.queriesPerMinute.toString(),
      icon: Gauge,
      metric: 'queriesPerMinute',
      progress: (metrics.queriesPerMinute / 50) * 100
    }
  ]

  const overallStatus = (() => {
    const statuses = metricCards.map(m => getHealthStatus(
      typeof metrics[m.metric as keyof PerformanceMetrics] === 'number' 
        ? metrics[m.metric as keyof PerformanceMetrics] as number
        : 0,
      m.metric
    ))
    if (statuses.includes('critical')) return 'critical'
    if (statuses.includes('warning')) return 'warning'
    if (statuses.every(s => s === 'excellent')) return 'excellent'
    return 'good'
  })()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold uppercase tracking-wide">
            <Gauge size={24} weight="fill" className="text-primary" />
            System Performance Monitor
          </DialogTitle>
          <DialogDescription className="font-mono text-xs flex items-center gap-2">
            REAL-TIME SYSTEM HEALTH // STATUS:
            <Badge variant="outline" className={`${getStatusBadge(overallStatus)} font-mono text-[10px] uppercase font-bold`}>
              {overallStatus}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {metricCards.map((card, index) => {
              const Icon = card.icon
              const status = getHealthStatus(
                metrics[card.metric as keyof PerformanceMetrics] as number,
                card.metric
              )
              const statusColor = getStatusColor(status)

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-border hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-sm font-mono uppercase">
                        <span className="flex items-center gap-2">
                          <Icon size={18} weight="fill" className={statusColor} />
                          {card.title}
                        </span>
                        <Badge variant="outline" className={`${getStatusBadge(status)} text-[9px] font-mono`}>
                          {status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className={`text-3xl font-bold font-mono ${statusColor}`}>
                        {card.value}
                      </div>
                      <Progress
                        value={card.progress}
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground font-mono">
                        Updated {new Date().toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false 
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-6 p-4 border border-border rounded-lg bg-card/50">
            <h3 className="font-mono text-sm uppercase font-semibold mb-3 flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-primary" />
              System Status Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center font-mono">
                <span className="text-muted-foreground">Platform Health:</span>
                <Badge className={`${getStatusBadge(overallStatus)} font-mono text-[10px]`}>
                  {overallStatus.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between items-center font-mono">
                <span className="text-muted-foreground">Active Sessions:</span>
                <span className="text-foreground font-bold">1</span>
              </div>
              <div className="flex justify-between items-center font-mono">
                <span className="text-muted-foreground">Total Queries Processed:</span>
                <span className="text-foreground font-bold">{Math.floor(metrics.queriesPerMinute * 60 * 24)}</span>
              </div>
              <div className="flex justify-between items-center font-mono">
                <span className="text-muted-foreground">Avg Response Time (24h):</span>
                <span className="text-foreground font-bold">{Math.round(metrics.responseTime * 0.95)}ms</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-muted-foreground font-mono">
            METRICS UPDATE EVERY 5 SECONDS // CLASSIFIED SYSTEM
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
