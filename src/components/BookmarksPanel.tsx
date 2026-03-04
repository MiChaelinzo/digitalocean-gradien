import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bookmark, BookmarkSimple, X, Trash, Star } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface BookmarkedItem {
  id: string
  type: 'message' | 'threat' | 'intelligence'
  content: string
  title: string
  severity?: 'critical' | 'high' | 'medium' | 'low'
  timestamp: string
  tags?: string[]
}

interface BookmarksPanelProps {
  isOpen: boolean
  onClose: () => void
  onSelectBookmark: (item: BookmarkedItem) => void
}

export function BookmarksPanel({ isOpen, onClose, onSelectBookmark }: BookmarksPanelProps) {
  const [bookmarks, setBookmarks] = useKV<BookmarkedItem[]>('sentinel-bookmarks', [])
  const [filter, setFilter] = useState<'all' | 'message' | 'threat' | 'intelligence'>('all')

  const filteredBookmarks = (bookmarks || []).filter(item => 
    filter === 'all' || item.type === filter
  )

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive border-destructive/50 bg-destructive/10'
      case 'high': return 'text-warning border-warning/50 bg-warning/10'
      case 'medium': return 'text-primary border-primary/50 bg-primary/10'
      case 'low': return 'text-success border-success/50 bg-success/10'
      default: return 'text-muted-foreground'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return '💬'
      case 'threat': return '⚠️'
      case 'intelligence': return '🎯'
      default: return '📌'
    }
  }

  const handleDelete = (id: string) => {
    setBookmarks(current => (current || []).filter(item => item.id !== id))
    toast.success('Bookmark removed')
  }

  const handleClearAll = () => {
    if (bookmarks && bookmarks.length > 0) {
      setBookmarks([])
      toast.success('All bookmarks cleared')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[85vh]"
        >
          <Card className="bg-card/95 backdrop-blur-md border-primary/30">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-primary/20 border border-primary/50 flex items-center justify-center">
                  <BookmarkSimple size={20} weight="fill" className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold uppercase tracking-wide">Bookmarked Intelligence</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {filteredBookmarks.length} {filter === 'all' ? 'TOTAL' : filter.toUpperCase()} ITEMS
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {bookmarks && bookmarks.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClearAll}
                    className="gap-2 text-xs font-mono uppercase border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    <Trash size={16} />
                    Clear All
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>

            <div className="p-4 border-b border-border">
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className="font-mono text-xs uppercase"
                >
                  All ({(bookmarks || []).length})
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'message' ? 'default' : 'outline'}
                  onClick={() => setFilter('message')}
                  className="font-mono text-xs uppercase"
                >
                  💬 Messages ({(bookmarks || []).filter(b => b.type === 'message').length})
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'threat' ? 'default' : 'outline'}
                  onClick={() => setFilter('threat')}
                  className="font-mono text-xs uppercase"
                >
                  ⚠️ Threats ({(bookmarks || []).filter(b => b.type === 'threat').length})
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'intelligence' ? 'default' : 'outline'}
                  onClick={() => setFilter('intelligence')}
                  className="font-mono text-xs uppercase"
                >
                  🎯 Intel ({(bookmarks || []).filter(b => b.type === 'intelligence').length})
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-3">
                {filteredBookmarks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <BookmarkSimple size={64} weight="thin" className="text-muted-foreground mb-4" />
                    <h4 className="text-lg font-semibold mb-2">No Bookmarks Found</h4>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {filter === 'all' 
                        ? 'Start bookmarking important intelligence, threats, and messages for quick access later.'
                        : `No ${filter} bookmarks found. Try a different filter.`
                      }
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredBookmarks.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl flex-shrink-0 mt-1">
                              {getTypeIcon(item.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0" onClick={() => onSelectBookmark(item)}>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm uppercase tracking-wide mb-1">
                                    {item.title}
                                  </h4>
                                  <div className="flex flex-wrap gap-1.5 mb-2">
                                    <Badge variant="outline" className="text-[10px] font-mono uppercase">
                                      {item.type}
                                    </Badge>
                                    {item.severity && (
                                      <Badge className={`text-[10px] font-mono uppercase ${getSeverityColor(item.severity)}`}>
                                        {item.severity}
                                      </Badge>
                                    )}
                                    {item.tags && item.tags.map((tag, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-[10px] font-mono">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <Star size={16} weight="fill" className="text-primary flex-shrink-0" />
                              </div>
                              
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                                {item.content}
                              </p>
                              
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                                <span>{item.timestamp}</span>
                                <span>ID: {item.id.slice(0, 8)}</span>
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(item.id)
                              }}
                              className="h-8 w-8 p-0 flex-shrink-0 hover:bg-destructive/20 hover:text-destructive"
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </ScrollArea>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useKV<BookmarkedItem[]>('sentinel-bookmarks', [])

  const addBookmark = (item: Omit<BookmarkedItem, 'id'>) => {
    const newBookmark: BookmarkedItem = {
      ...item,
      id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    setBookmarks(current => [...(current || []), newBookmark])
    toast.success('Bookmarked successfully')
    return newBookmark.id
  }

  const removeBookmark = (id: string) => {
    setBookmarks(current => (current || []).filter(item => item.id !== id))
    toast.success('Bookmark removed')
  }

  const isBookmarked = (content: string): boolean => {
    return (bookmarks || []).some(item => item.content === content)
  }

  const toggleBookmark = (item: Omit<BookmarkedItem, 'id'>) => {
    const existing = (bookmarks || []).find(b => b.content === item.content)
    if (existing) {
      removeBookmark(existing.id)
    } else {
      addBookmark(item)
    }
  }

  return {
    bookmarks: bookmarks || [],
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark
  }
}
