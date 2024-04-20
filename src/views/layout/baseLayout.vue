<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const LayoutMenu = defineAsyncComponent(() => import('./components/Menu.vue'))
</script>

<template>
  <div class="base-layout">
    <layout-menu class="menu"></layout-menu>
    <div class="main-box">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-layout {
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
  background: #e5e5e5;

  .menu {
    width: 230px;
  }

  .main-box {
    width: calc(100vw - 240px);
    height: 100vh;
  }
}
</style>
