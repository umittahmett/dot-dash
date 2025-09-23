// composables/useMorse.js
import { ref, watch } from 'vue'
import { cleanUpUnsupportedCharacters, morseConverter } from '@/utils/morseUtils'

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
    cleanUpUnsupportedCharacters(text.value, unsupportedCharacters.value)
  }

  return {
    text,
    message,
    unsupportedCharacters,
    cleanUp
  }
}