<script setup>
// BAGIAN INI YANG KEMUNGKINAN BESAR HILANG DARI FILE ANDA
const getImageUrl = (name) => {
  // Pastikan path ini benar menunjuk ke folder assets Anda
  return new URL(`../assets/${name}`, import.meta.url).href;
};
</script>

<template>
  <header class="bg-green-50/80 backdrop-blur-sm sticky top-0 z-50">
    <nav
      class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center"
    >
      <!-- <a href="#" class="flex items-center gap-2">
        <svg
          class="w-8 h-8 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.39999 19.3333C5.3 19.3333 2.86666 16.9 2.86666 13.8C2.86666 10.7 5.3 8.26666 8.39999 8.26666C11.5 8.26666 13.9333 10.7 13.9333 13.8C13.9333 16.9 11.5 19.3333 8.39999 19.3333Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.6 19.3333C12.5 19.3333 10.0667 16.9 10.0667 13.8C10.0667 10.7 12.5 8.26666 15.6 8.26666C18.7 8.26666 21.1333 10.7 21.1333 13.8C21.1333 16.9 18.7 19.3333 15.6 19.3333Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 8.26666V6.93333C12 5.53333 10.8667 4.4 9.46667 4.4H9.4C8 4.4 6.86667 5.53333 6.86667 6.93333V6.93333"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="text-2xl font-bold text-gray-800">HematBox</span>
      </a> -->
      <!-- <a href="#" class="flex items-center gap-2">
        <img
          src="@assets/logo.png"
          alt="HematBox Logo"
          class="h-24 w-auto object-contain"
        /> -->
      <!-- <span class="text-2xl font-bold text-gray-800">HematBox</span> -->
      <!-- </a> -->
      <router-link to="/" class="flex items-center gap-2">
        <img
          :src="getImageUrl('logo.png')"
          alt="HematBox Logo"
          class="h-24 w-auto object-contain"
        />
      </router-link>

      <div class="hidden md:flex items-center space-x-8">
        <a
          href="#"
          class="text-gray-600 font-semibold transition-all hover:text-[#10B981] hover:underline hover:underline-offset-4"
          >Beranda</a
        >
        <!-- <a href="#" class="text-gray-600 hover:text-primary">Fitur</a>
        <a href="#" class="text-gray-600 hover:text-primary">Cara kerja</a>
        <a href="#" class="text-gray-600 hover:text-primary">Dampak</a>
        <a href="#" class="text-gray-600 hover:text-primary">Kontak</a> -->
        <a
          href="#"
          class="text-gray-600 transition-all hover:text-[#10B981] hover:underline hover:underline-offset-4"
          >Fitur</a
        >
        <a
          href="#"
          class="text-gray-600 transition-all hover:text-[#10B981] hover:underline hover:underline-offset-4"
          >Cara kerja</a
        >
        <a
          href="#"
          class="text-gray-600 transition-all hover:text-[#10B981] hover:underline hover:underline-offset-4"
          >Dampak</a
        >
        <a
          href="#"
          class="text-gray-600 transition-all hover:text-[#10B981] hover:underline hover:underline-offset-4"
          >Kontak</a
        >
      </div>

      <div class="hidden md:flex items-center space-x-4">
        <!-- <button
          class="bg-[#10B981] text-white px-5 py-2 rounded-lg hover:bg-green-100 transition-colors font-medium"
        >
          Masuk
        </button> -->
        <router-link
          to="/login"
          class="bg-[#10B981] text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          Masuk
        </router-link>
        <!-- <button
          class="bg-white text-primary px-5 py-2 rounded-lg hover:bg-green-100 transition-colors border font-medium border-[#10B981] text-[#10B981]"
        >
          Daftar
        </button> -->
        <router-link
          to="/register"
          class="bg-white px-5 py-2 rounded-lg hover:bg-green-100 transition-colors border font-medium border-[#10B981] text-[#10B981]"
        >
          Daftar
        </router-link>
      </div>
    </nav>
  </header>
</template>
