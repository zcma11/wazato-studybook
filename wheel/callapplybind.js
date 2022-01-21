;(function (window) {
  function call(fn, ctx, ...args) {
    if (ctx == undefined) {
      return fn()
    }

    const prototype = Object.getPrototypeOf(ctx)
    const key = Symbol()
    prototype[key] = fn
    let res
    res = ctx[key]()
    delete prototype[key]
    return res
  }

  function apply(fn, ctx, args) {
    return call(fn, ctx, ...args)
  }

  function bind(fn, ctx) {
    return (...args) => call(fn, ctx, ...args)
  }

  window.call = call
  window.apply = apply
  window.bind = bind
})(window)
