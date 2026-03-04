# Planning Guide

A visual AI-powered design critique and ideation platform that helps designers and developers get instant, intelligent feedback on their UI/UX designs using DigitalOcean's Gradient AI.

**Experience Qualities**:
1. **Insightful** - The AI provides thoughtful, actionable design feedback that feels like consulting with a senior designer
2. **Interactive** - Real-time streaming responses create an engaging conversation with the AI about design decisions
3. **Inspirational** - The tool sparks creativity by offering multiple perspectives and alternative approaches to design challenges

**Complexity Level**: Light Application (multiple features with basic state)
  - This app combines AI interaction, image analysis, and conversational UI with persistent chat history, making it more than a single-purpose tool but not requiring complex multi-view navigation.

## Essential Features

### AI Design Critique
- **Functionality**: Users can paste an image URL or describe their design, and the AI analyzes it providing detailed feedback on aesthetics, usability, accessibility, and best practices
- **Purpose**: Democratizes access to expert design feedback for developers and designers at any skill level
- **Trigger**: User submits a design URL or description via input field
- **Progression**: User enters URL/description → Clicks analyze → AI streams response in real-time → Feedback appears in chat-like interface → User can ask follow-up questions
- **Success criteria**: AI provides specific, actionable feedback within 3 seconds; responses reference design principles and offer concrete suggestions

### Design Ideation Assistant
- **Functionality**: Users describe what they want to build and receive creative suggestions for color palettes, typography, layout approaches, and component choices
- **Purpose**: Helps overcome creative blocks and explores design directions users might not have considered
- **Trigger**: User describes their project goals in natural language
- **Progression**: User describes project → AI generates multiple design direction suggestions → Each suggestion includes specific colors, fonts, and rationale → User can refine by asking follow-up questions
- **Success criteria**: AI suggests 2-3 distinct design directions with concrete specifications; suggestions align with stated project goals

### Persistent Conversation History
- **Functionality**: All conversations with the AI are saved and accessible, allowing users to reference previous critiques and continue discussions
- **Purpose**: Enables iterative design improvement and learning over time
- **Trigger**: Automatic on every interaction
- **Progression**: User interacts with AI → Message saved to history → User can scroll through previous conversations → Conversations persist across sessions
- **Success criteria**: All messages persist correctly; history is easily scannable and searchable

### Code Generation for Design Systems
- **Functionality**: Based on design discussions, AI can generate actual CSS/Tailwind code snippets for implementing the discussed design
- **Purpose**: Bridges the gap between design feedback and implementation
- **Trigger**: User asks for code implementation of discussed design elements
- **Progression**: User discusses design → Asks for code → AI generates Tailwind/CSS snippet → User can copy code → AI explains implementation choices
- **Success criteria**: Generated code is syntactically correct and implements discussed design accurately

## Edge Case Handling

- **Invalid Image URLs**: Display friendly error message and suggest trying a different URL or describing the design instead
- **API Failures**: Show graceful error state with retry option; preserve user's input so they don't lose their work
- **Long Responses**: Stream AI responses in chunks so users see progress; allow scrolling during generation
- **Empty State**: Welcome screen guides new users on what they can do with prompts and examples
- **Rate Limiting**: If API limits are hit, inform user clearly and suggest trying again in a moment

## Design Direction

The design should feel like a premium creative tool - sophisticated yet approachable, with a focus on clarity and visual hierarchy. It should evoke the feeling of working with a knowledgeable design partner in a modern, well-lit studio space. The interface should fade into the background, letting the AI conversation and design content take center stage.

## Color Selection

A refined palette inspired by design tools and creative spaces, with deep teals and warm accents that feel both professional and inviting.

- **Primary Color**: Deep Teal (oklch(0.45 0.08 210)) - Conveys trust, creativity, and professionalism; reminiscent of premium design tools
- **Secondary Colors**: 
  - Slate backgrounds (oklch(0.96 0.005 240)) for cards and surfaces
  - Deep charcoal (oklch(0.25 0.01 240)) for primary text
  - Soft gray (oklch(0.55 0.01 240)) for secondary text
