// Core
import { ref, watch } from 'vue'

const loading = ref(false)
const errorMessage = ref('')

watch(errorMessage, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
})

export function useFileOperations() {
  const fileInput = ref<HTMLInputElement>()

  const triggerFileInput = () => {
    fileInput.value?.click()
  }
  
  const decodeAudio = async (file: File, setText: (text: string) => void, setMessage: (message: string) => void) => {
    if (!file) return

    const formData = new FormData()
    formData.append('audio', file)

    try {
      console.log('loading changed');
      
      loading.value = true
      errorMessage.value = ''

      const response = await fetch('http://localhost:8081/decode', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setText(result.decoded_text)
        setMessage(result.morse_code)
      } else {
        console.error('API Error:', result)
        errorMessage.value = `Error: ${result.error || 'Unknown error occurred'}`
      }
    } catch (error) {
      console.error('Network/Parse Error:', error)
      errorMessage.value = 'Network error occurred'
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    errorMessage.value = ''
  }

  return {
    loading,
    errorMessage,
    fileInput,
    triggerFileInput,
    decodeAudio,
    clearError
  }
}