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
  tags: string[]
  url?: string
  imageUrl?: string
  confidence: number
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
  resolution: string
  cloudCover: number
  bands: string[]
  previewUrl: string
  tileUrl: string
  metadata: Record<string, any>
}

export interface ConflictEvent {
  id: string
  source: string
  eventType: 'armed_conflict' | 'protest' | 'terror_attack' | 'military_operation' | 'border_incident'
  location: {
    lat: number
    lng: number
    country: string
    region?: string
  }
  date: string
  description: string
  casualties?: {
    civilian?: number
    military?: number
    unknown?: number
  }
  actors: string[]
  severity: number
}

const OSINT_SOURCES = {
  ACLED: 'https://api.acleddata.com/acled/read',
  GDELT: 'https://api.gdeltproject.org/api/v2/doc/doc',
  NASA_FIRMS: 'https://firms.modaps.eosdis.nasa.gov/api/area',
  SENTINEL_HUB: 'https://services.sentinel-hub.com/ogc',
  TWITTER_OSINT: 'https://api.twitter.com/2/tweets/search/recent',
}

export class OSINTService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T
    }
    return null
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async getACLEDConflicts(region?: string): Promise<ConflictEvent[]> {
    const cacheKey = `acled_${region || 'global'}`
    const cached = this.getCached<ConflictEvent[]>(cacheKey)
    if (cached) return cached

    try {
      const mockData: ConflictEvent[] = [
        {
          id: 'acled-001',
          source: 'ACLED',
          eventType: 'armed_conflict',
          location: { lat: 32.8, lng: 35.2, country: 'Israel', region: 'Middle East' },
          date: new Date(Date.now() - 2 * 3600000).toISOString(),
          description: 'Armed clashes between military forces near border zone',
          casualties: { military: 3, civilian: 1 },
          actors: ['State Forces', 'Militant Group'],
          severity: 8
        },
        {
          id: 'acled-002',
          source: 'ACLED',
          eventType: 'military_operation',
          location: { lat: 48.5, lng: 37.8, country: 'Ukraine', region: 'Eastern Europe' },
          date: new Date(Date.now() - 5 * 3600000).toISOString(),
          description: 'Artillery strikes reported in contested region',
          casualties: { military: 12, unknown: 4 },
          actors: ['Ukrainian Forces', 'Russian Forces'],
          severity: 9
        },
        {
          id: 'acled-003',
          source: 'ACLED',
          eventType: 'border_incident',
          location: { lat: 27.5, lng: 50.5, country: 'Iran', region: 'Persian Gulf' },
          date: new Date(Date.now() - 8 * 3600000).toISOString(),
          description: 'Naval vessel confrontation in disputed waters',
          actors: ['IRGC Navy', 'Allied Forces'],
          severity: 7
        },
        {
          id: 'acled-004',
          source: 'ACLED',
          eventType: 'protest',
          location: { lat: 23.1, lng: -82.4, country: 'Cuba', region: 'Caribbean' },
          date: new Date(Date.now() - 12 * 3600000).toISOString(),
          description: 'Civil unrest and demonstrations in urban center',
          casualties: { civilian: 0 },
          actors: ['Protesters', 'Security Forces'],
          severity: 4
        },
        {
          id: 'acled-005',
          source: 'ACLED',
          eventType: 'armed_conflict',
          location: { lat: 18.5, lng: 108.5, country: 'South China Sea', region: 'Asia-Pacific' },
          date: new Date(Date.now() - 6 * 3600000).toISOString(),
          description: 'Military exercises and territorial assertion activities',
          actors: ['PLAN Forces', 'Regional Navies'],
          severity: 6
        }
      ]

      this.setCache(cacheKey, mockData)
      return mockData
    } catch (error) {
      console.error('Error fetching ACLED data:', error)
      return []
    }
  }

  async getGDELTNews(keywords: string[] = ['military', 'conflict', 'defense']): Promise<OSINTFeed[]> {
    const cacheKey = `gdelt_${keywords.join('_')}`
    const cached = this.getCached<OSINTFeed[]>(cacheKey)
    if (cached) return cached

    try {
      const mockFeeds: OSINTFeed[] = [
        {
          id: 'gdelt-001',
          source: 'GDELT',
          type: 'news',
          title: 'Increased Military Activity Detected in Eastern Mediterranean',
          description: 'Multiple intelligence sources report heightened naval presence and aerial reconnaissance missions',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          location: { lat: 33.5, lng: 34.0, country: 'Mediterranean', region: 'Middle East' },
          severity: 'high',
          tags: ['naval', 'reconnaissance', 'mediterranean'],
          confidence: 87,
          verified: true
        },
        {
          id: 'gdelt-002',
          source: 'GDELT',
          type: 'military',
          title: 'Hypersonic Weapons Test Reported in Asian Theater',
          description: 'Seismic and satellite data suggest advanced weapons system testing',
          timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
          location: { lat: 40.0, lng: 125.0, region: 'East Asia' },
          severity: 'critical',
          tags: ['hypersonic', 'weapons-test', 'strategic'],
          confidence: 92,
          verified: true
        },
        {
          id: 'gdelt-003',
          source: 'GDELT',
          type: 'conflict',
          title: 'Border Tensions Escalate in Caucasus Region',
          description: 'Diplomatic sources confirm military mobilization and defensive positioning',
          timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
          location: { lat: 41.5, lng: 44.5, region: 'Caucasus' },
          severity: 'high',
          tags: ['border-conflict', 'mobilization', 'diplomatic'],
          confidence: 79,
          verified: false
        },
        {
          id: 'gdelt-004',
          source: 'GDELT',
          type: 'threat',
          title: 'Cyber Attack Attributed to State Actor',
          description: 'Critical infrastructure targeted in coordinated cyber operation',
          timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
          severity: 'critical',
          tags: ['cyber', 'infrastructure', 'state-actor'],
          confidence: 95,
          verified: true
        },
        {
          id: 'gdelt-005',
          source: 'GDELT',
          type: 'social',
          title: 'Social Media Intelligence: Troop Movement Indicators',
          description: 'OSINT analysis of social media posts reveals possible military convoy movement',
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
          location: { lat: 49.5, lng: 36.0, country: 'Ukraine', region: 'Eastern Europe' },
          severity: 'medium',
          tags: ['osint', 'social-media', 'troop-movement'],
          confidence: 68,
          verified: false
        }
      ]

      this.setCache(cacheKey, mockFeeds)
      return mockFeeds
    } catch (error) {
      console.error('Error fetching GDELT data:', error)
      return []
    }
  }

  async getNASAFIRMS(region?: { lat: number; lng: number; radius: number }): Promise<OSINTFeed[]> {
    const cacheKey = `firms_${region?.lat}_${region?.lng}`
    const cached = this.getCached<OSINTFeed[]>(cacheKey)
    if (cached) return cached

    try {
      const mockFires: OSINTFeed[] = [
        {
          id: 'firms-001',
          source: 'NASA FIRMS',
          type: 'satellite',
          title: 'Thermal Anomaly Detected - Potential Explosion Site',
          description: 'MODIS satellite detected significant thermal signature consistent with military ordnance',
          timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
          location: { lat: 48.2, lng: 37.5, country: 'Ukraine', region: 'Donetsk' },
          severity: 'high',
          tags: ['thermal', 'explosion', 'satellite-detection'],
          confidence: 91,
          verified: true
        },
        {
          id: 'firms-002',
          source: 'NASA FIRMS',
          type: 'satellite',
          title: 'Multiple Fire Sources - Industrial Complex',
          description: 'Cluster of thermal anomalies detected at military-industrial facility',
          timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
          location: { lat: 35.7, lng: 51.4, country: 'Iran', region: 'Tehran Province' },
          severity: 'critical',
          tags: ['industrial', 'thermal-cluster', 'facility'],
          confidence: 88,
          verified: true
        },
        {
          id: 'firms-003',
          source: 'NASA FIRMS',
          type: 'satellite',
          title: 'Wildfire Near Military Installation',
          description: 'Natural fire detected in proximity to strategic facility, monitoring for containment',
          timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
          location: { lat: 37.5, lng: -122.0, country: 'USA', region: 'California' },
          severity: 'medium',
          tags: ['wildfire', 'facility-proximity', 'monitoring'],
          confidence: 95,
          verified: true
        }
      ]

      this.setCache(cacheKey, mockFires)
      return mockFires
    } catch (error) {
      console.error('Error fetching NASA FIRMS data:', error)
      return []
    }
  }

  async getSentinelImagery(location: { lat: number; lng: number }, date?: string): Promise<SatelliteImagery[]> {
    const cacheKey = `sentinel_${location.lat}_${location.lng}`
    const cached = this.getCached<SatelliteImagery[]>(cacheKey)
    if (cached) return cached

    try {
      const mockImagery: SatelliteImagery[] = [
        {
          id: 'sentinel-001',
          source: 'sentinel',
          location: {
            lat: location.lat,
            lng: location.lng,
            bounds: [[location.lat - 0.5, location.lng - 0.5], [location.lat + 0.5, location.lng + 0.5]]
          },
          captureDate: date || new Date(Date.now() - 24 * 3600000).toISOString(),
          resolution: '10m',
          cloudCover: 12,
          bands: ['B04', 'B03', 'B02'],
          previewUrl: 'https://via.placeholder.com/400x300/1a1a2e/4ecca3?text=Sentinel-2+Imagery',
          tileUrl: 'https://services.sentinel-hub.com/ogc/wms/{instance_id}',
          metadata: {
            satellite: 'Sentinel-2A',
            orbitNumber: 12345,
            processingLevel: 'Level-2A'
          }
        },
        {
          id: 'sentinel-002',
          source: 'landsat',
          location: {
            lat: location.lat,
            lng: location.lng,
            bounds: [[location.lat - 0.5, location.lng - 0.5], [location.lat + 0.5, location.lng + 0.5]]
          },
          captureDate: date || new Date(Date.now() - 48 * 3600000).toISOString(),
          resolution: '30m',
          cloudCover: 5,
          bands: ['B4', 'B3', 'B2'],
          previewUrl: 'https://via.placeholder.com/400x300/16213e/0ef6cc?text=Landsat-8+Imagery',
          tileUrl: 'https://landsat.usgs.gov/tiles/{z}/{x}/{y}',
          metadata: {
            satellite: 'Landsat-8',
            path: 123,
            row: 34
          }
        }
      ]

      this.setCache(cacheKey, mockImagery)
      return mockImagery
    } catch (error) {
      console.error('Error fetching Sentinel imagery:', error)
      return []
    }
  }

  async aggregateOSINTFeeds(): Promise<OSINTFeed[]> {
    const cacheKey = 'aggregated_feeds'
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
        title: `${c.eventType.replace('_', ' ').toUpperCase()}: ${c.location.country}`,
        description: c.description,
        timestamp: c.date,
        location: c.location,
        severity: c.severity >= 8 ? 'critical' : c.severity >= 6 ? 'high' : c.severity >= 4 ? 'medium' : 'low',
        tags: [c.eventType, ...c.actors],
        confidence: 85,
        verified: true
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

  clearCache(): void {
    this.cache.clear()
  }
}

export const osintService = new OSINTService()
