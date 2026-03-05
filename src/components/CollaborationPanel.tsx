import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/butto
import { Users, UserPlus, X, Crown, CheckCircle } from '
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, UserPlus, X, Crown, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'

interface TeamMember {
}
  name: string
  isOpen: bool
  status: 'online' | 'away' | 'offline'

  clearanceLevel: 'top-secret' | 'secret' | 'confidential' | 'unclassified'
 

interface CollaborationPanelProps {
  isOpen: boolean
      clearanceLevel:
}

export function CollaborationPanel({ isOpen, onClose }: CollaborationPanelProps) {
  const [teamMembers, setTeamMembers] = useKV<TeamMember[]>('team-members', [
    {
      id: 'member-1',
      name: 'Sarah Chen',
      role: 'Senior Intelligence Analyst',
      status: 'online',
        }))
    }, 30000)
    re

    if (!inviteEmail.
      return

      toast.error('Plea
    }
    setIsInviting(true)
    co
     
      status: 'offlin
      clearanceLevel: 'confi

    toast.success(`In
    setIsInviting(false)

    s
  }
  const getClearanceColor = (level: string) => {
      case 'top-secret':

      case 'confide
      default:
    }

    switch (status) {
        return 'bg-s
        return 'bg-warning'
        return 'bg-muted-foreground'
        return 'bg-muted-foregr
  }
  return
      <Dialog

            Team Collaboration
        


          <div className="flex
              placeholder="analyst@defense.mil"
            
     

              disabled={isInviting}
            >
            
     

              <AnimateP

                    initial={{ opac
                    exit={{ opaci
                  >
                      <div classNam
                        
                            <Crown size={16} weight="fill" className="text-destructive" />
                          <div class
     

                        </div>
                        <div className="flex items-cen
                      
                        
   

                        </div>
                      <Button
                        size="sm"
   

                    </div>
                ))}
            </div>

            <div cla
              <span>SECURE CHANNEL ACTIVE // {(team
          </div>
      </DialogContent>
  )




  const getStatusColor = (status: string) => {

      case 'online':

      case 'away':

      case 'offline':
        return 'bg-muted-foreground'
      default:
        return 'bg-muted-foreground'
    }
  }


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










































































