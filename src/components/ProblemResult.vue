<script setup lang="ts">
import type { SubmissionResult } from '@/types'

defineProps<{
  submissions: SubmissionResult[]
}>()

const ColorStatus = {
  FirstBlood: '#1daa1d',
  Accepted: '#60e760',
  WrongAnswer: '#e87272',
  Pending: '#6666ff',
  NotAttempted: 'white'
}

function blockColor(sR: SubmissionResult) {
  if (sR.firstToSolve) {
    return ColorStatus.FirstBlood
  } else if (sR.penalty !== undefined) {
    return ColorStatus.Accepted
  } else if (sR.numPending > 0) {
    return ColorStatus.Pending
  } else if (sR.numJudged > 0) {
    return ColorStatus.WrongAnswer
  }

  return ColorStatus.NotAttempted
}

function pluralizeTry(n: number) {
  return n === 1 ? 'try' : 'tries'
}
</script>

<template>
  <div class="problem-col" style="border-bottom: 1px solid #000; height: 53px">
    <div
      v-for="problem in submissions"
      :key="problem.id"
      class="problem-result"
      :style="{ 'background-color': blockColor(problem) }"
    >
      <p style="font-size: 20px; font-weight: 600">{{ problem.penalty ?? '' }}</p>
      <p v-show="problem.numJudged > 0 || problem.numPending > 0">
        {{ problem.numJudged }}
        {{ problem.numPending > 0 ? '+ ' + problem.numPending : '' }}
        {{ pluralizeTry(problem.numJudged + problem.numPending) }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.problem-result {
  width: 100%;
  margin: 2px;
}

p {
  height: 24px;
  line-height: 24px;
  text-align: center;
}
</style>
