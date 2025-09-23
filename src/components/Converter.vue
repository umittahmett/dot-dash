<script setup lang="ts">

import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import StopIcon from '@/assets/icons/stop.svg';
import PlayIcon from '@/assets/icons/play.svg';
import UploadIcon from '@/assets/icons/upload.svg';
import DownloadIcon from '@/assets/icons/download.svg';
import { useAudio } from '@/composables/useAudio';
import { useFileOperations } from '@/composables/useFileOperations';
import { useMorse } from '@/composables/useMorse';

const { text, message, unsupportedCharacters, cleanUp } = useMorse()
const { errorMessage, fileInput, triggerFileInput, decodeAudio } = useFileOperations()
const { soundStatus, audioRef, stopSound, pauseResumeSound, morseSound, downloadAudio } = useAudio()

</script>

<template>  
  <div class="space-y-5 w-full max-w-3xl">
    <p class="text-red-600 text-sm mb-0.5">{{ errorMessage }}</p>
    <Input extraClass='w-full' placeholder="Type text or Morse code 
Example: ' ... --- ... / - .... . '" v-model="text" />

    <div v-if="unsupportedCharacters.length > 0">
      <div class="text-sm text-red-600">Cannot translate the highlighted characters:</div>
      <div
        class="py-3.5 px-5 font-bold text-red-600 bg-white rounded-lg shadow-[0_4px_20px_0_rgba(154, 154, 154, 0.25)] text-black placeholder:text-black/50 text-lg outline-0">
        <span class="!tracking-[5px]">{{ unsupportedCharacters.join(' ') }}</span>
      </div>
      <Button @click="cleanUp" class="mt-2" variant="secondary" size="sm">Clean Up</Button>
    </div>

    <Input readonly extraClass="w-full" placeholder="Translated Message" v-model="message" />

    <div class="flex items-center gap-2.5 justify-center">
      <Button size="icon" :disabled="soundStatus !== 'playing' && message == ''"
        @click="soundStatus == 'stopped' ? morseSound(message, text) : pauseResumeSound()" class="mt-2"
        variant="primary">
        <PlayIcon v-if="soundStatus == 'paused' || soundStatus == 'stopped'" />
        <span v-else class="text-lg font-bold">⏸</span>
      </Button>

      <Button size="icon" :disabled="soundStatus == 'stopped'" @click="stopSound()" class="mt-2" variant="primary">
        <StopIcon />
      </Button>

      <Button size="icon" :disabled="soundStatus == 'playing'" @click="triggerFileInput" class="mt-2" variant="primary">
        <UploadIcon />
        <input multiple="false" ref="fileInput" class="hidden" type="file"
          @change="decodeAudio($event.target.files[0], (newText) => text = newText, (newMessage) => message = newMessage)" />
      </Button>

      <Button size="icon" @click="downloadAudio(message, text)" :disabled="!message" class="mt-2" variant="primary">
        <DownloadIcon />
      </Button>
    </div>

    <audio ref="audioRef" />
  </div>
</template>