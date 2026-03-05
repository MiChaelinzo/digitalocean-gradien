/**
 * DigitalOcean Gradient™ AI Platform Client
 *
 * Provides chat completion and streaming inference via the
 * DigitalOcean Gradient serverless inference API.
 *
 * Endpoint: https://inference.do-ai.run/v1/chat/completions
 * Docs: https://docs.digitalocean.com/products/gradient-ai-platform/how-to/use-serverless-inference/
 */

const GRADIENT_API_BASE = 'https://inference.do-ai.run/v1'

export interface GradientMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GradientChatCompletionRequest {
  model: string
  messages: GradientMessage[]
  stream?: boolean
  temperature?: number
  max_tokens?: number
}

export interface GradientChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface GradientConfig {
  apiKey: string
  model: string
}

const STORAGE_KEY = 'sentinel-gradient-config'

/** Available models on DigitalOcean Gradient. */
export const GRADIENT_MODELS = [
  { id: 'llama3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', provider: 'Meta' },
  { id: 'llama3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', provider: 'Meta' },
  { id: 'mistral-small-24b-instruct-2501', name: 'Mistral Small 24B', provider: 'Mistral' },
] as const

export const DEFAULT_MODEL = 'llama3.3-70b-instruct'

/** Load saved Gradient configuration from localStorage. */
export function loadGradientConfig(): GradientConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const config = JSON.parse(raw) as GradientConfig
    if (!config.apiKey) return null
    return config
  } catch {
    return null
  }
}

/** Persist Gradient configuration to localStorage. */
export function saveGradientConfig(config: GradientConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

/** Clear saved Gradient configuration. */
export function clearGradientConfig(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/** Check whether a Gradient API key is configured. */
export function isGradientConfigured(): boolean {
  return loadGradientConfig() !== null
}

/**
 * Call DigitalOcean Gradient chat completions (non-streaming).
 */
export async function gradientChatCompletion(
  messages: GradientMessage[],
  model?: string,
): Promise<string> {
  const config = loadGradientConfig()
  if (!config) throw new Error('DigitalOcean Gradient API key not configured')

  const response = await fetch(`${GRADIENT_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || config.model || DEFAULT_MODEL,
      messages,
      stream: false,
    } satisfies GradientChatCompletionRequest),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`Gradient API error ${response.status}: ${errorText}`)
  }

  const data = (await response.json()) as GradientChatCompletionResponse
  return data.choices[0]?.message?.content ?? ''
}

/**
 * Call DigitalOcean Gradient chat completions with SSE streaming.
 * Returns the full accumulated text.
 */
export async function gradientStreamingCompletion(
  messages: GradientMessage[],
  onChunk?: (text: string) => void,
  model?: string,
): Promise<string> {
  const config = loadGradientConfig()
  if (!config) throw new Error('DigitalOcean Gradient API key not configured')

  const response = await fetch(`${GRADIENT_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || config.model || DEFAULT_MODEL,
      messages,
      stream: true,
    } satisfies GradientChatCompletionRequest),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`Gradient API error ${response.status}: ${errorText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('Response body is not readable')

  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''

    for (const event of events) {
      for (const line of event.split('\n')) {
        if (!line.startsWith('data:')) continue
        const jsonStr = line.slice(5).trim()
        if (jsonStr === '[DONE]') continue
        try {
          const delta = JSON.parse(jsonStr)
          const content = delta.choices?.[0]?.delta?.content
          if (content) {
            fullText += content
            onChunk?.(fullText)
          }
        } catch {
          // skip malformed chunks
        }
      }
    }
  }

  return fullText
}
