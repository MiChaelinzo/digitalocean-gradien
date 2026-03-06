# Planning Guide

A classified-level military intelligence and defense monitoring platform that provides real-time threat detection, conflict tracking, and strategic recommendations powered by DigitalOcean's Gradient AI.

**Experience Qualities**:
1. **Authoritative** - The interface conveys high-stakes precision and military-grade reliability with technical depth and data-driven insights
2. **Vigilant** - Real-time monitoring of global threats creates a constant state of situational awareness and rapid response capability
3. **Strategic** - AI-powered analysis provides actionable intelligence and defensive recommendations for complex geopolitical scenarios

**Complexity Level**: Complex Application (advanced functionality with multiple views)
  - This application integrates real-time conflict mapping, multi-threat detection systems, AI-powered strategic analysis, and persistent intelligence tracking requiring sophisticated state management and multiple coordinated views.

## Essential Features

### Real-Time 3D Globe Visualization
- **Functionality**: Interactive Mapbox-powered 3D globe displaying active war zones, conflicts, and military operations with rotating Earth view, live threat markers, geographic positioning for GCC-Iran tensions, Israel conflicts, Cuba situations, Ukraine, and other hotspots. Includes real-time weather overlays (precipitation, wind patterns, temperature, cloud cover) for operational weather intelligence
- **Purpose**: Provides immersive, intuitive spatial intelligence on global military situations for strategic planning and threat assessment with realistic geographic context. Weather overlays enable operational planning based on real-time environmental conditions
- **Trigger**: Automatic rendering on globe tab access with continuous rotation and real-time marker updates; weather overlays toggle via dropdown menu
- **Progression**: Globe loads with selectable map styles (Dark/Satellite/Terrain) → User enables weather layers → Precipitation/Wind/Temperature/Cloud data overlays on map → User hovers over threat markers → Tooltip displays threat details → User clicks marker → Detailed intelligence fills prompt → AI analyzes current situation with weather context → Recommendations provided
- **Success criteria**: Globe renders within 2 seconds; smooth 60fps rotation; all threat markers visible and interactive; hover tooltips appear within 100ms; weather layers toggle instantly; click interactions populate intelligence queries immediately; map style switching seamless

### Real-Time Conflict Map Viewer
- **Functionality**: Interactive 2D global map displaying active war zones, conflicts, and military operations with live updates on GCC-Iran tensions, Israel conflicts, Cuba situations, Ukraine, and other hotspots
- **Purpose**: Provides immediate visual intelligence on global military situations for strategic planning and threat assessment in a traditional map format
- **Trigger**: Automatic on application load with continuous updates
- **Progression**: Map loads with conflict zones marked → User clicks region → Detailed conflict info displays → AI analyzes current situation → Recommendations provided
- **Success criteria**: Map updates within 2 seconds; all major conflicts visible; click interactions provide detailed intelligence within 1 second

### Aerospace Threat Detection System
- **Functionality**: Monitors and identifies aerial threats including hypersonic missiles, drones, fighter jets, UAPs (Unidentified Aerial Phenomena), and ballistic trajectories with real-time tracking
- **Purpose**: Early warning system for airspace violations and incoming threats to enable rapid defensive response
- **Trigger**: Continuous monitoring with alert generation on threat detection
- **Progression**: Threat detected → Classification analysis → Trajectory prediction → Threat level assessment → Defensive recommendations generated
- **Success criteria**: Threat identification within 1 second; trajectory predictions accurate to 95%; clear threat level indicators

### Strategic Defense Recommendations
- **Functionality**: AI-powered analysis of attack scenarios providing preventive measures and response protocols for specific conflicts (Iran vs Israel/USA, GCC tensions, regional conflicts)
- **Purpose**: Transforms raw intelligence into actionable defensive strategies and countermeasure recommendations
- **Trigger**: User queries specific conflict scenarios or system detects escalating threats
- **Progression**: Scenario input → AI analyzes threat vectors → Generates multi-layered defense strategy → Provides resource allocation recommendations → Updates based on changing conditions
- **Success criteria**: Recommendations delivered within 3 seconds; strategies reference military doctrine and current capabilities

