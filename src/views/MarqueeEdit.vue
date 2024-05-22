<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

const model = ref<any>({})

function addMarqueeItem() {
  model.value.marqueeItems.push('new marquee text')
}

function removeMarqueeItem(index: number) {
  model.value.marqueeItems.splice(index, 1)
}

async function onSubmit() {
  const res = await fetch('/api/marquee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(model.value)
  })
  if (res.ok) {
    ElMessage.success('Marquee saved')
  } else {
    ElMessage.error('Failed to save marquee')
  }
}

onMounted(async () => {
  const res = await fetch('/api/marquee')
  model.value = await res.json()
})
</script>

<template>
  <el-container>
    <el-main>
      <h2>Marquee Edit</h2>
      <el-form :model="model" style="width: 800px">
        <el-form-item
          v-for="(item, index) in model.marqueeItems"
          :key="index"
          :label="'Marquee Item ' + (index + 1)"
          style="display: flex"
        >
          <el-input v-model="model.marqueeItems[index]" show-word-limit maxlength="150">
            <template #append>
              <el-button @click="removeMarqueeItem(index)">Remove</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-button @click="addMarqueeItem">Add Marquee Item</el-button>
        <el-button @click="onSubmit" type="primary">Save</el-button>
      </el-form>
    </el-main>
  </el-container>
</template>
