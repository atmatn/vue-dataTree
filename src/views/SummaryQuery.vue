<template>
  <div class="all">
    <h1 class="h1">明细查询工具</h1>
    <div class="line1">
      <div class="datasource-part">
        <div class="h">数据源</div>
        <Select filterable @on-change="onChangeDataSource" v-model="dataSource" style="width:300px">
              <Option v-for="item in dataSourceList"
              :value="item.value"
              :key="item.value">{{ item.value }}
              </Option>
        </Select>
      </div>
      <div class="daterange-part" v-if="dataSource != ''">
        <div class="h">日期</div>
        <DatePicker v-model="daterange" type="daterange" placeholder="Select date" style="width: 300px"></DatePicker>
      </div>
      <div class="uid-part" v-if="dataSource != '' && uidFieldList.length > 0">
        <span class="h">用户标识</span>
        <Select filterable @on-change="onChangeUidField" v-model="uidField" style="width:300px">
            <Option v-for="item in uidFieldList"
            :value="item.value"
            :key="item.value">{{ item.value }}
            </Option>
        </Select>
      </div> <!-- uid-part -->
    </div> <!-- line1 -->


    <div class="line2" v-if="dataSource != ''">
      <div class="filter-part" v-if="filters.length > 0">
        <div class="h">当前过滤条件</div>
        <p v-if="filters.length == 0">
          无
        </p>
        <p v-if="filters.length > 0">
          <p class="filter-item" v-for="(item,idx) in filters" v-bind:key="item.idx">
            <span class="filter-dim">{{item.dim}}</span> :
            <span v-if="item.operator=='is_null'">is null</span>
            <span v-if="item.operator=='is_not_null'">is not null</span>
            <span v-if="item.operator=='='">{{item.dimVal}}</span>
            <span v-if="item.operator=='ignore_case_like'">包含“{{item.dimVal}}”（忽略大小写）</span>
            <Button @click="filters.splice(idx, 1)" class="btn-del">移除</Button>
          </p>
      </div>

      <div class="params-part">
        <FilterSelector :dimCatList="dimCatList" @dimClick="dimClick" @updateDimCatList = "updateDimCatList"/>
      </div>
    </div>  <!-- line2 -->

    <div class="line3" v-if="dataSource != ''">
      <Modal v-model="showModalDimVals"
        :title="(curDim + '参数值 （'+ toDateStr + '）')"
        @on-visible-change="clearUpModal"
        width="800">
        <div v-if="dimValsLoading">
          <div class='loader'>
            <ClipLoader
              :loading="dimValsLoading"
              :color="'#bada55'"
              :size="20"
              :widthUnit="'%'"
            />
          </div>
        </div>
        <div v-if="!dimValsLoading">
          <div v-if="loadDimValDataFail">
            <div class="fetch-data-fail-title">获取数据失败！请稍侯重试。</div>
            <Input v-model="loadDimValDataFailMessage" type="textarea" :autosize="{minRows: 2,maxRows: 10}" :readonly="true" />
          </div>
          <template v-if="!loadDimValDataFail">
            <DataSampledWarning :isDataSampled="isDimValsSampled" :dataSampleType="dimValsSampleType" :preciseSql="dimValsPreciseSql" :bigFont="false">

            </DataSampledWarning>
            <DataLimitedWarning :isDataLimited="isDimValsLimited" :dataLimitNum="dimValsLimitNum" :preciseSql="dimValsPreciseSql" :bigFont="false">

            </DataLimitedWarning>
            <Table height="500" :columns="dimValCols" :data="filterdDimValsAggData">

            </Table>
            <div class="line1_in3">
              <Button class="line1_in3-button" @click="addIsNullFilterWrapper({dim: curDim})">添加is null过滤条件</Button>
              <Button class="line1_in3-button" @click="addIsNotNullFilterWrapper({dim: curDim})">添加is not null过滤条件</Button>
            </div> <!-- line1_in3 -->
          </template>
        </div>
      </Modal>
    </div> <!-- line3 -->

    <div class="line31" v-if="dateRangeAggData.length > 0 || dateRangeDataLoading">
      <hr/>
      <div class="h agg-result">查询结果</div>
      <div class='loader'>
        <BarLoader :loading="dateRangeDataLoading" :color="'#bada55'" :size="30" :widthUnit="'%'"/>
      </div>
    </div>
    <div class="line4" v-if="dataSource != ''">
      <div v-if="dateRangeAggData.length > 0">
        <!-- aggDataPreciseSql = {{aggDataPreciseSql}} -->
        <DataSampledWarning :isDataSampled="isRangeAggDataSampled" :dataSampleType="aggDataSampleType" :preciseSql="aggDataPreciseSql">

        </DataSampledWarning>

        <!-- <SqlHint :sql="aggDataPreciseSql"></SqlHint> -->
        <div ref="dateRangeAggDisp" :class="{'date-range-agg-disp':true,'sampled-data':isRangeAggDataSampled}">

        </div>
      </div>
      <div v-if="loadDateRangeDataFail">
        <div class="fetch-data-fail-title">获取数据失败！请稍侯重试。</div>
        <Input v-model="loadDateRangeDataFailMessage" type="textarea" :autosize="{minRows: 2,maxRows: 10}" :readonly="true" />
      </div>
    </div> <!-- line4 -->
    <SummaryQueryStatus>

    </SummaryQueryStatus>
  </div> <!-- all -->
