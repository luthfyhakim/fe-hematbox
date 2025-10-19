<script setup>
import { ref, computed } from "vue"; // Pastikan 'computed' diimpor
import { Icon } from "@iconify/vue";

// --- Impor untuk Peta Leaflet ---
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LPopup,
} from "@vue-leaflet/vue-leaflet";

// --- DATA CONTOH UNTUK TAMPILAN ---

const statsData = ref([
  {
    title: "Penawaran Aktif",
    value: "8",
    icon: "mdi:tag-heart-outline",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    title: "Penjualan Hari Ini",
    value: "Rp 350K",
    icon: "mdi:cash-multiple",
    gradient: "from-blue-500 to-sky-600",
  },
  {
    title: "Total Pelanggan",
    value: "124",
    icon: "mdi:account-group-outline",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    title: "Limbah Dikurangi",
    value: "45Kg",
    icon: "mdi:scale-balance",
    gradient: "from-orange-500 to-amber-600",
  },
]);

// [PERUBAHAN] Menggabungkan semua penawaran menjadi satu array untuk difilter
const allOffers = ref([
  {
    id: 1,
    name: "Burger Keju Super Hemat",
    price: 15000,
    originalPrice: 25000,
    distance: 1.2, // Jarak sebagai angka
    stock: 7,
    rating: 4.8,
    reviews: 124,
    tags: ["Rekomendasi"],
    category: "Makanan Berat", // Kategori ditambahkan
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Pizza Margherita Panas",
    price: 29000,
    originalPrice: 45000,
    distance: 0.8,
    stock: 5,
    rating: 4.9,
    reviews: 210,
    tags: ["Terlaris"],
    category: "Makanan Berat",
    image:
      "https://images.unsplash.com/photo-1513104882182-338b85367905?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Kopi Latte Dingin",
    price: 12000,
    originalPrice: 18000,
    distance: 2.1,
    stock: 10,
    rating: 4.7,
    reviews: 88,
    tags: [],
    category: "Minuman",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Roti Cokelat Keju",
    price: 10000,
    originalPrice: 15000,
    distance: 2.5,
    stock: 3,
    rating: 4.6,
    reviews: 75,
    tags: ["Manis"],
    category: "Roti & Kue",
    image:
      "https://images.unsplash.com/photo-1509423350711-d00d2386a512?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Mie Ayam Bakso",
    price: 20000,
    originalPrice: 30000,
    distance: 1.9,
    stock: 6,
    rating: 4.8,
    reviews: 150,
    tags: ["Pedas", "Favorit"],
    category: "Makanan Berat",
    image:
      "https://images.unsplash.com/photo-1611796122687-1473919e8df4?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Soto Ayam",
    price: 18000,
    originalPrice: 25000,
    distance: 0.5,
    stock: 8,
    rating: 4.9,
    reviews: 230,
    tags: ["Hangat", "Rekomendasi"],
    category: "Makanan Berat",
    image:
      "https://images.unsplash.com/photo-1549419137-3323cf14a822?q=80&w=2070&auto=format&fit=crop",
  },
]);

// --- [BARU] State untuk menyimpan nilai filter ---
const selectedCategory = ref("Semua");
const maxDistance = ref(100); // 100 sebagai nilai "tak terbatas" / "semua jarak"
const minRating = ref(0); // 0 sebagai nilai "semua rating"

// --- [BARU] Computed property untuk memfilter data ---
const filteredOffers = computed(() => {
  return allOffers.value.filter((offer) => {
    // Cek apakah kategori cocok
    const categoryMatch =
      selectedCategory.value === "Semua" ||
      offer.category === selectedCategory.value;
    // Cek apakah jarak cocok
    const distanceMatch = offer.distance <= maxDistance.value;
    // Cek apakah rating cocok
    const ratingMatch = offer.rating >= minRating.value;

    return categoryMatch && distanceMatch && ratingMatch;
  });
});

const filteredFavoriteFoods = computed(() => {
  // Anda bisa membuat logika filter terpisah untuk makanan favorit jika datanya berbeda
  // Untuk contoh ini, kita gunakan logika yang sama
  return filteredOffers.value.filter(
    (food) => food.tags.includes("Favorit") || food.tags.includes("Rekomendasi")
  );
});

// --- Data untuk Peta Real-Time ---
const zoom = ref(13);
const mapCenter = ref([-7.6033, 111.9025]);
const markers = ref([
  { id: 1, name: "Burger Keju 1", position: [-7.601, 111.905] },
  { id: 2, name: "Burger Keju 2", position: [-7.608, 111.899] },
  { id: 3, name: "Burger Keju 3", position: [-7.603, 111.911] },
]);

