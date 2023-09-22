import Toast from 'vue-toastification'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    hideProgressBar: true,
    timeout: 3000,
    draggable: false,
    position: 'bottom-right'
  })
})
