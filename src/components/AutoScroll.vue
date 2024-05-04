<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const autoScrollRef = ref<HTMLElement | null>(null)
async function smoothScrollToTop(duration: number) {
  return new Promise<void>((resolve) => {
    if (!autoScrollRef.value) throw new Error('autoScrollRef is not defined')

    const start = autoScrollRef.value.scrollHeight - autoScrollRef.value.clientHeight
    const startTime = performance.now()

    function scroll() {
      const elapsed = performance.now() - startTime
      const fraction = Math.min(elapsed / duration, 1)
      const easeInOutQuad =
        fraction < 0.5 ? 2 * fraction * fraction : -1 + (4 - 2 * fraction) * fraction

      const newScrollPosition = start * (1 - easeInOutQuad)
      autoScrollRef.value?.scrollTo(0, newScrollPosition)

      if (elapsed < duration) {
        requestAnimationFrame(scroll)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(scroll)
  })
}

function smoothScrollToBottom(duration: number) {
  return new Promise<void>((resolve) => {
    if (!autoScrollRef.value) throw new Error('autoScrollRef is not defined')

    const start = autoScrollRef.value.scrollTop
    const startTime = performance.now()

    function scroll() {
      const elapsed = performance.now() - startTime
      const fraction = Math.min(elapsed / duration, 1)
      const easeInOutQuad =
        fraction < 0.5 ? 2 * fraction * fraction : -1 + (4 - 2 * fraction) * fraction
      if (!autoScrollRef.value) return

      const newScrollPosition =
        start +
        (autoScrollRef.value.scrollHeight - autoScrollRef.value.clientHeight - start) *
          easeInOutQuad
      autoScrollRef.value?.scrollTo(0, newScrollPosition)

      if (elapsed < duration) {
        requestAnimationFrame(scroll)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(scroll)
  })
}

let timeout: number
const startAutoScroll = async () => {
  console.log('start auto scroll')
  if (!autoScrollRef.value) throw new Error('autoScrollRef is not defined')
  await smoothScrollToBottom(10000)

  timeout = setTimeout(async () => {
    await smoothScrollToTop(500)
    setTimeout(startAutoScroll, 5000)
  }, 2000)
}

onMounted(() => {
  console.log('mounted')
  setTimeout(startAutoScroll, 1000)
})

onUnmounted(() => {
  clearTimeout(timeout)
})
</script>

<template>
  <div class="auto-scroll" ref="autoScrollRef">
    <slot></slot>
  </div>
</template>

<style scoped>
.auto-scroll {
  overflow-y: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;
  --scroll-behavior-duration: 10s;
}

.auto-scroll::-webkit-scrollbar {
  display: none;
}
</style>
