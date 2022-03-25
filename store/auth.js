import {saveUserData, clearUserData, getUserFromLocalStorage} from "~/utils"
import Vue from 'vue'

export const state = () => ({
  user: null,
  key: '5f2b5cdbe5145f10b2w41568fe4g2b24',
  token: {
    jwt: null,
    expiresIn: null
  },
  loading: false
})

export const getters = {
  loading: state => state.loading,
  user: state => state.user,
  isAuthenticated: state => !!state.token.jwt,
  token: state => state.token,
  decodeToken: state => Vue.$jwt.decode(state.token.jwt, state.key),
  isAdmin(state, getters) {
    if(state.token.jwt) {
      return getters.decodeToken.admin
    }
  }
}

export const actions = {
  async onSignUp({ dispatch, commit }, form ) {

  },
  async onSignIn({ commit, dispatch }, user) {
      commit('setLoading', true)
      this.$axios.$post('/api/login',
        { user: user, action: 'login' })
        .then((data) => {
          if(data.status) {
            dispatch('fetchUserProfile', data)
          } else {
            dispatch('misc/showMessage', data.info, { root: true })
            commit('setLoading', false)
          }
        })
        .catch((error) => {
          dispatch('misc/showMessage', error, { root: true })
          commit('setLoading', false)
        })
  },
  async fetchUserProfile({ commit }, user) {
    commit('setToken', { jwt: user.token, expiresIn: user.expiresIn })
    let data = {
      username: user.username,
      name: user.name,
      surname: user.surname,
      avatar: user.avatar,
      admin: user.admin
    }
    commit('setUser', data)
    saveUserData({ jwt: user.token, expiresIn: user.expiresIn }, data)
  },
  setLogoutTimer({ dispatch }, interval) {
    setTimeout(() => dispatch('onLogout'), interval)
  },
  onLogout({ commit }) {
    commit('clearToken');
    commit('clearUser');
    clearUserData();
    this.$router.push('/')
  },
  getAuthUser({commit, getters}) {
    const user = getters.user

    if (user) { return Promise.resolve(user) }

    if(localStorage) {
      const data = getUserFromLocalStorage()
      commit('setToken', { jwt: data.jwt, expiresIn: data.expiresIn })
      commit('setUser', { name: data.name, surname: data.surname, avatar: data.avatar, username: data.username, admin: data.admin })
    }
  },
  setLoading({ commit }, status) {
    commit('setLoading', status)
  }
}

export const mutations = {
  setUser(state, profile) {
    state.user = profile
  },
  setToken(state, { jwt, expiresIn }) {
    state.token = {
      jwt: jwt,
      expiresIn: expiresIn
    }
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  clearToken: state => state.token = { jwt: null, expiresIn: null},
  clearUser: state => state.user = null
}
