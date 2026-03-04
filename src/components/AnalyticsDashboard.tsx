import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendUp, TrendDown, Pulse, ChartLine, ChartBar, ChartPieSlice } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

const threatTrendData = [
  { date: 'Jan 15', critical: 2, high: 5, medium: 12, low: 8 },
  { date: 'Jan 16', critical: 3, high: 7, medium: 15, low: 10 },
  { date: 'Jan 17', critical: 1, high: 6, medium: 11, low: 9 },
  { date: 'Jan 18', critical: 4, high: 9, medium: 18, low: 12 },
  { date: 'Jan 19', critical: 5, high: 11, medium: 20, low: 14 },
  { date: 'Jan 20', critical: 3, high: 8, medium: 16, low: 11 },
  { date: 'Today', critical: 6, high: 13, medium: 22, low: 15 }
]

const regionDistribution = [
  { name: 'Middle East', value: 35, color: '#ff3333' },
  { name: 'East Asia', value: 28, color: '#ffaa33' },
  { name: 'Eastern Europe', value: 22, color: '#4488ff' },
  { name: 'Caribbean', value: 10, color: '#33ff88' },
  { name: 'Indo-Pacific', value: 5, color: '#8844ff' }
]

const responseTimeData = [
  { hour: '00:00', avgResponse: 2.3, threats: 3 },
  { hour: '04:00', avgResponse: 1.8, threats: 2 },
  { hour: '08:00', avgResponse: 3.1, threats: 7 },
  { hour: '12:00', avgResponse: 4.2, threats: 12 },
  { hour: '16:00', avgResponse: 3.8, threats: 9 },
  { hour: '20:00', avgResponse: 2.9, threats: 6 },
  { hour: 'Now', avgResponse: 5.1, threats: 15 }
]

const threatTypeBreakdown = [
  { type: 'Missile', count: 45, percentage: 28 },
  { type: 'Aircraft', count: 38, percentage: 24 },
  { type: 'Drone', count: 32, percentage: 20 },
  { type: 'Naval', count: 28, percentage: 18 },
  { type: 'UAP', count: 16, percentage: 10 }
]

const defenseEffectiveness = [
  { system: 'Iron Dome', success: 94, failed: 6 },
  { system: 'Patriot', success: 89, failed: 11 },
  { system: 'THAAD', success: 96, failed: 4 },
  { system: 'Aegis', success: 91, failed: 9 },
  { system: 'S-400', success: 87, failed: 13 }
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wide">Intelligence Analytics</h2>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Real-time threat analysis and operational metrics
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50 font-mono uppercase">
          Live Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-4 border-destructive/50 bg-destructive/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-muted-foreground">Threat Increase</span>
              <TrendUp className="text-destructive" weight="bold" size={20} />
            </div>
            <div className="text-3xl font-bold text-destructive font-mono">+24%</div>
            <div className="text-xs text-muted-foreground mt-1 font-mono">vs. Last 24hrs</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <Card className="p-4 border-success/50 bg-success/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-muted-foreground">Response Time</span>
              <Pulse className="text-success" weight="bold" size={20} />
            </div>
            <div className="text-3xl font-bold text-success font-mono">2.4s</div>
            <div className="text-xs text-muted-foreground mt-1 font-mono">Avg Detection Time</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Card className="p-4 border-warning/50 bg-warning/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-muted-foreground">Active Regions</span>
              <ChartPieSlice className="text-warning" weight="fill" size={20} />
            </div>
            <div className="text-3xl font-bold text-warning font-mono">5</div>
            <div className="text-xs text-muted-foreground mt-1 font-mono">Conflict Zones</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <Card className="p-4 border-primary/50 bg-primary/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-muted-foreground">Defense Rate</span>
              <TrendDown className="text-primary" weight="bold" size={20} />
            </div>
            <div className="text-3xl font-bold text-primary font-mono">92%</div>
            <div className="text-xs text-muted-foreground mt-1 font-mono">Intercept Success</div>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="trends" className="gap-2 font-mono text-xs">
            <ChartLine size={16} weight="bold" />
            Threat Trends
          </TabsTrigger>
          <TabsTrigger value="distribution" className="gap-2 font-mono text-xs">
            <ChartPieSlice size={16} weight="fill" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="effectiveness" className="gap-2 font-mono text-xs">
            <ChartBar size={16} weight="fill" />
            Defense Systems
          </TabsTrigger>
          <TabsTrigger value="response" className="gap-2 font-mono text-xs">
            <Pulse size={16} weight="bold" />
            Response Times
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-4">
          <Card className="p-6">
            <h3 className="font-semibold uppercase tracking-wide text-sm mb-4">
              7-Day Threat Severity Trends
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={threatTrendData}>
                <defs>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3333" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff3333" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffaa33" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffaa33" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4488ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4488ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                <XAxis dataKey="date" stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 30, 40, 0.95)',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }} />
                <Area type="monotone" dataKey="critical" stroke="#ff3333" fill="url(#colorCritical)" name="Critical" strokeWidth={2} />
                <Area type="monotone" dataKey="high" stroke="#ffaa33" fill="url(#colorHigh)" name="High" strokeWidth={2} />
                <Area type="monotone" dataKey="medium" stroke="#4488ff" fill="url(#colorMedium)" name="Medium" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold uppercase tracking-wide text-sm mb-4">
                Regional Threat Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={regionDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {regionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 30, 40, 0.95)',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold uppercase tracking-wide text-sm mb-4">
                Threat Type Breakdown
              </h3>
              <div className="space-y-3 mt-6">
                {threatTypeBreakdown.map((item, index) => (
                  <motion.div
                    key={item.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-mono">{item.type}</span>
                      <span className="font-mono font-semibold">{item.count}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="effectiveness" className="mt-4">
          <Card className="p-6">
            <h3 className="font-semibold uppercase tracking-wide text-sm mb-4">
              Defense System Effectiveness
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={defenseEffectiveness}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                <XAxis dataKey="system" stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 30, 40, 0.95)',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }} />
                <Bar dataKey="success" fill="#33ff88" name="Success %" radius={[8, 8, 0, 0]} />
                <Bar dataKey="failed" fill="#ff3333" name="Failed %" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="mt-4">
          <Card className="p-6">
            <h3 className="font-semibold uppercase tracking-wide text-sm mb-4">
              24-Hour Response Time Analysis
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                <XAxis dataKey="hour" stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                <YAxis yAxisId="left" stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 30, 40, 0.95)',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="avgResponse" stroke="#4488ff" strokeWidth={3} name="Avg Response (s)" dot={{ fill: '#4488ff', r: 5 }} />
                <Line yAxisId="right" type="monotone" dataKey="threats" stroke="#ffaa33" strokeWidth={3} name="Threats Detected" dot={{ fill: '#ffaa33', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
