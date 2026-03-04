import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowsClockwise, Warning, Target, Crosshair, Globe as GlobeIcon, MagnifyingGlassMinus, MagnifyingGlassPlus, Cube } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg'

interface ThreatLocation {
  id: string
  name: string
  region: string
  lat: number
  lng: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'active' | 'escalating' | 'monitoring'
  description: string
  lastUpdate: string
  threatType: string
}

const threatLocations: ThreatLocation[] = [
  {
    id: 'gcc-iran',
    name: 'GCC-Iran Tensions',
    region: 'Persian Gulf',
    lat: 27.5,
    lng: 51.5,
    severity: 'high',
    status: 'monitoring',
    description: 'Heightened military presence in Strait of Hormuz. Naval assets monitoring shipping lanes.',
    lastUpdate: 'Updated 3 mins ago',
    threatType: 'Naval Conflict'
  },
  {
    id: 'israel-iran',
    name: 'Israel-Iran Conflict',
    region: 'Middle East',
    lat: 32.0,
    lng: 35.0,
    severity: 'critical',
    status: 'active',
    description: 'Active missile defense operations. Hypersonic missile threats detected. Iron Dome engaged.',
    lastUpdate: 'Updated 1 min ago',
    threatType: 'Missile Defense'
  },
  {
    id: 'ukraine',
    name: 'Ukraine Theater',
    region: 'Eastern Europe',
    lat: 49.0,
    lng: 32.0,
    severity: 'critical',
    status: 'active',
    description: 'Ground operations continue. Drone swarms detected. Artillery exchanges ongoing.',
    lastUpdate: 'Updated 2 mins ago',
    threatType: 'Combined Arms'
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
    lastUpdate: 'Updated 15 mins ago',
    threatType: 'Surveillance'
  },
  {
    id: 'south-china-sea',
    name: 'South China Sea',
    region: 'Indo-Pacific',
    lat: 12.0,
    lng: 115.0,
    severity: 'high',
    status: 'escalating',
    description: 'Increased naval activity. Fighter jet incursions. Freedom of navigation challenged.',
    lastUpdate: 'Updated 5 mins ago',
    threatType: 'Aerospace & Naval'
  },
  {
    id: 'taiwan-strait',
    name: 'Taiwan Strait',
    region: 'East Asia',
    lat: 24.0,
    lng: 120.0,
    severity: 'high',
    status: 'monitoring',
    description: 'Military exercises observed. Hypersonic missile tests detected. Enhanced readiness posture.',
    lastUpdate: 'Updated 8 mins ago',
    threatType: 'Aerospace Defense'
  }
]

interface Globe3DProps {
  onThreatSelect?: (threat: ThreatLocation) => void
}