### Intelligence Chat Interface
- **Functionality**: Technical AI assistant specialized in military intelligence, threat analysis, geopolitical assessment, and defense strategy with access to conflict data. Includes automatic threat severity detection that analyzes message content and displays visual severity indicators (Critical, High, Medium, Low, Info) with corresponding icons and color-coding. Fourth tab includes comprehensive Analytics Dashboard with real-time charts showing threat trends over time, regional distribution, defense system effectiveness, and response time analysis using recharts visualization library. **Voice-to-Text Input**: Hands-free intelligence briefing capability using Web Speech API for continuous voice recognition, allowing operators to dictate queries while maintaining situational awareness of other systems. Voice input displays real-time interim transcription and includes visual feedback with pulsing microphone indicator during active listening. **AI-Powered Chat Suggestions**: After each AI response, system automatically generates 4 contextual follow-up suggestions across categories (Tactical, Strategic, Related, Follow-up) using AI analysis of conversation context. Suggestions are clickable, categorized with color-coded badges, and prioritized (high/medium/low) to guide deeper intelligence analysis
- **Purpose**: Enables natural language queries about complex defense scenarios and provides expert-level analysis with immediate visual threat assessment. Analytics tab provides data-driven insights for strategic planning and operational optimization. Voice input enables hands-free operation during multi-tasking scenarios or when manual input is impractical (e.g., during active monitoring, mobile operations, or accessibility needs). Chat suggestions reduce cognitive load by recommending relevant next steps, accelerating analysis workflow, and uncovering related intelligence angles analysts might not immediately consider
- **Trigger**: User submits intelligence query via keyboard or voice input. Suggestions generate automatically after each AI response completes
- **Progression**: User types or speaks question → Voice transcription converts speech to text in real-time (if voice enabled) → AI processes with military context → Streams detailed technical response → Threat analysis runs on content → Severity indicator displays with badge → Provides source references → AI generates 4 contextual suggestions → Suggestion card appears below message with categorized buttons → User clicks suggestion → Input field populates with selected text → Focus shifts to input → User can edit or send immediately. Analytics: User switches to Analytics tab → Visual dashboard loads with 4 key metrics → User explores threat trends, regional distribution, defense effectiveness, and response time charts → Data updates in real-time. Voice Input: User clicks microphone button → Browser requests permission → Voice recognition activates with visual feedback → User speaks query → Interim text appears in input field → Final transcription added to input → User clicks stop or microphone auto-stops → Query ready to send
- **Success criteria**: Responses include technical specifications, threat assessments, and strategic recommendations; maintains operational security protocols; severity indicators appear within 100ms of message completion; keyword detection accuracy >90%; Analytics dashboard renders within 2 seconds with smooth chart interactions; Voice recognition accuracy >90%; transcription latency <200ms; clear visual feedback for listening state; graceful fallback message for unsupported browsers; Suggestions generate within 3 seconds after AI response; 4 suggestions provided across different categories; suggestions contextually relevant to conversation (>85% relevance); clicking suggestion populates input field instantly; visual animations smooth (fade-in 300ms); fallback to default suggestions if AI generation fails

### Threat Alert Dashboard
- **Functionality**: Centralized view of active threats, alert levels, and priority intelligence items with color-coded severity indicators
- **Purpose**: Quick-glance situational awareness of immediate threats requiring attention
- **Trigger**: Automatic aggregation of threat data with manual refresh option
- **Progression**: Dashboard loads → Threats sorted by severity → User clicks alert → Detailed analysis opens → Response options presented
- **Success criteria**: All critical threats visible without scrolling; alerts update in real-time; severity categorization accurate

### AI-Powered Threat Prediction Timeline
- **Functionality**: 72-hour forward projection timeline displaying AI-generated threat scenarios with probability assessments, severity indicators, and strategic recommendations. Users can select analysis depth (Basic/Detailed/Comprehensive) and regenerate predictions. Each scenario includes timeframe, threat type, affected regions, key contributing factors, and recommended countermeasures
- **Purpose**: Proactive threat assessment enabling strategic planning and resource pre-positioning based on predicted scenarios rather than reactive responses
- **Trigger**: Automatic generation when Predictions tab is accessed; manual regeneration available; contextually aware of recent intelligence conversations
- **Progression**: User switches to Predictions tab → AI analyzes current geopolitical context → Generates 5 scenarios across 72-hour timeline → Visual timeline displays threat markers → User clicks scenario card → Expands to show full details including key factors, recommendations, affected regions, and AI confidence score → User adjusts analysis depth → Regenerates predictions with different detail level
- **Success criteria**: Predictions generate within 5 seconds; scenarios are realistic and contextually relevant; probability scores align with current tensions; recommendations are actionable; timeline visualization clearly shows temporal distribution; expandable cards reveal comprehensive threat intelligence

