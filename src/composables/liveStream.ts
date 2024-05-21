import { onUnmounted } from 'vue'
import { useLiveStreamStore } from '@/stores/livestream'
import { useScoreboard } from './scoreboard'
import { useLastSubmission } from './lastSubmission'

const POLLING_INTERVAL = 1000
export function useLiveStream() {
  let isStart = false
  let intervalId: number | null = null
  const { initScoreboard } = useLiveStreamStore()

  async function doInterval(updates: (() => any)[]) {
    try {
      await Promise.all(updates.map((update) => update()))
    } catch (error) {
      console.error('Failed to update live stream:', error)
    }

    if (isStart) {
      intervalId = setTimeout(async () => doInterval(updates), POLLING_INTERVAL)
    }
  }

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

    await doInterval(updates)
    intervalId = setTimeout(async () => doInterval(updates), POLLING_INTERVAL)
  }

  function stop() {
    if (intervalId !== null) {
      clearTimeout(intervalId)
      intervalId = null
      isStart = false
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