// Fungsi untuk format mata uang
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};
</script>

<template>
  <div class="bg-gray-100">
    <main class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div
          v-for="(stat, index) in statsData"
          :key="index"
          :class="`bg-gradient-to-br ${stat.gradient} text-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-semibold opacity-80">{{ stat.title }}</p>
              <p class="text-4xl font-bold tracking-tight">{{ stat.value }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Icon :icon="stat.icon" class="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside class="lg:col-span-1">
          <div
            class="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg sticky top-10"
          >
            <h3 class="text-2xl font-bold text-gray-900 mb-8">
              Filter Pencarian
            </h3>
            <form class="space-y-6">
              <div>
                <label class="text-sm font-semibold text-gray-700 block mb-2"
                  >Kategori Makanan</label
                >
                <select
                  v-model="selectedCategory"
                  class="w-full p-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 text-gray-800 shadow-sm"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Makanan Berat">Makanan Berat</option>
                  <option value="Roti & Kue">Roti & Kue</option>
                  <option value="Minuman">Minuman</option>
                </select>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700 block mb-2"
                  >Jarak</label
                >
                <select
                  v-model.number="maxDistance"
                  class="w-full p-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 text-gray-800 shadow-sm"
                >
                  <option value="100">Semua Jarak</option>
                  <option value="1">&lt; 1 km</option>
                  <option value="3">&lt; 3 km</option>
                  <option value="5">&lt; 5 km</option>
                </select>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700 block mb-2"
                  >Rating</label
                >
                <select
                  v-model.number="minRating"
                  class="w-full p-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 text-gray-800 shadow-sm"
                >
                  <option value="0">Semua Rating</option>
                  <option value="4">4 Bintang ke atas</option>
                  <option value="3">3 Bintang ke atas</option>
                </select>
              </div>
            </form>
          </div>
        </aside>

        <div class="lg:col-span-3 space-y-16">
          <section>
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900">Penawaran Cepat</h2>
              <a
                href="#"
                class="text-base font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
              >
                Lihat Semua <Icon icon="mdi:arrow-right" class="text-lg" />
              </a>
            </div>
            <div
              v-if="filteredOffers.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              <div
                v-for="offer in filteredOffers"
                :key="offer.id"
                class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-500"
              >
                <div class="relative h-48">
                  <img
                    :src="offer.image"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    :alt="offer.name"
                  />

                  <div
                    class="absolute top-3 left-3 right-3 flex justify-between items-start"
                  >
                    <div
                      v-if="offer.originalPrice > offer.price"
                      class="bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm"
                    >
                      DISKON
                      {{
                        Math.round(
                          ((offer.originalPrice - offer.price) /
                            offer.originalPrice) *
                            100
                        )
                      }}%
                    </div>
                    <div
                      class="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-gray-800 shadow-md"
                    >
                      Sisa {{ offer.stock }}
                    </div>
                  </div>

                  <div
                    class="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-end"
                  >
                    <h4 class="font-bold text-xl text-white drop-shadow-md">
                      {{ offer.name }}
                    </h4>
                  </div>
                </div>

                <div class="p-6 flex flex-col flex-grow">
                  <div class="flex gap-2 mb-2">
                    <span
                      v-for="tag in offer.tags"
                      :key="tag"
                      class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <div class="flex items-center gap-1 text-sm text-gray-500">
                    <Icon icon="mdi:star" class="text-yellow-400" />
                    <span class="font-bold text-gray-700">{{
                      offer.rating
                    }}</span>
                    <span>({{ offer.reviews }} ulasan)</span>
                  </div>

                  <div class="flex-grow mt-3">
                    <p class="text-sm text-gray-600 flex items-center gap-1">
                      <Icon icon="mdi:map-marker-outline" class="text-lg" />{{
                        offer.distance
                      }}
                      km
                    </p>
                    <div class="flex items-baseline mt-1">
                      <p class="font-extrabold text-emerald-600 text-2xl">
                        {{ formatCurrency(offer.price) }}
                      </p>
                      <p class="text-sm text-gray-500 ml-2 line-through">
                        {{ formatCurrency(offer.originalPrice) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex space-x-3 mt-6">
                    <button
                      class="w-full bg-white text-emerald-600 border-2 border-emerald-500 px-4 py-2.5 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
                    >
                      <Icon icon="mdi:eye-outline" class="text-lg" />
                      Detail
                    </button>
                    <button
                      class="w-full bg-emerald-500 text-white px-4 py-2.5 rounded-full font-semibold hover:bg-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Icon icon="mdi:cart-plus" class="text-lg" />
                      Beli
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="text-center py-16 px-6 bg-white rounded-2xl shadow-lg"
            >
              <Icon
                icon="mdi:store-search-outline"
                class="text-6xl text-gray-300 mx-auto"
              />
              <h3 class="mt-4 text-xl font-bold text-gray-800">
                Tidak Ada Penawaran
              </h3>
              <p class="mt-2 text-gray-500">
                Coba ubah kriteria filter Anda untuk menemukan penawaran menarik
                lainnya.
              </p>
            </div>

            <div class="flex justify-center items-center mt-10 space-x-3">
              <button
                class="p-3 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <Icon icon="mdi:chevron-left" class="text-xl" />
              </button>
              <button
                class="px-5 py-2 rounded-full bg-emerald-500 text-white font-medium shadow-md"
              >
                1
              </button>
              <button
                class="px-5 py-2 rounded-full hover:bg-gray-200 text-gray-700 font-medium transition-colors"
              >
                2
              </button>
              <button
                class="px-5 py-2 rounded-full hover:bg-gray-200 text-gray-700 font-medium transition-colors"
              >
                3
              </button>
              <button
                class="p-3 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <Icon icon="mdi:chevron-right" class="text-xl" />
              </button>
            </div>
          </section>

          <section>
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900">Makanan Favorit</h2>
              <a
                href="#"
                class="text-base font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
              >
                Lihat Semua <Icon icon="mdi:arrow-right" class="text-lg" />
              </a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <div
                v-for="food in filteredFavoriteFoods"
                :key="food.id"
                class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-500"
              >
                <div class="relative h-48">
                  <img
                    :src="food.image"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    :alt="food.name"
                  />

                  <div
                    class="absolute top-3 left-3 right-3 flex justify-between items-start"
                  >
                    <div
                      v-if="food.originalPrice > food.price"
                      class="bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm"
                    >
                      DISKON
                      {{
                        Math.round(
                          ((food.originalPrice - food.price) /
                            food.originalPrice) *
                            100
                        )
                      }}%
                    </div>
                    <div
                      class="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-gray-800 shadow-md"
                    >
                      Sisa {{ food.stock }}
                    </div>
                  </div>

                  <div
                    class="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-end"
                  >
                    <h4 class="font-bold text-xl text-white drop-shadow-md">
                      {{ food.name }}
                    </h4>
                  </div>
                </div>

                <div class="p-6 flex flex-col flex-grow">
                  <div class="flex gap-2 mb-2">
                    <span
                      v-for="tag in food.tags"
                      :key="tag"
                      class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <div class="flex items-center gap-1 text-sm text-gray-500">
                    <Icon icon="mdi:star" class="text-yellow-400" />
                    <span class="font-bold text-gray-700">{{
                      food.rating
                    }}</span>
                    <span>({{ food.reviews }} ulasan)</span>
                  </div>

                  <div class="flex-grow mt-3">
                    <p class="text-sm text-gray-600 flex items-center gap-1">
                      <Icon icon="mdi:map-marker-outline" class="text-lg" />{{
                        food.distance
                      }}
                      km
                    </p>
                    <div class="flex items-baseline mt-1">
                      <p class="font-extrabold text-emerald-600 text-2xl">
                        {{ formatCurrency(food.price) }}
                      </p>
                      <p class="text-sm text-gray-500 ml-2 line-through">
                        {{ formatCurrency(food.originalPrice) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex space-x-3 mt-6">
                    <button
                      class="w-full bg-white text-emerald-600 border-2 border-emerald-500 px-4 py-2.5 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
                    >
                      <Icon icon="mdi:eye-outline" class="text-lg" />
                      Detail
                    </button>
                    <button
                      class="w-full bg-emerald-500 text-white px-4 py-2.5 rounded-full font-semibold hover:bg-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Icon icon="mdi:cart-plus" class="text-lg" />
                      Beli
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-center items-center mt-10 space-x-3"></div>
          </section>

          <section>
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900">Peta Real Time</h2>
              <a
                href="#"
                class="text-base font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
              >
                Lihat Semua <Icon icon="mdi:arrow-right" class="text-lg" />
              </a>
            </div>
            <div
              class="h-[450px] rounded-2xl border border-gray-200 overflow-hidden shadow-xl"
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
                ></l-tile-layer>
                <l-marker
                  v-for="marker in markers"
                  :key="marker.id"
                  :lat-lng="marker.position"
                >
                  <l-icon
                    :icon-url="'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png'"
                    :icon-size="[25, 41]"
                    :icon-anchor="[12, 41]"
                  />
                  <l-popup
                    ><div class="font-bold">{{ marker.name }}</div></l-popup
                  >
                </l-marker>
              </l-map>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
