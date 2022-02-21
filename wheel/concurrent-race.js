async function asyFn(fun, max = 4, total = 200) {
  let completed = 0
  let working = []
  let result = []
  console.time('耗时')
  for (let i = 1; i <= total; i++) {
    const execute = Promise.resolve()
      .then(async () => {
        const res = await fun()
        result.push(res)
        completed++
        console.log('并发：' + working.length, completed + '/' + total)
        const j = working.findIndex(f => f === execute)
        j > -1 && working.splice(j, 1)
      })
      .catch(() => {
        result.push(null)
        completed++
        console.log('失败','并发：' + working.length, completed + '/' + total)
        const j = working.findIndex(f => f === execute)
        j > -1 && working.splice(j, 1)
      })
    working.push(execute)

    if (working.length === max) {
      await Promise.race(working)
    }
  }
  console.timeEnd('耗时')
  return Promise.all(working).then(() => result)
}

const test = async () => {
  const delay = (Math.random() * 3000).toFixed()
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.5 ? resolve(delay) : reject(delay)
    }, delay)
  })
}
setTimeout(async () => {
  const r = await asyFn(test, 4, 20)
  console.log(r)
})
