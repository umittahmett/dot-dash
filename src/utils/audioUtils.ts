function createMorseBuffer(audioContext:AudioContext, message:string, freq = 550, speed = 1) {
  const dotDuration = 0.075 / speed
  const dashDuration = 0.20 / speed
  const elementGap = 0.05 / speed
  const letterGap = 0.15 / speed
  const wordGap = 0.35 / speed
  const sampleRate = audioContext.sampleRate
  
  let totalDuration = 0
  const words = message.includes('/') ? message.split('/') : [message]
  
  for (let word of words) {
    const letters = word.trim().split(' ')
    for (let letter of letters) {
      for (let i = 0; i < letter.length; i++) {
        const char = letter[i]
        totalDuration += (char === '.') ? dotDuration : dashDuration
        if (i < letter.length - 1) totalDuration += elementGap
      }
      totalDuration += letterGap
    }
    totalDuration += wordGap
  }
  
  const buffer = audioContext.createBuffer(1, Math.ceil(sampleRate * totalDuration), sampleRate)
  const data = buffer.getChannelData(0)
  let pos = 0
  
  for (let word of words) {
    const letters = word.trim().split(' ')
    
    for (let letter of letters) {
      for (let i = 0; i < letter.length; i++) {
        const char = letter[i]
        const duration = (char === '.') ? dotDuration : dashDuration
        const frames = Math.ceil(sampleRate * duration)
        const fadeFrames = Math.min(frames * 0.15, sampleRate * 0.01)
        
        for (let j = 0; j < frames; j++) {
          let amplitude = 0.3
          
          if (j < fadeFrames) {
            amplitude *= j / fadeFrames
          } else if (j > frames - fadeFrames) {
            amplitude *= (frames - j) / fadeFrames
          }
          
          data[pos] = Math.sin(2 * Math.PI * freq * pos / sampleRate) * amplitude
          pos++
        }

        if (i < letter.length - 1) {
          pos += Math.ceil(sampleRate * elementGap)
        }
      }
      pos += Math.ceil(sampleRate * letterGap)
    }
    pos += Math.ceil(sampleRate * wordGap)
  }
  
  return buffer
}

function audioBufferToWav(buffer: AudioBuffer) {
  const length = buffer.length
  const sampleRate = buffer.sampleRate
  const arrayBuffer = new ArrayBuffer(44 + length * 2)
  const view = new DataView(arrayBuffer)
  
  const writeString = (offset:number, string:string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
  
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + length * 2, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, length * 2, true)
  
  const channelData = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    const sample = channelData[i] * 0x7FFF
    view.setInt16(44 + i * 2, sample, true)
  }
  
  return arrayBuffer
}

export { createMorseBuffer, audioBufferToWav }