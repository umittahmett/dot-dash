// Core
import { ref, watch } from 'vue'

// Utils
import { morseConverter } from '@/utils/morseUtils'

export function useMorse() {
  const text = ref('')
  const message = ref('')
  const unsupportedCharacters = ref<string[]>([])

  watch(text, () => {
    if (text.value === '') {
      message.value = ''
      return
    }

    unsupportedCharacters.value = []

    const { convertedMessage, updatedUnsupportedCharacters } = morseConverter(
      text.value, 
      unsupportedCharacters.value
    )
    
    message.value = convertedMessage
    unsupportedCharacters.value = updatedUnsupportedCharacters
  })

  const cleanUp = () => {
    text.value = text.value.replace(new RegExp(`[${unsupportedCharacters.value.map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')}]`, 'g'), '')
    unsupportedCharacters.value = []
  }

  const clearAll = () => {
    text.value = ''
    message.value = ''
    unsupportedCharacters.value = []
  }

  return {
    text,
    message,
    unsupportedCharacters,
    cleanUp,
    clearAll
  }
}