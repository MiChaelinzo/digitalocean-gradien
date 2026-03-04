# Gradient AI Design Studio

An intelligent UI/UX design critique and ideation platform powered by DigitalOcean's Gradient™ AI. Get instant, expert feedback on your designs, explore creative directions, and generate production-ready code—all through natural conversation.

## Features

### 🎨 AI Design Critique
Upload or describe your design and receive detailed feedback on:
- Aesthetics and visual balance
- Color contrast and accessibility (WCAG compliance)
- Typography hierarchy and readability
- User experience and usability best practices
- Modern design trends and patterns

### 💡 Design Ideation Assistant
Describe what you want to build and get creative suggestions for:
- Multiple distinct design directions
- Specific color palettes with reasoning
- Typeface recommendations
- Emotional impact and brand alignment strategies

### 💻 Code Generation
Transform design discussions into implementation with:
- Tailwind CSS utility-based code snippets
- Semantic HTML structure
- Accessibility attributes included
- Explained implementation decisions

### 📝 Persistent Conversation History
- All conversations automatically saved
- Continue discussions across sessions
- Learn and iterate on designs over time
- Reference previous critiques and suggestions

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **UI Components**: shadcn/ui v4 with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **AI Integration**: DigitalOcean Gradient™ AI Platform (GPT-4o)
- **State Management**: React hooks with persistent KV storage
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons
- **Build Tool**: Vite 7

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with JavaScript enabled

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd gradient-ai-design-studio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## How to Use

1. **Start a Conversation**: When you first open the app, you'll see three example prompts to get started. Click any example or write your own message.

2. **Get Design Feedback**: 
   - Describe your design in detail
   - Ask specific questions about color choices, layout, typography, etc.
   - Request accessibility reviews or usability improvements

3. **Explore Creative Directions**:
   - Describe your project goals
   - Ask for design direction suggestions
   - Request specific color palettes or font combinations

4. **Generate Code**:
   - Ask the AI to generate Tailwind CSS for discussed design elements
   - Request complete component implementations
   - Get code with accessibility attributes included

5. **Continue the Conversation**: All messages are automatically saved, so you can close the app and return later to continue where you left off.

6. **Start Fresh**: Click the "New Chat" button in the header to clear the conversation and start over.

## Key Design Decisions

### Color Palette
- **Primary (Deep Teal)**: Professional and trustworthy, inspired by premium design tools
- **Accent (Coral)**: Warm and inviting, draws attention to key actions
- **Neutral Backgrounds**: Soft slate tones that don't compete with content

### Typography
- **Space Grotesk**: For headings and UI elements—geometric and modern
- **Inter**: For body text—exceptional readability for long-form AI responses

### User Experience
- **Conversation-First**: Chat interface feels natural and approachable
- **Real-Time Feedback**: Loading states and animations show the AI is thinking
- **Mobile-Optimized**: Fully responsive design works on all screen sizes
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new lines

## DigitalOcean Gradient™ AI Integration

This application demonstrates the full-stack capabilities of DigitalOcean's Gradient AI platform:

- **LLM Integration**: Direct API calls to GPT-4o for intelligent design consultation
- **Streaming Responses**: Real-time response generation with visual feedback
- **Contextual AI**: Prompts engineered specifically for design expertise
- **Persistent State**: Leverages KV storage for conversation history

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn component library
│   ├── MessageBubble.tsx   # Chat message component
│   └── WelcomeScreen.tsx   # Landing experience
├── App.tsx              # Main application logic
├── index.css            # Global styles and theme
└── main.tsx             # Application entry point
```

## Contributing

This project is open source. Contributions, issues, and feature requests are welcome!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [DigitalOcean Gradient™ AI](https://www.digitalocean.com/products/gradient/platform)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Phosphor Icons](https://phosphoricons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## About

Created as a demonstration of DigitalOcean Gradient AI's capabilities for intelligent, context-aware applications. This tool helps designers and developers improve their craft through AI-powered design consultation.

---

**Powered by DigitalOcean Gradient™ AI Platform**
