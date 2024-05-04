<script setup lang="ts">
import type { TeamRow } from '@/types'

defineProps<{
  teamInfo: TeamRow
}>()
</script>

<template>
  <el-row style="border-bottom: 1px solid #000">
    <el-col :span="20">
      <el-row>
        <el-col :span="2" class="border-right">
          <p>{{ teamInfo.rank }}</p>
        </el-col>
        <el-col :span="22" class="border-right">
          <el-text truncated style="justify-content: start; padding-left: 4px">
            {{ teamInfo.name }}
          </el-text>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="4" class="border-right">
      <el-row v-if="teamInfo.score">
        <el-col :span="12">
          <p style="font-weight: 600">{{ teamInfo.score.numSolved }}</p>
        </el-col>
        <el-col :span="12">
          <p>{{ teamInfo.score.penalty }}</p>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped>
p,
.el-text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 52px;
}

.border-right {
  border-right: 1px solid #ccc;
}
</style>
