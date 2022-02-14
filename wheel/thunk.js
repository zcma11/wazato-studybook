function thunk(fn) {
  return function(...args) {
    return function(cb) {
      args.push(cb)
      fn.apply(this, args)
    }
  }
}

const readFile = thunk(fs.readFile)

function* foo() {
  const file1 = yield readFile('a.js')
  // 做一些事
  const file2 = yield readFile('b.js')
  // 做一些事
  const file3 = yield readFile('c.js')
  // 做一些事
}

function autoGen(genFn) {
  const g = genFn()

  function next(err, val) {
    const res = g.next(err, val)
    if (res.done) return
    res.value(next)
  }

  next()
}

autoGen(foo)