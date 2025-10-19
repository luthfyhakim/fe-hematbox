<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useTransition } from "@vueuse/core";
import EditOfferModal from "@/components/EditOfferModal.vue";
import AddOfferModal from "@/components/AddOfferModal.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import businessService from "@/services/businessService.js";
import offerService from "@/services/offerService.js";

// --- KONFIGURASI GAMBAR ---
const API_BASE_URL = "https://hematbox.sugengaldi.my.id";

const getImageUrl = (path) => {
  if (!path) {
    return "https://via.placeholder.com/150";
  }
  return `${API_BASE_URL}/${path}`;
};

// --- STATE UNTUK DATA DARI DATABASE ---
const offers = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

// --- STATE UNTUK FILTER, SORTING, DAN PENCARIAN ---
const searchQuery = ref("");
const statusFilter = ref("Semua");
const sortOrder = ref("Terbaru");

// --- STATISTIK DASHBOARD (TIDAK DIUBAH) ---
const penawaranAktifTarget = ref(8);
const penjualanTarget = ref(350000);
const pelangganTarget = ref(124);
const limbahTarget = ref(45);

const penawaranAktifSource = ref(0);
const penjualanSource = ref(0);
const pelangganSource = ref(0);
const limbahSource = ref(0);

// Animasi untuk angka statistik (TIDAK DIUBAH)
const penawaranAktifAnimated = useTransition(penawaranAktifSource, {
  duration: 1500,
});
const penjualanAnimated = useTransition(penjualanSource, { duration: 1500 });
const pelangganAnimated = useTransition(pelangganSource, { duration: 1500 });
const limbahAnimated = useTransition(limbahSource, { duration: 1500 });

// Trigger animasi saat mount (TIDAK DIUBAH)
penawaranAktifSource.value = penawaranAktifTarget.value;
penjualanSource.value = penjualanTarget.value;
pelangganSource.value = pelangganTarget.value;
limbahSource.value = limbahTarget.value;

// Format display untuk statistik (TIDAK DIUBAH)
const formattedPenawaranAktif = computed(() =>
  Math.round(penawaranAktifAnimated.value)
);
const formattedPenjualan = computed(
  () => `Rp ${Math.round(penjualanAnimated.value / 1000)}K`
);
const formattedPelanggan = computed(() => Math.round(pelangganAnimated.value));
const formattedLimbah = computed(() => `${Math.round(limbahAnimated.value)}Kg`);

// Data chart (TIDAK DIUBAH)
const chartBars = ref([40, 60, 50, 70, 80, 75, 95]);

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
  if (!value) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatTime = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "-";
  }
};

// --- FUNGSI PENGAMBILAN DATA ---
// const fetchOffers = async () => {
//   isLoading.value = true;
//   errorMessage.value = null;

//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.warn("Token tidak ditemukan, user mungkin belum login");
//       errorMessage.value =
//         "Silakan login terlebih dahulu untuk melihat penawaran.";
//       offers.value = [];
//       isLoading.value = false;
//       return;
//     }

//     const response = await businessService.getMyBusinessOffers();
//     const data = response?.data;
//     offers.value = Array.isArray(data) ? data : [];

//     console.log("Fetched offers for dashboard:", offers.value.length);
//   } catch (error) {
//     console.error("Gagal mengambil data penawaran:", error);

//     if (error.response?.status === 401) {
//       errorMessage.value = "Sesi Anda telah berakhir. Silakan login kembali.";
//     } else {
//       errorMessage.value = "Tidak dapat memuat data penawaran dari server.";
//     }

