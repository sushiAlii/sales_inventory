import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import router from '../router'
import { supabase } from '../supabase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: [],
    profile: null,
    login: null
  },
  getters: {
    getUser(state) {
      return state.user
    },
    getProfile(state) {
      return state.profile
    },
    getLogin(state){
      return state.login
    }
  },
  mutations: { 
    setUser(state, payload) {
      state.user = payload;
    },
    setProfile(state, payload){
      state.profile = payload
    },
    setLogin(state, payload){
      state.login = payload
    }
  },
  actions: {
    async loadProfile({ getters, commit }){
      console.log("Hello hello")
      console.log(getters.getUser.id)
      try{
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
                .eq('id',getters.getUser.id)
                  
                  console.log("from Vuex: " + profiles[0])
                  commit('setProfile', profiles[0])
      }catch(error){
        console.log(error)
      }
    },
    async signInAction( { commit }, formData){
      
      try{
        let { user, error } = await supabase.auth.signIn({
          email: formData.email,
          password: formData.password
        })
        if(error){
          commit('setLogin', true)
          console.log(error)
        }else{
          commit('setLogin', false)
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

                  if(error){
                    console.log("Hi")
                  }else{
                    console.log(profiles[0])
                    console.log("Hello")
                    commit('setProfile', profiles[0])
                    await router.push('/')
                  }
        }
      }catch(error){
        console.log("Hello")
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
