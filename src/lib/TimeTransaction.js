// 在time transaction中的callback，只有最后一个被执行
class TimeTransaction {
  startTransaction () {
    console.log('start time transaction')
    if (this.hInterval) {
      console.log('cleaning previous interval')
      clearInterval(this.hInterval)
    }
    this.startTime = new Date().getTime()
    // default transaction duration
    this.transactionDuration = 1000
    this.inTransaction = true
    this.callbackList = []
    this.curCount = 0
    this.counting = true
    this.hInterval = setInterval(() => {
      console.log(`pos1: this.counting = ${this.counting} this.curCount=${this.curCount}`)
      if (this.counting) {
        this.curCount = this.curCount + 1000
      }
      console.log(`pos2: this.counting = ${this.counting} this.curCount=${this.curCount}`)
      if (this.curCount >= this.transactionDuration) {
        console.log('hit transaction duration')
        if (this.callbackList.length > 0) {
          console.log('calling last callback when time transaction end [finalize]')
          this.callbackList[this.callbackList.length - 1]()
        }
        this.inTransaction = false
        clearInterval(this.hInterval)
        this.hInterval = undefined
      } else {
        console.log('not hit transaction duration')
      }
    }, 1000)
  }

  addCallback (cb) {
    if (this.inTransaction) {
      console.log('adding callback to time transaction [active]')
      this.callbackList.push(cb)
    } else {
      console.log('adding callback to time transaction [not active]')
      cb()
    }
  }

  disableCounting () {
    console.log('setting counting to false')
    this.counting = false
  }

  enableCounting () {
    console.log('setting counting to true')
    this.counting = true
  }
}

export default TimeTransaction
