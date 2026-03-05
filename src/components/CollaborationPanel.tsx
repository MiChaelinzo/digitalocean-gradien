import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  clearanceLevel: 'top-secret' | 'secret' | 'confidential' | 'unclassified'
  isOwner?: boolean
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
      clearanceLevel: 'top-secret',
      isOwner: true
    },
    {
      id: 'member-2',
      name: 'Marcus Rodriguez',
      role: 'Threat Assessment Specialist',
      status: 'online',
      clearanceLevel: 'secret'
    },
    {
      id: 'member-3',
      name: 'Dr. Elena Volkov',
      role: 'Strategic Intelligence Officer',
      status: 'away',
      clearanceLevel: 'top-secret'
    },
    {
      id: 'member-4',
      name: 'James Wu',
      role: 'Tactical Operations Coordinator',
      status: 'offline',
      clearanceLevel: 'secret'
    }
  ])
  
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setTeamMembers(currentMembers => 
        currentMembers.map(member => {
          if (Math.random() > 0.9 && member.status !== 'offline') {
            const statuses: Array<'online' | 'away'> = ['online', 'away']
            return { ...member, status: statuses[Math.floor(Math.random() * statuses.length)] }
          }
          return member
        })
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [isOpen, setTeamMembers])

  const handleInviteMember = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsInviting(true)

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: inviteEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      role: 'Intelligence Analyst',
      status: 'offline',
      clearanceLevel: 'confidential'
    }

    setTeamMembers(currentMembers => [...currentMembers, newMember])
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteEmail('')
    setIsInviting(false)
  }

  const handleRemoveMember = (id: string) => {
    setTeamMembers(currentMembers => currentMembers.filter(m => m.id !== id))
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
              disabled={isInviting || !inviteEmail.trim()}
              className="gap-2 shrink-0"
            >
              <UserPlus size={18} weight="bold" />
              Invite
            </Button>
          </div>

          <div className="flex-1 overflow-auto space-y-2">
            <AnimatePresence>
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="p-4 border border-border rounded-lg bg-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div 
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(member.status)}`}
                          title={member.status}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-sm">{member.name}</h4>
                          {member.isOwner && (
                            <Crown size={16} weight="fill" className="text-destructive" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">{member.role}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-[10px] uppercase font-mono ${getClearanceColor(member.clearanceLevel)}`}
                          >
                            {member.clearanceLevel.replace('-', ' ')}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className="text-[10px] uppercase font-mono"
                          >
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {!member.isOwner && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveMember(member.id)}
                        className="shrink-0"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-border pt-3 mt-3">
            <p className="text-xs text-muted-foreground font-mono uppercase text-center">
              <CheckCircle size={12} weight="fill" className="inline mr-1" />
              SECURE CHANNEL ACTIVE // {teamMembers.filter(m => m.status === 'online').length} ONLINE
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
