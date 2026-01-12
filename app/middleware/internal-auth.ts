export default defineNuxtRouteMiddleware((to) => {
    const { canAccessInternalDocs, isAuthenticated } = useAuth()

    // Check if accessing internal documentation
    if (to.path.startsWith('/internal')) {
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
