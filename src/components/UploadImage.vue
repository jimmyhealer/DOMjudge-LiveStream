<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadUserFile } from 'element-plus'

defineProps<{
  contestCount: number
}>()
const fileList = defineModel<UploadFile[]>('fileList', { required: true })
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

function handlePictureCardPreview(uploadFile: UploadFile) {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

function onExceed() {
  ElMessage.warning('You can only upload 9 images')
}

function beforeUpload(file: File) {
  // allow jpg, jpeg, png, gif
  const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
  if (!isImage) {
    ElMessage.error('Please upload an jpg, jpeg, png, or gif image')
    return false
  }

  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('Image must smaller than 2MB!')
    return false
  }

  return true
}

async function handleUpload(uploadFile: UploadUserFile) {
  const reader = new FileReader()

  if (!beforeUpload(uploadFile.raw!)) {
    fileList.value.pop()
    return
  }

  reader.onload = (e) => {
    console.log(fileList.value, uploadFile)
    const index = fileList.value.findIndex((file) => file.uid === uploadFile.uid)
    fileList.value[index] = {
      name: uploadFile.raw!.name,
      url: e.target?.result as string,
      status: 'success',
      uid: uploadFile.uid!
    }
  }

  reader.readAsDataURL(uploadFile.raw!)
}

const radio3 = ref('5s')
</script>

<template>
  <el-space fill>
    <el-text> Upload up to 9 sponsor logos. (Allow jpg, jpeg, png, gif, and max size 2MB) </el-text>
    <el-upload
      v-model:file-list="fileList"
      action="#"
      list-type="picture-card"
      :accept="'image/jpeg,image/png,image/gif'"
      :on-preview="handlePictureCardPreview"
      :on-exceed="onExceed"
      :auto-upload="false"
      :on-change="handleUpload"
      :multiple="true"
      :limit="9"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
    <el-form>
      <el-form-item label="Image Switch Interval:">
        <el-radio-group v-model="radio3">
          <el-radio-button label="5s" value="5s" />
          <el-radio-button label="10s" value="10s" />
          <el-radio-button label="15s" value="15s" />
          <el-radio-button label="30s" value="30s" />
        </el-radio-group>
      </el-form-item>
    </el-form>
  </el-space>
</template>

<style lang="scss">
.el-upload-list__item,
.el-upload--picture-card {
  width: 96px !important;
  height: 96px !important;
}
</style>
