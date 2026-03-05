import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowsClockwise, Warning, Target, Crosshair, Globe as GlobeIcon, MagnifyingGlassMinus, MagnifyingGlassPlus, Cube, MapTrifold, Planet, CloudRain, Wind, CloudSnow, Lightning, Rocket, BookOpen, MapPin, MapPinLine, Eye, Thermometer, Broadcast } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Slider } from '@/components/ui/slider'
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

interface CityMarker {
  id: string
  name: string
  country: string
  lat: number
  lng: number
  type: 'capital' | 'major' | 'strategic'
  population: string
  populationNum: number
  strategicImportance: 'critical' | 'high' | 'medium' | 'low'
  strategicNotes: string
}

const majorCities: CityMarker[] = [
  { id: 'washington', name: 'Washington D.C.', country: 'USA', lat: 38.9072, lng: -77.0369, type: 'capital', population: '700K', populationNum: 700000, strategicImportance: 'critical', strategicNotes: 'US capital, Pentagon, NATO command center' },
  { id: 'moscow', name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, type: 'capital', population: '12.6M', populationNum: 12600000, strategicImportance: 'critical', strategicNotes: 'Russian military command, nuclear arsenal control' },
  { id: 'beijing', name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, type: 'capital', population: '21.5M', populationNum: 21500000, strategicImportance: 'critical', strategicNotes: 'PLA headquarters, cyber warfare center' },
  { id: 'tehran', name: 'Tehran', country: 'Iran', lat: 35.6892, lng: 51.3890, type: 'capital', population: '9.1M', populationNum: 9100000, strategicImportance: 'high', strategicNotes: 'IRGC headquarters, missile production facilities' },
  { id: 'jerusalem', name: 'Jerusalem', country: 'Israel', lat: 31.7683, lng: 35.2137, type: 'capital', population: '940K', populationNum: 940000, strategicImportance: 'critical', strategicNotes: 'IDF command center, Iron Dome control' },
  { id: 'kyiv', name: 'Kyiv', country: 'Ukraine', lat: 50.4501, lng: 30.5234, type: 'capital', population: '2.9M', populationNum: 2900000, strategicImportance: 'critical', strategicNotes: 'Active war zone, air defense hub' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, type: 'capital', population: '9.7M', populationNum: 9700000, strategicImportance: 'critical', strategicNotes: 'US Forces Korea HQ, 50km from DMZ' },
  { id: 'pyongyang', name: 'Pyongyang', country: 'North Korea', lat: 39.0392, lng: 125.7625, type: 'capital', population: '3.1M', populationNum: 3100000, strategicImportance: 'high', strategicNotes: 'Nuclear weapons command, ICBM facilities' },
  { id: 'taipei', name: 'Taipei', country: 'Taiwan', lat: 25.0330, lng: 121.5654, type: 'capital', population: '2.6M', populationNum: 2600000, strategicImportance: 'critical', strategicNotes: 'Semiconductor hub, missile defense systems' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, type: 'capital', population: '14.0M', populationNum: 14000000, strategicImportance: 'high', strategicNotes: 'US 7th Fleet support, regional defense hub' },
  { id: 'london', name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, type: 'capital', population: '9.0M', populationNum: 9000000, strategicImportance: 'high', strategicNotes: 'NATO intelligence center, naval command' },
  { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, type: 'capital', population: '2.2M', populationNum: 2200000, strategicImportance: 'high', strategicNotes: 'Nuclear deterrent command, EU military HQ' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, type: 'capital', population: '3.6M', populationNum: 3600000, strategicImportance: 'medium', strategicNotes: 'NATO coordination center, Bundeswehr HQ' },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753, type: 'capital', population: '7.7M', populationNum: 7700000, strategicImportance: 'high', strategicNotes: 'Oil infrastructure, Patriot missile batteries' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, type: 'strategic', population: '3.5M', populationNum: 3500000, strategicImportance: 'high', strategicNotes: 'Naval base, regional logistics hub' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, type: 'strategic', population: '15.8M', populationNum: 15800000, strategicImportance: 'high', strategicNotes: 'Bosphorus control, NATO airbase access' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, type: 'capital', population: '21.3M', populationNum: 21300000, strategicImportance: 'medium', strategicNotes: 'Suez Canal proximity, regional air power' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, type: 'major', population: '20.4M', populationNum: 20400000, strategicImportance: 'medium', strategicNotes: 'Naval headquarters, economic center' },
  { id: 'delhi', name: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.2090, type: 'capital', population: '32.9M', populationNum: 32900000, strategicImportance: 'critical', strategicNotes: 'Nuclear command, military operations center' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, type: 'capital', population: '5.9M', populationNum: 5900000, strategicImportance: 'high', strategicNotes: 'Maritime chokepoint, US naval facilities' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, type: 'major', population: '5.3M', populationNum: 5300000, strategicImportance: 'medium', strategicNotes: 'Pacific fleet base, intelligence sharing hub' },
  { id: 'brasilia', name: 'Brasília', country: 'Brazil', lat: -15.8267, lng: -47.9218, type: 'capital', population: '3.1M', populationNum: 3100000, strategicImportance: 'low', strategicNotes: 'Regional military command, Amazon monitoring' },
  { id: 'havana', name: 'Havana', country: 'Cuba', lat: 23.1136, lng: -82.3666, type: 'capital', population: '2.1M', populationNum: 2100000, strategicImportance: 'medium', strategicNotes: 'US proximity surveillance, port facilities' },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, type: 'capital', population: '21.8M', populationNum: 21800000, strategicImportance: 'medium', strategicNotes: 'Border security coordination, drug cartel ops' },
  { id: 'ottawa', name: 'Ottawa', country: 'Canada', lat: 45.4215, lng: -75.6972, type: 'capital', population: '1.0M', populationNum: 1000000, strategicImportance: 'medium', strategicNotes: 'NORAD coordination, Arctic monitoring' }
]

