<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

import { ContestApi } from '@/api'
import { dateToFormat } from '@/utils'
import DomjudgeForm from '@/components/DomjudgeForm.vue'
import SelectContest from '@/components/SelectContest.vue'
import UploadImage from '@/components/UploadImage.vue'
import SuccessInfo from '@/components/SuccessInfo.vue'

const domjudgeForm = reactive({
  url: 'http://localhost:5173/domjudge',
  username: 'api',
  password: '1234567890'
})
const setpActive = ref(1)
const contestApi = new ContestApi()
const tableData = ref<any[]>([])
const selectContest = ref('')

function backHandler() {
  setpActive.value = Math.max(0, setpActive.value - 1)
}

const isLoading = ref(false)
async function nextHandler() {
  let completeFlag = false
  isLoading.value = true
  if (setpActive.value === 0) {
    completeFlag = await handleDomjudgeForm()
  } else if (setpActive.value === 1) {
    // TODO: handle select contest
    completeFlag = true
  } else if (setpActive.value === 2) {
    // TODO: handle Upload image
    completeFlag = true
  }

  if (completeFlag) {
    setpActive.value = Math.min(3, setpActive.value + 1)
  }
  isLoading.value = false
}

const formRef = ref()
// TODO: if domjudge change, need to re-register and clear the tableData
// Maybe not need
async function handleDomjudgeForm() {
  if (!formRef.value || !(await formRef.value.validate())) {
    return false
  }

  contestApi.register(domjudgeForm.url, {
    username: domjudgeForm.username,
    password: domjudgeForm.password
  })

  try {
    const data = await contestApi.getContests()
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
      <DomjudgeForm ref="formRef" :domjudge-form="domjudgeForm" v-show="setpActive === 0" />
      <SelectContest
        :tableData="tableData"
        :selectContest="selectContest"
        v-show="setpActive === 1"
      />
      <UploadImage v-show="setpActive === 2" />
      <SuccessInfo v-show="setpActive === 3" />
      <el-container style="justify-content: end; margin-top: 20px" v-if="setpActive !== 3">
        <el-button text @click="backHandler">
          {{ setpActive === 0 ? 'Cancel' : 'Back' }}
        </el-button>
        <!-- TODO: check disabled -->
        <el-button type="primary" @click="nextHandler" :loading="isLoading">
          {{ isLoading ? 'Loading...' : setpActive === 2 ? 'Finish' : 'Next' }}
        </el-button>
      </el-container>
    </el-main>
  </el-container>
</template>
