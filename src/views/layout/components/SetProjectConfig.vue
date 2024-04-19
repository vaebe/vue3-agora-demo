<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'
import { reactive, ref } from "vue";

const showAppSettings = ref(false)
const toggleShowAppSettings = () => {
  showAppSettings.value = !showAppSettings.value
}

const appSettingsKey = 'sw-demo-app-settings-key'
const localConfig = JSON.parse(localStorage.getItem(appSettingsKey) || '{}') as Record<string, string>

const configForm = reactive({
  appId: '',
  certificate: '',
  ...localConfig
})

function save () {
  localStorage.setItem(appSettingsKey, JSON.stringify(configForm))
}
</script>

<template>
  <div class="app-settings">
    <el-icon size="22" @click="toggleShowAppSettings">
      <Setting />
    </el-icon>

    <el-drawer v-model="showAppSettings">
      <template #header>
        <div class="text-2xl text-black dark:text-white">
          项目配置
        </div>
      </template>
      <el-form label-position="top" :model="configForm">
        <el-form-item label="APPID">
          <el-input v-model="configForm.appId" />
        </el-form-item>
        <el-form-item label="App 证书">
          <el-input v-model="configForm.certificate"  show-password/>
        </el-form-item>
      </el-form>
      <el-row justify="center">
        <el-button @click="save">保存</el-button>
      </el-row>
    </el-drawer>
  </div>
</template>

<style  lang="scss">
.app-settings {
  .el-drawer__header {
    padding: 10px;
    margin-bottom: 0;
    border-bottom: var(--el-border);
  }

  .el-drawer__body {
    padding: 10px;
  }
}
</style>
