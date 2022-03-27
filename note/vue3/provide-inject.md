### 概述

provide / inject 是一个非常好用的特性，解决了深层嵌套时，props 的传递困难问题，戏称小 vuex。

在对象语法上，provide 和 inject 的使用并没有多少变化。但是在 composition api 中，提供 `provide()`, `inject()`，两个方法以支持在 setup 中使用。

那么就会提出了以下几个非常在意的疑问，接下来一一解决。

1. 在 vue2 中 provide 和 inject 是不提供响应式的，如果想得到响应式则需要自己 diy，通常做法是为属性的值包裹一层函数，那么在 vue3 中，我们可以通过 provide 返回一整个 reative 对象，那么是否支持响应式。

2. vue3 中的 `provide()`, `inject()` 是怎么实现的。

3. 假如在对象语法上配置了 provide，inject 属性，同时在 setup 上也使用了 `provide()`, `inject()`，会发生什么。

对应源码文件：'component.ts'，'componentOptions.ts'，'apiInject.ts'

### provide

我们先简单看一下 provide 的使用方法。

```js
  // vue2
  export default {
    provide: {
      foo: 1
    }
    // or
    provide() {
      return {
        foo: 1
      }
    }
  }

  // vue3
  export default {
    provide // 和 vue2 一样
    setup() {
      provide('foo', 1)
    }
  }
```

从使用方法上看，vue3 只是多支持了 composition api，没有多少变化。我没有看过 vue2 的 provide 部分的源码，所以没有做出 2 和 3 的对比，但看 data，methods 这些兼容代码，兼容的代码和 vue2 的代码应该是差不多的，所以就直接看 vue3 的代码就好了。

#### 如何兼容 vue2

首先我们看兼容代码，在初始化流程 `processComponent` -> `mountComponent` -> `setupComponent` -> `setupStatefulComponent` -> `执行setup` -> `finishComponentSetup` 中就到了兼容 options 的代码了

在 `finishComponentSetup` 中会发现有以下的代码

```ts
  function finishComponentSetup(instance) {
    // ...
    if (__FEATURE_OPTIONS_API__ && !(__COMPAT__ && skipOptions)) {
      setCurrentInstance(instance)
      pauseTracking()
      applyOptions(instance)
      resetTracking()
      unsetCurrentInstance()
    }
    // ...
  }
```

`setCurrentInstance()` 和 `unsetCurrentInstance()`，`pauseTracking()` 和`resetTracking()` 留到最后题外话聊。

对 vue2 options 的兼容就在这一句 `applyOptions(instance)`。

在 `applyOptions` 里面，我们看到了从 options 中取出所有 options 选项的操作，并且在这里面触发了之前 `beforeCreate` 和 `created` 的生命周期，setup 在这之前执行过了，所以 setup 上没有这两个生命周期。

我们找到处理 provide 的那段代码，非常的简短，所以我们可以直接粘贴到下面。

```ts
  // 省略了其他代码
  function applyOptions(instance) {
    const { provide: provideOptions, /* ...其他 */ } = resolveMergedOptions(instance)

    // ...

    // 如果配置对象中有提供 provide
    if (provideOptions) {
      // 判断是函数还是对象
      const provides = isFunction(provideOptions)
        ? provideOptions.call(publicThis)
        : provideOptions
      // 获取处理后 provide 对象的的内容
      // 相当于 Object.keys()
      Reflect.ownKeys(provides).forEach(key => {
        // 我们看到其实还是执行的 composition api 的 provide
        provide(key, provides[key])
      })
    }

    // ...
  }
```

#### composition api: provide

所以我们的重点是 provide 函数

其实非常的简单就是使用了原型链继承，每个组件对象都有一个 provides 对象，这个对象存储的是 provide 暴露的对象，子组件的provides 会继承父组件的 provides，于是就通过原型链串了起来。通过原型链也能很好的实现 inject 的 from。

```ts
  function provide(key, value) {
    // currentInstance 在最后题外话聊，这里理解为调用 provide 时的组件实例就好。
    let provides = currentInstance.provides
    // 得到父组件实例
    const parentProvides =
      currentInstance.parent && currentInstance.parent.provides
    // 有就继承
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    // 当前组件实例的 provides 存储
    provides[key as string] = value
  }
```

