import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MagnifyingGlass, X, Funnel, CalendarBlank } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchFilterProps {
  onSearch: (query: string, filters: SearchFilters) => void
  onClose: () => void
}

export interface SearchFilters {
  query: string
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'all'
  type?: 'intelligence' | 'threat' | 'all'
  dateRange?: 'today' | 'week' | 'month' | 'all'
}

export function SearchFilter({ onSearch, onClose }: SearchFilterProps) {
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState<SearchFilters['severity']>('all')
  const [type, setType] = useState<SearchFilters['type']>('all')
  const [dateRange, setDateRange] = useState<SearchFilters['dateRange']>('all')

  const handleSearch = () => {
    onSearch(query, { query, severity, type, dateRange })
  }

  const handleClear = () => {
    setQuery('')
    setSeverity('all')
    setType('all')
    setDateRange('all')
    onSearch('', { query: '', severity: 'all', type: 'all', dateRange: 'all' })
  }

  const hasActiveFilters = severity !== 'all' || type !== 'all' || dateRange !== 'all' || query.length > 0

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full max-w-2xl p-6 bg-card/95 backdrop-blur-md border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MagnifyingGlass size={24} weight="bold" className="text-primary" />
                <h3 className="text-lg font-semibold uppercase tracking-wide">Advanced Search</h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">
                  Search Query
                </label>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search intelligence, threats, messages..."
                  className="font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">
                    Severity Level
                  </label>
                  <Select value={severity} onValueChange={(v) => setSeverity(v as SearchFilters['severity'])}>
                    <SelectTrigger className="font-mono text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">
                    Content Type
                  </label>
                  <Select value={type} onValueChange={(v) => setType(v as SearchFilters['type'])}>
                    <SelectTrigger className="font-mono text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="intelligence">Intelligence</SelectItem>
                      <SelectItem value="threat">Threats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">
                    Date Range
                  </label>
                  <Select value={dateRange} onValueChange={(v) => setDateRange(v as SearchFilters['dateRange'])}>
                    <SelectTrigger className="font-mono text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    <Funnel size={12} className="mr-1" />
                    Active Filters
                  </Badge>
                  {query && (
                    <Badge className="bg-primary/20 text-primary border-primary/50 font-mono text-xs">
                      Query: {query}
                    </Badge>
                  )}
                  {severity !== 'all' && (
                    <Badge className="bg-accent/20 text-accent border-accent/50 font-mono text-xs">
                      {severity?.toUpperCase()}
                    </Badge>
                  )}
                  {type !== 'all' && (
                    <Badge className="bg-primary/20 text-primary border-primary/50 font-mono text-xs">
                      {type?.toUpperCase()}
                    </Badge>
                  )}
                  {dateRange !== 'all' && (
                    <Badge className="bg-accent/20 text-accent border-accent/50 font-mono text-xs">
                      <CalendarBlank size={12} className="mr-1" />
                      {dateRange?.toUpperCase()}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSearch}
                  className="flex-1 bg-primary hover:bg-primary/90 gap-2 font-mono uppercase"
                >
                  <MagnifyingGlass size={16} weight="bold" />
                  Search
                </Button>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="gap-2 font-mono uppercase"
                  >
                    <X size={16} />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
