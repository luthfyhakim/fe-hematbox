<script setup>
// 1. IMPOR 'computed' DI SINI (SEBELUMNYA HILANG)
import { ref, onMounted, computed } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";

// Impor komponen kartu
import OfferCard from "@/components/OfferCard.vue";

// Impor service untuk mengambil data dari API
import offerService from "@/services/offerService.js";

const router = useRouter();

// === STATE API DINAMIS ===
const allOffers = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

// === DATA STATIS (Placeholder) ===
const stats = ref([
  {
    id: 1,
    title: "Makanan Diselamatkan",
    value: "1,245",
    unit: "porsi",
    icon: "mdi:food-drumstick",
    bg: "bg-red-100",
    color: "text-red-600",
    gradient: "from-red-400 to-pink-500",
  },
  {
    id: 2,
    title: "Penghematan Biaya",
    value: "Rp 4,5 Jt",
    unit: "total",
    icon: "mdi:currency-usd",
    bg: "bg-green-100",
    color: "text-green-600",
    gradient: "from-green-400 to-teal-500",
  },
  {
    id: 3,
    title: "Emisi CO2 Dihindari",
    value: "3.1",
    unit: "ton",
    icon: "mdi:leaf",
    bg: "bg-blue-100",
    color: "text-blue-600",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    id: 4,
    title: "Toko Berpartisipasi",
    value: "128",
    unit: "toko",
    icon: "mdi:store",
    bg: "bg-yellow-100",
    color: "text-yellow-600",
    gradient: "from-yellow-400 to-orange-500",
  },
]);
const stores = ref([]);

// === LOGIKA API ===
const fetchAllOffers = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    const response = await offerService.getOffers(); // Data dari API akan disimpan di sini
    allOffers.value = response.data || [];
  } catch (error) {
    // Penanganan error yang sudah baik
    if (error.response) {
      console.error("Server Responded with Status:", error.response.status);
      console.error("Server Response Data:", error.response.data);
      errorMessage.value = `Gagal (Status ${error.response.status}): ${
        error.response.data.message || "Cek backend."
      }`;
    } else if (error.request) {
      console.error("Request sent but no response received:", error.request);
      errorMessage.value =
        "Gagal terhubung ke server. Cek koneksi jaringan atau URL API.";
    } else {
      console.error("Error setting up request:", error.message);
      errorMessage.value = `Kesalahan: ${error.message}`;
    }
    console.error("AxiosError Penuh:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAllOffers();
});

// === LOGIKA NAVIGASI & FILTER ===
const goToDetail = (offerId) => {
  router.push({ name: "offer-detail", params: { id: offerId } });
};

const selectedFoodType = ref("Semua Jenis");
const selectedArea = ref("Semua Area");
const maxDistance = ref(5);
const mapCenter = ref([-6.9175, 107.6191]);
const mapZoom = ref(13);

// Logika Filter Anda (Sudah Benar)
const filteredOffers = computed(() => {
  // Daftar kata kunci untuk setiap kategori
  const keywords = {
    "Makanan Berat": [
      "nasi",
      "sate",
      "ayam",
      "bebek",
      "mie",
      "goreng",
      "bungkus",
    ],
    "Roti & Kue": ["roti", "kue", "cake", "bakery", "donat", "bolu"],
    Minuman: ["kopi", "teh", "jus", "minuman", "es", "susu"],
    "Sayuran & Buah": ["sayur", "buah", "salad"],
  };

  // Jika tidak ada data awal, kembalikan array kosong
  if (!allOffers.value) {
    return [];
  }

  return allOffers.value.filter((offer) => {
    // Logika Filter Jenis Makanan (berdasarkan teks)
    const foodTypeMatches = () => {
      if (selectedFoodType.value === "Semua Jenis") {
        return true; // Loloskan semua jika "Semua Jenis"
      }

      const selectedKeywords = keywords[selectedFoodType.value] || [];
      // Gabungkan title dan description agar pencarian lebih luas
      const offerText = (
        (offer.title || "") +
        " " +
        (offer.description || "")
      ).toLowerCase();

      // Cek apakah teks penawaran mengandung salah satu kata kunci
      return selectedKeywords.some((keyword) => offerText.includes(keyword));
    };

    // Panggil fungsi filter.
    return foodTypeMatches();
  });
});

// Fungsi Reset Filter Anda (Sudah Benar)
const resetFilters = () => {
  selectedFoodType.value = "Semua Jenis";
  selectedArea.value = "Semua Area";
  maxDistance.value = 5;
};

