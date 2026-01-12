import type { User, AuthState } from '~/types/auth'

export const useAuth = () => {
    const user = useState<User | null>('auth:user', () => null)
    const token = useState<string | null>('auth:token', () => null)

    const isAuthenticated = computed(() => !!user.value && !!token.value)
    const isPartner = computed(() => user.value?.isPartner ?? false)
    const isInternal = computed(() => user.value?.isInternal ?? false)

    const hasRole = (role: string): boolean => {
        if (!user.value) return false
        return user.value.roles.includes(role as any)
    }

    const canAccessPartnerDocs = computed(() => {
        return isPartner.value || isInternal.value
    })

    const canAccessInternalDocs = computed(() => {
        return isInternal.value
    })

    const login = async (email: string, password: string) => {
        const config = useRuntimeConfig()

        try {
            const response = await $fetch<{ user: User; token: string }>(`${config.public.apiBase}/api/v1/auth/login`, {
                method: 'POST',
                body: { email, password }
            })

            user.value = response.user
            token.value = response.token

            // Store token in cookie for persistence
            const tokenCookie = useCookie('protegey_auth_token', {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                secure: true,
                sameSite: 'strict'
            })
            tokenCookie.value = response.token

            return { success: true }
        } catch (error: any) {
            return {
                success: false,
                error: error.data?.message || 'Authentication failed'
            }
        }
    }

    const logout = () => {
        user.value = null
        token.value = null

        const tokenCookie = useCookie('protegey_auth_token')
        tokenCookie.value = null
    }

    const fetchUser = async () => {
        const config = useRuntimeConfig()
        const tokenCookie = useCookie('protegey_auth_token')

        if (!tokenCookie.value) {
            return
        }

        try {
            const response = await $fetch<{ user: User }>(`${config.public.apiBase}/api/v1/auth/me`, {
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })

            user.value = response.user
            token.value = tokenCookie.value
        } catch (error) {
            // Token invalid, clear it
            logout()
        }
    }

    return {
        user: readonly(user),
        token: readonly(token),
        isAuthenticated,
        isPartner,
        isInternal,
        hasRole,
        canAccessPartnerDocs,
        canAccessInternalDocs,
        login,
        logout,
        fetchUser
    }
}
