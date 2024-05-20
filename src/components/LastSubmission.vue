<script setup lang="ts">
import SubmissionItem from '@/components/SubmissionItem.vue'
import { useLiveStreamStore } from '@/stores/livestream'

defineProps<{
  contestId: string
}>()

const { getLastSubmission } = useLiveStreamStore()
</script>

<template>
  <TransitionGroup name="list" tag="div">
    <SubmissionItem v-for="item in getLastSubmission(contestId)" :key="item.id" :data="item" />
  </TransitionGroup>
</template>
