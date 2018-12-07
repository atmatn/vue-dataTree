<script>
export default {
  data(){
    return {
        d1: 'home_d1'
    }
  },
  props:{
    p1: {
      type: [Object, String]
    }
  },
  render(h){
    console.log('call: render of S1')
    // var s
    // if (typeof(this.p1) === 'object') {
    //   s = this.p1.home_d3_e1
    // } else {
    //   s = this.p1
    // }
    return h('div', {}, ['S1 p1=' + JSON.stringify(this.p1) + ' d1=' + this.d1])
  }
}
</script>
