export interface OSINTFeed {
  id: string
  source: string
  type: 'threat' | 'conflict' | 'military' | 'satellite' | 'social' | 'news'
  title: string
  description: string
  timestamp: string
  location?: {
    lng: number
    region?: st
  severity: 'critica
  url?: string
  c
}
export interface
  source: 'sen
    lat: number
    bounds: [[number
  captureDate: stri
 

  metadata: Record<string, any>

  id: string
  eventType: 
    lat: number
    country: st
  }
  d
    civilian?: number
    unknown?: number
  actors: string[]
}
const OSINT_SOURCES 
  GDELT: 'https:/
  SENTINEL_HUB: 'https://servic
}

  private readonly CACHE_DURATIO
  private ge
    if (cached &
    }
  }
  private setCa
  }
  async getACLEDCon
    const cached = 

      const mo
          id: 'acled-
          eventT
          date: new D
          casualties:
          severity: 
   
          source: 
          location
 

        },
          id: 'acled-003',
          eventType: 'border_incident',
          date: new Date(Date.now() - 8 * 3600000).toISOString
          actors: ['IRGC Navy', 'Allied Forces'],
        },
 

          date: new Date(Da
          casualties: { civilian: 0 },
          severity: 4

          source: 'ACLED',
          location: { lat: 18.5, lng: 
          description: 'Military exercises and territorial assertion act
          severity: 6
     
      this.setC
   

  }
  async getGDELTNews(keywords: string[] = ['military', '
   

      const mockFeeds: OSINTFeed[] = [
          id: 'gdelt-001',
          type: 'news',
          description: 'Multi

         
          verified: true
        {
          source: 'GDELT',
          title: 'Hyperson
          timestamp: new Date(Date.now
          severity: 'critical',
          confidence: 92,
        },
          id: 'gdelt-003',
          type: 'conflict',
          description
          
         
          verified: false
        {
          source: 'GDELT',
          title: 'Cyber Attack Attributed to State Actor',
          timestamp: new Date(Date.now() - 45 * 60000).toISOStrin
          tags: ['cyber', 'infrastructure', 'state-actor'],
          verified: true
        {
          source: 'GD
          
         
          severity: 'mediu
          confidence: 68,
        }

      return mockFeeds
      console.error('Error fetching GDELT data:', error)
    }

    const 
    if (c
    try {
        {
          source: 'NASA FIRMS',
          title: 'Thermal Anomaly Detected - Potential Explosion Site',
          timestamp: new Date(Date.now() - 3 * 3600000).toISOStrin
          severity: 'high',
          confidence: 91,
        },
          id: 'firms-
          
         
          location: { lat:
          tags: ['industri
          verified: true
        {
          source: 'NASA FIRMS',
          title: 'Wildfire Near Military Installation',
          timestamp: new Date(Date.now() - 24 * 36000
          severity: '
         
       

      return mockFires
      console.error('
    }

    const cache
    i
   

          source: 'sentinel',
            lat: location.lat,
            bounds: [[location.lat - 0.5, location.lng -
          captureDate: date |

         
          metadata: {
         
          }
        {
          source: 'land
            lat: location.lat,
            bounds: [[location.lat - 0.5, location.lng - 0.5], [location.lat + 0.5, location.lng + 0.5]]
          captureDate: date || new Date(Date.now() - 48 * 3600000).to
          cloudCover: 5,
          previewUrl: 'http
          metadata: {
            path: 123,
          }
      ]
      thi
    } catch (error) {
      return []
  }
  async aggregateOSINTFeeds(): Promise<OSINTFeed[]> {
    const cached = this.getCached<OSINTFeed[]>(cacheKey)

      const [gdeltNews, nasaFires, conflicts] = await Promise.all([
        this.getNASAFIRMS(),
      ])
      const conflictFeeds
        source: c.source
        ti
        t
        severity: c.severi
        confidence: 85,
      }))
      const allFeeds = [...gdeltNews, ...nasaFires, ...conflict

      return allFeeds
      console.error('Error aggregating OSINT feeds:', error)
    }

    this.cache.clear()
}
export con































































































































































































