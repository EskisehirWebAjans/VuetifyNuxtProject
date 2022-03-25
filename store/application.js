export const state = () => ({
  applications: [],
  loading: false
})

export const getters = {
  applications: state => state.applications,
  loading: state => state.loading
}

export const actions = {
  async onLoadApplications({ commit, dispatch }) {
    commit('setLoading', true)
    this.$axios.$get('/api/register/all')
      .then((data) => {
        if (data.status) {
          commit('setApplications', data.register)
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
  async onDeleteApplication({ commit, dispatch }, { register, index }) {
    commit('setLoading', true)
    this.$axios.$post('/api/register', {
      register: register,
      action: 'delete'
    })
      .then((data) => {
        if (data.status) {
          commit('removeApplication', index)
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
  setApplications(state, registers) {
    state.applications = []
    registers.map(register => {
      state.applications.push(register)
    })
  },
  removeApplication(state, index) {
    state.applications.splice(index, 1)
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}
