// composables/useAudio.js
import { ref } from 'vue'
import { isMorseCode } from '@/utils/morseUtils'
import { audioBufferToWav, createMorseBuffer } from '@/utils/audioUtils'

export function useAudio() {
  const soundStatus = ref('stopped') // 'stopped', 'playing', 'paused'
  const playbackRate = ref(100) // 100 = normal hız
  const frequency = ref(550)
  const audioRef = ref<HTMLAudioElement>()
  
  let audioContext = new AudioContext()

  // Ses durdur
  const stopSound = () => {
    if (audioRef.value) {
      audioRef.value.pause()
      audioRef.value.currentTime = 0
    }
    soundStatus.value = 'stopped'
  }

  // Ses oynat/duraklat
  const pauseResumeSound = () => {
    if (!audioRef.value) return
    
    if (soundStatus.value === 'playing') {
      audioRef.value.pause()
      soundStatus.value = 'paused'
    } else if (soundStatus.value === 'paused') {
      audioRef.value.play()
      soundStatus.value = 'playing'
    }
  }

  // Morse ses oluştur
  const morseSound = async (message:string, text:string) => {
    soundStatus.value = 'playing'
    
    if (!audioContext) {
      audioContext = new AudioContext()
    }

    const speedMultiplier = playbackRate.value / 100
    const morseCode = isMorseCode(message) ? message : text
    const morseBuffer = createMorseBuffer(audioContext, morseCode, frequency.value, speedMultiplier)
    
    const wavArrayBuffer = audioBufferToWav(morseBuffer)
    const blob = new Blob([wavArrayBuffer], { type: 'audio/wav' })
    
    // Önceki blob URL temizle
    if (audioRef.value?.src) {
      URL.revokeObjectURL(audioRef.value.src)
    }
    
    const audioUrl = URL.createObjectURL(blob)
    
    if (audioRef.value) {
      audioRef.value.src = audioUrl
      audioRef.value.playbackRate = 1.0
      
      audioRef.value.onended = () => {
        soundStatus.value = 'stopped'
      }
      
      audioRef.value.onerror = () => {
        soundStatus.value = 'stopped'
        console.error('Audio playback error')
      }
      
      try {
        await audioRef.value.play()
      } catch (error) {
        soundStatus.value = 'stopped'
        URL.revokeObjectURL(audioUrl)
        console.error('Audio play failed:', error)
      }
    }
  }

  // Audio download
  const downloadAudio = (message:string, text:string) => {
    if (!audioRef.value?.src && message) {
      if (!audioContext) {
        audioContext = new AudioContext()
      }
      
      const speedMultiplier = playbackRate.value / 100
      const morseCode = isMorseCode(message) ? message : text
      const morseBuffer = createMorseBuffer(audioContext, morseCode, frequency.value, speedMultiplier)
      const wavArrayBuffer = audioBufferToWav(morseBuffer)
      const blob = new Blob([wavArrayBuffer], { type: 'audio/wav' })
      const audioUrl = URL.createObjectURL(blob)
      
      if (audioRef.value) {
        audioRef.value.src = audioUrl
      }
    }

    if (!audioRef.value?.src) {
      console.error('No audio to download')
      return
    }

    const link = document.createElement('a')
    link.href = audioRef.value.src
    link.download = `morse-${frequency.value}Hz-${playbackRate.value}%-${Date.now()}.wav`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    soundStatus,
    playbackRate,
    frequency,
    audioRef,
    stopSound,
    pauseResumeSound,
    morseSound,
    downloadAudio
  }
}