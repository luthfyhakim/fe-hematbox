<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import EditOfferModal from "@/components/EditOfferModal.vue";
import AddOfferModal from "@/components/AddOfferModal.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import {
  searchQuery as globalSearchQuery,
  setSearchQuery,
} from "@/store/searchStore.js";
import offerService from "@/services/offerService.js";
import businessService from "@/services/businessService.js"; // <-- TAMBAHKAN BARIS INI

// --- TAMBAHAN UNTUK GAMBAR ---
// Ganti dengan alamat backend Go Anda jika berbeda
const API_BASE_URL = "http://localhost:8080";

const getImageUrl = (path) => {
  if (!path) {
    // Gambar placeholder jika penawaran tidak punya gambar
    return "https://via.placeholder.com/150";
  }
  // Gabungkan alamat dasar dengan path gambar dari database
  return `${API_BASE_URL}/${path}`;
};
// --- AKHIR TAMBAHAN ---

// --- State untuk data, filter, dan loading ---
const offers = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);
const businessId = ref(null); // <-- TAMBAHKAN BARIS INI

const searchQuery = ref("");
const statusFilter = ref("Semua");
const sortOrder = ref("Terbaru");

// --- Helper Functions ---
const formatCurrency = (value) => {
  if (!value) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// const formatTime = (dateString) => {
//   if (!dateString) return "-";
//   try {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString("id-ID", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch (e) {
//     return "-";
//   }
// };
// KODE BARU YANG BENAR
const formatDateAndTime = (isoString) => {
  if (!isoString) return "-";
  const date = new Date(isoString);

  // Format Tanggal: HH/BB/TT (Hari/Bulan/Tahun)
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2); // Ambil 2 digit terakhir tahun

  // Format Waktu: JJ.MM (Jam.Menit)
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Gabungkan dalam dua baris, gunakan string yang bisa di-render dengan v-html
  return `${day}/${month}/${year}<br>${hours}.${minutes}`;
};

// --- Logika Pengambilan Data dari API ---
const fetchOffers = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    // const response = await offerService.getOffers();
    // GANTI DENGAN PANGGILAN BARU INI
    const response = await businessService.getMyBusinessOffers();
    // PERBAIKAN KECIL: Langsung ambil dari response.data jika strukturnya flat
    const data = response?.data;
    offers.value = Array.isArray(data) ? data : [];

    // --- TAMBAHAN LOGIKA ---
    // Jika ada penawaran, simpan business_id dari penawaran pertama.
    // Kita asumsikan semua penawaran di sini milik bisnis yang sama.
    // if (offers.value.length > 0 && offers.value[0].business_id) {
    //   businessId.value = offers.value[0].business_id;
    //   console.log("Business ID tersimpan:", businessId.value);
    // }
    // --- AKHIR TAMBAHAN ---
    console.log("Fetched offers:", offers.value.length);
  } catch (error) {
    console.error("Gagal mengambil data penawaran:", error);
    errorMessage.value = "Tidak dapat memuat data penawaran dari server.";
    offers.value = [];
  } finally {
    isLoading.value = false;
  }
};

// onMounted(async () => {
//   console.log("Component mounted");
//   await fetchOffers();

//   if (globalSearchQuery.value) {
//     searchQuery.value = globalSearchQuery.value;
//     setSearchQuery("");
//   }
// });
onMounted(async () => {
  console.log("Component mounted");
  try {
    // LANGKAH 1: Ambil data bisnis saat ini untuk mendapatkan ID-nya
    const businessResponse = await businessService.getMyBusiness(); // Kita asumsikan ada fungsi ini
    if (businessResponse.data && businessResponse.data.id) {
      businessId.value = businessResponse.data.id;
      console.log("Business ID berhasil didapatkan:", businessId.value);

      // LANGKAH 2: Setelah ID bisnis ada, baru ambil data penawarannya
      await fetchOffers();
    } else {
      throw new Error("ID Bisnis tidak ditemukan.");
    }

    // Logika untuk search query tetap di sini
    if (globalSearchQuery.value) {
      searchQuery.value = globalSearchQuery.value;
      setSearchQuery("");
    }
  } catch (error) {
    console.error("Gagal memuat data awal:", error);
    errorMessage.value = "Gagal memuat data bisnis. Silakan coba lagi.";
    isLoading.value = false;
  }
});

// --- Computed property dengan sorting yang aman (immutable) ---
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

