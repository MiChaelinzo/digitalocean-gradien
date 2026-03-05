import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { 
  Layout, 
  Eye, 
  EyeSlash, 
  ChartLine, 
  Globe, 
  Target, 
  Bell,
  Users,
  Clock,
  MapPin,
  TrendUp
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface WidgetConfig {
  id: string
  name: string
  description: string
  iconName: string
  enabled: boolean
  category: 'analytics' | 'monitoring' | 'intelligence'
}

interface DashboardCustomizationProps {
  isOpen: boolean
  onClose: () => void
}

const ICON_MAP: Record<string, any> = {
  Globe,
  ChartLine,
  Target,
  TrendUp,
  Bell,
  Clock,
  Users,
  MapPin
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'threat-map',
    name: '3D Threat Globe',
    description: 'Interactive global threat visualization',
    iconName: 'Globe',
    enabled: true,
    category: 'monitoring'
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Statistical threat analysis and trends',
    iconName: 'ChartLine',
    enabled: true,
    category: 'analytics'
  },
  {
    id: 'active-threats',
    name: 'Active Threat Monitor',
    description: 'Real-time threat tracking panel',
    iconName: 'Target',
    enabled: true,
    category: 'monitoring'
  },
  {
    id: 'predictions',
    name: 'AI Predictions',
    description: '72-hour threat timeline forecasting',
    iconName: 'TrendUp',
    enabled: true,
    category: 'intelligence'
  },
  {
    id: 'notifications',
    name: 'Threat Alerts',
    description: 'Priority notification system',
    iconName: 'Bell',
    enabled: true,
    category: 'monitoring'
  },
  {
    id: 'session-history',
    name: 'Session History',
    description: 'Previous intelligence sessions',
    iconName: 'Clock',
    enabled: true,
    category: 'intelligence'
  },
  {
    id: 'team-collab',
    name: 'Team Collaboration',
    description: 'Multi-analyst coordination',
    iconName: 'Users',
    enabled: false,
    category: 'intelligence'
  },
  {
    id: 'region-focus',
    name: 'Regional Focus',
    description: 'Geographic area prioritization',
    iconName: 'MapPin',
    enabled: false,
    category: 'monitoring'
  }
]

export function DashboardCustomization({ isOpen, onClose }: DashboardCustomizationProps) {
  const [widgets, setWidgets] = useKV<WidgetConfig[]>('dashboard-widgets', DEFAULT_WIDGETS)

  const handleToggleWidget = (widgetId: string) => {
    setWidgets(current => 
      (current || DEFAULT_WIDGETS).map(w => 
        w.id === widgetId ? { ...w, enabled: !w.enabled } : w
      )
    )
    const widget = (widgets || DEFAULT_WIDGETS).find(w => w.id === widgetId)
    if (widget) {
      toast.success(`${widget.name} ${widget.enabled ? 'disabled' : 'enabled'}`)
    }
  }

  const handleResetDefaults = () => {
    setWidgets(DEFAULT_WIDGETS)
    toast.success('Dashboard reset to default configuration')
  }

  const handleEnableAll = () => {
    setWidgets(current => 
      (current || DEFAULT_WIDGETS).map(w => ({ ...w, enabled: true }))
    )
    toast.success('All widgets enabled')
  }

  const categories = {
    monitoring: { name: 'Real-Time Monitoring', color: 'text-destructive' },
    analytics: { name: 'Analytics & Insights', color: 'text-primary' },
    intelligence: { name: 'Intelligence Tools', color: 'text-warning' }
  }

  const enabledCount = (widgets || DEFAULT_WIDGETS).filter(w => w.enabled).length
  const totalCount = (widgets || DEFAULT_WIDGETS).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold uppercase tracking-wide">
            <Layout size={24} weight="fill" className="text-primary" />
            Dashboard Customization
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            CONFIGURE INTERFACE MODULES // {enabledCount}/{totalCount} ACTIVE
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleEnableAll}
              variant="outline"
              size="sm"
              className="flex-1 gap-2 font-mono text-xs uppercase"
            >
              <Eye size={16} weight="bold" />
              Enable All
            </Button>
            <Button
              onClick={handleResetDefaults}
              variant="outline"
              size="sm"
              className="flex-1 gap-2 font-mono text-xs uppercase"
            >
              <Layout size={16} weight="bold" />
              Reset Defaults
            </Button>
          </div>

          <Separator />

          <ScrollArea className="h-[calc(85vh-240px)]">
            <div className="space-y-6 pr-4">
              {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
                const categoryWidgets = (widgets || DEFAULT_WIDGETS).filter(
                  w => w.category === categoryKey
                )

                return (
                  <div key={categoryKey}>
                    <h3 className={`font-mono text-sm uppercase font-semibold mb-3 ${categoryInfo.color}`}>
                      {categoryInfo.name}
                    </h3>
                    <div className="space-y-2">
                      {categoryWidgets.map((widget, index) => {
                        const Icon = ICON_MAP[widget.iconName]
                        return (
                          <motion.div
                            key={widget.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card className={`p-4 border transition-all ${
                              widget.enabled 
                                ? 'border-primary/50 bg-primary/5' 
                                : 'border-border bg-card'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className={`p-2 rounded-md ${
                                    widget.enabled 
                                      ? 'bg-primary/20 text-primary' 
                                      : 'bg-muted text-muted-foreground'
                                  }`}>
                                    {Icon && <Icon size={20} weight="fill" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold text-sm">
                                        {widget.name}
                                      </h4>
                                      {widget.enabled ? (
                                        <Eye size={14} className="text-primary" />
                                      ) : (
                                        <EyeSlash size={14} className="text-muted-foreground" />
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono">
                                      {widget.description}
                                    </p>
                                  </div>
                                </div>
                                <Switch
                                  checked={widget.enabled}
                                  onCheckedChange={() => handleToggleWidget(widget.id)}
                                  id={widget.id}
                                />
                              </div>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          <Separator />

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground font-mono">
              Changes apply immediately
            </div>
            <Button
              onClick={onClose}
              variant="default"
              className="font-mono uppercase text-sm"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
