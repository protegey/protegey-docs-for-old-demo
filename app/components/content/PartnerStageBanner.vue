<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../../composables/useAuth'

const { partnerStage, canAccessProductionDocs } = useAuth()

const stageConfig = computed(() => {
    switch (partnerStage.value) {
        case 'sandbox':
            return {
                icon: 'i-lucide-flask-conical',
                color: 'amber',
                title: 'Sandbox Environment',
                message: 'You are currently in Sandbox mode. Complete the Integration Checklist to request Production access.'
            }
        case 'pre-production':
            return {
                icon: 'i-lucide-check-circle-2',
                color: 'blue',
                title: 'Pre-Production',
                message: 'Your integration is being reviewed. Production access is pending final approval.'
            }
        case 'live':
            return {
                icon: 'i-lucide-shield-check',
                color: 'green',
                title: 'Live Partner',
                message: 'You have full production access.'
            }
        default:
            return null
    }
})
</script>

<template>
    <div v-if="stageConfig" class="rounded-lg border p-4 mb-6"
        :class="`bg-${stageConfig.color}-50 border-${stageConfig.color}-200`">
        <div class="flex items-center gap-3">
            <div :class="stageConfig.icon" class="text-xl"
                :style="{ color: `var(--color-${stageConfig.color}-600)` }" />
            <div>
                <h4 class="font-semibold" :style="{ color: `var(--color-${stageConfig.color}-900)` }">
                    {{ stageConfig.title }}
                </h4>
                <p class="text-sm" :style="{ color: `var(--color-${stageConfig.color}-700)` }">
                    {{ stageConfig.message }}
                </p>
            </div>
            <div class="ml-auto" v-if="partnerStage === 'sandbox'">
                <NuxtLink to="/partners/operational-guides/integration-checklist"
                    class="text-xs font-medium px-3 py-1 rounded-full bg-white border shadow-sm hover:bg-gray-50">
                    View Checklist
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
