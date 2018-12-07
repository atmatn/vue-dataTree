import moment from 'moment'
export const getDataSourceList = ({ url, type, body }) => {
  return {
    dataSources: [
      {
        value: 'mobileDictClient_android'.toLowerCase()
        // uidConf: {
        //   uidFieldList: ['imei', 'login_user'],
        //   defaultUidField: 'imei'
        // }
      },
      {
        value: 'FANYIAPP_iphone'.toLowerCase()
        // uidConf: {
        //   uidFieldList: ['imei'],
        //   defaultUidFizheeld: 'imei'
        // }
      },
      {
        value: 'mobiledictclient_perf'
        // uidConf: {
        //   uidFieldList: [],
        //   defaultUidField: null
        // }
      }]
    // dataSources: ['mobileDictClient_android', 'FANYIAPP_iphone', 'mobiledictclient_perf'].map(x => x.toLowerCase())
  }
}

export const getDataSourceDimList = ({ url, type, body }) => {
  // debugger
  var ds = JSON.parse(body).dataSource;
  var m = [ ds + '_d1' ]
  var dimValues = ['visitkey', 'key', 'keyfrom', 'type',
    'basepath', 'model', 'mid', 'vendor', 'block', 'le',
    'phoneversion', 'localversion', 'os', 'action', 'show',
    'setting', 'other', '_request', 'clipboard_query',
    'clipboard_query_click', 'clipboard_need_active',
    'clipboard_actived', 'set_clipboard_on', 'set_clipboard_off',
    'splash_ad_show', 'show_splash_ad_id', 'abtest', 'opensubbook',
    'openbook', 'tab', 'from', 'direct', 'optbookid', 'optparentbookid',
    'style', 'dailydur', 'update', 'count', '_username',
    'msgid', 'community', 'id', 'replyto', 'postid', 'channel', 'sound_length',
    'source', 'position', 'at', 'group', 'score', 'bec', 'cet6', 'kaoyan', 'gre',
    'gmat', 'toefl', 'sat', 'ielts', 'middle_school', 'high_school', 'cet4',
    'articleid', 'base_url', 'location', 'platform_lc', 'pos', 'rk', 'category_name',
    'network', 'video_type', 'screen', 'click', 'unit', 'head', 'resource_id', 'query',
    'method', 'shape', 'tag', 'strategy', 'reason', 'result', 'paid', 'answerid',
    'beginfrom', 'subscribed', 'coursecategory', 'base', 'outvendor', 'username',
    'platform', 'device', 'browser', 'iplocation', 'ipcom', 'ipcountry', 'ipprovince',
    'ip', 'referer', 'url', 'username_type', 'imei', 'qhead', 'qclassifier', 'keywords',
    'ts', 'ocravgtime', 'runduration', 'startappduration', 'queryduration', 'querywebdictduration',
    'querysentencesduration', 'querywikiduration', 'querytranduration', 'wordbookduration',
    'displayorderedbyascduration', 'displayorderedbydateduration', 'displayinshowingintpduration',
    'displayinhidingintpduration', 'duration', 'client_ts',
    'keywords_array', 'q', 'useragent', 'target', 'login_user', 'newimei', 'form',
    'infoid', 'role', 'state'].concat(m)

  var uidConf = {
    uidFieldList: ['imei', 'login_user'],
    defaultUidField: 'imei'
  }

  if (ds === 'mobiledictclient_perf') {
    dimValues = ['visitkey', 'action', 'other', 'type', 'network',
      'keyfrom', 'isdurationvalid', 'platform', 'device', 'browser',
      'iplocation', 'ipcom', 'ipcountry', 'ipprovince', 'ip', 'referer',
      'url', 'username_type', 'ts', 'duration', 'q', 'client_ts']
    uidConf = {
      uidFieldList: [],
      defaultUidField: null
    }
  }

  var dimCatList = [
    '常用参数', '设备、浏览器相关参数', '地域相关参数',
    'analyzer2自扩展参数', '自定义参数'].map(x => {
    return {
      value: x,
      dimList: []
    }
  })

  var dimList = []
  dimValues.forEach(x => {
    var idx = Math.floor(Math.random() * dimCatList.length)
    dimCatList[idx].dimList.push(x)
    dimList.push({
      value: x
    })
  })

  return {
    dimList,
    dimCatList,
    uidConf: uidConf
  }
}

