<script setup lang="ts">
import type { Scoreboard } from '@/types'

import TeamInfo from '@/components/TeamInfo.vue'
import ProblemResult from '@/components/ProblemResult.vue'
defineProps<{
  scoreboardData: Scoreboard
}>()
</script>

<template>
  <el-row>
    <el-col :span="6">
      <el-row class="title border-bottom">
        <el-col :span="20" style="border-right: 1px solid #ccc">
          {{ scoreboardData.contest.name }}
        </el-col>
        <el-col :span="4" style="border-right: 1px solid #ccc"> score </el-col>
      </el-row>
    </el-col>
    <el-col :span="18">
      <div class="problem-col title border-bottom">
        <div class="problem-title" v-for="item in scoreboardData.problems" :key="item.id">
          <span>{{ item.shortname }}</span>
          <div class="circle" :style="{ 'background-color': item.color }"></div>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="6">
      <TransitionGroup name="list" tag="div">
        <TeamInfo v-for="team in scoreboardData.teams" :key="team.name" :teamInfo="team" />
      </TransitionGroup>
    </el-col>
    <el-col :span="18">
      <TransitionGroup name="list" tag="div">
        <ProblemResult
          v-for="team in scoreboardData.teams"
          :key="team.name"
          :submissions="team.submissions"
        />
      </TransitionGroup>
    </el-col>
  </el-row>
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
</style>
