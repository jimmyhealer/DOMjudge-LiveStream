<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type UploadFile } from 'element-plus'

import { ContestApi } from '@/api'
import { dateToFormat } from '@/utils'
import { useContestStore } from '@/stores/contest'
import SelectContest from '@/components/SelectContest.vue'
import UploadImage from '@/components/UploadImage.vue'
import SuccessInfo from '@/components/SuccessInfo.vue'

import logo from '@/assets/domjudge.png'

const useContest = useContestStore()
const setpActive = ref(0)
const tableData = ref<any[]>([])
const selectContests = ref([])

const fileList = ref<UploadFile[]>([
  {
    name: 'image1',
    url: logo,
    status: 'success',
    uid: 1
  }
])

function backHandler() {
  setpActive.value = Math.max(0, setpActive.value - 1)
}

const isLoading = ref(false)
async function nextHandler() {
  let completeFlag = false
  isLoading.value = true
  try {
    if (setpActive.value === 0) {
      completeFlag = await handleSelectContest()
    } else if (setpActive.value === 1) {
      completeFlag = await handleUploadImage()
    }
  } finally {
    isLoading.value = false
  }

  if (completeFlag) {
    setpActive.value = Math.min(3, setpActive.value + 1)
  }
}

async function handleSelectContest() {
  if (selectContests.value.length === 0) {
    ElMessage.error('Please select at least one contest')
    return false
  }

  return true
}

async function handleUploadImage() {
  return true
}

const router = useRouter()
async function handleFinish() {
  useContest.setDomjudgeContests({
    contests: selectContests.value.map((item: any) => item.id),
    images: fileList.value
  })

  await router.push('/live')
}

onMounted(async () => {
  const data = await ContestApi.getContests({
    onlyActive: false
  })
  tableData.value = data.map((item: any) => ({
    startTime: dateToFormat(item.startTime),
    endTime: dateToFormat(item.endTime),
    name: item.name,
    id: item.id
  }))
})
</script>

<template>
  <el-container>
    <el-main style="max-width: 600px">
      <el-steps
        style="margin-bottom: 20px"
        :active="setpActive"
        align-center
        finish-status="success"
      >
        <el-step title="Select Contest" />
        <el-step title="Upload Image" />
      </el-steps>
      <SelectContest
        :tableData="tableData"
        v-model:selectContests="selectContests"
        v-show="setpActive === 0"
      />
      <div v-show="setpActive === 1">
        <UploadImage v-model:file-list="fileList" :contestCount="selectContests.length" />
      </div>
      <div v-show="setpActive === 2">
        <SuccessInfo @handler-finish="handleFinish" />
      </div>
      <el-container style="justify-content: end; margin-top: 20px" v-if="setpActive !== 2">
        <el-button text @click="backHandler">
          {{ setpActive === 0 ? 'Cancel' : 'Back' }}
        </el-button>
        <el-button type="primary" @click="nextHandler" :loading="isLoading">
          {{ isLoading ? 'Loading...' : setpActive === 1 ? 'Finish' : 'Next' }}
        </el-button>
      </el-container>
    </el-main>
  </el-container>
</template>
