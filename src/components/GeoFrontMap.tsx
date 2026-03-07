import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MapTrifold, 
  Target, 
  ShieldWarning, 
  Buildings,
  Users,
  Flag,
  Crosshair,
  Broadcast,
  Lightning,
  GlobeHemisphereWest,
  MapPin,
  Circle,
  Polygon as PolygonIcon,
  Path,
  SealWarning,
  CheckCircle,
  Eye
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface ConflictZone {
  id: string
  name: string
  type: 'hot-zone' | 'disputed' | 'border-tension' | 'militarized' | 'peacekeeping' | 'demilitarized-zone'
  status: 'active' | 'escalating' | 'de-escalating' | 'frozen' | 'resolved'
  severity: 'critical' | 'high' | 'medium' | 'low'
  coordinates: { lat: number; lng: number }
  bounds: { north: number; south: number; east: number; west: number }
  parties: string[]
  civiliancasualties?: number
  militarypresence: string[]
  description: string
  lastUpdate: string
  controlledBy?: string
  area: number
}

interface TerritorialBoundary {
  id: string
  name: string
  type: 'international' | 'disputed' | 'ceasefire-line' | 'demilitarized-zone' | 'exclusion-zone'
  countries: string[]
  status: 'stable' | 'contested' | 'violated' | 'monitored'
  coordinates: Array<{ lat: number; lng: number }>
  incidents: number
  lastIncident?: string
}

interface MilitaryBase {
  id: string
  name: string
  country: string
  type: 'army' | 'navy' | 'air-force' | 'joint' | 'intelligence' | 'missile-defense'
  coordinates: { lat: number; lng: number }
  personnel?: number
  capabilities: string[]
  status: 'active' | 'elevated' | 'standby'
}

