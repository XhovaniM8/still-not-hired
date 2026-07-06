import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'darkMode'

// Module-level singleton: every importer shares the same ref. Initialized
// synchronously at import time (before any component mounts), and the
// watchEffect below runs immediately on creation - so the 'dark' class is
// already on <html> before Dashboard/Applications/Analytics ever mount a
// chart. That ordering is what charts actually need: Vue mounts children
// before parents run onMounted, so a chart that only checked
// document.documentElement.classList.contains('dark') during its own
// mount would run before App.vue's old onMounted ever applied the class,
// baking in light-mode colors permanently since a plain DOM read isn't
// reactive to later class changes.
const isDark = ref(localStorage.getItem(STORAGE_KEY) === 'true')

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem(STORAGE_KEY, isDark.value)
})

export function useDarkMode() {
  function toggle() {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
}