</template>

<script>
// import axios from 'axios'
import HttpRequest from '@/lib/wrapped-axios'
import { mapState, mapActions } from 'vuex'
var axios = new HttpRequest()
import moment from 'moment'
import { drawTable, drawChart } from '@/lib/custom-script.js'
import $ from 'jquery'
import { Input, Button } from 'iview'
// https://www.npmjs.com/package/@saeris/vue-spinners
import { BarLoader, ClipLoader } from '@saeris/vue-spinners'
import DataSampledWarning from '_c/DataSampledWarning.vue'
import DataLimitedWarning from '_c/DataLimitedWarning.vue'
import SummaryQueryStatus from '_c/SummaryQueryStatus.vue'
import FilterSelector from '_c/FilterSelector.vue'
import SqlHint from '_c/SqlHint.vue'
import deparam from 'deparam'
import TimeTransaction from '@/lib/TimeTransaction'
var timeTransaction = new TimeTransaction()

export default {
  components: {
    DataSampledWarning,
    DataLimitedWarning,
    BarLoader,
    ClipLoader,
    SqlHint,
    FilterSelector,
    SummaryQueryStatus
  },
  data() {
    var toDate = moment().add(-1, 'days')
    var fromDate = moment().add(-9, 'days')

    return {
      dataSourceList: [],
      dataSource: '',
      uidFieldList: [],
      uidField: '',
      // dimNameFilter: '',
      daterange: [fromDate.toDate(), toDate.toDate()],
      dimList: [],
      dimCatList: [],
      // dateRangePvUvCols: [
      //    { title: '日期', key: 'day' },
      //    { title: 'UV', key: 'uv' },
      //    { title: 'PV', key: 'pv' }
      // ],
      dimValCols: [
        {
          title: '参数值',
          key: this.curDim,
          width: 300,
          render: (h,params) => {
            var currentIsNull = (params.row[this.curDim] === null)
            return h('span', {
              class: {
                'dim-val-label': true,
                'dim-val-null': params.row[this.curDim] === null
              },
              on: {
                click: () => {
                  if( !currentIsNull ) {
                    console.log('clicked dim val: ' + params.row.dim_val)
                    this.addEqFilterWrapper({
                      dim: this.curDim,
                      dimVal: params.row[this.curDim]
                    })
                  } else {
                    console.log('clicked dim val: null')
                    this.addIsNullFilterWrapper({
                      dim: this.curDim
                    })
                  }
                }
              },
              domProps: {
                'title': '添加到过滤条件'
              }
            }, params.row[this.curDim] || '(is null)')
          },
          renderHeader: (h, col) => {
            // debugger
            return (
              <span>
              <span>{col.column.title}</span>
              <Input style="width:200px" v-model={this.dimValFilter} placeholder="搜索参数值"></Input>
              {(this.dimValFilter != '' && !this.dimValFilterIsNull)?<Button on-click={this.addLikeFilterWrapper.bind(this, {dim: this.curDim, dimVal: this.dimValFilter})}>将【包含“{this.dimValFilter.toLowerCase()}”（忽略大小写）】<br/>添加到【过滤条件】</Button>:<span></span>}
              </span>

            )
          }
        },
        {title: 'UV', key: 'uv', width: 200},
        {title: 'PV', key: 'pv', width: 200}
      ],
      filters: [],
      dimValsAggData: [],
      dateRangeAggData: [],
      // dim vals modal
      isDimValsSampled: false,
      dimValsPreciseSql: '',
      dimValsSampleType: '',
      curDim: '',
      showModalDimVals: false,
      dimValFilter: '',
      isDimValsLimited: false,
      dimValsLimitNum: 0,
      // date range
      isRangeAggDataSampled: false,
      aggDataSampleType: '',
      aggDataPreciseSql: '',
      dateRangeDataLoading: false,
      dimValsLoading: true,
      //reload
      reloading: false,
      loadDateRangeDataFail: false,
      loadDateRangeDataFailMessage: '',
      loadDimValDataFail: false,
      loadDimValDataFailMessage: ''
    }
  },
  computed: {
    ...mapState(['queryingCount']),
    isGlobalLoading: function() {
      return (this.queryingCount > 0)
    },
    basicAggsAndMtrs () {
      var mtrs = ['pv']
      var aggs = [
        {
            name: 'pv',
            type: 'pv'
        }
      ]

      if( this.uidField != null && this.uidField != '' ) {
        aggs.push(
          {
            name: 'uv',
            type: 'uv',
            uidField: this.uidField
          }
        )
        mtrs.push('uv')
      }
      return {
        aggs,
        mtrs
      }
    },
    dimValFilterIsNull: function(){
      // 过滤条件是 is null
      return (this.dimValFilter.length > 0 &&
      this.dimValFilter.match(/^\s*is\s*null\s*$/i) != null)
    },
    filterdDimValsAggData: function(){
      // debugger
      if( this.dimValFilter.length > 0 ) {
        // 写了过滤条件
        if (this.dimValFilterIsNull){
          // 只有是 is null，才会显示null
          return this.dimValsAggData.filter( s => s[this.curDim] === null || s[this.curDim] === undefined)
        } else {
          return this.dimValsAggData.filter( s => s[this.curDim] && s[this.curDim].toLowerCase().indexOf(this.dimValFilter.toLowerCase()) >= 0)
        }
      } else {
        return this.dimValsAggData
      }
    },
    fromDateStr: function() {
      return moment(this.daterange[0]).format('YYYY-MM-DD')
    },
    toDateStr: function() {
      return moment(this.daterange[1]).format('YYYY-MM-DD')
    }
  },
  mounted: function() {
    axios.request({
      url: '/api/summary-query/datasources',
      method: 'get'
    }).then( res => {
      // debugger
      // var retList = res.data.dataSources.map( x => ({
      //   value: x
      // }))
      var retList = res.data.dataSources
      this.dataSourceList = retList

      // this.updatePvUvList()
    })

    // 变色功能
    // setInterval( () => {
    //   this.blink = !this.blink
    // }, 500)
  },
  methods: {
    ...mapActions(['updateSummaryQueryParams']),
    debug () {
      debugger
    },
    // onPreciseLinkClick() {
    //   // this.$Message.info('请在弹出页面中点击“查询”！');
    //   var prefixMsg = "--请点击“执行”，之后过段时间点击“刷新”看看有没有出结果~\n"
    //   var encodedeSql = encodeURIComponent(prefixMsg + this.aggDataPreciseSql)
    //   window.open('http://analyzer2.corp.youdao.com/hive-async-query.html?sql=' + encodedeSql,'_blank');
    // },
    clearUpModal(){
      this.dimValFilter = ''
    },
    onChangeDataSource: function(val){
      console.log("datasource changed to: " + val)
      // 可能有多个中间状态，只对时间段内最后一个状态更新
      timeTransaction.startTransaction()
      // 清空filters
      this.filters = []
      this.reloadDims()
    },
    reloadDims(){
      console.log('reload dims')
      timeTransaction.disableCounting()
      axios.post(
        '/api/summary-query/dims',
        {
          dataSource: this.dataSource
        }
      ).then( res => {
        timeTransaction.enableCounting()
        // debugger
        var dimList = res.data.dimList
        this.dimList = dimList
        this.dimCatList = res.data.dimCatList
        console.log('dim list: ' + JSON.stringify(this.dimList ))
        this.uidFieldList = res.data.uidConf.uidFieldList.map(x=>{
          return {value: x}
        })
        if( this.uidFieldList.length > 0 ) {
          this.uidField = res.data.uidConf.defaultUidField
        } else {
          this.uidField = ''
        }
        this.updatePvUvList()
      }).catch(e => {
        console.log('获取参数列表失败！' + JSON.stringify(e, null, 4))
        this.$Message.error('获取参数列表失败！')
        timeTransaction.enableCounting()
      })
    },
    onChangeUidField: function(val) {
      console.log("uidField changed to: " + val)
      this.updatePvUvList()
    },
    dimClick: function (dim) {
      console.log('click dim:' + dim);
      this.curDim = dim

      this.dimValsLoading = true
      this.showModalDimVals = true
      // update: this.dimValData
      this.loadDimValDataFail = false
      axios.post(
        '/api/summary-query/date-range-agg',
        {
          dataSource: this.dataSource,
          groupByList: [dim],
          filters: this.filters,
          dateRange: {
            from: this.toDateStr,
            to: this.toDateStr
          },
          allowLimit: true,
          allowSample: true,
          //es6 map spread 语法
          ...this.basicAggsAndMtrs
        }
      ).then( res => {
        // debugger
        console.log(res.data.dateRangeAggData)
        this.isDimValsSampled = res.data.isSampled
        this.dimValsSampleType = res.data.sampleType
        this.dimValsPreciseSql = res.data.preciseSql || ''
        this.dimValsAggData = res.data.dateRangeAggData

        this.isDimValsLimited = res.data.isLimited
        this.dimValsLimitNum = res.data.limitNum
        this.dimValsLoading = false
      }).catch( err => {
        this.loadDimValDataFail = true
        this.loadDimValDataFailMessage = JSON.stringify(JSON.parse(err.request.responseText), null, 4)
        this.dimValsLoading = false
      })
    },
    addEqFilterWrapper: function({dim, dimVal}) {
      this.addEqFilter({dim, dimVal})
      this.showModalDimVals = false
      this.dimNameFilter = ''
    },
    addIsNullFilterWrapper: function({dim}) {
      this.addIsNullFilter({dim})
      this.showModalDimVals = false
      this.dimNameFilter = ''
    },
    addIsNotNullFilterWrapper: function({dim}) {
      this.addIsNotNullFilter({dim})
      this.showModalDimVals = false
      this.dimNameFilter = ''
    },
    addIsNullFilter: function({dim, dimVal}) {
      this.filters.push({
        dim: dim,
        operator: 'is_null'
      })
    },
    addIsNotNullFilter: function({dim, dimVal}) {
      this.filters.push({
        dim: dim,
        operator: 'is_not_null'
      })
    },
    addEqFilter: function({dim, dimVal}) {
      this.filters.push({
        dim: dim,
        dimVal: dimVal,
        operator: '='
      })
    },
    addLikeFilterWrapper: function({dim, dimVal}) {
      this.addLikeFilter({dim, dimVal})
      this.showModalDimVals = false
      this.dimNameFilter = ''
    },
    addLikeFilter: function({dim, dimVal}) {
      this.filters.push({
        dim: dim,
        dimVal: dimVal,
        operator: 'ignore_case_like'
      })
    },
    updatePvUvList() {
      if (this.reloading) {
        console.log('reloading, skip update updatePvUvList')
        return
      }


      // debugger
      console.log('update agg list')
      if( this.dataSource == '' ) {
        return
      }

      timeTransaction.addCallback( () => {
        var params = {
          dataSource: this.dataSource,
          filters: this.filters,
          dateRange: {
            from: moment(this.daterange[0]).format('YYYY-MM-DD'),
            to: moment(this.daterange[1]).format('YYYY-MM-DD'),
          },
          groupByList: [],
          allowSample: true,
          allowLimit: false,
          //es6 map spread 语法
          ...this.basicAggsAndMtrs
        }


        // 更新参数
        this.updateSummaryQueryParams({
          dataSource: this.dataSource,
          uidField: this.uidField,
          filters: this.filters,
          fromDate: this.fromDateStr,
          toDate: this.toDateStr
        })

        // 清理界面
        var $disp = $(this.$refs.dateRangeAggDisp)
        $disp.empty()
        this.isRangeAggDataSampled = false
        this.dateRangeDataLoading = true


        this.loadDateRangeDataFail = false
        axios.post('/api/summary-query/date-range-agg', params).then( res => {
          this.dateRangeDataLoading = false
          // debugger
          var list = res.data.dateRangeAggData
          this.dateRangeAggData = list.sort( (a,b) => {
            if( a.day > b.day ) return -1
            else if( a.day < b.day ) return 1
            else return 0
          })

          this.$nextTick( () => {
            var $disp = $(this.$refs.dateRangeAggDisp)
            $disp.empty()

            // debugger
            drawChart({
              title: '',
              source: {
                //es6 array spread 语法
                cols: ['day', ...this.basicAggsAndMtrs.mtrs],
                data: list
              },
              x: 'day',
              yList: this.basicAggsAndMtrs.mtrs,
              $target: $disp
            })
            drawTable({
              title: '',
              source: {
                //es6 array spread 语法
                cols: ['day', ...this.basicAggsAndMtrs.mtrs],
                data: list
              },
              $target: $disp,
              simple: false
            })
          })

          this.isRangeAggDataSampled = res.data.isSampled
          this.aggDataSampleType = res.data.sampleType
          this.aggDataPreciseSql = res.data.preciseSql || ''
        }).catch( err => {
          console.log("获取数据失败！")
          this.dateRangeDataLoading = false
          this.loadDateRangeDataFail = true
          // debugger
          this.loadDateRangeDataFailMessage = JSON.stringify(JSON.parse(err.request.responseText), null, 4)
        })
      })

    },
    reload : function (payload) {
      this.reloading = true
      // 可能有多个中间状态，只对时间段内最后一个状态更新
      timeTransaction.startTransaction()
      this.dataSource = payload.dataSource || ''
      this.uidField = payload.uidField || ''
      this.filters = payload.filters || []
      // debugger
      if (payload.fromDate && payload.toDate){
        var fromDate = moment(payload.fromDate, 'YYYY-MM-DD').toDate()
        var toDate = moment(payload.toDate, 'YYYY-MM-DD').toDate()
        this.daterange = [fromDate, toDate]
      }
      this.reloading = false
      if( this.dataSource != '') {
        this.reloadDims()
        this.updatePvUvList()
      }
      // console.log(this.$route)
    },
    updateDimCatList (newDimCatList) {
      console.log("update dim cat list to :" + JSON.stringify(newDimCatList))
      axios.post('/api/summary-query/update-dim-cat-list', {
        dataSource: this.dataSource,
        dimCatList: newDimCatList
      }).then( res => {
        // 成功，直接置换
        this.dimCatList = newDimCatList
        this.$Message.success('参数列表保存成功');
      }).catch( err => {
        // 失败
        console.log('参数列表保存失败！' + JSON.stringify(err, null, 4))
        this.$Message.error('参数列表保存失败！')
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    // debugger
    if( to.name == 'summary-query' ) {
      next( function(vm) {
        // debugger
        var pos = to.fullPath.indexOf('?')
        if( pos >= 0) {
          var toParse = to.fullPath.substring(pos+1)
          var payload = deparam(toParse)
          if (payload != undefined) {
            vm.reload(payload)
          }
        }
      })
    } else {
      next()
    }
  },
  watch: {
    "dimValsLoading": function (val){
      // if ( val ) {
      //   this.$Spin.show()
      // } else {
      //   this.$Spin.hide();
      // }
    },
    "filters": function(){
      console.log('filters changed!')
      this.updatePvUvList()
    },
    "daterange": function(){
      console.log('daterange changed!')
      this.updatePvUvList()
    }
    // "dataSource": function(){
    //   console.log('dataSource changed!')
    //   this.updatePvUvList()
    // }
  }
}
</script>

<style scoped lang="less">
  .dim-list {
    display: flex;
    width: 90%;
    flex-wrap: wrap;
  }
  .dim-item {
    margin-right: 5px;
  }
  .filter-dim {
    font-size: 18px;
  }
  .btn-del {
    margin-left: 10px;
  }
  .h {
    font-size: 24px;
    display: inline-block;
    margin-right: 1em;
    // margin-top: 1em;
  }
  .sampled-data {
    // background-color: red;
  }
  .date-range-agg-disp {
    // width: 90%;
  }
  .agg-result {
    text-align: center;
  }
  hr {
    margin-top: 1em;
  }
  // .lighting{
  //   color: red;
  // }
  .precise-link {
    color: black;
    font-size: 24px;
  }
  .precise-button {
    margin-left: 2em;
    margin-top: 1em;
  }
  .loader {
    height: 20px;
  }
  .line1,.line2 {
    display: flex;
    margin: 1em;
  }
  .datasource-part{
    flex-basis: 30%;
  }
  .daterange-part {
    flex-basis: 30%;
  }
  .uid-part {
    flex-basis: 30%;
  }
  .filter-part {
    border-style: solid;
    border-width: 1px;
    flex-basis: 20%;
  }
  .params-part {
    flex-basis: 60%;
    border-style: solid;
    border-width: 1px;
    flex-grow: 1;
    padding: 1em;
  }

  .filter-dim {
    display: inline-block;
    color: blue;
    flex-basis: 5%;
    // border-style: solid;
    // border-width: 1px;
    border-color: lightgray;
    margin-left: 1em;
    margin-top: 5px;
    text-align: center;
  }
  .filter-item {
    border-style: solid;
    border-width: 1px;
    padding: 1em 0.5em 0.5em 1em;
  }
  .line1_in3 {
    display: flex;
    justify-content: start;
    margin-top: 1em;
  }
  .line1_in3-button {
    display: inline-block;
    margin-right: 2em;
  }
  .fetch-data-fail-title {
    color: red;
    font-size: 2em;
  }
</style>

<style lang="less">
  .charts {
    width: 100%;
    height: 100%;
  }
  .dim-val-label {
    color: red;
  }
  .dim-val-null {
    color: lightgray;
  }
  .dim-val-label:hover{
    cursor: pointer;
  }
  .h2{
    font-size: 24px;
  }
  .h1{
    font-size: 36px;
  }

</style>
