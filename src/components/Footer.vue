<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const bubbles = ref([]);
let bubbleInterval;

const createBubble = () => {
  const size = Math.random() * 20 + 10;
  const delay = Math.random() * 3000;
  const duration = Math.random() * 10 + 15;
  const left = Math.random() * 100;
  const drift = (Math.random() - 0.5) * 60;

  bubbles.value.push({
    id: Date.now() + Math.random(),
    size: `${size}px`,
    left: `${left}vw`,
    delay: `${delay}ms`,
    duration: `${duration}s`,
    drift: `${drift}px`,
  });

  setTimeout(() => {
    bubbles.value.shift();
  }, duration * 1000 + 1000);
};

onMounted(() => {
  // Mengurangi jumlah gelembung awal agar tidak terlalu ramai saat pertama kali dimuat
  for (let i = 0; i < 5; i++) {
    createBubble();
  }
  // Mengubah interval menjadi lebih cepat (dari 1000ms menjadi 300ms)
  bubbleInterval = setInterval(createBubble, 150);
});

onUnmounted(() => {
  clearInterval(bubbleInterval);
});
</script>

<template>
  <footer class="relative bg-emerald-600 text-white overflow-hidden">
    <div
      class="absolute -top-12 -left-12 w-64 h-64 opacity-50 pointer-events-none animate-spin-slow"
    >
      <div class="absolute inset-0 rounded-full border-2 border-white/20"></div>
      <div class="absolute inset-8 rounded-full border-2 border-white/20"></div>
      <div
        class="absolute inset-16 rounded-full border-2 border-white/20"
      ></div>
    </div>

    <div
      class="absolute -bottom-12 -right-12 w-64 h-64 opacity-50 pointer-events-none animate-spin-slow [animation-direction:reverse;]"
    >
      <div class="absolute inset-0 rounded-full border-2 border-white/20"></div>
      <div class="absolute inset-8 rounded-full border-2 border-white/20"></div>
      <div
        class="absolute inset-16 rounded-full border-2 border-white/20"
      ></div>
    </div>

    <div
      v-for="bubble in bubbles"
      :key="bubble.id"
      class="absolute bg-white/30 rounded-full pointer-events-none animate-water-bubble"
      :style="{
        width: bubble.size,
        height: bubble.size,
        left: bubble.left,
        animationDelay: bubble.delay,
        animationDuration: bubble.duration,
        '--drift-x': bubble.drift,
      }"
    ></div>

    <div
      class="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-[450px]"
    >
      <div
        class="relative flex-grow flex flex-col items-center justify-center text-center py-16"
      >
        <img
          src="@assets/bulatan.png"
          alt="Dekorasi bulatan"
          class="absolute top-2/3 left-1/2 w-[650px] h-[650px] pointer-events-none animate-float-bubble"
          style="transform: translate(-50%, -50%)"
        />

        <div
          class="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full text-center"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visibleOnce="{
            opacity: 1,
            y: 0,
            transition: { duration: 800, ease: 'easeOut' },
          }"
        >
          <h2 class="relative -translate-x-4 text-sm lg:text-5xl font-bold">
            Mau nanya apa?
          </h2>

          <div
            class="relative -translate-x-4 w-20 h-1 bg-white/30 mx-auto mt-4 mb-8 rounded-full"
          ></div>

          <a
            href="#"
            class="relative -translate-x-4 inline-block bg-black/20 text-white px-8 py-3 rounded-full font-semibold border border-white/30 hover:bg-black/40 transition-colors"
          >
            Tanya sekarang
          </a>
        </div>
      </div>

      <div
        class="relative z-10 flex-shrink-0 w-full py-6 border-t border-white/20"
      >
        <div
          class="flex flex-col md:flex-row justify-between items-center text-sm"
        >
          <div
            class="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center"
          >
            <span class="font-bold text-base">HematBox</span>
            <a href="#" class="hover:underline">Fitur</a>
            <a href="#" class="hover:underline">Cara Kerja</a>
            <a href="#" class="hover:underline">Dampak</a>
          </div>
          <p class="text-gray-200 mt-4 md:t-0">
            &copy;2025 HematBox. All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ... Bagian style tetap sama ... */
@keyframes float-bubble {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  25% {
    transform: translate(-52%, -53%) scale(1.01);
  }
  50% {
    transform: translate(-50%, -55%) scale(1.02);
  }
  75% {
    transform: translate(-48%, -53%) scale(1.01);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Mengubah jarak tempuh animasi gelembung */
@keyframes water-bubble {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    /* Bergerak 500px ke atas, pas di dalam area footer */
    transform: translateY(-500px) translateX(var(--drift-x)) scale(1.2);
    opacity: 0;
  }
}

.animate-float-bubble {
  animation: float-bubble 15s ease-in-out infinite;
}
.animate-spin-slow {
  animation: spin-slow 40s linear infinite;
}
.animate-water-bubble {
  animation: water-bubble linear infinite;
  bottom: -50px;
}
</style>
