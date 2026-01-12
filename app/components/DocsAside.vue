<script setup lang="ts">
const { tree } = useContent()
const { navigation } = useContent()
</script>

<template>
    <nav>
        <RoleAwareNav />
    </nav>
</template>
