<script setup lang="ts">
import {defineAsyncComponent} from 'vue'

const LayoutHeader = defineAsyncComponent(() => import('./components/Header.vue'))
</script>

<template>
<div class="base-layout">
  <layout-header></layout-header>
  <router-view></router-view>
</div>
</template>

<style lang="scss" scoped>
.base-layout{
  width: 100vw;
  height: 100vh;
  background: #e5e5e5;
}
</style>
