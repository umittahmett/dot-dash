<script setup lang="ts">
  import { ref, watch } from 'vue'
  import IPhoneFrame from "./components/IPhoneFrame.vue";
  import Navbar from "./components/Navbar.vue";
  import Input from "./components/ui/Input.vue";
  import Button from './components/ui/Button.vue';
  import VolumeHighIcon from '@/assets/icons/volume-high.svg';
  import StopIcon from '@/assets/icons/stop.svg';

  const text = ref('')
  const message = ref('')
  const unsupportedCharacters = ref<string[]>([])
  const soundStatus = ref('stopped')
  const speed = ref(1)
  const morseCodes = {
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "V": "...-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--..",
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    "&": ".-...",
    "'": ".----.",
    "@": ".--.-.",
    ")": "-.--.-",
    "(": "-.--.",
    ":": "---...",
    ",": "--..--",
    "=": "-...-",
    "!": "-.-.--",
    ".": ".-.-.-",
    "-": "-....-",
    "×": "-..-",
    "%": "----- -..- .---- .-. .----",
    "+": ".-.-.",
    "\"": ".-..-.",
    "?": "..--..",
    "/": "-..-.",
    "À": ".--.-",
    "Å": ".--.-",
    "Ä": ".-.-",
    "Ą": ".-.-",
    "Æ": ".-.-",
    "Ć": "-.-..",
    "Ĉ": "-.-..",
    "Ç": "-.-..",
    "Ch": "----",
    "Ĥ": "----",
    "Š": "----",
    "Đ": "..--.",
    "É": "..-..",
    "Ę": "..-..",
    "Ð": "..--.",
    "È": ".-..-",
    "Ł": ".-..-",
    "Ĝ": "--.-.",
    "Ĵ": ".---.",
    "Ń": "--.--",
    "Ñ": "--.--",
    "Ó": "---.",
    "Ö": "---.",
    "Ø": "---.",
    "Ś": "...-...",
    "Ŝ": "...-.",
    "Þ": ".--..",
    "Ü": "..--",
    "Ŭ": "..--",
    "Ź": "--..-.",
    "Ż": "--..-."
  }


  function isMorseCode(str:string) {
    const regex = new RegExp(`^[\\s\\-\\./ ]+$`);
    return regex.test(str);
  }
  
  watch(text, () => {
    if (text.value == '') {
      message.value = ''
    }
    
    unsupportedCharacters.value = []
    text.value.split('').forEach((char)=>{
      if (char != ' ') {
        if (!morseCodes.hasOwnProperty(char.toUpperCase())) {
          unsupportedCharacters.value.includes(char) ? null : unsupportedCharacters.value.push(char)
        }
      }
    })

    if (text.value) {
     if (isMorseCode(text.value)) {
      let morsWords = text.value.split('/') // ['... --- ...', '... --- ...']
      message.value = morsWords.map((mw)=>{
        let morsLetters = mw.split(' ') // ['...', '---', '...']
        return morsLetters.map((ml)=>{
          let letter = Object.keys(morseCodes).find(key => morseCodes[key as keyof typeof morseCodes] === ml)
          return letter || '' // 'S'
        }).join('') // 'SOS'
      }).join(' ') // 'SOS SOS'
     }
     else {
      let words = text.value.split(' ') // ['SOS', 'SOS']
      message.value = words.map((mw)=>{
        let wordLetters = mw.split('') // ['S', 'O', 'S']
        return wordLetters.map((wl)=>{
          let letter = morseCodes[wl.toUpperCase() as keyof typeof morseCodes]
          return letter || '#' // 'S'
        }).join(' ') // 'S O S'
      }).join(' / ') // 'SOS / SOS'
     }
    }
  })

  function cleanUp(){
    text.value = text.value.replace(new RegExp(`[${unsupportedCharacters.value.map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')}]`, 'g'), '')
  }

  let audioContext: AudioContext | null = null;

  function getAudioContext() {
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    return audioContext;
  }

  function bip(frekans: number, duration: number) {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    const realDuration = duration / speed.value;
    
    oscillator.frequency.setValueAtTime(frekans, audioContext.currentTime);
    
    const now = audioContext.currentTime;
    const fadeTime = Math.min(0.01, realDuration * 0.05);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + fadeTime);
    gainNode.gain.linearRampToValueAtTime(0.3, now + realDuration - fadeTime);
    gainNode.gain.linearRampToValueAtTime(0, now + realDuration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + realDuration);
  }
  
  async function morsNokta() {
    bip(550, 0.075);
    return wait(75);
  }

  async function morsCizgi() {
    bip(550, 0.20);
    return wait(200);
  }

  function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms/speed.value));
  }

  async function morseSound() {
    soundStatus.value = 'playing';
    const words = message.value.split('/');
    if (soundStatus.value == 'stopped') return;
    
    for (let word of words) {
      const letters = word.split(' ');
      if (soundStatus.value == 'stopped') return;
      
      for (let letter of letters) {
        for (let morse of letter.split('')) {
          if (soundStatus.value == 'stopped') return;
          if (morse == '.') {
            await morsNokta();
            await wait(50)
          }
          else if (morse == '-') {
            await morsCizgi();
            await wait(50)
          }
        }
        await wait(150);
      }
      await wait(150);
    }
    
    soundStatus.value = 'stopped'
  }

  function stopSound() {
    soundStatus.value = 'stopped';
  }

</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
    <IPhoneFrame>
      <div class="space-y-5">
        <Navbar />
        <Input 
          extraClass='w-full' 
          placeholder="Type text or Morse code 
Example: ' ... --- ... / - .... . '" 
          v-model="text" 
        />

        <div v-if="unsupportedCharacters.length > 0">
          <div class="text-sm text-red-600">Cannot translate the highlighted characters:</div>
          <div class="py-3.5 px-5 font-bold text-red-600 bg-white rounded-lg shadow-[0_4px_20px_0_rgba(154, 154, 154, 0.25)] text-black placeholder:text-black/50 text-lg outline-0">
            <span class="!tracking-[5px]">{{ unsupportedCharacters.join(' ') }}</span>
          </div>
          <Button @click="morsNokta" class="mt-2" variant="secondary" size="sm" >Clean Up</Button>
        </div>

        <Input 
          readonly 
          extraClass="w-full" 
          placeholder="Translated Message" 
          v-model="message" 
        />
        
       <div class="flex items-center gap-2.5 justify-center">
          <Button :disabled="soundStatus == 'playing' || message == ''" @click="morseSound" class="mt-2" variant="primary" >
            <VolumeHighIcon />
          </Button>  
          <Button :disabled="soundStatus == 'stopped'" @click="stopSound" class="mt-2" variant="primary" >
            <StopIcon />
          </Button>
       </div>  
      </div>
    </IPhoneFrame>
  </div>
</template>