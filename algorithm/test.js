function test(f, a, b) {
  a.shift()
  const obj = new f(...b.shift())
  a.forEach((item, index) => {
    console.log(obj[item](...b[index]))
  })
}