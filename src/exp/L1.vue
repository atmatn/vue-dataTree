<template>
  <div class="l1">
    <div>L1</div>
    <div>p1 = {{p1}}</div>
    <!-- <div>d1 = {{d1}}</div> -->
    d1 = <Input v-model="d1"/>
    <L2 :p2="p1"></L2>
    <L2 :p2="d1"></L2>
  </div>
</template>

<script>
import L2 from './L2.vue'
export default {
  components: {
    L2
  },
  data () {
    return {
      d1: this.p1
    }
  },
  props: {
    p1: String
  }
}
</script>

<style>
.l1 {
  border-style: solid
}
</style>
