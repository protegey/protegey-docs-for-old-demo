<script setup lang="ts">
definePageMeta({
  middleware: [],  // Disable all middleware to prevent loops
  layout: false,
})

const config = useRuntimeConfig()
const route = useRoute()

const redirectToLogin = () => {
  // Get the redirect URL from query params or default to docs home
  const returnUrl = (route.query.redirect as string) || window.location.origin
  
  // Redirect to Laravel login page with return URL pointing to docs site
  const loginUrl = `${config.public.apiBase}/auth/partner/login?redirect_url=${encodeURIComponent(returnUrl)}`
  window.location.href = loginUrl
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Protegey Documentation
        </h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sign in to access partner documentation
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <div class="space-y-6">
          <button
            @click="redirectToLogin"
            class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sign in with Partner Account
            <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Protected by Protegey
              </span>
            </div>
          </div>

          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Don't have a partner account?
              <a href="mailto:partners@protegey.com" class="text-blue-600 hover:text-blue-500">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>

      <div class="text-center">
        <a href="/" class="text-sm text-blue-600 hover:text-blue-500">
          ← Back to public documentation
        </a>
      </div>
    </div>
  </div>
</template>
