import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowsClockwise, Warning, Target, Crosshair, Globe as GlobeIcon, MagnifyingGlassMinus, MagnifyingGlassPlus, Cube, MapTrifold, Planet, CloudRain, Wind, CloudSnow, Lightning, Rocket, BookOpen } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { TrajectoryLegend } from '@/components/TrajectoryLegend'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

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

interface MissileTrajectory {
  id: string
  from: { lat: number, lng: number, name: string }
  to: { lat: number, lng: number, name: string }
  severity: 'critical' | 'high' | 'medium'
  type: 'ballistic' | 'hypersonic' | 'cruise'
}

const missileTrajectories: MissileTrajectory[] = [
  {
    id: 'iran-israel-1',
    from: { lat: 32.4, lng: 53.7, name: 'Iran' },
    to: { lat: 32.0, lng: 35.0, name: 'Israel' },
    severity: 'critical',
    type: 'ballistic'
  },
  {
    id: 'iran-gcc-1',
    from: { lat: 27.2, lng: 56.3, name: 'Iran' },
    to: { lat: 26.0, lng: 50.5, name: 'Bahrain' },
    severity: 'high',
    type: 'cruise'
  },
  {
    id: 'russia-ukraine-1',
    from: { lat: 55.7, lng: 37.6, name: 'Russia' },
    to: { lat: 50.4, lng: 30.5, name: 'Kyiv' },
    severity: 'critical',
    type: 'hypersonic'
  },
  {
    id: 'china-taiwan-1',
    from: { lat: 26.1, lng: 119.3, name: 'Fujian' },
    to: { lat: 25.0, lng: 121.5, name: 'Taipei' },
    severity: 'high',
    type: 'ballistic'
  },
  {
    id: 'nkorea-skorea-1',
    from: { lat: 39.0, lng: 125.7, name: 'North Korea' },
    to: { lat: 37.5, lng: 127.0, name: 'Seoul' },
    severity: 'high',
    type: 'ballistic'
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
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'terrain'>('satellite')
  const [weatherLayers, setWeatherLayers] = useState<Set<string>>(new Set())
  const [showTrajectories, setShowTrajectories] = useState(true)
  const [showLegend, setShowLegend] = useState(false)
  
  type WeatherLayerType = 'precipitation' | 'wind' | 'temperature' | 'clouds'

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

  const getMapStyleUrl = (style: 'dark' | 'satellite' | 'terrain') => {
    switch (style) {
      case 'satellite': return 'mapbox://styles/mapbox/satellite-streets-v12'
      case 'terrain': return 'mapbox://styles/mapbox/outdoors-v12'
      case 'dark': 
      default: return 'mapbox://styles/mapbox/dark-v11'
    }
  }

  const getMapStyleLabel = (style: 'dark' | 'satellite' | 'terrain') => {
    switch (style) {
      case 'satellite': return 'Satellite'
      case 'terrain': return 'Terrain'
      case 'dark': 
      default: return 'Dark'
    }
  }

  const toggleWeatherLayer = (layer: WeatherLayerType) => {
    setWeatherLayers(prev => {
      const newLayers = new Set(prev)
      if (newLayers.has(layer)) {
        newLayers.delete(layer)
      } else {
        newLayers.add(layer)
      }
      return newLayers
    })
  }

  const getWeatherLayerLabel = (layer: WeatherLayerType) => {
    switch (layer) {
      case 'precipitation': return 'Precipitation'
      case 'wind': return 'Wind Patterns'
      case 'temperature': return 'Temperature'
      case 'clouds': return 'Cloud Cover'
    }
  }

  const getWeatherLayerIcon = (layer: WeatherLayerType) => {
    switch (layer) {
      case 'precipitation': return CloudRain
      case 'wind': return Wind
      case 'temperature': return Lightning
      case 'clouds': return CloudSnow
    }
  }

  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: getMapStyleUrl(mapStyle),
      projection: { name: 'globe' },
      center: [20, 30],
      zoom: 1.8,
      pitch: is3D ? 30 : 0,
      bearing: 0,
      antialias: true,
      maxZoom: 18,
      minZoom: 1
    })

    mapRef.current = map

    map.on('style.load', () => {
      map.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      })

      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      })

      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })

      const atmosphereLayer = {
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere' as const,
          'sky-atmosphere-sun': [0.0, 0.0] as [number, number],
          'sky-atmosphere-sun-intensity': 5
        }
      }
      
      if (!map.getLayer('sky')) {
        map.addLayer(atmosphereLayer as any)
      }
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: true, visualizePitch: true }), 'top-right')

    map.dragRotate.enable()
    map.touchZoomRotate.enableRotation()
    map.keyboard.enable()
    map.scrollZoom.enable()

    threatLocations.forEach((threat) => {
      const el = document.createElement('div')
      el.className = 'threat-marker'
      el.style.width = '28px'
      el.style.height = '28px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = getSeverityColor(threat.severity)
      el.style.border = '3px solid rgba(255, 255, 255, 0.4)'
      el.style.cursor = 'pointer'
      el.style.boxShadow = `0 0 25px ${getSeverityColor(threat.severity)}, 0 0 10px rgba(255, 255, 255, 0.5)`
      el.style.transition = 'all 0.3s ease'
      el.style.position = 'relative'
      el.style.zIndex = '10'
      
      if (threat.severity === 'critical' || threat.severity === 'high') {
        el.style.animation = 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }

      el.addEventListener('mouseenter', (e) => {
        setHoveredThreat(threat)
        setMousePos({ x: e.clientX, y: e.clientY })
        el.style.transform = 'scale(1.4)'
        el.style.boxShadow = `0 0 35px ${getSeverityColor(threat.severity)}, 0 0 15px rgba(255, 255, 255, 0.8)`
        el.style.zIndex = '100'
      })

      el.addEventListener('mouseleave', () => {
        setHoveredThreat(null)
        el.style.transform = 'scale(1)'
        el.style.boxShadow = `0 0 25px ${getSeverityColor(threat.severity)}, 0 0 10px rgba(255, 255, 255, 0.5)`
        el.style.zIndex = '10'
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

    const createCurvedPath = (from: [number, number], to: [number, number], arcHeight: number = 0.2) => {
      const steps = 100
      const path: [number, number][] = []
      
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const lng = from[0] + (to[0] - from[0]) * t
        const lat = from[1] + (to[1] - from[1]) * t
        
        const distance = Math.sqrt(
          Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2)
        )
        
        const heightOffset = Math.sin(t * Math.PI) * distance * arcHeight
        path.push([lng, lat + heightOffset])
      }
      
      return path
    }

    map.once('load', () => {
      if (showTrajectories) {
        missileTrajectories.forEach((trajectory, index) => {
          const sourceId = `trajectory-${trajectory.id}`
          const lineLayerId = `trajectory-line-${trajectory.id}`
          const particleLayerId = `trajectory-particle-${trajectory.id}`
          
          const path = createCurvedPath(
            [trajectory.from.lng, trajectory.from.lat],
            [trajectory.to.lng, trajectory.to.lat],
            trajectory.type === 'hypersonic' ? 0.15 : trajectory.type === 'ballistic' ? 0.25 : 0.1
          )

          if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: path
                }
              }
            })

            const trajectoryColor = 
              trajectory.severity === 'critical' ? '#ff3333' :
              trajectory.severity === 'high' ? '#ffaa33' : '#4488ff'

            map.addLayer({
              id: lineLayerId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': trajectoryColor,
                'line-width': 2,
                'line-opacity': 0.6,
                'line-dasharray': [2, 2]
              }
            })

            map.addSource(`${sourceId}-particle`, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: path[0]
                }
              }
            })

            map.addLayer({
              id: particleLayerId,
              type: 'circle',
              source: `${sourceId}-particle`,
              paint: {
                'circle-radius': 5,
                'circle-color': trajectoryColor,
                'circle-blur': 0.3,
                'circle-opacity': 0.9
              }
            })

            let particleIndex = 0
            const speed = trajectory.type === 'hypersonic' ? 3 : trajectory.type === 'ballistic' ? 2 : 1
            
            const animateParticle = () => {
              if (!map.getSource(`${sourceId}-particle`)) return
              
              particleIndex = (particleIndex + speed) % path.length
              const particleSource = map.getSource(`${sourceId}-particle`) as mapboxgl.GeoJSONSource
              
              if (particleSource) {
                particleSource.setData({
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: path[Math.floor(particleIndex)]
                  }
                })
              }
              
              requestAnimationFrame(animateParticle)
            }
            
            animateParticle()
          }
        })
      }
    })

    let rotationAnimationFrame: number
    const rotateGlobe = () => {
      if (is3D && map.isMoving() === false) {
        const currentBearing = map.getBearing()
        map.setBearing(currentBearing + 0.08)
      }
      rotationAnimationFrame = requestAnimationFrame(rotateGlobe)
    }

    if (is3D) {
      rotationAnimationFrame = requestAnimationFrame(rotateGlobe)
    }

    return () => {
      if (rotationAnimationFrame) {
        cancelAnimationFrame(rotationAnimationFrame)
      }
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      map.remove()
    }
  }, [is3D, mapStyle, onThreatSelect, showTrajectories])

  useEffect(() => {
    if (!mapRef.current) return
    
    const map = mapRef.current

    map.once('load', () => {
      const layersToAdd: Array<{ id: string, type: WeatherLayerType }> = [
        { id: 'precipitation-layer', type: 'precipitation' },
        { id: 'wind-layer', type: 'wind' },
        { id: 'temperature-layer', type: 'temperature' },
        { id: 'clouds-layer', type: 'clouds' }
      ]

      layersToAdd.forEach(({ id, type }) => {
        if (!map.getSource(id)) {
          map.addSource(id, {
            type: 'raster',
            tiles: [getWeatherTileUrl(type)],
            tileSize: 256
          })

          map.addLayer({
            id,
            type: 'raster',
            source: id,
            paint: {
              'raster-opacity': 0.6
            },
            layout: {
              visibility: weatherLayers.has(type) ? 'visible' : 'none'
            }
          })
        } else {
          map.setLayoutProperty(
            id,
            'visibility',
            weatherLayers.has(type) ? 'visible' : 'none'
          )
        }
      })
    })
  }, [weatherLayers])

  const getWeatherTileUrl = (type: WeatherLayerType): string => {
    const baseUrl = 'https://tile.openweathermap.org/map'
    const appid = 'demo'
    
    switch (type) {
      case 'precipitation':
        return `${baseUrl}/precipitation_new/{z}/{x}/{y}.png?appid=${appid}`
      case 'wind':
        return `${baseUrl}/wind_new/{z}/{x}/{y}.png?appid=${appid}`
      case 'temperature':
        return `${baseUrl}/temp_new/{z}/{x}/{y}.png?appid=${appid}`
      case 'clouds':
        return `${baseUrl}/clouds_new/{z}/{x}/{y}.png?appid=${appid}`
    }
  }

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [20, 30],
        zoom: 1.8,
        pitch: is3D ? 30 : 0,
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
        pitch: newIs3D ? 30 : 0,
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
          {showTrajectories && (
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent/50 font-mono text-xs uppercase">
              {missileTrajectories.length} Active Trajectories
            </Badge>
          )}
          {weatherLayers.size > 0 && (
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent/50 font-mono text-xs uppercase">
              {weatherLayers.size} Weather Layer{weatherLayers.size > 1 ? 's' : ''} Active
            </Badge>
          )}
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowLegend(!showLegend)}
            className={`bg-background/80 backdrop-blur-sm gap-2 ${showLegend ? 'border-accent text-accent' : ''}`}
            title={showLegend ? "Hide Trajectory Legend" : "Show Trajectory Legend"}
          >
            <BookOpen size={16} weight={showLegend ? 'fill' : 'regular'} />
            <span className="hidden sm:inline text-xs font-mono">Legend</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowTrajectories(!showTrajectories)}
            className={`bg-background/80 backdrop-blur-sm gap-2 ${showTrajectories ? 'border-accent text-accent' : ''}`}
            title={showTrajectories ? "Hide Missile Trajectories" : "Show Missile Trajectories"}
          >
            <Rocket size={16} weight={showTrajectories ? 'fill' : 'regular'} />
            <span className="hidden sm:inline text-xs font-mono">Trajectories</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className={`bg-background/80 backdrop-blur-sm gap-2 ${weatherLayers.size > 0 ? 'border-accent text-accent' : ''}`}
                title="Weather Overlays"
              >
                <CloudRain size={16} weight={weatherLayers.size > 0 ? 'fill' : 'regular'} />
                <span className="hidden sm:inline text-xs font-mono">Weather</span>
                {weatherLayers.size > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center">
                    {weatherLayers.size}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-md">
              <DropdownMenuLabel className="font-mono text-xs text-muted-foreground uppercase">
                Weather Layers
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(['precipitation', 'wind', 'temperature', 'clouds'] as WeatherLayerType[]).map((layer) => {
                const Icon = getWeatherLayerIcon(layer)
                const isActive = weatherLayers.has(layer)
                return (
                  <DropdownMenuItem
                    key={layer}
                    onClick={() => toggleWeatherLayer(layer)}
                    className={isActive ? 'bg-primary/20 text-primary' : ''}
                  >
                    <Icon size={16} weight={isActive ? 'fill' : 'regular'} className="mr-2" />
                    <span className="font-mono text-xs">{getWeatherLayerLabel(layer)}</span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="bg-background/80 backdrop-blur-sm gap-2"
                title="Change Map Style"
              >
                <MapTrifold size={16} weight="fill" />
                <span className="hidden sm:inline text-xs font-mono">{getMapStyleLabel(mapStyle)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-md">
              <DropdownMenuItem 
                onClick={() => setMapStyle('dark')}
                className={mapStyle === 'dark' ? 'bg-primary/20 text-primary' : ''}
              >
                <GlobeIcon size={16} weight={mapStyle === 'dark' ? 'fill' : 'regular'} className="mr-2" />
                <span className="font-mono text-xs">Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setMapStyle('satellite')}
                className={mapStyle === 'satellite' ? 'bg-primary/20 text-primary' : ''}
              >
                <Planet size={16} weight={mapStyle === 'satellite' ? 'fill' : 'regular'} className="mr-2" />
                <span className="font-mono text-xs">Satellite</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setMapStyle('terrain')}
                className={mapStyle === 'terrain' ? 'bg-primary/20 text-primary' : ''}
              >
                <MapTrifold size={16} weight={mapStyle === 'terrain' ? 'fill' : 'regular'} className="mr-2" />
                <span className="font-mono text-xs">Terrain</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {showLegend && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <TrajectoryLegend />
        </motion.div>
      )}
    </div>
  )
}
