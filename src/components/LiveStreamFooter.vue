<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

defineProps<{
  time: number
}>()

const currentIndex = ref(0)
const marqueeItems = ref([])

const marqueeStyle = computed(() => ({
  transform: `translateY(-${currentIndex.value * (100 / marqueeItems.value.length ?? 1)}%)`,
  transition: 'transform 0.5s ease-in-out'
}))

const ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/api`)

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  marqueeItems.value = data.marqueeItems
}

onMounted(async () => {
  const res = await fetch('/api/marquee')
  const data = await res.json()
  marqueeItems.value = data.marqueeItems

  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % marqueeItems.value.length
  }, 5000)
})
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
    <div
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
        overflow: hidden;
      "
    >
      <div :style="marqueeStyle">
        <div v-for="(item, index) in marqueeItems" :key="index">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-statistic__content) {
  color: white;
}
</style>
