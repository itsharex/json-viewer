<script lang="ts" setup>
import { useDialogWidth } from '@/hooks'

const emit = defineEmits<{
  // confirm: [val: ImageConfig]
  (event: 'confirm', val: ImageConfig): void
}>()
const isDark = useDark()
interface ImageConfig {
  name: string
  type: string
  padding: number
  backgroundColor: string
}
const width = useDialogWidth()
const visible = defineModel<boolean>()
const imageTypes = reactive({
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  WEBP: 'image/webp',
  BMP: 'image/bmp',
})
const exportConfig = ref<ImageConfig> ({
  name: 'json-viewer',
  type: 'image/png',
  padding: 20,
  backgroundColor: '#fff',
})

function confirm() {
  emit('confirm', {
    ...exportConfig.value,
    backgroundColor: isDark.value ? '#000' : '#fff',
  })
  visible.value = false
}
</script>

<template>
  <el-dialog v-model="visible" :title="$t('saveImage')" :width="width">
    <el-form label-width="72px">
      <el-form-item :label="$t('imageName')">
        <el-input
          v-model="exportConfig.name"
          :placeholder="$t('saveImagePlaceholder')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('saveFormat')">
        <el-radio-group v-model="exportConfig.type">
          <el-radio-button
            v-for="(typeItem, key) of imageTypes"
            :key="typeItem"
            :value="typeItem"
          >
            {{ key }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="confirm">{{ $t('export') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
