import Vue from 'vue'
import Vuex from 'vuex'
import Persistedstate from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    albumuser: {
      name: '',
      _id: '',
      file: ''
    }
  },
  mutations: {
    logout (state) {
      state.albumuser.name = ''
      state.albumuser._id = ''
      state.albumuser.file = ''
    },
    login (state, data) {
      state.albumuser.name = data.account
      state.albumuser._id = data._id
      state.albumuser.file = data.file
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [Persistedstate()]
})
