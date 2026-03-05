import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, ArrowRight, Sparkle, TrendUp } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

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

export function ChatSuggestions({ lastMessage, onSuggestionClick, isLoading = false }: ChatSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (lastMessage && !isLoading) {
      generateSuggestions(lastMessage)
    }
  }, [lastMessage, isLoading])

  const generateSuggestions = async (message: string) => {
    setIsGenerating(true)

    try {
      const prompt = window.spark.llmPrompt`You are a military intelligence analyst assistant. Based on the following intelligence message, generate exactly 4 relevant follow-up suggestions that would help deepen the analysis.

Message: ${message}

Generate 4 suggestions in the following categories:
1. A tactical follow-up question (specific operational details)
2. A strategic analysis request (broader implications)
3. A related threat assessment (connected scenarios)
4. A resource/countermeasure inquiry (defensive recommendations)

Return the result as a valid JSON object with a single property called "suggestions" that contains the suggestion list. Each suggestion should have:
- text: The suggestion text (concise, under 80 characters)
- category: One of "follow-up", "related", "tactical", "strategic"
- priority: One of "high", "medium", "low"

Format: {"suggestions": [{"text": "...", "category": "tactical", "priority": "high"}, ...]}`

      const response = await window.spark.llm(prompt, "gpt-4o-mini", true)
      const data = JSON.parse(response)
      
      if (data.suggestions && Array.isArray(data.suggestions)) {
        const suggestionsWithIds = data.suggestions.slice(0, 4).map((s: any, index: number) => ({
          id: `sug-${Date.now()}-${index}`,
          text: s.text,
          category: s.category || 'follow-up',
          priority: s.priority || 'medium'
        }))
        setSuggestions(suggestionsWithIds)
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
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
        category: 'strategic',
        priority: 'medium'
      },
      {
        id: 'def-3',
        text: 'Assess regional defense posture requirements',
        category: 'related',
        priority: 'high'
      },
      {
        id: 'def-4',
        text: 'Recommend countermeasure deployment timeline',
        category: 'follow-up',
        priority: 'medium'
      }
    ]
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tactical':
        return <Lightbulb size={14} weight="fill" />
      case 'strategic':
        return <TrendUp size={14} weight="fill" />
      case 'related':
        return <Sparkle size={14} weight="fill" />
      default:
        return <ArrowRight size={14} weight="bold" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tactical':
        return 'bg-accent/10 text-accent border-accent/30'
      case 'strategic':
        return 'bg-primary/10 text-primary border-primary/30'
      case 'related':
        return 'bg-warning/10 text-warning border-warning/30'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  if (!lastMessage || isLoading || suggestions.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
            <Sparkle size={14} weight="fill" className="text-primary" />
          </div>
          <h3 className="text-sm font-semibold font-mono uppercase tracking-wide">
            Suggested Intelligence Queries
          </h3>
          {isGenerating && (
            <Badge variant="secondary" className="text-[10px] ml-auto">
              Generating...
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <AnimatePresence mode="popLayout">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto py-3 px-3 flex flex-col items-start gap-2 hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                  onClick={() => onSuggestionClick(suggestion.text)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Badge 
                      variant="secondary" 
                      className={`text-[10px] px-2 py-0.5 gap-1 ${getCategoryColor(suggestion.category)}`}
                    >
                      {getCategoryIcon(suggestion.category)}
                      {getCategoryLabel(suggestion.category)}
                    </Badge>
                    {suggestion.priority === 'high' && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 ml-auto">
                        Priority
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-start gap-2 w-full">
                    <span className="text-xs text-left leading-relaxed flex-1 group-hover:text-primary transition-colors">
                      {suggestion.text}
                    </span>
                    <ArrowRight 
                      size={14} 
                      weight="bold" 
                      className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5"
                    />
                  </div>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}
