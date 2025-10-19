<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { useCartStore } from "@/store/cartStore";
import businessService from "@/services/businessService";

// Impor untuk Peta Leaflet
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LPopup,
} from "@vue-leaflet/vue-leaflet";

// Cart Store
const cartStore = useCartStore();
const router = useRouter(); // <-- 2. TAMBAHKAN BARIS INI

// State
const isLoading = ref(true);
const error = ref(null);
const business = ref(null);
const offers = ref([]);
const showCartNotification = ref(false);

// State untuk Peta
const mapCenter = ref([0, 0]);
const mapMarker = ref(null);
const zoom = ref(15);

// Ikon Toko untuk Peta
const storeIconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%2314b8a6;stop-opacity:1" /><stop offset="100%" style="stop-color:%23059669;stop-opacity:1" /></linearGradient><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="%23000000" flood-opacity="0.3"/></filter></defs><path filter="url(%23shadow)" fill="url(%23grad)" d="M17 10H7V9h10m0 2H7v-1h10m-3-3h-4V6h4m6-2H4a2 2 0 0 0-2 2v13l4-3.9l4 3.9l4-3.9l4 3.9l4-3.9V6a2 2 0 0 0-2-2"/></svg>`
)}`;

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"
).replace("/api/v1", "");

// Computed
const hasOffers = computed(() => offers.value.length > 0);

// Ambil data saat komponen dimuat
onMounted(async () => {
  const route = useRoute();
  const businessId = route.params.id;

  try {
    isLoading.value = true;
    error.value = null;
    const response = await businessService.getBusinessById(businessId);

    business.value = response.data;

    // Proses penawaran
    offers.value = response.data.offers.map((offer) => ({
      ...offer,
      image_url: offer.image_url
        ? `${API_BASE_URL}/${offer.image_url.replace(/\\/g, "/")}`
        : "https://placehold.co/600x400/png?text=HematBox",
      pickupTime: formatPickupTime(offer.pickup_start, offer.pickup_end),
    }));
    // .filter((offer) => offer.status === "aktif");

    // Setup data untuk peta
    if (business.value && business.value.location) {
      const lat = parseFloat(business.value.location.latitude);
      const lng = parseFloat(business.value.location.longitude);
      mapCenter.value = [lat, lng];
      mapMarker.value = {
        position: [lat, lng],
        name: business.value.business_name,
      };
    }
  } catch (err) {
    console.error("Gagal mengambil data bisnis:", err);
    error.value = "Profil bisnis tidak ditemukan atau terjadi kesalahan.";
  } finally {
    isLoading.value = false;
  }
});

// Helper Functions
const formatPrice = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

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

const getImageUrl = (path) =>
  path ? `${API_BASE_URL}/${path.replace(/\\/g, "/")}` : null;

const calculateDiscount = (originalPrice, newPrice) => {
  if (!originalPrice || originalPrice <= newPrice) return 0;
  return Math.round(((originalPrice - newPrice) / originalPrice) * 100);
};

const addToCart = (offer) => {
  cartStore.addItem(offer);
  showCartNotification.value = true;
  setTimeout(() => {
    showCartNotification.value = false;
  }, 2000);
};

const isInCart = (offerId) => {
  return cartStore.items.some((item) => item.id === offerId);
};

const getItemQuantity = (offerId) => {
  const item = cartStore.items.find((item) => item.id === offerId);
  return item ? item.quantity : 0;
};
// 3. TAMBAHKAN FUNGSI BARU INI DI AKHIR SCRIPT
const goToOfferDetail = (offerId) => {
  router.push({ name: "offer-detail", params: { id: offerId } });
};
</script>

<template>
  <div
    class="bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50 min-h-screen"
  >
    <!-- Cart Notification -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="showCartNotification"
        class="fixed top-20 right-4 z-50 bg-teal-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
      >
        <Icon icon="mdi:check-circle" class="w-6 h-6" />
        <span class="font-semibold">Berhasil ditambahkan ke keranjang!</span>
      </div>
    </Transition>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-24">
        <Icon
          icon="line-md:loading-loop"
          class="mx-auto w-16 h-16 text-teal-500"
        />
        <h3 class="mt-4 text-xl font-semibold text-gray-700">
          Memuat Profil Toko...
        </h3>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-24">
        <Icon
          icon="mdi:alert-circle-outline"
          class="mx-auto w-16 h-16 text-red-400"
        />
        <h3 class="mt-4 text-xl font-semibold text-red-700">
          Oops! Terjadi Kesalahan
        </h3>
        <p class="mt-2 text-gray-500">{{ error }}</p>
      </div>

      <!-- Main Content -->
      <div
        v-else-if="business"
        class="grid grid-cols-1 lg:grid-cols-3 lg:gap-8"
      >
        <!-- Sidebar -->
        <aside class="lg:col-span-1 mb-8 lg:mb-0">
          <div
            class="bg-white rounded-3xl shadow-xl p-6 sticky top-8 border border-teal-100"
          >
            <!-- Business Image with Gradient Overlay -->
            <div
              class="relative aspect-w-16 aspect-h-9 mb-6 rounded-2xl overflow-hidden group"
            >
              <img
                v-if="getImageUrl(business.image_url)"
                :src="getImageUrl(business.image_url)"
                alt="Foto Toko"
                class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div
                v-else
                class="bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center"
              >
                <Icon icon="mdi:store-outline" class="text-6xl text-teal-400" />
              </div>
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              ></div>
              <div class="absolute bottom-4 left-4 right-4">
                <div
                  class="bg-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 inline-block"
                >
                  <span
                    class="text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Icon icon="mdi:store-check" class="w-4 h-4" />
                    Toko Terverifikasi
                  </span>
                </div>
              </div>
            </div>

            <!-- Business Name -->
            <div class="mb-4">
              <h1 class="text-3xl font-bold text-gray-800 mb-2">
                {{ business.business_name }}
              </h1>
              <p
                v-if="business.description"
                class="text-gray-600 text-sm leading-relaxed"
              >
                {{ business.description }}
              </p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-3 mb-6">
              <div
                class="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 text-center"
              >
                <Icon
                  icon="mdi:food-variant"
                  class="w-6 h-6 text-teal-600 mx-auto mb-1"
                />
                <div class="text-2xl font-bold text-teal-700">
                  {{ offers.length }}
                </div>
                <div class="text-xs text-teal-600 font-medium">
                  Penawaran Aktif
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center"
              >
                <Icon
                  icon="mdi:star"
                  class="w-6 h-6 text-orange-600 mx-auto mb-1"
                />
                <div class="text-2xl font-bold text-orange-700">4.8</div>
                <div class="text-xs text-orange-600 font-medium">
                  Rating Toko
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 my-6"></div>

            <!-- Contact Info -->
            <ul class="space-y-4 text-sm mb-6">
              <li class="flex items-start group">
                <div
                  class="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-teal-100 transition-colors"
                >
                  <Icon icon="mdi:map-marker" class="w-5 h-5 text-teal-600" />
                </div>
                <div class="flex-1 pt-1.5">
                  <div class="text-xs text-gray-500 font-medium mb-0.5">
                    Alamat
                  </div>
                  <span class="text-gray-700 leading-relaxed">{{
                    business.address
                  }}</span>
                </div>
              </li>
              <li v-if="business.contact_person" class="flex items-start group">
                <div
                  class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-blue-100 transition-colors"
                >
                  <Icon icon="mdi:phone" class="w-5 h-5 text-blue-600" />
                </div>
                <div class="flex-1 pt-1.5">
                  <div class="text-xs text-gray-500 font-medium mb-0.5">
                    Telepon
                  </div>
                  <span class="text-gray-700 font-semibold">{{
                    business.contact_person.phone_number
                  }}</span>
                </div>
              </li>
              <li v-if="business.contact_person" class="flex items-start group">
                <div
                  class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-purple-100 transition-colors"
                >
                  <Icon icon="mdi:email" class="w-5 h-5 text-purple-600" />
                </div>
                <div class="flex-1 pt-1.5">
                  <div class="text-xs text-gray-500 font-medium mb-0.5">
                    Email
                  </div>
                  <span class="text-gray-700">{{
                    business.contact_person.email
                  }}</span>
                </div>
              </li>
            </ul>

            <!-- Map -->
            <div
              v-if="mapMarker"
              class="h-64 rounded-2xl overflow-hidden border-2 border-teal-100 shadow-lg"
            >
              <l-map ref="map" v-model:zoom="zoom" :center="mapCenter">
                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  name="OpenStreetMap"
                ></l-tile-layer>
                <l-marker :lat-lng="mapMarker.position">
                  <l-icon
                    :icon-url="storeIconUrl"
                    :icon-size="[36, 36]"
                    :icon-anchor="[18, 36]"
                  />
                  <l-popup
                    ><b>{{ mapMarker.name }}</b></l-popup
                  >
                </l-marker>
              </l-map>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="lg:col-span-2">
          <!-- Header -->
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-3xl font-bold text-gray-800 mb-2">
                Penawaran Saat Ini
              </h2>
              <p class="text-gray-600">Hemat hingga 70% dari harga normal!</p>
            </div>
            <div class="hidden md:block">
              <div
                class="bg-white rounded-2xl px-6 py-3 shadow-lg border border-teal-100"
              >
                <div class="flex items-center gap-3">
                  <Icon icon="mdi:cart" class="w-6 h-6 text-teal-600" />
                  <div>
                    <div class="text-xs text-gray-500">Keranjang</div>
                    <div class="text-lg font-bold text-teal-600">
                      {{ cartStore.totalItems }} item
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Offers Grid -->
          <div v-if="hasOffers" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="offer in offers"
              :key="offer.id"
              class="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-teal-50"
            >
              <!-- Image Section -->
              <div class="relative overflow-hidden">
                <img
                  :src="offer.image_url"
                  :alt="offer.title"
                  class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <!-- Gradient Overlay -->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                ></div>

                <!-- Discount Badge -->
                <div
                  v-if="
                    calculateDiscount(offer.original_price, offer.price) > 0
                  "
                  class="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-lg transform -rotate-3"
                >
                  <span class="text-lg"
                    >{{
                      calculateDiscount(offer.original_price, offer.price)
                    }}%</span
                  >
                  <span class="text-xs ml-1">OFF</span>
                </div>

                <!-- Stock Badge -->
                <div
                  class="absolute top-4 right-4 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg"
                  :class="
                    offer.remaining_portion <= 3
                      ? 'bg-red-500/90'
                      : 'bg-teal-500/90'
                  "
                >
                  <div class="flex items-center gap-1.5 text-white">
                    <Icon icon="mdi:package-variant" class="w-4 h-4" />
                    <span class="text-xs font-bold"
                      >Sisa {{ offer.remaining_portion }}</span
                    >
                  </div>
                </div>

                <!-- Title -->
                <div class="absolute bottom-4 left-4 right-4">
                  <h3 class="font-bold text-xl text-white drop-shadow-lg">
                    {{ offer.title }}
                  </h3>
                </div>
              </div>

              <!-- Content Section -->
              <div class="p-5">
                <!-- Price Section -->
                <div class="flex items-end gap-3 mb-4">
                  <div>
                    <div class="text-xs text-gray-500 mb-1">Harga Spesial</div>
                    <span class="font-bold text-3xl text-teal-600">
                      {{ formatPrice(offer.price) }}
                    </span>
                  </div>
                  <div
                    v-if="
                      offer.original_price && offer.original_price > offer.price
                    "
                    class="mb-1"
                  >
                    <span class="text-sm text-gray-400 line-through">
                      {{ formatPrice(offer.original_price) }}
                    </span>
                  </div>
                </div>

                <!-- Pickup Time -->
                <div
                  class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 mb-4"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-orange-700">
                      <Icon icon="mdi:clock-outline" class="w-5 h-5" />
                      <span class="text-sm font-semibold">Waktu Ambil</span>
                    </div>
                    <span class="text-sm font-bold text-orange-800">{{
                      offer.pickupTime
                    }}</span>
                  </div>
                </div>

                <!-- Action Button -->
                <!-- <button
                  @click="addToCart(offer)"
                  :disabled="offer.remaining_portion === 0"
                  class="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <Icon
                    :icon="
                      isInCart(offer.id) ? 'mdi:cart-check' : 'mdi:cart-plus'
                    "
                    class="w-6 h-6 group-hover:rotate-12 transition-transform"
                  />
                  <span v-if="isInCart(offer.id)">
                    Dalam Keranjang ({{ getItemQuantity(offer.id) }})
                  </span>
                  <span v-else-if="offer.remaining_portion === 0">Habis</span>
                  <span v-else>Tambah ke Keranjang</span>
                </button> -->
                <button
                  @click="goToOfferDetail(offer.id)"
                  :disabled="offer.remaining_portion === 0"
                  class="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <Icon
                    :icon="
                      offer.remaining_portion === 0
                        ? 'mdi:cancel'
                        : 'mdi:arrow-right-circle-outline'
                    "
                    class="w-6 h-6 group-hover:rotate-12 transition-transform"
                  />
                  <span v-if="offer.remaining_portion === 0">Habis</span>
                  <span v-else>Pesan Sekarang</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="text-center py-20 bg-white rounded-3xl shadow-xl border border-teal-50"
          >
            <div class="max-w-md mx-auto">
              <div
                class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Icon
                  icon="mdi:food-off-outline"
                  class="w-12 h-12 text-gray-400"
                />
              </div>
              <h3 class="text-2xl font-bold text-gray-700 mb-3">
                Belum Ada Penawaran
              </h3>
              <p class="text-gray-500">
                Toko ini sedang mempersiapkan penawaran menarik. Cek kembali
                nanti ya!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #14b8a6;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0d9488;
}
</style>
