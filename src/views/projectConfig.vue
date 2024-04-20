<script setup lang="ts">
import { reactive } from "vue";
import {useProjectConfig} from '@/composables'

const {getProjectConfig, setProjectConfig} = useProjectConfig()

const configForm = reactive({
  appId: '',
  certificate: '',
  ...getProjectConfig()
})
</script>

<template>
  <el-card>
    <el-form label-position="top" :model="configForm">
      <el-form-item label="APPID">
        <el-input v-model="configForm.appId" />
      </el-form-item>
      <el-form-item label="App 证书">
        <el-input v-model="configForm.certificate"  show-password/>
      </el-form-item>
    </el-form>
    <el-row justify="center">
      <el-button @click="setProjectConfig(configForm)">保存</el-button>
    </el-row>
  </el-card>
</template>

<style  lang="scss">
</style>
