import $ from 'jquery'
import Vue from 'vue'
import _ from 'underscore'
import { downloadCsv } from '@/lib/tools'
import { Table, Button } from 'iview'
import { timeFormatter, autoFormat } from '@/lib/format'
import '@/lib/custom-script.css'
import echarts from 'echarts'

const NoResult = NaN

function isHeadless () {
  return false
}

function createTable (title) {
  var tmpl =
  `
  <div class="custom-table-div"><h2><%= title %></h2>
      <table class="custom-table"></table>
      <div class="download-button-wrap">
      <button class="download-button-utf8">下载表格(csv, utf8编码)</button>
      <button class="download-button-gbk">下载表格(csv, gbk编码)</button></div>
  </div>
  `
  return _.template(tmpl)({ title: title })
}

function createTableHeader (headers, userClassMap, hideDate) {
  var tmpl =
  `<thead><tr><th class="date">日期</th>
      <% for(var i=0; i<headers.length; i++) {%>
      <th class="<%- userClassMap[headers[i]] %>"><%- headers[i] %></th>"+
      <% } %>
      </tr></thead>
  `
  var f = _.template(tmpl)
  var html = f({ headers: headers, userClassMap: userClassMap })
  var $elem = $(html)
  if (hideDate) {
    $elem.find('.date').hide()
  }
  return $elem
}

function createTableBody () {
  var tmpl = '<tbody></tbody>'
  return _.template(tmpl)({})
}

function createTableLine (time, headers, values, attachDataList, userClassMap, hideDate) {
  var tmpl =
  `
  <tr>
    <td class="date"><%- time %></td>
    <% for(var i=0; i<values.length; i++) {%>
      <td class="colVal <%- userClassMap[headers[i]] %>"><%= autoFormat(headers[i], values[i]) %></th>
    <% } %>
    </tr>
  `
  var f = _.template(tmpl)
  var html = f({
    time: timeFormatter(time),
    values: values,
    headers: headers,
    userClassMap: userClassMap,
    autoFormat: autoFormat
  })
  var $tableLine = $(html)

  // 对周末进行特殊处理
  var treatAsWeekend = false
  var datePattern = /(\d{4}-\d{2}-\d{2})/
  var m = ('' + time).match(datePattern)
  if (m != null) {
    var nDay = Date.dateStrToIntDay(m[0])
    var nWeekday = nDay % 7
    if (nWeekday === 2 || nWeekday === 3) {
      treatAsWeekend = true
    }
  }
  if (treatAsWeekend) {
    $tableLine.addClass('weekend')
  }

  if (hideDate) {
    $tableLine.find('.date').hide()
  }
  var $tdList = $tableLine.find('.colVal')
  for (var i = 0; i < headers.length; i++) {
    var attachData = attachDataList[ i ] || {}
    var $td = $($tdList[i])
    $td.data('attachData', attachData)
    if (attachData.css !== undefined) {
      // debugger
      $td.css(attachData.css)
    }
    if (attachData.addClass !== undefined) {
      $td.addClass(attachData.addClass)
    }
    if (attachData.callback !== undefined) {
      attachData.callback($td, attachData)
    }
  }
  return $tableLine
}

