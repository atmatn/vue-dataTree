<template>
  <div>
    <Alert v-if="isDataSampled" type="warning" :class="{'big-font': bigFont}">
      <div>
        <span class="warn-sampled">已采样{{dataSampleType}}计算
        <Tooltip max-width="400" :transfer="true">
          <Icon type="ios-help-circle-outline" />
          <div slot="content">
              <p align="center">什么是“采样计算”</p>
              <p>为了提高查询速度，当前查询使用了 1/N 的用户数据来估算结果。</p>
              <p>算法：</p>
              <p>1. 取 1/N 用户的数据，计算出 PV 和 UV。</p>
              <p>2. 计算结果再乘以 N 作为输出。</p>
          </div>
        </Tooltip>
        <Button class="precise-button"><span class="precise-link" @click="onPreciseLinkClick">我想全量计算当前查询</span></Button>
        </span>
      </div>
    </Alert>
    <div v-if="!isDataSampled">
      <!-- prop preciseSql = {{preciseSql}} -->
      <SqlHint :sql="preciseSql"></SqlHint>
    </div>
  </div>
</template>

<script>
import { Input, Button } from 'iview'
import SqlHint from '_c/SqlHint.vue'
export default {
  data: function(){
    return {
      sql: this.preciseSql
    }
  },
  components: {
    SqlHint
  },
  props: {
    isDataSampled: Boolean,
    dataSampleType: String,
    preciseSql: String,
    bigFont: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onPreciseLinkClick () {
      var prefixMsg = "--请点击“执行”，之后过段时间点击“刷新”看看有没有出结果~\n"
      var encodedeSql = encodeURIComponent(prefixMsg + this.preciseSql)
      window.open('http://analyzer2.corp.youdao.com/hive-async-query.html?sql=' + encodedeSql,'_blank');
    }
  }
}
</script>

<style scoped lang="less">
  .precise-link {
    color: black;
  }
  .precise-button {
    margin-left: 2em;
    margin-top: 1em;
  }
  .warn-sampled {
    color: red;
  }
  .big-font {
    font-size: 24px;
  }
</style>
