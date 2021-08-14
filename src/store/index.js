import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import router from '../router'
import { supabase } from '../supabase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: [],
    profile: []
  },
  getters: {
    getUser(state) {
      return state.user
    },
    getProfile(state) {
      return state.profile
    },
  },
  mutations: { 
    setUser(state, payload) {
      state.user = payload;
    },
    setProfile(state, payload){
      state.profile = payload
    }
  },
  actions: {
    async signInAction( { commit }, formData){
      try{
        let { user, error } = await supabase.auth.signIn({
          email: formData.email,
          password: formData.password
        })
        if(error){
          console.log(error)
        }else{
          console.log(user)
          commit('setUser', user)

                let { data: profiles, error } = await supabase
                .from('profiles')
                .select(`
                    id, 
                    first_name, 
                    last_name, 
                    about_me, 
                    avatar_url,
                    roles(
                        role_name
                    )
                    `)
                .eq('id',user.id)
          
          console.log(profiles[0])
          commit('setProfile', profiles[0])
          await router.push('/')

        }
      }catch(error){
        console.log(error)
      }
    },
    async signOutAction({ commit }) {
      try {
        let { error } = await supabase.auth.signOut()

        if(error){
          console.log(error)
        }else{
          commit('setUser', null)
          await router.push('/login')
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  modules: {
  },
  plugins: [
    createPersistedState()
  ]
})
