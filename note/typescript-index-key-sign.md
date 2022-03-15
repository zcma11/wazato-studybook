索引类型就是对象的 key，数组的 index 的类型。可以使用 keyof，typeof，in 关键字更灵活的定义类型。索引类型一般用于描述使用的对象和他的属性。

设置索引类型最简单的方法就是直接指定类型。

```ts
interface foo<T> {
  [key: string]: T
}

interface bar<T> {
  [index: number]: T
}
```

但是我们无法约束具体的 key 和 不同的值类型，所以我们可以借助 keyof 和 in

```ts
type bar = 'a' | 'b' | 'c'
type foo = {
  [K in bar]: number
}

let a: foo = {
  a: '1', // error
  b: 2,
  c: 4,
  d: 4 // error
}
```

```ts
type foo<T> = {
  [K in keyof T]: T[K] // 可以原封不动的表示 T 的结构
}

// 可以简单配合 typeof 使用
foo<typeof bar>
```

```ts
// 借助了泛型，通过 T 约束第二个参数的类型为其索引，
// 如果没有提供第一个参数的类型会根据第一个参数的 key 的联合类型。
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map(n => o[n])
}
```

[索引签名 | 深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/typings/indexSignatures.html#typescript-%E7%B4%A2%E5%BC%95%E7%AD%BE%E5%90%8D)

[TypeScript 的索引类型与映射类型，以及常用工具泛型的实现 - 知乎](https://zhuanlan.zhihu.com/p/296611274)
