<template>
  <div>
    <h1>Test Home</h1>
    home_d1: <Input v-model="home_d1"/>
    <L1 :p1="home_d1"></L1>
  </div>
</template>

<script>
import L1 from './L1.vue'
export default {
  components: {
    L1
  },
  data () {
    return {
      home_d1: 'home_d1'
    }
  }
}
</script>

<style>

</style>