### Intelligence Asset Upload & Analysis System
- **Functionality**: Multi-format file upload system supporting images (satellite imagery, reconnaissance photos, thermal scans), videos (surveillance footage, drone feeds, helmet cam recordings), documents (intelligence reports, mission briefs), and folders (batch operations). Features drag-and-drop interface, file preview/playback, metadata extraction, AI-powered visual analysis for uploaded imagery/video, and persistent asset library with search/filter capabilities. Supports batch uploads, file size validation (max 50MB per file), format restrictions for security, and automatic thumbnail generation
- **Purpose**: Enables intelligence officers to upload reconnaissance assets, satellite imagery, surveillance footage, and mission documentation for AI-assisted analysis and persistent storage in the intelligence database
- **Trigger**: User clicks upload button from header, drags files into upload zone, or attaches files to intelligence queries
- **Progression**: User clicks Upload Asset button → Modal opens with drag-and-drop zone → User drags files or clicks to browse → Files validate (type/size) → Upload progress displays → Files process with thumbnail generation → Assets saved to library → User views asset in gallery → Clicks asset for preview → Requests AI analysis → System analyzes visual content (object detection, threat assessment, pattern recognition) → Intelligence report generated → Results display with confidence scores and recommendations
- **Success criteria**: Upload accepts images (jpg, png, webp), videos (mp4, webm), documents (pdf, txt, json); files under 50MB process successfully; drag-and-drop works smoothly; thumbnails generate within 2 seconds; gallery displays all uploaded assets; preview modal shows full resolution images and plays videos inline; AI analysis completes within 5 seconds for images, 10 seconds for videos; search/filter returns relevant results within 500ms; batch operations handle up to 20 files simultaneously

### Team Collaboration System
- **Functionality**: Multi-user coordination interface with team member management, invitation system, role assignment, clearance level tracking (Top Secret/Secret/Confidential), online status indicators, and real-time activity tracking. Displays team member avatars, last active timestamps, and collaboration statistics
- **Purpose**: Enables intelligence teams to coordinate operations, track analyst availability, manage clearance levels, and maintain situational awareness of team member participation
- **Trigger**: User clicks Team button in header toolbar
- **Progression**: Team panel opens → Displays list of active team members with status → User enters email address → Clicks invite button → Invitation sent → New member added with default clearance level → Team statistics update → User views online/offline status of all analysts → Collaboration metrics displayed (online count, top secret clearances, total team size)
- **Success criteria**: Email validation prevents invalid invitations; team members display with correct status indicators; clearance level badges show appropriate colors; online status updates every 30 seconds; member removal works instantly; team statistics calculate correctly; panel remains performant with 20+ members

### Advanced Export System
- **Functionality**: Comprehensive data export with multiple format support (JSON, CSV, Markdown, TXT/PDF), configurable export options (timestamps, metadata inclusion), visual progress indicator, and automated file download. Exports include session metadata, message counts, timestamps, and platform information formatted appropriately for each file type
- **Purpose**: Enables intelligence officers to create formatted reports, backup session data, share analysis with external systems, and generate documentation in stakeholder-preferred formats for briefings and archives
- **Trigger**: User clicks Export button in header toolbar when messages exist
- **Progression**: Export modal opens → User selects format (JSON/CSV/Markdown/PDF) → Configures options (timestamps, metadata) → Clicks export button → Progress bar animates (0%→25%→50%→75%→100%) → File generates with appropriate formatting → Browser downloads file automatically → Completion confirmation displays → Modal shows export success
- **Success criteria**: All four formats generate correctly; JSON preserves data structure; CSV opens in spreadsheets; Markdown renders properly; timestamps include/exclude based on user choice; metadata adds session context; progress bar updates smoothly; files download automatically; export completes within 2 seconds for 100 messages; no data loss during export

