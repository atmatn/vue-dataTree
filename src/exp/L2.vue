<template>
  <div class="l2">
    <div>L2</div>
    <div>p2 = {{p2}}</div>
    <div>d2 = {{d2}}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      d2: this.p2
    }
  },
  props: {
    p2: String
  }
}
</script>

<style>
.l2 {
  border-style: solid;
}
</style>
