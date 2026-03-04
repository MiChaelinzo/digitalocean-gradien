import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Trash, FileArrowDown, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface Session {
  id: string
  timestamp: string
  messageCount: number
  preview: string
}

interface SessionHistoryProps {
  currentMessages: any[]
  onLoadSession: (sessionId: string) => void
  onClose: () => void
}

export function SessionHistory({ currentMessages, onLoadSession, onClose }: SessionHistoryProps) {
  const [sessions, setSessions] = useKV<Session[]>('intelligence-sessions', [])

  const saveCurrentSession = () => {
    if (!currentMessages || currentMessages.length === 0) {
      toast.error('No messages to save')
      return
    }

    const newSession: Session = {
      id: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
      messageCount: currentMessages.length,
      preview: currentMessages[0]?.content.substring(0, 80) || 'Empty session'
    }

    setSessions((prev) => [newSession, ...(prev || [])])
    
    const sessionKey = `session-data-${newSession.id}`
    window.spark.kv.set(sessionKey, currentMessages)
    
    toast.success('Session saved successfully')
  }

  const loadSession = async (sessionId: string) => {
    const sessionKey = `session-data-${sessionId}`
    const sessionData = await window.spark.kv.get(sessionKey)
    
    if (sessionData) {
      onLoadSession(sessionId)
      toast.success('Session loaded')
      onClose()
    } else {
      toast.error('Failed to load session')
    }
  }

  const deleteSession = async (sessionId: string) => {
    setSessions((prev) => prev?.filter((s) => s.id !== sessionId) || [])
    
    const sessionKey = `session-data-${sessionId}`
    await window.spark.kv.delete(sessionKey)
    
    toast.success('Session deleted')
  }

  const exportSession = async (sessionId: string) => {
    const sessionKey = `session-data-${sessionId}`
    const sessionData = await window.spark.kv.get(sessionKey)
    
    if (sessionData) {
      const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sentinel-intel-${sessionId}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Session exported')
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col">
      <div className="border-b border-border bg-card/50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wide">Session History</h2>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              REVIEW & LOAD PAST INTELLIGENCE SESSIONS
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={saveCurrentSession}
              disabled={!currentMessages || currentMessages.length === 0}
              className="gap-2"
            >
              <FileArrowDown size={16} />
              <span className="hidden sm:inline">Save Current</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="container mx-auto p-4">
          {!sessions || sessions.length === 0 ? (
            <Card className="p-12 text-center">
              <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-mono text-sm">
                No saved sessions yet. Save your current session to review it later.
              </p>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {sessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="p-4 hover:border-primary transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-primary" weight="fill" />
                          <span className="text-xs font-mono text-muted-foreground">
                            {formatDate(session.timestamp)}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs font-mono">
                          {session.messageCount} msgs
                        </Badge>
                      </div>

                      <p className="text-sm text-foreground mb-4 line-clamp-2 font-mono leading-relaxed">
                        {session.preview}
                      </p>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => loadSession(session.id)}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportSession(session.id)}
                        >
                          <FileArrowDown size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteSession(session.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
