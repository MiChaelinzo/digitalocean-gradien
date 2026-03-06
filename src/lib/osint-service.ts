import { getSimulatedISOString } from './date-utils'

export interface OSINTFeed {
  id: string
  source: string
  type: 'threat' | 'conflict' | 'military' | 'satellite' | 'social' | 'news'
  title: string
  description: string
  timestamp: string
  location?: {
    lat: number
    lng: number
    country?: string
    region?: string
  }
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  url?: string
  confidence: number
  tags: string[]
  verified: boolean
}

export interface SatelliteImagery {
  id: string
  source: 'sentinel' | 'landsat' | 'planet' | 'maxar'
  location: {
    lat: number
    lng: number
    bounds: [[number, number], [number, number]]
  }
  captureDate: string
  resolution: number
  cloudCover: number
  previewUrl: string
  downloadUrl?: string
  metadata: Record<string, any>
}

export interface ConflictEvent {
  id: string
  eventType: 'battle' | 'airstrike' | 'explosion' | 'border_incident' | 'naval_engagement'
  date: string
  location: {
    lat: number
    lng: number
    country: string
  }
  description: string
  casualties: {
    military?: number
    civilian?: number
    unknown?: number
  }
  actors: string[]
  severity: number
  source: string
}

const OSINT_SOURCES = {
  GDELT: 'https://api.gdeltproject.org/api/v2/',
  ACLED: 'https://api.acleddata.com/acled/read',
  SENTINEL_HUB: 'https://services.sentinel-hub.com/',
  NASA_FIRMS: 'https://firms.modaps.eosdis.nasa.gov/api/'
}

