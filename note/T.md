### 泛型变量

会根据参数或前面的<>推算出泛型的类型
其声明类型不为 "void" 或 "any" 的函数必须返回值。

```ts
function foo<T>(a: T): T {
  return a
}
foo<string>(1) // error

```

### 泛型类型

类型是 any，string... 这种，泛型类型就是将泛型作为类型，用在赋值的时候

```ts
function foo<T>(a: T): T {
  return a
}
let a: <T>(a: T) => T = foo
a = 1 // error
a = foo // ok
```

### 泛型接口

泛型类型还可以用接口去描述

```ts
interface bar{
  <T>(a: T): T
}

let a: bar
a = foo // ok
a = 1 // error
```

上面是将泛型的定义放在了接口里面，还有一种放在接口的写法，这样接口里的其他都可以使用这个泛型。

```ts
interface bar<T>{
  (a: T): T
}

interface zoo<T> {
  a: T,
  b: (args: T) => T
}

let c: zoo<string>

c = [1] // error
c = () => 1 // error
c = {
  a: '1',
  b: (x) => '1'
}

```

### 泛型约束

通过 extends 决定泛型可用的属性，确保属性存在

```ts
function foo<T>(a: T) {
  a.length // error
}

function foo<T extends []>(a: T) {
  a.length // ok, 但同时 a 继承了数组的其他属性方法。 a.reverse // ok
}

interface bar {
  length: number
}
function foo<T extends bar>(a: T) {
  a.length // ok, 但是 a 只有一个 length 属性
}

const obj = { a: 1, b: 2 }
function foo<T, U extends keyof T>(o: T, k: U): T[U] {
  return o[k]
}

foo(obj, 'x') // error
```

### 泛型类

泛型类和泛型接口类似，通过外面传入类型可以提供内部使用，同时和泛型约束一样的地方在于可以约束内部属性。

```ts
class foo<T>{
  bar: T

  constructor(x: T) {
    this.bar = x
  }
}

new foo<string>('1')
function create<T extends foo<string>>(ins: new (x: string) => T): T {
  return new ins('1')
}

create(foo).bar = '1' // ok
create(foo).bar = 1 // error
```