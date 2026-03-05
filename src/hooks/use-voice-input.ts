import { useState, useEffect, useRef, useCallback } from 'react'
import '../types/speech-recognition'

interface VoiceInputOptions {
  continuous?: boolean
  interimResults?: boolean
  lang?: string
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
}

export function useVoiceInput({
  continuous = true,
  interimResults = true,
  lang = 'en-US',
  onResult,
  onError,
}: VoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    setIsSupported(true)

    const recognition = new SpeechRecognition()
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = lang
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
      setInterimTranscript('')
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcriptText = result[0].transcript

        if (result.isFinal) {
          finalTranscript += transcriptText + ' '
        } else {
          interimText += transcriptText
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript)
        if (onResult) {
          onResult(finalTranscript.trim())
        }
      }

      setInterimTranscript(interimText)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      
      let errorMessage = 'Voice recognition error'
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.'
          break
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your audio input.'
          break
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please enable microphone permissions.'
          break
        case 'network':
          errorMessage = 'Network error. Please check your connection.'
          break
        case 'aborted':
          errorMessage = 'Voice recognition aborted.'
          break
        default:
          errorMessage = `Voice recognition error: ${event.error}`
      }

      if (onError) {
        onError(errorMessage)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [continuous, interimResults, lang, onResult, onError])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Failed to start voice recognition:', error)
      }
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  }
}
