export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    mounted(el) {
      const node = el as HTMLElement
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const rect = node.getBoundingClientRect()
      const seen = rect.top < window.innerHeight * 0.92 && rect.bottom > 0
      if (reduced || seen) {
        node.classList.add('is-in')
        return
      }
      node.classList.add('reveal-arm')
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.classList.add('is-in')
          observer.disconnect()
        }
      }, { threshold: 0.12 })
      observer.observe(node)
    },
    getSSRProps() {
      return {}
    },
  })
})