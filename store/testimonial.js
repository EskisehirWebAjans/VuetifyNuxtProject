export const state = () => ({
  testimonials: [],
  loading: false
})

export const getters = {
  testimonials: state => state.testimonials,
  loading: state => state.loading
}

export const actions = {
  async onLoadTestimonials({ commit, dispatch }) {
    commit('setLoading', true)
    this.$axios.$get('/api/testimonial/all')
      .then((data) => {
        if (data.status) {
          commit('setTestimonials', data.testimonial)
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
  async onSaveTestimonial({ commit, dispatch }, testimonial) {
    commit('setLoading', true)
    this.$axios.$post('/api/testimonial', {
      testimonial: testimonial,
      action: 'insert'
    })
      .then((data) => {
        if (data.status) {
          commit('addTestimonial', data.testimonial)
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
  async onUpdateTestimonial({ commit, dispatch }, { testimonial, index } ) {
    commit('setLoading', true)
    this.$axios.$post('/api/testimonial', {
      testimonial: testimonial,
      action: 'update'
    })
      .then((data) => {
        if (data.status) {
          console.log(data.testimonial)
          commit('updateTestimonial', { testimonial: data.testimonial, index })
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
  async onDeleteTestimonial({ commit, dispatch }, { testimonial, index }) {
    commit('setLoading', true)
    this.$axios.$post('/api/testimonial', {
      testimonial: testimonial,
      action: 'delete'
    })
      .then((data) => {
        if (data.status) {
          commit('removeTestimonial', index)
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
  setTestimonials(state, testimonials) {
    state.testimonials = []
    testimonials.map(testimonial => {
      state.testimonials.push(testimonial)
    })
  },
  addTestimonial(state, testimonial) {
    state.testimonials.unshift(testimonial)
  },
  updateTestimonial(state, { testimonial, index }) {
    Object.assign(state.testimonials[index], testimonial)
  },
  removeTestimonial(state, index) {
    state.testimonials.splice(index, 1)
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}