class OSINTService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T
    }
    return null
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async getACLEDConflicts(): Promise<ConflictEvent[]> {
    const cached = this.getCached<ConflictEvent[]>('acled-conflicts')
    if (cached) return cached

    try {
      const mockConflicts: ConflictEvent[] = [
        {
          id: 'acled-001',
          eventType: 'airstrike',
          date: getSimulatedISOString(-2 * 3600000),
          location: { lat: 33.3152, lng: 44.3661, country: 'Iraq' },
          description: 'Airstrike on suspected militant position near Baghdad',
          casualties: { military: 5, civilian: 2 },
          actors: ['Coalition Forces', 'Militant Group'],
          severity: 7,
          source: 'ACLED'
        },
        {
          id: 'acled-002',
          eventType: 'battle',
          date: getSimulatedISOString(-6 * 3600000),
          location: { lat: 48.3794, lng: 31.1656, country: 'Ukraine' },
          description: 'Ground forces engagement in eastern theater',
          casualties: { military: 12, unknown: 3 },
          actors: ['Ukrainian Forces', 'Russian Forces'],
          severity: 8,
          source: 'ACLED'
        },
        {
          id: 'acled-003',
          eventType: 'border_incident',
          date: getSimulatedISOString(-8 * 3600000),
          location: { lat: 27.5, lng: 52.5, country: 'Iran' },
          description: 'Naval confrontation in Strait of Hormuz',
          casualties: { civilian: 0 },
          actors: ['IRGC Navy', 'Allied Forces'],
          severity: 6,
          source: 'ACLED'
        },
        {
          id: 'acled-004',
          eventType: 'naval_engagement',
          date: getSimulatedISOString(-12 * 3600000),
          location: { lat: 18.5, lng: 112.0, country: 'South China Sea' },
          description: 'Military exercises and territorial assertion activities',
          casualties: { civilian: 0 },
          actors: ['PLA Navy', 'Regional Naval Forces'],
          severity: 5,
          source: 'ACLED'
        }
      ]

      this.setCache('acled-conflicts', mockConflicts)
      return mockConflicts
    } catch (error) {
      console.error('Error fetching ACLED data:', error)
      return []
    }
  }

  async getGDELTNews(keywords: string[] = ['military', 'defense', 'conflict']): Promise<OSINTFeed[]> {
    const cached = this.getCached<OSINTFeed[]>('gdelt-news')
    if (cached) return cached

    try {
      const mockFeeds: OSINTFeed[] = [
        {
          id: 'gdelt-001',
          source: 'GDELT',
          type: 'news',
          title: 'Military Exercise in Persian Gulf',
          description: 'Multi-national naval exercise involving 5 countries in the Persian Gulf region',
          timestamp: getSimulatedISOString(-30 * 60000),
          location: { lat: 26.0, lng: 50.5, country: 'Bahrain', region: 'Persian Gulf' },
          severity: 'medium',
          confidence: 78,
          tags: ['military', 'naval', 'exercise'],
          url: 'https://example.com/news/1',
          verified: true
        },
        {
          id: 'gdelt-002',
          source: 'GDELT',
          type: 'threat',
          title: 'Hypersonic Missile Test Reported',
          description: 'Intelligence sources report successful test of hypersonic delivery system',
          timestamp: getSimulatedISOString(-90 * 60000),
          location: { lat: 35.9, lng: 127.7, country: 'North Korea' },
          severity: 'critical',
          confidence: 92,
          tags: ['missile', 'test', 'hypersonic'],
          url: 'https://example.com/news/2',
          verified: true
        },
        {
          id: 'gdelt-003',
          source: 'GDELT',
          type: 'conflict',
          title: 'Border Tensions Escalate',
          description: 'Reports of increased military presence along disputed border region',
          timestamp: getSimulatedISOString(-2 * 3600000),
          location: { lat: 34.5, lng: 69.1, country: 'Afghanistan' },
          severity: 'high',
          confidence: 85,
          tags: ['border', 'military', 'tension'],
          url: 'https://example.com/news/3',
          verified: false
        },
        {
          id: 'gdelt-004',
          source: 'GDELT',
          type: 'news',
          title: 'Cyber Attack Attributed to State Actor',
          description: 'Major infrastructure targeted in coordinated cyber operation',
          timestamp: getSimulatedISOString(-45 * 60000),
          location: { lat: 40.7, lng: -74.0, country: 'United States' },
          severity: 'high',
          confidence: 88,
          tags: ['cyber', 'infrastructure', 'state-actor'],
          url: 'https://example.com/news/4',
          verified: true
        },
        {
          id: 'gdelt-005',
          source: 'GDELT',
          type: 'military',
          title: 'Air Defense System Deployment',
          description: 'New air defense batteries deployed to strategic locations',
          timestamp: getSimulatedISOString(-4 * 3600000),
          location: { lat: 31.7, lng: 35.2, country: 'Israel' },
          severity: 'medium',
          confidence: 68,
          tags: ['defense', 'deployment', 'air-defense'],
          url: 'https://example.com/news/5',
          verified: true
        }
      ]

      this.setCache('gdelt-news', mockFeeds)
      return mockFeeds
    } catch (error) {
      console.error('Error fetching GDELT data:', error)
      return []
    }
  }

  async getNASAFIRMS(): Promise<OSINTFeed[]> {
    const cached = this.getCached<OSINTFeed[]>('nasa-firms')
    if (cached) return cached

    try {
      const mockFires: OSINTFeed[] = [
        {
          id: 'firms-001',
          source: 'NASA FIRMS',
          type: 'satellite',
          title: 'Thermal Anomaly Detected - Potential Explosion Site',
          description: 'High-intensity thermal signature detected via satellite',
          timestamp: getSimulatedISOString(-3 * 3600000),
          location: { lat: 33.3, lng: 44.4, country: 'Iraq' },
          severity: 'high',
          confidence: 91,
          tags: ['thermal', 'explosion', 'satellite'],
          verified: true
        },
        {
          id: 'firms-002',
          source: 'NASA FIRMS',
          type: 'satellite',
          title: 'Industrial Fire Detected',
          description: 'Large fire detected at industrial facility',
          timestamp: getSimulatedISOString(-8 * 3600000),
          location: { lat: 35.6, lng: 51.4, country: 'Iran' },
          severity: 'medium',
          confidence: 87,
          tags: ['industrial', 'fire', 'facility'],
          verified: true
        },
        {
          id: 'firms-003',
          source: 'NASA FIRMS',
          type: 'satellite',
          title: 'Wildfire Near Military Installation',
          description: 'Natural wildfire in proximity to military facility',
          timestamp: getSimulatedISOString(-24 * 3600000),
          location: { lat: 37.9, lng: -122.0, country: 'United States' },
          severity: 'low',
          confidence: 75,
          tags: ['wildfire', 'military', 'monitoring'],
          verified: true
        }
      ]

      this.setCache('nasa-firms', mockFires)
      return mockFires
    } catch (error) {
      console.error('Error fetching NASA FIRMS data:', error)
      return []
    }
  }

  async getSatelliteImagery(location: { lat: number; lng: number }, date?: string): Promise<SatelliteImagery[]> {
    const cacheKey = `imagery-${location.lat}-${location.lng}`
    const cached = this.getCached<SatelliteImagery[]>(cacheKey)
    if (cached) return cached

    try {
      const imagery: SatelliteImagery[] = [
        {
          id: `sentinel-${Date.now()}`,
          source: 'sentinel',
          location: {
            lat: location.lat,
            lng: location.lng,
            bounds: [[location.lat - 0.5, location.lng - 0.5], [location.lat + 0.5, location.lng + 0.5]]
          },
          captureDate: date || getSimulatedISOString(-24 * 3600000),
          resolution: 10,
          cloudCover: 12,
          previewUrl: 'https://via.placeholder.com/400x400.png?text=Sentinel-2',
          metadata: {
            satellite: 'Sentinel-2A',
            bands: ['B04', 'B03', 'B02']
          }
        },
        {
          id: `landsat-${Date.now()}`,
          source: 'landsat',
          location: {
            lat: location.lat,
            lng: location.lng,
            bounds: [[location.lat - 0.5, location.lng - 0.5], [location.lat + 0.5, location.lng + 0.5]]
          },
          captureDate: date || getSimulatedISOString(-48 * 3600000),
          resolution: 30,
          cloudCover: 5,
          previewUrl: 'https://via.placeholder.com/400x400.png?text=Landsat-8',
          metadata: {
            satellite: 'Landsat-8',
            path: 123,
            row: 45
          }
        }
      ]

      this.setCache(cacheKey, imagery)
      return imagery
    } catch (error) {
      console.error('Error fetching satellite imagery:', error)
      return []
    }
  }

  async aggregateOSINTFeeds(): Promise<OSINTFeed[]> {
    const cacheKey = 'aggregated-feeds'
    const cached = this.getCached<OSINTFeed[]>(cacheKey)
    if (cached) return cached

    try {
      const [gdeltNews, nasaFires, conflicts] = await Promise.all([
        this.getGDELTNews(),
        this.getNASAFIRMS(),
        this.getACLEDConflicts()
      ])

      const conflictFeeds: OSINTFeed[] = conflicts.map(c => ({
        id: c.id,
        source: c.source,
        type: 'conflict' as const,
        title: `${c.eventType.replace('_', ' ').toUpperCase()}: ${c.description}`,
        description: c.description,
        timestamp: c.date,
        location: c.location,
        severity: c.severity >= 8 ? 'critical' : c.severity >= 6 ? 'high' : c.severity >= 4 ? 'medium' : 'low',
        confidence: 85,
        tags: [c.eventType, ...c.actors],
        verified: true,
        url: undefined
      }))

      const allFeeds = [...gdeltNews, ...nasaFires, ...conflictFeeds]
      allFeeds.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      this.setCache(cacheKey, allFeeds)
      return allFeeds
    } catch (error) {
      console.error('Error aggregating OSINT feeds:', error)
      return []
    }
  }

  clearCache() {
    this.cache.clear()
  }
}

export const osintService = new OSINTService()
