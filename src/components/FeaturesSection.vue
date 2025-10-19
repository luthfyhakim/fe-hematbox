<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const features = ref([
  {
    title: "Peta Real-Time",
    description:
      "Lihat penawaran surplus makanan di sekitar Anda secara real-time dengan teknologi GIS yang akurat dan responsif.",
    icon: "mdi:map-marker-radius",
    iconColor: "text-green-500",
    iconBg: "bg-green-100",
  },
  {
    title: "Dashboard Bisnis",
    description:
      "Kelola penawaran surplus dengan mudah. Posting, update, dan pantau penjualan melalui dashboard yang intuitif.",
    icon: "mdi:view-dashboard",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
  },
  {
    title: "Smart Shopping",
    description:
      "Reservasi makanan, lacak ketersediaan, dan dapatkan notifikasi dari toko favorit Anda.",
    icon: "mdi:shopping",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100",
  },
  {
    title: "Notifikasi Cerdas",
    description:
      "Dapatkan pemberitahuan instan saat toko favorit memposting penawaran baru atau magic box tersedia.",
    icon: "mdi:bell",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-100",
  },
  {
    title: "Pembayaran Aman",
    description:
      "Sistem pembayaran terintegrasi dengan multiple payment gateway untuk transaksi yang aman dan mudah.",
    icon: "mdi:credit-card",
    iconColor: "text-red-500",
    iconBg: "bg-red-100",
  },
  {
    title: "Analytics & Insights",
    description:
      "Pantau dampak lingkungan dan ekonomi dari setiap transaksi dengan laporan yang komprehensif.",
    icon: "mdi:chart-bar",
    iconColor: "text-teal-500",
    iconBg: "bg-teal-100",
  },
]);
</script>

<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-800">
          Fitur Unggulan Platform
        </h2>
        <p class="text-gray-600 mt-3 text-lg">
          Teknologi GIS real-time yang memudahkan bisnis dan konsumen dalam
          mengurangi limbah pangan
        </p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="p-8 bg-green-50/50 rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visible="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
          :hovered="{ scale: 1.05, y: -5, transition: { duration: 300 } }"
        >
          <div
            :class="feature.iconBg"
            class="w-14 h-14 rounded-lg inline-flex items-center justify-center mb-5"
          >
            <Icon
              :icon="feature.icon"
              :class="feature.iconColor"
              class="w-8 h-8"
            />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
