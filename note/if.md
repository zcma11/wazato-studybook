条件类型类似于三目运算符，如果给的表达式成立，则走 true 的类型，反之走 false 的类型。

条件类型可以配合 extends 通过判断类型是否是超集，而做出不同的选择。

```ts
type foo = number

type bar = foo extends string ? foo : never
// bar -> never
```

条件类型配合上 extends ，泛型和分发，可以做出更灵活的类型判断。比如 typescript 提供的 exclude

```ts
type Exclude<U, T> = U extends T ? never : U

type foo = 'name' | 'age' | 'gender'

type bar = Exclude<foo, 'name'> // bar -> 'age' | 'gender'
```

infer 是类似于为这个类型声明一个变量的效果，如果条件类型再加上 infer ，可以实现把类型里的某个类型取出来。

```ts
type foo = string[]
type bar<T> = T extends Array<infer K> ? K : T
type ccc = bar<foo> //  ccc -> string
```
