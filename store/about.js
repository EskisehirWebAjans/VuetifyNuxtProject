export const state = () => ({
  about: [],
  loading: false
})

export const getters = {
  about: state => state.about,
  loading: state => state.loading
}

export const actions = {
  async onLoadAbout({ commit, dispatch }) {
    commit('setLoading', true)
    this.$axios.$get('/api/about/all')
      .then((data) => {
        if (data.status) {
          commit('setAbout', data.about)
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
  async onSaveAbout({ commit, dispatch }, about) {
    commit('setLoading', true)
    this.$axios.$post('/api/about', about)
      .then((data) => {
        if (data.status) {
          commit('setAbout', data.about)
        } else {
          dispatch('misc/showMessage', 'Bir hata oluştu. Tekrar deneyiniz!', {root: true})
        }
        commit('setLoading', false)
      })
      .catch(error => {
        dispatch('misc/showMessage', error, {root: true})
        commit('setLoading', false)
      })
  },
  async onUpdateAbout({ commit, dispatch }, about ) {
    commit('setLoading', true)
    this.$axios.$post('/api/about', about)
      .then((data) => {
        if (data.status) {
          commit('setAbout', data.about)
        } else {
          dispatch('misc/showMessage', 'Bir hata oluştu. Tekrar deneyiniz!', {root: true})
        }
        commit('setLoading', false)
      })
      .catch(error => {
        dispatch('misc/showMessage', error, {root: true})
        commit('setLoading', false)
      })
  },
}

export const mutations = {
  setAbout(state, about) {
    state.about = []
    state.about.push(about)
  },
  updateAbout(state, about) {
    Object.assign(state.about[0], about)
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}
