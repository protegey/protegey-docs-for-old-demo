<script setup lang="ts">
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
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full text-center space-y-4">
      <div v-if="loading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 dark:text-gray-400">Completing sign in...</p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div class="text-red-600 dark:text-red-400">
          <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Authentication Failed</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ error }}</p>
        <a
          href="/login"
          class="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </a>
      </div>
    </div>
  </div>
</template>