### System Performance Monitor
- **Functionality**: Real-time performance monitoring dashboard with 6 key metrics: Response Time (AI query latency), API Latency (backend communication speed), Cache Hit Rate (data retrieval efficiency), System Uptime (availability percentage), Error Rate (failure frequency), and Queries Per Minute (throughput). Each metric displays current value, visual progress bar, status badge (Excellent/Good/Warning/Critical), and last update timestamp. Overall system health calculated from combined metrics
- **Purpose**: Provides platform administrators and analysts with visibility into system performance, identifies bottlenecks, monitors service degradation, and enables proactive issue resolution before mission-critical operations are impacted
- **Trigger**: User clicks Health button in header toolbar
- **Progression**: Performance panel opens → Metrics load instantly → Dashboard displays 6 metric cards in grid → Each card shows icon, current value, progress bar, status badge → Values update every 5 seconds → Color coding indicates health (green=excellent, blue=good, yellow=warning, red=critical) → Overall system status calculated → Summary section shows aggregated statistics → Real-time timestamp displays last update
- **Success criteria**: All 6 metrics display correctly; values update every 5 seconds; status badges reflect accurate health levels; color coding matches thresholds; progress bars animate smoothly; dashboard loads within 2 seconds; no performance degradation with sustained monitoring; critical status triggers at appropriate thresholds (response time >500ms, uptime <99%, error rate >1%)

### Dashboard Customization Interface
- **Functionality**: Widget management system allowing users to enable/disable interface modules across three categories (Real-Time Monitoring, Analytics & Insights, Intelligence Tools). 8 configurable widgets: 3D Threat Globe, Analytics Dashboard, Active Threat Monitor, AI Predictions, Threat Alerts, Session History, Team Collaboration, Regional Focus. Each widget shows name, description, icon, enabled status, and visual state indicator. Bulk actions include Enable All and Reset Defaults
- **Purpose**: Enables analysts to personalize their workspace by activating only relevant tools, reducing interface clutter, improving focus on mission priorities, and adapting the platform to specific operational requirements or analysis workflows
- **Trigger**: User clicks Layout button in header toolbar  
- **Progression**: Customization panel opens → Shows 8 widgets organized by category → User toggles individual widget switches → Visual feedback shows enabled state (blue highlight, primary icon color) → Enable All activates all widgets → Reset Defaults returns to standard configuration → Changes apply immediately without page reload → Active widget count updates in header → Configuration persists across sessions
- **Success criteria**: All 8 widgets display with correct categories; toggle switches respond instantly; visual state changes immediately; Enable All activates all simultaneously; Reset Defaults restores factory settings; configuration persists after browser refresh; no broken widgets after enabling/disabling; category organization remains intuitive; changes reflected in main interface immediately

### Live OSINT Feed Integration
- **Functionality**: Real-time aggregation and display of Open-Source Intelligence (OSINT) feeds from multiple sources including ACLED (Armed Conflict Location & Event Data), GDELT (Global Database of Events, Language, and Tone), and NASA FIRMS (Fire Information for Resource Management System). Displays conflicts, threats, military operations, satellite thermal anomalies, and social media intelligence with filtering by type (threat, conflict, military, satellite, social, news), severity levels, verification status, and automatic refresh capabilities
- **Purpose**: Provides intelligence analysts with live external data sources to supplement internal intelligence gathering, enabling correlation of multiple intelligence streams, verification of reports through cross-referencing, and early warning of developing situations through public data aggregation
- **Trigger**: User clicks "OSINT Feeds" button in header toolbar
- **Progression**: Panel opens → System aggregates feeds from all sources → Displays feed cards with title, source, type, severity, location, confidence score, verification status → User filters by type or severity → Clicks feed item → Intelligence context populated in chat → AI analyzes feed with strategic recommendations → Auto-refresh updates every 5 minutes → User can manually refresh or disable auto-refresh
- **Success criteria**: Feeds load within 3 seconds; display 10-20 feeds from multiple sources; filtering works instantly; feed selection populates intelligence prompt correctly; auto-refresh operates smoothly without UI interruption; source attribution clear; verification badges displayed; confidence scores accurate; critical feeds highlighted prominently; mobile-responsive with card layout

