<script setup lang="ts">
// Composables
import { useAudio } from '@/composables/useAudio';
import { useFileOperations } from '@/composables/useFileOperations';
import { useMorse } from '@/composables/useMorse';

// Components
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

// Icons
import StopIcon from '@/assets/icons/stop.svg';
import PlayIcon from '@/assets/icons/play.svg';
import PauseIcon from '@/assets/icons/pause.svg';
import UploadIcon from '@/assets/icons/upload.svg';
import DownloadIcon from '@/assets/icons/download.svg';
import TrashIcon from '@/assets/icons/trash.svg';

const { text, message, unsupportedCharacters, cleanUp, clearAll } = useMorse()
const { errorMessage, fileInput, triggerFileInput, decodeAudio } = useFileOperations()
const { frequency, playbackRate, soundStatus, audioRef, stopSound, pauseResumeSound, morseSound, downloadAudio } = useAudio()

</script>

<template>
  <div class="space-y-5 w-full">
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

    <div class="flex flex-col-reverse w-full *:w-full lg:grid lg:grid-cols-2 gap-6 items-center">
      <div class="flex items-center gap-6 justify-center flex-col text-primary bg-white p-6 rounded-2xl">
        <div class="flex items-start w-full gap-2 flex-col">
          <p>
            <span class="">Speed:</span>
            <span class="ml-2 text-secondary font-medium">{{ playbackRate }}%</span>
          </p>

          <input type="range" min="50" max="200" step="1" v-model="playbackRate"
            class="w-full h-2 bg-background accent-primary rounded-lg appearance-none cursor-pointer" />
        </div>

        <div class="flex items-start w-full gap-2 flex-col">
          <p>
            <span class="">Tone:</span>
            <span class="ml-2 text-secondary font-medium">{{ frequency }}Hz</span>
          </p>

          <input type="range" min="200" max="1000" step="1" v-model="frequency"
            class="w-full h-2 bg-background accent-primary rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>

      <div class="flex items-center gap-2.5 justify-center">
        <Button extraClass="!flex-col" size="icon" :disabled="soundStatus !== 'playing' && message == ''"
          @click="soundStatus == 'stopped' ? morseSound(message, text) : pauseResumeSound()" class="mt-2"
          variant="primary">
          <PlayIcon v-if="soundStatus == 'paused' || soundStatus == 'stopped'" />
          <PauseIcon v-else class="text-lg font-bold" />
          <div class="text-xs">{{ soundStatus == 'paused' ? 'Play' : 'Pause' }}</div>
        </Button>

        <Button extraClass="!flex-col" size="icon" :disabled="soundStatus == 'stopped'" @click="stopSound()" class="mt-2" variant="primary">
          <StopIcon />
          <div class="text-xs">Stop</div>
        </Button>

        <Button extraClass="!flex-col" size="icon" :disabled="soundStatus == 'playing'" @click="triggerFileInput" class="mt-2"
          variant="primary">
          <UploadIcon />
          <input multiple="false" ref="fileInput" class="hidden" type="file"
            @change="decodeAudio($event.target?.files[0], (newText) => text = newText, (newMessage) => message = newMessage)" />

          <div class="text-xs">Upload</div>
        </Button>

        <Button extraClass="!flex-col" size="icon" @click="downloadAudio(message, text)" :disabled="!message" class="mt-2" variant="primary">
          <DownloadIcon />
          <div class="text-xs">Download</div>
        </Button>

        <Button extraClass="!flex-col" size="icon" @click="clearAll" class="mt-2" variant="primary">
          <TrashIcon />
          <div class="text-xs">Clear</div>
        </Button>
      </div>
    </div>

    <audio ref="audioRef" />
  </div>
</template>