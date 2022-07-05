元组，相当于数组[]约束功能拓展，可以给数组的值指定多个类型。但是需要让数组的值和元组的类型一一对应，并且初始化赋值时值的个数和类型都要匹配，只声明的话不用。并且不能添加其他类型的值，不能越界读值，比如

```ts
let arr: [number, boolean] = [1, true]
arr.push('foo') // error
arr[4] // error
```

元组转联合类型

```ts
type t = [1,2,3]
type u = t[number]
```

枚举，像一个对象，里面每个 key 都代表一个递增的数。可以通过判断名字代替判断数字，更加语义化。还可以指定代表哪个数字，可以重复，但没什么意义，没指定的数字从最后指定的数字开始递增。还可以反过来通过数字拿到 key，比如

```ts
enum foo {
  a,
  b,
  c = 1,
  d = 3,
  e
}

console.log(foo.a, foo.b, foo.c, foo.d, foo.e) // 0 1 1 3 4
// 这种写法更清楚知道拿 'a'
console.log(foo[foo.a]) // 'a'
// 这样也行
console.log(foo[0]) // 'a'

// 使用的时候就可以
if (foo.a > 0) {
  ...
}
```

枚举转联合类型

```ts
enum foo {
  a,
  b,
  c = 1,
  d = 3,
  e
}
type u = keyof typeof foo
```