### Satellite Imagery Database
- **Functionality**: Access to multi-source satellite imagery including Sentinel-2 (10m resolution, ESA), Landsat-8 (30m resolution, USGS/NASA), and commercial providers. Search by coordinates (latitude/longitude), view imagery metadata (capture date, resolution, cloud cover percentage, spectral bands), preview thumbnails, and request AI-powered visual analysis for threat detection, facility identification, and pattern recognition
- **Purpose**: Enables visual intelligence gathering through satellite reconnaissance, supports geospatial analysis of conflict zones, verifies ground reports with overhead imagery, monitors facility changes over time, and provides evidence-based intelligence through visual confirmation
- **Trigger**: User clicks "Satellite" button in header toolbar
- **Progression**: Viewer opens → User enters target coordinates or selects from recent searches → System queries Sentinel-2 and Landsat-8 databases → Displays available imagery with metadata → User selects image → Preview and full details display → User requests AI analysis → System performs object detection, facility identification → Analysis results with confidence scores → User can download imagery or export analysis report
- **Success criteria**: Coordinate search returns results within 2 seconds; imagery from multiple satellites displayed; metadata accurate (dates, resolution, cloud cover); preview images load fast; AI analysis completes within 5-10 seconds; analysis identifies key features with >80% confidence; download functionality works; mobile-friendly coordinate input; recent searches saved; clear source attribution (Sentinel vs Landsat vs commercial)

## Edge Case Handling

- **Connection Loss**: Display offline mode with last-known intelligence cached; indicate data staleness with clear timestamps
- **Conflicting Intelligence**: Present multiple source analysis with confidence scores; allow user to request AI reconciliation
- **Classified Information Requests**: Gracefully handle queries beyond clearance level with appropriate security notices
- **Overwhelming Threat Volume**: Intelligent filtering and prioritization algorithms surface most critical threats first
- **Map Rendering Failures**: Fallback to list view of conflicts with geographic coordinates
- **API Rate Limits**: Queue non-critical updates; prioritize threat alerts and time-sensitive intelligence

## Design Direction

The design should evoke a classified military command center - dark, focused, and data-dense with a strong sense of technical authority. It must feel like professional defense software used in situation rooms, with high information density balanced by clear visual hierarchy. The interface should instill confidence through precision, using technical typography and military-inspired color coding that's instantly recognizable under high-stress conditions.

## Color Selection

A tactical palette inspired by military command centers and defense systems, using high-contrast elements for critical information visibility in 24/7 operations environments.

- **Primary Color**: Tactical Blue (oklch(0.35 0.12 240)) - Command center displays and primary actions; conveys authority and technical precision
- **Secondary Colors**: 
  - Deep Charcoal (oklch(0.15 0.01 240)) for backgrounds and surfaces
  - Tactical Gray (oklch(0.25 0.01 240)) for elevated surfaces
  - Cool Gray (oklch(0.45 0.01 240)) for secondary text
- **Accent Color**: Alert Red (oklch(0.55 0.22 25)) - Critical alerts and threat indicators; immediate attention grabber
- **Status Colors**:
  - Threat Active Red (oklch(0.50 0.20 25)) for critical/imminent threats
  - Warning Amber (oklch(0.65 0.15 45)) for elevated/potential threats
  - All Clear Green (oklch(0.55 0.15 145)) for secure status
  - Intel Blue (oklch(0.60 0.15 240)) for intelligence items