// export const getDimGroupByAgg = ({ url, type, body }) => {
//   var b = JSON.parse(body)
//   var { dataSource, aggs, groupByDims } = b
//   var curDim = b.curDim
//   var arr = []

//   var curObj = []
//   function fill(depth) {
//     if (depth > groupByDims.length) {
//       arr.push([...curObj])
//     } else {
//       for (var i = 0; i < 10; i++) {

//       }
//     }
//   }
//   // var pv
//   // var uv
//   for (var i = 0; i < 100; i++) {
//     // pv = 300 + Math.round(Math.random() * 100)
//     // uv = Math.round(pv * Math.random()) + 1
//     let lineObj = { 'dim_val': curDim + '_value_' + i }
//     aggs.forEach(agg => {
//       lineObj[agg.name] = 300 + Math.round(Math.random() * 100)
//     })
//     arr.push(
//       lineObj
//     )
//     arr = arr.sort((a, b) => b.uv - a.uv)
//     // debugger
//   }

//   var isSampled = (ds === 'mobiledictclient_android' && (b.filters === undefined || b.filters.length === 0))

//   if (isSampled) {
//     return {
//       dimGroupByAggData: arr,
//       isSampled,
//       sampleType: '1/32',
//       preciseSql: `
//       -- 这个SQL是仅用于示意，不保证能够成功运行！
//       select count(*) PV, count(distinct imei) UV from dso.${ds}
//        where day = '${day}' and ... group by '${curDim}';
//       `
//     }
//   } else {
//     return {
//       isSampled,
//       dimGroupByAggData: arr
//     }
//   }
// }

export const getDateRangeAgg = ({ url, type, body }) => {
  var b = JSON.parse(body)
  // var dataSource = b.dataSource
  var fromDate = b.dateRange.from
  var toDate = b.dateRange.to
  var ds = b.dataSource
  var groupByList = b.groupByList || []
  var filters = b.filters
  var allowLimit = b.allowLimit
  var allowSample = b.allowSample

  var dataList = []
  var pv
  // debugger

  var curObj = {}
  // -1 表示day, >=0 表示groupBy的dim
  function fill (depth) {
    if (depth >= groupByList.length) {
      dataList.push({ ...curObj })
    } else if (depth === -1) {
      for (var day = fromDate; day <= toDate; day = moment(day + 'T00:00:00').add(1, 'days').format('YYYY-MM-DD')) {
        curObj['day'] = day
        fill(depth + 1)
      }
    } else {
      // groupBy dim
      var groupByItem = groupByList[depth]
      for (var i = 0; i < 10; i++) {
        curObj[groupByItem] = (i === 0 ? null : (groupByItem + '_' + i))
        fill(depth + 1)
      }
    }
  }

  // 生成数据行
  fill(-1)

  dataList.forEach(item => {
    b.aggs.forEach(agg => {
      item[agg.name] = Math.round(10000000000 * Math.random())
    })
    // 保证UV小于UV
    if (item['pv'] !== undefined && item['pv'] > 0) {
      if (item['uv'] !== undefined && item['uv'] > item['pv']) {
        item['uv'] = Math.round(item['pv'] * Math.random())
      }
    }
  })

  var isSampled = allowSample && (ds === 'mobiledictclient_android' && (b.filters === undefined || b.filters.length === 0))

  var selectExprForGroupBy = groupByList.map(x => `,\`${x}\``).join(' ')
  var groupByExprForGroupBy = ' group by day ' + selectExprForGroupBy

  var whereExprForFilters = filters.map(filter => {
    if (filter.operator === '=') {
      return `and \`${filter.dim}\` = '${filter.dimVal}'`
    } else if (filter.operator === 'ignore_case_like') {
      return `and lower(\`${filter.dim}\`) like '%${filter.dimVal.toLowerCase()}%'`
    } else if (filter.operator === 'is_null') {
      return `and \`${filter.dim}\` is null`
    } else if (filter.operator === 'is_not_null') {
      return `and \`${filter.dim}\` is not null`
    }
  }).join(' ')

  var preciseSql = `
  -- 这个SQL是仅用于示意，不保证能够成功运行！
  select count(*) PV, count(distinct imei) UV, day ${selectExprForGroupBy} from dso.${ds}
   where day between '${fromDate}' and '${toDate}' ${whereExprForFilters}
   ${groupByExprForGroupBy} ;
  `

  var isLimited = false
  var limitNum = null
  const limitLength = 10000
  if (allowLimit && groupByList.length > 0 && dataList.length > limitLength) {
    isLimited = true
    limitNum = limitLength
    dataList = dataList.sort((a, b) => {
      if (a.pv && b.pv) {
        return b.pv - a.pv
      } else {
        return 0
      }
    }).slice(0, limitLength)
  }

  // debugger
  if (isSampled) {
    return {
      dateRangeAggData: dataList,
      isSampled,
      sampleType: '1/32',
      preciseSql,
      isLimited,
      limitNum
    }
  } else {
    return {
      dateRangeAggData: dataList,
      isSampled,
      isLimited,
      limitNum,
      preciseSql
    }
  }
}