const customIcon = new L.Icon({
  iconUrl: `https://api.iconify.design/mdi:store-marker.svg?color=%230d9488`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
</script>

<template>
  <div
    class="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 min-h-screen font-sans"
  >
    <div
      class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-12 mb-8"
    >
      <div class="container mx-auto px-4 sm:px-6">
        <div class="text-center">
          <h1
            class="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight"
          >
            🍽️ HematBox
          </h1>
          <p class="text-lg sm:text-xl text-emerald-50 max-w-2xl mx-auto">
            Selamatkan makanan berkualitas, hemat biaya, dan bantu lingkungan!
          </p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 pb-12">
      <section class="mb-12 md:mb-16">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <div
            v-for="stat in stats"
            :key="stat.id"
            class="relative bg-white rounded-3xl shadow-lg p-6 overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
          >
            <div
              :class="[
                'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500',
                stat.gradient,
              ]"
            ></div>
            <div class="relative z-10">
              <div class="flex justify-between items-start mb-4">
                <div
                  :class="[
                    stat.bg,
                    'p-4 rounded-2xl transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110',
                  ]"
                >
                  <Icon :icon="stat.icon" :class="[stat.color, 'w-8 h-8']" />
                </div>
                <div class="bg-emerald-50 px-3 py-1 rounded-full">
                  <span class="text-emerald-700 text-xs font-bold">Live</span>
                </div>
              </div>
              <div>
                <p class="text-gray-600 text-sm font-semibold mb-2">
                  {{ stat.title }}
                </p>
                <p
                  class="text-3xl md:text-4xl font-black text-gray-900 leading-none"
                >
                  {{ stat.value }}
                  <span class="text-base font-medium text-gray-500 ml-1">{{
                    stat.unit
                  }}</span>
                </p>
              </div>
              <div class="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  :class="[
                    'h-full bg-gradient-to-r rounded-full transition-all duration-1000',
                    stat.gradient,
                  ]"
                  style="width: 75%"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="flex flex-col lg:flex-row gap-6 md:gap-8">
        <aside class="lg-w-80 flex-shrink-0">
          <div
            class="bg-white rounded-3xl shadow-xl p-6 md:p-8 sticky top-6 border border-emerald-100"
          >
            <div
              class="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100"
            >
              <div
                class="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl"
              >
                <Icon icon="mdi:filter-variant" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="font-black text-xl text-gray-900">Filter Cerdas</h3>
                <p class="text-xs text-gray-500">Temukan penawaran terbaik</p>
              </div>
            </div>
            <div class="space-y-6">
              <div>
                <label
                  class="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3"
                >
                  <Icon
                    icon="mdi:food-variant"
                    class="w-4 h-4 text-emerald-600"
                  />
                  Jenis Makanan
                </label>
                <div class="relative">
                  <select
                    v-model="selectedFoodType"
                    class="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    <option>Semua Jenis</option>
                    <option>Roti & Kue</option>
                    <option>Makanan Berat</option>
                    <option>Minuman</option>
                    <option>Sayuran & Buah</option>
                  </select>
                  <Icon
                    icon="mdi:chevron-down"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none w-5 h-5"
                  />
                </div>
              </div>
              <div>
                <label
                  class="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3"
                >
                  <Icon
                    icon="mdi:map-marker-radius"
                    class="w-4 h-4 text-emerald-600"
                  />
                  Pilih Area
                </label>
                <div class="relative">
                  <select
                    v-model="selectedArea"
                    class="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    <option>Semua Area</option>
                    <option>Bandung Pusat</option>
                    <option>Bandung Utara</option>
                    <option>Bandung Selatan</option>
                  </select>
                  <Icon
                    icon="mdi:chevron-down"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none w-5 h-5"
                  />
                </div>
              </div>
              <div>
                <label
                  class="flex items-center justify-between text-sm font-bold text-gray-700 mb-3"
                >
                  <span class="flex items-center gap-2">
                    <Icon
                      icon="mdi:map-marker-distance"
                      class="w-4 h-4 text-emerald-600"
                    />
                    Jarak Maksimal
                  </span>
                  <span class="text-emerald-600">{{ maxDistance }} km</span>
                </label>
                <input
                  type="range"
                  v-model="maxDistance"
                  min="1"
                  max="10"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div class="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1 km</span>
                  <span>10 km</span>
                </div>
              </div>
              <button
                class="w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-black py-4 text-base rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:check-circle" class="w-5 h-5" />
                Terapkan Filter
              </button>
              <button
                @click="resetFilters"
                class="w-full border-2 border-gray-200 text-gray-700 font-bold py-3 text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:refresh" class="w-4 h-4" />
                Reset Filter
              </button>
            </div>
          </div>
        </aside>

        <main class="flex-1 min-w-0">
          <div
            v-if="isLoading"
            class="text-center p-10 bg-white rounded-3xl shadow-xl"
          >
            <Icon
              icon="mdi:loading"
              class="animate-spin w-10 h-10 text-emerald-500 mx-auto"
            />
            <p class="mt-4 text-gray-600 font-semibold">Memuat penawaran...</p>
          </div>
          <div
            v-else-if="errorMessage"
            class="text-center p-10 bg-red-50 rounded-xl border border-red-200 shadow-md"
          >
            <Icon
              icon="mdi:alert-circle-outline"
              class="w-10 h-10 text-red-600 mx-auto"
            />
            <p class="mt-4 font-semibold text-red-700">{{ errorMessage }}</p>
          </div>
          <section v-else>
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-2xl md:text-3xl font-black text-gray-900">
                  <span
                    class="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                  >
                    Semua Penawaran ({{ filteredOffers.length }}
                    Tersedia)
                  </span>
                </h2>
                <p class="text-sm text-gray-600 mt-1">
                  Temukan makanan lezat dan selamatkan dari pemborosan!
                </p>
              </div>
            </div>

            <div
              v-if="filteredOffers.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <OfferCard
                v-for="item in filteredOffers"
                :key="item.id"
                :offer="item"
                @go-to-detail="goToDetail"
                @take-offer="goToDetail"
              />
            </div>
            <div
              v-else
              class="text-center p-10 bg-white rounded-xl border border-gray-200 shadow-md"
            >
              <Icon
                icon="mdi:database-search-outline"
                class="w-10 h-10 text-gray-400 mx-auto"
              />
              <p class="mt-4 text-gray-600 font-semibold">
                Belum ada penawaran yang cocok dengan filter Anda.
              </p>
            </div>
          </section>
        </main>
      </div>

      <section class="mt-12 md:mt-16"></section>
      <section class="mt-12 md:mt-16 relative overflow-hidden"></section>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if any */
</style>
