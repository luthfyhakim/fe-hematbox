<script setup>
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { debounce } from "lodash";
import { businessProfile } from "@/store/profileStore.js";
// 1. IMPORT SERVICE BARU
import businessService from "@/services/businessService.js";

const router = useRouter();
const activeTab = ref("general");
const addressSuggestions = ref([]);
const isSearchingAddress = ref(false);
const mapRef = ref(null);
// 2. BUAT REF UNTUK MENAMPUNG FILE GAMBAR YANG AKAN DIUNGGAH
const logoFile = ref(null);
// --- [BARU] FUNGSI UNTUK MENANGANI PEMILIHAN FOTO ---
// const handleLogoChange = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     // Buat URL pratinjau sementara dari file yang dipilih
//     const previewUrl = URL.createObjectURL(file);
//     // Perbarui logoUrl di store agar pratinjau langsung tampil
//     businessProfile.logoUrl = previewUrl;

//     // Di aplikasi nyata, Anda akan mengunggah 'file' ini ke server di sini
//     // dan mendapatkan URL permanen untuk disimpan.
//   }
// };
// 3. PERBARUI FUNGSI UNTUK MENANGANI PEMILIHAN FOTO
const handleLogoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Simpan object file-nya untuk dikirim ke server
    logoFile.value = file;
    // Buat URL pratinjau sementara dari file yang dipilih
    const previewUrl = URL.createObjectURL(file);
    // Perbarui logoUrl di store agar pratinjau langsung tampil
    businessProfile.logoUrl = previewUrl;
  }
};

