<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type UploadFile } from 'element-plus'

import { ContestApi } from '@/api'
import { dateToFormat } from '@/utils'
import { useContestStore } from '@/stores/contest'
import DomjudgeForm from '@/components/DomjudgeForm.vue'
import SelectContest from '@/components/SelectContest.vue'
import UploadImage from '@/components/UploadImage.vue'
import SuccessInfo from '@/components/SuccessInfo.vue'

import logo from '@/assets/domjudge.png'

const useContest = useContestStore()
const setpActive = ref(0)
const domjudgeForm = reactive({
  url: '',
  username: '',
  password: ''
})
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
      completeFlag = await handleDomjudgeForm()
    } else if (setpActive.value === 1) {
      completeFlag = await handleSelectContest()
    } else if (setpActive.value === 2) {
      completeFlag = await handleUploadImage()
    }
  } finally {
    isLoading.value = false
  }

  if (completeFlag) {
    setpActive.value = Math.min(3, setpActive.value + 1)
  }
}

const domjudgeFormRef = ref()
// TODO: if domjudge change, need to re-register and clear the tableData
// Maybe not need
async function handleDomjudgeForm() {
  if (!domjudgeFormRef.value || !(await domjudgeFormRef.value.validate())) {
    return false
  }

  try {
    const data = await ContestApi.getContests()
    tableData.value = data.map((item: any) => ({
      startTime: dateToFormat(item.startTime),
      endTime: dateToFormat(item.endTime),
      name: item.name,
      id: item.id
    }))
  } catch (error) {
    ElMessage.error('Domjudge Url or Username or Password is incorrect')
    return false
  }

  return true
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
    domjudge: domjudgeForm,
    contests: selectContests.value,
    images: fileList.value
  })

  await router.push('/live')
}
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
        <el-step title="Set Domjudge" />
        <el-step title="Select Contest" />
        <el-step title="Upload Image" />
      </el-steps>
      <DomjudgeForm ref="domjudgeFormRef" :domjudge-form="domjudgeForm" v-show="setpActive === 0" />
      <SelectContest
        :tableData="tableData"
        v-model:selectContests="selectContests"
        v-show="setpActive === 1"
      />
      <div v-show="setpActive === 2">
        <UploadImage v-model:file-list="fileList" :contestCount="selectContests.length" />
      </div>
      <div v-show="setpActive === 3">
        <SuccessInfo @handler-finish="handleFinish" />
      </div>
      <el-container style="justify-content: end; margin-top: 20px" v-if="setpActive !== 3">
        <el-button text @click="backHandler">
          {{ setpActive === 0 ? 'Cancel' : 'Back' }}
        </el-button>
        <el-button type="primary" @click="nextHandler" :loading="isLoading">
          {{ isLoading ? 'Loading...' : setpActive === 2 ? 'Finish' : 'Next' }}
        </el-button>
      </el-container>
    </el-main>
  </el-container>
</template>
