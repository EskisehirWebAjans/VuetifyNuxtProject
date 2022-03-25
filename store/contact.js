import { db } from '~/plugins/firebase'


export const state = () => ({
  contact: {},
  loading: false
})

export const getters = {
  contact: state => state.contact,
  loading: state => state.loading
}

export const actions = {
  async onLoadContact({ commit, dispatch }) {
    commit('setLoading', true)
    this.$axios.$get('/api/contact/all')
      .then((data) => {
        if (data.status) {
          commit('setContact', data.contact)
        } else {
          dispatch('misc/showMessage', 'Bir hata oluştu. Tekrar deneyiniz!', { root: true })
        }
        commit('setLoading', false)
      })
      .catch(error => {
        dispatch('misc/showMessage', error, { root: true })
        commit('setLoading', false)
      })
  },
  onUpdateInfo({ commit, dispatch }, contact) {
    commit('setLoading', true)
    this.$axios.$post('/api/contact', {
      contact: contact,
      action: 'update'
    })
      .then((data) => {
        if (data.status) {
          commit('setContact', data.contact)
          dispatch('misc/showMessage', data.info, { root: true })
        } else {
          dispatch('misc/showMessage', 'Bir hata oluştu. Tekrar deneyiniz!', { root: true })
        }
        commit('setLoading', false)
      })
      .catch(error => {
        dispatch('misc/showMessage', error, { root: true })
        commit('setLoading', false)
      })
  },
}

export const mutations = {
  setContact(state, contact) {
    state.contact = Object.assign({}, contact)
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}
