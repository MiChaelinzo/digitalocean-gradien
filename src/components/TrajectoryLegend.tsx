import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rocket, Lightning, Target, Info } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface MissileType {
  type: 'ballistic' | 'hypersonic' | 'cruise'
  name: string
  icon: any
  color: string
  bgColor: string
  borderColor: string
  speed: string
  range: string
  trajectory: string
  altitude: string
  detectability: string
  interceptability: string
  description: string
  examples: string[]
}

const missileTypes: MissileType[] = [
  {
    type: 'ballistic',
    name: 'Ballistic Missile',
    icon: Rocket,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/50',
    speed: 'Mach 5-7',
    range: '300-15,000 km',
    trajectory: 'High Arc (Parabolic)',
    altitude: '100-1,200 km',
    detectability: 'High (radar signature)',
    interceptability: 'Medium (predictable path)',
    description: 'Follows a ballistic trajectory after powered ascent. High-altitude flight path makes detection easier but interception challenging during terminal phase.',
    examples: ['Shahab-3 (Iran)', 'DF-21 (China)', 'Iskander (Russia)', 'Scud variants']
  },
  {
    type: 'hypersonic',
    name: 'Hypersonic Missile',
    icon: Lightning,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/50',
    speed: 'Mach 5-27+',
    range: '500-6,000 km',
    trajectory: 'Low Arc (Maneuverable)',
    altitude: '20-100 km',
    detectability: 'Very Low (plasma sheath)',
    interceptability: 'Very Low (unpredictable)',
    description: 'Extreme speed combined with maneuverability. Plasma sheath during flight complicates radar tracking. Can change trajectory mid-flight to evade defenses.',
    examples: ['Kinzhal (Russia)', 'DF-17 (China)', 'Zircon (Russia)', 'Dark Eagle (USA)']
  },
  {
    type: 'cruise',
    name: 'Cruise Missile',
    icon: Target,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/50',
    speed: 'Mach 0.5-3',
    range: '40-2,500 km',
    trajectory: 'Low Altitude (Terrain Following)',
    altitude: '15-300 m',
    detectability: 'Low (terrain masking)',
    interceptability: 'High (slower speed)',
    description: 'Flies at low altitude using terrain following. Powered throughout flight allowing course corrections. Subsonic to supersonic variants with high precision.',
    examples: ['Tomahawk (USA)', 'Kalibr (Russia)', 'Soumar (Iran)', 'BrahMos (India/Russia)']
  }
]

interface SeverityLevel {
  level: 'critical' | 'high' | 'medium'
  color: string
  bgColor: string
  label: string
  description: string
}

const severityLevels: SeverityLevel[] = [
  {
    level: 'critical',
    color: '#ff3333',
    bgColor: 'bg-destructive/20',
    label: 'Critical',
    description: 'Imminent threat - Active engagement or launch detected'
  },
  {
    level: 'high',
    color: '#ffaa33',
    bgColor: 'bg-warning/20',
    label: 'High',
    description: 'Elevated threat - Systems armed or movement detected'
  },
  {
    level: 'medium',
    color: '#4488ff',
    bgColor: 'bg-primary/20',
    label: 'Medium',
    description: 'Monitoring - Potential threat in development or testing'
  }
]

