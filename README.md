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
- **AI Platform:** [DigitalOcean Gradient™ AI](https://www.digitalocean.com/products/gradient/platform)
- **UI Components:** shadcn/ui v4 with Radix UI primitives
- **Styling:** Tailwind CSS 4 with custom military theme
- **Animations:** Framer Motion for tactical UI transitions
- **State Management:** React Hooks + Spark KV persistence
- **Build Tool:** Vite 7.2

### Key Dependencies
```json
{
  "@github/spark": "Real-time AI integration & persistence",
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
- Access to DigitalOcean Gradient™ AI platform

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

4. **Build for production**
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

### Environment Variables

The application uses DigitalOcean Gradient™ AI which requires no additional API keys in development. For production deployment:

```env
# DigitalOcean Gradient AI is pre-configured via Spark SDK
# No additional environment variables required
```

### Customizing Threat Data

Edit threat data in component files:
- **Conflicts:** `src/components/ThreatMap.tsx`
- **Aerial Threats:** `src/components/ThreatDashboard.tsx`

---

## 📊 AI Intelligence Capabilities

### Powered by DigitalOcean Gradient™

The platform leverages [DigitalOcean Gradient™ AI](https://www.digitalocean.com/products/gradient/platform) for:

1. **Threat Analysis** - Real-time assessment of military threats and geopolitical situations
2. **Strategic Planning** - Multi-domain warfare recommendations
3. **Defensive Measures** - Countermeasure protocols and resource allocation
4. **Conflict Prediction** - Escalation probability and timeline forecasting
5. **Technical Intelligence** - Detailed specifications of military assets

### Model: GPT-4o
- Advanced reasoning for complex military scenarios
- Technical precision in threat assessments
- Multi-factor strategic analysis
- Real-time intelligence synthesis

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
