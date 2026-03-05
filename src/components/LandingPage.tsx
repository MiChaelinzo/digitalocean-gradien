import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Globe, Target, ChartLine, Lock, Lightning, Eye, ArrowRight, CheckCircle } from '@phosphor-icons/react'

interface LandingPageProps {
  onGetStarted: () => void
  onLogin: () => void
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const features = [
    {
      icon: Globe,
      title: '3D Threat Visualization',
      description: 'Real-time 3D globe with interactive threat tracking and trajectory analysis'
    },
    {
      icon: Target,
      title: 'Advanced Threat Detection',
      description: 'AI-powered identification of hypersonic missiles, drones, aircraft, and UAPs'
    },
    {
      icon: ChartLine,
      title: 'Predictive Analytics',
      description: 'Machine learning models predict threat patterns and conflict escalation'
    },
    {
      icon: Shield,
      title: 'Defense Recommendations',
      description: 'Strategic countermeasure suggestions and tactical response protocols'
    },
    {
      icon: Eye,
      title: 'Real-Time Intelligence',
      description: 'Live monitoring of global conflicts including GCC-Iran, Israel, and more'
    },
    {
      icon: Lightning,
      title: 'Instant Alerts',
      description: 'Critical threat notifications with severity-based prioritization'
    }
  ]

  const stats = [
    { value: '12', label: 'Active Theaters' },
    { value: '847', label: 'Tracked Threats' },
    { value: '99.8%', label: 'Detection Rate' },
    { value: '<50ms', label: 'Response Time' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.25_0.05_240),transparent_50%)] opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.3_0.01_240_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.3_0.01_240_/_0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="relative z-10">
        <nav className="border-b border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield size={24} weight="fill" className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wider uppercase">SENTINEL</h1>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  Military Intelligence Platform
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Button variant="ghost" onClick={onLogin} className="font-mono">
                Sign In
              </Button>
              <Button onClick={onGetStarted} className="gap-2 font-mono">
                Get Started
                <ArrowRight size={16} weight="bold" />
              </Button>
            </motion.div>
          </div>
        </nav>

        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 font-mono text-xs">
                <Lock size={12} className="mr-2" />
                CLASSIFIED SYSTEM // AUTHORIZED ACCESS ONLY
              </Badge>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
            >
              Next-Generation
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                Military Intelligence
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              AI-powered threat detection and strategic analysis platform. Monitor global conflicts, 
              track aerospace threats, and receive real-time defense recommendations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="gap-2 px-8 py-6 text-lg font-mono"
              >
                Access Platform
                <ArrowRight size={20} weight="bold" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={onLogin}
                className="px-8 py-6 text-lg font-mono"
              >
                Sign In
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12"
            >
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-primary font-mono">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Advanced Capabilities
              </h3>
              <p className="text-lg text-muted-foreground">
                Powered by DigitalOcean Gradient™ AI for superior intelligence analysis
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon size={24} weight="fill" className="text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/20">
              <div className="text-center space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold">
                  Ready to Access Intelligence?
                </h3>
                <p className="text-lg text-muted-foreground">
                  Join military analysts and defense strategists using SENTINEL for threat monitoring
                </p>
                <div className="space-y-3 max-w-md mx-auto pt-4">
                  <div className="flex items-center gap-3 text-left">
                    <CheckCircle size={20} weight="fill" className="text-success flex-shrink-0" />
                    <span className="text-sm">Real-time threat tracking across 12+ theaters</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <CheckCircle size={20} weight="fill" className="text-success flex-shrink-0" />
                    <span className="text-sm">AI-powered predictive threat analysis</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <CheckCircle size={20} weight="fill" className="text-success flex-shrink-0" />
                    <span className="text-sm">Strategic defense recommendations</span>
                  </div>
                </div>
                <Button 
                  size="lg"
                  onClick={onGetStarted}
                  className="gap-2 px-8 py-6 text-lg font-mono"
                >
                  Get Started Now
                  <ArrowRight size={20} weight="bold" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </section>

        <footer className="border-t border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary flex items-center justify-center">
                  <Shield size={16} weight="fill" className="text-primary" />
                </div>
                <span className="text-sm font-mono">SENTINEL © 2024</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="font-mono">Powered by DigitalOcean Gradient™ AI</span>
                <span className="font-mono">CLASSIFIED SYSTEM</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
