<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useTransition } from "@vueuse/core";
import transactionService from "@/services/transactionService.js"; // <-- 1. IMPORT SERVICE

// --- STATE MANAGEMENT ---
const allOrders = ref([]); // <-- 2. HAPUS DATA DUMMY, GANTI JADI ARRAY KOSONG
const isLoading = ref(true);
const errorMessage = ref(null);

// --- STATE UNTUK FILTER, PENCARIAN, & PAGINASI (tidak berubah) ---
const possibleStatuses = [
  "Semua",
  "Aktif",
  "Siap Diambil",
  "Selesai",
  "Dibatalkan",
];
const activeFilter = ref("Semua");
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(3);

// --- API LOGIC: FUNGSI BARU UNTUK MENGAMBIL DATA ---
const fetchOrders = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    const response = await transactionService.getUserTransactions();
    // 3. Petakan data dari API ke format yang bisa digunakan oleh template
    allOrders.value = response.data.map(mapApiToOrder);
  } catch (error) {
    console.error("Gagal mengambil data pesanan:", error);
    errorMessage.value = "Tidak dapat memuat data pesanan dari server.";
  } finally {
    isLoading.value = false;
  }
};

// Panggil fungsi saat komponen dimuat
onMounted(() => {
  fetchOrders();
});

// --- HELPER UNTUK MAPPING DATA ---
// Fungsi ini mengubah struktur data dari API menjadi struktur yang lebih mudah digunakan di template
const mapApiToOrder = (transaction) => {
  const { reservation } = transaction;
  return {
    id: transaction.invoice_code,
    foodName: reservation.offer.title,
    storeName: reservation.offer.business.business_name,
    status: mapStatus(reservation.status, transaction.payment_status), // Status yang lebih deskriptif
    pickupTime: formatPickupTime(
      reservation.offer.pickup_start,
      reservation.offer.pickup_end
    ),
    address: reservation.offer.business.address,
    price: reservation.offer.price,
    quantity: reservation.quantity,
    image: getImageUrl(reservation.offer.image_url),
  };
};

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
  }
  return `https://hematbox.sugengaldi.my.id/${imagePath.replace(/\\/g, "/")}`;
};

const formatPickupTime = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const options = { hour: "2-digit", minute: "2-digit" };
  return `${startDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
  })}, ${startDate.toLocaleTimeString(
    "id-ID",
    options
  )} - ${endDate.toLocaleTimeString("id-ID", options)}`;
};

// Fungsi ini mengubah status backend menjadi status yang lebih ramah pengguna
const mapStatus = (reservationStatus, paymentStatus) => {
  if (
    reservationStatus === "cancelled" ||
    paymentStatus === "cancelled" ||
    paymentStatus === "Kadaluwarsa" ||
    paymentStatus === "Gagal"
  ) {
    return "Dibatalkan";
  }
  if (reservationStatus === "completed" || paymentStatus === "Lunas") {
    return "Selesai";
  }
  if (
    reservationStatus === "confirmed" ||
    paymentStatus === "Sudah Bayar" ||
    paymentStatus === "Lunas"
  ) {
    return "Siap Diambil";
  }
  if (
    reservationStatus === "pending" &&
    (paymentStatus === "Sudah Bayar" || paymentStatus === "Sudah Bayar")
  ) {
    return "Aktif";
  }
  return "Aktif"; // Default untuk status pending lainnya
};

// --- LOGIKA FILTER, PAGINASI, DAN KARTU (disesuaikan) ---

// [DISESUAIKAN] Data ringkasan sekarang dihitung dari data API
const summaryData = computed(() => {
  const active = allOrders.value.filter((o) => o.status === "Aktif").length;
  const ready = allOrders.value.filter(
    (o) => o.status === "Siap Diambil"
  ).length;
  const completed = allOrders.value.filter(
    (o) => o.status === "Selesai"
  ).length;
  const cancelled = allOrders.value.filter(
    (o) => o.status === "Dibatalkan"
  ).length;

  // Update target animasi saat data berubah
  animatedSources.value = [active, ready, completed, cancelled];

  return {
    aktif: {
      title: "Pesanan Aktif",
      target: active,
      icon: "mdi:progress-clock",
      gradient: "from-blue-500 to-purple-600",
    },
    siap: {
      title: "Siap Diambil",
      target: ready,
      icon: "mdi:check-decagram-outline",
      gradient: "from-emerald-400 to-teal-600",
    },
    selesai: {
      title: "Pesanan Selesai",
      target: completed,
      icon: "mdi:archive-outline",
      gradient: "from-orange-400 to-pink-500",
    },
    dibatalkan: {
      title: "Dibatalkan",
      target: cancelled,
      icon: "mdi:close-circle-outline",
      gradient: "from-rose-500 to-red-600",
    },
  };
});

