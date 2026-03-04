import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { ThreatNotification } from '@/components/ThreatNotificationPanel'

const threatTemplates = [
  {
    type: 'missile' as const,
    severity: 'critical' as const,
    titles: [
      'Ballistic Missile Launch Detected',
      'Hypersonic Missile Alert',
      'ICBM Trajectory Confirmed',
      'Cruise Missile Inbound'
    ],
    locations: ['Persian Gulf', 'South China Sea', 'Ukraine Border', 'Korean Peninsula', 'Taiwan Strait'],
    distanceRange: [200, 800]
  },
  {
    type: 'aircraft' as const,
    severity: 'high' as const,
    titles: [
      'Unidentified Fighter Jets',
      'Hostile Aircraft Detected',
      'Bomber Formation Approaching',
      'Military Aircraft Incursion'
    ],
    locations: ['Black Sea Region', 'Baltic Airspace', 'East China Sea', 'Syrian Airspace', 'Arctic Circle'],
    distanceRange: [80, 350]
  },
  {
    type: 'drone' as const,
    severity: 'high' as const,
    titles: [
      'UAV Swarm Detected',
      'Hostile Drone Activity',
      'Combat Drone Formation',
      'Recon Drones Identified'
    ],
    locations: ['Gaza Strip', 'Crimea', 'Yemen Coast', 'Lebanese Border', 'Kurdistan'],
    distanceRange: [30, 180]
  },
  {
    type: 'uap' as const,
    severity: 'medium' as const,
    titles: [
      'Unknown Aerial Phenomenon',
      'Unidentified Flying Object',
      'Anomalous Air Contact',
      'UAP Signature Detected'
    ],
    locations: ['Pacific Ocean', 'Nevada Test Site', 'North Atlantic', 'Indian Ocean', 'Mediterranean Sea'],
    distanceRange: [100, 500]
  },
  {
    type: 'cyber' as const,
    severity: 'critical' as const,
    titles: [
      'Cyber Attack In Progress',
      'Network Intrusion Detected',
      'DDoS Attack Underway',
      'Critical Infrastructure Breach'
    ],
    locations: ['Defense Network', 'Satellite Systems', 'Command Center', 'Intel Database', 'Communications Grid'],
    distanceRange: [0, 0]
  }
]

const descriptions = [
  'Real-time tracking initiated. Defensive measures recommended.',
  'Trajectory analysis in progress. High-priority alert issued.',
  'Immediate response required. All defensive systems on standby.',
  'Threat assessment ongoing. Counter-measures being calculated.',
  'Strategic command notified. Defense protocols activated.',
  'Intelligence gathering in progress. Situation developing.',
  'Early warning system triggered. Monitoring continuously.'
]

export function useThreatNotifications() {
  const [notifications, setNotifications] = useKV<ThreatNotification[]>('threat-notifications', [])

  useEffect(() => {
    const generateThreat = () => {
      const template = threatTemplates[Math.floor(Math.random() * threatTemplates.length)]
      const title = template.titles[Math.floor(Math.random() * template.titles.length)]
      const location = template.locations[Math.floor(Math.random() * template.locations.length)]
      const description = descriptions[Math.floor(Math.random() * descriptions.length)]
      const distance = Math.floor(
        Math.random() * (template.distanceRange[1] - template.distanceRange[0]) + template.distanceRange[0]
      )

      const newThreat: ThreatNotification = {
        id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type,
        severity: template.severity,
        title,
        description,
        location,
        distance,
        timestamp: new Date(),
        acknowledged: false,
        dismissed: false
      }

      setNotifications(current => {
        const updated = [newThreat, ...(current || [])]
        return updated.slice(0, 50)
      })

      if (template.severity === 'critical') {
        toast.error(`CRITICAL THREAT: ${title}`, {
          description: `Location: ${location} | Distance: ${distance}km`,
          duration: 10000,
        })
      } else if (template.severity === 'high') {
        toast.warning(`HIGH PRIORITY: ${title}`, {
          description: `Location: ${location}`,
          duration: 6000,
        })
      }
    }

    const minInterval = 15000
    const maxInterval = 45000

    const scheduleNext = () => {
      const interval = Math.floor(Math.random() * (maxInterval - minInterval) + minInterval)
      return setTimeout(() => {
        generateThreat()
        scheduleNext()
      }, interval)
    }

    generateThreat()
    
    const timeout = scheduleNext()

    return () => clearTimeout(timeout)
  }, [setNotifications])

  return { notifications }
}
