import _ from 'underscore'
import $ from 'jquery'
import echarts from 'echarts'
const histPattern = /分布/i
const forceRatioPattern = /%$/
const ratioPattern = /ratio|率|比例/i
const intPattern = /uv|session(?!_avg_action)|用户数/i

export const limitFraction = function limitFraction (data) {
  if ((data + '').indexOf('.') < 0) {
    return data
  }
  var strData = parseFloat(data) * 100
  strData = Math.round(strData)
  strData /= 100.00
  return strData
}

export const toPercent = function toPercent (data) {
  var strData = limitFraction(data * 100)
  var ret = strData.toString() + '%'
  return ret
}

function staySecFormatter (data) {
  // 时长format
  function spanFmt (s) {
    if (s < 60) {
      return s + '秒'
    } else if (s <= 3600) {
      var m = s / 60
      if (Math.floor(m) - m <= 0.01) {
        return Math.floor(m) + '分'
      } else {
        return (s / 60) + '分'
      }
    } else {
      return (s / 3600) + '小时'
    }
  }
  // 半开半闭区间 (fromSec,toSec]
  function rangeFmt (fromSec, toSec) {
    // 双值，from - to
    if (toSec === 0) {
      return '0'
    } else {
      return spanFmt(fromSec + 1) + ' - ' + spanFmt(toSec)
    }
  }

  var tmpl = `
      <button class="toggle-button-for-hist-of-session-stay">显示/隐藏</button><table class="hist-of-session-stay">
      <tr><th>时长</th><th>数量(估算)</th><th>比例(估算)</th></tr>
      <%for(var i=0; i<data.breaks.length-1; i++){%>
      <tr><td><%- rangeFmt(data.breaks[i], data.breaks[i+1]) %></td><td><%- data.counts[i] %></td><td><%- toPercent(data.counts[i]/total) %></td></tr>
      <%}%>" +
      </table>
  `

  var total = 0
  for (var i = 0; i < data.breaks.length - 1; i++) {
    total += data.counts[i]
  }
  if (total === 0) {
    return '<span>(暂无数据)</span>'
  }

  return _.template(tmpl,
    {
      data: data,
      rangeFmt: rangeFmt,
      total: total,
      toPercent: toPercent
    })
}

var curChartId = 0

export const autoFormat = function autoFormat (hdr, val) {
  if (hdr === undefined) {
    debugger
  }
  if (val === undefined) {
    return ''
  }
  if (hdr instanceof RegExp) {
    hdr = hdr + ''
  }

  if (val instanceof RegExp) {
    val = val + ''
  }
  if (hdr.toLowerCase().indexOf('json') >= 0) {
    return "<pre style='text-align:left'>" + val + '</pre>'
  }

  if (histPattern.test(hdr) && typeof (val) !== 'string') {
    try {
      return staySecFormatter(JSON.parse(val))
    } catch (e) {
      return '(暂无数据)'
    }
  } else if (ratioPattern.test(hdr) && val > 0 && val < 1) {
    return toPercent(val)
  } else if (ratioPattern.test(hdr) && forceRatioPattern.test(hdr)) {
    return toPercent(val)
  } else if (hdr === 'delta%') {
    return (val > 0 ? '+' : '') + toPercent(val)
  } else if (val === null) {
    return '(null)'
  } else if (val === '!null') {
    return '(not null)'
  } else if (typeof (val) === 'number' || Number(val) + 0 === Number(val)) {
    if (intPattern.test(hdr)) {
      return Math.round(val)
    } else if (Number(val) + '' === '' + Math.round(val)) {
      return val
    } else {
      return limitFraction(val)
    }
  } else if (typeof (val) === 'object' && val.href !== undefined && val.text !== undefined) {
    // link
    var r = _.template('<a href="<%- href%>"><%- text%></a>', val)
    return r
  } else if (val.indexOf('<pre>') === 0) {
    return val
  } else if (val.indexOf('<div') === 0) {
    return val
  } else if (val.indexOf('echarts=') === 0) {
    // draw echarts
    var echartsData = JSON.parse(val.substring('echarts='.length))
    var chartId = curChartId++
    var newElement = _.template(`<div id="echart_<%-chartId%>" class="<%- addClass%>">chart</div>`, {
      chartId: chartId,
      addClass: echartsData.addClass
    })
    setTimeout(function () {
      // debugger;
      var $chart = $('#echart_' + chartId)
      var myChart = echarts.init($chart[0])
      myChart.setOption(echartsData.option)
    }, 0)
    return newElement
  } else {
    return $('<div>').text(val).html()
  }
}

var regDay = new RegExp('^(.*)T00:00:00$')
export var timeFormatter = function (text) {
  var t = (text + '').substring(0, 19)
  var matchResult = t.match(regDay)
  if (matchResult) {
    return matchResult[1]
  } else if (t.indexOf('T') > 0) {
    return t.replace('T', ' ')
  } else {
    return text
  }
}