//     offers.value = [];
//   } finally {
//     isLoading.value = false;
//   }
// };
const fetchOffers = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    // TIDAK PERLU CEK TOKEN MANUAL LAGI, LANGSUNG PANGGIL API
    const response = await businessService.getMyBusinessOffers();
    const data = response?.data;
    // Perbaikan dari kode KelolaPenawaranView, pastikan Anda mengambil data offers dari properti yang benar
    // Berdasarkan screenshot Anda, data offers ada di dalam properti "offers"
    // offers.value = Array.isArray(data.offers) ? data.offers : [];

    // --- PERBAIKAN DI SINI ---
    // Ganti baris lama dengan yang ini.
    // Kita cek apakah 'data' itu sendiri adalah sebuah array.
    offers.value = Array.isArray(data) ? data : [];
    // --- AKHIR PERBAIKAN ---

    console.log("Fetched offers for dashboard:", offers.value.length);
  } catch (error) {
    console.error("Gagal mengambil data penawaran:", error);

    // Biarkan interceptor atau service API yang menangani error 401 (Unauthorized)
    if (error.response?.status === 401) {
      errorMessage.value = "Sesi Anda telah berakhir. Silakan login kembali.";
      // Idealnya, interceptor axios akan otomatis mengarahkan ke halaman login
    } else {
      errorMessage.value = "Tidak dapat memuat data penawaran dari server.";
    }

    offers.value = [];
  } finally {
    isLoading.value = false;
  }
};

// --- COMPUTED PROPERTY UNTUK MENAMPILKAN DATA ---
const filteredAndSortedOffers = computed(() => {
  if (!Array.isArray(offers.value)) {
    return [];
  }

  let processedOffers = offers.value;

  // Filter berdasarkan pencarian
  if (searchQuery.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    processedOffers = processedOffers.filter((offer) =>
      (offer.title || "").toLowerCase().includes(query)
    );
  }

  // Filter berdasarkan status
  if (statusFilter.value && statusFilter.value !== "Semua") {
    const filterValue =
      statusFilter.value === "Aktif" ? "aktif" : "tidak_aktif";
    processedOffers = processedOffers.filter(
      (offer) => offer.status === filterValue
    );
  }

  // Buat salinan array sebelum diurutkan untuk menghindari mutasi state asli
  const sorted = [...processedOffers];

  switch (sortOrder.value) {
    case "Harga Terendah":
      sorted.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      break;
    case "Harga Tertinggi":
      sorted.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      break;
    case "Sisa Terbanyak":
      sorted.sort(
        (a, b) =>
          (Number(b.remaining_portion) || 0) -
          (Number(a.remaining_portion) || 0)
      );
      break;
    default: // Terbaru
      sorted.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      break;
  }

  return sorted;
});

// --- MODAL MANAGEMENT ---
const isEditModalOpen = ref(false);
const editingOffer = ref(null);
const isAddModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
// const offerToDeleteId = ref(null);
// Ubah dari ref(null) menjadi ref({ offerId: null, businessId: null })
const offerToDelete = ref({ offerId: null, businessId: null });

const openEditModal = (offer) => {
  try {
    editingOffer.value = JSON.parse(JSON.stringify(offer));
    isEditModalOpen.value = true;
  } catch (e) {
    console.error("Error opening edit modal:", e);
    alert("Gagal membuka modal edit");
  }
};

// const openDeleteModal = (offerId) => {
//   offerToDeleteId.value = offerId;
//   isDeleteModalOpen.value = true;
// };

// Ubah fungsi ini untuk menerima seluruh objek 'offer'
const openDeleteModal = (offer) => {
  offerToDelete.value = {
    offerId: offer.id,
    businessId: offer.business_id, // Ambil business_id dari objek offer
  };
  isDeleteModalOpen.value = true;
};

// --- HANDLER FUNCTIONS ---
const handleAddOffer = async (formData) => {
  try {
    await offerService.createOffer(formData);
    isAddModalOpen.value = false;
    await fetchOffers();
  } catch (error) {
    console.error("Gagal menambah penawaran:", error);
    if (error.response?.status === 401) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
    } else {
      alert("Gagal menambah penawaran. Pastikan semua data sudah benar.");
    }
  }
};

const handleUpdateOffer = async ({ id, data }) => {
  try {
    await offerService.updateOffer(id, data);
    isEditModalOpen.value = false;
    editingOffer.value = null;
    await fetchOffers();
  } catch (error) {
    console.error("Gagal memperbarui penawaran:", error);
    if (error.response?.status === 401) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
    } else {
      alert("Gagal memperbarui penawaran. Periksa kembali data Anda.");
    }
  }
};

