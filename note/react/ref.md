3 种 ref 的使用方式获取 dom 节点

1. ref="xx" this.refs.xx //可能要废弃
2. ref={c => this.xx = c} this.c
3. xx = React.createRef() this.xx.current