const animatedSources = ref([0, 0, 0, 0]);
const animatedValues = useTransition(animatedSources, { duration: 1500 });

const filteredOrders = computed(() => {
  let processedOrders = [...allOrders.value];
  if (activeFilter.value !== "Semua") {
    processedOrders = processedOrders.filter(
      (order) => order.status === activeFilter.value
    );
  }
  if (searchQuery.value.trim() !== "") {
    const query = searchQuery.value.toLowerCase();
    processedOrders = processedOrders.filter(
      (order) =>
        order.foodName.toLowerCase().includes(query) ||
        order.storeName.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query)
    );
  }
  return processedOrders;
});

const totalPages = computed(() =>
  Math.ceil(filteredOrders.value.length / itemsPerPage.value)
);
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredOrders.value.slice(start, end);
});

watch([activeFilter, searchQuery], () => {
  currentPage.value = 1;
});
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const formatPrice = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Siap Diambil":
      return {
        tag: "bg-green-100 text-green-700",
        icon: "mdi:check-circle-outline",
      };
    case "Aktif":
      return { tag: "bg-blue-100 text-blue-700", icon: "mdi:progress-clock" };
    case "Selesai":
      return { tag: "bg-gray-100 text-gray-600", icon: "mdi:check-all" };
    case "Dibatalkan":
      return {
        tag: "bg-red-100 text-red-700",
        icon: "mdi:close-circle-outline",
      };
    default:
      return {
        tag: "bg-gray-100 text-gray-600",
        icon: "mdi:help-circle-outline",
      };
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-6xl mx-auto">
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Pesanan Saya</h1>
        <p class="text-gray-500 mt-2">
          Kelola pesanan aktif, riwayat, dan status pickup Anda.
        </p>
      </header>

      <!-- KARTU RINGKASAN -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="(item, key, index) in summaryData" :key="key" v-motion :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
          :class="`relative overflow-hidden p-6 rounded-2xl shadow-lg text-white bg-gradient-to-br ${item.gradient} transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`">
          <div class="relative z-10">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-semibold opacity-80">{{ item.title }}</p>
                <p class="text-4xl font-bold tracking-tight">
                  {{ Math.round(animatedValues[index]) }}
                </p>
              </div>
              <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Icon :icon="item.icon" class="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TOOLBAR PENCARIAN & FILTER -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-8 flex flex-col md:flex-row items-center gap-4">
        <div class="relative flex-grow w-full md:w-auto">
          <Icon icon="mdi:magnify" class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input v-model="searchQuery" type="text" placeholder="Cari pesanan (nama, toko, atau kode)..."
            class="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-lg focus:ring-2 focus:ring-teal-300 transition" />
        </div>
        <nav class="p-1.5 bg-gray-100 rounded-lg flex items-center gap-2 overflow-x-auto">
          <button v-for="status in possibleStatuses" :key="status" @click="activeFilter = status" :class="[
            'px-4 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap',
            activeFilter === status
              ? 'bg-white text-teal-600 shadow-sm'
              : 'text-gray-500 hover:bg-white/50',
          ]">
            {{ status }}
          </button>
        </nav>
      </div>

      <!-- ▼▼▼ 4. TAMBAHKAN BLOK KONDISIONAL UNTUK LOADING, ERROR, DAN DATA ▼▼▼ -->
      <!-- State Loading -->
      <div v-if="isLoading" class="text-center py-24">
        <Icon icon="mdi:loading" class="animate-spin w-16 h-16 text-teal-500 mx-auto" />
        <h3 class="mt-4 text-xl font-semibold text-gray-700">
          Memuat Pesanan Anda...
        </h3>
      </div>

      <!-- State Error -->
      <div v-else-if="errorMessage" class="text-center py-24 bg-red-50 rounded-2xl">
        <Icon icon="mdi:alert-circle-outline" class="mx-auto w-16 h-16 text-red-500" />
        <h3 class="mt-4 text-xl font-semibold text-red-700">
          Oops! Terjadi Kesalahan
        </h3>
        <p class="mt-2 text-gray-500">{{ errorMessage }}</p>
      </div>

      <!-- Tampilan Data (jika tidak loading dan tidak error) -->
      <div v-else>
        <!-- Daftar Pesanan -->
        <div v-if="filteredOrders.length > 0">
          <div class="space-y-6">
            <div v-for="(order, index) in paginatedOrders" :key="order.id" v-motion :initial="{ opacity: 0, y: 50 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
              class="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border border-white/30">
              <div class="p-6">
                <div class="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                  <div class="flex items-center gap-5">
                    <img :src="order.image" :alt="order.foodName" class="w-24 h-24 rounded-xl object-cover" />
                    <div>
                      <span :class="getStatusStyle(order.status).tag"
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2">
                        <Icon :icon="getStatusStyle(order.status).icon" class="w-4 h-4" />{{ order.status }}
                      </span>
                      <h2 class="text-xl font-bold text-gray-800">
                        {{ order.foodName }}
                      </h2>
                      <p class="text-sm text-gray-500">{{ order.storeName }}</p>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <p class="text-2xl font-bold text-gray-800">
                      {{ formatPrice(order.price * order.quantity) }}
                    </p>
                    <p class="text-sm text-gray-500">
                      (Qty: {{ order.quantity }})
                    </p>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-t border-gray-100">
                  <div class="flex items-center gap-3">
                    <Icon icon="mdi:clock-outline" class="w-6 h-6 text-teal-500 flex-shrink-0" />
                    <div class="text-sm">
                      <p class="font-semibold text-gray-700">Waktu Ambil</p>
                      <p class="text-gray-500">{{ order.pickupTime }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <Icon icon="mdi:barcode-scan" class="w-6 h-6 text-teal-500 flex-shrink-0" />
                    <div class="text-sm">
                      <p class="font-semibold text-gray-700">Kode Pesanan</p>
                      <p class="text-gray-500 font-mono">{{ order.id }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <Icon icon="mdi:map-marker-outline" class="w-6 h-6 text-teal-500 flex-shrink-0" />
                    <div class="text-sm">
                      <p class="font-semibold text-gray-700">Alamat Toko</p>
                      <p class="text-gray-500">{{ order.address }}</p>
                    </div>
                  </div>
                </div>
                <!-- Tombol Aksi (disesuaikan dengan status baru) -->
                <div class="flex items-center justify-end gap-3 mt-4">
                  <template v-if="order.status === 'Aktif'">
                    <button
                      class="px-5 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all">
                      Batalkan
                    </button>
                    <button
                      class="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:shadow-lg rounded-lg transition-all">
                      Lihat Kode
                    </button>
                  </template>
                  <template v-else-if="order.status === 'Siap Diambil'">
                    <button
                      class="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                      Tandai Sudah Diambil
                    </button>
                  </template>
                  <template v-else-if="order.status === 'Selesai'">
                    <button
                      class="px-5 py-2 text-sm font-semibold text-white bg-gray-700 hover:bg-gray-800 rounded-lg transition-all">
                      Pesan Lagi
                    </button>
                  </template>
                  <template v-else-if="order.status === 'Dibatalkan'">
                    <p class="text-sm font-medium text-gray-500">
                      Pesanan telah dibatalkan
                    </p>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- Kontrol Paginasi -->
          <div v-if="totalPages > 1" class="flex items-center justify-between mt-8">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
              class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white rounded-lg shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <Icon icon="mdi:chevron-left" /> Sebelumnya
            </button>
            <div class="flex items-center gap-2">
              <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
                'w-10 h-10 rounded-lg text-sm font-semibold transition',
                currentPage === page
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 shadow-md hover:bg-gray-100',
              ]">
                {{ page }}
              </button>
            </div>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
              class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white rounded-lg shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
              Berikutnya
              <Icon icon="mdi:chevron-right" />
            </button>
          </div>
        </div>
        <!-- Pesan jika tidak ada data -->
        <div v-else class="text-center py-24">
          <Icon icon="mdi:receipt-text-search-outline" class="mx-auto w-16 h-16 text-gray-400" />
          <h3 class="mt-4 text-xl font-semibold text-gray-700">
            Belum Ada Pesanan
          </h3>
          <p class="mt-2 text-gray-500">
            Anda belum memiliki riwayat pesanan. Mulai jelajahi penawaran
            sekarang!
          </p>
        </div>
      </div>
      <!-- ▲▲▲ AKHIR DARI BLOK KONDISIONAL ▲▲▲ -->
    </div>
  </div>
</template>
