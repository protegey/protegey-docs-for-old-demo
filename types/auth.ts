export interface User {
    id: string
    email: string
    name: string
    roles: UserRole[]
    isPartner: boolean
    isInternal: boolean
    partnerTier?: 'sandbox' | 'starter' | 'professional' | 'enterprise'
}

export type UserRole = 'public' | 'partner:sandbox' | 'partner:production' | 'internal'

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
}
