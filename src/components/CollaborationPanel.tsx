import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, UserPlus, X, Crown, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'

interface TeamMember {
  id: string
  name: string
  role: string
  status: 'online' | 'away' | 'offline'
  lastActive: string
  clearanceLevel: 'top-secret' | 'secret' | 'confidential' | 'unclassified'
}

interface CollaborationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function CollaborationPanel({ isOpen, onClose }: CollaborationPanelProps) {
  const [teamMembers, setTeamMembers] = useKV<TeamMember[]>('team-members', [
    {
      id: 'member-1',
      name: 'Sarah Chen',
      role: 'Senior Intelligence Analyst',
      status: 'online',
      lastActive: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      clearanceLevel: 'top-secret'
    },
    {
      id: 'member-2',
      name: 'Marcus Rodriguez',
      role: 'Threat Assessment Lead',
      status: 'online',
      lastActive: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      clearanceLevel: 'secret'
    },
    {
      id: 'member-3',
      name: 'Emily Johnson',
      role: 'Intelligence Analyst',
      status: 'away',
      lastActive: '14:23',
      clearanceLevel: 'confidential'
    }
  ])
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)

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
    setTeamMembers(current => (current || []).filter(m => m.id !== memberId))
    toast.success('Team member removed')
  }

  const getClearanceColor = (level: string) => {
    switch (level) {
      case 'top-secret':
        return 'bg-destructive text-destructive-foreground'
      case 'secret':
        return 'bg-warning text-warning-foreground'
      case 'confidential':
        return 'bg-primary text-primary-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-success'
      case 'away':
        return 'bg-warning'
      case 'offline':
        return 'bg-muted-foreground'
      default:
        return 'bg-muted-foreground'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold uppercase tracking-wide">
            <Users size={24} weight="fill" className="text-primary" />
            Team Collaboration
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            COORDINATE WITH INTELLIGENCE TEAM // REAL-TIME COLLABORATION
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex gap-2">
            <Input
              placeholder="analyst@defense.mil"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInviteMember()}
              className="font-mono text-sm"
            />
            <Button
              onClick={handleInviteMember}
              disabled={isInviting}
              className="gap-2"
            >
              <UserPlus size={18} weight="bold" />
              Invite
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-3 pr-4">
              <AnimatePresence>
                {(teamMembers || []).map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="border border-border rounded-lg p-4 bg-card/50 backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base">{member.name}</h3>
                          {member.clearanceLevel === 'top-secret' && (
                            <Crown size={16} weight="fill" className="text-destructive" />
                          )}
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`} />
                            <span className="text-xs text-muted-foreground capitalize">
                              {member.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant="secondary" 
                            className={`text-[10px] font-mono uppercase ${getClearanceColor(member.clearanceLevel)}`}
                          >
                            {member.clearanceLevel.replace('-', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">
                            Last active: {member.lastActive}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <CheckCircle size={16} weight="fill" className="text-success" />
              <span>SECURE CHANNEL ACTIVE // {(teamMembers || []).length} TEAM MEMBERS</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
