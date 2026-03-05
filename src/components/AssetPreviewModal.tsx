import { useState } from 'react'
import type { Asset } from '@/types/assets'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkle, DownloadSimple, X } from '@phosphor-icons/react'
import { formatFileSize } from '@/lib/upload-utils'
import { toast } from 'sonner'

interface AssetPreviewModalProps {
  asset: Asset
  isOpen: boolean
  onClose: () => void
  onAnalyze?: (asset: Asset) => void
}

export function AssetPreviewModal({ asset, isOpen, onClose, onAnalyze }: AssetPreviewModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!onAnalyze) return
    
    setIsAnalyzing(true)
    try {
      await onAnalyze(asset)
      toast.success('Analysis complete')
      onClose()
    } catch (error) {
      toast.error('Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = asset.url
    link.download = asset.name
    link.click()
    toast.success('Download started')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold font-mono truncate">
                {asset.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  {asset.type}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatFileSize(asset.size)}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {new Date(asset.uploadedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-4">
            <div className="flex items-center justify-center bg-secondary rounded-lg overflow-hidden min-h-[400px]">
              {asset.type === 'image' && (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="max-w-full max-h-[600px] object-contain"
                />
              )}
              
              {asset.type === 'video' && (
                <video
                  src={asset.url}
                  controls
                  className="max-w-full max-h-[600px]"
                >
                  Your browser does not support video playback.
                </video>
              )}
              
              {asset.type === 'document' && (
                <div className="w-full p-8">
                  {asset.fileType === 'application/pdf' ? (
                    <iframe
                      src={asset.url}
                      className="w-full h-[600px] border-0"
                      title={asset.name}
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground font-mono mb-4">
                        Document preview not available
                      </p>
                      <Button onClick={handleDownload}>
                        <DownloadSimple size={16} className="mr-2" />
                        Download to View
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {asset.description && (
              <div className="border border-border rounded-lg p-4 bg-card">
                <h4 className="text-sm font-semibold font-mono uppercase mb-2">
                  Description
                </h4>
                <p className="text-sm text-muted-foreground">
                  {asset.description}
                </p>
              </div>
            )}

            {asset.analysis && (
              <div className="border border-border rounded-lg p-4 bg-card">
                <h4 className="text-sm font-semibold font-mono uppercase mb-2">
                  AI Analysis
                </h4>
                <div className="space-y-2">
                  <p className="text-sm">{asset.analysis.summary}</p>
                  {asset.analysis.findings.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-mono uppercase text-muted-foreground mb-2">
                        Key Findings:
                      </p>
                      <ul className="space-y-1">
                        {asset.analysis.findings.map((finding, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {asset.analysis.threats && asset.analysis.threats.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-mono uppercase text-muted-foreground mb-2">
                        Threat Assessment:
                      </p>
                      <div className="space-y-2">
                        {asset.analysis.threats.map((threat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <Badge 
                              variant={threat.severity === 'critical' ? 'destructive' : 'secondary'}
                              className="mt-0.5"
                            >
                              {threat.severity}
                            </Badge>
                            <div className="flex-1">
                              <p className="font-medium">{threat.type}</p>
                              <p className="text-muted-foreground text-xs">{threat.description}</p>
                              <p className="text-muted-foreground text-xs mt-1">
                                Confidence: {Math.round(threat.confidence * 100)}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
            >
              <DownloadSimple size={16} className="mr-2" />
              Download
            </Button>
            
            {onAnalyze && (asset.type === 'image' || asset.type === 'video') && (
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="gap-2"
              >
                <Sparkle size={16} weight="fill" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
              </Button>
            )}
          </div>
          
          <Button variant="outline" onClick={onClose}>
            <X size={16} className="mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
