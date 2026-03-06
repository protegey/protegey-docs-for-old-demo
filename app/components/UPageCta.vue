<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  card?: boolean
  variant?: string
  orientation?: string
  reverse?: boolean
  links?: Array<Record<string, unknown>>
  title?: string
  description?: string
  ui?: Record<string, unknown>
}>()

const ctaProps = computed(() => ({
  variant: props.variant,
  orientation: props.orientation,
  reverse: props.reverse,
  links: props.links,
  title: props.title,
  description: props.description,
  ui: props.ui,
}))
</script>

<template>
  <UPageCTA v-bind="ctaProps">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
  </UPageCTA>
</template>
