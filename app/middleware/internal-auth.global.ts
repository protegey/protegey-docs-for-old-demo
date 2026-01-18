export default defineNuxtRouteMiddleware((to) => {
    const { canAccessInternalDocs, isAuthenticated } = useAuth()

    // Helper to check if path starts with a prefix, accounting for locales
    const matchesPath = (path: string, prefix: string) => {
        const locales = ['en', 'fr', 'ar']
        const cleanPath = path.replace(new RegExp(`^/(${locales.join('|')})`), '')
        return cleanPath.startsWith(prefix)
    }

    // Check if accessing internal documentation
    if (matchesPath(to.path, '/internal')) {
        if (!isAuthenticated.value) {
            // Redirect to login with return URL
            return navigateTo({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        }

        if (!canAccessInternalDocs.value) {
            // User is authenticated but not internal team
            return abortNavigation({
                statusCode: 403,
                message: 'Access to internal documentation is restricted to Protegey team members'
            })
        }
    }
})
