import axios from 'axios'
import store from '@/store'

var sleepTime = 0
if (process.env.NODE_ENV !== 'production') {
  sleepTime = 1000
}

var incrementBy = function (val) {
  store.dispatch('incrementQueringCount', { val })
}

class HttpRequest {
  request (params) {
    // debugger
    incrementBy(1)
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        axios.request(params).then(
          res => {
            resolve(res)
            incrementBy(-1)
          }
        ).catch(e => {
          incrementBy(-1)
          reject(e)
        })
      }, sleepTime)
    })
  }

  post (url, payload) {
    // debugger
    incrementBy(1)
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        axios.post(url, payload).then(
          res => {
            incrementBy(-1)
            resolve(res)
          }
        ).catch(e => {
          incrementBy(-1)
          reject(e)
        })
      }, sleepTime)
    })
  }
}

export default HttpRequest
