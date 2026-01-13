<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const { isPartner, isInternal } = useAuth()

const badges = computed(() => {
    const list = []
    if (isInternal.value) {
        list.push({ label: 'Internal', color: 'red-100', text: 'red-800' })
    } else if (isPartner.value) {
        list.push({ label: 'Partner', color: 'blue-100', text: 'blue-800' })
    } else {
        list.push({ label: 'Public', color: 'gray-100', text: 'gray-800' })
    }
    return list
})
</script>

<template>
    <div class="flex gap-2">
        <span v-for="badge in badges" :key="badge.label"
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            :class="`bg-${badge.color} text-${badge.text}`">
            {{ badge.label }}
        </span>
    </div>
</template>
