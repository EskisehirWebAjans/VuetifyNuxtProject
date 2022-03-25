export const state = () => ({
  images: [],
  loading: false
})

export const getters = {
  images: state => state.images,
  loading: state => state.loading
}

export const actions = {
  async onLoadImages({ commit, dispatch }) {
    commit('setLoading', true)
    this.$axios.$get('/api/image/all')
      .then((data) => {
        if (data.status) {
          commit('setImage', data.image)
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
  async onSaveImage({ commit, dispatch }, image) {
    commit('setLoading', true)
    this.$axios.$post('/api/image', image)
      .then((data) => {
        if (data.status) {
          commit('addImage', data.image)
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
  async onDeleteImage({ commit, dispatch }, { image, index }) {
    commit('setLoading', true)
    this.$axios.$post('/api/image', image)
      .then((data) => {
        if (data.status) {
          commit('removeImage', index)
        } else {
          dispatch('misc/showMessage', 'Bir hata oluştu. Tekrar deneyiniz!', {root: true})
        }
        commit('setLoading', false)
      })
      .catch(error => {
        dispatch('misc/showMessage', error, {root: true})
        commit('setLoading', false)
      })
  }
}

export const mutations = {
  setImage(state, images) {
    state.images = []
    images.map(image => {
      state.images.push(image)
    })
  },
  addImage(state, image) {
    state.images.unshift(image)
  },
  removeImage(state, index) {
    state.images.splice(index, 1)
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}
