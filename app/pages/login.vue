<script setup lang="ts">
import AuthLayout from '~/layouts/AuthLayout.vue'
import { ArrowRight } from 'lucide-vue-next'

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
  <AuthLayout title="Welcome back" description="Sign in to access partner documentation">
    <div class="grid gap-6">
      <button
        class="w-full inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        @click="redirectToLogin">
        Sign in with Partner Account
        <ArrowRight class="ml-2 h-4 w-4" />
      </button>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-muted-foreground">
            Protected by Protegey
          </span>
        </div>
      </div>

      <div class="text-center">
        <p class="text-xs text-muted-foreground">
          Don't have a partner account?
          <a href="mailto:partners@protegey.com" class="text-primary hover:underline">
            Contact us
          </a>
        </p>
      </div>

      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-primary hover:underline">
          ← Back to public documentation
        </NuxtLink>
      </div>
    </div>
  </AuthLayout>
</template>
