import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { Users, UserPlus, X, Crown, CheckCircle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  clearanceLevel: 'top-secret' | 'secret' | 'confidential' | 'unclassified'
  status: 'online' | 'away' | 'offline'
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
      name: 'Commander Hayes',
      email: 'hayes@defense.mil',
      role: 'Operations Director',
      clearanceLevel: 'top-secret',
      status: 'online',
      isOwner: true
    },
    {
      id: 'member-2',
      name: 'Agent Rodriguez',
      email: 'rodriguez@defense.mil',
      role: 'Field Intelligence Officer',
      clearanceLevel: 'secret',
      status: 'online'
    },
    {
      id: 'member-3',
      name: 'Dr. Chen',
      email: 'chen@defense.mil',
      role: 'Senior Intelligence Analyst',
      clearanceLevel: 'top-secret',
      status: 'away'
    }
  ])

  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTeamMembers((currentMembers) =>
        currentMembers.map((member) => ({
          ...member,
          status: Math.random() > 0.3 ? 'online' : Math.random() > 0.5 ? 'away' : 'offline'
        }))
      )
    }
  }, [isOpen, setTeamMembers])

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    if (!inviteEmail.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsInviting(true)

    setTimeout(() => {
      const newMember: TeamMember = {
        id: `member-${Date.now()}`,
        name: inviteEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        email: inviteEmail,
        role: 'Intelligence Analyst',
        clearanceLevel: 'confidential',
        status: 'offline'
      }

      setTeamMembers((currentMembers) => [...currentMembers, newMember])
      setInviteEmail('')
      setIsInviting(false)
      toast.success(`Invitation sent to ${inviteEmail}`)
    }, 1000)
  }

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers((currentMembers) => currentMembers.filter((m) => m.id !== memberId))
    toast.success('Team member removed')
  }

  const getClearanceBadgeColor = (level: string) => {
    switch (level) {
      case 'top-secret':
        return 'bg-destructive text-destructive-foreground'
      case 'secret':
        return 'bg-warning text-warning-foreground'
      case 'confidential':
        return 'bg-accent text-accent-foreground'
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

          <ScrollArea className="flex-1">
            <div className="space-y-3">
              <AnimatePresence>
                {teamMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="border border-border rounded-lg p-4 bg-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                              {member.name}
                              {member.isOwner && (
                                <Crown size={16} weight="fill" className="text-warning" />
                              )}
                            </h3>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`} />
                              <span className="text-xs text-muted-foreground capitalize">
                                {member.status}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            {member.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {member.role}
                          </p>
                          
                          <Badge 
                            className={`mt-2 text-[10px] font-mono uppercase ${getClearanceBadgeColor(member.clearanceLevel)}`}
                            variant="outline"
                          >
                            <CheckCircle size={12} weight="fill" className="mr-1" />
                            {member.clearanceLevel}
                          </Badge>
                        </div>
                      </div>

                      {!member.isOwner && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                        >
                          <X size={18} weight="bold" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <div className="border-t border-border pt-3 mt-3">
            <p className="text-xs text-muted-foreground font-mono">
              {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} // 
              {teamMembers.filter((m) => m.status === 'online').length} online
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
