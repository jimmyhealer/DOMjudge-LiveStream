<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useContestStore } from '@/stores/contest'
import { useLiveStreamStore } from '@/stores/livestream'
import { useLiveStream } from '@/composables/liveStream'
import LastSubmission from '@/components/LastSubmission.vue'
import ScoreBoard from '@/components/ScoreBoard.vue'
import ContestCountdown from '@/components/ContestCountdown.vue'
import ImageCarousel from '@/components/ImageCarousel.vue'
import LiveStreamFooter from '@/components/LiveStreamFooter.vue'

const { start } = useLiveStream()
const { checkScoreboard, checkLastSubmission, getContestDetail } = useLiveStreamStore()
const contestStore = useContestStore()

function getMaxContestTime() {
  const result = contestStore.contests?.map((contest) => getContestDetail(contest).endTime) ?? []
  return Math.max(...result.map((date) => date.getTime()))
}

const isInitialized = ref(false)
onMounted(async () => {
  await start(contestStore.contests!)

  isInitialized.value = true
})
</script>

<template>
  <div class="scoreboard" style="overflow: hidden" v-loading.fullscreen.lock="!isInitialized">
    <el-row v-if="isInitialized">
      <el-col :span="20" style="height: 100vh">
        <div style="height: calc(100% - 48px); position: relative">
          <template v-for="(id, idx) in contestStore.contests" :key="id">
            <template v-if="checkScoreboard(id)">
              <div
                :style="{
                  height: `calc(${100 / contestStore.contests!.length}% + ${idx ? '-48' : '+48'}px)`
                }"
                style="position: relative"
              >
                <ContestCountdown :contestId="id" />
                <ScoreBoard :contestId="id" />
              </div>
            </template>
          </template>
        </div>
        <LiveStreamFooter :time="getMaxContestTime()" />
      </el-col>
      <el-col :span="4" class="last-submission" ref="submissionEl">
        <ImageCarousel
          v-if="contestStore.images && contestStore.images.length > 0"
          :images="contestStore.images"
          style="margin-bottom: auto"
        />
        <template v-for="id in contestStore.contests" :key="id">
          <div
            class="last-submission-item"
            ref="el"
            :style="{
              height: `calc(${100 / contestStore.contests!.length}% - ${220 / contestStore.contests!.length}px)`
            }"
          >
            <LastSubmission :contestId="id" v-if="checkLastSubmission(id)" />
          </div>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.scoreboard {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.last-submission {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding-right: 6px;
}

.last-submission-item {
  margin: 0px 4px 10px;
  border-radius: 6px;
  background-color: #2b92ff;
  color: white;
  padding: 6px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
