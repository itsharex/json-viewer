import { setHtmlProperty } from '@/utils'
import { useMobile} from '@/hooks'
export const useGlobalStore = defineStore('global', () => {
  const keyword = ref('')
  const focusCount = ref(0)
  const isDark = useDark()
  const fields = ref(['result'])
  const autoRender = ref(true)
  const toggleExecuteMode = useToggle(autoRender)
  const  isMobile  = useMobile()
  // 编辑区展开/收起
  const [isExpandEditor, toggleEditor] = useToggle(true)
  const paneSize = computed(() => {
    if(isMobile.value){
      return isExpandEditor.value ? [50,50] : [0, 100]
    }else{
      return isExpandEditor.value ? [30, 70] : [0, 100]
    }
  })
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
  const colorValue = computed(() => {
    const color = colors[colorName.value]
    setHtmlProperty('--el-color-primary', color)
    return color
  })
  return {
    isDark,
    fields,
    keyword,
    focusCount,
    colors,
    colorName,
    colorValue,
    autoRender,
    toggleExecuteMode,
    isExpandEditor,
    toggleEditor,
    paneSize
  }
}, { persist: true })
