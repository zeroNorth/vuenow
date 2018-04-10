<template>
  <div id="app">
    <HeadCom></HeadCom>
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-if="! $route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
import HeadCom from '@/components/common/head'
export default {
  name: 'app',
  components: {
    HeadCom
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>
