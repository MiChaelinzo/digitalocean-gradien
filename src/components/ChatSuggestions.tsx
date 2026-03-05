import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkle, Lightbulb, TrendUp, ArrowRight } from '@phosphor-icons/react'

interface Suggestion {
  id: string
  text: string
  category: 'follow-up' | 'related' | 'tactical' | 'strategic'
  priority: 'high' | 'medium' | 'low'
}

interface ChatSuggestionsProps {
  lastMessage?: string
  onSuggestionClick: (suggestion: string) => void
  isLoading?: boolean
}

export function ChatSuggestions({ lastMessage, onSuggestionClick, isLoading }: ChatSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (lastMessage && !isLoading) {
      generateSuggestions()
    } else {
      setSuggestions(getDefaultSuggestions())
    }
  }, [lastMessage, isLoading])

  const generateSuggestions = async () => {
    if (!lastMessage) return

    setIsGenerating(true)
    try {
      const prompt = window.spark.llmPrompt`Based on this intelligence response: "${lastMessage}"

Generate exactly 4 contextual follow-up suggestions. Each suggestion should be:
1. A tactical follow-up question (directly related to the response)
2. A strategic analysis request (broader implications)
3. A related threat assessment (connected scenario)
4. A specific countermeasure inquiry (defensive actions)

Return as JSON with this format:
{
  "suggestions": [
    {
      "id": "unique-id",
      "text": "suggestion text here",
      "category": "follow-up" | "strategic" | "related" | "tactical",
      "priority": "high" | "medium" | "low"
    }
  ]
}

Make suggestions specific, actionable, and military-focused.`

      const response = await window.spark.llm(prompt, "gpt-4o-mini", true)
      const data = JSON.parse(response)
      
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions.map((s: any) => ({
          id: s.id || `sug-${Date.now()}-${Math.random()}`,
          text: s.text,
          category: s.category || 'follow-up',
          priority: s.priority || 'medium'
        })))
      } else {
        setSuggestions(getDefaultSuggestions())
      }
    } catch (error) {
      console.error('Error generating suggestions:', error)
      setSuggestions(getDefaultSuggestions())
    } finally {
      setIsGenerating(false)
    }
  }

  const getDefaultSuggestions = (): Suggestion[] => {
    return [
      {
        id: 'def-1',
        text: 'Analyze threat probability over next 48 hours',
        category: 'tactical',
        priority: 'high'
      },
      {
        id: 'def-2',
        text: 'Compare with historical conflict patterns',
        category: 'related',
        priority: 'medium'
      },
      {
        id: 'def-3',
        text: 'Assess strategic implications for regional stability',
        category: 'strategic',
        priority: 'high'
      },
      {
        id: 'def-4',
        text: 'Recommend countermeasure deployment timeline',
        category: 'tactical',
        priority: 'medium'
      }
    ]
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'follow-up':
        return <Lightbulb size={14} weight="fill" />
      case 'strategic':
        return <TrendUp size={14} weight="fill" />
      case 'related':
        return <Sparkle size={14} weight="fill" />
      case 'tactical':
        return <ArrowRight size={14} weight="fill" />
      default:
        return <Lightbulb size={14} weight="fill" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'follow-up':
        return 'bg-accent/20 text-accent-foreground'
      case 'strategic':
        return 'bg-primary/20 text-primary'
      case 'related':
        return 'bg-warning/20 text-warning-foreground'
      case 'tactical':
        return 'bg-success/20 text-success-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  if (suggestions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 bg-card/50 border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <Sparkle size={14} weight="fill" className="text-primary" />
          <h3 className="text-sm font-semibold font-mono uppercase tracking-wide">
            Suggested Follow-ups
          </h3>
          {isGenerating && (
            <Badge variant="outline" className="text-xs">
              Generating...
            </Badge>
          )}
        </div>
        <div className="grid gap-2">
          <AnimatePresence>
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-3 hover:bg-primary/10 hover:border-primary/50 transition-all"
                  onClick={() => onSuggestionClick(suggestion.text)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div className={`mt-0.5 ${getCategoryColor(suggestion.category)}`}>
                      {getCategoryIcon(suggestion.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">
                        {suggestion.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge 
                          variant="secondary" 
                          className={`text-[10px] uppercase font-mono ${getCategoryColor(suggestion.category)}`}
                        >
                          {suggestion.category}
                        </Badge>
                        {suggestion.priority === 'high' && (
                          <Badge variant="destructive" className="text-[10px] uppercase font-mono">
                            Priority
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 text-center font-mono uppercase tracking-wide">
          Click any suggestion to explore further
        </p>
      </Card>
    </motion.div>
  )
}
