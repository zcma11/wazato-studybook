```ts
interface foo {
  name: string
  age: number
}

type bar<T> = {
  [K in keyof T]: boolean
}

type RReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

type RRReadonly<T> = {
  -readonly [K in keyof T]: T[K]
}

type a = RReadonly<foo>
type b = bar<foo>
type c = RRReadonly<foo>
```

映射类型是一种泛型类型，可以通过 keyof 生成的联合类型生成和原结构一样的新类型，还可以进行一定的改变。比如 readonly，或者改变值的类型。

```ts
interface foo {
  name: string
  age: number
}

type bar<T> = {
  [K in keyof T]: number
}

type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

type RReadonly<T> = {
  -readonly [K in keyof T]: T[K]
}
```
