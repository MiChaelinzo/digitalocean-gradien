import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { MessageBubble } from '@/components/MessageBubble'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PaperPlaneRight, Plus, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

function App() {
  const [messages, setMessages] = useKV<Message[]>('chat-messages', [])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent])

  const getFormattedTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    
    if (!textToSend || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: getFormattedTime()
    }

    setMessages(currentMessages => [...(currentMessages || []), userMessage])
    setInput('')
    setIsLoading(true)
    setStreamingContent('')

    try {
      const promptText = `You are an expert UI/UX design consultant and creative director with deep knowledge of design principles, accessibility, color theory, typography, and modern web development. You're helping designers and developers improve their work through thoughtful, actionable feedback.

When analyzing designs or providing feedback:
- Be specific and reference concrete design principles
- Suggest actionable improvements with examples
- Consider accessibility (WCAG standards, color contrast, readability)
- Think about user experience and usability
- Reference modern design trends when relevant

When asked for design ideation:
- Provide 2-3 distinct creative directions
- Include specific color palettes (use hex codes or OKLCH values)
- Suggest appropriate typefaces with reasoning
- Explain the emotional impact and brand alignment

When generating code:
- Use Tailwind CSS utilities when possible
- Provide clean, semantic HTML structure
- Include accessibility attributes
- Explain key implementation decisions

User message: ${textToSend}

Provide a thoughtful, detailed response that helps the user improve their design work.`

      const response = await window.spark.llm(promptText, 'gpt-4o')
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: getFormattedTime()
      }

      setMessages(currentMessages => [...(currentMessages || []), assistantMessage])
      
    } catch (error) {
      console.error('Error calling AI:', error)
      toast.error('Failed to get AI response. Please try again.')
    } finally {
      setIsLoading(false)
      setStreamingContent('')
    }
  }

  const handleExampleClick = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  const handleNewConversation = () => {
    if (messages && messages.length > 0) {
      setMessages([])
      toast.success('Started new conversation')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const messageList = messages || []

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkle size={20} weight="fill" className="text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Gradient AI Design Studio</h1>
              <p className="text-xs text-muted-foreground hidden md:block">Powered by DigitalOcean Gradient™</p>
            </div>
          </div>
          
          {messageList.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewConversation}
              className="gap-2"
            >
              <Plus size={16} weight="bold" />
              <span className="hidden md:inline">New Chat</span>
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="container mx-auto px-4 md:px-6 py-6">
            {messageList.length === 0 ? (
              <WelcomeScreen onExampleClick={handleExampleClick} />
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                <AnimatePresence>
                  {messageList.map((message) => (
                    <MessageBubble
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      timestamp={message.timestamp}
                    />
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <MessageBubble
                    role="assistant"
                    content={streamingContent || "Thinking..."}
                    timestamp={getFormattedTime()}
                    isStreaming={!streamingContent}
                  />
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="border-t border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 md:gap-4 items-end">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your design, ask for feedback, or request code generation..."
                  className="min-h-[60px] max-h-[200px] resize-none pr-4 text-[15px] md:text-base"
                  disabled={isLoading}
                />
              </div>
              
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground h-[60px] px-6"
              >
                <PaperPlaneRight size={20} weight="fill" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App