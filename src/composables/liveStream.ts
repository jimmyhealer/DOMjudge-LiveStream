import { onUnmounted } from 'vue'
import { useLiveStreamStore } from '@/stores/livestream'
import { useScoreboard } from './scoreboard'
import { useLastSubmission } from './lastSubmission'

const POLLING_INTERVAL = 3000
export function useLiveStream() {
  let isStart = false
  let intervalId: number | null = null
  const { initScoreboard } = useLiveStreamStore()

  async function start(contestId: string[]) {
    if (isStart) {
      stop()
    }
    isStart = true

    const updates: (() => any)[] = []
    for (const id of contestId) {
      initScoreboard(id)
      const { getContest, getProblemList, getScoreboard } = useScoreboard(id)
      const { getLastSubmission } = useLastSubmission(id)

      await Promise.all([getContest(), getProblemList()])

      updates.push(() => getScoreboard())
      updates.push(() => getLastSubmission())
    }

    intervalId = setInterval(async () => {
      try {
        await Promise.all(updates.map((update) => update()))
      } catch (error) {
        console.error('Failed to update live stream:', error)
      }
    }, POLLING_INTERVAL)

    isStart = true
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  onUnmounted(() => {
    stop()
  })

  return {
    start,
    stop
  }
}
