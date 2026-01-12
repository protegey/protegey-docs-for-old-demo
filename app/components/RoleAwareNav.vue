<script setup lang="ts">
const { navigation } = useContent()
const {
    isAuthenticated,
    isInternal,
    canAccessPartnerDocs,
    canAccessSandboxDocs,
    canAccessProductionDocs,
    canAccessApiReference,
    canAccessOperationalGuides
} = useAuth()

const filteredNavigation = computed(() => {
    if (!navigation.value) return []

    return filterTree(navigation.value)
})

function filterTree(nodes: any[]) {
    return nodes.filter(node => {
        // 1. Root Level Checks
        if (node._path === '/partners' && !canAccessPartnerDocs.value) return false
        if (node._path === '/internal' && !isInternal.value) return false

        // 2. Partner Sub-sections
        if (node._path.includes('/partners/')) {
            // Sandbox
            if (node._path.includes('/sandbox') && !canAccessSandboxDocs.value) return false

            // Production
            if (node._path.includes('/production') && !canAccessProductionDocs.value) return false

            // API Reference
            if (node._path.includes('/api-reference') && !canAccessApiReference.value) return false

            // Operational Guides
            if (node._path.includes('/operational-guides') && !canAccessOperationalGuides.value) return false
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
        <DocsAsideTree :links="filteredNavigation" />
    </nav>
</template>
