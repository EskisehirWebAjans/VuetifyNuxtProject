export const state = () => ({
  blogs: [],
  loading: false
})

export const getters = {
  blogs: state => state.blogs,
  loading: state => state.loading
}

export const actions = {
  async onLoadBlogs({ commit, dispatch }) {
    commit('setLoading', true)
    this.$axios.$get('/api/blog/all')
      .then((data) => {
        console.log(data)
        if (data.status) {
          commit('setBlog', data.blog)
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
  async onSaveBlog({ commit, dispatch }, blog) {
    commit('setLoading', true)
    this.$axios.$post('/api/blog', blog)
      .then((data) => {
        if (data.status) {
          commit('addBlog', data.blog)
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
  async onUpdateBlog({ commit, dispatch }, { blog, index } ) {
    commit('setLoading', true)
    this.$axios.$post('/api/blog', blog)
      .then((data) => {
        if (data.status) {
          commit('updateBlog', { blog: data.blog, index })
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
  async onDeleteBlog({ commit, dispatch }, { blog, index }) {
    commit('setLoading', true)
    this.$axios.$post('/api/blog', blog)
      .then((data) => {
        if (data.status) {
          commit('removeBlog', index)
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
  setBlog(state, blogs) {
    state.blogs = []
    blogs.map(blog => {
      state.blogs.push(blog)
    })
  },
  addBlog(state, blog) {
    state.blogs.unshift(blog)
  },
  updateBlog(state, { blog, index }) {
    Object.assign(state.blogs[index], blog)
  },
  removeBlog(state, index) {
    state.blogs.splice(index, 1)
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}