interface CountryLabel {
  id: string
  name: string
  lat: number
  lng: number
  code: string
}

const countryLabels: CountryLabel[] = [
  { id: 'usa', name: 'UNITED STATES', lat: 39.8283, lng: -98.5795, code: 'US' },
  { id: 'russia', name: 'RUSSIA', lat: 61.5240, lng: 105.3188, code: 'RU' },
  { id: 'china', name: 'CHINA', lat: 35.8617, lng: 104.1954, code: 'CN' },
  { id: 'india', name: 'INDIA', lat: 20.5937, lng: 78.9629, code: 'IN' },
  { id: 'brazil', name: 'BRAZIL', lat: -14.2350, lng: -51.9253, code: 'BR' },
  { id: 'australia', name: 'AUSTRALIA', lat: -25.2744, lng: 133.7751, code: 'AU' },
  { id: 'canada', name: 'CANADA', lat: 56.1304, lng: -106.3468, code: 'CA' },
  { id: 'iran', name: 'IRAN', lat: 32.4279, lng: 53.6880, code: 'IR' },
  { id: 'saudi', name: 'SAUDI ARABIA', lat: 23.8859, lng: 45.0792, code: 'SA' },
  { id: 'egypt', name: 'EGYPT', lat: 26.8206, lng: 30.8025, code: 'EG' },
  { id: 'turkey', name: 'TURKEY', lat: 38.9637, lng: 35.2433, code: 'TR' },
  { id: 'ukraine', name: 'UKRAINE', lat: 48.3794, lng: 31.1656, code: 'UA' },
  { id: 'france', name: 'FRANCE', lat: 46.2276, lng: 2.2137, code: 'FR' },
  { id: 'germany', name: 'GERMANY', lat: 51.1657, lng: 10.4515, code: 'DE' },
  { id: 'uk', name: 'UNITED KINGDOM', lat: 55.3781, lng: -3.4360, code: 'GB' },
  { id: 'japan', name: 'JAPAN', lat: 36.2048, lng: 138.2529, code: 'JP' },
  { id: 'skorea', name: 'SOUTH KOREA', lat: 35.9078, lng: 127.7669, code: 'KR' },
  { id: 'nkorea', name: 'NORTH KOREA', lat: 40.3399, lng: 127.5101, code: 'KP' },
  { id: 'mexico', name: 'MEXICO', lat: 23.6345, lng: -102.5528, code: 'MX' },
  { id: 'indonesia', name: 'INDONESIA', lat: -0.7893, lng: 113.9213, code: 'ID' }
]

interface Globe3DProps {
  onThreatSelect?: (threat: ThreatLocation) => void
}

