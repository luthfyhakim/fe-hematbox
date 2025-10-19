<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="w-64 bg-white p-6 flex flex-col shadow-lg h-screen">
    <!-- Logo -->
    <div class="flex items-center gap-3 mb-10">
      <img src="@/assets/logo.png" alt="HematBox Logo" class="h-16 w-auto" />
      <span class="text-xl font-bold text-gray-800">HematBox</span>
    </div>

    <!-- Navigasi -->
    <nav class="flex flex-col gap-2">
      <!-- [PERBAIKAN] Dihubungkan ke 'business-dashboard' & styling dibuat dinamis -->
      <router-link
        :to="{ name: 'business-dashboard' }"
        exact-active-class="bg-teal-50 text-teal-700 font-semibold"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
      >
        <Icon icon="mdi:view-dashboard-outline" class="w-6 h-6" />
        <span>Dashboard</span>
      </router-link>

      <!-- [PERBAIKAN] Dihubungkan ke 'business-analytics' -->
      <router-link
        :to="{ name: 'business-analytics' }"
        active-class="bg-teal-50 text-teal-700 font-semibold"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
      >
        <Icon icon="mdi:chart-line" class="w-6 h-6" />
        <span>Analytics</span>
      </router-link>

      <!-- [PERBAIKAN] Dihubungkan ke 'business-offers' (sudah benar, dirapikan) -->
      <router-link
        :to="{ name: 'business-offers' }"
        active-class="bg-teal-50 text-teal-700 font-semibold"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
      >
        <Icon icon="mdi:tag-multiple-outline" class="w-6 h-6" />
        <span>Kelola Penawaran</span>
      </router-link>

      <router-link
        :to="{ name: 'business-pembelian' }"
        active-class="bg-teal-50 text-teal-700 font-semibold"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
      >
        <Icon icon="mdi:cart-outline" class="w-6 h-6" />
        <span>Kelola Pembelian</span>
      </router-link>
      <!-- [PERBAIKAN] Dihubungkan ke 'business-profile' -->
      <router-link
        :to="{ name: 'business-profile' }"
        active-class="bg-teal-50 text-teal-700 font-semibold"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
      >
        <Icon icon="mdi:storefront-outline" class="w-6 h-6" />
        <span>Profile Bisnis</span>
      </router-link>
    </nav>
  </div>
</template>
