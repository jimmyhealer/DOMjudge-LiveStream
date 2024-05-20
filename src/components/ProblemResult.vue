<script setup lang="ts">
import type { Submission } from '@/types'

defineProps<{
  submissions: Submission[]
}>()

const ColorStatus = {
  FirstToSolve: '#1daa1d',
  Accepted: '#60e760',
  WrongAnswer: '#e87272',
  Pending: '#6666ff',
  NotAttempted: 'white'
}

function blockColor(sR: Submission) {
  if (sR.firstToSolve) {
    return ColorStatus.FirstToSolve
  } else if (sR.solved) {
    return ColorStatus.Accepted
  } else if (sR.numPending > 0) {
    return ColorStatus.Pending
  } else if (sR.numJudged > 0) {
    return ColorStatus.WrongAnswer
  }

  return ColorStatus.NotAttempted
}

function formatSubmissionNumber(sR: Submission): string {
  if (!sR.solved) {
    return (sR.numJudged + sR.numPending).toString()
  } else if (sR.numJudged + sR.numPending - 1 === 0) {
    return ''
  } else {
    return (sR.numJudged + sR.numPending - 1).toString()
  }
}

function formatSubmissionJudged(sR: Submission) {
  return (sR.solved ? '+' : '-') + formatSubmissionNumber(sR)
}
</script>

<template>
  <div class="problem-col" style="border-bottom: 1px solid #000; height: 32px">
    <div
      v-for="probelmStatus in submissions"
      :key="probelmStatus.id"
      class="problem-result"
      :style="{ 'background-color': blockColor(probelmStatus) }"
    >
      <p v-if="probelmStatus.numJudged + probelmStatus.numPending">
        {{ formatSubmissionJudged(probelmStatus) }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.problem-result {
  width: 100%;
  margin: 2px;
  display: flex;
  border-radius: 3px;
}

p {
  margin: auto;
  line-height: 30px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  font-family: 'Courier New', Courier, monospace;
}
</style>
