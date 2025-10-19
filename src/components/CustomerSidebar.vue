<script setup>
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

// [PERBAIKAN] Dapatkan instance router untuk navigasi
const router = useRouter();

// [PERBAIKAN] Buat fungsi untuk menangani logout
const logout = () => {
  if (confirm("Anda yakin ingin keluar dari akun?")) {
    // Di aplikasi nyata, Anda akan menghapus token/sesi di sini
    router.push({ name: "login" }); // Arahkan ke halaman login
  }
};
</script>

<template>
  <div class="w-64 bg-white p-6 flex flex-col shadow-lg h-screen flex-shrink-0">
    <!-- Logo -->
    <div class="flex items-center gap-3 mb-10">
      <img src="@/assets/logo.png" alt="HematBox Logo" class="h-12 w-auto" />
      <span class="text-2xl font-bold text-gray-800">HematBox</span>
    </div>

    <!-- Navigasi Utama -->
    <nav class="flex flex-col gap-2">
      <p class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
        Menu
      </p>
      <router-link
        :to="{ name: 'customer-dashboard' }"
        exact-active-class="bg-teal-50 text-teal-700 font-semibold"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
      >
        <Icon icon="mdi:compass-outline" class="w-6 h-6" />
        <span>Jelajahi</span>
      </router-link>

      <router-link
        :to="{ name: 'customer-orders' }"
        active-class="bg-teal-50 text-teal-700 font-semibold"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
      >
        <Icon icon="mdi:receipt-text-outline" class="w-6 h-6" />
        <span>Pesanan Saya</span>
      </router-link>

      <router-link
        :to="{ name: 'customer-favorites' }"
        active-class="bg-teal-50 text-teal-700 font-semibold"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
      >
        <Icon icon="mdi:heart-outline" class="w-6 h-6" />
        <span>Favorit</span>
      </router-link>
    </nav>

    <div class="mt-auto">
      <p class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
        Akun
      </p>
      <router-link
        :to="{ name: 'customer-profile' }"
        active-class="bg-teal-50 text-teal-700 font-semibold"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
      >
        <Icon icon="mdi:account-circle-outline" class="w-6 h-6" />
        <span>Profil Saya</span>
      </router-link>
      <button
        @click="logout"
        class="flex items-center gap-3 w-full text-left px-4 py-3 mt-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300"
      >
        <Icon icon="mdi:logout" class="w-6 h-6" />
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>
