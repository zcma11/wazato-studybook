## 如何编写 webpack plugin

### 首先需要有一个带有 apply 方法的对象。

```js
// 可以用实例，这样的好处是可以暴露出插件的配置对象。
module.exports = class myplugin {
  constructor(option) {}
  apply() {}
}

plugins: [new myplugin()]

// 也可以直接返回对象
module.exports = {
  apply() {}
}

plugins: [myplugin]
```

apply 方法会接收一个参数 compiler。来自于 webpack 的 Compiler。里面有解析的钩子 hooks，webpack 配置对象，fileSystem 等。可以通过 hooks 在各个生命周期注册事件，修改对应的 compilation。如果是异步的话，除了 compilation 会接受第二个参数 callback。用来结束异步的等待，类似于 resolve。compilation 也有自己的 hooks，用同样的方法使用。

更多 hooks：[compiler 钩子 | webpack 中文文档 (docschina.org)](https://webpack.docschina.org/api/compiler-hooks/)

### 结合 tapable 注册对应的事件的方法。主要有 3 种。

```
// 同步调用
hooks.xxx.tap("MyPlugin", (arg: Compiler) => {});
// 异步调用，类似于通过 callback 进行 resolve()
hooks.xxx.tapAsync("MyPlugin", (arg: Compiler, callback) => {});
// 返回 promise 的异步调用，自己 resolve() 外面应该是套了一个 await 的，或者 then
hooks.xxx.tapPromise("MyPlugin", (arg: Compiler):Promise<any> => {});
```

### 简单的尝试

写一个简单的 clean-webpack-plugin，功能在打包输出前清除 ouput 的目录。

```js
const path = require('path')
const fs = require('fs')

module.exports = class myplugin {
  apply(compiler) {
    this.compiler = compiler
    const basePath = compiler.options.output.path
    if (this.isDirectory(basePath)) {
      const dirList = compiler.inputFileSystem.readdirSync(basePath)
      compiler.hooks.emit.tap('my-plugin', () => {
        // emit 是在输出到 output 之前执行的生命周期
        this.del(basePath, dirList)
      })
    } else {
      throw Error(`${basePath} 路径不存在`)
    }
  }

  del(basePath, dirList) {
    // 进行递归删除文件夹下面的内容
    dirList.forEach(name => {
      const p = path.join(basePath, name)
      if (this.isDirectory(p)) {
        const list = this.compiler.inputFileSystem.readdirSync(p)
        this.del(p, list)
        fs.rmdirSync(p)
      } else {
        fs.unlinkSync(p)
      }
    })
  }

  isDirectory(path) {
    const fileSystem = this.compiler.inputFileSystem
    try {
      return fileSystem.lstatSync(path).isDirectory()
    } catch {
      return false
    }
  }
}
```
