import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  modules: {
    user: user
  },
  plugins: [vuexLocal.plugin]
})
