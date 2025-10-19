<!-- <script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

const offers = ref([
  {
    name: "Paket Nasi Ayam",
    restaurant: "Resto Sedap",
    oldPrice: "Rp 50.000",
    newPrice: "Rp 25.000",
    rating: "4.8",
    image: "food-1.png",
    stock: 2,
    distance: "1.2 km",
  },
  {
    name: "Mie Goreng Spesial",
    restaurant: "Warung Enak",
    oldPrice: "Rp 40.000",
    newPrice: "Rp 20.000",
    rating: "4.9",
    image: "food-2.png",
    stock: 5,
    distance: "800 m",
  },
  {
    name: "Aneka Roti & Kue",
    restaurant: "Bakery Lezat",
    oldPrice: "Rp 60.000",
    newPrice: "Rp 30.000",
    rating: "4.7",
    image: "food-3.jpg",
    stock: 0, // Contoh stok habis
    distance: "2.5 km",
  },
]);
</script>

<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="text-center mb-16 max-w-2xl mx-auto"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 700 } }"
      >
        <h2 class="text-3xl font-bold text-gray-800">
          Penawaran Spesial Hari Ini
        </h2>
        <p class="text-gray-600 mt-3 text-lg">
          Amankan makanan lezat favoritmu sebelum kehabisan!
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(offer, index) in offers"
          :key="offer.name"
          class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visibleOnce="{
            opacity: 1,
            y: 0,
            transition: { delay: 150 * index, duration: 700 },
          }"
        >
          <div class="relative">
            <img
              :src="getImageUrl(offer.image)"
              :alt="offer.name"
              class="w-full h-56 object-cover"
            />
            <div
              class="absolute top-3 right-3 py-1 px-3 rounded-full text-sm font-semibold"
              :class="
                offer.stock > 0
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-400 text-white'
              "
            >
              {{ offer.stock > 0 ? `Sisa ${offer.stock}` : "Habis" }}
            </div>
          </div>

          <div class="p-6 flex flex-col flex-grow">
            <p class="text-gray-500 text-sm mb-1">{{ offer.restaurant }}</p>
            <h3 class="text-xl font-bold text-gray-900">{{ offer.name }}</h3>

            <div
              class="flex items-center justify-between text-sm text-gray-600 mt-3"
            >
              <div class="flex items-center gap-1">
                <Icon icon="mdi:star" class="w-5 h-5 text-yellow-400" />
                <span class="font-bold">{{ offer.rating }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon
                  icon="mdi:map-marker-outline"
                  class="w-5 h-5 text-gray-400"
                />
                <span>{{ offer.distance }}</span>
              </div>
            </div>

            <div
              class="mt-4 pt-4 border-t flex-grow flex items-end justify-between"
            >
              <div>
                <p class="text-lg text-gray-400 line-through">
                  {{ offer.oldPrice }}
                </p>
                <p class="text-2xl font-extrabold text-[#10B981]">
                  {{ offer.newPrice }}
                </p>
              </div>

              <button
                :disabled="offer.stock === 0"
                class="flex items-center justify-center gap-2 h-12 w-12 rounded-full font-semibold transition-colors duration-300"
                :class="
                  offer.stock > 0
                    ? 'bg-[#10B981] text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                "
              >
                <Icon icon="mdi:cart-plus" class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template> -->
<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router"; // DIIMPOR

const router = useRouter(); // DITAMBAHKAN

const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

// FUNGSI UNTUK NAVIGASI DITAMBAHKAN
const goToSmartShopping = () => {
  router.push({ name: "smart-shopping" });
};

const offers = ref([
  {
    name: "Paket Nasi Ayam",
    restaurant: "Resto Sedap",
    oldPrice: "Rp 50.000",
    newPrice: "Rp 25.000",
    rating: "4.8",
    image: "food-1.png",
    stock: 2,
    distance: "1.2 km",
  },
  {
    name: "Mie Goreng Spesial",
    restaurant: "Warung Enak",
    oldPrice: "Rp 40.000",
    newPrice: "Rp 20.000",
    rating: "4.9",
    image: "food-2.png",
    stock: 5,
    distance: "800 m",
  },
  {
    name: "Aneka Roti & Kue",
    restaurant: "Bakery Lezat",
    oldPrice: "Rp 60.000",
    newPrice: "Rp 30.000",
    rating: "4.7",
    image: "food-3.jpg",
    stock: 0,
    distance: "2.5 km",
  },
]);
</script>

<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="text-center mb-16 max-w-2xl mx-auto"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 700 } }"
      >
        <h2 class="text-3xl font-bold text-gray-800">
          Penawaran Spesial Hari Ini
        </h2>

        <p class="text-gray-600 mt-3 text-lg">
          Amankan makanan lezat favoritmu sebelum kehabisan!
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(offer, index) in offers"
          :key="offer.name"
          class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visibleOnce="{
            opacity: 1,
            y: 0,
            transition: { delay: 150 * index, duration: 700 },
          }"
        >
          <div class="relative">
            <img
              :src="getImageUrl(offer.image)"
              :alt="offer.name"
              class="w-full h-56 object-cover"
            />

            <div
              class="absolute top-3 right-3 py-1 px-3 rounded-full text-sm font-semibold"
              :class="
                offer.stock > 0
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-400 text-white'
              "
              _200c_
            >
              {{ offer.stock > 0 ? `Sisa ${offer.stock}` : "Habis" }}
            </div>
          </div>

          <div class="p-6 flex flex-col flex-grow">
            <p class="text-gray-500 text-sm mb-1">{{ offer.restaurant }}</p>

            <h3 class="text-xl font-bold text-gray-900">{{ offer.name }}</h3>

            <div
              class="flex items-center justify-between text-sm text-gray-600 mt-3"
            >
              <div class="flex items-center gap-1">
                <Icon icon="mdi:star" class="w-5 h-5 text-yellow-400" />
                <span class="font-bold">{{ offer.rating }}</span>
              </div>

              <div class="flex items-center gap-1">
                <Icon
                  icon="mdi:map-marker-outline"
                  class="w-5 h-5 text-gray-400"
                />
                <span>{{ offer.distance }}</span>
              </div>
            </div>

            <div
              class="mt-4 pt-4 border-t flex-grow flex items-end justify-between"
            >
              <div>
                <p class="text-lg text-gray-400 line-through">
                  {{ offer.oldPrice }}
                </p>

                <p class="text-2xl font-extrabold text-[#10B981]">
                  {{ offer.newPrice }}
                </p>
              </div>

              <button
                :disabled="offer.stock === 0"
                class="flex items-center justify-center gap-2 h-12 w-12 rounded-full font-semibold transition-colors duration-300"
                :class="
                  offer.stock > 0
                    ? 'bg-[#10B981] text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                "
              >
                <Icon icon="mdi:cart-plus" class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="text-center mt-16"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visibleOnce="{
          opacity: 1,
          y: 0,
          transition: { delay: 300, duration: 700 },
        }"
      >
        <button
          @click="goToSmartShopping"
          class="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        >
          <span>Lihat Semua Penawaran</span>
          <Icon icon="mdi:arrow-right-circle-outline" class="w-7 h-7" />
        </button>
      </div>
    </div>
  </section>
</template>
