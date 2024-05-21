<script setup lang="ts">
import SubmissionItem from '@/components/SubmissionItem.vue'
import { useLiveStreamStore } from '@/stores/livestream'

defineProps<{
  contestId: string
}>()

const { getLastSubmission, getContestDetail } = useLiveStreamStore()

function displayContestName(name: string) {
  return name.split('-').at(-1)
}
</script>

<template>
  <div style="display: flex; justify-content: space-between">
    <p style="font-size: 24px; line-height: 36px; vertical-align: middle">Queue</p>
    <p style="font-size: 20px; line-height: 36px; vertical-align: middle">
      {{ displayContestName(getContestDetail(contestId).shortName) }}
    </p>
  </div>
  <TransitionGroup name="list" tag="div">
    <SubmissionItem v-for="item in getLastSubmission(contestId)" :key="item.id" :data="item" />
  </TransitionGroup>
</template>
