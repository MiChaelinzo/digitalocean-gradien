import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Pulse, Broadcast, Warning } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface StatusUpdate {
  id: string
  message: string
  type: 'operational' | 'alert' | 'info'
  timestamp: Date
}

export function StatusNotifications() {
  const [updates, setUpdates] = useState<StatusUpdate[]>([])
  const [currentUpdate, setCurrentUpdate] = useState<StatusUpdate | null>(null)

  const statusMessages = [
    { message: 'Satellite network: ONLINE', type: 'operational' as const },
    { message: 'Defense grid: OPERATIONAL', type: 'operational' as const },
    { message: 'Threat detection: ACTIVE', type: 'operational' as const },
    { message: 'Intelligence sync: COMPLETE', type: 'info' as const },
    { message: 'Radar sweep: SECTOR 4', type: 'info' as const },
    { message: 'Communication channels: SECURE', type: 'operational' as const },
    { message: 'Regional monitoring: 6 THEATERS', type: 'info' as const },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessage = statusMessages[Math.floor(Math.random() * statusMessages.length)]
      const update: StatusUpdate = {
        id: `update-${Date.now()}`,
        message: randomMessage.message,
        type: randomMessage.type,
        timestamp: new Date()
      }

      setUpdates((prev) => {
        const newUpdates = [update, ...prev].slice(0, 50)
        return newUpdates
      })

      setCurrentUpdate(update)

      setTimeout(() => {
        setCurrentUpdate(null)
      }, 4000)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getIcon = () => {
    if (!currentUpdate) return <Pulse size={14} weight="fill" />
    
    switch (currentUpdate.type) {
      case 'operational':
        return <Pulse size={14} weight="fill" className="text-success" />
      case 'alert':
        return <Warning size={14} weight="fill" className="text-destructive" />
      case 'info':
        return <Broadcast size={14} weight="fill" className="text-primary" />
    }
  }

  return (
    <AnimatePresence>
      {currentUpdate && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-4 z-40"
        >
          <Badge
            variant="outline"
            className="bg-card/95 backdrop-blur-md px-3 py-2 gap-2 font-mono text-xs border-border shadow-lg"
          >
            {getIcon()}
            <span>{currentUpdate.message}</span>
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
