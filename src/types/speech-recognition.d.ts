interface ISpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null
  onerror: ((this: ISpeechRecognition, ev: ISpeechRecognitionErrorEvent) => any) | null
  onresult: ((this: ISpeechRecognition, ev: ISpeechRecognitionEvent) => any) | null
  start(): void
  stop(): void
  abort(): void
}

interface ISpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface ISpeechRecognitionEvent extends Event {
  resultIndex: number
  results: ISpeechRecognitionResultList
}

interface ISpeechRecognitionResultList {
  length: number
  item(index: number): ISpeechRecognitionResult
  [index: number]: ISpeechRecognitionResult
}

interface ISpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): ISpeechRecognitionAlternative
  [index: number]: ISpeechRecognitionAlternative
}

interface ISpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition: ISpeechRecognitionConstructor
    webkitSpeechRecognition: ISpeechRecognitionConstructor
  }
}

export {}
