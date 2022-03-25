import Vue from 'vue'
Vue.filter('striphtml', (value) => {
  let div = document.createElement('div')
  div.innerHTML = value
  return div.textContent || div.innerText || ''
})
