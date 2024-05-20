<script setup lang="ts">
import type { LastSubmission } from '@/types'

defineProps<{
  data: LastSubmission
}>()

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}

function adjustTextColor(color: string) {
  const rgb = hexToRgb(color)
  // const brightness = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0772 * rgb[2]) / 255
  const brightness = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255
  return brightness >= 0.5 ? 'black' : 'white'
}

function getRankColor(rank: number) {
  if (rank === 1) {
    return '#FFD700'
  } else if (rank === 2) {
    return '#C0C0C0'
  } else if (rank === 3) {
    return '#CD7F32'
  } else {
    return '#777'
  }
}
</script>
<template>
  <el-row>
    <el-col :span="2">
      <span
        :style="{
          'background-color': getRankColor(data.rank),
          color: adjustTextColor(getRankColor(data.rank))
        }"
      >
        {{ data.rank }}
      </span>
    </el-col>
    <el-col :span="14">
      <span
        style="
          text-align: left;
          padding-left: 4px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 18px;
        "
      >
        {{ data.teamName }}
      </span>
    </el-col>
    <el-col :span="2">
      <span> {{ data.numSolved }} </span>
    </el-col>
    <el-col :span="2">
      <span
        :style="{
          'background-color': data.problem.color,
          color: adjustTextColor(data.problem.color)
        }"
      >
        {{ data.problem.shortName }}
      </span>
    </el-col>
    <el-col :span="4">
      <span
        :class="{
          ac: data.result === 'AC',
          wa: data.result !== null && data.result !== 'AC',
          pending: data.result === null && !data.isFrozen,
          frozen: data.isFrozen
        }"
      >
        {{ data.result }}
      </span>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.el-col {
  /* TODO: why need to set height? */
  height: 28px;
}

@keyframes pending-blink-animation {
  0% {
    background-color: rgb(102, 102, 255);
  }

  100% {
    background-color: rgba(0, 0, 0, 0.7);
  }
}

span {
  display: inline-block;
  width: 100%;
  height: 28px;
  line-height: 28px;
  text-align: center;

  font-size: 20px;
}

.ac {
  background-color: rgb(96, 231, 96);
}

.wa {
  background-color: rgb(232, 114, 114);
}

.frozen {
  background-color: rgb(102, 102, 255);
}

.pending {
  animation: pending-blink-animation 1s alternate infinite ease-in-out;
}
</style>
