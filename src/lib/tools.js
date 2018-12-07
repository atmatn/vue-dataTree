import CSV from 'comma-separated-values'
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  else return !keysArr1.some(key => obj1[key] !== obj2[key])
}

export const downloadCsv = function downloadCsv (cols, data, encoding) {
  var reshapeData = []
  for (var i = 0; i < data.length; i++) {
    var reshapeLine = []
    for (var col = 0; col < cols.length; col++) {
      var val = data[i][ cols[col] ]
      if (val === undefined || val === null) {
        val = ''
      }
      reshapeLine.push(val)
    }
    reshapeData.push(reshapeLine)
  }
  // https://github.com/knrz/CSV.js/
  var csvText = new CSV(reshapeData, { header: cols }).encode()

  // var s = "";
  // s += _.map(cols, escapeCsv).join(",") + "\n";
  // for(var i=0; i<data.length; i++ ) {
  //     s += _.map(cols, function(x){
  //         return escapeCsv(data[i][x]);
  //     }).join(",")+ "\n";;
  // }
  download('download.csv', csvText, encoding)
}

// encoding only supports: 'UTF-8' and 'GBK'
export const download = function download (filename, text, encoding) {
  $.ajax({
    method: 'POST',
    url: '/downloadByPost',
    data: {
      content: text,
      encoding: encoding,
      filename: filename
    },
    success: function (d) {
      downloadEncodedAsFile(filename, encoding, d)
    }
  })
}
export const downloadEncodedAsFile = function downloadEncodedAsFile (filename, encoding, encoded) {
  var element = document.createElement('a')
  var charset
  var bom
  if (encoding === 'UTF-8') {
    bom = '%EF%BB%BF'
    charset = 'utf-8'
  } else {
    bom = ''
    charset = 'gbk'
  }
  element.setAttribute('href', 'data:text/csv;charset=' + charset + ',' + bom + encoded)
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()
  document.body.removeChild(element)
}
