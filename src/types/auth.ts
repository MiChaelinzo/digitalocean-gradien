export interface User {
  id: string
  email: string
  fullName: string
  organization?: string
  role: 'analyst' | 'commander' | 'operator' | 'admin'
  clearanceLevel: 'confidential' | 'secret' | 'top-secret'
  createdAt: string
  lastLogin?: string
  avatarUrl?: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  hasCompletedOnboarding: boolean
}
