promise 通过 then 的方式收集了回调，使用时把 resolve 传入的值作为参数传递进回调。回调会在 resolve() 之后触发。于是就把下次回调的使用权交给了这次的 resolve，所以可以使用链式调用的方式编写本应该嵌套的回调。

```js
new Promise((resolve, reject) =>{
  fs.readFile('a.js', (err, data) => {
    resolve(data)
  })
})
  .then(data => {
    return new Promise((resolve, reject) => {
      fs.readFile(‘b.js’, (err, data2) => {
        resolve(data2+data)
      })
    })
  })
  .then(res => {
    console.log(res)
  })
```

下面根据上面的思路模仿，只实现了还在 pending 时先执行 then 的延迟 resolve。其实还有 fulfilled 和 rejected 再调用 then 的情况。

```js
function Promise(fn) {
  const _self = this
  this.queue = []
  function resolve(val) {
    // 清空 then 收集的回调，如果返回 promise 则把控制权交给下一个 promise
    while (_self.queue.length) {
      const ret = _self.queue.shift()(val)
      if (ret instanceof Promise) {
        ret.queue = [...ret.queue, ..._self.queue]
        break
      } else {
        val = ret
      }
    }
    _self.queue.length = 0
    _self = null
  }

  this.then = function (cb) {
    this.queue.push(cb)
    return this
  }
}
```
