<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import draggable from 'vuedraggable'

defineProps<{
  tableData: any[]
}>()

const selectContests = defineModel<any[]>('selectContests', { required: true })

const multipleTableRef = ref()
function handleSelectionChange(val: any) {
  if (!val) return

  if (val.length > 2) {
    ElMessage.warning('You can only select two contests')
    multipleTableRef.value?.toggleRowSelection(val[val.length - 1])
    return
  }

  selectContests.value = val
  console.log(selectContests.value)
}
</script>

<template>
  <el-space fill>
    <el-table
      ref="multipleTableRef"
      max-height="500"
      width="580"
      type="selection"
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="startTime" label="Start Time" />
      <el-table-column prop="endTime" label="End Time" />
    </el-table>
    <div style="height: 130px">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="You can drag the contest to change the order"
        placement="right"
      >
        <span>Contest Order:</span>
      </el-tooltip>
      <draggable :list="selectContests" itemKey="id" class="list-group">
        <template #item="{ element, index }">
          <div class="select-item">
            <span class="order">{{ index + 1 }}.</span>
            <span class="text">{{ element.name }}</span>
          </div>
        </template>
      </draggable>
    </div>
    <el-alert type="info" show-icon :closable="true">
      <p>
        No contest found? Please make sure you have create the public contest <br />
        in the Domjudge, or input API credentials in the prev step.
      </p>
    </el-alert>
  </el-space>
</template>

<style scoped lang="scss">
.select-item {
  padding: 5px;
  margin-top: 10px;
  border: 2px solid #cacaca;
  border-radius: 5px;
  background-color: white;
  cursor: move;

  .text {
    font-size: 16px;
    font-weight: 500;
  }

  .order {
    display: inline-block;
    font-size: 16px;
    font-weight: 500;
    width: 20px;
  }
}
</style>
