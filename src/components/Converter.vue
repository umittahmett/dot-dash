<script setup lang="ts">
// Third party
import clsx from 'clsx';

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
import DotIcon from '@/assets/icons/dot.svg'
import MicrophoneIcon from '@/assets/icons/microphone.svg'

const { 
  text, 
  message, 
  unsupportedCharacters, 
  cleanUp, 
  clearAll 
} = useMorse()

const { 
  errorMessage, 
  fileInput, 
  triggerFileInput,
  handleFileChange
} = useFileOperations()

const { 
  frequency, 
  playbackRate, 
  soundStatus, 
  audioRef, 
  showRecordingModal, 
  recordingError, 
  isRecording, 
  stopSound, 
  pauseResumeSound, 
  morseSound, 
  downloadAudio, 
  stopRecord, 
  startRecord 
} = useAudio()

</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <p class="text-red-600 mt-4">{{ errorMessage || recordingError }}</p>
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

    <div class="flex flex-col-reverse w-full *:w-full lg:grid lg:grid-cols-5 xl:grid-cols-2 gap-6 items-center">
      <div class="col-span-2 xl:col-span-1 flex items-center gap-6 justify-center flex-col text-primary bg-white p-6 rounded-2xl">
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

      <div class="flex justify-center gap-2.5 col-span-3 xl:col-span-1 flex-wrap">
        <Button extraClass="!flex-col" size="icon" :disabled="soundStatus !== 'playing' && message == ''"
          @click="soundStatus == 'stopped' ? morseSound(message, text) : pauseResumeSound()" class="mt-2"
          :variant="soundStatus == 'playing' ? 'warn' : 'secondary'">
          <PlayIcon v-if="soundStatus == 'paused' || soundStatus == 'stopped'" />
          <PauseIcon v-else class="text-lg font-bold" />
          <div class="text-xs mt-px">{{ soundStatus == 'paused' || soundStatus == 'stopped' ? 'Play' : 'Pause' }}</div>
        </Button>

        <Button extraClass="!flex-col" size="icon" :disabled="soundStatus == 'stopped'" @click="stopSound()" class="mt-2" variant="danger">
          <StopIcon />
          <div class="text-xs mt-px">Stop</div>
        </Button>

        <Button extraClass="!flex-col" size="icon" @click="clearAll" class="mt-2" variant="danger">
          <TrashIcon />
          <div class="text-xs mt-px">Clear</div>
        </Button>

        <Button extraClass="!flex-col" size="icon" :disabled="soundStatus == 'playing'" @click="triggerFileInput" class="mt-2"
          variant="secondary">
          <UploadIcon />
          <input multiple="false" ref="fileInput" class="hidden" type="file"
            @change="handleFileChange($event, (newText) => text = newText, (newMessage) => message = newMessage)" />

          <div class="text-xs mt-px">Upload</div>
        </Button>

        <Button extraClass="!flex-col" size="icon" @click="downloadAudio(message, text)" :disabled="!message" class="mt-2" variant="secondary">
          <DownloadIcon />
          <div class="text-xs mt-px">Download</div>
        </Button>

        <Button extraClass="!flex-col" size="icon" 
          @click="isRecording ? stopRecord() : startRecord((newText) => text = newText, (newMessage) => message = newMessage)" 
          :disabled="soundStatus == 'playing'" 
          class="mt-2" 
          variant="secondary">
          <DotIcon :class="clsx('scale-200',isRecording ? 'text-red-500 animate-pulse' : 'text-white')" />
          <div class="text-xs mt-px">{{ isRecording ? 'Stop Rec' : 'Record' }}</div>
        </Button>
      </div>
    </div>

    <audio ref="audioRef" />

    <!-- Recording Modal -->
    <div v-if="showRecordingModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center relative">
        <div v-if="isRecording">
          <div class="mx-auto size-14 mb-4 text-white bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <MicrophoneIcon/>
          </div>
          
          <h3 class="text-xl font-bold text-red-600 mb-2">Recording...</h3>
          <p class="text-gray-600">Speak your morse code</p>
          
          <Button @click="stopRecord" variant="primary" class="mt-4">
            End Recording
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>