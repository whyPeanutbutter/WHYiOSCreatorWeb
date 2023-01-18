import { createStore } from 'vuex'
// 持久化
import createPersistedstate from 'vuex-persistedstate'

import user from './modules/user'
export default createStore({
  modules: {
    user
  },
  // 持久化
  plugins: [
    createPersistedstate({
      key: 'blog',
      paths: ['user']
    })
  ]
})
