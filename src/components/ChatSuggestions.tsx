import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badg
import { motion, AnimatePresence } from 'fram
interface Suggestion {
  text: string


  id: string
  text: string
  category: 'follow-up' | 'related' | 'tactical' | 'strategic'
  priority: 'high' | 'medium' | 'low'
}

interface ChatSuggestionsProps {
  lastMessage?: string

    if (lastMessage &
 

    setIsGenerating(true)
    try {


1. A tactical follo
3. A related threat assessment (conn

- tex
- priority: One of "high", "me

      const response = await window.spark.llm(prompt, "gpt
      

         
          priority: s.priority || 'medium'

    } catch (error)

      setIsGenerating(false)
  }
  const getDefaultSuggestions = (): Suggestion[] => {
      {
        text: 'Analyze threat probability over next 48 hours',

      {
        text: 'Compare with historical conflict patterns',
        priority: 'medium'
      {

        priority: 'high'

        text: 'Recommend countermeasure deployment timeline',
        priority: 'medium'
    ]

    switch (category) {
        return <Lightbulb size={14} weight=
        return <TrendUp
        return <Sparkle size={14} weight="fill
        return <ArrowRight size={14} weigh
  }
  const getCategoryColor = (category: stri
      c
      case 'strategic
      case 'related':
      default:
    }

    r



    <motion.
      a
    >
        <div className="flex items-center gap-2 mb-3">
            <Sparkle size={14
          <h3 className=
        
       
            </Badge>
        </div>
        <div className="grid g
            {suggestions.m
        
       
                tran
                <Button
                  className=
                >
        
       
                    
                    </Badge>
                      <Badge v
                      </Ba
       
     
   

                      className="text-muted-foreg
                  </div
              </motion
          </AnimatePresence>
      </Card>
  )

































































































