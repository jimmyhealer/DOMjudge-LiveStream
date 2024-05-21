<script setup lang="ts">
import SubmissionItem from '@/components/SubmissionItem.vue'
import { useLiveStreamStore } from '@/stores/livestream'
import { useElementSize } from '@vueuse/core'
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  contestId: string
}>()

const { getLastSubmission, getContestDetail } = useLiveStreamStore()

function displayContestName(name: string) {
  return name.split('-').at(-1)
}

const itemHeight = 28
const lastSubmission = ref()
const lastSubmissionEl = ref(null)
const { height } = useElementSize(lastSubmissionEl)

watchEffect(() => {
  const result = getLastSubmission(props.contestId)
  const itemCount = Math.floor(height.value / itemHeight)
  lastSubmission.value = result.slice(Math.max(result.length - itemCount, 0), result.length)
})
</script>

<template>
  <div style="display: flex; justify-content: space-between">
    <p style="font-size: 24px; line-height: 36px; vertical-align: middle">Queue</p>
    <p style="font-size: 20px; line-height: 36px; vertical-align: middle">
      {{ displayContestName(getContestDetail(contestId).shortName) }}
    </p>
  </div>
  <div
    style="height: 100%; display: flex; flex-direction: column; justify-content: end"
    ref="lastSubmissionEl"
  >
    <TransitionGroup name="list" tag="div">
      <SubmissionItem v-for="item in lastSubmission" :key="item.id" :data="item" />
    </TransitionGroup>
  </div>
</template>
