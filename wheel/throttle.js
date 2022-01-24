;(function (global) {
  global.$throttle = (fn, delay) => {
    let timer = undefined
    return e => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fn(e)
        timer = undefined
      }, delay)
    }
  }
})(globalThis)
