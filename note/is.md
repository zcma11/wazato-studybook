is 关键字具有类型保护的作用还能缩小参数范围，常用在类型判断的函数上。因为类型判断函数一般只返回布尔值 true 和 false， typescript 没有办法做进一步的类型推断。

```ts
function isString(x: unknown) x is string {
  return typeof x === 'string'
}

function f(x: string) {
  if (isString(x)) {
    x.toLowerCase // 可以被正确推断出来
  }
}
```

```ts
type Num = 1 | 2 | 3

function isNum(x: unknown): x is Num {
  return x === 1 || x === 2 || x === 3
}

function foo(x: number) {
  if (isNum(x)) {
    switch (x) {
      case 1:
      case 2:
      case 3:
        console.log('ok')
      case 4: // 这里会飘红
        console.log('error')
    }
  }
}
```
