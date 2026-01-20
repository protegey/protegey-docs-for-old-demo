<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const props = defineProps<{
    navigation?: any[]
    highlight?: boolean
}>()

const injectedNavigation = inject<Ref<any[] | undefined>>('navigation')
const navigation = computed(() => props.navigation || injectedNavigation?.value || [])
const {
    isAuthenticated,
    isInternal,
    canAccessPartnerDocs,
    canAccessSandboxDocs,
    canAccessProductionDocs,
    canAccessApiReference,
    canAccessOperationalGuides
} = useAuth()

// Helper to check if path matches a prefix, accounting for locales
const matchesPath = (path: string, prefix: string) => {
    const locales = ['en', 'fr', 'ar']
    const cleanPath = path.replace(new RegExp(`^/(${locales.join('|')})`), '')
    return cleanPath.startsWith(prefix)
}

const filteredNavigation = computed(() => {
    if (!navigation.value) return []

    return filterTree(navigation.value)
})

function filterTree(nodes: any[]) {
    return nodes.filter(node => {
        const path = node._path || ''

        // 1. Root Level Checks
        if (matchesPath(path, '/partners') && !canAccessPartnerDocs.value) return false
        if (matchesPath(path, '/internal') && !isInternal.value) return false

        // 2. Partner Sub-sections
        if (matchesPath(path, '/partners/')) {
            // Sandbox
            if (path.includes('/sandbox') && !canAccessSandboxDocs.value) return false

            // Production
            if (path.includes('/production') && !canAccessProductionDocs.value) return false

            // API Reference
            if (path.includes('/api-reference') && !canAccessApiReference.value) return false

            // Operational Guides
            if (path.includes('/operational-guides') && !canAccessOperationalGuides.value) return false
        }

        return true
    }).map(node => {
        // Recursively filter children
        if (node.children) {
            return { ...node, children: filterTree(node.children) }
        }
        return node
    })
}
</script>

<template>
    <nav class="space-y-1">
        <UContentNavigation :navigation="filteredNavigation" />
    </nav>
</template>
