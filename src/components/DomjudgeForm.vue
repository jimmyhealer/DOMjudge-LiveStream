<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'

const domjudgeForm = defineModel<{
  url: string
  username: string
  password: string
}>('domjudgeForm', { required: true })

const rules = {
  url: [
    { required: true, message: 'Please input Domjudge Url', trigger: 'blur' },
    {
      type: 'url',
      message: 'Please input correct url, e.g. https://example.domjudge.com',
      trigger: 'blur'
    },
    {
      validator: async (_: any, value: any, callback: any) => {
        try {
          const response = await fetch(value)
          if (!response.ok) {
            callback(new Error('Invalid Url'))
          }
        } catch (error) {
          callback(new Error('Invalid Url'))
        }
      },
      message: 'Please check your Domjudge Url',
      trigger: 'blur'
    }
  ]
}

const formRef = ref<FormInstance>()

async function validate() {
  return await formRef.value?.validate()
}

defineExpose({
  validate
})
</script>

<template>
  <el-form ref="formRef" :model="domjudgeForm" label-width="auto" :rules="rules">
    <el-form-item label="Domjudge Url" prop="url">
      <el-input v-model="domjudgeForm.url" placeholder="Domjudge Url"></el-input>
    </el-form-item>
    <el-space fill>
      <el-alert type="warning" show-icon :closable="false">
        <p>If your contest is private, please input the API credentials.</p>
        <p>
          For account security, please create a user with only API reader permissions in the
          Domjudge dashboard. Avoid using your Domjudge Admin account.
        </p>
        <span>
          More info, visit:
          <el-link href="/help" target="_blank" :underline="false">Help Documentation</el-link>
        </span>
      </el-alert>
      <el-form-item label="API Username">
        <el-input
          v-model="domjudgeForm.username"
          placeholder="API Username (Optional)"
          type="username"
        ></el-input>
      </el-form-item>
    </el-space>
    <el-form-item label="API Password">
      <el-input
        v-model="domjudgeForm.password"
        placeholder="API Password (Optional)"
        type="password"
        show-password
      ></el-input>
    </el-form-item>
  </el-form>
</template>
