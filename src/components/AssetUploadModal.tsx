import { useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Asset } from '@/types/assets'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { UploadSimple, X, CheckCircle, Warning } from '@phosphor-icons/react'
import { processFileUpload, formatFileSize } from '@/lib/upload-utils'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface AssetUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete?: (assets: Asset[]) => void
}

interface FileWithProgress {
  file: File
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'complete' | 'error'
  error?: string
  asset?: Asset
}

export function AssetUploadModal({ isOpen, onClose, onUploadComplete }: AssetUploadModalProps) {
  const [assets, setAssets] = useKV<Asset[]>('intelligence-assets', [])
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }, [])

  const addFiles = (newFiles: File[]) => {
    const fileObjects: FileWithProgress[] = newFiles.map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      progress: 0,
      status: 'pending' as const
    }))

    setFiles(prev => [...prev, ...fileObjects])
    
    fileObjects.forEach(fileObj => {
      uploadFile(fileObj)
    })
  }

  const uploadFile = async (fileObj: FileWithProgress) => {
    setFiles(prev => 
      prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploading' } : f)
    )

    try {
      const progressInterval = setInterval(() => {
        setFiles(prev => 
          prev.map(f => {
            if (f.id === fileObj.id && f.progress < 90) {
              return { ...f, progress: Math.min(f.progress + 10, 90) }
            }
            return f
          })
        )
      }, 100)

      const processedAsset = await processFileUpload(fileObj.file)
      
      clearInterval(progressInterval)

      const newAsset: Asset = {
        id: `asset-${Date.now()}-${Math.random()}`,
        ...processedAsset,
        name: processedAsset.name || fileObj.file.name,
        type: processedAsset.type || 'document',
        fileType: processedAsset.fileType || fileObj.file.type,
        size: processedAsset.size || fileObj.file.size,
        url: processedAsset.url || '',
        uploadedAt: processedAsset.uploadedAt || new Date().toISOString()
      }

      setAssets(currentAssets => [...(currentAssets || []), newAsset])

      setFiles(prev =>
        prev.map(f =>
          f.id === fileObj.id
            ? { ...f, status: 'complete', progress: 100, asset: newAsset }
            : f
        )
      )

      toast.success(`${fileObj.file.name} uploaded successfully`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      setFiles(prev =>
        prev.map(f =>
          f.id === fileObj.id
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      )

      toast.error(`Failed to upload ${fileObj.file.name}: ${errorMessage}`)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleClose = () => {
    const completedAssets = files
      .filter(f => f.status === 'complete' && f.asset)
      .map(f => f.asset!)

    if (completedAssets.length > 0 && onUploadComplete) {
      onUploadComplete(completedAssets)
    }

    setFiles([])
    onClose()
  }

  const allComplete = files.length > 0 && files.every(f => f.status === 'complete' || f.status === 'error')
  const hasErrors = files.some(f => f.status === 'error')

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-mono uppercase tracking-wide">
            Upload Intelligence Assets
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 transition-all
              ${isDragging 
                ? 'border-primary bg-primary/10 scale-[1.02]' 
                : 'border-border hover:border-primary/50'
              }
            `}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center
                ${isDragging ? 'bg-primary/20' : 'bg-secondary'}
              `}>
                <UploadSimple size={32} className={isDragging ? 'text-primary' : 'text-muted-foreground'} />
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  Images (JPG, PNG, WEBP), Videos (MP4, WEBM), Documents (PDF, TXT, JSON)
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  Maximum file size: 50MB
                </p>
              </div>

              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.txt,.json,.md"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Select Files
                </label>
              </Button>
            </div>
          </div>

          {files.length > 0 && (
            <ScrollArea className="flex-1">
              <div className="space-y-2 pr-4">
                <AnimatePresence>
                  {files.map((fileObj) => (
                    <motion.div
                      key={fileObj.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="border border-border rounded-lg p-4 bg-card"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm font-medium truncate">
                            {fileObj.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {formatFileSize(fileObj.file.size)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {fileObj.status === 'complete' && (
                            <Badge variant="default" className="gap-1 bg-success text-success-foreground">
                              <CheckCircle size={14} weight="fill" />
                              Complete
                            </Badge>
                          )}
                          {fileObj.status === 'error' && (
                            <Badge variant="destructive" className="gap-1">
                              <Warning size={14} weight="fill" />
                              Failed
                            </Badge>
                          )}
                          {fileObj.status === 'uploading' && (
                            <Badge variant="secondary" className="gap-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                              Uploading
                            </Badge>
                          )}

                          {(fileObj.status === 'pending' || fileObj.status === 'error') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile(fileObj.id)}
                            >
                              <X size={16} />
                            </Button>
                          )}
                        </div>
                      </div>

                      {fileObj.status === 'uploading' && (
                        <Progress value={fileObj.progress} className="h-1" />
                      )}

                      {fileObj.status === 'error' && fileObj.error && (
                        <p className="text-xs text-destructive font-mono mt-2">
                          {fileObj.error}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-xs text-muted-foreground font-mono">
            {files.length} {files.length === 1 ? 'file' : 'files'} selected
            {allComplete && !hasErrors && (
              <span className="text-success ml-2">• All uploads complete</span>
            )}
          </p>
          <Button
            onClick={handleClose}
            disabled={files.some(f => f.status === 'uploading')}
          >
            {allComplete ? 'Done' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
