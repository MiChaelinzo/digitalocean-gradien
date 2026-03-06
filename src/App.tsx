import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { IntelligenceBubble } from '@/components/IntelligenceBubble'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { Globe3D } from '@/components/Globe3D'
import { ThreatDashboard } from '@/components/ThreatDashboard'
import { SessionHistory } from '@/components/SessionHistory'
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'
import { StatusNotifications } from '@/components/StatusNotifications'
import { ThreatNotificationPanel } from '@/components/ThreatNotificationPanel'
import { useThreatNotifications } from '@/hooks/use-threat-notifications'
import { useVoiceInput } from '@/hooks/use-voice-input'
import { GradientConfigPanel, GradientStatusBadge } from '@/components/GradientConfig'
import { queryAI } from '@/lib/ai-service'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { PaperPlaneRight, Plus, Shield, Globe, Target, ChatCircle, Clock, Keyboard as KeyboardIcon, FileArrowDown, Bell, ChartLine, MagnifyingGlass, BookmarkSimple, ArrowsLeftRight, FileText, TrendUp, GearSix, Microphone, Stop, UploadSimple, FolderOpen, Users, Gauge, Layout, SignOut } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchFilter, type SearchFilters } from '@/components/SearchFilter'
import { BookmarksPanel, useBookmarks } from '@/components/BookmarksPanel'
import { ReportGenerator } from '@/components/ReportGenerator'
import { ThreatComparison } from '@/components/ThreatComparison'
import { ThreatPredictionTimeline } from '@/components/ThreatPredictionTimeline'
import { AssetUploadModal } from '@/components/AssetUploadModal'
import { AssetLibrary } from '@/components/AssetLibrary'
import { CollaborationPanel } from '@/components/CollaborationPanel'
import { AdvancedExport } from '@/components/AdvancedExport'
import { SystemHealth } from '@/components/SystemHealth'
import { DashboardCustomization } from '@/components/DashboardCustomization'
import { ChatSuggestions } from '@/components/ChatSuggestions'
import { LandingPage } from '@/components/LandingPage'
import { LoginPage } from '@/components/LoginPage'
import { SignupPage, type SignupData } from '@/components/SignupPage'
import { OnboardingFlow } from '@/components/OnboardingFlow'
import { MouseTrail } from '@/components/MouseTrail'
import { DynamicBackground } from '@/components/DynamicBackground'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import type { Asset } from '@/types/assets'
import type { AuthState, User } from '@/types/auth'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

