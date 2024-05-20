<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useContestStore } from '@/stores/contest'
import { useLiveStreamStore } from '@/stores/livestream'
import { useLiveStream } from '@/composables/liveStream'
import LastSubmission from '@/components/LastSubmission.vue'
import ScoreBoard from '@/components/ScoreBoard.vue'
import ImageCarousel from '@/components/ImageCarousel.vue'

const { start } = useLiveStream()
const { checkScoreboard, getLastSubmission } = useLiveStreamStore()
const contestStore = useContestStore()

const isInitialized = ref(false)
onMounted(async () => {
  start(contestStore.contests?.map((contest) => contest.id) || [])
  isInitialized.value = true
})
</script>

<template>
  <div class="scoreboard" style="overflow: hidden" v-loading.fullscreen.lock="!isInitialized">
    <template v-for="{ id } in contestStore.contests" :key="id">
      <el-row style="height: 50%; border: 1px solid #ccc">
        <template v-if="false">
          <!-- <el-countdown
            class="countdown"
            :title="'Start to contest ' + scoreboardData.get(id)?.contestDetail.name"
            :value="scoreboardData.get(id)?.contestDetail.startTime"
          /> -->
        </template>
        <template v-else>
          <el-col :span="20" style="height: 100%">
            <template v-if="checkScoreboard(id)">
              <ScoreBoard :contestId="id" />
            </template>
          </el-col>
          <el-col :span="4" v-if="getLastSubmission(id)" class="last-submission">
            <LastSubmission :submissions="getLastSubmission(id)" />
            <ImageCarousel v-if="contestStore.images" :images="contestStore.images" />
          </el-col>
        </template>
      </el-row>
    </template>
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.countdown >>> .el-statistic__head {
  text-align: center;
  font-size: 30px;
}

.countdown >>> .el-statistic__content {
  text-align: center;
  font-size: 64px;
}

.el-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
