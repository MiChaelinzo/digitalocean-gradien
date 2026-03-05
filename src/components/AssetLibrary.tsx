import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Asset, AssetAnalysis } from '@/types/assets'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { 
  Image as ImageIcon, 
  VideoCamera, 
  FileText, 
  Trash, 
  MagnifyingGlass,
  X,
  Play,
  DownloadSimple,
  Sparkle,
  Lightning,
  CheckCircle,
  Warning,
  ClockCounterClockwise
} from '@phosphor-icons/react'
import { formatFileSize } from '@/lib/upload-utils'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { AssetPreviewModal } from './AssetPreviewModal'
import { queryAI } from '@/lib/ai-service'

interface AssetLibraryProps {
  isOpen: boolean
  onClose: () => void
  onAnalyzeAsset?: (asset: Asset) => void
}

interface BatchAnalysisProgress {
  assetId: string
  assetName: string
  status: 'pending' | 'analyzing' | 'complete' | 'failed'
  progress: number
  error?: string
}

export function AssetLibrary({ isOpen, onClose, onAnalyzeAsset }: AssetLibraryProps) {
  const [assets, setAssets] = useKV<Asset[]>('intelligence-assets', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'document'>('all')
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set())
  const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false)
  const [batchProgress, setBatchProgress] = useState<BatchAnalysisProgress[]>([])
  const [showBatchProgress, setShowBatchProgress] = useState(false)

  const filteredAssets = (assets || []).filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || asset.type === selectedType
    return matchesSearch && matchesType
  })

  const analyzableAssets = filteredAssets.filter(a => a.type === 'image' || a.type === 'video')
  const allAnalyzableSelected = analyzableAssets.length > 0 && 
    analyzableAssets.every(a => selectedAssets.has(a.id))

  const handleDelete = (assetId: string) => {
    setAssets(currentAssets => (currentAssets || []).filter(a => a.id !== assetId))
    setSelectedAssets(prev => {
      const newSet = new Set(prev)
      newSet.delete(assetId)
      return newSet
    })
    toast.success('Asset deleted')
  }

  const handleDownload = (asset: Asset) => {
    const link = document.createElement('a')
    link.href = asset.url
    link.download = asset.name
    link.click()
    toast.success('Asset downloaded')
  }

  const toggleSelectAsset = (assetId: string) => {
    setSelectedAssets(prev => {
      const newSet = new Set(prev)
      if (newSet.has(assetId)) {
        newSet.delete(assetId)
      } else {
        newSet.add(assetId)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (allAnalyzableSelected) {
      setSelectedAssets(new Set())
    } else {
      setSelectedAssets(new Set(analyzableAssets.map(a => a.id)))
    }
  }

  const analyzeAsset = async (asset: Asset): Promise<AssetAnalysis> => {
    const systemPrompt = `You are a military intelligence analyst specializing in visual asset analysis.
    
Analyze the provided ${asset.type} intelligence asset and provide:
- Detailed object and threat detection
- Strategic assessment and implications
- Confidence levels for findings
- Actionable intelligence recommendations

Respond with detailed tactical intelligence.`

    const userPrompt = `Analyze this ${asset.type} asset: ${asset.name}
Type: ${asset.fileType}
Size: ${formatFileSize(asset.size)}
${asset.description ? `Description: ${asset.description}` : ''}

Provide comprehensive intelligence analysis including:
1. Visual content identification
2. Potential threat assessment
3. Strategic implications
4. Recommended actions
5. Confidence level (0-100%)`

    try {
      const { text } = await queryAI(systemPrompt, userPrompt)
      
      const findings = text.split('\n').filter(line => line.trim().length > 0)
      
      const confidenceMatch = text.match(/confidence.*?(\d+)%/i)
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 75
      
      const analysis: AssetAnalysis = {
        status: 'complete',
        timestamp: new Date().toISOString(),
        findings: findings.slice(0, 10),
        confidence,
        summary: text.slice(0, 500)
      }

      return analysis
    } catch (error) {
      console.error('Analysis failed:', error)
      throw error
    }
  }

  const handleBatchAnalysis = async () => {
    if (selectedAssets.size === 0) {
      toast.error('No assets selected for analysis')
      return
    }

    const assetsToAnalyze = (assets || []).filter(a => selectedAssets.has(a.id))
    
    setIsBatchAnalyzing(true)
    setShowBatchProgress(true)
    
    const progressItems: BatchAnalysisProgress[] = assetsToAnalyze.map(asset => ({
      assetId: asset.id,
      assetName: asset.name,
      status: 'pending',
      progress: 0
    }))
    
    setBatchProgress(progressItems)

    toast.info(`Starting batch analysis of ${assetsToAnalyze.length} assets`)

    for (let i = 0; i < assetsToAnalyze.length; i++) {
      const asset = assetsToAnalyze[i]
      
      setBatchProgress(prev => 
        prev.map(item => 
          item.assetId === asset.id 
            ? { ...item, status: 'analyzing', progress: 50 }
            : item
        )
      )

      try {
        const analysis = await analyzeAsset(asset)
        
        setAssets(currentAssets => 
          (currentAssets || []).map(a => 
            a.id === asset.id 
              ? { ...a, analysis }
              : a
          )
        )

        setBatchProgress(prev => 
          prev.map(item => 
            item.assetId === asset.id 
              ? { ...item, status: 'complete', progress: 100 }
              : item
          )
        )

        toast.success(`Analysis complete: ${asset.name}`)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Analysis failed'
        
        setBatchProgress(prev => 
          prev.map(item => 
            item.assetId === asset.id 
              ? { ...item, status: 'failed', progress: 0, error: errorMsg }
              : item
          )
        )

        toast.error(`Failed to analyze ${asset.name}`)
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setIsBatchAnalyzing(false)
    
    const completedCount = batchProgress.filter(p => p.status === 'complete').length
    toast.success(`Batch analysis complete: ${completedCount}/${assetsToAnalyze.length} successful`)
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

          <div className="space-y-3">
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

            {analyzableAssets.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border">
                <Checkbox
                  id="select-all"
                  checked={allAnalyzableSelected}
                  onCheckedChange={toggleSelectAll}
                />
                <label 
                  htmlFor="select-all" 
                  className="text-sm font-mono cursor-pointer flex-1"
                >
                  {selectedAssets.size > 0 
                    ? `${selectedAssets.size} asset${selectedAssets.size !== 1 ? 's' : ''} selected`
                    : 'Select all analyzable assets'
                  }
                </label>
                {selectedAssets.size > 0 && (
                  <Button
                    onClick={handleBatchAnalysis}
                    disabled={isBatchAnalyzing}
                    size="sm"
                    className="gap-2 font-mono uppercase"
                  >
                    <Lightning size={16} weight="fill" />
                    {isBatchAnalyzing ? 'Analyzing...' : `Batch Analyze (${selectedAssets.size})`}
                  </Button>
                )}
              </div>
            )}

            {showBatchProgress && batchProgress.length > 0 && (
              <div className="p-4 bg-card border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-mono font-semibold uppercase">Batch Analysis Progress</h4>
                  {!isBatchAnalyzing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowBatchProgress(false)}
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
                <ScrollArea className="max-h-48">
                  <div className="space-y-2 pr-3">
                    {batchProgress.map((item) => (
                      <div key={item.assetId} className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono truncate flex-1">
                            {item.assetName}
                          </span>
                          {item.status === 'complete' && (
                            <CheckCircle size={14} weight="fill" className="text-success flex-shrink-0" />
                          )}
                          {item.status === 'failed' && (
                            <Warning size={14} weight="fill" className="text-destructive flex-shrink-0" />
                          )}
                          {item.status === 'analyzing' && (
                            <div className="w-3 h-3 bg-primary rounded-full animate-pulse flex-shrink-0" />
                          )}
                          {item.status === 'pending' && (
                            <ClockCounterClockwise size={14} className="text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        {item.status === 'analyzing' && (
                          <Progress value={item.progress} className="h-1" />
                        )}
                        {item.status === 'failed' && item.error && (
                          <p className="text-[10px] text-destructive font-mono">
                            {item.error}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
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
                      {filteredAssets.map((asset) => {
                        const isAnalyzable = asset.type === 'image' || asset.type === 'video'
                        const isSelected = selectedAssets.has(asset.id)
                        
                        return (
                          <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`group relative border rounded-lg overflow-hidden bg-card hover:border-primary/50 transition-all ${
                              isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                            }`}
                          >
                            {isAnalyzable && (
                              <div className="absolute top-2 left-2 z-10">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleSelectAsset(asset.id)}
                                  className="bg-background/90 backdrop-blur-sm"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}
                            
                            {asset.analysis && (
                              <div className="absolute top-2 right-2 z-10">
                                <Badge 
                                  variant={asset.analysis.status === 'complete' ? 'default' : 'secondary'}
                                  className={`text-[10px] font-mono ${
                                    asset.analysis.status === 'complete' 
                                      ? 'bg-success text-success-foreground' 
                                      : ''
                                  }`}
                                >
                                  {asset.analysis.status === 'complete' && (
                                    <CheckCircle size={10} weight="fill" className="mr-1" />
                                  )}
                                  {asset.analysis.status === 'analyzing' && 'Analyzing...'}
                                  {asset.analysis.status === 'complete' && 'Analyzed'}
                                  {asset.analysis.status === 'failed' && 'Failed'}
                                </Badge>
                              </div>
                            )}

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
                                {onAnalyzeAsset && isAnalyzable && (
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
                        )
                      })}
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
