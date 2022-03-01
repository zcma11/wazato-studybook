惰性计算就是等到执行这行代码，需要用到的时候再进行计算。比如 `fn(1 + 2)`，这时候 1 + 2 已经被计算，如果是惰性计算的话，`fn(() => 1 + 2)`，等到在函数内部用到的时候再执行得到 3。JavaScript 实现惰性计算的方式是写成函数，延迟调用。

为什么要惰性计算。假如函数内部有这样的代码，实际上我们不需要提前计算这个数组。可以在内部确认是这个 if 分支后再计算。

```js
foo([1, 2, 3, 4].filter(n => n > 2))
function foo(arr) {
  if(nums > 5) {
    return
  } else {
    用到 arr 的地方
  }
}
```

通过惰性计算减少不必要的工作。比如对一个数组，只处理前面的某些值。除非用 for 循环手动控制，然后 break，不然用什么 api 都是全部遍历一遍数组。

比如这段代码 `Lazy([1,4,2,7,3]).filter(i => i < 3).map(i => i + 10).value()`，将数组和各种操作条件存起来，最后 value() 的时候再同时进行，这时候一次遍历，如果 filter 不通过根本不会走后面的 map。

```js
// 用另一种思路模仿的话
// 假设在一个实例内
const reduce = (fn, initial) => {
  return val => {
    initial = fn(initial, val)
  }
}

function each(arr, i = 0, ii = arr.length) {
  let value = []
  const reducer = reduce((a, b) => {
    a.push(b)
    return a
  }, value)

  const e = () => {
    if (i < ii) {
      return {
        done: false,
        value: arr[i++],
        next: {
          push(val) {
            reducer(val)
            return e
          },
          e
        }
      }
    } else {
      return { done: true }
    }
  }
  return transform(e, value)
}

function filter(condition) {
  const fi = fn => {
    const { done, value, next } = fn()
    if (done) {
      return { done: true }
    }

    if (condition(value)) {
      return {
        done: false,
        value,
        next: fi(next.push(value))
      }
    }

    fi(next.e)
    return null
  }
  return fi
}

function transform(fn, value) {
  return {
    pipe: f => transform(f(fn), value),
    value: () => value
  }
}

const a = each([1, 2, 3])
  .pipe(filter(i => i < 2))
  .value() // [1]
```