export const drawTable = function (params) {
  var table = params.source
  var title = params.title
  var data = table.data
  var cols = table.cols
  if (typeof (data) !== 'object' || !(data instanceof Array)) {
    if (typeof (data) === 'string' && data.indexOf('ERROR') >= 0) {
      alert('查询失败：' + data)
    } else {
      // debugger
      alert("drawTable(): 'data' 参数错误！")
    }
    return
  }
  if (typeof (cols) !== 'object' || !(cols instanceof Array)) {
    // debugger
    alert("drawTable(): 'cols' 参数错误！")
    return
  }
  var renderMap = params.renderMap
  var renderHeaderMap = params.renderHeaderMap
  var headerMap = params.headerMap
  var widthMap = params.widthMap
  var fixedMap = params.fixedMap || {}
  var $target = params.$target
  var inlineStyle = params.inlineStyle || {}
  var tableHeight = ''
  if (typeof (params.tableHeight) === 'number') {
    tableHeight = params.tableHeight
  } else if (typeof (params.tableHeight) === 'string') {
    var m = params.tableHeight.match(/^(.*)%/)
    if (m != null) {
      tableHeight = $(window).height() * (m[1] / 100)
    }
  }
  var useSimpleTable = (params.simple === true)
  var $newElem = $('<div>')
  $target.append($newElem)

  var e = $newElem[0]

  if (!isHeadless() && data.length < 3000 && !useSimpleTable) {
    var v = new Vue({
      el: e,
      // template: '<div class="draw-table-div" v-bind:style="inlineStyle"><h2 class="h2">{{title}}</h2><i-table stripe border :columns="cols" :data="data" :height="height">abc</i-table><i-button @click="downloadClick(\'UTF-8\')">下载表格(csv, utf8编码)</i-button> <i-button @click="downloadClick(\'GBK\')">下载表格(csv, gbk编码)</i-button></div>',
      render (h) {
        // '<div class="draw-table-div" v-bind:style="inlineStyle"><h2 class="h2">{{title}}</h2><i-table stripe border :columns="cols" :data="data" :height="height">abc</i-table><i-button @click="downloadClick(\'UTF-8\')">下载表格(csv, utf8编码)</i-button> <i-button @click="downloadClick(\'GBK\')">下载表格(csv, gbk编码)</i-button></div>',
        return (
          <div class="draw-table-div" style={inlineStyle}>
            <h2 class="h2">{this.title}</h2>
            <Table stripe border columns={this.cols} data={this.data} height={this.height}></Table>
            <Button onClick={this.downloadClick.bind(this, 'UTF-8')}>下载表格(csv, utf8编码)</Button>
            <Button onClick={this.downloadClick.bind(this, 'GBK')}>下载表格(csv, gbk编码)</Button>
          </div>
        )
      },
      data: function () {
        return {
          height: tableHeight,
          inlineStyle: inlineStyle,
          title: title !== undefined ? title : '表格',
          cols: _.map(cols, function (c) {
            var h
            if (headerMap !== undefined &&
                    headerMap[c] !== undefined) {
              h = headerMap[c]
            } else {
              h = c
            }
            var render
            if (renderMap !== undefined &&
                    renderMap[c] !== undefined) {
              render = renderMap[c]
            }
            var renderHeader
            if (renderHeaderMap !== undefined &&
                renderHeaderMap[c] !== undefined) {
              renderHeader = renderHeaderMap[c]
            }
            var fixed
            if (fixedMap !== undefined &&
              fixedMap[c] !== undefined) {
              fixed = fixedMap[c]
            }

            var width
            if (widthMap !== undefined &&
                widthMap[c] !== undefined) {
              width = widthMap[c]
            } else if (widthMap !== undefined && widthMap['default'] !== undefined ) {
              width = widthMap['default']
            }
            return {
              title: h,
              key: c,
              sortable: true,
              render: render,
              renderHeader: renderHeader,
              width: width,
              fixed: fixed
            }
          }),
          data: data
        }
      },
      methods: {
        downloadClick: function (encoding) {
          // debugger
          downloadCsv(cols, data, encoding)
        }
      }
    })
  } else {
    debugger
    var tblHtml = createTable(title)
    var $tbl = $(tblHtml)
    var colNames = _.map(cols, function (x) {
      if (headerMap !== undefined && headerMap[x] !== undefined) {
        return headerMap[x]
      } else {
        return x
      }
    })
    var $thead = createTableHeader(colNames, {}, true)
    var $tbody = $(createTableBody())
    for (var i = 0; i < data.length; i++) {
      var values = []
      for (var j = 0; j < cols.length; j++) {
        values.push(data[i][cols[j]])
      }
      $tbody.append(createTableLine('', cols, values, [], {}, true))
    }
    $tbl.find('.custom-table').append($thead)
    $tbl.find('.custom-table').append($tbody)
    $newElem.append($tbl)

    var $downloadButtonUtf8 = $tbl.find('.download-button-utf8')
    $downloadButtonUtf8.on('click', function () {
      downloadCsv(cols, data, 'UTF-8')
    })

    var $downloadButtonGBK = $tbl.find('.download-button-gbk')
    $downloadButtonGBK.on('click', function () {
      downloadCsv(cols, data, 'GBK')
    })
  }
}

