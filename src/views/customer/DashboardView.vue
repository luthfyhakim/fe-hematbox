<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router"; // <-- TAMBAHKAN INI
import offerService from "@/services/offerService";
import businessService from "@/services/businessService";

// --- Impor untuk Peta Leaflet ---
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LPopup,
} from "@vue-leaflet/vue-leaflet";

// --- STATE UNTUK UI & DATA ---
const isLoading = ref(true);
const error = ref(null);
const offers = ref([]);
const router = useRouter(); // <-- TAMBAHKAN BARIS INI

// --- STATE UNTUK PETA ---
const mapCenter = ref([-7.76, 112.15]);
const zoom = ref(9);
const mapMarkers = ref([]); // Akan diisi dengan lokasi bisnis dari API

// --- STATE UNTUK FILTER & PENCARIAN ---
const searchQuery = ref("");
const categoryFilter = ref("Semua");
const sortBy = ref("Terdekat");

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"
).replace("/api/v1", "");

// --- FUNGSI PENGAMBILAN DATA ---
onMounted(async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const [offersResponse, businessesResponse] = await Promise.all([
      offerService.getOffers(),
      businessService.getBusinesses(),
    ]);

    // 1. Proses data penawaran (offers)
    offers.value = offersResponse.data
      .map((apiOffer) => ({
        id: apiOffer.id,
        foodName: apiOffer.title,
        storeName: apiOffer.business.business_name,
        price: apiOffer.price,
        stock: apiOffer.remaining_portion,
        status: apiOffer.status,
        image: apiOffer.image_url
          ? `${API_BASE_URL}/${apiOffer.image_url.replace(/\\/g, "/")}`
          : "https://placehold.co/600x400/png?text=HematBox",
        pickupTime: formatPickupTime(
          apiOffer.pickup_start,
          apiOffer.pickup_end
        ),
        originalPrice:
          apiOffer.price + Math.floor(Math.random() * 10000 + 5000),
        distance: (Math.random() * 5).toFixed(1),
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        category: "Makanan",
      }))
      .filter((offer) => offer.status === "aktif");

    // 2. [DIUBAH] Proses data bisnis untuk marker peta
    console.log("DATA MENTAH DARI API /businesses:", businessesResponse.data); // Tetap untuk debugging

    mapMarkers.value = businessesResponse.data
      // Periksa di dalam objek 'location'
      .filter(
        (biz) => biz.location && biz.location.latitude && biz.location.longitude
      )
      .map((biz) => ({
        id: biz.id,
        name: biz.business_name,
        address: biz.address,
        phone: biz.contact_person ? biz.contact_person.phone_number : "No Telp",
        // Ambil dari dalam objek 'location'
        position: [
          parseFloat(biz.location.latitude),
          parseFloat(biz.location.longitude),
        ],
      }));

    console.log("DATA SETELAH DIPROSES UNTUK PETA:", mapMarkers.value); // Tetap untuk debugging
  } catch (err) {
    console.error("GAGAL mengambil data:", err);
    error.value =
      "Gagal memuat data dari server. Periksa koneksi Anda dan lihat konsol browser.";
  } finally {
    isLoading.value = false;
  }
});

