<template>
<div>
  <div>
  <selects/>
  </div>
  <Menu theme="dark" active-name="1">
    <div v-if="TreeNodes">
          <submenu v-for="item in TreeNodes" :model="item" :name="item" ></submenu>
    </div>
    <div v-else>
        <h1 style="color:red">暂无数据</br>请联系管理员！</h1>
    </div>
  </Menu>
    <switchs></switchs><!--转换开关-->
    <modals></modals><!--模态框-->
</div>
</template>

<script>
import submenu from '@/components/menu/submenu.vue';
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
import selects from '@/components/select/select.vue'
import switchs from '@/components/switch/switch.vue'
import modals from '@/components/modal/modal.vue'
export default {
    data(){
            return{
              dataTreeNodes:this.$store.dispatch('reloadDataTree')
            }
          },
    components:{submenu,selects,switchs,modals},
    computed:{
         ...mapState({
      TreeNodes: "dataTreeNodes"
    })

    }
}
</script>
