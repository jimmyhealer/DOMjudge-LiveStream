<script setup lang="ts">
import type { Submission } from '@/types'

defineProps<{
  data: Submission
}>()
</script>
<template>
  <el-row>
    <el-col :span="2">
      <span style="background-color: #777; color: #fff"> {{ data.rank }} </span>
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
          'border-bottom': '3px solid ' + data.problem.color
        }"
      >
        {{ data.problem.shortname }}
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
