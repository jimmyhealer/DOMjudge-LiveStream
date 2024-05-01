import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UploadFile } from 'element-plus'

type DomjudgeApi = {
  url: string
  username: string
  password: string
}
type Contests = Array<any>
type Images = Array<UploadFile>

export const useContestStore = defineStore(
  'contest',
  () => {
    const domjudgeApi = ref<DomjudgeApi>({
      url: '',
      username: '',
      password: ''
    })
    const contests = ref<Contests>()
    const images = ref<Images>()

    function setDomjudgeContests({
      domjudge: _d,
      contests: _c,
      images: _i
    }: {
      domjudge: DomjudgeApi
      contests: Contests
      images: Images
    }) {
      domjudgeApi.value = _d
      contests.value = _c
      images.value = _i
    }

    return {
      domjudgeApi,
      contests,
      images,

      setDomjudgeContests
    }
  },
  {
    persist: true
  }
)
