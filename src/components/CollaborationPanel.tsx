import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Users, UserPlus, X, Crown, CheckCircle } from '@phosphor-icons/react'

import { motion, AnimatePresence } from 'framer-motion'
  name: string

  clearanceLevel: 'top
  id: string

  role: string
  onClose: () => void
  clearanceLevel: 'top-secret' | 'secret' | 'confidential' | 'unclassified'
export function Col
}

interface CollaborationPanelProps {
      status: 'on
  onClose: () => void
 

export function CollaborationPanel({ isOpen, onClose }: CollaborationPanelProps) {
  const [teamMembers, setTeamMembers] = useKV<TeamMember[]>('team-members', [
     
      id: 'member-1',
      id: 'member-3',
      role: 'Senior Intelligence Analyst',
  useEffect(() => {

      setTeamMember
      
     
          return memb
      )

  }, [isOpen, setTeamMe
  const handleInviteMember = (
      
    }
    setIsInviting(tru
    const newMember: TeamMember
      name: inviteEmail.split('@')[0].replace
      status: 'offlin
    }
    se
    s
  }
  const handleRemoveMem
    toast.success('Team member removed')

    switch (level) {
     
    
  
        return 'bg-muted text-muted-foreground'
  }

      case 'online'
      case 'away':

      default:
    }

    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogHeader>
            <Users size={24} weight="fill" className="text-primary" />
          <
            COORDINATE 
        </
       
            <

              onKeyDown={(e) => e.key ==
            />

              className="gap-2 shrin
              <UserPlus size={18} weight="bold" />
            </Button>

     

                  initi

                >
                    <div classNam
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center just
                        </div>
                        
                        />
     

                            <Crown size={16} weight="fill" className
                        </div>
                      
                        
  }

                            variant="outline" 
                          >
                          </Badge>
   

                        size="sm"
                    
                      >
                      </Button>
                  </
              ))}
          </div>
          <div className="border-t border-border pt
              
            </p>
     
   

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


















































































