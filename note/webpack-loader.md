### webpack.config.js

在配置文件中引入 loader，可以通过 resolveLoader.alias，或者 resolveLoader.modules， 或者使用的时候 loader: 绝对路径。

```js
{
  resolveLoader: {
    alias: {
      myloa: path.resolve(__dirname, 'loaders/myloader.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'myloa'
      }
    ]
  }
}
```

### loader

https://www.webpackjs.com/api/loaders/
https://juejin.cn/post/7036379350710616078#heading-11
https://zhuanlan.zhihu.com/p/104205895
https://zhuanlan.zhihu.com/p/63198605

js 文件中导出一个函数，可以给函数挂上一个静态方法 pitch。有 pitch 将会先执行 pitch，返回非 undefined 时打断 loader 链条。

```js
module.export = function myloa(content, map, meta) {
  console.log(content)
  /* 异步 */
  const callback = this.async()
  callback(null, content, map, meta)
  /* 同步 1 */
  this.callback(null, content, map, meta)
  /* 同步 2 */
  return content
}

myloa.pitch = function (remainingRequest, precedingRequest, data) {
  // 返回非 undefined 会 中断loader，用返回值返回去执行之前的loader
  return 'xxxxxxxx'
}
```
