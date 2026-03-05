import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeade
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scr
import { Users, UserPlus, X, Crown, CheckCirc
import { motion, AnimatePresence } from 'fram
interface TeamMember {
  name: string
import { Users, UserPlus, X, Crown, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface TeamMember {
  id: string
  name: string
  role: string
    const interval = setInterval(() => 
        if (!current
          ...member,
 

    }, 30000)
    return () => 

 


      toast.error('Please enter a valid email address')
    }
    setIsInviting(true)

      name: inviteE
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
        return 'bg-succe
      lastActive: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      clearanceLevel: 'confidential'
    }

    setTeamMembers(current => [...(current || []), newMember])
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteEmail('')
    setIsInviting(false)
  }

  const handleRemoveMember = (memberId: string) => {
          <DialogDescription className="font-mono text-xs">
    toast.success('Team member removed')
   

  const getClearanceColor = (level: string) => {
    switch (level) {
      case 'top-secret':
        return 'bg-destructive text-destructive-foreground'
      case 'secret':
        return 'bg-warning text-warning-foreground'
      case 'confidential':
        return 'bg-primary text-primary-foreground'
            >
        return 'bg-muted text-muted-foreground'
     
  }

  const getStatusColor = (status: string) => {
                {(tea
      case 'online':
                    initial
      case 'away':
                    classNa
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





















































































































