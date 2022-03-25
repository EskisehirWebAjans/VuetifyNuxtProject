import { storage } from '~/plugins/firebase'

export const state = () => ({
  snackbar: {
    show: false,
    text: null,
    timeout: 2000
  },
  adminItems: [
    {
      title: 'Panel',
      icon: 'mdi-view-dashboard',
      name: 'dashboard',
      path: '/dashboard',
    },
    {
      title: 'Başvurular',
      icon: 'mdi-account-arrow-right',
      name: 'applications',
      path: '/dashboard/applications',
    },
    {
      title: 'Bilgiler',
      icon: 'mdi-badge-account-horizontal',
      name: 'contact',
      path: '/dashboard/contact'
    },
    {
      title: 'Bizden Kareler',
      icon: 'mdi-image-multiple',
      name: 'images',
      path: '/dashboard/images'
    },
    {
      title: 'Blog',
      icon: 'mdi-file-document-edit',
      name: 'blog',
      path: '/dashboard/blog'
    },
    {
      title: 'Dersler',
      icon: 'mdi-bookshelf',
      name: 'lessons',
      path: '/dashboard/lessons',
    },
    {
      title: 'Duyuru',
      icon: 'mdi-bullhorn',
      name: 'announce',
      path: '/dashboard/announce'
    },
    {
      title: 'Ehliyet',
      icon: 'mdi-card-account-details',
      name: 'license',
      path: '/dashboard/license',
    },
    {
      title: 'E-Sınav',
      icon: 'mdi-ballot',
      name: 'exam',
      path: '/dashboard/exam'
    },
    {
      title: 'Görüşler',
      icon: 'mdi-comment-text-multiple-outline',
      name: 'testimonial',
      path: '/dashboard/testimonials'
    },
    {
      title: 'Kurumsal',
      icon: 'mdi-city-variant',
      name: 'about',
      path: '/dashboard/about',
    },
    {
      title: 'Slider',
      icon: 'mdi-camera-burst',
      name: 'slider',
      path: '/dashboard/slider'
    },
    {
      title: 'S.S.S',
      icon: 'mdi-frequently-asked-questions',
      name: 'faq',
      path: '/dashboard/faq'
    },
  ],
  bar: {
    title: 'Panel'
  },
  menu: {
    show: true,
    items: state.adminItems
  }
})

export const getters = {
  snackbar: state => state.snackbar,
  drawer: state => state.menu,
  menuItems: state => state.adminItems,
  barTitle: state => state.bar.title,
  timeConverted(state, getters, rootState) {
    const a = new Date(rootState.auth.user.lastAccess);
    const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  }
}

export const actions = {
  async getIp() {
    const END_POINT = 'https://api.ipify.org?format=json&callback=?'
    const data  = await this.$axios.$get(END_POINT)
    return data
  },
  showMessage({ commit }, payload) {
    commit('showMessage', payload)
  },
  hideMessage({ commit }) {
    commit('hideMessage')
  },
  setDrawer({commit}) {
    commit('setDrawer')
  },
  setBarTitle({commit}, payload) {
    commit('setBarTitle', payload)
  },
  onPhotoRemove({ commit }, photo) {
    const imgRef = storage.refFromURL(photo)
    return imgRef.delete().then(() => {
      commit('showMessage', 'İşlem başarılı!')
      return true
    }).catch((error) => {
      commit('showMessage', 'Hata oluştu: ' + error)
      return false
    })
  },
}

export const mutations = {
  showMessage(state, payload) {
    if(!payload.status) {
      state.snackbar = {
        show: true,
        text: payload,
        timeout: 2000
      }
    }
  },
  hideMessage(state) {
    state.snackbar = {
      show: false,
      text: null
    }
  },
  setDrawer(state) {
    state.menu.show = !state.menu.show
  },
  setBarTitle(state, title) {
    state.bar.title = title
  },
}
