export interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  fileType: string
  size: number
  url: string
  thumbnailUrl?: string
  uploadedAt: string
  description?: string
  tags?: string[]
  analysis?: AssetAnalysis
}

export interface AssetAnalysis {
  status: 'pending' | 'analyzing' | 'complete' | 'failed'
  timestamp: string
  findings: string[]
  threats?: ThreatAssessment[]
  confidence: number
  summary: string
}

export interface ThreatAssessment {
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  confidence: number
  description: string
  location?: string
}

export interface UploadProgress {
  fileId: string
  fileName: string
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
  error?: string
}
