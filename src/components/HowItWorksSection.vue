<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="text-center mb-16 max-w-2xl mx-auto"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <h2 class="text-3xl font-bold text-gray-800">Cara Kerja Platform</h2>
        <p class="text-gray-600 mt-3 text-lg">
          Proses sederhana untuk menyelamatkan makanan dan menghemat uang
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-16 items-center">
        <div
          class="flex justify-center"
          v-motion
          :initial="{ opacity: 0, x: -100 }"
          :visibleOnce="{
            opacity: 1,
            x: 0,
            transition: { duration: 600, delay: 200 },
          }"
        >
          <img
            src="@assets/how-it-works.png"
            alt="Mangkuk salad"
            class="w-80 h-80 lg:w-96 lg:h-96 rounded-full object-cover shadow-lg"
          />
        </div>

        <div class="space-y-6">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex items-start bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            v-motion
            :initial="{ opacity: 0, x: 100 }"
            :visibleOnce="{
              opacity: 1,
              x: 0,
              transition: { duration: 500, delay: 400 + index * 150 },
            }"
          >
            <div
              class="flex-shrink-0 w-12 h-12 bg-green-100 text-[#10B981] rounded-full flex items-center justify-center"
            >
              <Icon :icon="step.icon" class="w-7 h-7" />
            </div>
            <div class="ml-5">
              <h3 class="text-xl font-semibold text-gray-800">
                {{ step.title }}
              </h3>
              <p class="text-gray-600 mt-1">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const steps = ref([
  {
    icon: "mdi:map-search-outline",
    title: "Jelajahi Peta",
    description:
      "Buka aplikasi dan lihat peta interaktif yang menampilkan penawaran makanan surplus di sekitar lokasi Anda.",
  },
  {
    icon: "mdi:cart-outline",
    title: "Pesan & Bayar",
    description:
      "Pilih penawaran yang menarik, lihat detail makanan dan harga, lalu lakukan reservasi atau pembelian langsung.",
  },
  {
    icon: "mdi:silverware-fork-knife",
    title: "Ambil & Nikmati",
    description:
      "Nikmati makanan berkualitas dengan harga terjangkau dan berikan review untuk membantu pengguna lain.",
  },
]);
</script>
