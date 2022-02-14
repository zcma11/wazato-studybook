function asyncLog(msg, cb) {
  setTimeout(() => {
      console.log(msg)
      cb && cb()
  }, 1000)
}
var asyncLogThunk = msg => cb => asyncLog(msg, cb)

const t1 = asyncLogThunk('t1')
const t2 = asyncLogThunk('t2')
const t3 = asyncLogThunk('t3')
const t4 = asyncLogThunk('t4')
const arr = [t1, t2, t3, t4]
const gen = args => () => args.reduceRight((a, b) => () => b(() => a()))
const p = gen(arr)
p()()