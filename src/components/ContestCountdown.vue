<script setup lang="ts">
import { useLiveStreamStore } from '@/stores/livestream'
import { computed, ref } from 'vue'

const props = defineProps<{
  contestId: string
}>()

const { getContestDetail } = useLiveStreamStore()
const contestDetail = ref(getContestDetail(props.contestId))
const showCountdown = computed(() => new Date() < contestDetail.value?.startTime)
const contestName = computed(() => contestDetail.value?.name)
const contestStartTime = computed(() => contestDetail.value?.startTime)
</script>

<template>
  <template v-if="showCountdown">
    <div class="countdown-bg">
      <el-countdown
        class="countdown"
        :title="'Start to contest ' + contestName"
        :value="contestStartTime"
      />
    </div>
  </template>
</template>

<style scoped>
.countdown-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2000;

  background-color: white;
}

.countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.countdown :deep(.el-statistic__head) {
  text-align: center;
  font-size: 30px;
}

.countdown :deep(.el-statistic__content) {
  text-align: center;
  font-size: 64px;
}
</style>