export const drawChart = function (params) {
  if (isHeadless()) {
    return
  }
  var table = params.source
  var title = params.title
  var chartType = params.chartType || 'line'
  var data = table.data
  var headerMap = params.headerMap
  // var cols = table.cols
  var x = params.x
  var yList = params.yList || [params.y]
  var $target = params.$target
  // var width = params.width
  var $newElem = $('<div>').addClass('echarts')
  $target.append($newElem)

  var e = $newElem[0]

  var xAxisData = _.map(data, function (lineData) {
    return lineData[x]
  }).reverse()

  var theTitle
  if (params.showTitle === false) {
    theTitle = {}
  } else {
    theTitle = {
      fontFamily: '宋体',
      text: title
    }
  }

  var theXAxis
  var theYAxis
  if (chartType === 'line') {
    theXAxis = [{
      type: 'category',
      boundaryGap: false,
      data: xAxisData
    }]
    theYAxis = [{
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    }]
  } else if (chartType === 'bar') {
    theXAxis = [{
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisTick: {
        interval: 0
      },
      axisLabel: {
        interval: 0,
        rotate: 45
      }
    }]

    if (params.yAxisFormatter) {
      theYAxis = [{
        type: 'value',
        axisLabel: {
          formatter: this.yAxisFormatter
        }
      }]
    } else {
      theYAxis = [{
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        }
      }]
    }
  }

  var preDefineColors = [
    '#f64747', '#26c281', '#f7ca18', '#f9690e', '#4183d7',
    '#f288ac', '#4ecdc4', '#be90d4', '#dd834e', '#22a7f0',
    '#ce114b', '#6ca5b6', '#663399', '#8e4e77', '#e6a133',
    '#9bd2eb', '#2a7c65', '#dd6370', '#c3bd22' //,'#bfbfbf'
  ]
  var preDefineSymbols = ['circle', 'rect', 'triangle', 'diamond']


  var seriesType
  if (chartType == 'line') {
    seriesType = 'line'
  } else if (chartType == 'bar') {
    seriesType = 'bar'
  }

  var tooltipFormatter = params.tooltipFormatter
  var labelFormatter = params.labelFormatter

  var seriesItem
  var series = []
  var dontDrawUndef = true
  // debugger
  for (var i = 0; i < yList.length; i++) {
    var symbol
    symbol = preDefineSymbols[i % preDefineSymbols.length]

    seriesItem = {
      name: '',
      type: seriesType,
      data: [],
      symbol: symbol,
      symbolSize: 10,
      itemStyle: {
        normal: {
          label: {
            show: (labelFormatter !== undefined),
            position: 'top',
            formatter: labelFormatter
          }
        }
      }
    }

    seriesItem.data = _.map(data, function (lineData) {
      var value = lineData[yList[i]]
      if (value === undefined || isNaN(value)) {
        value = dontDrawUndef ? undefined : 0
      } else if (value === NoResult && !$.isNumeric(value)) {
        value = dontDrawUndef ? undefined : 0
      }
      return value
    }).reverse()
    var seriesName
    if (headerMap && headerMap[yList[i]] != undefined) {
      seriesName = headerMap[yList[i]]
    } else {
      seriesName = yList[i]
    }
    seriesItem.name = seriesName
    series.push(seriesItem)
  }


  var theLegend = {
    data: _.map(series, function (x) {
      return x.name
    }),
    bottom: 0
  }

  var colors = preDefineColors.concat([])
  var option = {
    grid: [{
      x: 80,
      y: '10%',
      width: '80%',
      height: '70%'
    }],
    backgroundColor: '#FFFFFF', //背景色
    color: colors,
    title: theTitle,
    tooltip: {
      trigger: 'axis',
      formatter: tooltipFormatter
    },
    // grid : {
    //     bottom: 80
    // },
    legend: theLegend,
    toolbox: {
      show: true,
      feature: {
        mark: {
          show: true
        },
        dataView: {
          show: true,
          readOnly: false
        },
        magicType: {
          show: true,
          type: ['line', 'bar']
        },
        restore: {
          show: true
        },
        saveAsImage: {
          backgroundColor: 'white',
          show: true
        },
        myTool1: {
          show: true,
          title: '隐藏图片',
          icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
          onclick: function (arg, arg2) {
            // var $padding = $('<div>').css({
            //     'width': '30%',
            //     'height': '1em'
            // })
            var $padding = $('<div>').css({
              'display': 'block'
            })
            var $btn = $('<button>显示图片</button>')
            $padding.append($btn)
            $btn.on('click', function () {
              $old.show()
              $padding.remove()
            })

            var $old = $(arg2.getDom())
            $padding.insertAfter($old)
            $old.hide()
            //alert('myToolHandler1')
          }
        }
      }
    },
    calculable: true,
    xAxis: theXAxis,
    yAxis: theYAxis,
    series: series
  }

  // debugger
  var myChart = echarts.init(e)
  myChart.setOption(option)
}
