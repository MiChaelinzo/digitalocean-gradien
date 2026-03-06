import { useState, useEffect } from 'react'
import { osintService, type SatelliteImagery } from '@/lib/osint-service'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Planet, 
  ArrowsClockwise, 
  MapPin, 
  Calendar,
  CloudRain,
  Image as ImageIcon,
  Download,
  MagnifyingGlass
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface SatelliteImageryViewerProps {
  isOpen: boolean
  onClose: () => void
  onImageSelect?: (imagery: SatelliteImagery) => void
}

export function SatelliteImageryViewer({ isOpen, onClose, onImageSelect }: SatelliteImageryViewerProps) {
  const [imagery, setImagery] = useState<SatelliteImagery[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchLat, setSearchLat] = useState('32.8')
  const [searchLng, setSearchLng] = useState('35.2')
  const [selectedImage, setSelectedImage] = useState<SatelliteImagery | null>(null)

  const loadImagery = async () => {
    setIsLoading(true)
    try {
      const lat = parseFloat(searchLat)
      const lng = parseFloat(searchLng)
      
      if (isNaN(lat) || isNaN(lng)) {
        toast.error('Invalid coordinates')
        return
      }

      const data = await osintService.getSentinelImagery({ lat, lng })
      setImagery(data)
      toast.success(`Loaded ${data.length} satellite imagery tiles`)
    } catch (error) {
      console.error('Error loading satellite imagery:', error)
      toast.error('Failed to load satellite imagery')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadImagery()
    }
  }, [isOpen])

  const getSourceBadgeColor = (source: SatelliteImagery['source']) => {
    switch (source) {
      case 'sentinel':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'landsat':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'planet':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'maxar':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default:
        return 'bg-primary/20 text-primary border-primary/30'
    }
  }

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
        className="w-full max-w-7xl h-[90vh] bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="border-b border-border bg-secondary/20 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/20 border-2 border-primary flex items-center justify-center">
                <Planet size={20} weight="fill" className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide">Satellite Imagery</h2>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                  Sentinel-2 • Landsat-8 • Commercial Providers
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="latitude" className="text-xs font-mono uppercase text-muted-foreground">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="0.1"
                value={searchLat}
                onChange={(e) => setSearchLat(e.target.value)}
                className="mt-1 font-mono"
                placeholder="32.8"
              />
            </div>
            <div>
              <Label htmlFor="longitude" className="text-xs font-mono uppercase text-muted-foreground">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                step="0.1"
                value={searchLng}
                onChange={(e) => setSearchLng(e.target.value)}
                className="mt-1 font-mono"
                placeholder="35.2"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={loadImagery}
                disabled={isLoading}
                className="w-full gap-2"
              >
                {isLoading ? (
                  <ArrowsClockwise size={16} weight="bold" className="animate-spin" />
                ) : (
                  <MagnifyingGlass size={16} weight="bold" />
                )}
                Search Imagery
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-2/3 border-r border-border overflow-hidden flex flex-col">
            <div className="border-b border-border bg-secondary/10 px-4 py-2">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                Available Imagery ({imagery.length})
              </p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 grid grid-cols-1 gap-3">
                {isLoading && imagery.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <ArrowsClockwise size={32} weight="bold" className="animate-spin text-primary mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground font-mono uppercase">Loading imagery...</p>
                    </div>
                  </div>
                ) : imagery.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Planet size={32} weight="fill" className="text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-muted-foreground font-mono uppercase">No imagery available</p>
                      <p className="text-xs text-muted-foreground mt-1">Try different coordinates</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {imagery.map((img, index) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card 
                          className={`p-4 hover:bg-secondary/50 transition-colors cursor-pointer ${
                            selectedImage?.id === img.id ? 'ring-2 ring-primary bg-secondary/50' : ''
                          }`}
                          onClick={() => {
                            setSelectedImage(img)
                            onImageSelect?.(img)
                          }}
                        >
                          <div className="flex gap-4">
                            <div className="w-32 h-32 rounded-md overflow-hidden flex-shrink-0 bg-secondary/50 flex items-center justify-center border border-border">
                              <ImageIcon size={32} className="text-muted-foreground opacity-50" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <Badge className={`text-[10px] font-mono uppercase px-2 py-0.5 mb-2 ${getSourceBadgeColor(img.source)}`}>
                                    {img.source}
                                  </Badge>
                                  <h3 className="font-semibold text-sm">{img.metadata.satellite}</h3>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar size={14} />
                                  <span className="font-mono">
                                    {format(new Date(img.captureDate), 'MMM dd, yyyy HH:mm')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <MapPin size={14} />
                                  <span className="font-mono">
                                    {img.location.lat.toFixed(4)}, {img.location.lng.toFixed(4)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <CloudRain size={14} />
                                  <span className="font-mono">
                                    {img.cloudCover}% cloud cover
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mt-3">
                                <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                                  {img.resolution} resolution
                                </Badge>
                                <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                                  {img.bands.length} bands
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="w-1/3 overflow-hidden flex flex-col">
            <div className="border-b border-border bg-secondary/10 px-4 py-2">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                Image Details
              </p>
            </div>
            <ScrollArea className="flex-1">
              {selectedImage ? (
                <div className="p-4 space-y-4">
                  <div className="aspect-square rounded-md overflow-hidden bg-secondary/50 flex items-center justify-center border border-border">
                    <ImageIcon size={64} className="text-muted-foreground opacity-50" />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm mb-1">{selectedImage.metadata.satellite}</h3>
                    <Badge className={`text-[10px] font-mono uppercase px-2 py-0.5 ${getSourceBadgeColor(selectedImage.source)}`}>
                      {selectedImage.source.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-mono uppercase text-muted-foreground">Capture Date</Label>
                      <p className="text-sm font-mono mt-1">
                        {format(new Date(selectedImage.captureDate), 'MMMM dd, yyyy')}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {format(new Date(selectedImage.captureDate), 'HH:mm:ss')} UTC
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs font-mono uppercase text-muted-foreground">Location</Label>
                      <p className="text-sm font-mono mt-1">
                        Lat: {selectedImage.location.lat.toFixed(6)}
                      </p>
                      <p className="text-sm font-mono">
                        Lng: {selectedImage.location.lng.toFixed(6)}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs font-mono uppercase text-muted-foreground">Resolution</Label>
                      <p className="text-sm font-mono mt-1">{selectedImage.resolution}</p>
                    </div>

                    <div>
                      <Label className="text-xs font-mono uppercase text-muted-foreground">Cloud Cover</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${selectedImage.cloudCover}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono">{selectedImage.cloudCover}%</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-mono uppercase text-muted-foreground">Spectral Bands</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedImage.bands.map((band, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] font-mono px-2 py-0.5">
                            {band}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-mono uppercase text-muted-foreground">Metadata</Label>
                      <div className="mt-1 space-y-1">
                        {Object.entries(selectedImage.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-muted-foreground font-mono">{key}:</span>
                            <span className="font-mono">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button className="w-full gap-2" variant="default">
                      <Download size={16} weight="bold" />
                      Download Image
                    </Button>
                    <Button 
                      className="w-full gap-2" 
                      variant="outline"
                      onClick={() => {
                        toast.info('Analyzing satellite imagery...')
                      }}
                    >
                      <ImageIcon size={16} weight="bold" />
                      Analyze with AI
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center">
                    <ImageIcon size={32} className="text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground font-mono uppercase">
                      Select an image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click on imagery to view details
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