**我们可以看到在 provide 没有任何关于响应式的处理，只是存值。**

### inject

和 provide 一样的解读思路，我们先看看兼容代码的实现。

#### 如何兼容 vue2

兼容 inject 调用了 `resolveInjections`。在里面依然是调用了 composition api 中的 `inject`。得到了获取的值后挂载到 ctx，也就是 vue2 使用的 this 上下文中， `ctx[key] = injected`。

inject 会传入 key，所以得到 provide 的值只需要读对象属性就好了。

细致的操作则根据 options 中的 inject 配置决定，是否提供默认值，from 获取来自哪的 provides 等等。

#### composition api: inject

```js
  function inject(key, defaultValue, treatDefaultAsFactory) {
    const instance = currentInstance || currentRenderingInstance
    // 做了一些代码简化
    const provides = instance?.parent?.provides
    // 判断默认值很简单，检测属性是否存在就可以了
    if (provides && key in provides) {
      return provides[key]
    }
  }
```

### 总结

带着问题看下来，基本上都已经有了答案。

1. 首先关于响应式的问题，vue3 依然是不提供响应式的。

    - 但是对比起 vue2 要自己包裹一层函数来说，vue3 提供的 reactivity api 很好的解决了 provide / inject 的响应式问题。我们只需要 provide 的对象里的属性是 ref 或者 reactive 对象就可以方便的得到响应式。不像自己包裹一层函数，使用起来看上去别扭。但如果不觉得别扭，那其实差别不大。比如以下例子。

      ```js
        /* vue2 */
        // 父组件
        export default {
          provide() {
            return {
              foo: () => this.foo
            }
          },
          data() {
            return {
              foo: 1
            }
          }
        }

        // 子组件
        export default {
          inject: ['foo'],
          methods: {
            dosomething() {
              // 如果 vue2 需要响应式得这样使用，得调用函数。
              this.foo()
            }
          }
        }

        /* vue3 */
        // 父
        export default {
          // options 语法暴露没有太大的变化
          provide() {
            return {
              foo: computed(() => this.foo)
            }
          },
          data() {
            return {
              foo: 1
            }
          }
          // 如果使用 composition api 则更简便。
          setup() {
            const foo = ref(1)
            provide('foo', computed(() => this.foo))
          }
        }

        // 子 差别在子组件
        export default {
          inject: ['foo'],
          methods: {
            dosomething() {
              // 可以直接使用，ref 会在 inject 中挂载到上下文的时候解包
              this.foo
            }
          },
          // 或者使用 composition api
          setup() {
            const foo = inject('foo', /* 默认值参数 */)
            // 接下来就可以使用这个得到的原封不动的 provide 的值，在这个例子中，就是 ref
          }
        }
      ```

2. 分析的时候已经展示了源码和逻辑。再总结一下就是 `provide` 是通过原型链继承的方式组合了多个组件实例的 provides。`inject` 是通过读取 parent 实例上的 provides 的值。

3. 关于同时写了 provide / inject 会怎么处理，在阅读代码的时候并没有看到任何相关的判断，所以应该是由执行顺序决定，最后执行的覆盖之前的。由于都是使用的 `provide` 和 `inject` 函数，所以不会有任何的冲突，都是在同一个对象上一个 key 一个 key 进行赋值。第一个执行的是 setup，后面执行兼容代码。所以如果出现重复的属性的话，会以 options 为主。

### 说一点题外话

上面 cue 到了源码一些函数的使用，其中 `setCurrentInstance()` 和 `unsetCurrentInstance()` 大家可以理解为设置变量。`pauseTracking()` 和`resetTracking()` 则是执行 `applyOptions` 时的暂停依赖收集，因为读到响应式变量是会触发依赖收集的。我们可以看到 vue3 的源码的设计上，使用方便，看得也很清晰。

怎么理解 `setCurrentInstance`，其实是在 vue 中会维护一个全局变量 `currentInstance`，在初始化的时候，也就是 setup 以及处理兼容代码的过程中，会将当前初始化的组件实例赋值给 `currentInstance`，等初始化结束后赋值 `null`。

所以 vue 能有 `getCurrentInstance` 和 `setCurrentInstance` 方法。

当然不止这么点，每一个实例里面也会进行作用域的开启和关闭。`instance.scope.on()` 和 `currentInstance.scope.off()`