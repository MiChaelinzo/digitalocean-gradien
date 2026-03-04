import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { IntelligenceBubble } from '@/components/IntelligenceBubble'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { ThreatMap } from '@/components/ThreatMap'
import { ThreatDashboard } from '@/components/ThreatDashboard'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PaperPlaneRight, Plus, Shield, MapTrifold, Target, ChatCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

function App() {
  const [messages, setMessages] = useKV<Message[]>('intel-messages', [])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [activeTab, setActiveTab] = useState('intelligence')
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
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
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
      const prompt = window.spark.llmPrompt`You are a military intelligence analyst and defense strategist with expertise in:
- Geopolitical conflict analysis
- Aerospace threat detection and classification
- Missile defense systems and countermeasures
- Military tactics and strategic planning
- Naval, air, and ground force operations
- Electronic warfare and cyber defense

You provide technical, precise intelligence reports with:
- Threat assessments with severity levels
- Strategic recommendations with timelines
- Resource allocation suggestions
- Defensive countermeasure protocols
- Tactical operational details

Current theaters of interest:
- GCC-Iran tensions in Persian Gulf
- Israel-Iran conflict including missile defense
- Ukraine theater operations
- Cuba strategic monitoring
- South China Sea military activity
- Taiwan Strait tensions

When analyzing threats or conflicts:
1. Provide technical specifications when relevant
2. Include threat probability assessments
3. Recommend specific defensive measures
4. Consider multi-domain warfare aspects
5. Reference relevant military doctrine
6. Suggest resource positioning

User intelligence query: ${textToSend}

Provide detailed military intelligence analysis with actionable recommendations.`

      const response = await window.spark.llm(prompt, 'gpt-4o')
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: getFormattedTime()
      }

      setMessages(currentMessages => [...(currentMessages || []), assistantMessage])
      
    } catch (error) {
      console.error('Error calling intelligence system:', error)
      toast.error('Intelligence system offline. Check connection.')
    } finally {
      setIsLoading(false)
      setStreamingContent('')
    }
  }

  const handleExampleClick = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
    setActiveTab('intelligence')
  }

  const handleConflictSelect = (conflict: any) => {
    const prompt = `Provide detailed intelligence briefing on ${conflict.name}: current status, threat assessment, strategic implications, and defensive recommendations.`
    setInput(prompt)
    setActiveTab('intelligence')
    textareaRef.current?.focus()
  }

  const handleNewSession = () => {
    if (messages && messages.length > 0) {
      setMessages([])
      toast.success('New intelligence session started')
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
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/20 border-2 border-primary flex items-center justify-center">
              <Shield size={20} weight="fill" className="text-primary" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-wide uppercase">SENTINEL</h1>
              <p className="text-[10px] md:text-xs text-muted-foreground font-mono hidden sm:block">
                MILITARY INTELLIGENCE PLATFORM // GRADIENT™ AI
              </p>
            </div>
          </div>
          
          {messageList.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewSession}
              className="gap-2 text-xs font-mono uppercase"
            >
              <Plus size={16} weight="bold" />
              <span className="hidden md:inline">New Session</span>
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b border-border bg-card/20">
            <div className="container mx-auto px-4 md:px-6">
              <TabsList className="bg-transparent gap-1 h-auto p-0">
                <TabsTrigger 
                  value="intelligence" 
                  className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs uppercase px-3 md:px-4 py-2"
                >
                  <ChatCircle size={16} weight="fill" />
                  <span className="hidden sm:inline">Intelligence</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="map" 
                  className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs uppercase px-3 md:px-4 py-2"
                >
                  <MapTrifold size={16} weight="fill" />
                  <span className="hidden sm:inline">Conflict Map</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="threats" 
                  className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs uppercase px-3 md:px-4 py-2"
                >
                  <Target size={16} weight="fill" />
                  <span className="hidden sm:inline">Threats</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="intelligence" className="h-full m-0">
              <ScrollArea ref={scrollAreaRef} className="h-full">
                <div className="container mx-auto px-4 md:px-6 py-6">
                  {messageList.length === 0 ? (
                    <WelcomeScreen onExampleClick={handleExampleClick} />
                  ) : (
                    <div className="max-w-5xl mx-auto space-y-6">
                      <AnimatePresence>
                        {messageList.map((message) => (
                          <IntelligenceBubble
                            key={message.id}
                            role={message.role}
                            content={message.content}
                            timestamp={message.timestamp}
                          />
                        ))}
                      </AnimatePresence>
                      
                      {isLoading && (
                        <IntelligenceBubble
                          role="assistant"
                          content={streamingContent || "Processing intelligence query..."}
                          timestamp={getFormattedTime()}
                          isStreaming={!streamingContent}
                        />
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="map" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="container mx-auto px-4 md:px-6 py-6">
                  <ThreatMap onConflictSelect={handleConflictSelect} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="threats" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="container mx-auto px-4 md:px-6 py-6">
                  <ThreatDashboard />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="border-t border-border bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="max-w-5xl mx-auto">
            <div className="flex gap-2 md:gap-3 items-end">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter intelligence query or threat analysis request..."
                  className="min-h-[56px] max-h-[200px] resize-none pr-4 text-sm md:text-[15px] font-mono bg-secondary/50"
                  disabled={isLoading}
                />
              </div>
              
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-[56px] px-5"
              >
                <PaperPlaneRight size={18} weight="fill" />
              </Button>
            </div>
            
            <p className="text-[10px] text-muted-foreground mt-2 text-center font-mono uppercase tracking-wide">
              ENTER TO SEND // SHIFT+ENTER NEW LINE // CLASSIFIED SYSTEM
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