export function Globe3D({ onThreatSelect }: Globe3DProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const cityMarkersRef = useRef<mapboxgl.Marker[]>([])
  const countryLabelsRef = useRef<mapboxgl.Marker[]>([])
  
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null)
  const [hoveredThreat, setHoveredThreat] = useState<ThreatLocation | null>(null)
  const [hoveredCity, setHoveredCity] = useState<CityMarker | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [is3D, setIs3D] = useState(true)
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'terrain'>('satellite')
  const [weatherLayers, setWeatherLayers] = useState<Set<string>>(new Set())
  const [showTrajectories, setShowTrajectories] = useState(true)
  const [showLegend, setShowLegend] = useState(false)
  const [showCities, setShowCities] = useState(true)
  const [showCountries, setShowCountries] = useState(true)
  const [satelliteImageryType, setSatelliteImageryType] = useState<'standard' | 'live' | 'infrared' | 'radar'>('standard')
  const [satelliteOpacity, setSatelliteOpacity] = useState(1.0)
  
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
      zoom: 2.2,
      pitch: is3D ? 35 : 0,
      bearing: 0,
      antialias: true,
      maxZoom: 18,
      minZoom: 1.5
    })

    mapRef.current = map

    map.on('style.load', () => {
      if (!map || !mapRef.current) return

      try {
        map.setFog({
          color: 'rgb(220, 235, 255)',
          'high-color': 'rgb(50, 120, 240)',
          'horizon-blend': 0.06,
          'space-color': 'rgb(8, 10, 30)',
          'star-intensity': 0.8
        })

        if (!map.getSource('mapbox-dem')) {
          map.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 14
          })
        }

        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })

        const atmosphereLayer = {
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere' as const,
            'sky-atmosphere-sun': [0.0, 15.0] as [number, number],
            'sky-atmosphere-sun-intensity': 15
          }
        }
        
        if (!map.getLayer('sky')) {
          map.addLayer(atmosphereLayer as any)
        }

        if (mapStyle === 'dark') {
          if (!map.getLayer('country-borders')) {
            map.addLayer({
              id: 'country-borders',
              type: 'line',
              source: {
                type: 'vector',
                url: 'mapbox://mapbox.country-boundaries-v1'
              },
              'source-layer': 'country_boundaries',
              paint: {
                'line-color': '#4488ff',
                'line-width': 2,
                'line-opacity': 0.8
              }
            })
          }

          if (!map.getLayer('ocean-layer')) {
            map.addLayer({
              id: 'ocean-layer',
              type: 'background',
              paint: {
                'background-color': '#0a2a4a'
              }
            }, 'country-borders')
          }

          if (!map.getLayer('land-layer') && map.getLayer('land')) {
            map.setPaintProperty('land', 'background-color', '#1a3d28')
          }
        }
      } catch (error) {
        console.warn('Error setting up map style:', error)
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

    if (showCities) {
      majorCities.forEach((city) => {
        const el = document.createElement('div')
        el.className = 'city-marker'
        el.style.position = 'relative'
        el.style.cursor = 'pointer'
        
        const getImportanceColor = (importance: string) => {
          switch (importance) {
            case 'critical': return { bg: '#ff3333', border: '#ff6666', glow: 'rgba(255, 51, 51, 0.8)' }
            case 'high': return { bg: '#ffaa33', border: '#ffcc66', glow: 'rgba(255, 170, 51, 0.7)' }
            case 'medium': return { bg: '#4488ff', border: '#6699ff', glow: 'rgba(68, 136, 255, 0.6)' }
            case 'low': return { bg: '#33ff88', border: '#66ffaa', glow: 'rgba(51, 255, 136, 0.5)' }
            default: return { bg: '#aaccff', border: '#6699ff', glow: 'rgba(102, 153, 255, 0.4)' }
          }
        }
        
        const colors = getImportanceColor(city.strategicImportance)
        const isCritical = city.strategicImportance === 'critical'
        const isCapital = city.type === 'capital'
        
        const dot = document.createElement('div')
        dot.style.width = isCritical ? '10px' : (isCapital ? '8px' : '6px')
        dot.style.height = isCritical ? '10px' : (isCapital ? '8px' : '6px')
        dot.style.borderRadius = '50%'
        dot.style.backgroundColor = colors.bg
        dot.style.border = `${isCritical ? '2.5px' : (isCapital ? '2px' : '1.5px')} solid ${colors.border}`
        dot.style.boxShadow = `0 0 ${isCritical ? '15px' : '10px'} ${colors.glow}`
        dot.style.transition = 'all 0.3s ease'
        dot.style.zIndex = isCritical ? '8' : '5'
        
        if (isCritical) {
          dot.style.animation = 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }
        
        const label = document.createElement('div')
        label.textContent = city.name
        label.style.position = 'absolute'
        label.style.top = isCritical ? '14px' : (isCapital ? '12px' : '10px')
        label.style.left = '50%'
        label.style.transform = 'translateX(-50%)'
        label.style.whiteSpace = 'nowrap'
        label.style.fontSize = isCritical ? '11px' : (isCapital ? '10px' : '9px')
        label.style.fontFamily = 'JetBrains Mono, monospace'
        label.style.fontWeight = isCritical ? '700' : (isCapital ? '600' : '500')
        label.style.color = '#ffffff'
        label.style.textShadow = '0 0 4px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.6)'
        label.style.pointerEvents = 'none'
        label.style.opacity = '0.85'
        label.style.letterSpacing = '0.02em'
        
        el.appendChild(dot)
        el.appendChild(label)

        el.addEventListener('mouseenter', (e) => {
          setHoveredCity(city)
          setMousePos({ x: e.clientX, y: e.clientY })
          dot.style.transform = 'scale(1.5)'
          dot.style.boxShadow = `0 0 ${isCritical ? '25px' : '18px'} ${colors.glow}`
          label.style.opacity = '1'
          label.style.fontWeight = '700'
        })

        el.addEventListener('mouseleave', () => {
          setHoveredCity(null)
          dot.style.transform = 'scale(1)'
          dot.style.boxShadow = `0 0 ${isCritical ? '15px' : '10px'} ${colors.glow}`
          label.style.opacity = '0.85'
          label.style.fontWeight = isCritical ? '700' : (isCapital ? '600' : '500')
        })

        el.addEventListener('click', () => {
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [city.lng, city.lat],
              zoom: 8,
              pitch: 50,
              duration: 2000
            })
          }
        })

        const cityMarker = new mapboxgl.Marker(el)
          .setLngLat([city.lng, city.lat])
          .addTo(map)

        cityMarkersRef.current.push(cityMarker)
      })
    }

    if (showCountries) {
      countryLabels.forEach((country) => {
        const el = document.createElement('div')
        el.className = 'country-label'
        el.textContent = country.name
        el.style.fontSize = '11px'
        el.style.fontFamily = 'Space Grotesk, sans-serif'
        el.style.fontWeight = '700'
        el.style.color = '#6699ff'
        el.style.textShadow = '0 0 8px rgba(0, 0, 0, 0.9), 0 2px 4px rgba(0, 0, 0, 0.7)'
        el.style.letterSpacing = '0.15em'
        el.style.pointerEvents = 'none'
        el.style.opacity = '0.7'
        el.style.whiteSpace = 'nowrap'
        el.style.padding = '2px 6px'
        el.style.borderRadius = '3px'
        el.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
        el.style.backdropFilter = 'blur(4px)'
        
        const countryMarker = new mapboxgl.Marker(el)
          .setLngLat([country.lng, country.lat])
          .addTo(map)

        countryLabelsRef.current.push(countryMarker)
      })
    }

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

    const animationFrames: number[] = []

    const addTrajectories = () => {
      if (!map || !map.isStyleLoaded()) return
      
      if (showTrajectories) {
        missileTrajectories.forEach((trajectory) => {
          const sourceId = `trajectory-${trajectory.id}`
          const lineLayerId = `trajectory-line-${trajectory.id}`
          const particleLayerId = `trajectory-particle-${trajectory.id}`
          
          const path = createCurvedPath(
            [trajectory.from.lng, trajectory.from.lat],
            [trajectory.to.lng, trajectory.to.lat],
            trajectory.type === 'hypersonic' ? 0.15 : trajectory.type === 'ballistic' ? 0.25 : 0.1
          )

          try {
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

              if (!map.getLayer(lineLayerId)) {
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
              }

              const particleSourceId = `${sourceId}-particle`
              if (!map.getSource(particleSourceId)) {
                map.addSource(particleSourceId, {
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
              }

              if (!map.getLayer(particleLayerId)) {
                map.addLayer({
                  id: particleLayerId,
                  type: 'circle',
                  source: particleSourceId,
                  paint: {
                    'circle-radius': 5,
                    'circle-color': trajectoryColor,
                    'circle-blur': 0.3,
                    'circle-opacity': 0.9
                  }
                })
              }

              let particleIndex = 0
              const speed = trajectory.type === 'hypersonic' ? 3 : trajectory.type === 'ballistic' ? 2 : 1
              let animationFrame: number
              
              const animateParticle = () => {
                if (!map || !mapRef.current) return
                
                const particleSource = map.getSource(particleSourceId)
                if (!particleSource) return
                
                particleIndex = (particleIndex + speed) % path.length
                
                try {
                  if (particleSource && (particleSource as mapboxgl.GeoJSONSource).setData) {
                    (particleSource as mapboxgl.GeoJSONSource).setData({
                      type: 'Feature',
                      properties: {},
                      geometry: {
                        type: 'Point',
                        coordinates: path[Math.floor(particleIndex)]
                      }
                    })
                  }
                } catch (error) {
                  console.warn(`Error animating trajectory particle:`, error)
                  return
                }
                
                animationFrame = requestAnimationFrame(animateParticle)
                animationFrames.push(animationFrame)
              }
              
              animateParticle()
            }
          } catch (error) {
            console.warn(`Error adding trajectory ${trajectory.id}:`, error)
          }
        })
      }
    }

    if (map.isStyleLoaded()) {
      addTrajectories()
    } else {
      map.once('style.load', addTrajectories)
    }

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
      animationFrames.forEach(frame => cancelAnimationFrame(frame))
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      cityMarkersRef.current.forEach(marker => marker.remove())
      cityMarkersRef.current = []
      countryLabelsRef.current.forEach(marker => marker.remove())
      countryLabelsRef.current = []
      if (map) {
        map.remove()
      }
      mapRef.current = null
    }
  }, [is3D, mapStyle, onThreatSelect, showTrajectories, showCities, showCountries, satelliteImageryType, satelliteOpacity])

  useEffect(() => {
    if (!mapRef.current) return
    
    const map = mapRef.current

    const updateWeatherLayers = () => {
      if (!map || !mapRef.current || !map.isStyleLoaded()) return

      const layersToAdd: Array<{ id: string, type: WeatherLayerType }> = [
        { id: 'precipitation-layer', type: 'precipitation' },
        { id: 'wind-layer', type: 'wind' },
        { id: 'temperature-layer', type: 'temperature' },
        { id: 'clouds-layer', type: 'clouds' }
      ]

      layersToAdd.forEach(({ id, type }) => {
        try {
          const source = map.getSource(id)
          
          if (!source) {
            map.addSource(id, {
              type: 'raster',
              tiles: [getWeatherTileUrl(type)],
              tileSize: 256
            })

            if (!map.getLayer(id)) {
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
            }
          } else {
            const layer = map.getLayer(id)
            if (layer) {
              map.setLayoutProperty(
                id,
                'visibility',
                weatherLayers.has(type) ? 'visible' : 'none'
              )
            }
          }
        } catch (error) {
          console.warn(`Error updating weather layer ${id}:`, error)
        }
      })
    }

    if (map.isStyleLoaded()) {
      updateWeatherLayers()
    } else {
      const handler = map.once('style.load', updateWeatherLayers)
    }
  }, [weatherLayers])

  useEffect(() => {
    if (!mapRef.current || mapStyle !== 'satellite') return
    
    const map = mapRef.current

    const updateSatelliteImagery = () => {
      if (!map || !mapRef.current || !map.isStyleLoaded()) return

      try {
        const layerId = 'satellite-overlay-layer'
        const sourceId = 'satellite-overlay-source'
        
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId)
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId)
        }

        if (satelliteImageryType !== 'standard') {
          let tileUrl = ''
          
          switch (satelliteImageryType) {
            case 'live':
              tileUrl = 'mapbox://styles/mapbox/satellite-v9'
              break
            case 'infrared':
              tileUrl = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg'
              break
            case 'radar':
              tileUrl = 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=demo'
              break
          }

          if (satelliteImageryType === 'infrared' || satelliteImageryType === 'radar') {
            map.addSource(sourceId, {
              type: 'raster',
              tiles: [tileUrl],
              tileSize: 256
            })

            map.addLayer({
              id: layerId,
              type: 'raster',
              source: sourceId,
              paint: {
                'raster-opacity': satelliteOpacity,
                'raster-fade-duration': 300
              }
            })
          }
        }
      } catch (error) {
        console.warn('Error updating satellite imagery:', error)
      }
    }

    if (map.isStyleLoaded()) {
      updateSatelliteImagery()
    } else {
      map.once('style.load', updateSatelliteImagery)
    }
  }, [satelliteImageryType, satelliteOpacity, mapStyle])

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

  const getSatelliteImageryLabel = (type: 'standard' | 'live' | 'infrared' | 'radar') => {
    switch (type) {
      case 'standard': return 'Standard Satellite'
      case 'live': return 'Live Feed'
      case 'infrared': return 'Infrared'
      case 'radar': return 'Radar Imagery'
    }
  }

  const getSatelliteImageryIcon = (type: 'standard' | 'live' | 'infrared' | 'radar') => {
    switch (type) {
      case 'standard': return Planet
      case 'live': return Broadcast
      case 'infrared': return Thermometer
      case 'radar': return Eye
    }
  }

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [20, 30],
        zoom: 2.2,
        pitch: is3D ? 35 : 0,
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
        pitch: newIs3D ? 35 : 0,
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
          {showCities && (
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50 font-mono text-xs uppercase">
              {majorCities.length} Cities
            </Badge>
          )}
          {showCountries && (
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50 font-mono text-xs uppercase">
              {countryLabels.length} Countries
            </Badge>
          )}
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
          {satelliteImageryType !== 'standard' && mapStyle === 'satellite' && (
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent/50 font-mono text-xs uppercase">
              {getSatelliteImageryLabel(satelliteImageryType)} Active
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
            onClick={() => setShowCities(!showCities)}
            className={`bg-background/80 backdrop-blur-sm gap-2 ${showCities ? 'border-primary text-primary' : ''}`}
            title={showCities ? "Hide City Markers" : "Show City Markers"}
          >
            <MapPin size={16} weight={showCities ? 'fill' : 'regular'} />
            <span className="hidden sm:inline text-xs font-mono">Cities</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCountries(!showCountries)}
            className={`bg-background/80 backdrop-blur-sm gap-2 ${showCountries ? 'border-primary text-primary' : ''}`}
            title={showCountries ? "Hide Country Labels" : "Show Country Labels"}
          >
            <MapPinLine size={16} weight={showCountries ? 'fill' : 'regular'} />
            <span className="hidden sm:inline text-xs font-mono">Countries</span>
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
                <span className="font-mono text-xs">Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setMapStyle('satellite')}
                className={mapStyle === 'satellite' ? 'bg-primary/20 text-primary' : ''}
              >
                <span className="font-mono text-xs">Satellite</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setMapStyle('terrain')}
                className={mapStyle === 'terrain' ? 'bg-primary/20 text-primary' : ''}
              >
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
          {hoveredCity && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none z-20 bg-card/95 backdrop-blur-md border border-primary/50 rounded-lg p-3 shadow-lg"
              style={{
                left: mousePos.x + 15,
                top: mousePos.y - 80,
                maxWidth: '280px'
              }}
            >
              <div className="flex items-start gap-2 mb-2">
                <MapPin size={16} weight="fill" className="text-primary mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm uppercase tracking-wide mb-0.5">
                    {hoveredCity.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-mono mb-1">
                    {hoveredCity.country}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge className="text-[10px] font-mono uppercase px-1.5 py-0 bg-primary/20 text-primary border-primary/30">
                      {hoveredCity.type === 'capital' ? 'Capital' : hoveredCity.type === 'strategic' ? 'Strategic' : 'Major City'}
                    </Badge>
                    <Badge className={`text-[10px] font-mono uppercase px-1.5 py-0 ${
                      hoveredCity.strategicImportance === 'critical' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                      hoveredCity.strategicImportance === 'high' ? 'bg-warning/20 text-warning border-warning/30' :
                      hoveredCity.strategicImportance === 'medium' ? 'bg-primary/20 text-primary border-primary/30' :
                      'bg-success/20 text-success border-success/30'
                    }`}>
                      {hoveredCity.strategicImportance}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-mono">Population:</span>
                  <span className="font-semibold">{hoveredCity.population}</span>
                </div>
                <div className="pt-1 border-t border-border/50">
                  <p className="text-[11px] text-foreground/80 leading-relaxed">
                    {hoveredCity.strategicNotes}
                  </p>
                </div>
              </div>
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
