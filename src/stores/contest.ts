import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UploadFile } from 'element-plus'

type Contests = Array<string>
type Images = Array<UploadFile>

export const useContestStore = defineStore(
  'contest',
  () => {
    const contests = ref<Contests>()
    const images = ref<Images>()

    function setDomjudgeContests({
      contests: _c,
      images: _i
    }: {
      contests: Contests
      images: Images
    }) {
      contests.value = _c
      images.value = _i
    }

    return {
      contests,
      images,

      setDomjudgeContests
    }
  },
  {
    persist: true
  }
)
