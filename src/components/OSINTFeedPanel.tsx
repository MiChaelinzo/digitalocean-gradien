import { useState, useEffect } from 'react'
import { osintService, type OSINTFeed } from '@/lib/osint-service'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Radio, 
  ArrowsClockwise, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Warning,
  ShieldWarning,
  Siren,
  Info,
  Newspaper,
  Lightning,
  Fire,
  Target,
  ChatCircle,
  TrendUp
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface OSINTFeedPanelProps {
  isOpen: boolean
  onClose: () => void
  onFeedSelect?: (feed: OSINTFeed) => void
}

export function OSINTFeedPanel({ isOpen, onClose, onFeedSelect }: OSINTFeedPanelProps) {
  const [feeds, setFeeds] = useState<OSINTFeed[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | OSINTFeed['type']>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const loadFeeds = async () => {
    setIsLoading(true)
    try {
      const data = await osintService.aggregateOSINTFeeds()
      setFeeds(data)
      setLastUpdate(new Date())
      toast.success(`Loaded ${data.length} OSINT intelligence feeds`)
    } catch (error) {
      console.error('Error loading OSINT feeds:', error)
      toast.error('Failed to load OSINT feeds')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadFeeds()
    }
  }, [isOpen])

  useEffect(() => {
    if (!autoRefresh || !isOpen) return

    const interval = setInterval(() => {
      loadFeeds()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, isOpen])

  const getSeverityIcon = (severity: OSINTFeed['severity']) => {
    switch (severity) {
      case 'critical':
        return <Siren size={16} weight="fill" className="text-destructive" />
      case 'high':
        return <ShieldWarning size={16} weight="fill" className="text-warning" />
      case 'medium':
        return <Warning size={16} weight="fill" className="text-accent" />
      case 'low':
        return <CheckCircle size={16} weight="fill" className="text-success" />
      case 'info':
        return <Info size={16} weight="fill" className="text-primary" />
    }
  }

  const getTypeIcon = (type: OSINTFeed['type']) => {
    switch (type) {
      case 'threat':
        return <Target size={20} weight="fill" />
      case 'conflict':
        return <Lightning size={20} weight="fill" />
      case 'military':
        return <ShieldWarning size={20} weight="fill" />
      case 'satellite':
        return <Fire size={20} weight="fill" />
      case 'social':
        return <ChatCircle size={20} weight="fill" />
      case 'news':
        return <Newspaper size={20} weight="fill" />
    }
  }

  const filteredFeeds = activeFilter === 'all' 
    ? feeds 
    : feeds.filter(f => f.type === activeFilter)

  const feedsBySource = feeds.reduce((acc, feed) => {
    acc[feed.source] = (acc[feed.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const criticalCount = feeds.filter(f => f.severity === 'critical').length
  const verifiedCount = feeds.filter(f => f.verified).length

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl h-[90vh] bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="border-b border-border bg-secondary/20 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/20 border-2 border-primary flex items-center justify-center">
                <Radio size={20} weight="fill" className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide">Live OSINT Feeds</h2>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                  Open-Source Intelligence Integration
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              Close
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-3 bg-card/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase">Total Feeds</p>
                  <p className="text-2xl font-bold">{feeds.length}</p>
                </div>
                <Radio size={24} weight="fill" className="text-primary" />
              </div>
            </Card>
            <Card className="p-3 bg-destructive/10 border-destructive/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase">Critical</p>
                  <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
                </div>
                <Siren size={24} weight="fill" className="text-destructive" />
              </div>
            </Card>
            <Card className="p-3 bg-success/10 border-success/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase">Verified</p>
                  <p className="text-2xl font-bold text-success">{verifiedCount}</p>
                </div>
                <CheckCircle size={24} weight="fill" className="text-success" />
              </div>
            </Card>
            <Card className="p-3 bg-card/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase">Sources</p>
                  <p className="text-2xl font-bold">{Object.keys(feedsBySource).length}</p>
                </div>
                <TrendUp size={24} weight="fill" className="text-primary" />
              </div>
            </Card>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadFeeds}
                disabled={isLoading}
                className="gap-2"
              >
                <ArrowsClockwise size={16} weight="bold" className={isLoading ? 'animate-spin' : ''} />
                Refresh
              </Button>
              <Button
                variant={autoRefresh ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="gap-2"
              >
                <Radio size={16} weight="fill" />
                Auto-Refresh {autoRefresh ? 'ON' : 'OFF'}
              </Button>
            </div>
            {lastUpdate && (
              <p className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                <Clock size={14} />
                Last update: {formatDistanceToNow(lastUpdate, { addSuffix: true })}
              </p>
            )}
          </div>
        </div>

        <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as typeof activeFilter)} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-border px-6">
            <TabsList className="bg-transparent gap-1 h-auto p-0">
              <TabsTrigger 
                value="all" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs uppercase px-4 py-2"
              >
                All ({feeds.length})
              </TabsTrigger>
              <TabsTrigger 
                value="threat"
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs uppercase px-4 py-2"
              >
                <Target size={14} />
                Threats ({feeds.filter(f => f.type === 'threat').length})
              </TabsTrigger>
              <TabsTrigger 
                value="conflict"
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs uppercase px-4 py-2"
              >
                <Lightning size={14} />
                Conflicts ({feeds.filter(f => f.type === 'conflict').length})
              </TabsTrigger>
              <TabsTrigger 
                value="satellite"
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs uppercase px-4 py-2"
              >
                <Fire size={14} />
                Satellite ({feeds.filter(f => f.type === 'satellite').length})
              </TabsTrigger>
              <TabsTrigger 
                value="news"
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs uppercase px-4 py-2"
              >
                <Newspaper size={14} />
                News ({feeds.filter(f => f.type === 'news').length})
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-3">
              {isLoading && filteredFeeds.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <ArrowsClockwise size={32} weight="bold" className="animate-spin text-primary mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground font-mono uppercase">Loading OSINT feeds...</p>
                  </div>
                </div>
              ) : filteredFeeds.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Radio size={32} weight="fill" className="text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground font-mono uppercase">No feeds available</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredFeeds.map((feed, index) => (
                    <motion.div
                      key={feed.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <Card 
                        className={`p-4 hover:bg-secondary/50 transition-colors cursor-pointer border-l-4 ${
                          feed.severity === 'critical' ? 'border-l-destructive bg-destructive/5' :
                          feed.severity === 'high' ? 'border-l-warning bg-warning/5' :
                          feed.severity === 'medium' ? 'border-l-accent' :
                          feed.severity === 'low' ? 'border-l-success' :
                          'border-l-primary'
                        }`}
                        onClick={() => {
                          onFeedSelect?.(feed)
                          toast.info(`Selected: ${feed.title}`)
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-md bg-secondary/50 flex items-center justify-center">
                            {getTypeIcon(feed.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="font-semibold text-sm leading-tight">{feed.title}</h3>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {getSeverityIcon(feed.severity)}
                                {feed.verified && (
                                  <CheckCircle size={14} weight="fill" className="text-success" />
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {feed.description}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-[10px] font-mono uppercase px-1.5 py-0">
                                {feed.source}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-[10px] font-mono uppercase px-1.5 py-0 ${
                                  feed.severity === 'critical' ? 'border-destructive text-destructive' :
                                  feed.severity === 'high' ? 'border-warning text-warning' :
                                  feed.severity === 'medium' ? 'border-accent text-accent' :
                                  feed.severity === 'low' ? 'border-success text-success' :
                                  'border-primary text-primary'
                                }`}
                              >
                                {feed.severity}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] font-mono uppercase px-1.5 py-0">
                                {feed.confidence}% confidence
                              </Badge>
                              {feed.location && (
                                <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                                  <MapPin size={10} />
                                  {feed.location.country || `${feed.location.lat.toFixed(2)}, ${feed.location.lng.toFixed(2)}`}
                                </span>
                              )}
                              <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 ml-auto">
                                <Clock size={10} />
                                {formatDistanceToNow(new Date(feed.timestamp), { addSuffix: true })}
                              </span>
                            </div>
                            {feed.tags.length > 0 && (
                              <div className="flex items-center gap-1 mt-2 flex-wrap">
                                {feed.tags.slice(0, 4).map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0">
                                    {tag}
                                  </Badge>
                                ))}
                                {feed.tags.length > 4 && (
                                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                                    +{feed.tags.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
