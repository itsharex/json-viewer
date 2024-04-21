import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () =>{
    const colors = {
      "orange": "#fb923c",
      "amber": "#fbbf24",
      "yellow": "#facc15",
      "lime": "#a3e635",
      "green": "#00DC82",
      "teal": "#2dd4bf",
      "cyan": "#22d3ee",
      "sky": "#38bdf8",
      "blue": "#60a5fa",
      "indigo": "#818cf8",
      "violet": "#a78bfa",
      "purple": "#c084fc",
      "fuchsia": "#e879f9",
      "pink": "#f472b6",
      "rose": "#fb7185"
  }
  const colorName = ref('orange')
  const colorValue = computed(() => colors[colorName.value])
  return { colors, colorName,colorValue}
},{persist: true})