// --- Sisa script tidak berubah ---
const searchAddress = debounce(async (query) => {
  if (query.length < 4) return;
  isSearchingAddress.value = true;
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=id`
    );
    addressSuggestions.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data alamat:", error);
  } finally {
    isSearchingAddress.value = false;
  }
}, 500);

watch(
  () => businessProfile.address,
  (newAddress) => {
    if (document.activeElement.id === "address") {
      searchAddress(newAddress);
    }
  }
);

const selectAddress = (suggestion) => {
  const newLat = parseFloat(suggestion.lat);
  const newLon = parseFloat(suggestion.lon);
  businessProfile.address = suggestion.display_name;
  businessProfile.latitude = newLat;
  businessProfile.longitude = newLon;
  addressSuggestions.value = [];
  if (mapRef.value) {
    mapRef.value.leafletObject.flyTo([newLat, newLon], 16);
  }
};

// const saveChanges = () => {
//   alert("Perubahan disimpan!");
//   router.push({ name: "business-profile" });
// };

// const cancelEdit = () => {
//   if (confirm("Perubahan yang belum disimpan akan hilang. Lanjutkan?")) {
//     router.back();
//   }
// };
// 4. GANTI TOTAL FUNGSI SAVECHANGES DENGAN VERSI DARI INSTRUKSI
const saveChanges = async () => {
  try {
    // Pastikan businessProfile.id sudah terisi
    if (!businessProfile.id) {
      alert("ID Bisnis tidak ditemukan. Gagal menyimpan.");
      return;
    }

    // Panggil service untuk mengirim data ke backend, termasuk file logo
    await businessService.updateBusinessProfile(
      businessProfile.id,
      businessProfile,
      logoFile.value
    );

    alert("Perubahan berhasil disimpan!");
    router.push({ name: "business-profile" }); // Arahkan kembali ke halaman profil
  } catch (error) {
    console.error("Gagal menyimpan perubahan:", error);
    alert("Terjadi kesalahan saat menyimpan perubahan. Silakan coba lagi.");
  }
};

const cancelEdit = () => {
  if (confirm("Perubahan yang belum disimpan akan hilang. Lanjutkan?")) {
    // Idealnya, panggil fungsi untuk fetch ulang data asli
    router.back();
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-4">
          <aside class="md:col-span-1 p-6 border-r border-gray-200">
            <h2 class="text-xl font-bold text-gray-800 mb-2">Pengaturan</h2>
            <p class="text-sm text-gray-500 mb-6">Kelola detail bisnis Anda.</p>
            <nav class="flex flex-col gap-2">
              <button
                @click="activeTab = 'general'"
                :class="[
                  activeTab === 'general'
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-500 hover:bg-gray-100',
                ]"
                class="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all"
              >
                <Icon icon="mdi:storefront-outline" class="w-5 h-5" /><span
                  >Informasi Umum</span
                >
              </button>
              <button
                @click="activeTab = 'location'"
                :class="[
                  activeTab === 'location'
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-500 hover:bg-gray-100',
                ]"
                class="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all"
              >
                <Icon
                  icon="mdi:map-marker-radius-outline"
                  class="w-5 h-5"
                /><span>Lokasi & Kontak</span>
              </button>
              <button
                @click="activeTab = 'hours'"
                :class="[
                  activeTab === 'hours'
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-500 hover:bg-gray-100',
                ]"
                class="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all"
              >
                <Icon
                  icon="mdi:clock-time-eight-outline"
                  class="w-5 h-5"
                /><span>Jam Operasional</span>
              </button>
            </nav>
          </aside>

          <main class="md:col-span-3 p-8">
            <form @submit.prevent="saveChanges">
              <div class="min-h-[450px]">
                <div v-show="activeTab === 'general'" class="space-y-6">
                  <h3 class="text-2xl font-bold text-gray-800">
                    Informasi Umum
                  </h3>

                  <!-- [BARU] FITUR UPLOAD FOTO PROFIL -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Foto Profil</label
                    >
                    <div class="flex items-center gap-6">
                      <div class="relative">
                        <img
                          :src="businessProfile.logoUrl"
                          alt="Logo"
                          class="w-24 h-24 rounded-full object-cover ring-2 ring-offset-2 ring-teal-200"
                        />
                        <label
                          for="logo-upload"
                          class="absolute -bottom-1 -right-1 bg-teal-500 text-white p-2 rounded-full cursor-pointer hover:bg-teal-600 transition shadow-md"
                        >
                          <Icon icon="mdi:camera" class="w-5 h-5" />
                          <input
                            type="file"
                            id="logo-upload"
                            class="hidden"
                            @change="handleLogoChange"
                            accept="image/*"
                          />
                        </label>
                      </div>
                      <p class="text-xs text-gray-500">
                        Klik ikon kamera untuk mengganti foto.<br />Gunakan
                        gambar persegi untuk hasil terbaik.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      for="business-name"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Nama Bisnis</label
                    >
                    <div class="relative">
                      <Icon
                        icon="mdi:storefront-outline"
                        class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                      /><input
                        type="text"
                        id="business-name"
                        v-model="businessProfile.name"
                        class="w-full pl-10 p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      for="description"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Deskripsi</label
                    ><textarea
                      id="description"
                      v-model="businessProfile.description"
                      rows="5"
                      class="w-full p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
                    ></textarea>
                  </div>
                </div>

                <div v-show="activeTab === 'location'" class="space-y-6">
                  <!-- ... konten tab lokasi tidak berubah ... -->
                  <h3 class="text-2xl font-bold text-gray-800">
                    Lokasi & Kontak
                  </h3>
                  <div>
                    <label
                      for="address"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Alamat</label
                    >
                    <div class="relative">
                      <Icon
                        icon="mdi:map-search-outline"
                        class="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
                      /><input
                        type="text"
                        id="address"
                        v-model="businessProfile.address"
                        autocomplete="off"
                        class="w-full pl-10 p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
                      />
                      <div
                        v-if="addressSuggestions.length > 0"
                        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        <ul>
                          <li
                            v-for="suggestion in addressSuggestions"
                            :key="suggestion.place_id"
                            @click="selectAddress(suggestion)"
                            class="px-4 py-3 cursor-pointer hover:bg-teal-50 text-sm text-gray-700"
                          >
                            {{ suggestion.display_name }}
                          </li>
                        </ul>
                      </div>
                      <div
                        v-if="isSearchingAddress"
                        class="absolute right-3 top-3.5"
                      >
                        <Icon
                          icon="mdi:loading"
                          class="w-5 h-5 text-gray-400 animate-spin"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        for="phone"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Telepon</label
                      >
                      <div class="relative">
                        <Icon
                          icon="mdi:phone-outline"
                          class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                        /><input
                          type="tel"
                          id="phone"
                          v-model="businessProfile.phone"
                          class="w-full pl-10 p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="email"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Email</label
                      >
                      <div class="relative">
                        <Icon
                          icon="mdi:email-outline"
                          class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                        /><input
                          type="email"
                          id="email"
                          v-model="businessProfile.email"
                          class="w-full pl-10 p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        for="latitude"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Latitude</label
                      >
                      <div class="relative">
                        <Icon
                          icon="mdi:latitude"
                          class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                        /><input
                          type="number"
                          step="any"
                          id="latitude"
                          v-model.number="businessProfile.latitude"
                          class="w-full pl-10 p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="longitude"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Longitude</label
                      >
                      <div class="relative">
                        <Icon
                          icon="mdi:longitude"
                          class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                        /><input
                          type="number"
                          step="any"
                          id="longitude"
                          v-model.number="businessProfile.longitude"
                          class="w-full pl-10 p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div v-show="activeTab === 'hours'" class="space-y-4">
                  <!-- ... konten tab jam operasional tidak berubah ... -->
                  <h3 class="text-2xl font-bold text-gray-800 mb-6">
                    Jam Operasional
                  </h3>
                  <div
                    v-for="item in businessProfile.operatingHours"
                    :key="item.day"
                    class="grid grid-cols-3 gap-4 items-center"
                  >
                    <label class="font-medium text-gray-700 text-sm">{{
                      item.day
                    }}</label
                    ><input
                      type="text"
                      v-model="item.time"
                      class="col-span-2 w-full bg-gray-50 border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="cancelEdit"
                  class="bg-white text-gray-700 px-5 py-2.5 rounded-lg font-semibold border hover:bg-gray-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 flex items-center gap-2 transition-all"
                >
                  <Icon icon="mdi:content-save" class="w-5 h-5" /><span
                    >Simpan Perubahan</span
                  >
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>
