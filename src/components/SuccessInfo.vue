<template>
  <div style="display: flex; justify-content: center; flex-wrap: wrap">
    <el-alert
      title="Success"
      type="success"
      description="Domjudge has been set successfully"
      show-icon
      style="width: 100%"
    ></el-alert>
    <el-button type="success" style="margin-top: 30px" @click="$emit('handlerFinish')"
      >Go to Contest</el-button
    >
  </div>
</template>
