export const state = () => ({
  lessons: [],
  loading: false
})

export const getters = {
  lessons: state => state.lessons,
  loading: state => state.loading
}

export const actions = {
  async onLoadLessons({ commit, dispatch }) {
    commit('setLoading', true)
    this.$axios.$get('/api/lesson/all')
      .then((data) => {
        if (data.status) {
          commit('setLesson', data.lesson)
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
  async onSaveLesson({ commit, dispatch }, lesson) {
    commit('setLoading', true)
    this.$axios.$post('/api/lesson', {
      lesson: lesson,
      action: 'insert'
    })
      .then((data) => {
        if (data.status) {
          commit('addLesson', { ...lesson, id: data.lesson.id })
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
  async onUpdateLesson({ commit, dispatch }, { lesson, index } ) {
    commit('setLoading', true)
    this.$axios.$post('/api/lesson', {
      lesson: lesson,
      action: 'update'
    })
      .then((data) => {
        if (data.status) {
          commit('updateLesson', { lesson, index })
          dispatch('misc/showMessage', data.info, { root: true })
        } else {
          dispatch('misc/showMessage', error, { root: true })
        }
        commit('setLoading', false)
      })
      .catch(error => {
        dispatch('misc/showMessage', 'Bir hata oluştu. Tekrar deneyiniz!', { root: true })
        commit('setLoading', false)
      })
  },
  async onDeleteLesson({ commit, dispatch }, { lesson, index } ) {
    commit('setLoading', true)
    this.$axios.$post('/api/lesson', {
      lesson: lesson,
      action: 'delete'
    })
      .then((data) => {
        if (data.status) {
          commit('removeLesson', index)
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
  setLesson(state, lessons) {
    state.lessons = []
    lessons.map(lesson => {
      state.lessons.push(lesson)
    })
  },
  addLesson(state, lesson) {
    state.lessons.unshift(lesson)
  },
  updateLesson(state, { lesson, index }) {
    Object.assign(state.lessons[index], lesson)
  },
  removeLesson(state, index) {
    state.lessons.splice(index, 1)
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}
