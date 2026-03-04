import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Shield, Warning, Airplane, Rocket, Target, Eye } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ThreatItem {
  id: string
  type: 'missile' | 'aircraft' | 'drone' | 'uap' | 'cyber'
  name: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  distance: number
  speed: number
  altitude?: number
  bearing: string
  status: 'tracking' | 'engaged' | 'neutralized' | 'unknown'
  detected: string
}

const activeThreats: ThreatItem[] = [
  {
    id: 't-001',
    type: 'missile',
    name: 'Hypersonic Projectile',
    severity: 'critical',
    distance: 450,
    speed: 8500,
    altitude: 85000,
    bearing: 'NNE',
    status: 'tracking',
    detected: '00:34 ago'
  },
  {
    id: 't-002',
    type: 'aircraft',
    name: 'SU-35 Fighter',
    severity: 'high',
    distance: 120,
    speed: 1200,
    altitude: 35000,
    bearing: 'E',
    status: 'engaged',
    detected: '02:15 ago'
  },
  {
    id: 't-003',
    type: 'drone',
    name: 'UAV Swarm (x12)',
    severity: 'high',
    distance: 85,
    speed: 350,
    altitude: 15000,
    bearing: 'SE',
    status: 'tracking',
    detected: '01:42 ago'
  },
  {
    id: 't-004',
    type: 'uap',
    name: 'Unknown Aerial Object',
    severity: 'medium',
    distance: 200,
    speed: 4500,
    altitude: 45000,
    bearing: 'W',
    status: 'unknown',
    detected: '05:22 ago'
  },
  {
    id: 't-005',
    type: 'missile',
    name: 'Ballistic Missile',
    severity: 'critical',
    distance: 680,
    speed: 6200,
    altitude: 120000,
    bearing: 'NW',
    status: 'tracking',
    detected: '00:12 ago'
  }
]

export function ThreatDashboard() {
  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'missile': return <Rocket weight="fill" size={20} />
      case 'aircraft': return <Airplane weight="fill" size={20} />
      case 'drone': return <Target weight="fill" size={20} />
      case 'uap': return <Eye weight="fill" size={20} />
      default: return <Warning weight="fill" size={20} />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive'
      case 'high': return 'text-warning'
      case 'medium': return 'text-primary'
      case 'low': return 'text-success'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tracking': return 'bg-warning/20 text-warning border-warning/50'
      case 'engaged': return 'bg-destructive/20 text-destructive border-destructive/50'
      case 'neutralized': return 'bg-success/20 text-success border-success/50'
      case 'unknown': return 'bg-muted text-muted-foreground border-muted'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const calculateThreatLevel = (distance: number, severity: string) => {
    let baseLevel = severity === 'critical' ? 90 : severity === 'high' ? 70 : severity === 'medium' ? 50 : 30
    const distanceFactor = Math.max(0, 100 - distance / 10)
    return Math.min(100, (baseLevel + distanceFactor) / 2)
  }

  const criticalCount = activeThreats.filter(t => t.severity === 'critical').length
  const highCount = activeThreats.filter(t => t.severity === 'high').length
  const trackingCount = activeThreats.filter(t => t.status === 'tracking').length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="p-4 border-destructive/50 bg-destructive/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-muted-foreground">Critical Threats</span>
            <Shield className="text-destructive" weight="fill" size={20} />
          </div>
          <div className="text-3xl font-bold text-destructive font-mono">{criticalCount}</div>
          <div className="text-xs text-muted-foreground mt-1 font-mono">IMMEDIATE ACTION REQ</div>
        </Card>

        <Card className="p-4 border-warning/50 bg-warning/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-muted-foreground">High Priority</span>
            <Warning className="text-warning" weight="fill" size={20} />
          </div>
          <div className="text-3xl font-bold text-warning font-mono">{highCount}</div>
          <div className="text-xs text-muted-foreground mt-1 font-mono">MONITORING ACTIVE</div>
        </Card>

        <Card className="p-4 border-primary/50 bg-primary/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-muted-foreground">Active Tracks</span>
            <Target className="text-primary" weight="fill" size={20} />
          </div>
          <div className="text-3xl font-bold text-primary font-mono">{trackingCount}</div>
          <div className="text-xs text-muted-foreground mt-1 font-mono">SYSTEMS ENGAGED</div>
        </Card>

        <Card className="p-4 border-success/50 bg-success/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-muted-foreground">Defense Status</span>
            <Shield className="text-success" weight="fill" size={20} />
          </div>
          <div className="text-3xl font-bold text-success font-mono">95%</div>
          <div className="text-xs text-muted-foreground mt-1 font-mono">OPERATIONAL READY</div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold uppercase tracking-wide text-sm">Active Aerial Threats</h3>
          <Badge variant="outline" className="font-mono text-xs">
            LIVE TRACKING
          </Badge>
        </div>

        <div className="space-y-3">
          {activeThreats.map((threat, index) => (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`p-4 rounded-lg border ${
                threat.severity === 'critical' ? 'border-destructive/50 bg-destructive/5' :
                threat.severity === 'high' ? 'border-warning/50 bg-warning/5' :
                'border-border bg-secondary/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`${getSeverityColor(threat.severity)}`}>
                    {getThreatIcon(threat.type)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{threat.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">ID: {threat.id}</div>
                  </div>
                </div>
                <Badge className={`${getStatusColor(threat.status)} text-xs font-mono uppercase`}>
                  {threat.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs font-mono">
                <div>
                  <span className="text-muted-foreground">DIST:</span>
                  <span className="ml-2 text-foreground font-semibold">{threat.distance} km</span>
                </div>
                <div>
                  <span className="text-muted-foreground">SPD:</span>
                  <span className="ml-2 text-foreground font-semibold">{threat.speed} km/h</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ALT:</span>
                  <span className="ml-2 text-foreground font-semibold">{threat.altitude?.toLocaleString()} ft</span>
                </div>
                <div>
                  <span className="text-muted-foreground">BRG:</span>
                  <span className="ml-2 text-foreground font-semibold">{threat.bearing}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono">THREAT LEVEL</span>
                  <span className={`font-mono font-semibold ${getSeverityColor(threat.severity)}`}>
                    {calculateThreatLevel(threat.distance, threat.severity).toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={calculateThreatLevel(threat.distance, threat.severity)} 
                  className={`h-1.5 ${
                    threat.severity === 'critical' ? '[&>div]:bg-destructive' :
                    threat.severity === 'high' ? '[&>div]:bg-warning' :
                    '[&>div]:bg-primary'
                  }`}
                />
              </div>

              <div className="text-xs text-muted-foreground mt-2 font-mono">
                Detected {threat.detected}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}
