export const state = () => ({
  faqs: [],
  loading: false
})

export const getters = {
  faqs: state => state.faqs,
  loading: state => state.loading
}

export const actions = {
  async onLoadFaqs({ commit, dispatch }) {
    commit('setLoading', true)
    this.$axios.$get('/api/faq/all')
      .then((data) => {
        if (data.status) {
          commit('setFaqs', data.faq)
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
  async onSaveFaq({ commit, dispatch }, faq) {
    commit('setLoading', true)
    this.$axios.$post('/api/faq', {
      faq: faq,
      action: 'insert'
    })
      .then((data) => {
        if (data.status) {
          commit('addFaq', data.faq)
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
  async onUpdateFaq({ commit, dispatch }, { faq, index } ) {
    commit('setLoading', true)
    this.$axios.$post('/api/faq', {
      faq: faq,
      action: 'update'
    })
      .then((data) => {
        if (data.status) {
          commit('updateFaq', { faq: data.faq, index })
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
  async onDeleteFaq({ commit, dispatch }, { faq, index }) {
    commit('setLoading', true)
    this.$axios.$post('/api/faq', {
      faq: faq,
      action: 'delete'
    })
      .then((data) => {
        if (data.status) {
          commit('removeFaq', index)
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
  setFaqs(state, faqs) {
    state.faqs = []
    faqs.map(faq => {
      state.faqs.push(faq)
    })
  },
  addFaq(state, faq) {
    state.faqs.unshift(faq)
  },
  updateFaq(state, { faq, index }) {
    Object.assign(state.faqs[index], faq)
  },
  removeFaq(state, index) {
    state.faqs.splice(index, 1)
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}
