module: {
  user
}

namespaced: true

dispatch('user/foo')
commit('user/bar')
store.state.user.xxx