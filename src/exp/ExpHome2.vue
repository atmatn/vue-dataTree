<script>
import S1 from './S1.vue'
export default {
  components: {
    S1
  },
  data(){
    return {
        home_d1: 'home_d1',
        home_d2: 'home_d2',
        home_d3: {
          home_d3_e1: 'home_d3_e1'
        }
    }
  },
  render(h){
    console.log('call: render of ExpHome2')
    var arr = [
      h('Button',{on: { click: () => {
        this.home_d1 = this.home_d1 + '1'
      }}}, 'Concat home_d1'),
      h('Button',{on: { click: () => {
        this.home_d3.home_d3_e1 = this.home_d3.home_d3_e1 + '1'
      }}}, 'Concat home_d3_e1'),
      h('S1',{
          props: {
              p1: this.home_d1
          }
      }),
      h('S1',{
          props: {
              p1: this.home_d2
          }
      }),
      h('S1',{
          props: {
              p1: this.home_d3
          }
      })]
    return h('div',{},arr)
  }
}
</script>
