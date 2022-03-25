import { db, storage } from '~/plugins/firebase'


export const state = () => ({
  sliders: [],
  loading: false
})

export const getters = {
  sliders: state => state.sliders,
  loading: state => state.loading
}

export const actions = {
  async onLoadSliders({ commit, dispatch }) {
    commit('setLoading', true)
    this.$axios.$get('/api/slider/all')
      .then((data) => {
        if (data.status) {
          commit('setSlider', data.slider)
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
  async onSaveSlider({ commit, dispatch }, slider) {
    commit('setLoading', true)
    this.$axios.$post('/api/slider', slider)
      .then((data) => {
        if (data.status) {
          commit('addSlider', data.slider)
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
  async onUpdateSlider({ commit, dispatch }, { slider, index }) {
    commit('setLoading', true)
    this.$axios.$post('/api/slider', slider)
      .then((data) => {
        if (data.status) {
          commit('updateSlider', { slider: data.slider, index })
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
  async onDeleteSlider({ commit, dispatch }, { slider, index }) {
    commit('setLoading', true)
    this.$axios.$post('/api/slider', slider)
      .then((data) => {
        if (data.status) {
          commit('removeSlider', index)
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
  setSlider(state, sliders) {
    state.sliders = []
    sliders.map(slider => {
      state.sliders.push(slider)
    })
  },
  addSlider(state, slider) {
    state.sliders.unshift(slider)
  },
  updateSlider(state, { slider, index }) {
    Object.assign(state.sliders[index], slider)
  },
  removeSlider(state, index) {
    state.sliders.splice(index, 1)
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}
