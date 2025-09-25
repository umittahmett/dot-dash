// Core
import { ref, watch } from 'vue'

// Utils
import { isMorseCode } from '@/utils/morseUtils'
import { audioBufferToWav, createMorseBuffer } from '@/utils/audioUtils'

// Composables
import { useFileOperations } from '@/composables/useFileOperations'

export function useAudio() {
  const {decodeAudio } = useFileOperations()
  const soundStatus = ref('stopped') // 'stopped', 'playing', 'paused'
  const playbackRate = ref(100)
  const frequency = ref(550)
  const audioRef = ref<HTMLAudioElement>()
  let audioContext = new AudioContext()
  let recorder: MediaRecorder | null = null;
  let chunks: Blob[] = [];
  const isRecording = ref(false)
  const recordingError = ref('')
  const recordedAudioUrl = ref('')
  const showRecordingModal = ref(false)

  watch(audioRef, (newAudio) => {
    if (newAudio) {
      newAudio.addEventListener('play', () => {
        soundStatus.value = 'playing'
      })
      
      newAudio.addEventListener('pause', () => {
        soundStatus.value = 'paused'
      })
      
      newAudio.addEventListener('ended', () => {
        soundStatus.value = 'stopped'
      })
    }
  })

  const stopSound = () => {
    if (audioRef.value) {
      audioRef.value.pause()
      audioRef.value.currentTime = 0
    }
  }

  const pauseResumeSound = () => {
    if (!audioRef.value) return
    
    if (soundStatus.value === 'playing') {
      audioRef.value.pause()
    } else if (soundStatus.value === 'paused') {
      audioRef.value.play()
    }
  }

  const morseSound = async (message:string, text:string) => {
    
    if (!audioContext) {
      audioContext = new AudioContext()
    }

    const speedMultiplier = playbackRate.value / 100
    const morseCode = isMorseCode(message) ? message : text
    const morseBuffer = createMorseBuffer(audioContext, morseCode, frequency.value, speedMultiplier)
    
    const wavArrayBuffer = audioBufferToWav(morseBuffer)
    const blob = new Blob([wavArrayBuffer], { type: 'audio/wav' })
    
    if (audioRef.value?.src) {
      URL.revokeObjectURL(audioRef.value.src)
    }
    
    const audioUrl = URL.createObjectURL(blob)
    
    if (audioRef.value) {
      audioRef.value.src = audioUrl
      audioRef.value.playbackRate = 1.0
      
      try {
        await audioRef.value.play()
      } catch (error) {
        URL.revokeObjectURL(audioUrl)
        console.error('Audio play failed:', error)
      }
    }
  }

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

  async function convertWebMToWav(webmBlob: Blob): Promise<Blob> {
    try {
      const arrayBuffer = await webmBlob.arrayBuffer()
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      const wavBuffer = audioBufferToWav(audioBuffer)
      return new Blob([wavBuffer], { type: 'audio/wav' })
    } catch (error) {
      console.error('Audio conversion error:', error)
      return new Blob([webmBlob], { type: 'audio/wav' })
    }
  }

  async function startRecord(text:string,message:string) {
    try {
      recordingError.value = ''
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        recordingError.value = 'Voice recording is not supported in your browser!'
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const options = {
        mimeType: 'audio/webm;codecs=opus'
      }
      
      if (MediaRecorder.isTypeSupported('audio/wav')) {
        options.mimeType = 'audio/wav'
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/webm'
      }
      
      recorder = new MediaRecorder(stream, options)
      chunks = []
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }
      
      recorder.onstop = async () => {
        let audioBlob = new Blob(chunks, { type: options.mimeType })
      
        if (options.mimeType.includes('webm')) {
          audioBlob = await convertWebMToWav(audioBlob)
        }
    
        recordedAudioUrl.value = URL.createObjectURL(audioBlob)
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' })
        decodeAudio(audioFile, (newText) => text = newText, (newMessage) => message = newMessage)
        stream.getTracks().forEach(track => track.stop())
      }
      
      recorder.start()
      isRecording.value = true
      showRecordingModal.value = true
      
    } catch (err: any) {
      console.error('Recording error:', err)
      
      switch (err.name) {
        case 'NotAllowedError':
          recordingError.value = 'Microphone access denied. Please click "Allow" when prompted, or enable microphone in browser settings.'
          break
        case 'NotFoundError':
          recordingError.value = 'No microphone found. Please connect a microphone and try again.'
          break
        case 'NotReadableError':
          recordingError.value = 'Microphone is already in use by another application.'
          break
        case 'OverconstrainedError':
          recordingError.value = 'Microphone constraints could not be satisfied.'
          break
        case 'SecurityError':
          recordingError.value = 'Security error: Please use HTTPS or localhost.'
          break
        case 'AbortError':
          recordingError.value = 'Microphone access was aborted.'
          break
        default:
          recordingError.value = `Could not access microphone: ${err.message || 'Unknown error'}`
      }
    }
  }

  function stopRecord() {
    if (recorder && isRecording.value) {
      recorder.stop()
      isRecording.value = false
      showRecordingModal.value = false
    }
  }

return {
    soundStatus,
    playbackRate,
    frequency,
    audioRef,
    stopSound,
    pauseResumeSound,
    morseSound,
    downloadAudio,
    isRecording,
    recordingError,
    recordedAudioUrl,
    showRecordingModal,
    startRecord,
    stopRecord
  }
}