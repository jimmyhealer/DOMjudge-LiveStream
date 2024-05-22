<script setup lang="ts">
import type { Scoreboard } from '@/types'

import { useLiveStreamStore } from '@/stores/livestream'
import TeamInfo from '@/components/TeamInfo.vue'
import ProblemResult from '@/components/ProblemResult.vue'
import AutoScroll from '@/components/AutoScroll.vue'
const props = defineProps<{
  contestId: string
}>()

const scoreboardData = useLiveStreamStore().getScoreboard(props.contestId) as Scoreboard
</script>

<template>
  <el-row>
    <el-col :span="8">
      <el-row class="title border-bottom">
        <el-col :span="20" style="border-right: 1px solid #ccc">
          {{ scoreboardData.contestDetail.name }}
        </el-col>
        <el-col :span="4" style="border-right: 1px solid #ccc">
          <p style="line-height: 24px">score</p>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="16">
      <div class="problem-col title border-bottom">
        <div class="problem-title" v-for="item in scoreboardData.problems" :key="item.id">
          <span>{{ item.shortName }}</span>
          <div class="circle" :style="{ 'background-color': item.color }"></div>
        </div>
      </div>
    </el-col>
  </el-row>
  <AutoScroll class="scoreboard-main">
    <el-row>
      <el-col :span="8">
        <TransitionGroup name="list" tag="div">
          <TeamInfo v-for="team in scoreboardData.teams" :key="team.id" :teamInfo="team" />
        </TransitionGroup>
      </el-col>
      <el-col :span="16">
        <TransitionGroup name="list" tag="div">
          <ProblemResult
            v-for="team in scoreboardData.teams"
            :key="team.id"
            :submissions="team.submissions"
          />
        </TransitionGroup>
      </el-col>
    </el-row>
  </AutoScroll>
</template>

<style scoped lang="scss">
$title-height: 30px;

.title {
  text-align: center;
  font-size: 24px;
  line-height: $title-height;
  height: $title-height;
}

.problem-col {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}

.problem-title {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-right: 1px solid #ccc;
}

.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: 3px;
  background-color: red;
}

.border-bottom {
  border-bottom: 2px solid #000;
}

.scoreboard-main {
  height: calc(100% - 30px);
}
</style>
