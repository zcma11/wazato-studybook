旧的生命周期

初始化的时候
constructor
componentWillMount
render
componentDidMount

更新流程
componentWillReceiveProps 新的 props 更新的时候
shouldComponentUpdate state 发生变化的时候，可以通过返回 true false 中止后续生命周期
componentWillUpdate forceUpdate 的话从这里开始
render
componentDidUpdate

卸载流程
componentWillUnmount

新生命周期
除了卸载 will 都会加上 UNSAFE\_ 前缀

初始化
constructor
getDerivedStateFromProps
render
componentDidMount

更新
getDerivedStateFromProps 返回 null 或 对象作为 state
shouldComponentUpdate
render
getSnapshotBeforeUpdate 参数 prevProps prevState，在这里 dom 操作还没进行，可以做一些 dom 的记录 返回 null 或任何值
componentDidUpdate 参数 prevProps prevState 上一个钩子返回的 snapshot
