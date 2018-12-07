<template>
  <Row>
    <Col span=20>
    显示无执行权限的项:
    </Col>
    <Col span="4">
    <i-Switch class="form-inline"  @on-change="changeWichToShow({status: !wichToShow})"/>
    </Col>
  </Row>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
    computed:{
          ...mapState({
      wichToShow: "wichToShow"
    })
        },
    methods: {
            ...mapActions(["changeWichToShow"])
        }
    }
</script>
