<script setup lang="ts">
import type { Submission } from '@/types'

import SubmissionItem from '@/components/SubmissionItem.vue'

defineProps<{
  submissions: Submission[] | undefined
}>()
</script>

<template>
  <template v-if="submissions">
    <TransitionGroup name="list" tag="div">
      <SubmissionItem v-for="item in submissions" :key="item.id" :data="item" />
    </TransitionGroup>
  </template>
</template>
