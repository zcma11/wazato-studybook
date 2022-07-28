提供的值约束，15.5之前在React上，16后独立出来
PropTypes.string
PropTypes.number.isRequired
PropTypes.func

设置约束
```js
[Component].PropTypes = {
  [keyName]: PropTypes.string
}
```

设置默认值
```js
[Component].defaultProps = {
  [keyName]: value
}
```

放在class里面可以使用 static 关键字