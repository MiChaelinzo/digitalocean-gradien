/**
 * Unified AI Service
 *
 * Uses DigitalOcean Gradient™ AI as the primary inference provider.
 * Falls back to GitHub Spark LLM when Gradient is not configured.
 */

import {
  isGradientConfigured,
  gradientChatCompletion,
  gradientStreamingCompletion,
  type GradientMessage,
} from './gradient-client'

export type AIProvider = 'gradient' | 'spark'

/** Returns which AI provider will be used for inference. */
export function getActiveProvider(): AIProvider {
  return isGradientConfigured() ? 'gradient' : 'spark'
}

/**
 * Send a prompt to the AI and get a response.
 *
 * Tries DigitalOcean Gradient first; falls back to Spark.
 */
export async function queryAI(
  systemPrompt: string,
  userPrompt: string,
): Promise<{ text: string; provider: AIProvider }> {
  // Try Gradient first
  if (isGradientConfigured()) {
    try {
      const messages: GradientMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]
      const text = await gradientChatCompletion(messages)
      return { text, provider: 'gradient' }
    } catch (error) {
      console.warn('Gradient API call failed, falling back to Spark:', error)
    }
  }

  // Fallback to Spark
  const combined = `${systemPrompt}\n\nUser query: ${userPrompt}\n\nProvide detailed analysis.`
  const text = await window.spark.llm(combined, 'gpt-4o')
  return { text, provider: 'spark' }
}

/**
 * Send a prompt and stream the response.
 *
 * Tries DigitalOcean Gradient first; falls back to Spark.
 */
export async function queryAIStreaming(
  systemPrompt: string,
  userPrompt: string,
  onChunk?: (text: string) => void,
): Promise<{ text: string; provider: AIProvider }> {
  // Try Gradient first
  if (isGradientConfigured()) {
    try {
      const messages: GradientMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]
      const text = await gradientStreamingCompletion(messages, onChunk)
      return { text, provider: 'gradient' }
    } catch (error) {
      console.warn('Gradient streaming failed, falling back to Spark:', error)
    }
  }

  // Fallback to Spark (non-streaming)
  const combined = `${systemPrompt}\n\nUser query: ${userPrompt}\n\nProvide detailed analysis.`
  const text = await window.spark.llm(combined, 'gpt-4o', true)
  return { text, provider: 'spark' }
}

/**
 * Simple prompt-based query (for summary generation, etc.).
 *
 * Tries DigitalOcean Gradient first; falls back to Spark.
 */
export async function queryAISimple(
  prompt: string,
): Promise<{ text: string; provider: AIProvider }> {
  if (isGradientConfigured()) {
    try {
      const messages: GradientMessage[] = [
        { role: 'user', content: prompt },
      ]
      const text = await gradientChatCompletion(messages)
      return { text, provider: 'gradient' }
    } catch (error) {
      console.warn('Gradient API call failed, falling back to Spark:', error)
    }
  }

  const text = await window.spark.llm(prompt, 'gpt-4o-mini')
  return { text, provider: 'spark' }
}
