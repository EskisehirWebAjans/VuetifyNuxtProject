export const state = () => ({
  announces: [],
  loading: false
})

export const getters = {
  announces: state => state.announces,
  loading: state => state.loading
}

export const actions = {
  async onLoadAnnounces({ commit, dispatch }) {
    commit('setLoading', true)
    this.$axios.$get('/api/announce/all')
      .then((data) => {
        if (data.status) {
          commit('setAnnounce', data.announce)
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
  async onSaveAnnounce({ commit, dispatch }, announce) {
    commit('setLoading', true)
    this.$axios.$post('/api/announce', announce)
      .then((data) => {
        if (data.status) {
          commit('addAnnounce', data.announce)
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
  async onUpdateAnnounce({ commit, dispatch }, { announce, index } ) {
    commit('setLoading', true)
    this.$axios.$post('/api/announce', announce)
      .then((data) => {
        if (data.status) {
          commit('updateAnnounce', { announce: data.announce, index })
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
  async onDeleteAnnounce({ commit, dispatch }, { announce, index }) {
    commit('setLoading', true)
    this.$axios.$post('/api/announce', announce)
      .then((data) => {
        if (data.status) {
          commit('removeAnnounce', index)
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
  setAnnounce(state, announces) {
    state.announces = []
    announces.map(announce => {
      state.announces.push(announce)
    })
  },
  addAnnounce(state, announce) {
    state.announces.unshift(announce)
  },
  updateAnnounce(state, { announce, index }) {
    Object.assign(state.announces[index], announce)
  },
  removeAnnounce(state, index) {
    state.announces.splice(index, 1)
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}