function App() {
  const [authState, setAuthState] = useKV<AuthState>('auth-state', {
    isAuthenticated: false,
    user: null,
    hasCompletedOnboarding: false
  })
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing')
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    if (authState !== undefined) {
      const timer = setTimeout(() => setAuthReady(true), 100)
      return () => clearTimeout(timer)
    }
  }, [authState])
  
  const [messages, setMessages] = useKV<Message[]>(`intel-messages-${authState?.user?.id || 'guest'}`, [])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [activeTab, setActiveTab] = useState('intelligence')
  const [showHistory, setShowHistory] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [showReportGenerator, setShowReportGenerator] = useState(false)
  const [showThreatComparison, setShowThreatComparison] = useState(false)
  const [searchResults, setSearchResults] = useState<Message[]>([])
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [showGradientConfig, setShowGradientConfig] = useState(false)
  const [showAssetUpload, setShowAssetUpload] = useState(false)
  const [showAssetLibrary, setShowAssetLibrary] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)
  const [showAdvancedExport, setShowAdvancedExport] = useState(false)
  const [showSystemHealth, setShowSystemHealth] = useState(false)
  const [showDashboardCustom, setShowDashboardCustom] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { notifications } = useThreatNotifications()
  const unacknowledgedCount = (notifications || []).filter(n => !n.dismissed && !n.acknowledged).length
  const { bookmarks, addBookmark, isBookmarked } = useBookmarks()

  const {
    isListening,
    isSupported: isVoiceSupported,
    interimTranscript,
    startListening,
    stopListening,
  } = useVoiceInput({
    continuous: true,
    interimResults: true,
    onResult: (transcript) => {
      setInput((prev) => prev + (prev ? ' ' : '') + transcript)
    },
    onError: (error) => {
      toast.error(error)
    },
  })

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey

      if (isMod && e.key === 'n') {
        e.preventDefault()
        handleNewSession()
      } else if (isMod && e.key === 'h') {
        e.preventDefault()
        setShowHistory(true)
      } else if (isMod && e.key === 'k') {
        e.preventDefault()
        setShowShortcuts(true)
      } else if (isMod && e.key === 'e') {
        e.preventDefault()
        exportCurrentSession()
      } else if (isMod && e.key === 'm') {
        e.preventDefault()
        handleVoiceToggle()
      } else if (isMod && e.key === '1') {
        e.preventDefault()
        setActiveTab('intelligence')
      } else if (isMod && e.key === '2') {
        e.preventDefault()
        setActiveTab('globe')
      } else if (isMod && e.key === '3') {
        e.preventDefault()
        setActiveTab('threats')
      } else if (isMod && e.key === '4') {
        e.preventDefault()
        setActiveTab('predictions')
      } else if (e.key === 'Escape') {
        setShowHistory(false)
        setShowShortcuts(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [messages])

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
      const systemPrompt = `You are a military intelligence analyst and defense strategist with expertise in:
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
6. Suggest resource positioning`

      const { text: response, provider } = await queryAI(systemPrompt, textToSend)
      console.log(`[SENTINEL] Intelligence response via ${provider}`)
      
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

  const handleThreatSelect = (threat: any) => {
    const prompt = `Provide detailed intelligence briefing on ${threat.name}: current status, threat assessment, strategic implications, and defensive recommendations.`
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

  const exportCurrentSession = () => {
    if (!messages || messages.length === 0) {
      toast.error('No messages to export')
      return
    }

    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sentinel-intel-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Session exported successfully')
  }

  const loadSession = async (sessionId: string) => {
    const sessionKey = `session-data-${sessionId}`
    const sessionData = await window.spark.kv.get(sessionKey)
    
    if (sessionData) {
      setMessages(sessionData as Message[])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVoiceToggle = () => {
    if (!isVoiceSupported) {
      toast.error('Voice input not supported in this browser. Try Chrome or Edge.')
      return
    }

    if (isListening) {
      stopListening()
      toast.info('Voice input stopped')
    } else {
      startListening()
      toast.success('Listening... Speak your intelligence query')
    }
  }

  const handleSearch = (query: string, filters: SearchFilters) => {
    if (!query && filters.severity === 'all' && filters.type === 'all' && filters.dateRange === 'all') {
      setIsSearchActive(false)
      setSearchResults([])
      return
    }

    const filtered = (messages || []).filter(message => {
      const matchesQuery = !query || message.content.toLowerCase().includes(query.toLowerCase())
      const matchesType = filters.type === 'all' || 
                         (filters.type === 'intelligence' && message.role === 'assistant') ||
                         (filters.type === 'threat' && message.content.toLowerCase().includes('threat'))
      
      return matchesQuery && matchesType
    })

    setSearchResults(filtered)
    setIsSearchActive(true)
    toast.success(`Found ${filtered.length} matching results`)
  }

  const handleAnalyzeAsset = async (asset: Asset) => {
    setActiveTab('intelligence')
    
    const prompt = `Analyze this ${asset.type} intelligence asset: ${asset.name}. 
    
Perform comprehensive visual analysis including:
- Object detection and identification
- Threat assessment
- Pattern recognition
- Strategic implications
- Tactical recommendations

File details:
- Type: ${asset.type}
- Size: ${(asset.size / 1024 / 1024).toFixed(2)} MB
- Uploaded: ${new Date(asset.uploadedAt).toLocaleString()}

Provide detailed intelligence briefing based on visual analysis.`

    await handleSendMessage(prompt)
  }

  const handleLogin = (email: string, password: string) => {
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      fullName: 'Military Analyst',
      role: 'analyst',
      clearanceLevel: 'secret',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
    
    setAuthState((currentState) => ({
      ...currentState,
      isAuthenticated: true,
      user,
      hasCompletedOnboarding: false
    }))
    
    toast.success(`Welcome back, ${user.fullName}`)
  }

  const handleSignup = (userData: SignupData) => {
    const user: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      fullName: userData.fullName,
      organization: userData.organization,
      role: userData.role,
      clearanceLevel: userData.clearanceLevel,
      createdAt: new Date().toISOString()
    }
    
    setAuthState((currentState) => ({
      ...currentState,
      isAuthenticated: true,
      user,
      hasCompletedOnboarding: false
    }))
    
    toast.success('Access request approved. Welcome to SENTINEL.')
  }

  const handleOnboardingComplete = () => {
    setAuthState((currentState) => ({
      ...currentState,
      isAuthenticated: true,
      user: currentState?.user ?? null,
      hasCompletedOnboarding: true
    }))
    
    toast.success('Onboarding complete. System ready.')
  }

  const handleLogout = () => {
    setAuthState(() => ({
      isAuthenticated: false,
      user: null,
      hasCompletedOnboarding: false
    }))
    setAuthView('landing')
    toast.info('Logged out successfully')
  }

  if (!authReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <DynamicBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 relative z-10"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Shield size={32} weight="fill" className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider uppercase">SENTINEL</h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
            Initializing Secure Connection...
          </p>
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mt-2">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
        <MouseTrail />
      </div>
    )
  }

  if (!authState?.isAuthenticated) {
    if (authView === 'landing') {
      return (
        <>
          <DynamicBackground />
          <LandingPage
            onGetStarted={() => setAuthView('signup')}
            onLogin={() => setAuthView('login')}
          />
          <MouseTrail />
        </>
      )
    }
    
    if (authView === 'login') {
      return (
        <>
          <DynamicBackground />
          <LoginPage
            onLogin={handleLogin}
            onBack={() => setAuthView('landing')}
            onSignupClick={() => setAuthView('signup')}
          />
          <MouseTrail />
        </>
      )
    }
    
    if (authView === 'signup') {
      return (
        <>
          <DynamicBackground />
          <SignupPage
            onSignup={handleSignup}
            onBack={() => setAuthView('landing')}
            onLoginClick={() => setAuthView('login')}
          />
          <MouseTrail />
        </>
      )
    }
  }

  if (authState && authState.isAuthenticated && !authState.hasCompletedOnboarding) {
    return (
      <>
        <DynamicBackground />
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          userName={authState.user?.fullName || 'User'}
          userRole={authState.user?.role.replace('-', ' ') || 'Analyst'}
        />
        <MouseTrail />
      </>
    )
  }

  const mockThreats = [
    {
      id: 't-001',
      name: 'Hypersonic Projectile',
      type: 'missile',
      severity: 'critical' as const,
      status: 'tracking',
      distance: 450,
      speed: 8500,
      altitude: 85000,
      detected: '00:34 ago',
      description: 'Hypersonic missile detected approaching from NNE. Speed Mach 7+, altitude 85k ft. Threat assessment: CRITICAL.'
    },
    {
      id: 't-002',
      name: 'SU-35 Fighter',
      type: 'aircraft',
      severity: 'high' as const,
      status: 'engaged',
      distance: 120,
      speed: 1200,
      altitude: 35000,
      detected: '02:15 ago',
      description: 'Enemy fighter aircraft engaged. Multi-role combat aircraft with air superiority capabilities.'
    },
    {
      id: 't-003',
      name: 'UAV Swarm (x12)',
      type: 'drone',
      severity: 'high' as const,
      status: 'tracking',
      distance: 85,
      speed: 350,
      altitude: 15000,
      detected: '01:42 ago',
      description: 'Drone swarm detected. 12 unmanned aerial vehicles coordinating approach pattern.'
    }
  ]

  const messageList = isSearchActive ? searchResults : (messages || [])

  return (
    <div className="flex flex-col h-screen bg-background relative">
      <DynamicBackground />
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
          
          <div className="flex items-center gap-2 flex-wrap">
            <div className="hidden md:flex items-center gap-2 mr-2 px-3 py-1.5 bg-secondary/50 rounded-md border border-border">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">
                {authState?.user?.fullName || 'User'}
              </span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {authState?.user?.clearanceLevel?.toUpperCase()}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCollaboration(true)}
              className="gap-2 text-xs font-mono uppercase"
              title="Team Collaboration"
            >
              <Users size={16} weight="fill" />
              <span className="hidden xl:inline">Team</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSystemHealth(true)}
              className="gap-2 text-xs font-mono uppercase"
              title="System Performance"
            >
              <Gauge size={16} weight="fill" />
              <span className="hidden xl:inline">Health</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDashboardCustom(true)}
              className="gap-2 text-xs font-mono uppercase"
              title="Customize Dashboard"
            >
              <Layout size={16} weight="fill" />
              <span className="hidden xl:inline">Layout</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAssetUpload(true)}
              className="gap-2 text-xs font-mono uppercase"
              title="Upload Intelligence Assets"
            >
              <UploadSimple size={16} weight="bold" />
              <span className="hidden lg:inline">Upload</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAssetLibrary(true)}
              className="gap-2 text-xs font-mono uppercase"
              title="Asset Library"
            >
              <FolderOpen size={16} weight="fill" />
              <span className="hidden lg:inline">Library</span>
            </Button>
            {messageList.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSearch(true)}
                  className="gap-2 text-xs font-mono uppercase"
                  title="Search Intelligence"
                >
                  <MagnifyingGlass size={16} />
                  <span className="hidden lg:inline">Search</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBookmarks(true)}
                  className="gap-2 text-xs font-mono uppercase relative"
                  title="Bookmarked Intelligence"
                >
                  <BookmarkSimple size={16} weight={bookmarks.length > 0 ? 'fill' : 'regular'} />
                  {bookmarks.length > 0 && (
                    <Badge variant="secondary" className="absolute -top-2 -right-2 h-4 w-4 p-0 text-[10px] flex items-center justify-center">
                      {bookmarks.length}
                    </Badge>
                  )}
                  <span className="hidden lg:inline">Bookmarks</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReportGenerator(true)}
                  className="gap-2 text-xs font-mono uppercase"
                  title="Generate Intelligence Report"
                >
                  <FileText size={16} />
                  <span className="hidden lg:inline">Report</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowThreatComparison(true)}
                  className="gap-2 text-xs font-mono uppercase"
                  title="Compare Threats"
                >
                  <ArrowsLeftRight size={16} />
                  <span className="hidden lg:inline">Compare</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(true)}
                  className="gap-2 text-xs font-mono uppercase"
                  title="Session History (Ctrl/Cmd+H)"
                >
                  <Clock size={16} />
                  <span className="hidden xl:inline">History</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedExport(true)}
                  className="gap-2 text-xs font-mono uppercase"
                  title="Advanced Export Options"
                >
                  <FileArrowDown size={16} weight="fill" />
                  <span className="hidden xl:inline">Export</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewSession}
                  className="gap-2 text-xs font-mono uppercase"
                >
                  <Plus size={16} weight="bold" />
                  <span className="hidden xl:inline">New Session</span>
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotifications(true)}
              className="gap-2 text-xs font-mono uppercase relative"
              title="Threat Alerts"
            >
              <Bell size={16} weight={unacknowledgedCount > 0 ? 'fill' : 'regular'} />
              {unacknowledgedCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold pulse-glow"
                >
                  {unacknowledgedCount > 9 ? '9+' : unacknowledgedCount}
                </Badge>
              )}
              <span className="hidden xl:inline">Alerts</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShortcuts(true)}
              className="gap-2 text-xs font-mono uppercase"
              title="Keyboard Shortcuts (Ctrl/Cmd+K)"
            >
              <KeyboardIcon size={16} />
              <span className="hidden xl:inline">Shortcuts</span>
            </Button>
            <ThemeSwitcher />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGradientConfig(true)}
              className="gap-2 text-xs font-mono uppercase"
              title="DigitalOcean Gradient™ AI Settings"
            >
              <GearSix size={16} />
              <span className="hidden xl:inline">Gradient</span>
            </Button>
            <GradientStatusBadge />
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-xs font-mono uppercase"
              title="Logout"
            >
              <SignOut size={16} weight="bold" />
              <span className="hidden xl:inline">Logout</span>
            </Button>
          </div>
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
                  value="globe" 
                  className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs uppercase px-3 md:px-4 py-2"
                >
                  <Globe size={16} weight="fill" />
                  <span className="hidden sm:inline">3D Globe</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs uppercase px-3 md:px-4 py-2"
                >
                  <ChartLine size={16} weight="fill" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="threats" 
                  className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs uppercase px-3 md:px-4 py-2"
                >
                  <Target size={16} weight="fill" />
                  <span className="hidden sm:inline">Threats</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="predictions" 
                  className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs uppercase px-3 md:px-4 py-2"
                >
                  <TrendUp size={16} weight="fill" />
                  <span className="hidden sm:inline">Predictions</span>
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

                      {!isLoading && messageList.length > 0 && messageList[messageList.length - 1]?.role === 'assistant' && (
                        <ChatSuggestions
                          lastMessage={messageList[messageList.length - 1].content}
                          onSuggestionClick={(suggestion) => {
                            setInput(suggestion)
                            textareaRef.current?.focus()
                          }}
                          isLoading={isLoading}
                        />
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="globe" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="container mx-auto px-4 md:px-6 py-6">
                  <Globe3D onThreatSelect={handleThreatSelect} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="analytics" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="container mx-auto px-4 md:px-6 py-6">
                  <AnalyticsDashboard />
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

            <TabsContent value="predictions" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="container mx-auto px-4 md:px-6 py-6">
                  <ThreatPredictionTimeline 
                    threatContext={messages && messages.length > 0 ? messages[messages.length - 1].content : undefined}
                  />
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
                  value={input + (interimTranscript ? ' ' + interimTranscript : '')}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter intelligence query or threat analysis request..."
                  className="min-h-[56px] max-h-[200px] resize-none pr-4 text-sm md:text-[15px] font-mono bg-secondary/50"
                  disabled={isLoading}
                />
                {interimTranscript && (
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground font-mono italic">
                    Listening...
                  </div>
                )}
              </div>
              
              <Button
                onClick={handleVoiceToggle}
                disabled={isLoading}
                size="lg"
                variant={isListening ? 'destructive' : 'outline'}
                className={`h-[56px] px-4 ${isListening ? 'pulse-glow' : ''}`}
                title={isListening ? 'Stop voice input' : 'Start voice input'}
              >
                {isListening ? (
                  <Stop size={20} weight="fill" />
                ) : (
                  <Microphone size={20} weight="fill" />
                )}
              </Button>

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
              {isVoiceSupported ? 'VOICE INPUT ENABLED // ' : ''}ENTER TO SEND // SHIFT+ENTER NEW LINE // CLASSIFIED SYSTEM
            </p>
          </div>
        </div>
      </div>

      <StatusNotifications />

      {showHistory && (
        <SessionHistory
          currentMessages={messageList}
          onLoadSession={loadSession}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showShortcuts && (
        <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />
      )}

      {showNotifications && (
        <ThreatNotificationPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {showSearch && (
        <SearchFilter
          onSearch={handleSearch}
          onClose={() => setShowSearch(false)}
        />
      )}

      {showBookmarks && (
        <BookmarksPanel
          isOpen={showBookmarks}
          onClose={() => setShowBookmarks(false)}
          onSelectBookmark={(item) => {
            setShowBookmarks(false)
            setActiveTab('intelligence')
            toast.info(`Selected: ${item.title}`)
          }}
        />
      )}

      {showReportGenerator && (
        <ReportGenerator
          isOpen={showReportGenerator}
          onClose={() => setShowReportGenerator(false)}
          messages={messageList}
        />
      )}

      {showThreatComparison && (
        <ThreatComparison
          isOpen={showThreatComparison}
          onClose={() => setShowThreatComparison(false)}
          threats={mockThreats}
        />
      )}

      {showGradientConfig && (
        <GradientConfigPanel onClose={() => setShowGradientConfig(false)} />
      )}

      {showAssetUpload && (
        <AssetUploadModal
          isOpen={showAssetUpload}
          onClose={() => setShowAssetUpload(false)}
          onUploadComplete={() => {
            toast.success('Assets uploaded successfully')
          }}
        />
      )}

      {showAssetLibrary && (
        <AssetLibrary
          isOpen={showAssetLibrary}
          onClose={() => setShowAssetLibrary(false)}
          onAnalyzeAsset={handleAnalyzeAsset}
        />
      )}

      {showCollaboration && (
        <CollaborationPanel
          isOpen={showCollaboration}
          onClose={() => setShowCollaboration(false)}
        />
      )}

      {showAdvancedExport && (
        <AdvancedExport
          isOpen={showAdvancedExport}
          onClose={() => setShowAdvancedExport(false)}
          messages={messageList}
        />
      )}

      {showSystemHealth && (
        <SystemHealth
          isOpen={showSystemHealth}
          onClose={() => setShowSystemHealth(false)}
        />
      )}

      {showDashboardCustom && (
        <DashboardCustomization
          isOpen={showDashboardCustom}
          onClose={() => setShowDashboardCustom(false)}
        />
      )}

      <MouseTrail />
    </div>
  )
}

export default App
