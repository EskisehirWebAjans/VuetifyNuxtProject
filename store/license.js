export const state = () => ({
  licenses: [],
  loading: false
})

export const getters = {
  licenses: state => state.licenses,
  loading: state => state.loading
}

export const actions = {
  async onLoadLicenses({ commit, dispatch }) {
    commit('setLoading', true)
    this.$axios.$get('/api/license/all')
      .then((data) => {
        if (data.status) {
          commit('setLicense', data.license)
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
  async onSaveLicense({ commit, dispatch }, license) {
    commit('setLoading', true)
    this.$axios.$post('/api/license', license)
      .then((data) => {
        if (data.status) {
          commit('addLicense', data.license)
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
  async onUpdateLicense({ commit, dispatch }, { license, index } ) {
    commit('setLoading', true)
    this.$axios.$post('/api/license', license)
      .then((data) => {
        if (data.status) {
          commit('updateLicense', { license: data.license, index })
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
  async onDeleteLicense({ commit, dispatch }, { license, index }) {
    commit('setLoading', true)
    this.$axios.$post('/api/license', license)
      .then((data) => {
        if (data.status) {
          commit('removeLicense', index)
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
  setLicense(state, licenses) {
    state.licenses = []
    licenses.map(license => {
      state.licenses.push(license)
    })
  },
  addLicense(state, license) {
    state.licenses.unshift(license)
  },
  updateLicense(state, { license, index }) {
    Object.assign(state.licenses[index], license)
  },
  removeLicense(state, index) {
    state.licenses.splice(index, 1)
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}
