<template>
  <Alert v-if="isDataLimited" type="warning" :class="{'big-font': bigFont}">
    <div>
      <span class="warn-limited">已限制返回条目数为“最多{{dataLimitNum}}条”
      <Tooltip max-width="400" :transfer="true">
        <Icon type="ios-help-circle-outline" />
        <div slot="content">
            <p align="center">为何限制返回条目数</p>
            <p>为了提高查询速度，并且提高前端性能，当前查询限制了返回条目数。</p>
            <p>算法：</p>
            <p>1. 正常计算</p>
            <p>2. 仅展示 PV 为 Top N 的条目</p>
        </div>
      </Tooltip>
      <Button class="precise-button">
        <span class="precise-link" @click="onPreciseLinkClick">我想全量计算当前查询</span>
      </Button>
      </span>
    </div>
  </Alert>
</template>

<script>
import { Input, Button } from 'iview'
export default {
  name: 'DataLimitedWarning',
  props: {
    isDataLimited: Boolean,
    dataLimitNum: [Number, String],
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
    margin-left: 1em;
    margin-top: 1em;
  }
  .warn-limited {
    color: red;
  }
  .big-font {
    font-size: 24px;
  }
</style>