- **Accent Color**: Vibrant Coral (oklch(0.68 0.18 25)) - Draws attention to CTAs and important UI moments; provides warmth against cool primary
- **Foreground/Background Pairings**:
  - Background (Light Slate oklch(0.98 0.005 240)): Charcoal text (oklch(0.25 0.01 240)) - Ratio 12.5:1 ✓
  - Primary (Deep Teal oklch(0.45 0.08 210)): White text (oklch(1 0 0)) - Ratio 6.8:1 ✓
  - Accent (Coral oklch(0.68 0.18 25)): White text (oklch(1 0 0)) - Ratio 4.5:1 ✓
  - Card (Slate oklch(0.96 0.005 240)): Charcoal text (oklch(0.25 0.01 240)) - Ratio 11.8:1 ✓

## Font Selection

Typography should balance professionalism with personality - clear and readable for long-form AI responses while feeling modern and design-forward.

- **Primary Font**: Space Grotesk for headings and UI elements - geometric and distinctive with a tech-forward feel
- **Secondary Font**: Inter for body text and AI responses - exceptional readability with neutral character

**Typographic Hierarchy**:
- H1 (App Title): Space Grotesk Bold/32px/tight letter-spacing (-0.02em)
- H2 (Section Headers): Space Grotesk Semibold/24px/normal letter-spacing
- H3 (Message Headers): Space Grotesk Medium/18px/normal letter-spacing
- Body (AI Responses): Inter Regular/16px/relaxed line-height (1.7)
- Small (Timestamps): Inter Regular/13px/normal line-height/muted color
- Labels: Space Grotesk Medium/14px/uppercase/wide letter-spacing (0.05em)

## Animations

Animations should enhance the sense of intelligent conversation and real-time thinking. Subtle motion reinforces the AI's "presence" without being distracting.

- **Message appearance**: Gentle fade-up with slight slide for new messages (200ms ease-out)
- **AI thinking indicator**: Pulsing dots with staggered timing to show processing
- **Streaming text**: Smooth character-by-character reveal as AI responds
- **Button interactions**: Quick scale (0.98) on press for tactile feedback (150ms)
- **Page transitions**: Smooth fade for content changes (300ms)
- **Hover states**: Gentle color transitions (200ms) and subtle lift on cards (2px translateY)

## Component Selection

- **Components**:
  - `Card` for message bubbles with custom padding and distinct styling for user vs AI messages
  - `Button` for primary actions (analyze, send) with size="lg" and custom coral accent color
  - `Input` and `Textarea` for user input with increased padding and custom focus states
  - `ScrollArea` for message history with smooth scrolling and fade indicators
  - `Badge` for message metadata (timestamps, message type) in muted colors
  - `Separator` to divide conversation sections subtly
  - `Skeleton` for loading states while AI generates responses
  - `Alert` for error states with instructive messaging

- **Customizations**:
  - Custom message bubble component with user/AI variants
  - Code block component with syntax highlighting and copy button
  - Welcome screen component with example prompts
  - Floating action button for "New Conversation"

- **States**:
  - Buttons: Default (coral accent), hover (slightly lighter), active (pressed scale), disabled (muted with reduced opacity)
  - Inputs: Default (subtle border), focus (primary color ring with glow), filled (slightly elevated background), error (destructive color ring)
  - Messages: Sending (reduced opacity), delivered (full opacity), error state (with retry option)

- **Icon Selection**:
  - `PaperPlaneRight` for send actions
  - `Sparkle` for AI indicator and branding
  - `Image` for image analysis
  - `Palette` for design ideation
  - `Code` for code generation
  - `ArrowClockwise` for retry actions
  - `Plus` for new conversation
  - `Copy` for copying code snippets

- **Spacing**:
  - Container padding: `p-6` (24px) on desktop, `p-4` (16px) on mobile
  - Message gaps: `gap-4` (16px) between messages
  - Input area padding: `p-4` (16px) internal padding
  - Card padding: `p-6` (24px) for message content
  - Section gaps: `gap-8` (32px) between major sections

- **Mobile**:
  - Single column layout on mobile
  - Fixed input area at bottom with safe area insets
  - Collapsed header with hamburger menu for conversation history
  - Reduced font sizes: H1 to 24px, body to 15px
  - Touch-friendly button sizes (minimum 44px tap targets)
  - Full-width cards with reduced side padding
  - Sticky header with app title and new conversation button
