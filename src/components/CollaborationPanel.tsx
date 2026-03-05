import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, UserPlus, X, Crown, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface TeamMember {
  id: string
  name: string
  role: string
  status: 'online' | 'offline' | 'away'
  lastActive: string
  clearanceLevel: 'top-secret' | 'secret' | 'confidential'
}

interface CollaborationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function CollaborationPanel({ isOpen, onClose }: CollaborationPanelProps) {
  const [teamMembers, setTeamMembers] = useKV<TeamMember[]>('team-members', [])
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
              className="gap-2 font-mono uppercase text-xs"
            >
              <UserPlus size={18} weight="bold" />
              Invite
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-4">
              <AnimatePresence>
                {(teamMembers || []).map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="border border-border rounded-lg p-4 bg-card hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12 border-2 border-primary">
                          <AvatarFallback className="bg-primary/20 text-primary font-bold font-mono">
                            {member.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(member.status)}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground truncate">
                            {member.name}
                          </h4>
                          {member.role === 'Commander' && (
                            <Crown size={16} weight="fill" className="text-warning" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mb-2">
                          {member.role} • Last active {member.lastActive}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`${getClearanceColor(member.clearanceLevel)} text-[10px] font-mono uppercase`}
                          >
                            {member.clearanceLevel.replace('-', ' ')}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono uppercase"
                          >
                            {member.status}
                          </Badge>
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

              {(!teamMembers || teamMembers.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="font-mono text-sm">NO TEAM MEMBERS</p>
                  <p className="font-mono text-xs mt-2">Invite analysts to collaborate</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary font-mono">
                  {(teamMembers || []).filter(m => m.status === 'online').length}
                </div>
                <div className="text-xs text-muted-foreground font-mono uppercase">
                  Online
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning font-mono">
                  {(teamMembers || []).filter(m => m.clearanceLevel === 'top-secret').length}
                </div>
                <div className="text-xs text-muted-foreground font-mono uppercase">
                  Top Secret
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground font-mono">
                  {(teamMembers || []).length}
                </div>
                <div className="text-xs text-muted-foreground font-mono uppercase">
                  Total
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