// const handleDeleteOffer = async () => {
//   try {
//     await offerService.deleteOffer(offerToDeleteId.value);
//     isDeleteModalOpen.value = false;
//     offerToDeleteId.value = null;
//     await fetchOffers(); // Cukup fetch ulang data
//   } catch (error) {
//     console.error("Gagal menghapus penawaran:", error);
//     if (error.response?.status === 401) {
//       alert("Sesi Anda telah berakhir. Silakan login kembali.");
//     } else {
//       alert("Gagal menghapus penawaran.");
//     }
//   }
// };
const handleDeleteOffer = async () => {
  // Pastikan ada data yang akan dihapus
  if (!offerToDelete.value.offerId || !offerToDelete.value.businessId) return;

  try {
    // Panggil service dengan kedua ID
    await offerService.deleteOffer(
      offerToDelete.value.businessId,
      offerToDelete.value.offerId
    );

    isDeleteModalOpen.value = false;
    // Reset state ke nilai awal
    offerToDelete.value = { offerId: null, businessId: null };
    await fetchOffers();
  } catch (error) {
    console.error("Gagal menghapus penawaran:", error);
    if (error.response?.status === 401) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
    } else {
      alert("Gagal menghapus penawaran.");
    }
  }
};

// --- LIFECYCLE ---
onMounted(async () => {
  console.log("Dashboard component mounted");
  await fetchOffers();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-motion :initial="{ opacity: 0, y: 50 }" :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 100 } }"
        class="group relative overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-emerald-100 text-sm font-semibold mb-1">
                Penawaran Aktif
              </p>
              <p class="text-white text-4xl font-bold tracking-tight">
                {{ formattedPenawaranAktif }}
              </p>
              <div class="flex items-center mt-2">
                <Icon icon="mdi:trending-up" class="w-4 h-4 text-emerald-200 mr-1" />
                <span class="text-emerald-200 text-sm">+2 dari kemarin</span>
              </div>
            </div>
            <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Icon icon="mdi:tag-heart-outline" class="w-8 h-8 text-white" />
            </div>
          </div>
          <div class="h-1 bg-white/20 rounded-full overflow-hidden">
            <div class="h-full bg-white/40 w-3/4 rounded-full"></div>
          </div>
        </div>
      </div>

      <div v-motion :initial="{ opacity: 0, y: 50 }" :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 200 } }"
        class="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-blue-100 text-sm font-semibold mb-1">
                Penjualan Hari Ini
              </p>
              <p class="text-white text-4xl font-bold tracking-tight">
                {{ formattedPenjualan }}
              </p>
              <div class="flex items-center mt-2">
                <Icon icon="mdi:trending-up" class="w-4 h-4 text-blue-200 mr-1" />
                <span class="text-blue-200 text-sm">+15% dari kemarin</span>
              </div>
            </div>
            <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Icon icon="mdi:cash-multiple" class="w-8 h-8 text-white" />
            </div>
          </div>
          <div class="h-1 bg-white/20 rounded-full overflow-hidden">
            <div class="h-full bg-white/40 w-4/5 rounded-full"></div>
          </div>
        </div>
      </div>

      <div v-motion :initial="{ opacity: 0, y: 50 }" :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 300 } }"
        class="group relative overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-orange-100 text-sm font-semibold mb-1">
                Total Pelanggan
              </p>
              <p class="text-white text-4xl font-bold tracking-tight">
                {{ formattedPelanggan }}
              </p>
              <div class="flex items-center mt-2">
                <Icon icon="mdi:trending-up" class="w-4 h-4 text-orange-200 mr-1" />
                <span class="text-orange-200 text-sm">+8 minggu ini</span>
              </div>
            </div>
            <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Icon icon="mdi:account-group-outline" class="w-8 h-8 text-white" />
            </div>
          </div>
          <div class="h-1 bg-white/20 rounded-full overflow-hidden">
            <div class="h-full bg-white/40 w-3/5 rounded-full"></div>
          </div>
        </div>
      </div>

      <div v-motion :initial="{ opacity: 0, y: 50 }" :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 400 } }"
        class="group relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-violet-100 text-sm font-semibold mb-1">
                Limbah Dikurangi
              </p>
              <p class="text-white text-4xl font-bold tracking-tight">
                {{ formattedLimbah }}
              </p>
              <div class="flex items-center mt-2">
                <Icon icon="mdi:trending-up" class="w-4 h-4 text-violet-200 mr-1" />
                <span class="text-violet-200 text-sm">+2 dari kemarin</span>
              </div>
            </div>
            <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Icon icon="mdi:scale-balance" class="w-8 h-8 text-white" />
            </div>
          </div>
          <div class="h-1 bg-white/20 rounded-full overflow-hidden">
            <div class="h-full bg-white/40 w-2/3 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div v-motion :initial="{ opacity: 0, y: 50 }" :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 500 } }"
        class="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-800 mb-1">
              Penawaran Aktif
            </h3>
            <p class="text-gray-600">Tren mingguan</p>
          </div>
          <div class="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
            <div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span class="text-emerald-700 font-semibold text-sm">Aktif: 3</span>
          </div>
        </div>
        <div
          class="h-64 flex items-end justify-between gap-3 p-4 bg-gradient-to-t from-emerald-50/50 to-transparent rounded-2xl">
          <div v-for="(height, index) in chartBars" :key="index"
            class="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-xl transition-all duration-1000 hover:from-emerald-600 hover:to-emerald-400 cursor-pointer shadow-lg"
            :style="{
              height: `${height}%`,
              animationDelay: `${index * 100}ms`,
            }"></div>
        </div>
      </div>

      <div v-motion :initial="{ opacity: 0, y: 50 }" :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 650 } }"
        class="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-800 mb-1">
              Penjualan Hari Ini
            </h3>
            <p class="text-gray-600">Target vs Realisasi</p>
          </div>
          <div class="flex gap-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span class="text-blue-600 font-medium text-sm">Terjual: Rp 350K</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span class="text-emerald-600 font-medium text-sm">Target: Rp 350K</span>
            </div>
          </div>
        </div>
        <div
          class="h-64 flex items-end justify-between gap-3 p-4 bg-gradient-to-t from-blue-50/50 to-transparent rounded-2xl">
          <div v-for="(height, index) in chartBars.slice().reverse()" :key="index"
            class="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-xl transition-all duration-1000 hover:from-blue-600 hover:to-blue-400 cursor-pointer shadow-lg"
            :style="{
              height: `${height}%`,
              animationDelay: `${index * 100}ms`,
            }"></div>
        </div>
      </div>
    </div>

    <div v-motion :initial="{ opacity: 0, y: 50 }" :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 800 } }"
      class="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-800 mb-1">
            Penawaran Aktif Saat Ini
          </h3>
          <p class="text-gray-600">Kelola semua penawaran magic box</p>
        </div>
        <button @click="isAddModalOpen = true"
          class="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
          <Icon icon="mdi:plus" class="w-5 h-5 inline mr-2" /> Tambah Penawaran
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50">
        <div class="relative">
          <label for="search" class="text-sm font-semibold text-gray-600 mb-1 block">Pencarian</label>
          <Icon icon="mdi:magnify" class="w-5 h-5 text-gray-400 absolute top-10 left-3" />
          <input v-model="searchQuery" type="text" id="search" placeholder="Cari nama penawaran..."
            class="w-full border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-teal-500 focus:border-teal-500 transition" />
        </div>
        <div>
          <label for="status" class="text-sm font-semibold text-gray-600 mb-1 block">Status</label>
          <select v-model="statusFilter" id="status"
            class="w-full border-gray-300 rounded-lg py-2 px-3 focus:ring-teal-500 focus:border-teal-500 transition">
            <option>Semua</option>
            <option>Aktif</option>
            <option>Tidak Aktif</option>
          </select>
        </div>
        <div>
          <label for="sort" class="text-sm font-semibold text-gray-600 mb-1 block">Urutkan</label>
          <select v-model="sortOrder" id="sort"
            class="w-full border-gray-300 rounded-lg py-2 px-3 focus:ring-teal-500 focus:border-teal-500 transition">
            <option>Terbaru</option>
            <option>Harga Terendah</option>
            <option>Harga Tertinggi</option>
            <option>Sisa Terbanyak</option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-16">
        <Icon icon="mdi:loading" class="animate-spin w-12 h-12 text-teal-500 mx-auto" />
        <p class="mt-4 text-gray-600">Memuat data penawaran...</p>
      </div>

      <div v-else-if="errorMessage" class="text-center py-16 bg-red-50 rounded-xl">
        <Icon icon="mdi:alert-circle-outline" class="w-12 h-12 text-red-500 mx-auto" />
        <p class="mt-4 font-semibold text-red-700">{{ errorMessage }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <div v-if="filteredAndSortedOffers.length > 0">
          <table class="w-full min-w-[800px]">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Gambar
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Nama
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Harga
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Sisa
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Waktu Berakhir
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="offer in filteredAndSortedOffers" :key="offer.id"
                class="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-colors">
                <td class="px-6 py-5">
                  <div
                    class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-lg font-bold text-sm shadow">
                    {{ offer.id }}
                  </div>
                </td>
                <td class="px-6 py-5">
                  <img :src="getImageUrl(offer.image_url)" alt="Gambar Penawaran"
                    class="w-16 h-16 object-cover rounded-lg shadow-md" />
                </td>
                <td class="px-6 py-5">
                  <div class="font-semibold text-gray-900">
                    {{ offer.title || "-" }}
                  </div>
                  <div class="text-sm text-gray-500 line-clamp-1">
                    {{ offer.description || "-" }}
                  </div>
                </td>
                <td class="px-6 py-5">
                  <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold" :class="{
                    'bg-emerald-100 text-emerald-800':
                      offer.status === 'aktif',
                    'bg-red-100 text-red-800': offer.status !== 'aktif',
                  }">
                    <div class="w-2 h-2 rounded-full mr-2" :class="{
                      'bg-emerald-500': offer.status === 'aktif',
                      'bg-red-500': offer.status !== 'aktif',
                    }"></div>
                    {{ offer.status === "aktif" ? "Aktif" : "Tidak Aktif" }}
                  </span>
                </td>
                <td class="px-6 py-5">
                  <div class="font-bold text-gray-900">
                    {{ formatCurrency(offer.price) }}
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-700">{{ offer.remaining_portion || 0 }}/{{
                      offer.total_portion || 0
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="flex items-center">
                    <Icon icon="mdi:clock-outline" class="w-4 h-4 text-gray-400 mr-2" />
                    <span class="font-medium text-gray-900">{{
                      formatTime(offer.pickup_end)
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="flex items-center gap-3">
                    <button @click="openEditModal(offer)"
                      class="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-colors"
                      type="button">
                      <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
                    </button>
                    <!-- <button
                      @click="openDeleteModal(offer.id)"
                      class="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors"
                      type="button"
                    >
                      <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                    </button> -->
                    <button @click="openDeleteModal(offer)"
                      class="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors" type="button">
                      <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-16 px-6">
          <Icon icon="mdi:database-search-outline" class="mx-auto w-12 h-12 text-gray-400" />
          <h4 class="mt-4 text-lg font-semibold text-gray-700">
            Penawaran Tidak Ditemukan
          </h4>
          <p class="mt-1 text-gray-500">
            Coba ubah kata kunci pencarian atau filter status Anda.
          </p>
        </div>
      </div>
    </div>

    <EditOfferModal v-if="isEditModalOpen" v-model="isEditModalOpen" :offer="editingOffer" @save="handleUpdateOffer" />
    <AddOfferModal v-if="isAddModalOpen" v-model="isAddModalOpen" @save="handleAddOffer" />
    <DeleteConfirmModal v-if="isDeleteModalOpen" v-model="isDeleteModalOpen" @confirm="handleDeleteOffer" />
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out forwards;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
