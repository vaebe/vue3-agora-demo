<script setup lang="ts">
import {defineAsyncComponent} from 'vue'

const SetProjectConfig = defineAsyncComponent(() => import('./SetProjectConfig.vue'))

</script>

<template>
<div class="layout-header">
  dasdasda
  <set-project-config></set-project-config>
</div>
</template>

<style lang="scss" scoped>
.layout-header{
  position: relative;
  width: 100vw;
  height: 68px;
  background: #f5f5f5;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    filter: blur(10px);
    z-index: -1;
  }
}
</style>
