import type { Asset } from '@/types/assets'

const MAX_FILE_SIZE = 50 * 1024 * 1024

const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  document: ['application/pdf', 'text/plain', 'application/json', 'text/markdown']
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 50MB limit (${formatFileSize(file.size)})`
    }
  }

  const isAllowed = Object.values(ALLOWED_FILE_TYPES)
    .flat()
    .includes(file.type)

  if (!isAllowed) {
    return {
      valid: false,
      error: `File type not supported: ${file.type}`
    }
  }

  return { valid: true }
}

export function getAssetType(fileType: string): 'image' | 'video' | 'document' {
  if (ALLOWED_FILE_TYPES.image.includes(fileType)) return 'image'
  if (ALLOWED_FILE_TYPES.video.includes(fileType)) return 'video'
  return 'document'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function generateThumbnail(file: File): Promise<string | undefined> {
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    return undefined
  }

  if (file.type.startsWith('image/')) {
    return await fileToDataURL(file)
  }

  if (file.type.startsWith('video/')) {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      video.onloadeddata = () => {
        video.currentTime = 1
      }

      video.onseeked = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL())
        video.src = ''
      }

      video.onerror = () => resolve(undefined)
      video.src = URL.createObjectURL(file)
    })
  }

  return undefined
}

export async function processFileUpload(file: File): Promise<Partial<Asset>> {
  const validation = validateFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const dataURL = await fileToDataURL(file)
  const thumbnailUrl = await generateThumbnail(file)
  const assetType = getAssetType(file.type)

  return {
    name: file.name,
    type: assetType,
    fileType: file.type,
    size: file.size,
    url: dataURL,
    thumbnailUrl,
    uploadedAt: new Date().toISOString()
  }
}

export function getFileIcon(type: 'image' | 'video' | 'document'): string {
  switch (type) {
    case 'image':
      return 'Image'
    case 'video':
      return 'Video'
    case 'document':
      return 'File'
  }
}
