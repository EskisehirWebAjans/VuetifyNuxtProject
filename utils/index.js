import Cookie from 'js-cookie'

export const saveUserData = (token, user) => {
  const tokenExpiration = Date.now() + token.expiresIn * 1000
  localStorage.setItem('jwt', token.jwt)
  localStorage.setItem('expiresIn', tokenExpiration)
  localStorage.setItem('username', user.username)
  localStorage.setItem('name', user.name)
  localStorage.setItem('surname', user.surname)
  localStorage.setItem('avatar', user.avatar)
  localStorage.setItem('admin', JSON.stringify(user.admin))
}

export const clearUserData = () => {
  localStorage.removeItem('jwt')
  localStorage.removeItem('expiresIn')
  localStorage.removeItem('name')
  localStorage.removeItem('surname')
  localStorage.removeItem('avatar')
  localStorage.removeItem('username')
  localStorage.removeItem('admin')
}

export const getUserFromCookie = req => {
  if (!req.headers.cookie) return

  const jwtCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('jwt='))
  const expiresInCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('expiresIn='))
  /*const emailCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('email='))
  const nameCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('name='))
  const avatarCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('avatar='))*/

  if (!jwtCookie || !expiresInCookie) return

  const jwt = jwtCookie.split('=')[1]
  const expiresIn = expiresInCookie.split('=')[1]
  /*const email = emailCookie.split('=')[1]
  const name = nameCookie.split('=')[1]
  const avatar = avatarCookie.split('=')[1]*/

  return { jwt, expiresIn }
}

export const getUserFromLocalStorage = () => {
  if (localStorage) {
    const jwt = localStorage.getItem('jwt')
    const expiresIn = localStorage.getItem('expiresIn')
    const name = localStorage.getItem('name')
    const surname = localStorage.getItem('surname')
    const avatar = localStorage.getItem('avatar')
    const username = localStorage.getItem('username')
    const admin = JSON.parse(localStorage.getItem('admin'))

    return { jwt, expiresIn, name, surname, avatar, username, admin }
  }
}