export const updateDimCatList = ({ url, type, body }) => {
  // 啥也不干
  return {

  }
}

export const getQueries = () => {
  return [{
    'queryId': 'lisn_20181204_164371_2',
    'disableCache': false,
    'allowSample': true,
    'planOnly': false,
    'sampled': false,
    'sampleType': 0,
    'user': 'lisn',
    'startTs': 1543913039717,
    'completedItems': 2,
    'waitingItems': 5,
    'elapsedSecs': 2,
    'maxWaitSecs': 120,
    'status': 'running',
    'statusText': null
  }, {
    'queryId': 'lisn_20181204_164371_2',
    'disableCache': false,
    'allowSample': true,
    'planOnly': false,
    'sampled': false,
    'sampleType': 0,
    'user': 'lisn',
    'startTs': 1543913039717,
    'completedItems': 2,
    'waitingItems': 5,
    'elapsedSecs': 2,
    'maxWaitSecs': 120,
    'status': 'running',
    'statusText': null
  }, {
    'queryId': 'lisn_20181204_164371_2',
    'disableCache': false,
    'allowSample': true,
    'planOnly': false,
    'sampled': false,
    'sampleType': 0,
    'user': 'lisn',
    'startTs': 1543913039717,
    'completedItems': 2,
    'waitingItems': 5,
    'elapsedSecs': 2,
    'maxWaitSecs': 120,
    'status': 'running',
    'statusText': null
  }, {
    'queryId': 'lisn_20181204_164371_2',
    'disableCache': false,
    'allowSample': true,
    'planOnly': false,
    'sampled': false,
    'sampleType': 0,
    'user': 'lisn',
    'startTs': 1543913039717,
    'completedItems': 2,
    'waitingItems': 5,
    'elapsedSecs': 2,
    'maxWaitSecs': 120,
    'status': 'running',
    'statusText': null
  }, {
    'queryId': 'lisn_20181204_164371_2',
    'disableCache': false,
    'allowSample': true,
    'planOnly': false,
    'sampled': false,
    'sampleType': 0,
    'user': 'lisn',
    'startTs': 1543913039717,
    'completedItems': 2,
    'waitingItems': 5,
    'elapsedSecs': 2,
    'maxWaitSecs': 120,
    'status': 'running',
    'statusText': null
  }, {
    'queryId': 'lisn_20181204_164371_2',
    'disableCache': false,
    'allowSample': true,
    'planOnly': false,
    'sampled': false,
    'sampleType': 0,
    'user': 'lisn',
    'startTs': 1543913039717,
    'completedItems': 2,
    'waitingItems': 5,
    'elapsedSecs': 2,
    'maxWaitSecs': 120,
    'status': 'running',
    'statusText': null
  }, {
    'queryId': 'lisn_20181204_164371_2',
    'disableCache': false,
    'allowSample': true,
    'planOnly': false,
    'sampled': false,
    'sampleType': 0,
    'user': 'lisn',
    'startTs': 1543913039717,
    'completedItems': 2,
    'waitingItems': 5,
    'elapsedSecs': 2,
    'maxWaitSecs': 120,
    'status': 'running',
    'statusText': null
  }, {
    'queryId': 'lisn_20181204_164350_1',
    'disableCache': false,
    'allowSample': true,
    'planOnly': false,
    'sampled': true,
    'sampleType': 8,
    'user': 'lisn',
    'startTs': 1543913037499,
    'completedItems': 0,
    'waitingItems': 0,
    'elapsedSecs': 0,
    'maxWaitSecs': 120,
    'status': 'success',
    'statusText': null
  }]
}
