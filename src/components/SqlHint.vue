<template>
  <div>
    <Button @click="onClickAcquireSql">获取SQL</Button>
    <Modal v-model="showSql">
      <Input type="textarea" :rows="8" v-model="sql"/>
      <Button class="my-button" @click="onClickCopyToClipboard">复制到剪贴板</Button>
      <Button class="my-button" @click="onClickQueryInHive">用Hive查询</Button>
    </Modal>
  </div>
</template>

<script>
import VueClipboard from 'vue-clipboard2'
import Vue from 'vue'

VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)

export default {
  name: 'SqlHint',
  data () {
    return {
      showSql: false
    }
  },
  props: {
    sql: {
      type: String,
      default: 'select ... from ...'
    }
  },
  methods: {
    onClickAcquireSql () {
      this.showSql = true
    },
    onClickCopyToClipboard : function () {
      this.$copyText(this.sql).then((e) => {
          this.$Message.info('已复制')
          console.log(e)
        }, (e) => {
          this.$Message.error('复制失败')
          console.log(e)
        })
    },
    onClickQueryInHive: function () {
      var prefixMsg = "--请点击“执行”，之后过段时间点击“刷新”看看有没有出结果~\n"
      var encodedeSql = encodeURIComponent(prefixMsg + this.sql)
      window.open('http://analyzer2.corp.youdao.com/hive-async-query.html?sql=' + encodedeSql,'_blank');
    }
  }
}
</script>

<style lang="less">
.my-button {
  display: inline-block;
  margin-right: 1em;
}
</style>
