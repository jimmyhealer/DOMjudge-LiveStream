<script setup lang="ts">
defineProps<{
  time: number
}>()
</script>

<template>
  <div style="height: 48px; padding: 0 4px 0 8px; align-items: center; display: flex">
    <el-countdown
      format="HH:mm:ss"
      :value="time"
      style="
        margin: auto 0;
        background-color: red;
        color: white !important;
        font-weight: 500;
        width: 100px;
        height: 32px;
        text-align: center;
        border-radius: 6px;
      "
    />
    <p
      style="
        background-color: seagreen;
        width: calc(100% - 100px);
        margin: auto;
        margin-left: 8px;
        border-radius: 6px;
        padding: 3px 6px;
        color: white;
        font-weight: 500;
        font-size: 18px;
        height: 32px;
      "
    >
      跑馬燈
    </p>
  </div>
</template>

<style scoped>
:deep(.el-statistic__content) {
  color: white;
}
</style>
