function co(gen) {
  return new Promise((resolve, reject) => {
    const g = gen()
    onFulfilled()

    function onFulfilled(val) {
      let ret
      try {
        ret = g.next(val)
      } catch (e) {
        reject(e)
      }
      next(ret)
    }

    function onRejected(val) {
      let ret
      try {
        ret = g.next()
      } catch (e) {
        reject(e)
      }
      next(ret)
    }

    function next({ value, done }) {
      if (done) return resolve(value)
      // 4.x 版本转成 promise，如果是对象和数组会使用 Promise.all，不转基础数据
      const v = toPromise(value)
      if (v instanceof Promise) {
        v.then(onFulfilled, onRejected)
      } else {
        onRejected('error')
      }
    }
  })
}

function* gen() {
  try {
    yield Promise.reject(1)
  } catch (e) {
    // throw 抛出的错 1
  }
  // 判断 generator 的方式有 gen.constructor.toString 或者 gen.constructor.name，
  // 内部转Promise的时候递归 co 就可以，都是返回 promise
  yield function* foo() {}
  // 遍历对象转 promise，可能递归，输出一个数组
  yield {}
  // 每个元素转 promise 是个可能会发生递归，然后 Promise.all
  yield []
  // 转化的时候包装一层 promise，内部调用 thunk 并将 resolve 写在回调里面。
  yield thunk
}

co(gen).then(res => {
  console.log(res)
})
