import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Warning, Target, Crosshair } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface Conflict {
  id: string
  name: string
  region: string
  lat: number
  lng: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'active' | 'escalating' | 'monitoring'
  description: string
  lastUpdate: string
}

const activeConflicts: Conflict[] = [
  {
    id: 'gcc-iran',
    name: 'GCC-Iran Tensions',
    region: 'Persian Gulf',
    lat: 27.5,
    lng: 51.5,
    severity: 'high',
    status: 'monitoring',
    description: 'Heightened military presence in Strait of Hormuz. Naval assets monitoring shipping lanes.',
    lastUpdate: 'Updated 3 mins ago'
  },
  {
    id: 'israel-iran',
    name: 'Israel-Iran Conflict',
    region: 'Middle East',
    lat: 32.0,
    lng: 35.0,
    severity: 'critical',
    status: 'active',
    description: 'Active missile defense operations. Air superiority contested. Cyber warfare ongoing.',
    lastUpdate: 'Updated 1 min ago'
  },
  {
    id: 'ukraine',
    name: 'Ukraine Theater',
    region: 'Eastern Europe',
    lat: 49.0,
    lng: 32.0,
    severity: 'critical',
    status: 'active',
    description: 'Ground operations continue. Drone warfare intensified. Artillery exchanges ongoing.',
    lastUpdate: 'Updated 2 mins ago'
  },
  {
    id: 'cuba-surveillance',
    name: 'Cuba Strategic Watch',
    region: 'Caribbean',
    lat: 21.5,
    lng: -80.0,
    severity: 'medium',
    status: 'monitoring',
    description: 'Monitoring military installations. Electronic intelligence gathering. Naval patrol routes active.',
    lastUpdate: 'Updated 15 mins ago'
  },
  {
    id: 'south-china-sea',
    name: 'South China Sea',
    region: 'Indo-Pacific',
    lat: 12.0,
    lng: 115.0,
    severity: 'high',
    status: 'escalating',
    description: 'Increased naval activity. Air defense identification zone violations. Freedom of navigation operations.',
    lastUpdate: 'Updated 5 mins ago'
  },
  {
    id: 'taiwan-strait',
    name: 'Taiwan Strait',
    region: 'East Asia',
    lat: 24.0,
    lng: 120.0,
    severity: 'high',
    status: 'monitoring',
    description: 'Military exercises observed. Air incursions recorded. Enhanced readiness posture.',
    lastUpdate: 'Updated 8 mins ago'
  }
]

interface ThreatMapProps {
  onConflictSelect: (conflict: Conflict) => void
}

export function ThreatMap({ onConflictSelect }: ThreatMapProps) {
  const [selectedConflict, setSelectedConflict] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground'
      case 'high': return 'bg-warning text-warning-foreground'
      case 'medium': return 'bg-primary text-primary-foreground'
      case 'low': return 'bg-success text-success-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Warning weight="fill" size={16} />
      case 'escalating': return <Target weight="fill" size={16} />
      case 'monitoring': return <Crosshair weight="fill" size={16} />
      default: return <MapPin weight="fill" size={16} />
    }
  }

  const handleConflictClick = (conflict: Conflict) => {
    setSelectedConflict(conflict.id)
    onConflictSelect(conflict)
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[400px] bg-secondary/50 rounded-lg border border-border overflow-hidden">
        <div 
          ref={mapRef}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 19px, oklch(0.35 0.12 240 / 0.3) 19px, oklch(0.35 0.12 240 / 0.3) 20px),
              repeating-linear-gradient(90deg, transparent, transparent 19px, oklch(0.35 0.12 240 / 0.3) 19px, oklch(0.35 0.12 240 / 0.3) 20px)
            `
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-[900px] max-h-[400px]">
            <svg className="w-full h-full" viewBox="0 0 900 400" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="pulseGradient">
                  <stop offset="0%" stopColor="oklch(0.55 0.22 25)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="oklch(0.55 0.22 25)" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              {activeConflicts.map((conflict) => {
                const x = ((conflict.lng + 180) / 360) * 900
                const y = ((90 - conflict.lat) / 180) * 400
                const isSelected = selectedConflict === conflict.id
                const isCritical = conflict.severity === 'critical'
                
                return (
                  <g key={conflict.id}>
                    {isCritical && (
                      <motion.circle
                        cx={x}
                        cy={y}
                        r="0"
                        fill="url(#pulseGradient)"
                        animate={{ r: [0, 30, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? "8" : "6"}
                      className={`cursor-pointer transition-all ${
                        conflict.severity === 'critical' ? 'fill-destructive' :
                        conflict.severity === 'high' ? 'fill-warning' :
                        conflict.severity === 'medium' ? 'fill-primary' :
                        'fill-success'
                      }`}
                      onClick={() => handleConflictClick(conflict)}
                      style={{
                        filter: isSelected ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                      }}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="15"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="1"
                      className={`${
                        conflict.severity === 'critical' ? 'stroke-destructive' :
                        conflict.severity === 'high' ? 'stroke-warning' :
                        conflict.severity === 'medium' ? 'stroke-primary' :
                        'stroke-success'
                      }`}
                      opacity="0.3"
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
        
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm font-mono text-xs">
            GLOBAL THREAT MAP - LIVE
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeConflicts.map((conflict) => (
          <motion.div
            key={conflict.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all hover:border-primary ${
                selectedConflict === conflict.id ? 'border-primary bg-primary/5' : ''
              } ${
                conflict.severity === 'critical' ? 'border-l-4 border-l-destructive' :
                conflict.severity === 'high' ? 'border-l-4 border-l-warning' : ''
              }`}
              onClick={() => handleConflictClick(conflict)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(conflict.status)}
                  <h3 className="font-semibold text-sm uppercase tracking-wide">{conflict.name}</h3>
                </div>
                <Badge className={`${getSeverityColor(conflict.severity)} text-xs font-mono uppercase`}>
                  {conflict.severity}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {conflict.description}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">{conflict.region}</span>
                <span className="text-muted-foreground font-mono">{conflict.lastUpdate}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
