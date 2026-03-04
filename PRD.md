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
- **Functionality**: Interactive Three.js-powered 3D globe displaying active war zones, conflicts, and military operations with rotating Earth view, live threat markers, and geographic positioning for GCC-Iran tensions, Israel conflicts, Cuba situations, Ukraine, and other hotspots
- **Purpose**: Provides immersive, intuitive spatial intelligence on global military situations for strategic planning and threat assessment with realistic geographic context
- **Trigger**: Automatic rendering on globe tab access with continuous rotation and real-time marker updates
- **Progression**: Globe loads and auto-rotates → User hovers over threat markers → Tooltip displays threat details → User clicks marker → Detailed intelligence fills prompt → AI analyzes current situation → Recommendations provided
- **Success criteria**: Globe renders within 2 seconds; smooth 60fps rotation; all threat markers visible and interactive; hover tooltips appear within 100ms; click interactions populate intelligence queries immediately

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
- **Functionality**: Technical AI assistant specialized in military intelligence, threat analysis, geopolitical assessment, and defense strategy with access to conflict data
- **Purpose**: Enables natural language queries about complex defense scenarios and provides expert-level analysis
- **Trigger**: User submits intelligence query
- **Progression**: User asks question → AI processes with military context → Streams detailed technical response → Provides source references → Offers follow-up analysis options
- **Success criteria**: Responses include technical specifications, threat assessments, and strategic recommendations; maintains operational security protocols

### Threat Alert Dashboard
- **Functionality**: Centralized view of active threats, alert levels, and priority intelligence items with color-coded severity indicators
- **Purpose**: Quick-glance situational awareness of immediate threats requiring attention
- **Trigger**: Automatic aggregation of threat data with manual refresh option
- **Progression**: Dashboard loads → Threats sorted by severity → User clicks alert → Detailed analysis opens → Response options presented
- **Success criteria**: All critical threats visible without scrolling; alerts update in real-time; severity categorization accurate

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
  - Custom Three.js 3D globe component with orbital controls, threat markers, and real-time updates
  - Custom map component with D3.js for conflict visualization
  - Threat card component with severity indicators and action buttons
  - Intelligence message bubble optimized for technical data
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
  - `Warning` for alerts
  - `Pulse` for live monitoring
  - `Target` for tracking systems
  - `Globe` for global view
  - `Lightning` for rapid response
  - `Eye` for surveillance
  - `Broadcast` for communications

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