// --- LOGIKA FILTER & SORT ---
const filteredOffers = computed(() => {
  let processed = [...offers.value];
  if (searchQuery.value) {
    processed = processed.filter(
      (o) =>
        o.foodName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        o.storeName.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  if (categoryFilter.value !== "Semua") {
    processed = processed.filter((o) => o.category === categoryFilter.value);
  }
  switch (sortBy.value) {
    case "Termurah":
      processed.sort((a, b) => a.price - b.price);
      break;
    case "Rating":
      processed.sort((a, b) => b.rating - a.rating);
      break;
    case "Terdekat":
    default:
      processed.sort((a, b) => a.distance - b.distance);
      break;
  }
  return processed;
});

// --- HELPER FUNCTIONS ---
const formatPrice = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatPickupTime = (start, end) => {
  try {
    const startTime = new Date(start).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const endTime = new Date(end).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${startTime} - ${endTime}`;
  } catch (e) {
    return "N/A";
  }
};
// --- FUNGSI UNTUK NAVIGASI ---
const goToOfferDetail = (offerId) => {
  router.push({ name: "offer-detail", params: { id: offerId } });
};
// [TAMBAHKAN FUNGSI INI]
const goToBusinessProfile = (businessId) => {
  router.push({ name: "public-business-profile", params: { id: businessId } });
};
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto p-6">
      <header class="mb-8">
        <p class="text-gray-500">Selamat Datang,</p>
        <h1 class="text-3xl font-bold text-gray-800">Cari Makanan Lezat!</h1>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 items-end">
        <div class="md:col-span-6 relative">
          <label
            for="search"
            class="block text-sm font-semibold text-gray-700 mb-1"
            >Cari Penawaran</label
          >
          <Icon
            icon="mdi:magnify"
            class="w-5 h-5 text-gray-400 absolute left-4 top-10"
          />
          <input
            v-model="searchQuery"
            type="text"
            id="search"
            placeholder="Nasi Goreng, Roti, Kopi..."
            class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
          />
        </div>
        <div class="md:col-span-3">
          <label
            for="category"
            class="block text-sm font-semibold text-gray-700 mb-1"
            >Kategori</label
          >
          <select
            v-model="categoryFilter"
            id="category"
            class="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
          >
            <option>Semua</option>
            <option>Makanan</option>
            <option>Roti</option>
            <option>Minuman</option>
          </select>
        </div>
        <div class="md:col-span-3">
          <label
            for="sort"
            class="block text-sm font-semibold text-gray-700 mb-1"
            >Urutkan</label
          >
          <select
            v-model="sortBy"
            id="sort"
            class="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
          >
            <option>Terdekat</option>
            <option>Termurah</option>
            <option>Rating</option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-24">
        <Icon
          icon="line-md:loading-loop"
          class="mx-auto w-16 h-16 text-teal-500"
        />
        <h3 class="mt-4 text-xl font-semibold text-gray-700">
          Mencari Penawaran Terbaik...
        </h3>
      </div>
      <div v-else-if="error" class="text-center py-24">
        <Icon
          icon="mdi:alert-circle-outline"
          class="mx-auto w-16 h-16 text-red-400"
        />
        <h3 class="mt-4 text-xl font-semibold text-red-700">
          Oops! Gagal Memuat Data
        </h3>
        <p class="mt-2 text-gray-500">{{ error }}</p>
      </div>

      <div v-else>
        <div
          v-if="filteredOffers.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            v-for="offer in filteredOffers"
            :key="offer.id"
            @click="goToOfferDetail(offer.id)"
            class="bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
          >
            <div class="relative">
              <img
                :src="offer.image"
                :alt="offer.foodName"
                class="w-full h-48 object-cover"
              />
              <div
                class="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800 flex items-center gap-1"
              >
                <Icon icon="mdi:star" class="text-yellow-500" />
                <span>{{ offer.rating }}</span>
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"
              ></div>
              <div class="absolute bottom-3 left-3 text-white">
                <h3 class="font-bold text-lg">{{ offer.foodName }}</h3>
                <p class="text-sm opacity-90">{{ offer.storeName }}</p>
              </div>
            </div>
            <div class="p-4">
              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-xl text-teal-600">{{
                    formatPrice(offer.price)
                  }}</span>
                  <span class="text-gray-500 line-through text-sm">{{
                    formatPrice(offer.originalPrice)
                  }}</span>
                </div>
                <div
                  class="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full"
                >
                  Sisa {{ offer.stock }}
                </div>
              </div>
              <div
                class="text-xs text-gray-500 flex justify-between items-center mb-4"
              >
                <div class="flex items-center gap-1.5">
                  <Icon icon="mdi:map-marker-outline" /><span
                    >{{ offer.distance }} km</span
                  >
                </div>
                <div class="flex items-center gap-1.5">
                  <Icon icon="mdi:clock-outline" /><span>{{
                    offer.pickupTime
                  }}</span>
                </div>
              </div>
              <button
                class="w-full bg-teal-500 text-white font-bold py-3 rounded-xl hover:bg-teal-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-teal-200"
              >
                Pesan Sekarang
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-24">
          <Icon
            icon="mdi:food-off-outline"
            class="mx-auto w-16 h-16 text-gray-400"
          />
          <h3 class="mt-4 text-xl font-semibold text-gray-700">
            Oops! Penawaran Tidak Ditemukan
          </h3>
          <p class="mt-2 text-gray-500">
            Coba ubah kata kunci pencarian atau filter Anda.
          </p>
        </div>

        <!-- <section class="mt-16">
          <h2 class="text-3xl font-bold text-gray-800 mb-6">
            Lokasi Toko Terdekat
          </h2>
          <div
            class="h-[500px] rounded-2xl border border-gray-200 overflow-hidden shadow-xl"
          >
            <l-map ref="map" v-model:zoom="zoom" :center="mapCenter">
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
              ></l-tile-layer>

              <l-marker
                v-for="marker in mapMarkers"
                :key="marker.id"
                :lat-lng="marker.position"
              >
                <l-popup>
                  <div class="font-bold text-base">{{ marker.name }}</div>
                  <p class="text-sm text-gray-600 mt-1">{{ marker.address }}</p>
                  <p
                    v-if="marker.phone"
                    class="text-sm mt-2 font-semibold text-teal-600"
                  >
                    {{ marker.phone }}
                  </p>
                  <button
                    @click="goToBusinessProfile(marker.id)"
                    class="mt-3 w-full bg-teal-500 text-white text-sm font-semibold py-2 px-3 rounded-lg hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    Lihat Toko
                  </button>
                </l-popup>
              </l-marker>
            </l-map>
          </div>
        </section> -->
        <section class="mt-16">
          <h2 class="text-3xl font-bold text-gray-800 mb-6">
            Lokasi Toko Terdekat
          </h2>
          <div
            class="h-[500px] rounded-2xl border border-gray-200 overflow-hidden shadow-xl"
          >
            <l-map
              ref="map"
              v-model:zoom="zoom"
              :center="mapCenter"
              :use-global-leaflet="false"
            >
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              ></l-tile-layer>

              <l-marker
                v-for="marker in mapMarkers"
                :key="marker.id"
                :lat-lng="marker.position"
              >
                <l-icon
                  :icon-size="[0, 0]"
                  :icon-anchor="[20, 40]"
                  class-name="custom-marker-icon"
                >
                  <div class="marker-wrapper">
                    <div
                      class="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                  </div>
                </l-icon>

                <l-popup
                  :options="{ maxWidth: 320, className: 'custom-popup' }"
                >
                  <div
                    class="relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl overflow-hidden min-w-[280px]"
                  >
                    <!-- Decorative gradient bar -->
                    <div
                      class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500"
                    ></div>

                    <!-- Content wrapper with padding -->
                    <div class="p-5 pt-6">
                      <!-- Store name with icon -->
                      <div class="flex items-start gap-2 mb-3">
                        <div
                          class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2.5"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                        </div>
                        <h3
                          class="font-bold text-lg text-gray-800 leading-tight"
                        >
                          {{ marker.name }}
                        </h3>
                      </div>

                      <!-- Address with icon -->
                      <div class="flex items-start gap-2 mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p class="text-sm text-gray-600 leading-relaxed">
                          {{ marker.address }}
                        </p>
                      </div>

                      <!-- Phone with icon (if available) -->
                      <div
                        v-if="marker.phone && marker.phone !== 'No Telp'"
                        class="flex items-center gap-2 mb-4 bg-teal-50 px-3 py-2 rounded-lg border border-teal-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-4 h-4 text-teal-600 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <p class="text-sm font-semibold text-teal-700">
                          {{ marker.phone }}
                        </p>
                      </div>

                      <!-- CTA Button with gradient and hover effect -->
                      <button
                        @click="goToBusinessProfile(marker.id)"
                        class="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-cyan-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
                      >
                        <span class="flex items-center justify-center gap-2">
                          Lihat Toko
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2.5"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>

                    <!-- Decorative corner accent -->
                    <div
                      class="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-teal-100/30 to-transparent rounded-tl-full"
                    ></div>
                  </div>
                </l-popup>
              </l-marker>
            </l-map>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<!-- ========================================= -->
<!-- TAMBAHKAN STYLE INI DI AKHIR FILE .vue -->
<!-- ========================================= -->

<style scoped>
/* Custom styling untuk popup Leaflet */
:deep(.leaflet-popup-content-wrapper) {
  padding: 0;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

:deep(.leaflet-popup-content) {
  margin: 0;
  width: auto !important;
}

:deep(.leaflet-popup-tip) {
  background: white;
}

/* Custom marker animation */
:deep(.custom-marker-icon) {
  background: transparent;
  border: none;
}

/* Hover effect pada marker */
:deep(.leaflet-marker-icon):hover {
  z-index: 1000 !important;
}
</style>