- **Foreground/Background Pairings**:
  - Background (Deep Charcoal oklch(0.15 0.01 240)): Light Gray text (oklch(0.90 0.005 240)) - Ratio 11.2:1 ✓
  - Primary (Tactical Blue oklch(0.35 0.12 240)): White text (oklch(1 0 0)) - Ratio 8.5:1 ✓
  - Accent (Alert Red oklch(0.55 0.22 25)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Card (Tactical Gray oklch(0.25 0.01 240)): Light Gray text (oklch(0.90 0.005 240)) - Ratio 7.8:1 ✓

## Font Selection

Typography must convey technical precision and military-grade reliability while maintaining excellent readability for extended monitoring sessions in potentially stressful conditions.

- **Primary Font**: JetBrains Mono for data displays and technical readouts - monospace provides precise alignment and military console aesthetic
- **Secondary Font**: Space Grotesk for headings and UI elements - technical but humanist, balancing authority with usability
- **Tertiary Font**: Inter for body text in intelligence reports - exceptional readability for long-form content

**Typographic Hierarchy**:
- H1 (System Title): Space Grotesk Bold/28px/wide letter-spacing (0.05em)/uppercase
- H2 (Section Headers): Space Grotesk Semibold/20px/normal letter-spacing
- H3 (Threat Labels): Space Grotesk Medium/16px/wide letter-spacing (0.02em)/uppercase
- Body (Intelligence Reports): Inter Regular/15px/relaxed line-height (1.6)
- Technical Data: JetBrains Mono Regular/14px/normal line-height (1.5)
- Small Labels: JetBrains Mono Regular/12px/wide letter-spacing (0.03em)/uppercase
- Status Indicators: Space Grotesk Bold/13px/uppercase/wide letter-spacing (0.08em)

## Animations

Animations should be purposeful and minimal, reinforcing the sense of real-time data updates and system responsiveness without compromising the serious, focused atmosphere of a defense system.

- **Threat alerts**: Quick pulse with red glow for critical items (300ms ease-out)
- **Map markers**: Gentle pulsing animation for active conflict zones (2s infinite)
- **Data updates**: Brief flash highlight when values change (150ms)
- **Panel transitions**: Fast slide transitions for switching views (200ms ease-in-out)
- **Loading states**: Technical scanning line animation for data retrieval
- **Incoming intelligence**: Slide-in from top with subtle bounce for new alerts (250ms)

## Component Selection

- **Components**:
  - `Card` for intelligence panels, threat summaries, and data containers with military-style borders
  - `Badge` for threat levels, classification labels, and status indicators
  - `Button` with distinct primary/secondary/destructive variants for actions
  - `Tabs` for switching between Intelligence, 3D Globe, Threats, and Analysis views
  - `ScrollArea` for intelligence feeds and threat lists
  - `Alert` for critical system notifications and warnings
  - `Table` for structured threat data and conflict timelines
  - `Separator` for dividing functional zones in the interface
  - `Progress` for threat proximity and missile trajectory indicators
  - `Dialog` for detailed threat analysis and scenario planning

- **Customizations**:
  - Custom Mapbox 3D globe component with manual zoom/rotate controls, multiple map styles (Dark/Satellite/Terrain), threat markers, and real-time updates
  - Weather overlay system with toggleable layers for precipitation, wind patterns, temperature, and cloud cover using OpenWeatherMap tile layers
  - Custom map component with D3.js for conflict visualization
  - Threat card component with severity indicators and action buttons
  - Intelligence message bubble optimized for technical data with automatic threat severity detection and visual indicators
  - Threat severity badge system with five levels: Critical (pulsing red with Siren icon), High (amber with ShieldWarning icon), Medium (accent with Warning icon), Low (green with CheckCircle icon), Info (blue with Info icon)
  - Status dashboard with real-time updating metrics
  - Radar-style threat proximity visualization
  - Timeline component for conflict progression tracking

- **States**:
  - Buttons: Default (tactical blue), hover (brighter glow), active (pressed inset), disabled (low opacity gray), alert state (pulsing red)
  - Threat cards: Normal, elevated (orange border), critical (red border + glow), resolved (green checkmark)
  - Map markers: Active conflict (pulsing red), tension zone (amber), stable (green), unknown (gray)
  - Intelligence items: Unread (bold + blue indicator), read (normal), priority (red flag icon)

- **Icon Selection**:
  - `Crosshair` for threat targeting
  - `MapPin` for conflict locations
  - `Airplane` for aircraft threats
  - `Rocket` for missile systems
  - `Shield` for defense systems
  - `Warning` for alerts and medium severity threats
  - `Pulse` for live monitoring
  - `Target` for tracking systems
  - `Globe` for global view
  - `Lightning` for rapid response
  - `Eye` for surveillance
  - `Broadcast` for communications
  - `Siren` for critical threat severity indicators
  - `ShieldWarning` for high priority threat severity
  - `CheckCircle` for low risk severity indicators
  - `Info` for informational severity level
  - `CloudRain` for precipitation weather layer
  - `Wind` for wind pattern weather layer
  - `CloudSnow` for cloud cover weather layer
  - `Lightning` for temperature weather layer
  - `MapTrifold` for terrain/map style switching
  - `Planet` for satellite view

- **Spacing**:
  - Container padding: `p-4` (16px) for dense information display
  - Threat card gaps: `gap-3` (12px) for compact lists
  - Dashboard grid: `gap-4` (16px) between metric cards
  - Panel padding: `p-6` (24px) for main content areas
  - Tight spacing for data tables: `gap-2` (8px)

- **Mobile**:
  - Priority-based layout: Alerts and critical threats always visible
  - Bottom navigation tabs for Intelligence/Globe/Threats/Chat
  - Collapsible threat details with swipe gestures
  - Simplified 3D globe with list fallback option; optimized rendering for mobile GPUs
  - Touch-optimized 48px minimum tap targets for alert acknowledgment
  - Horizontal scroll for wide data tables
  - Sticky threat level indicator at top
  - Reduced font sizes: H1 to 20px, body to 14px, technical data to 12px