// --- Logika untuk Modal ---
const isEditModalOpen = ref(false);
const editingOffer = ref(null);
const isAddModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const offerToDeleteId = ref(null);
// Ubah dari ref(null) menjadi objek
// const offerToDelete = ref({ offerId: null, businessId: null });

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
// const openDeleteModal = (offer) => {
//   offerToDelete.value = {
//     offerId: offer.id,
//     businessId: offer.business_id, // Ambil business_id dari objek offer
//   };
//   isDeleteModalOpen.value = true;
// };
// Sederhanakan fungsi ini untuk hanya menyimpan offer.id
const openDeleteModal = (offer) => {
  offerToDeleteId.value = offer.id; // <-- CUKUP SIMPAN ID PENAWARAN
  isDeleteModalOpen.value = true;
};

// --- Handler Functions ---
const handleAddOffer = async (formData) => {
  try {
    await offerService.createOffer(formData);
    isAddModalOpen.value = false;
    await fetchOffers(); // Muat ulang data setelah berhasil menambah
  } catch (error) {
    console.error("Gagal menambah penawaran:", error);
    alert("Gagal menambah penawaran. Pastikan semua data sudah benar.");
  }
};

const handleUpdateOffer = async ({ id, data }) => {
  try {
    await offerService.updateOffer(id, data);
    isEditModalOpen.value = false;
    editingOffer.value = null;
    await fetchOffers(); // Muat ulang data setelah berhasil update
  } catch (error) {
    console.error("Gagal memperbarui penawaran:", error);
    alert("Gagal memperbarui penawaran. Periksa kembali data Anda.");
  }
};

// const handleDeleteOffer = async () => {
//   try {
//     await offerService.deleteOffer(offerToDeleteId.value);
//     isDeleteModalOpen.value = false;
//     offerToDeleteId.value = null;
//     await fetchOffers(); // Muat ulang data setelah berhasil hapus
//   } catch (error) {
//     console.error("Gagal menghapus penawaran:", error);
//     alert("Gagal menghapus penawaran.");
//   }
// };
// KelolaPenawaranView.vue

// const handleDeleteOffer = async () => {
//   // Pastikan ada data yang akan dihapus
//   if (!offerToDelete.value.offerId || !offerToDelete.value.businessId) {
//     alert("Gagal mendapatkan ID untuk menghapus.");
//     return;
//   }

//   try {
//     // GUNAKAN 'offerToDelete', bukan 'offerToDeleteId'
//     await offerService.deleteOffer(
//       offerToDelete.value.businessId,
//       offerToDelete.value.offerId
//     );

