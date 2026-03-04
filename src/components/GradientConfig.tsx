import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  loadGradientConfig,
  saveGradientConfig,
  clearGradientConfig,
  isGradientConfigured,
  GRADIENT_MODELS,
  DEFAULT_MODEL,
  type GradientConfig,
} from '@/lib/gradient-client'
import { toast } from 'sonner'
import { Shield, CheckCircle, Warning, Plugs, Trash } from '@phosphor-icons/react'

interface GradientConfigPanelProps {
  onClose: () => void
}

export function GradientConfigPanel({ onClose }: GradientConfigPanelProps) {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState(DEFAULT_MODEL)
  const [configured, setConfigured] = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    const config = loadGradientConfig()
    if (config) {
      setApiKey(config.apiKey)
      setModel(config.model || DEFAULT_MODEL)
      setConfigured(true)
    }
  }, [])

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('API key is required')
      return
    }

    const config: GradientConfig = {
      apiKey: apiKey.trim(),
      model,
    }
    saveGradientConfig(config)
    setConfigured(true)
    toast.success('DigitalOcean Gradient™ configured successfully')
  }

  const handleDisconnect = () => {
    clearGradientConfig()
    setApiKey('')
    setModel(DEFAULT_MODEL)
    setConfigured(false)
    toast.success('Gradient configuration cleared')
  }

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast.error('Enter an API key first')
      return
    }

    setTesting(true)
    try {
      // Temporarily save config for the test
      const config: GradientConfig = { apiKey: apiKey.trim(), model }
      saveGradientConfig(config)

      const response = await fetch('https://inference.do-ai.run/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Respond with OK' }],
          max_tokens: 5,
        }),
      })

      if (response.ok) {
        setConfigured(true)
        toast.success('Connection to DigitalOcean Gradient™ verified!')
      } else {
        const errorText = await response.text().catch(() => 'Unknown error')
        toast.error(`Connection failed: ${errorText}`)
        clearGradientConfig()
        setConfigured(false)
      }
    } catch (error) {
      toast.error(`Connection error: ${error instanceof Error ? error.message : 'Network error'}`)
      clearGradientConfig()
      setConfigured(false)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-lg w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield weight="fill" className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold tracking-wide">GRADIENT™ AI CONFIG</h2>
          </div>
          <Badge variant={configured ? 'default' : 'outline'} className="text-xs">
            {configured ? (
              <span className="flex items-center gap-1">
                <CheckCircle weight="fill" className="w-3 h-3" /> CONNECTED
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Warning weight="fill" className="w-3 h-3" /> NOT CONFIGURED
              </span>
            )}
          </Badge>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect to{' '}
            <a
              href="https://www.digitalocean.com/products/gradient/platform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              DigitalOcean Gradient™ AI Platform
            </a>{' '}
            for serverless LLM inference. Get your API key from the{' '}
            <a
              href="https://cloud.digitalocean.com/gradient"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              DigitalOcean Cloud Console
            </a>.
          </p>

          {/* API Key */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1 block">
              Model Access Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gradient API key..."
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Model Selection */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1 block">
              Inference Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {GRADIENT_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
          </div>

          {/* Provider info */}
          <div className="bg-background/50 border border-border rounded p-3 text-xs text-muted-foreground space-y-1">
            <p>• AI inference is routed through <strong>DigitalOcean Gradient™</strong> when configured.</p>
            <p>• Falls back to Spark LLM when Gradient is not connected.</p>
            <p>• Your API key is stored locally in your browser only.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="flex gap-2">
            {configured && (
              <Button variant="destructive" size="sm" onClick={handleDisconnect}>
                <Trash className="w-4 h-4 mr-1" /> Disconnect
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" size="sm" onClick={handleTest} disabled={testing || !apiKey.trim()}>
              <Plugs className="w-4 h-4 mr-1" />
              {testing ? 'Testing...' : 'Test'}
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!apiKey.trim()}>
              Save Config
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Small indicator badge showing current AI provider status. */
export function GradientStatusBadge() {
  const connected = isGradientConfigured()
  return (
    <Badge
      variant={connected ? 'default' : 'secondary'}
      className="text-[10px] font-mono tracking-wider cursor-default"
    >
      {connected ? '⚡ GRADIENT™' : '○ SPARK'}
    </Badge>
  )
}
