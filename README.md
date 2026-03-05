# SENTINEL - Military Intelligence Platform

<div align="center">

![SENTINEL Banner](https://img.shields.io/badge/SENTINEL-MILITARY%20INTEL-0A66C2?style=for-the-badge&logo=shieldcheck&logoColor=white)

**Advanced Military Intelligence & Defense Monitoring System**

[![DigitalOcean Gradient](https://img.shields.io/badge/Powered%20by-DigitalOcean%20Gradient%E2%84%A2%20AI-0080FF?style=flat-square)](https://www.digitalocean.com/products/gradient/platform)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

[View Demo](#) • [Report Issue](#) • [Request Feature](#)

</div>

---

## 🎯 Mission Overview

SENTINEL is a **classified-level military intelligence and defense monitoring platform** that provides real-time threat detection, conflict tracking, and AI-powered strategic recommendations. Built with DigitalOcean Gradient™ AI, it delivers actionable intelligence for complex geopolitical scenarios.

### 🔑 Key Capabilities

- **🗺️ Real-Time Conflict Mapping** - Interactive global map displaying active war zones, military operations, and regional tensions
- **🚀 Aerospace Threat Detection** - Track hypersonic missiles, fighter jets, UAV swarms, and unidentified aerial phenomena (UAPs)
- **🛡️ Strategic Defense Analysis** - AI-powered recommendations for attack scenarios and defensive countermeasures
- **💬 Intelligence Chat Interface** - Query military intelligence with natural language and receive expert-level analysis
- **📊 Threat Dashboard** - Real-time monitoring of aerial threats with severity indicators and tracking status

---

## 🌐 Monitored Theaters

The platform actively monitors and analyzes the following conflict zones and strategic areas:

| Theater | Region | Status | Priority |
|---------|--------|--------|----------|
| **GCC-Iran Tensions** | Persian Gulf | MONITORING | HIGH |
| **Israel-Iran Conflict** | Middle East | ACTIVE | CRITICAL |
| **Ukraine Operations** | Eastern Europe | ACTIVE | CRITICAL |
| **Cuba Strategic Watch** | Caribbean | MONITORING | MEDIUM |
| **South China Sea** | Indo-Pacific | ESCALATING | HIGH |
| **Taiwan Strait** | East Asia | MONITORING | HIGH |

---

## 🛠️ Technology Stack

### Core Technologies
- **Frontend Framework:** React 19.2 with TypeScript 5.7
- **AI Platform:** [DigitalOcean Gradient™ AI](https://www.digitalocean.com/products/gradient/platform) — Serverless LLM inference via `https://inference.do-ai.run/v1/chat/completions`
- **AI Fallback:** GitHub Spark LLM (when Gradient is not configured)
- **UI Components:** shadcn/ui v4 with Radix UI primitives
- **Styling:** Tailwind CSS 4 with custom military theme
- **Animations:** Framer Motion for tactical UI transitions
- **State Management:** React Hooks + Spark KV persistence
- **Build Tool:** Vite 7.2

### Key Dependencies
```json
{
  "@github/spark": "Spark KV persistence & fallback LLM",
  "@phosphor-icons/react": "Military-grade iconography",
  "framer-motion": "Tactical animations",
  "sonner": "Toast notifications",
  "recharts": "Data visualization"
}
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A [DigitalOcean Gradient™ AI](https://www.digitalocean.com/products/gradient/platform) model access key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sentinel-intel-platform.git
cd sentinel-intel-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Configure DigitalOcean Gradient™ AI**
   - Click the **⚙ Gradient** button in the top-right toolbar
   - Enter your Gradient model access key (get one from [DigitalOcean Cloud Console](https://cloud.digitalocean.com/gradient))
   - Select an inference model (default: Llama 3.3 70B)
   - Click **Test** to verify the connection, then **Save Config**

5. **Build for production**
```bash
npm run build
```

The application will be available at `http://localhost:5173`

---

## 📖 Feature Documentation

### 1. Intelligence Chat Interface

Query the AI analyst for detailed military intelligence:

```
Examples:
- "Analyze current hypersonic missile threats in the Middle East"
- "Provide strategic assessment of GCC-Iran naval positioning"
- "Recommend defensive protocols for ballistic missile attack on Israel"
```

**Features:**
- Natural language queries
- Technical military analysis
- Threat probability assessments
- Strategic recommendations with timelines
- Persistent conversation history

### 2. Conflict Map Viewer

Interactive global threat map displaying:
- Active conflict zones (pulsing red indicators)
- Escalating situations (amber alerts)
- Monitoring areas (blue markers)
- Real-time status updates
- Click-to-analyze functionality

**Severity Levels:**
- 🔴 **CRITICAL**: Immediate action required
- 🟠 **HIGH**: Elevated threat level
- 🔵 **MEDIUM**: Enhanced monitoring
- 🟢 **LOW**: Routine surveillance

### 3. Aerospace Threat Dashboard

Real-time tracking of aerial threats:

| Threat Type | Tracked Parameters | Detection Range |
|-------------|-------------------|-----------------|
| Hypersonic Missiles | Speed, altitude, bearing, trajectory | 0-1000 km |
| Fighter Jets | Aircraft type, altitude, speed | 0-500 km |
| UAV Swarms | Swarm size, formation, altitude | 0-300 km |
| UAPs | Speed, altitude, behavior pattern | Variable |

**Threat Metrics:**
- Distance to target
- Speed (km/h)
- Altitude (feet)
- Bearing (cardinal direction)
- Threat level percentage
- Time since detection

---

## 🎨 Design System

### Color Palette (Military Theme)

```css
/* Primary - Tactical Blue */
--primary: oklch(0.35 0.12 240);

/* Severity Indicators */
--destructive: oklch(0.50 0.20 25);  /* Critical Red */
--warning: oklch(0.65 0.15 45);      /* Alert Amber */
--success: oklch(0.55 0.15 145);     /* All Clear Green */

/* Background - Command Center */
--background: oklch(0.15 0.01 240);  /* Deep Charcoal */
```

### Typography

- **Headings:** Space Grotesk (Technical, authoritative)
- **Body:** Inter (High readability)
- **Technical Data:** JetBrains Mono (Precise alignment)

---

## 🔧 Configuration

### DigitalOcean Gradient™ AI Setup

SENTINEL uses [DigitalOcean Gradient™ AI Platform](https://www.digitalocean.com/products/gradient/platform) for serverless LLM inference. The API key is configured through the in-app settings panel (⚙ Gradient button) and stored locally in your browser's `localStorage`.

**How it works:**
1. All intelligence queries, threat predictions, and report generation are routed through the **Gradient Inference API** at `https://inference.do-ai.run/v1/chat/completions`.
2. If Gradient is not configured, the app falls back to GitHub Spark LLM.
3. The status badge in the header shows the active provider (`⚡ GRADIENT™` or `○ SPARK`).

**Supported models:**
| Model | Provider | Description |
|-------|----------|-------------|
| `llama3.3-70b-instruct` | Meta | Default — best for complex military analysis |
| `llama3.1-8b-instruct` | Meta | Faster, lighter model for quick queries |
| `mistral-small-24b-instruct-2501` | Mistral | Balanced reasoning and speed |

**API integration details:**
```
Endpoint:  POST https://inference.do-ai.run/v1/chat/completions
Auth:      Authorization: Bearer <MODEL_ACCESS_KEY>
Format:    OpenAI-compatible (model, messages, stream)
```

### Customizing Threat Data

Edit threat data in component files:
- **Conflicts:** `src/components/ThreatMap.tsx`
- **Aerial Threats:** `src/components/ThreatDashboard.tsx`

---

## 📊 AI Intelligence Capabilities

### Powered by DigitalOcean Gradient™

The platform leverages [DigitalOcean Gradient™ AI Platform](https://www.digitalocean.com/products/gradient/platform) for serverless LLM inference:

1. **Threat Analysis** - Real-time assessment of military threats via Gradient chat completions
2. **Strategic Planning** - Multi-domain warfare recommendations powered by Llama 3.3 70B
3. **Defensive Measures** - Countermeasure protocols and resource allocation
4. **Conflict Prediction** - 72-hour threat prediction timeline with AI-generated scenarios
5. **Report Generation** - Executive intelligence summaries via Gradient inference
6. **Technical Intelligence** - Detailed specifications of military assets

### Architecture

```
User Query
  ├─► DigitalOcean Gradient™ API (primary)
  │     POST https://inference.do-ai.run/v1/chat/completions
  │     Model: llama3.3-70b-instruct (configurable)
  │
  └─► GitHub Spark LLM (fallback)
        window.spark.llm()
```

- **Gradient Client** (`src/lib/gradient-client.ts`) — wraps the Gradient inference API with streaming support
- **AI Service** (`src/lib/ai-service.ts`) — unified interface with automatic provider fallback
- **Config Panel** (`src/components/GradientConfig.tsx`) — in-app API key management

**Learn more:**
- [DigitalOcean Gradient Platform](https://www.digitalocean.com/products/gradient/platform)
- [MLH DigitalOcean Gradient](https://mlh.link/digitalocean-gradient)
- [MLH DigitalOcean Products](https://mlh.link/digitalocean-products)

---

## 🔐 Security Notice

⚠️ **This is a demonstration platform for educational purposes.**

- No actual classified intelligence is processed or stored
- All threat scenarios are simulated for demonstration
- Not connected to real military or intelligence networks
- Designed to showcase AI capabilities in defense contexts

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **DigitalOcean** for Gradient™ AI platform and infrastructure
- **Radix UI** for accessible component primitives
- **Phosphor Icons** for comprehensive military iconography
- **shadcn** for elegant component architecture

---

## 📞 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/sentinel-intel-platform/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/sentinel-intel-platform/discussions)

---

<div align="center">

**Built with ⚡ by developers, for defenders**

[DigitalOcean Gradient™](https://www.digitalocean.com/products/gradient/platform) | [MLH Partnership](https://mlh.link/digitalocean-gradient)

</div>
