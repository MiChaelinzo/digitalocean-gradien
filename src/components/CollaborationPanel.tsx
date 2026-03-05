import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users, UserPlus, X, Crown, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface TeamMember {
  id: string
  name: string
  role: string
  status: 'online' | 'away' | 'offline'
  lastActive: string
  clearanceLevel: 'top-secret' | 'secret' | 'confidential'
}

interface CollaborationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function CollaborationPanel({ isOpen, onClose }: CollaborationPanelProps) {
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Connor',
      role: 'Operations Lead',
      status: 'online',
      lastActive: 'Now',
      clearanceLevel: 'top-secret'
    },
    {
      id: '2',
      name: 'Dr. K. Wallace',
      role: 'Biotech Specialist',
      status: 'away',
      lastActive: '10:42',
      clearanceLevel: 'secret'
    }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setTeamMembers(current => {
        if (!current || current.length === 0) return current
        return current.map(member => ({
          ...member,
          lastActive: member.status === 'online' 
            ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
            : member.lastActive
        }))
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsInviting(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      role: 'Intelligence Analyst',
      status: 'offline',
      lastActive: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      clearanceLevel: 'confidential'
    }

    setTeamMembers(current => [...(current || []), newMember])
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteEmail('')
    setIsInviting(false)
  }

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(current => current.filter(m => m.id !== memberId))
    toast.success('Team member removed')
  }

  const getClearanceColor = (level: string) => {
    switch (level) {
      case 'top-secret':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'secret':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'confidential':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-slate-500'
      default:
        return 'bg-slate-500'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-md border-primary/20">
        <DialogHeader className="p-6 pb-2 border-b border-border/50">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold uppercase tracking-wide">
            <Users size={24} weight="fill" className="text-primary" />
            Team Collaboration
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-primary/70">
            COORDINATE WITH INTELLIGENCE TEAM // REAL-TIME COLLABORATION
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col p-6 pt-4 space-y-6">
          {/* Invite Section */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Invite Agent</label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                <Input
                  placeholder="agent.name@agency.mil"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInviteMember()}
                  className="pl-9 font-mono text-sm bg-muted/30"
                />
              </div>
            </div>
            <Button 
              onClick={handleInviteMember} 
              disabled={isInviting || !inviteEmail}
              className="bg-primary hover:bg-primary/90 min-w-[100px]"
            >
              {isInviting ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  <UserPlus className="mr-2" size={18} />
                  Invite
                </>
              )}
            </Button>
          </div>

          {/* Team List */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Personnel</h3>
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                {teamMembers.length} ACTIVE
              </span>
            </div>
            
            <ScrollArea className="flex-1 -mr-4 pr-4">
              <div className="space-y-3 pb-4">
                <AnimatePresence mode="popLayout">
                  {teamMembers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users size={32} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No active team members.</p>
                    </div>
                  ) : (
                    teamMembers.map((member) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:border-primary/30 hover:bg-muted/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground border border-border">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{member.name}</span>
                              {member.role.includes('Lead') && (
                                <Crown size={14} weight="fill" className="text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{member.role}</span>
                              <span>•</span>
                              <span className="font-mono">{member.lastActive}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${getClearanceColor(member.clearanceLevel)}`}>
                            {member.clearanceLevel}
                          </span>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}