export function TrajectoryLegend() {
  return (
    <div className="space-y-4">
      <Card className="p-5 bg-card/50 backdrop-blur-sm border-border">
        <div className="flex items-center gap-2 mb-4">
          <Rocket size={20} weight="fill" className="text-accent" />
          <h3 className="font-bold text-sm uppercase tracking-wide">Missile Trajectory Legend</h3>
          <Badge variant="outline" className="ml-auto text-xs font-mono">
            Classification Reference
          </Badge>
        </div>

        <div className="space-y-3">
          {missileTypes.map((missile, index) => {
            const Icon = missile.icon
            return (
              <motion.div
                key={missile.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Card className={`p-4 ${missile.bgColor} border ${missile.borderColor} hover:border-opacity-100 transition-all`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-md ${missile.bgColor} border ${missile.borderColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={20} weight="fill" className={missile.color} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-bold text-sm uppercase tracking-wide ${missile.color}`}>
                          {missile.name}
                        </h4>
                        <div className="flex-1 h-[2px] bg-gradient-to-r from-current to-transparent opacity-30" 
                             style={{ color: missile.color.replace('text-', '') }} 
                        />
                      </div>
                      
                      <p className="text-xs text-foreground/80 mb-3 leading-relaxed">
                        {missile.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-background/50 rounded px-2 py-1.5">
                          <p className="text-[10px] text-muted-foreground font-mono uppercase mb-0.5">Speed</p>
                          <p className="text-xs font-semibold font-mono">{missile.speed}</p>
                        </div>
                        <div className="bg-background/50 rounded px-2 py-1.5">
                          <p className="text-[10px] text-muted-foreground font-mono uppercase mb-0.5">Range</p>
                          <p className="text-xs font-semibold font-mono">{missile.range}</p>
                        </div>
                        <div className="bg-background/50 rounded px-2 py-1.5">
                          <p className="text-[10px] text-muted-foreground font-mono uppercase mb-0.5">Trajectory</p>
                          <p className="text-xs font-semibold font-mono">{missile.trajectory}</p>
                        </div>
                        <div className="bg-background/50 rounded px-2 py-1.5">
                          <p className="text-[10px] text-muted-foreground font-mono uppercase mb-0.5">Altitude</p>
                          <p className="text-xs font-semibold font-mono">{missile.altitude}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-background/50 rounded px-2 py-1.5">
                          <p className="text-[10px] text-muted-foreground font-mono uppercase mb-0.5">Detectability</p>
                          <p className="text-xs font-semibold">{missile.detectability}</p>
                        </div>
                        <div className="bg-background/50 rounded px-2 py-1.5">
                          <p className="text-[10px] text-muted-foreground font-mono uppercase mb-0.5">Interceptability</p>
                          <p className="text-xs font-semibold">{missile.interceptability}</p>
                        </div>
                      </div>

                      <div className="bg-background/50 rounded px-2 py-2">
                        <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Known Systems</p>
                        <div className="flex flex-wrap gap-1.5">
                          {missile.examples.map((example) => (
                            <Badge
                              key={example}
                              variant="outline"
                              className={`text-[10px] font-mono ${missile.color} ${missile.borderColor}`}
                            >
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </Card>

      <Card className="p-5 bg-card/50 backdrop-blur-sm border-border">
        <div className="flex items-center gap-2 mb-4">
          <Info size={20} weight="fill" className="text-accent" />
          <h3 className="font-bold text-sm uppercase tracking-wide">Threat Severity Indicators</h3>
        </div>

        <div className="space-y-2">
          {severityLevels.map((severity, index) => (
            <motion.div
              key={severity.level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${severity.bgColor} border border-opacity-50`}
              style={{ borderColor: severity.color }}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: severity.color,
                  boxShadow: `0 0 10px ${severity.color}80`
                }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-xs uppercase tracking-wide" style={{ color: severity.color }}>
                    {severity.label}
                  </p>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-current to-transparent opacity-30"
                       style={{ color: severity.color }}
                  />
                </div>
                <p className="text-xs text-foreground/70">{severity.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border border-accent/50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-accent/20 border border-accent/50 flex items-center justify-center flex-shrink-0">
            <Info size={16} weight="fill" className="text-accent" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-xs uppercase tracking-wide text-accent mb-1">
              Trajectory Visualization
            </h4>
            <p className="text-xs text-foreground/70 leading-relaxed mb-2">
              Animated particle paths on the globe represent active or simulated missile trajectories. 
              Line curvature indicates flight profile: high arcs for ballistic missiles, moderate curves 
              for hypersonic glide vehicles, and low-altitude paths for cruise missiles.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-[10px] font-mono">
                Dashed Lines = Flight Path
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono">
                Moving Dots = Active Missiles
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono">
                Speed = Mach Number
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
