<template>
  <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
    <!-- Modern iPhone Mockup -->
    <div class="relative transform hover:scale-[1.020] transition-transform duration-300">
      <!-- Phone Frame with Gradient -->
      <div class="w-[375px] h-[812px] bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-[3.5rem] p-1 shadow-2xl ring-1 ring-white/10">
        <!-- Screen Container -->
        <div class="w-full h-full bg-black rounded-[3.2rem] p-1">
          <!-- Actual Screen -->
          <div class="w-full h-full bg-white rounded-[3rem] overflow-hidden relative">
            <!-- Dynamic Island -->
            <div class="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full z-20 flex items-center justify-center">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div class="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>

            <!-- Status Bar -->
            <div class="absolute top-4 px-2 left-0 right-0 z-30">
              <div class="flex items-center justify-between px-5 pt-1 pb-2 text-black text-[13px] font-medium select-none">
                <div class="min-w-[48px]">
                  <span class="font-semibold">9:41</span>
                </div>

                <div class="flex items-center space-x-1 min-w-[72px] justify-end">
                  <!-- Signal -->
                  <div class="flex items-end space-x-0.5">
                    <div class="w-0.5 h-1.5 bg-black rounded-full"></div>
                    <div class="w-0.5 h-2 bg-black rounded-full"></div>
                    <div class="w-0.5 h-2.5 bg-black rounded-full"></div>
                    <div class="w-0.5 h-3 bg-black rounded-full"></div>
                  </div>
                  <!-- WiFi -->
                  <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 0 1 .808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 0 1-1.414 1.414zM14.95 11.05a7 7 0 0 0-9.9 0 1 1 0 0 1-1.414-1.414 9 9 0 0 1 12.728 0 1 1 0 0 1-1.414 1.414zM12.12 13.88a3 3 0 0 0-4.24 0 1 1 0 0 1-1.415-1.415 5 5 0 0 1 7.07 0 1 1 0 0 1-1.415 1.415zM9 16a1 1 0 0 1 2 0 1 1 0 0 1-2 0z"/>
                  </svg>
                  <!-- Battery -->
                  <div class="w-6 h-3 border border-black rounded-sm ml-1 p-px relative">
                    <div class="w-4 h-2 bg-green-500 rounded-[2px]"></div>
                    <div class="absolute -right-1 top-1 w-1 h-1 bg-black rounded-r-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- App Content Area -->
            <div class="flex-1 h-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-6 pb-8 pt-16">
              <Transition mode="out-in" appear>
                <slot>
                  <!-- Default content if no slot passed -->
                  <div class="flex flex-col items-center justify-center h-full">
                    <!-- App Icon -->
                    <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-6 flex items-center justify-center">
                      <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">Dot Dash</h1>
                    <p class="text-gray-600 text-center text-lg leading-relaxed max-w-xs">Modern mobile experience with beautiful design</p>
                    <button class="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">Get Started</button>
                  </div>
                </slot>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Home Indicator -->
        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1 bg-white rounded-full opacity-80"></div>
      </div>

      <!-- Reflection Effect -->
      <div class="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 rounded-[3.5rem] pointer-events-none"></div>
    </div>
  </div>
</template>