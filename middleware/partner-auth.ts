export default defineNuxtRouteMiddleware((to) => {
    const { canAccessPartnerDocs, isAuthenticated } = useAuth()

    // Check if accessing partner documentation
    if (to.path.startsWith('/partners')) {
        if (!isAuthenticated.value) {
            // Redirect to login with return URL
            return navigateTo({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        }

        if (!canAccessPartnerDocs.value) {
            // User is authenticated but not a partner
            return abortNavigation({
                statusCode: 403,
                message: 'Access to partner documentation requires partner status'
            })
        }
    }
})
