<script setup lang="ts">
import AuthLayout from '~/layouts/AuthLayout.vue'

definePageMeta({
  middleware: [],  // Disable all middleware
  layout: false,
})

const route = useRoute()
const router = useRouter()
const { setToken, fetchUser } = useAuth()

const error = ref<string | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const token = route.query.token as string
    const remember = route.query.remember === '1'

    if (!token) {
      error.value = 'No authentication token provided'
      loading.value = false
      return
    }

    // Store the token
    setToken(token, remember)

    // Fetch user data
    await fetchUser()

    // Get redirect URL from query or default to home
    const redirectUrl = (route.query.redirect as string) || '/'

    // Redirect to the original destination
    await router.push(redirectUrl)
  } catch (err: any) {
    console.error('Auth callback error:', err)
    error.value = err.message || 'Authentication failed'
    loading.value = false
  }
})
</script>

<template>
  <AuthLayout title="Completing sign in" description="Please wait while we authenticate you">
    <div class="flex flex-col items-center justify-center space-y-4 py-8">
      <div v-if="loading" class="space-y-4 text-center">
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <p class="text-sm text-muted-foreground">Completing sign in...</p>
      </div>

      <div v-else-if="error" class="space-y-4 text-center">
        <div class="text-destructive">
          <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold">Authentication Failed</h2>
          <p class="text-sm text-muted-foreground">{{ error }}</p>
        </div>
        <NuxtLink
          to="/login"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Try Again
        </NuxtLink>
      </div>
    </div>
  </AuthLayout>
</template>