export function GeoFrontMap({ onZoneSelect }: { onZoneSelect?: (zone: ConflictZone) => void }) {
  const [activeTab, setActiveTab] = useState('zones')
  const [selectedZone, setSelectedZone] = useState<ConflictZone | null>(null)
  const [selectedBoundary, setSelectedBoundary] = useState<TerritorialBoundary | null>(null)
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'standard' | 'satellite' | 'tactical'>('tactical')
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const conflictZones: ConflictZone[] = [
    {
      id: 'cz-001',
      name: 'Gaza Strip - Israel Border',
      type: 'hot-zone',
      status: 'active',
      severity: 'critical',
      coordinates: { lat: 31.3547, lng: 34.3088 },
      bounds: { north: 31.5, south: 31.2, east: 34.6, west: 34.2 },
      parties: ['Israel', 'Palestinian Armed Groups', 'Hamas'],
      civiliancasualties: 45000,
      militarypresence: ['IDF Ground Forces', 'Air Support Units', 'Iron Dome Batteries'],
      description: 'Active conflict zone with ongoing military operations. Urban warfare with significant civilian presence. Multiple air defense systems active.',
      lastUpdate: '2026-01-15T14:23:00Z',
      controlledBy: 'Contested',
      area: 365
    },
    {
      id: 'cz-002',
      name: 'Strait of Hormuz',
      type: 'militarized',
      status: 'escalating',
      severity: 'critical',
      coordinates: { lat: 26.5667, lng: 56.2500 },
      bounds: { north: 27.0, south: 26.0, east: 57.0, west: 55.5 },
      parties: ['Iran', 'USA', 'GCC Coalition', 'Royal Navy'],
      militarypresence: ['Iranian Navy', 'US 5th Fleet', 'IRGC Coastal Defense', 'UAE Naval Forces'],
      description: 'Strategic maritime chokepoint with 21% of global oil transit. Iranian naval exercises in proximity to coalition vessels. Heightened tensions following regional incidents.',
      lastUpdate: '2026-01-15T16:45:00Z',
      area: 1600,
      civiliancasualties: 0
    },
    {
      id: 'cz-003',
      name: 'Eastern Ukraine - Donbas Region',
      type: 'hot-zone',
      status: 'active',
      severity: 'high',
      coordinates: { lat: 48.0159, lng: 37.8028 },
      bounds: { north: 49.5, south: 47.0, east: 39.5, west: 36.0 },
      parties: ['Ukraine', 'Russia'],
      civiliancasualties: 12000,
      militarypresence: ['Ukrainian Armed Forces', 'Russian Ground Forces', 'Wagner Group PMC'],
      description: 'Ongoing territorial conflict with entrenched positions. Artillery exchanges and drone reconnaissance activity. International peacekeeping discussions stalled.',
      lastUpdate: '2026-01-15T12:10:00Z',
      controlledBy: 'Divided',
      area: 8400
    },
    {
      id: 'cz-004',
      name: 'Taiwan Strait',
      type: 'militarized',
      status: 'escalating',
      severity: 'high',
      coordinates: { lat: 24.5, lng: 120.0 },
      bounds: { north: 26.0, south: 23.0, east: 122.0, west: 118.0 },
      parties: ['China', 'Taiwan', 'USA (7th Fleet)'],
      militarypresence: ['PLA Navy', 'ROCAF', 'US Carrier Strike Group', 'PLA Air Force'],
      description: 'High-tension maritime zone with frequent military exercises. Multiple air defense identification zones overlap. Naval patrols at heightened readiness.',
      lastUpdate: '2026-01-15T18:30:00Z',
      area: 180000,
      civiliancasualties: 0
    },
    {
      id: 'cz-005',
      name: 'Kashmir - Line of Control',
      type: 'border-tension',
      status: 'frozen',
      severity: 'medium',
      coordinates: { lat: 34.0837, lng: 74.7973 },
      bounds: { north: 36.0, south: 32.5, east: 76.5, west: 73.0 },
      parties: ['India', 'Pakistan', 'China'],
      civiliancasualties: 3200,
      militarypresence: ['Indian Army', 'Pakistan Army', 'PLA Border Forces'],
      description: 'Long-standing territorial dispute with frozen ceasefire line. Periodic border skirmishes and artillery duels. Three nuclear powers involved.',
      lastUpdate: '2026-01-14T09:15:00Z',
      controlledBy: 'Divided',
      area: 5500
    },
    {
      id: 'cz-006',
      name: 'South China Sea - Spratly Islands',
      type: 'disputed',
      status: 'escalating',
      severity: 'high',
      coordinates: { lat: 10.0, lng: 114.0 },
      bounds: { north: 12.0, south: 8.0, east: 118.0, west: 110.0 },
      parties: ['China', 'Vietnam', 'Philippines', 'Malaysia', 'Taiwan', 'Brunei'],
      militarypresence: ['PLA Navy', 'Vietnam Coast Guard', 'Philippine Navy', 'US 7th Fleet'],
      description: 'Multi-party territorial dispute over strategic islands and maritime resources. Artificial island military installations. Freedom of navigation operations contested.',
      lastUpdate: '2026-01-15T11:20:00Z',
      area: 425000,
      civiliancasualties: 0
    },
    {
      id: 'cz-007',
      name: 'Korean Peninsula - DMZ',
      type: 'demilitarized-zone',
      status: 'frozen',
      severity: 'medium',
      coordinates: { lat: 38.0, lng: 127.5 },
      bounds: { north: 38.3, south: 37.7, east: 128.5, west: 126.0 },
      parties: ['North Korea', 'South Korea', 'UN Command'],
      militarypresence: ['KPA', 'ROK Armed Forces', 'US Forces Korea'],
      description: 'Most heavily fortified border in the world. Constant surveillance and military readiness. Periodic provocations and nuclear development concerns.',
      lastUpdate: '2026-01-15T07:45:00Z',
      controlledBy: 'Buffer Zone',
      area: 907
    },
    {
      id: 'cz-008',
      name: 'Syrian Northwest - Idlib Province',
      type: 'hot-zone',
      status: 'active',
      severity: 'high',
      coordinates: { lat: 35.9333, lng: 36.6333 },
      bounds: { north: 36.5, south: 35.0, east: 37.5, west: 36.0 },
      parties: ['Syrian Government', 'Opposition Forces', 'Turkey', 'Russia'],
      civiliancasualties: 8500,
      militarypresence: ['SAA', 'Turkish Armed Forces', 'Russian Air Force', 'HTS'],
      description: 'Last major opposition-held territory. Turkish observation posts established. Russian and Syrian government air operations continue. Humanitarian crisis ongoing.',
      lastUpdate: '2026-01-15T13:55:00Z',
      controlledBy: 'Opposition',
      area: 6100
    },
    {
      id: 'cz-009',
      name: 'Red Sea - Bab-el-Mandeb Strait',
      type: 'militarized',
      status: 'active',
      severity: 'high',
      coordinates: { lat: 12.6, lng: 43.3 },
      bounds: { north: 13.0, south: 12.0, east: 44.0, west: 42.5 },
      parties: ['Yemen', 'Saudi Arabia', 'Houthi Forces', 'International Coalition'],
      militarypresence: ['Saudi-led Coalition', 'Houthi Naval Units', 'International Maritime Security Patrol'],
      description: 'Strategic maritime chokepoint connecting Red Sea to Gulf of Aden. Ongoing Houthi attacks on commercial shipping. Anti-ship missile and drone threats active.',
      lastUpdate: '2026-01-15T15:40:00Z',
      area: 3800,
      civiliancasualties: 1200
    },
    {
      id: 'cz-010',
      name: 'Nagorno-Karabakh',
      type: 'disputed',
      status: 'de-escalating',
      severity: 'medium',
      coordinates: { lat: 39.8, lng: 46.75 },
      bounds: { north: 40.5, south: 39.0, east: 47.5, west: 46.0 },
      parties: ['Armenia', 'Azerbaijan', 'Russia (Peacekeepers)'],
      civiliancasualties: 5600,
      militarypresence: ['Azerbaijani Army', 'Russian Peacekeeping Forces'],
      description: 'Post-conflict stabilization with Russian peacekeeping presence. Ethnic tensions remain high. Border demarcation disputes ongoing. Drone warfare legacy.',
      lastUpdate: '2026-01-14T16:25:00Z',
      controlledBy: 'Azerbaijan',
      area: 4400
    }
  ]

  const territorialBoundaries: TerritorialBoundary[] = [
    {
      id: 'tb-001',
      name: 'India-Pakistan Border (Kashmir Sector)',
      type: 'ceasefire-line',
      countries: ['India', 'Pakistan'],
      status: 'contested',
      coordinates: [
        { lat: 32.5, lng: 74.0 },
        { lat: 34.0, lng: 75.5 },
        { lat: 35.5, lng: 76.8 },
        { lat: 36.0, lng: 77.5 }
      ],
      incidents: 47,
      lastIncident: '2026-01-12T03:20:00Z'
    },
    {
      id: 'tb-002',
      name: 'Israeli Security Barrier - West Bank',
      type: 'disputed',
      countries: ['Israel', 'Palestine'],
      status: 'contested',
      coordinates: [
        { lat: 32.5, lng: 35.2 },
        { lat: 32.0, lng: 35.15 },
        { lat: 31.5, lng: 35.1 },
        { lat: 31.0, lng: 35.0 }
      ],
      incidents: 89,
      lastIncident: '2026-01-14T18:45:00Z'
    },
    {
      id: 'tb-003',
      name: 'Korean DMZ',
      type: 'demilitarized-zone',
      countries: ['North Korea', 'South Korea'],
      status: 'monitored',
      coordinates: [
        { lat: 38.0, lng: 126.0 },
        { lat: 38.05, lng: 127.0 },
        { lat: 38.1, lng: 128.0 },
        { lat: 38.0, lng: 128.5 }
      ],
      incidents: 12,
      lastIncident: '2026-01-08T11:30:00Z'
    },
    {
      id: 'tb-004',
      name: 'Ukraine-Russia Border (Eastern Sector)',
      type: 'ceasefire-line',
      countries: ['Ukraine', 'Russia'],
      status: 'violated',
      coordinates: [
        { lat: 49.5, lng: 36.5 },
        { lat: 49.0, lng: 37.0 },
        { lat: 48.5, lng: 38.0 },
        { lat: 47.5, lng: 39.0 }
      ],
      incidents: 234,
      lastIncident: '2026-01-15T06:15:00Z'
    },
    {
      id: 'tb-005',
      name: 'Cyprus Green Line',
      type: 'demilitarized-zone',
      countries: ['Cyprus', 'Turkey (Northern Cyprus)'],
      status: 'stable',
      coordinates: [
        { lat: 35.2, lng: 32.9 },
        { lat: 35.18, lng: 33.3 },
        { lat: 35.15, lng: 33.7 },
        { lat: 35.1, lng: 34.0 }
      ],
      incidents: 3,
      lastIncident: '2025-11-22T14:00:00Z'
    }
  ]

  const militaryBases: MilitaryBase[] = [
    {
      id: 'mb-001',
      name: 'Al Udeid Air Base',
      country: 'Qatar (US)',
      type: 'air-force',
      coordinates: { lat: 25.1173, lng: 51.3150 },
      personnel: 11000,
      capabilities: ['Air Superiority', 'Strategic Bombing', 'Refueling', 'ISR', 'Command & Control'],
      status: 'elevated'
    },
    {
      id: 'mb-002',
      name: 'Camp Lemonnier',
      country: 'Djibouti (US)',
      type: 'joint',
      coordinates: { lat: 11.5450, lng: 43.1494 },
      personnel: 4000,
      capabilities: ['Special Operations', 'Counter-Terrorism', 'Maritime Security', 'Drone Operations'],
      status: 'active'
    },
    {
      id: 'mb-003',
      name: 'Tartus Naval Base',
      country: 'Syria (Russia)',
      type: 'navy',
      coordinates: { lat: 34.8833, lng: 35.8833 },
      personnel: 2500,
      capabilities: ['Naval Port', 'Submarine Support', 'Ship Repair', 'Mediterranean Fleet Hub'],
      status: 'elevated'
    },
    {
      id: 'mb-004',
      name: 'Ramstein Air Base',
      country: 'Germany (US)',
      type: 'air-force',
      coordinates: { lat: 49.4369, lng: 7.6003 },
      personnel: 54000,
      capabilities: ['NATO Command', 'Air Operations Center', 'Medical Hub', 'Strategic Airlift'],
      status: 'active'
    },
    {
      id: 'mb-005',
      name: 'Guam - Andersen AFB',
      country: 'USA',
      type: 'air-force',
      coordinates: { lat: 13.5839, lng: 144.9306 },
      personnel: 6000,
      capabilities: ['Strategic Bombing', 'Pacific Deterrence', 'B-52 Operations', 'Missile Defense Radar'],
      status: 'elevated'
    },
    {
      id: 'mb-006',
      name: 'Diego Garcia',
      country: 'UK (US)',
      type: 'joint',
      coordinates: { lat: -7.3167, lng: 72.4167 },
      personnel: 3000,
      capabilities: ['Strategic Bomber Forward Ops', 'Naval Support', 'Maritime Patrol', 'Pre-positioning Ships'],
      status: 'active'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive'
      case 'high': return 'text-accent'
      case 'medium': return 'text-warning'
      case 'low': return 'text-success'
      default: return 'text-muted-foreground'
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/10 border-destructive'
      case 'high': return 'bg-accent/10 border-accent'
      case 'medium': return 'bg-warning/10 border-warning'
      case 'low': return 'bg-success/10 border-success'
      default: return 'bg-muted/10 border-muted'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Lightning size={16} weight="fill" className="text-destructive" />
      case 'escalating': return <SealWarning size={16} weight="fill" className="text-accent" />
      case 'de-escalating': return <CheckCircle size={16} weight="fill" className="text-success" />
      case 'frozen': return <Eye size={16} weight="fill" className="text-muted-foreground" />
      case 'resolved': return <CheckCircle size={16} weight="fill" className="text-success" />
      default: return <Circle size={16} />
    }
  }

  const handleZoneClick = (zone: ConflictZone) => {
    setSelectedZone(zone)
    if (onZoneSelect) {
      onZoneSelect(zone)
    }
    toast.info(`Selected: ${zone.name}`)
  }

  const handleBoundaryClick = (boundary: TerritorialBoundary) => {
    setSelectedBoundary(boundary)
    toast.info(`Boundary: ${boundary.name}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center">
            <GlobeHemisphereWest size={20} weight="fill" className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide">Geospatial Intelligence</h2>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
              Conflict Zones // Boundaries // Military Infrastructure
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Target size={14} weight="fill" />
            {conflictZones.filter(z => z.status === 'active').length} Active Zones
          </Badge>
          <Badge variant="outline" className="gap-1">
            <ShieldWarning size={14} weight="fill" />
            {conflictZones.filter(z => z.severity === 'critical').length} Critical
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="zones" className="gap-2">
            <Target size={16} weight="fill" />
            <span className="hidden sm:inline">Conflict Zones</span>
          </TabsTrigger>
          <TabsTrigger value="boundaries" className="gap-2">
            <Path size={16} weight="bold" />
            <span className="hidden sm:inline">Boundaries</span>
          </TabsTrigger>
          <TabsTrigger value="bases" className="gap-2">
            <Buildings size={16} weight="fill" />
            <span className="hidden sm:inline">Military Bases</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-2">
            <MapTrifold size={16} weight="fill" />
            <span className="hidden sm:inline">Interactive Map</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {conflictZones.map((zone) => (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer border-2 transition-all hover:shadow-lg ${
                      selectedZone?.id === zone.id ? 'border-primary shadow-lg' : getSeverityBg(zone.severity)
                    }`}
                    onClick={() => handleZoneClick(zone)}
                    onMouseEnter={() => setHoveredFeature(zone.id)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-sm uppercase tracking-wide">{zone.name}</h3>
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            {zone.coordinates.lat.toFixed(4)}°N, {zone.coordinates.lng.toFixed(4)}°E
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          {getStatusIcon(zone.status)}
                          <Badge variant="outline" className={`text-[10px] uppercase ${getSeverityColor(zone.severity)}`}>
                            {zone.severity}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-[10px] uppercase">
                          {zone.type.replace('-', ' ')}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] uppercase">
                          {zone.status}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {zone.area.toLocaleString()} km²
                        </Badge>
                      </div>

                      <p className="text-xs text-foreground/80 line-clamp-2">
                        {zone.description}
                      </p>

                      <div className="pt-2 border-t border-border space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Flag size={14} className="text-muted-foreground" />
                          <span className="text-muted-foreground">Parties:</span>
                          <span className="font-mono">{zone.parties.join(', ')}</span>
                        </div>

                        {zone.civiliancasualties !== undefined && zone.civiliancasualties > 0 && (
                          <div className="flex items-center gap-2 text-xs">
                            <Users size={14} className="text-destructive" />
                            <span className="text-muted-foreground">Casualties:</span>
                            <span className="font-mono text-destructive">
                              {zone.civiliancasualties.toLocaleString()}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs">
                          <Broadcast size={14} className="text-muted-foreground" />
                          <span className="text-muted-foreground">Last Update:</span>
                          <span className="font-mono">
                            {new Date(zone.lastUpdate).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {zone.militarypresence.length > 0 && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                            Military Presence
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {zone.militarypresence.map((force, idx) => (
                              <Badge key={idx} variant="outline" className="text-[9px]">
                                {force}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="boundaries" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {territorialBoundaries.map((boundary) => (
                <motion.div
                  key={boundary.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer border-2 transition-all hover:shadow-lg ${
                      selectedBoundary?.id === boundary.id ? 'border-primary shadow-lg' : 'border-border'
                    } ${boundary.status === 'violated' ? 'bg-destructive/5' : boundary.status === 'contested' ? 'bg-accent/5' : ''}`}
                    onClick={() => handleBoundaryClick(boundary)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-sm uppercase tracking-wide">{boundary.name}</h3>
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            {boundary.countries.join(' / ')}
                          </p>
                        </div>
                        <Badge 
                          variant={boundary.status === 'violated' ? 'destructive' : boundary.status === 'contested' ? 'default' : 'secondary'}
                          className="text-[10px] uppercase"
                        >
                          {boundary.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {boundary.type.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <SealWarning size={12} weight="fill" />
                          {boundary.incidents} incidents
                        </Badge>
                        {boundary.lastIncident && (
                          <Badge variant="outline" className="text-[10px]">
                            Last: {new Date(boundary.lastIncident).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>

                      <div className="pt-2 border-t border-border">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                          Boundary Coordinates ({boundary.coordinates.length} points)
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                          {boundary.coordinates.slice(0, 4).map((coord, idx) => (
                            <div key={idx} className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                              <MapPin size={10} />
                              {coord.lat.toFixed(2)}°, {coord.lng.toFixed(2)}°
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="bases" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {militaryBases.map((base) => (
                <motion.div
                  key={base.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-4 border-2 border-border hover:border-primary transition-all">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-sm uppercase tracking-wide">{base.name}</h3>
                          <p className="text-xs text-muted-foreground font-mono mt-1">{base.country}</p>
                        </div>
                        <Buildings size={20} weight="fill" className="text-primary" />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-[10px] uppercase">
                          {base.type.replace('-', ' ')}
                        </Badge>
                        <Badge 
                          variant={base.status === 'elevated' ? 'destructive' : 'outline'}
                          className="text-[10px] uppercase"
                        >
                          {base.status}
                        </Badge>
                      </div>

                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <Crosshair size={12} className="text-muted-foreground" />
                          <span className="font-mono text-muted-foreground">
                            {base.coordinates.lat.toFixed(4)}°, {base.coordinates.lng.toFixed(4)}°
                          </span>
                        </div>
                        {base.personnel && (
                          <div className="flex items-center gap-2">
                            <Users size={12} className="text-muted-foreground" />
                            <span className="font-mono">{base.personnel.toLocaleString()} personnel</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-border">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                          Capabilities
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {base.capabilities.map((cap, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px]">
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="p-4 border-2 border-primary/50">
            <div 
              ref={mapContainerRef}
              className="relative w-full h-[600px] bg-secondary/20 rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MapTrifold size={64} weight="fill" className="text-primary mx-auto" />
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wide">Interactive Geospatial Map</h3>
                    <p className="text-sm text-muted-foreground font-mono mt-2">
                      Integration with Mapbox GL for live conflict zone visualization
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      Displaying {conflictZones.length} zones, {territorialBoundaries.length} boundaries, {militaryBases.length} bases
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      size="sm" 
                      variant={viewMode === 'tactical' ? 'default' : 'outline'}
                      onClick={() => setViewMode('tactical')}
                      className="gap-2"
                    >
                      <Target size={14} />
                      Tactical
                    </Button>
                    <Button 
                      size="sm" 
                      variant={viewMode === 'satellite' ? 'default' : 'outline'}
                      onClick={() => setViewMode('satellite')}
                      className="gap-2"
                    >
                      <Eye size={14} />
                      Satellite
                    </Button>
                    <Button 
                      size="sm" 
                      variant={viewMode === 'standard' ? 'default' : 'outline'}
                      onClick={() => setViewMode('standard')}
                      className="gap-2"
                    >
                      <MapTrifold size={14} />
                      Standard
                    </Button>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 space-y-2">
                <Card className="p-3 bg-card/95 backdrop-blur-sm">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Legend</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <span>Critical Zones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent" />
                      <span>High Severity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning" />
                      <span>Medium Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span>Low Threat</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          {selectedZone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4 border-2 border-primary">
                <h3 className="font-bold uppercase tracking-wide mb-3">Selected Zone Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Name</p>
                    <p className="text-sm font-bold">{selectedZone.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Status</p>
                    <Badge variant="outline">{selectedZone.status}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Area</p>
                    <p className="text-sm font-mono">{selectedZone.area.toLocaleString()} km²</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Severity</p>
                    <Badge className={getSeverityColor(selectedZone.severity)}>{selectedZone.severity}</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
