export interface Asset {
  name: stri
  name: string
  type: 'image' | 'video' | 'document'
  uploadedAt: stri
  tags?: strin
}
export interface AssetA
  timestamp: string
  threats?: ThreatAsse
  summary: string

 

  location?: string

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

  fileName: string

  status: 'uploading' | 'processing' | 'complete' | 'error'

}
