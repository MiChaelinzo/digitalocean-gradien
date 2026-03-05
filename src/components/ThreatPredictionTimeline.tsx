import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { queryAISimple } from '@/lib/ai-service'
import { 
  Clock, 
  Target, 
  TrendUp, 
  Lightning, 
  ShieldWarning, 
  CheckCircle,
  ArrowRight,
  Sparkle,
  CaretRight,
  ChartLine,
  WarningCircle,
  MapPin,
  FunnelSimple,
  X
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface PredictionScenario {
  id: string
  timeframe: string
  hoursFromNow: number
  probability: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  keyFactors: string[]
  recommendations: string[]
  affectedRegions: string[]
  threatType: string
  confidence: number
}

interface ThreatPredictionTimelineProps {
  threatContext?: string
}

const GEOGRAPHIC_REGIONS = [
  { id: 'middle-east', name: 'Middle East', subregions: ['Persian Gulf', 'Israel', 'Iran', 'GCC States', 'Syria', 'Iraq', 'Yemen'] },
  { id: 'east-asia', name: 'East Asia', subregions: ['Taiwan Strait', 'South China Sea', 'Korean Peninsula', 'Japan', 'Philippines'] },
  { id: 'europe', name: 'Europe', subregions: ['Ukraine', 'Baltic States', 'Black Sea', 'Eastern Europe', 'Mediterranean'] },
  { id: 'indo-pacific', name: 'Indo-Pacific', subregions: ['India', 'Pakistan', 'Afghanistan', 'Myanmar', 'Indonesia'] },
  { id: 'americas', name: 'Americas', subregions: ['Cuba', 'Venezuela', 'Colombia', 'Mexico', 'Caribbean'] },
  { id: 'africa', name: 'Africa', subregions: ['North Africa', 'Sahel Region', 'Horn of Africa', 'Central Africa', 'Red Sea'] },
]

type SeverityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low'

export function ThreatPredictionTimeline({ threatContext }: ThreatPredictionTimelineProps) {
  const [predictions, setPredictions] = useState<PredictionScenario[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [analysisDepth, setAnalysisDepth] = useState<'basic' | 'detailed' | 'comprehensive'>('detailed')
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityFilter>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    generatePredictions()
  }, [threatContext, selectedRegions, analysisDepth])
  
  const filteredPredictions = predictions.filter(pred => {
    if (selectedSeverity === 'all') return true
    return pred.severity === selectedSeverity
  })

  const toggleRegion = (regionId: string) => {
    setSelectedRegions(current => 
      current.includes(regionId)
        ? current.filter(r => r !== regionId)
        : [...current, regionId]
    )
  }

  const clearAllRegions = () => {
    setSelectedRegions([])
    toast.info('All region filters cleared')
  }

  const getSelectedRegionNames = (): string[] => {
    if (selectedRegions.length === 0) return []
    
    const names: string[] = []
    GEOGRAPHIC_REGIONS.forEach(region => {
      if (selectedRegions.includes(region.id)) {
        names.push(region.name)
        names.push(...region.subregions)
      }
    })
    return names
  }

  const generatePredictions = async () => {
    setIsLoading(true)
    try {
      const contextInfo = threatContext || 'current global military tensions and active conflicts'
      const regionNames = getSelectedRegionNames()
      const regions = regionNames.length > 0 ? regionNames.join(', ') : 'all monitored regions'
      
      const prompt = `You are a military intelligence AI analyzing future threat scenarios. Generate exactly 5 realistic threat prediction scenarios for the next 72 hours.

Context: ${contextInfo}
Regions of Focus: ${regions}
Analysis Depth: ${analysisDepth}

For each scenario, provide:
1. Timeframe (e.g., "Next 6 hours", "12-24 hours", "24-48 hours", "48-72 hours")
2. Hours from now (integer)
3. Probability percentage (0-100)
4. Severity level (critical/high/medium/low)
5. Scenario title (concise, military-style)
6. Description (2-3 sentences about what might occur)
7. Key factors contributing to this prediction (3-4 bullet points)
8. Recommended actions (3-4 specific countermeasures)
9. Affected regions (specific countries/areas)
10. Threat type (e.g., "Missile Strike", "Cyber Attack", "Naval Incursion", "Air Space Violation")
11. Confidence score (0-100) in this prediction

Return as valid JSON with a single property "scenarios" containing an array of scenario objects with these exact properties: timeframe, hoursFromNow, probability, severity, title, description, keyFactors (array), recommendations (array), affectedRegions (array), threatType, confidence.

Make predictions realistic based on current geopolitical tensions (Iran-Israel, GCC region, Ukraine, Taiwan Strait, South China Sea). Ensure timeframes progress logically from near-term to 72 hours out.`

      const { text: response, provider } = await queryAISimple(prompt)
      console.log(`[SENTINEL] Predictions via ${provider}`)
      const data = JSON.parse(response)
      
      if (data.scenarios && Array.isArray(data.scenarios)) {
        const scenariosWithIds = data.scenarios.map((scenario: any, index: number) => ({
          ...scenario,
          id: `scenario-${Date.now()}-${index}`
        }))
        setPredictions(scenariosWithIds)
        toast.success(`Generated ${scenariosWithIds.length} threat prediction scenarios`)
      }
    } catch (error) {
      console.error('Error generating predictions:', error)
      toast.error('Failed to generate threat predictions')
      
      setPredictions([
        {
          id: 'fallback-1',
          timeframe: 'Next 6 hours',
          hoursFromNow: 6,
          probability: 72,
          severity: 'high',
          title: 'Escalation in Strait of Hormuz',
          description: 'Iranian naval forces conducting aggressive maneuvers near shipping lanes. Increased probability of close encounters with coalition vessels.',
          keyFactors: [
            'Recent diplomatic tensions',
            'IRGC naval exercises',
            'Oil tanker movements',
            'Regional force posture'
          ],
          recommendations: [
            'Increase naval patrol frequency',
            'Activate satellite surveillance',
            'Issue navigation warnings',
            'Position rapid response teams'
          ],
          affectedRegions: ['Persian Gulf', 'UAE', 'Oman', 'Saudi Arabia'],
          threatType: 'Naval Incursion',
          confidence: 78
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive'
      case 'high': return 'text-warning'
      case 'medium': return 'text-accent'
      case 'low': return 'text-success'
      default: return 'text-muted-foreground'
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/20 border-destructive'
      case 'high': return 'bg-warning/20 border-warning'
      case 'medium': return 'bg-accent/20 border-accent'
      case 'low': return 'bg-success/20 border-success'
      default: return 'bg-muted'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldWarning size={20} weight="fill" className="text-destructive" />
      case 'high': return <WarningCircle size={20} weight="fill" className="text-warning" />
      case 'medium': return <Target size={20} weight="fill" className="text-accent" />
      case 'low': return <CheckCircle size={20} weight="fill" className="text-success" />
      default: return <Clock size={20} />
    }
  }

  const getTimelinePosition = (hours: number): number => {
    return Math.min((hours / 72) * 100, 100)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/20 border-2 border-primary flex items-center justify-center">
                <TrendUp size={20} weight="bold" className="text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Sparkle size={18} weight="fill" className="text-accent" />
                  AI THREAT PREDICTION TIMELINE
                </CardTitle>
                <CardDescription className="text-xs font-mono uppercase mt-1">
                  72-Hour Forward Projection // GRADIENT™ AI POWERED
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs font-mono uppercase relative"
                  >
                    <FunnelSimple size={16} weight={selectedRegions.length > 0 ? 'fill' : 'regular'} />
                    Region Filter
                    {selectedRegions.length > 0 && (
                      <Badge className="ml-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px]">
                        {selectedRegions.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold font-mono uppercase">Geographic Focus</h4>
                      {selectedRegions.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllRegions}
                          className="h-6 px-2 text-xs gap-1"
                        >
                          <X size={12} />
                          Clear
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select regions to focus threat predictions
                    </p>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <div className="p-4 space-y-4">
                      {GEOGRAPHIC_REGIONS.map((region) => (
                        <div key={region.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={region.id}
                              checked={selectedRegions.includes(region.id)}
                              onCheckedChange={() => toggleRegion(region.id)}
                            />
                            <label
                              htmlFor={region.id}
                              className="text-sm font-semibold cursor-pointer flex items-center gap-2"
                            >
                              <MapPin size={14} weight="fill" className="text-primary" />
                              {region.name}
                            </label>
                          </div>
                          <div className="ml-6 flex flex-wrap gap-1">
                            {region.subregions.map((sub) => (
                              <Badge
                                key={sub}
                                variant="secondary"
                                className="text-[10px] font-mono"
                              >
                                {sub}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-3 border-t border-border bg-muted/30">
                    <Button
                      onClick={() => {
                        setIsFilterOpen(false)
                        if (selectedRegions.length > 0) {
                          toast.success(`Filtering predictions for ${selectedRegions.length} region${selectedRegions.length > 1 ? 's' : ''}`)
                        }
                      }}
                      size="sm"
                      className="w-full text-xs font-mono uppercase"
                    >
                      Apply Filter
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Separator orientation="vertical" className="h-8" />
              
              <div className="flex items-center gap-1">
                <Button
                  variant={selectedSeverity === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSeverity('all')}
                  className="text-xs font-mono h-8 px-2"
                >
                  All
                </Button>
                <Button
                  variant={selectedSeverity === 'critical' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSeverity('critical')}
                  className={`text-xs font-mono h-8 px-2 ${
                    selectedSeverity === 'critical'
                      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      : 'hover:bg-destructive/10 hover:text-destructive'
                  }`}
                >
                  Critical
                </Button>
                <Button
                  variant={selectedSeverity === 'high' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSeverity('high')}
                  className={`text-xs font-mono h-8 px-2 ${
                    selectedSeverity === 'high'
                      ? 'bg-warning text-warning-foreground hover:bg-warning/90'
                      : 'hover:bg-warning/10 hover:text-warning'
                  }`}
                >
                  High
                </Button>
                <Button
                  variant={selectedSeverity === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSeverity('medium')}
                  className={`text-xs font-mono h-8 px-2 ${
                    selectedSeverity === 'medium'
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'hover:bg-primary/10'
                  }`}
                >
                  Medium
                </Button>
                <Button
                  variant={selectedSeverity === 'low' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSeverity('low')}
                  className={`text-xs font-mono h-8 px-2 ${
                    selectedSeverity === 'low'
                      ? 'bg-success text-success-foreground hover:bg-success/90'
                      : 'hover:bg-success/10 hover:text-success'
                  }`}
                >
                  Low
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-8" />
              
              <Button
                variant={analysisDepth === 'basic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAnalysisDepth('basic')}
                className="text-xs font-mono"
              >
                Basic
              </Button>
              <Button
                variant={analysisDepth === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAnalysisDepth('detailed')}
                className="text-xs font-mono"
              >
                Detailed
              </Button>
              <Button
                variant={analysisDepth === 'comprehensive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAnalysisDepth('comprehensive')}
                className="text-xs font-mono"
              >
                Comprehensive
              </Button>
              
              <Separator orientation="vertical" className="h-8" />
              
              <Button
                variant="outline"
                size="sm"
                onClick={generatePredictions}
                disabled={isLoading}
                className="gap-2 text-xs font-mono uppercase"
              >
                <Lightning size={16} weight="fill" />
                Regenerate
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {(selectedRegions.length > 0 || selectedSeverity !== 'all') && (
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground uppercase">Active Filters:</span>
              {GEOGRAPHIC_REGIONS.filter(r => selectedRegions.includes(r.id)).map(region => (
                <Badge
                  key={region.id}
                  variant="default"
                  className="gap-1.5 text-xs font-mono cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleRegion(region.id)}
                >
                  <MapPin size={12} weight="fill" />
                  {region.name}
                  <X size={12} weight="bold" />
                </Badge>
              ))}
              {selectedSeverity !== 'all' && (
                <Badge
                  variant="default"
                  className={`gap-1.5 text-xs font-mono cursor-pointer ${
                    selectedSeverity === 'critical' ? 'bg-destructive hover:bg-destructive/80' :
                    selectedSeverity === 'high' ? 'bg-warning hover:bg-warning/80' :
                    selectedSeverity === 'medium' ? 'bg-primary hover:bg-primary/80' :
                    'bg-success hover:bg-success/80'
                  }`}
                  onClick={() => setSelectedSeverity('all')}
                >
                  {selectedSeverity.toUpperCase()}
                  <X size={12} weight="bold" />
                </Badge>
              )}
            </div>
          )}
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-muted/50 rounded-md" />
                </div>
              ))}
            </div>
          ) : predictions.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-mono text-sm">
                No predictions generated yet
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex items-center">
                  {[0, 6, 12, 24, 48, 72].map((hour) => (
                    <div
                      key={hour}
                      className="absolute h-full w-px bg-border"
                      style={{ left: `${(hour / 72) * 100}%` }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                        {hour === 0 ? 'NOW' : `+${hour}h`}
                      </span>
                    </div>
                  ))}
                </div>
                
                {predictions.map((pred) => (
                  <motion.div
                    key={pred.id}
                    className="absolute top-0 h-full w-1"
                    style={{ left: `${getTimelinePosition(pred.hoursFromNow)}%` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`h-full w-1 ${pred.severity === 'critical' ? 'bg-destructive' : pred.severity === 'high' ? 'bg-warning' : pred.severity === 'medium' ? 'bg-accent' : 'bg-success'}`} />
                  </motion.div>
                ))}
              </div>

              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {predictions.map((scenario, index) => (
                      <motion.div
                        key={scenario.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card 
                          className={`border-2 transition-all cursor-pointer ${
                            selectedScenario === scenario.id 
                              ? `${getSeverityBg(scenario.severity)} shadow-lg` 
                              : 'bg-card/30 border-border hover:bg-card/50'
                          }`}
                          onClick={() => setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                {getSeverityIcon(scenario.severity)}
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className="font-mono text-[10px]">
                                      {scenario.timeframe}
                                    </Badge>
                                    <Badge variant="outline" className="font-mono text-[10px]">
                                      {scenario.threatType}
                                    </Badge>
                                    <Badge 
                                      className={`font-mono text-[10px] uppercase ${
                                        scenario.severity === 'critical' ? 'bg-destructive text-destructive-foreground' :
                                        scenario.severity === 'high' ? 'bg-warning text-warning-foreground' :
                                        scenario.severity === 'medium' ? 'bg-accent text-accent-foreground' :
                                        'bg-success text-success-foreground'
                                      }`}
                                    >
                                      {scenario.severity}
                                    </Badge>
                                  </div>
                                  <CardTitle className="text-base font-bold uppercase">
                                    {scenario.title}
                                  </CardTitle>
                                  <CardDescription className="text-xs">
                                    {scenario.description}
                                  </CardDescription>
                                </div>
                              </div>
                              
                              <div className="text-right space-y-1 flex-shrink-0">
                                <div className="text-sm font-bold font-mono">
                                  <span className={getSeverityColor(scenario.severity)}>
                                    {scenario.probability}%
                                  </span>
                                </div>
                                <div className="text-[10px] text-muted-foreground font-mono uppercase">
                                  Probability
                                </div>
                              </div>
                            </div>

                            <div className="mt-3">
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono mb-1">
                                <span>LIKELIHOOD</span>
                                <span>{scenario.probability}%</span>
                              </div>
                              <Progress 
                                value={scenario.probability} 
                                className={`h-1.5 ${
                                  scenario.severity === 'critical' ? '[&>div]:bg-destructive' :
                                  scenario.severity === 'high' ? '[&>div]:bg-warning' :
                                  scenario.severity === 'medium' ? '[&>div]:bg-accent' :
                                  '[&>div]:bg-success'
                                }`}
                              />
                            </div>
                          </CardHeader>

                          <AnimatePresence>
                            {selectedScenario === scenario.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <CardContent className="space-y-4 pt-0">
                                  <Separator />

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-xs font-bold font-mono uppercase text-muted-foreground mb-2">
                                        Key Contributing Factors
                                      </h4>
                                      <ul className="space-y-1.5">
                                        {scenario.keyFactors.map((factor, i) => (
                                          <li key={i} className="text-xs flex items-start gap-2">
                                            <CaretRight size={12} weight="bold" className="mt-0.5 flex-shrink-0 text-primary" />
                                            <span>{factor}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div>
                                      <h4 className="text-xs font-bold font-mono uppercase text-muted-foreground mb-2">
                                        Recommended Actions
                                      </h4>
                                      <ul className="space-y-1.5">
                                        {scenario.recommendations.map((rec, i) => (
                                          <li key={i} className="text-xs flex items-start gap-2">
                                            <ArrowRight size={12} weight="bold" className="mt-0.5 flex-shrink-0 text-accent" />
                                            <span>{rec}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-xs font-bold font-mono uppercase text-muted-foreground mb-2">
                                      Affected Regions
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                      {scenario.affectedRegions.map((region, i) => (
                                        <Badge key={i} variant="secondary" className="text-[10px] font-mono">
                                          {region}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-[10px] font-mono">
                                    <span className="text-muted-foreground">
                                      AI CONFIDENCE: {scenario.confidence}%
                                    </span>
                                    <Badge variant="outline" className="gap-1">
                                      <ChartLine size={10} />
                                      {analysisDepth.toUpperCase()}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  )
                </div>
              </ScrollArea>

              <Card className="bg-muted/30 border-border">
                <CardContent className="py-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground font-mono">
                      <Sparkle size={14} weight="fill" className="text-primary" />
                      <span>Powered by DigitalOcean Gradient™ AI</span>
                    </div>
                    <div className="text-muted-foreground font-mono">
                      {filteredPredictions.length} of {predictions.length} scenarios • {analysisDepth} analysis
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
