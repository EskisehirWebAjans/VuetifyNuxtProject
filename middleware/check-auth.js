import { getUserFromCookie, getUserFromLocalStorage } from '~/utils'

export default function ({ store, req, route }) {
  store.dispatch('auth/getAuthUser')
  const menuItems = store.getters['misc/menuItems']
    const activeItem = menuItems.find(item => item.path === route.path)
  if(activeItem) {
    store.dispatch('misc/setBarTitle', activeItem.title)
  }
  /*if (process.server && !req) return

  const userData = process.server ? getUserFromCookie(req) : getUserFromLocalStorage()

  if(!userData) {
    return
  } else if (!userData.jwt || Date.now() > userData.expiresIn) {
    // store.commit('auth/clearToken')
    // store.commit('auth/clearUser')
    store.dispatch('auth/onLogout')
  } else {
    store.commit('auth/setToken', { jwt: userData.jwt, expiresIn: userData.expiresIn })
    const timeToLogout = userData.expiresIn - Date.now()
    store.dispatch('auth/setLogoutTimer', timeToLogout)
  }*/
}
