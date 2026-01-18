<script setup lang="ts">
    import type { ContentNavigationItem } from '@nuxt/content'
import { inject, Ref } from 'vue';
    const navigation = inject<Ref<ContentNavigationItem[]>>("navigation")
</script>

<template>
    <nav>
        <RoleAwareNav highlight :navigation="navigation" />
    </nav>
</template>
