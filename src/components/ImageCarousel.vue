<script setup lang="ts">
import type { UploadFile } from 'element-plus'
import { onMounted, ref } from 'vue'
import _ from 'lodash'
const props = defineProps<{
  images: UploadFile[]
}>()

let order = 0
const shuffleImages = _.shuffle(props.images)
const src = ref()

function setSrc() {
  src.value = shuffleImages[order].url ?? ''
}

function nextImage() {
  order = (order + 1) % shuffleImages.length
  setSrc()
}

onMounted(() => {
  setSrc()
  setInterval(nextImage, 5000)
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <el-image
      style="width: 100%; height: 120px; padding: 10px"
      :key="src"
      :src="src"
      fit="contain"
    />
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-leave-from,
.fade-enter-to {
  opacity: 1;
}
</style>
