<script setup>
import { ref, watch, onMounted } from "vue"; // <-- 1. TAMBAHKAN 'onMounted'
// import { ref, watch } from "vue"; // [PERBAIKAN] Tambahkan 'ref' dan 'watch'
import { Icon } from "@iconify/vue";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { businessProfile, fetchBusinessProfile } from "@/store/profileStore.js";
// import { businessProfile } from "@/store/profileStore.js";

// [PERBAIKAN] Buat ref untuk menampung referensi ke komponen peta
const mapRef = ref(null);
const mapReady = ref(false); // 1. Tambahkan state untuk menandai peta sudah siap
// Fungsi yang akan dijalankan saat peta siap
const onMapReady = () => {
  mapReady.value = true;
};

// [PERBAIKAN] Gunakan 'watch' untuk memantau perubahan pada koordinat
// watch(
//   () => [businessProfile.latitude, businessProfile.longitude],
//   ([newLat, newLon]) => {
//     // Jika peta sudah ada, perintahkan untuk pindah ke lokasi baru
//     if (mapRef.value) {
//       mapRef.value.leafletObject.flyTo([newLat, newLon], 15);
//     }
//   }
// );
// Gunakan 'watch' untuk memantau perubahan pada koordinat
watch(
  () => [businessProfile.latitude, businessProfile.longitude],
  ([newLat, newLon]) => {
    // 2. Tambahkan pengecekan ganda: peta harus siap DAN data koordinat valid
    if (mapReady.value && mapRef.value && newLat !== 0 && newLon !== 0) {
      mapRef.value.leafletObject.flyTo([newLat, newLon], 15);
    }
  },
  { immediate: true } // 3. Tambahkan 'immediate' untuk menjalankan watch saat awal
);
// 3. Panggil fungsi fetch saat komponen dimuat
onMounted(() => {
  fetchBusinessProfile();
});
</script>

<template>
  <div class="space-y-8">
    <div
      class="bg-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-8"
    >
      <img
        :src="businessProfile.logoUrl"
        alt="Logo"
        class="w-32 h-32 rounded-full object-cover ring-4 ring-teal-100 flex-shrink-0"
      />
      <div class="flex-1 text-center md:text-left">
        <p class="text-sm font-semibold text-teal-600">PROFIL BISNIS</p>
        <h1 class="text-4xl font-bold text-gray-800 mt-2">
          {{ businessProfile.name }}
        </h1>
        <p class="text-gray-500 mt-3">{{ businessProfile.description }}</p>
      </div>
      <router-link
        :to="{ name: 'business-profile-edit' }"
        class="bg-teal-50 text-teal-600 px-5 py-3 rounded-lg font-semibold hover:bg-teal-100 transition-all flex items-center gap-2 mt-4 md:mt-0"
      >
        <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
        <span>Edit Profil</span>
      </router-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1 space-y-8">
        <div class="bg-white p-6 rounded-2xl shadow-lg">
          <h3
            class="flex items-center gap-3 text-xl font-bold text-gray-800 mb-4"
          >
            <Icon
              icon="mdi:card-account-details-outline"
              class="text-teal-500"
            />Informasi Kontak
          </h3>
          <ul class="space-y-4">
            <li class="flex items-start gap-4">
              <Icon
                icon="mdi:map-marker-outline"
                class="w-6 h-6 text-gray-400 flex-shrink-0"
              /><span class="text-gray-600">{{ businessProfile.address }}</span>
            </li>
            <li class="flex items-start gap-4">
              <Icon
                icon="mdi:phone-outline"
                class="w-6 h-6 text-gray-400 flex-shrink-0"
              /><span class="text-gray-600">{{ businessProfile.phone }}</span>
            </li>
            <li class="flex items-start gap-4">
              <Icon
                icon="mdi:email-outline"
                class="w-6 h-6 text-gray-400 flex-shrink-0"
              /><span class="text-gray-600">{{ businessProfile.email }}</span>
            </li>
          </ul>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-lg">
          <h3
            class="flex items-center gap-3 text-xl font-bold text-gray-800 mb-4"
          >
            <Icon
              icon="mdi:clock-time-eight-outline"
              class="text-teal-500"
            />Jam Operasional
          </h3>
          <ul class="space-y-3">
            <li
              v-for="item in businessProfile.operatingHours"
              :key="item.day"
              class="flex justify-between items-center text-sm"
            >
              <span class="font-medium text-gray-600">{{ item.day }}</span>
              <span
                :class="
                  item.isOpen
                    ? 'text-green-700 bg-green-100'
                    : 'text-red-700 bg-red-100'
                "
                class="font-bold px-3 py-1 rounded-full text-xs"
                >{{ item.time }}</span
              >
            </li>
          </ul>
        </div>
      </div>

      <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
        <h3
          class="flex items-center gap-3 text-xl font-bold text-gray-800 mb-4"
        >
          <Icon
            icon="mdi:map-marker-radius-outline"
            class="text-teal-500"
          />Peta Lokasi
        </h3>
        <div class="h-96 rounded-xl overflow-hidden border">
          <!-- [PERBAIKAN] Tambahkan 'ref' di sini -->
          <l-map
            ref="mapRef"
            :center="[businessProfile.latitude, businessProfile.longitude]"
            :zoom="15"
            :use-global-leaflet="false"
            @ready="onMapReady"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ></l-tile-layer>
            <l-marker
              :lat-lng="[businessProfile.latitude, businessProfile.longitude]"
            ></l-marker>
          </l-map>
        </div>
      </div>
    </div>
  </div>
</template>
