<template>
  <div>
    Running script {{myScriptId}} with params {{myParams}}
    <br/>
    <Button @click="changeParam">Change Param</Button>
    <Button @click="doRun">Run</Button>
    <div ref="content"></div>
  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import { objEqual } from '../lib/tools'
export default {
  data : function() {
    debugger
    return {
      myScriptId: '',
      myParams: {}
    }
    // return {
    //     myScriptId: this.$store.state.currentScriptId,
    //     myParams: JSON.parse(JSON.stringify(this.$store.state.currentScriptParams))
    // }
  },
  mounted: function(){
    this.reload()
  },
  props: {
    scriptId: String,
    params: Object
  },
  beforeRouteEnter (to, from, next) {
    debugger
    //不能用this, 可以 next ( vm => {  vm是组件实例})
    // next( vm => {
    //   vm.myParams = JSON.parse(JSON.stringify(to.query))
    // })
    next()
  },
  beforeRouteLeave (to, from, next) {
    // debugger
    // next(false)
  },
  computed: {
    ...mapState(['currentScriptId','currentScriptParams'])
  },
  watch: {
    currentScriptId (val, oldVal) {
      //current script id changed
      console.log('current script id from ' + oldVal + ' to ' + val)
      // console.log(this.$route)

      this.reload()
    },
    currentScriptParams (val, oldVal) {
      debugger
      //current script params changed
      console.log('current script params from ' + oldVal + ' to ' + val)
      var equalToSavedParams = objEqual(val, this.myParams)
      if( !equalToSavedParams ) {
        this.reload()
      }
    }
  },
  methods: {
    ...mapActions(['updateScriptParams']),
    changeParam(){
      var x = Math.random()
      // 更新组件内参数
      this.myParams.param_a = x
    },
    doRun () {
      debugger
      // 更新URL
      this.updateScriptParams({
        params: {
          ...this.myParams
        }
      });

      debugger
      // 假设下面的是结果
      this.$refs.content.innerText = '结果:' + this.myParams.param_a

    },
    reload: function () {
      this.myParams = JSON.parse(JSON.stringify(this.currentScriptParams))
      this.myScriptId = this.currentScriptId
      // 清空结果
      this.$refs.content.innerHTML = ''
    }
  }
}
</script>

<style>

</style>
