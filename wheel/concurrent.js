async function asyFn(fun, max = 4, total = 200) {
  let count = 0
  let curNum = 0
  let result = []
  console.time('耗时')
  while (count < total) {
    if (curNum < max) {
      result.push(
        Promise.resolve().then(async (a) => {
          const res = await fun()
          console.log('并发：' + curNum, count + '/' + total)
          curNum--
          return res
        })
      )
      count++
      curNum++
    } else {
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 15)
      })
    }
  }

  console.timeEnd('耗时')
  return Promise.all(result)
}

const test = async () => {
  const delay = (Math.random() * 3000).toFixed()
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve(delay)
    }, delay)
  })
}
setTimeout(async () => {
  const r = await asyFn(test, 4, 20)
  console.log(r)
})
