import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Asset } from '@/types/assets'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Image as ImageIcon, 
  VideoCamera, 
  FileText, 
  Trash, 
  MagnifyingGlass,
  X,
  Play,
  DownloadSimple,
  Sparkle
} from '@phosphor-icons/react'
import { formatFileSize } from '@/lib/upload-utils'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { AssetPreviewModal } from './AssetPreviewModal'

interface AssetLibraryProps {
  isOpen: boolean
  onClose: () => void
  onAnalyzeAsset?: (asset: Asset) => void
}

export function AssetLibrary({ isOpen, onClose, onAnalyzeAsset }: AssetLibraryProps) {
  const [assets, setAssets] = useKV<Asset[]>('intelligence-assets', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'document'>('all')
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)

  const filteredAssets = (assets || []).filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || asset.type === selectedType
    return matchesSearch && matchesType
  })

  const handleDelete = (assetId: string) => {
    setAssets(currentAssets => (currentAssets || []).filter(a => a.id !== assetId))
    toast.success('Asset deleted')
  }

  const handleDownload = (asset: Asset) => {
    const link = document.createElement('a')
    link.href = asset.url
    link.download = asset.name
    link.click()
    toast.success('Asset downloaded')
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={20} weight="fill" />
      case 'video':
        return <VideoCamera size={20} weight="fill" />
      default:
        return <FileText size={20} weight="fill" />
    }
  }

  const imageAssets = filteredAssets.filter(a => a.type === 'image')
  const videoAssets = filteredAssets.filter(a => a.type === 'video')
  const documentAssets = filteredAssets.filter(a => a.type === 'document')

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-mono uppercase tracking-wide">
              Intelligence Asset Library
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <MagnifyingGlass 
                size={16} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
              />
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 font-mono text-sm"
              />
            </div>
            {searchQuery && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </Button>
            )}
          </div>

          <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as typeof selectedType)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="gap-2">
                All ({filteredAssets.length})
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2">
                <ImageIcon size={16} />
                Images ({imageAssets.length})
              </TabsTrigger>
              <TabsTrigger value="video" className="gap-2">
                <VideoCamera size={16} />
                Videos ({videoAssets.length})
              </TabsTrigger>
              <TabsTrigger value="document" className="gap-2">
                <FileText size={16} />
                Documents ({documentAssets.length})
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-4">
              <TabsContent value={selectedType} className="mt-0">
                {filteredAssets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <ImageIcon size={32} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">
                      {searchQuery ? 'No assets match your search' : 'No assets uploaded yet'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                    <AnimatePresence>
                      {filteredAssets.map((asset) => (
                        <motion.div
                          key={asset.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group relative border border-border rounded-lg overflow-hidden bg-card hover:border-primary/50 transition-all"
                        >
                          <button
                            onClick={() => setPreviewAsset(asset)}
                            className="w-full aspect-square flex items-center justify-center bg-secondary relative overflow-hidden"
                          >
                            {asset.thumbnailUrl ? (
                              <img
                                src={asset.thumbnailUrl}
                                alt={asset.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 text-muted-foreground">
                                {getIcon(asset.type)}
                              </div>
                            )}
                            
                            {asset.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                                  <Play size={24} weight="fill" className="text-primary-foreground ml-1" />
                                </div>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDownload(asset)
                                }}
                              >
                                <DownloadSimple size={16} />
                              </Button>
                              {onAnalyzeAsset && (asset.type === 'image' || asset.type === 'video') && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onAnalyzeAsset(asset)
                                    onClose()
                                  }}
                                >
                                  <Sparkle size={16} weight="fill" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(asset.id)
                                }}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </button>

                          <div className="p-2">
                            <p className="font-mono text-xs font-medium truncate mb-1">
                              {asset.name}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-[10px] font-mono">
                                {asset.type}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {formatFileSize(asset.size)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-xs text-muted-foreground font-mono">
              Total: {(assets || []).length} asset{(assets || []).length !== 1 ? 's' : ''}
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {previewAsset && (
        <AssetPreviewModal
          asset={previewAsset}
          isOpen={!!previewAsset}
          onClose={() => setPreviewAsset(null)}
          onAnalyze={onAnalyzeAsset}
        />
      )}
    </>
  )
}