export function Globe3D({ onThreatSelect }: Globe3DProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null)
  const [hoveredThreat, setHoveredThreat] = useState<ThreatLocation | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [is3D, setIs3D] = useState(true)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff3333'
      case 'high': return '#ffaa33'
      case 'medium': return '#4488ff'
      case 'low': return '#33ff88'
      default: return '#888888'
    }
  }

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive'
      case 'high': return 'text-warning'
      case 'medium': return 'text-primary'
      case 'low': return 'text-success'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Warning weight="fill" size={14} />
      case 'escalating': return <Target weight="fill" size={14} />
      case 'monitoring': return <Crosshair weight="fill" size={14} />
      default: return null
    }
  }

  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      center: [30, 30],
      zoom: 1.5,
      pitch: is3D ? 45 : 0,
      bearing: 0
    })

    mapRef.current = map

    map.on('style.load', () => {
      map.setFog({
        color: 'rgb(10, 15, 35)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(5, 5, 15)',
        'star-intensity': 0.6
      })
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    threatLocations.forEach((threat) => {
      const el = document.createElement('div')
      el.className = 'threat-marker'
      el.style.width = '24px'
      el.style.height = '24px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = getSeverityColor(threat.severity)
      el.style.border = '3px solid rgba(255, 255, 255, 0.3)'
      el.style.cursor = 'pointer'
      el.style.boxShadow = `0 0 20px ${getSeverityColor(threat.severity)}`
      el.style.transition = 'all 0.3s ease'
      
      if (threat.severity === 'critical' || threat.severity === 'high') {
        el.style.animation = 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }

      el.addEventListener('mouseenter', (e) => {
        setHoveredThreat(threat)
        setMousePos({ x: e.clientX, y: e.clientY })
        el.style.transform = 'scale(1.3)'
        el.style.boxShadow = `0 0 30px ${getSeverityColor(threat.severity)}`
      })

      el.addEventListener('mouseleave', () => {
        setHoveredThreat(null)
        el.style.transform = 'scale(1)'
        el.style.boxShadow = `0 0 20px ${getSeverityColor(threat.severity)}`
      })

      el.addEventListener('click', () => {
        setSelectedThreat(threat.id)
        if (onThreatSelect) {
          onThreatSelect(threat)
        }
        map.flyTo({
          center: [threat.lng, threat.lat],
          zoom: 6,
          pitch: 60,
          duration: 2000
        })
      })

      const marker = new mapboxgl.Marker(el)
        .setLngLat([threat.lng, threat.lat])
        .addTo(map)

      markersRef.current.push(marker)
    })

    map.on('idle', () => {
      if (is3D) {
        map.rotateTo((map.getBearing() + 0.2) % 360, { duration: 50 })
      }
    })

    return () => {
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      map.remove()
    }
  }, [is3D, onThreatSelect])

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [30, 30],
        zoom: 1.5,
        pitch: is3D ? 45 : 0,
        bearing: 0,
        duration: 2000
      })
      setSelectedThreat(null)
    }
  }

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn({ duration: 500 })
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut({ duration: 500 })
    }
  }

  const toggle3D = () => {
    if (mapRef.current) {
      const newIs3D = !is3D
      setIs3D(newIs3D)
      mapRef.current.flyTo({
        pitch: newIs3D ? 45 : 0,
        duration: 1000
      })
    }
  }

  return (
    <div className="space-y-4">
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.1);
            }
          }
          
          .mapboxgl-ctrl-logo {
            display: none !important;
          }
          
          .mapboxgl-ctrl-attrib {
            display: none !important;
          }
          
          .mapboxgl-canvas {
            outline: none;
          }
        `}
      </style>

      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap max-w-md">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm font-mono text-xs uppercase">
            Mapbox Globe - 3D Interactive
          </Badge>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50 font-mono text-xs uppercase">
            {threatLocations.length} Threats
          </Badge>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={toggle3D}
            className={`bg-background/80 backdrop-blur-sm ${is3D ? 'border-primary text-primary' : ''}`}
            title={is3D ? "Switch to 2D" : "Switch to 3D"}
          >
            <Cube size={16} weight={is3D ? "fill" : "regular"} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleZoomIn}
            className="bg-background/80 backdrop-blur-sm"
            title="Zoom In"
          >
            <MagnifyingGlassPlus size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleZoomOut}
            className="bg-background/80 backdrop-blur-sm"
            title="Zoom Out"
          >
            <MagnifyingGlassMinus size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="bg-background/80 backdrop-blur-sm"
            title="Reset View"
          >
            <ArrowsClockwise size={16} />
          </Button>
        </div>

        <div 
          ref={mapContainerRef} 
          className="w-full h-[600px] relative"
        />

        <AnimatePresence>
          {hoveredThreat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none z-20 bg-card/95 backdrop-blur-md border border-border rounded-lg p-3 shadow-lg"
              style={{
                left: mousePos.x + 15,
                top: mousePos.y - 60,
                maxWidth: '280px'
              }}
            >
              <div className="flex items-start gap-2 mb-1">
                <div className={getSeverityTextColor(hoveredThreat.severity)}>
                  {getStatusIcon(hoveredThreat.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs uppercase tracking-wide mb-0.5">
                    {hoveredThreat.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-mono mb-1">
                    {hoveredThreat.threatType}
                  </p>
                </div>
                <Badge className={`${getSeverityTextColor(hoveredThreat.severity)} text-[10px] font-mono uppercase px-1.5 py-0`}>
                  {hoveredThreat.severity}
                </Badge>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                {hoveredThreat.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {threatLocations.map((threat) => (
          <motion.div
            key={threat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all hover:border-primary ${
                selectedThreat === threat.id ? 'border-primary bg-primary/5' : ''
              } ${
                threat.severity === 'critical' ? 'border-l-4 border-l-destructive' :
                threat.severity === 'high' ? 'border-l-4 border-l-warning' : ''
              }`}
              onClick={() => {
                setSelectedThreat(threat.id)
                if (onThreatSelect) {
                  onThreatSelect(threat)
                }
                if (mapRef.current) {
                  mapRef.current.flyTo({
                    center: [threat.lng, threat.lat],
                    zoom: 6,
                    pitch: 60,
                    duration: 2000
                  })
                }
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={getSeverityTextColor(threat.severity)}>
                    {getStatusIcon(threat.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wide">{threat.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">{threat.threatType}</p>
                  </div>
                </div>
                <Badge className={`${getSeverityTextColor(threat.severity)} text-xs font-mono uppercase`}>
                  {threat.severity}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {threat.description}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">{threat.region}</span>
                <span className="text-muted-foreground font-mono">{threat.lastUpdate}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
