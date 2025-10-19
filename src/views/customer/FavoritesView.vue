<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

// [BARU] Fungsi helper untuk membuat URL gambar yang benar
const getImageUrl = (name) => {
  // Pastikan path-nya benar sesuai struktur folder Anda
  return new URL(`/src/assets/${name}`, import.meta.url).href;
};

// --- DATA CONTOH TOKO FAVORIT (ditambahkan status & rating) ---
const favoriteStores = ref([
  {
    id: 1,
    business_name: "Kafe Pagi Segar",
    address: "Jl. Kopi No. 15, Bandung",
    // [DIUBAH] Hanya gunakan nama file di sini
    image_url: "food-2.png",
    logo_url: "logo.png",
    category: "Kafe & Minuman",
    rating: 4.8,
    is_open: true,
  },
  {
    id: 2,
    business_name: "Baker's Lane",
    address: "Jl. Anggrek No. 8, Bandung",
    image_url: "food-1.png",
    logo_url: "logo-roti.png", // Asumsi nama file
    category: "Roti & Kue",
    rating: 4.9,
    is_open: true,
  },
  {
    id: 3,
    business_name: "Warung Nusantara",
    address: "Jl. Melati No. 12, Bandung",
    image_url: "nasi-goreng.jpg",
    logo_url: "logo-warung.png", // Asumsi nama file
    category: "Masakan Indonesia",
    rating: 4.7,
    is_open: false, // Contoh toko yang sedang tutup
  },
]);

// Fungsi placeholder untuk menghapus favorit
const removeFavorite = (storeId) => {
  if (confirm("Anda yakin ingin menghapus toko ini dari favorit?")) {
    favoriteStores.value = favoriteStores.value.filter(
      (store) => store.id !== storeId
    );
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- HEADER -->
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Toko Favorit Saya</h1>
        <p class="text-gray-500 mt-2">
          Temukan kembali penawaran dari tempat-tempat yang Anda sukai.
        </p>
      </header>

      <!-- DAFTAR TOKO FAVORIT -->
      <div v-if="favoriteStores.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(store, index) in favoriteStores"
            :key="store.id"
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
            class="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col"
          >
            <!-- Bagian Atas: Banner & Rating -->
            <div class="relative">
              <div class="h-40 bg-cover bg-center overflow-hidden">
                <!-- [DIUBAH] Gunakan fungsi helper di sini -->
                <div
                  class="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  :style="{
                    backgroundImage: `url(${getImageUrl(store.image_url)})`,
                  }"
                ></div>
              </div>
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
              ></div>
              <div
                class="absolute top-3 right-3 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800"
              >
                <Icon icon="mdi:star" class="text-yellow-500" />
                <span>{{ store.rating }}</span>
              </div>
            </div>

            <!-- Bagian Tengah: Logo, Nama, Alamat -->
            <div class="p-6 relative text-center flex-grow">
              <!-- [PERBAIKAN] Mengganti warna ring menjadi lebih kuat -->
              <img
                :src="getImageUrl(store.logo_url)"
                alt="Logo"
                class="w-20 h-20 rounded-full object-cover ring-4 ring-teal-500 shadow-md absolute -top-12 left-1/2 -translate-x-1/2"
              />
              <div class="pt-8">
                <h2 class="text-xl font-bold text-gray-800">
                  {{ store.business_name }}
                </h2>
                <p class="text-sm text-gray-500 mt-1">{{ store.category }}</p>
                <div
                  class="flex items-center justify-center gap-2 text-xs text-gray-400 mt-3"
                >
                  <Icon icon="mdi:map-marker-outline" />
                  <span>{{ store.address }}</span>
                </div>
              </div>
            </div>

            <!-- Bagian Bawah Kartu: Status Buka & Tombol Aksi -->
            <div
              class="px-6 pb-6 border-t border-gray-100 pt-4 flex justify-between items-center"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-2.5 h-2.5 rounded-full"
                  :class="
                    store.is_open ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  "
                ></div>
                <span
                  class="text-xs font-semibold"
                  :class="store.is_open ? 'text-green-600' : 'text-red-600'"
                >
                  {{ store.is_open ? "Buka Sekarang" : "Tutup" }}
                </span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="removeFavorite(store.id)"
                  class="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                  title="Hapus dari Favorit"
                >
                  <Icon icon="mdi:heart-off-outline" class="w-5 h-5" />
                </button>
                <button
                  class="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg shadow-md hover:scale-105 transform transition-transform"
                >
                  Lihat Penawaran
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAMPILAN JIKA KOSONG -->
      <div v-else class="text-center py-24">
        <Icon
          icon="mdi:heart-off-outline"
          class="mx-auto w-16 h-16 text-gray-400"
        />
        <h3 class="mt-4 text-xl font-semibold text-gray-700">
          Anda Belum Punya Toko Favorit
        </h3>
        <p class="mt-2 text-gray-500">
          Tandai toko yang Anda sukai untuk melihatnya di sini.
        </p>
      </div>
    </div>
  </div>
</template>
