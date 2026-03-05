export interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  size: number
  uploadedAt: string
  url?: string
  thumbnailUrl?: string
  tags?: string[]
}

export interface AssetAnalysis {
  assetId: string
  timestamp: string
  findings: string[]
  threats?: ThreatAssessment[]
  confidence: number
  summary: string
  location?: string
}

export interface ThreatAssessment {
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  confidence: number
  description: string
  location?: string
}

export interface UploadProgress {
  fileName: string
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
  error?: string
}
