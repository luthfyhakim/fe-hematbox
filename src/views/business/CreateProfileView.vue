<template>
  <div class="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
    <div class="max-w-4xl w-full">
      <form
        @submit.prevent="handleCreateProfile"
        class="bg-white p-8 rounded-2xl shadow-lg"
      >
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold text-gray-800">Buat Profil Bisnis</h1>
          <p class="text-gray-600 mt-2">
            Lengkapi detail di bawah ini untuk memulai.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-1 flex flex-col items-center">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Logo Bisnis</label
            >
            <div class="relative group">
              <img
                :src="logoPreview"
                alt="Logo Preview"
                class="w-40 h-40 rounded-full object-cover ring-4 ring-teal-100"
              />
              <label
                for="logo-upload"
                class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div class="text-center">
                  <Icon
                    icon="mdi:camera-flip-outline"
                    class="w-8 h-8 mx-auto"
                  />
                  <span class="text-xs font-semibold mt-1 block"
                    >Ganti Foto</span
                  >
                </div>
              </label>
              <input
                type="file"
                id="logo-upload"
                class="hidden"
                @change="handleLogoChange"
                accept="image/*"
              />
            </div>
            <p class="text-xs text-gray-500 mt-3 text-center">
              Gunakan gambar persegi untuk hasil terbaik.
            </p>
          </div>

          <div class="md:col-span-2 space-y-6">
            <div>
              <label
                for="business_name"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Nama Bisnis</label
              >
              <div class="relative">
                <Icon
                  icon="mdi:storefront-outline"
                  class="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                />
                <input
                  type="text"
                  id="business_name"
                  v-model="formData.business_name"
                  required
                  placeholder="Contoh: Toko Roti Lezat"
                  class="w-full pl-11 p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300"
                />
              </div>
            </div>

            <div class="relative">
              <label
                for="address"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Cari Alamat Lengkap</label
              >
              <div class="relative">
                <Icon
                  icon="mdi:map-search-outline"
                  class="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                />
                <input
                  type="text"
                  id="address"
                  v-model="formData.address"
                  required
                  placeholder="Ketik untuk mencari alamat..."
                  autocomplete="off"
                  class="w-full pl-11 p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300"
                />
              </div>
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
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  for="latitude"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Latitude</label
                >
                <input
                  type="number"
                  step="any"
                  id="latitude"
                  v-model.number="formData.latitude"
                  readonly
                  class="w-full p-3 bg-gray-100 border-gray-300 rounded-lg cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  for="longitude"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Longitude</label
                >
                <input
                  type="number"
                  step="any"
                  id="longitude"
                  v-model.number="formData.longitude"
                  readonly
                  class="w-full p-3 bg-gray-100 border-gray-300 rounded-lg cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label
                for="phone_number"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Nomor Telepon Bisnis</label
              >
              <div class="relative">
                <Icon
                  icon="mdi:phone-outline"
                  class="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                />
                <input
                  type="tel"
                  id="phone_number"
                  v-model="formData.phone_number"
                  required
                  placeholder="081234567890"
                  class="w-full pl-11 p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-gray-200">
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-5 py-3 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 transition-all"
          >
            <Icon icon="mdi:content-save" class="w-6 h-6" />
            <span>Simpan dan Lanjutkan ke Dashboard</span>
          </button>
          <p v-if="errorMessage" class="text-red-500 text-sm mt-4 text-center">
            {{ errorMessage }}
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import axios from "axios";
import { debounce } from "lodash";
import businessService from "@/services/businessService.js";

const router = useRouter();

// State untuk form data
const formData = ref({
  business_name: "",
  address: "",
  phone_number: "",
  latitude: 0,
  longitude: 0,
});

// State untuk file gambar
const logoFile = ref(null);
const logoPreview = ref("https://via.placeholder.com/150?text=Logo");
const errorMessage = ref(null);

// State untuk pencarian alamat
const addressSuggestions = ref([]);
const isSearchingAddress = ref(false);

// Fungsi untuk menangani upload logo
const handleLogoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    logoFile.value = file;
    logoPreview.value = URL.createObjectURL(file);
  }
};

// Fungsi debounced untuk mencari alamat
const searchAddress = debounce(async (query) => {
  if (query.length < 4) {
    addressSuggestions.value = [];
    return;
  }
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

// Watcher untuk memicu pencarian saat pengguna mengetik alamat
watch(
  () => formData.value.address,
  (newAddress) => {
    if (document.activeElement.id === "address") {
      searchAddress(newAddress);
    }
  }
);

// Fungsi untuk memilih alamat dari saran
const selectAddress = (suggestion) => {
  formData.value.address = suggestion.display_name;
  formData.value.latitude = parseFloat(suggestion.lat);
  formData.value.longitude = parseFloat(suggestion.lon);
  addressSuggestions.value = [];
};

// Fungsi untuk submit form
const handleCreateProfile = async () => {
  errorMessage.value = null;

  // Buat objek FormData untuk mengirim file dan data teks
  const dataToSubmit = new FormData();
  dataToSubmit.append("business_name", formData.value.business_name);
  dataToSubmit.append("address", formData.value.address);
  dataToSubmit.append("phone_number", formData.value.phone_number);
  // dataToSubmit.append("latitude", formData.value.latitude);
  // dataToSubmit.append("longitude", formData.value.longitude);
  dataToSubmit.append("latitude", parseFloat(formData.value.latitude));
  dataToSubmit.append("longitude", parseFloat(formData.value.longitude));

  if (logoFile.value) {
    dataToSubmit.append("image_url", logoFile.value);
  }

  try {
    await businessService.createProfile(dataToSubmit);
    alert("Profil bisnis berhasil dibuat!");
    router.push("/business");
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Gagal membuat profil.";
    console.error(error);
  }
};
</script>
