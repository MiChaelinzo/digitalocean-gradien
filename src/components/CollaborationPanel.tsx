import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/but
import { Dialog, DialogContent, DialogDescripti
import { ScrollArea } from '@/components/ui/s
import { Users, UserPlus, X, Crown, CheckCircle } from '@phosphor-icons/react'

  id: string
  email: string
  clearanceLevel: 'top-secret' | 'secret' | 'confidential' | 'unclassified'
  isOwner?: boolean

  isOpen: boolean
}
export functio
    {
      name: 'C
  clearanceLevel: 'top-secret' | 'secret' | 'confidential' | 'unclassified'
  status: 'online' | 'away' | 'offline'
  isOwner?: boolean
}

interface CollaborationPanelProps {
  isOpen: boolean
  onClose: () => void
}

    }

  con
  useEffect(() => {
      setTeamMembers((currentM
          ...member,
        }))
    }

    if (!inviteEmai
      

      toast.error('Pl
    }
    setIsInviting(true)
    setTimeout(() => {
        id: `member-${Date.now(
        email: inviteE
      
     
      setTeamMembers(
      setIsInviting(fal
    }, 1000)

    setTeamMembers((currentMembers)
  }
  con
    

      case 'confidential':
      default:


    switch (statu
        return 'bg-success'
        return 'bg-warning'
        return 'bg-m
        return 'bg-muted-foreground'
  }
  retur
     
          <DialogTitle classNa

          <DialogDescription classNa
          </DialogDescription>

          <d
     

              className="font-mono te

            
     

            </Button>

            <div class
                {teamMembers.map((mem
                    key={member.id}
                    animate={{ opacity: 1, y: 0 }}
                    classNa
                    <div className="f
                        <div className=
                         
       

                        <div className="flex-1 min-w-0">
                        
                          
                              )}
            
   

                          </div>
                          <p className="text-xs text-muted-foreground font-mono mt-1">
    toast.success('Team member removed')
  }

                            className={`mt-2 text-[10
                    
                        
                        </div>

                        <Button
                          
                          className="shrink-0 tex
      default:
                      )}
    }
  }

  const getStatusColor = (status: string) => {
              {teamMe
      case 'online':
        </div>
      case 'away':
}
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





























































