//     isDeleteModalOpen.value = false;
//     // Reset state ke nilai awal
//     offerToDelete.value = { offerId: null, businessId: null };
//     await fetchOffers();
//   } catch (error) {
//     console.error("Gagal menghapus penawaran:", error);
//     alert(
//       "Gagal menghapus penawaran. Mungkin karena masih ada reservasi aktif."
//     );
//   }
// };
const handleDeleteOffer = async () => {
  // Validasi menggunakan state yang sudah diperbarui
  if (!offerToDeleteId.value || !businessId.value) {
    alert("Gagal mendapatkan ID Bisnis atau ID Penawaran untuk menghapus.");
    return;
  }

  try {
    // Panggil service dengan dua ID yang sudah kita siapkan
    await offerService.deleteOffer(businessId.value, offerToDeleteId.value);

    isDeleteModalOpen.value = false;
    offerToDeleteId.value = null; // Reset state
    await fetchOffers(); // Muat ulang data
  } catch (error) {
    console.error("Gagal menghapus penawaran:", error);
    alert(
      "Gagal menghapus penawaran. Mungkin karena masih ada reservasi aktif."
    );
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6"
  >
    <div
      class="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20"
    >
      <div
        class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6"
      >
        <div>
          <h3 class="text-2xl font-bold text-gray-800 mb-1">
            Kelola Penawaran
          </h3>
          <p class="text-gray-600">Manajemen semua penawaran magic box Anda.</p>
        </div>
        <button
          @click="isAddModalOpen = true"
          class="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Icon icon="mdi:plus" class="w-5 h-5" />
          <span>Tambah Penawaran</span>
        </button>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50"
      >
        <div class="relative">
          <label
            for="search"
            class="text-sm font-semibold text-gray-600 mb-1 block"
            >Pencarian</label
          >
          <Icon
            icon="mdi:magnify"
            class="w-5 h-5 text-gray-400 absolute top-10 left-3"
          />
          <input
            v-model="searchQuery"
            type="text"
            id="search"
            placeholder="Cari nama penawaran..."
            class="w-full border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>
        <div>
          <label
            for="status"
            class="text-sm font-semibold text-gray-600 mb-1 block"
            >Status</label
          >
          <select
            v-model="statusFilter"
            id="status"
            class="w-full border-gray-300 rounded-lg py-2 px-3 focus:ring-teal-500 focus:border-teal-500 transition"
          >
            <option>Semua</option>
            <option>Aktif</option>
            <option>Tidak Aktif</option>
          </select>
        </div>
        <div>
          <label
            for="sort"
            class="text-sm font-semibold text-gray-600 mb-1 block"
            >Urutkan</label
          >
          <select
            v-model="sortOrder"
            id="sort"
            class="w-full border-gray-300 rounded-lg py-2 px-3 focus:ring-teal-500 focus:border-teal-500 transition"
          >
            <option>Terbaru</option>
            <option>Harga Terendah</option>
            <option>Harga Tertinggi</option>
            <option>Sisa Terbanyak</option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-16">
        <Icon
          icon="mdi:loading"
          class="animate-spin w-12 h-12 text-teal-500 mx-auto"
        />
        <p class="mt-4 text-gray-600">Memuat data penawaran...</p>
      </div>
      <div
        v-else-if="errorMessage"
        class="text-center py-16 bg-red-50 rounded-xl"
      >
        <Icon
          icon="mdi:alert-circle-outline"
          class="w-12 h-12 text-red-500 mx-auto"
        />
        <p class="mt-4 font-semibold text-red-700">{{ errorMessage }}</p>
      </div>

      <div v-else class="overflow-x-auto rounded-2xl border border-gray-200/50">
        <div v-if="filteredAndSortedOffers.length > 0">
          <table class="w-full min-w-[800px]">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Gambar
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Nama
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Harga
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Sisa
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Waktu Berakhir
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="offer in filteredAndSortedOffers"
                :key="offer.id"
                class="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-colors"
              >
                <td class="px-6 py-5">
                  <div
                    class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-lg font-bold text-sm shadow"
                  >
                    {{ offer.id }}
                  </div>
                </td>

                <td class="px-6 py-5">
                  <img
                    :src="getImageUrl(offer.image_url)"
                    alt="Gambar Penawaran"
                    class="w-16 h-16 object-cover rounded-lg shadow-md"
                  />
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
                  <span
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold"
                    :class="{
                      'bg-emerald-100 text-emerald-800':
                        offer.status === 'aktif',
                      'bg-red-100 text-red-800': offer.status !== 'aktif',
                    }"
                  >
                    <div
                      class="w-2 h-2 rounded-full mr-2"
                      :class="{
                        'bg-emerald-500': offer.status === 'aktif',
                        'bg-red-500': offer.status !== 'aktif',
                      }"
                    ></div>
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
                    <span class="text-sm font-medium text-gray-700"
                      >{{ offer.remaining_portion || 0 }}/{{
                        offer.total_portion || 0
                      }}</span
                    >
                  </div>
                </td>
                <!-- <td class="px-6 py-5">
                  <div class="flex items-center">
                    <Icon
                      icon="mdi:clock-outline"
                      class="w-4 h-4 text-gray-400 mr-2"
                    />
                    <span class="font-medium text-gray-900">{{
                      formatTime(offer.pickup_end)
                    }}</span>
                  </div>
                </td> -->
                <td class="px-6 py-5">
                  <div class="flex items-center">
                    <Icon
                      icon="mdi:clock-outline"
                      class="w-4 h-4 text-gray-400 mr-2"
                    />
                    <span
                      class="font-medium text-gray-900 leading-tight"
                      v-html="formatDateAndTime(offer.pickup_end)"
                    >
                    </span>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="flex items-center gap-3">
                    <button
                      @click="openEditModal(offer)"
                      class="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-colors"
                      type="button"
                    >
                      <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
                    </button>
                    <!-- <button
                      @click="openDeleteModal(offer.id)"
                      class="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors"
                      type="button"
                    >
                      <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                    </button> -->
                    <button
                      @click="openDeleteModal(offer)"
                      class="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors"
                      type="button"
                    >
                      <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-16 px-6">
          <Icon
            icon="mdi:database-search-outline"
            class="mx-auto w-12 h-12 text-gray-400"
          />
          <h4 class="mt-4 text-lg font-semibold text-gray-700">
            Penawaran Tidak Ditemukan
          </h4>
          <p class="mt-1 text-gray-500">
            Coba ubah kata kunci pencarian atau filter status Anda.
          </p>
        </div>
      </div>
    </div>

    <EditOfferModal
      v-if="isEditModalOpen"
      v-model="isEditModalOpen"
      :offer="editingOffer"
      @save="handleUpdateOffer"
    />
    <AddOfferModal
      v-if="isAddModalOpen"
      v-model="isAddModalOpen"
      @save="handleAddOffer"
    />
    <DeleteConfirmModal
      v-if="isDeleteModalOpen"
      v-model="isDeleteModalOpen"
      @confirm="handleDeleteOffer"
    />
  </div>
</template>
