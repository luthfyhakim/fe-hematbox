<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import businessService from "@/services/businessService.js";
import reservationService from "@/services/reservationService.js"; // <-- 1. IMPORT SERVICE BARU

// --- State Management ---
const reservations = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

// --- State untuk Modal Edit ---
const isEditModalOpen = ref(false);
const editingReservation = ref(null); // Untuk menyimpan data yang akan diedit

// --- Filter dan Sortir State ---
const statusFilter = ref("Semua");
const sortOrder = ref("Terbaru");

// --- API Logic ---
const fetchReservations = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    const response = await businessService.getMyBusinessReservations();
    reservations.value = response.data || [];
  } catch (error) {
    console.error("Gagal mengambil data reservasi:", error);
    errorMessage.value = "Tidak dapat memuat data pembelian dari server.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchReservations();
});

// --- Computed Property (tidak berubah) ---
const filteredAndSortedReservations = computed(() => {
  let processedData = [...reservations.value];
  if (statusFilter.value !== "Semua") {
    processedData = processedData.filter(
      (r) => r.status.toLowerCase() === statusFilter.value.toLowerCase()
    );
  }
  processedData.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder.value === "Terbaru" ? dateB - dateA : dateA - dateB;
  });
  return processedData;
});

// --- Helper Functions (tidak berubah) ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// --- Fungsi untuk Modal ---
const openEditModal = (reservation) => {
  // Buat salinan data agar perubahan di form tidak langsung mengubah data di tabel
  editingReservation.value = JSON.parse(JSON.stringify(reservation));
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingReservation.value = null;
};

// --- Action Handlers BARU ---
const handleSaveChanges = async () => {
  if (!editingReservation.value) return;

  const { id, status, transaction } = editingReservation.value;

  // Siapkan data yang akan dikirim ke API
  const payload = {
    status: status,
    payment_status: transaction.payment_status,
  };

  try {
    await reservationService.updateReservation(id, payload);
    closeEditModal();
    fetchReservations(); // Muat ulang data untuk melihat perubahan
    alert("Perubahan berhasil disimpan!");
  } catch (error) {
    console.error("Gagal mengupdate reservasi:", error);
    alert("Gagal menyimpan perubahan.");
  }
};

const handleDelete = async (id) => {
  // Selalu minta konfirmasi sebelum melakukan aksi hapus!
  if (
    confirm(
      "Apakah Anda yakin ingin menghapus pembelian ini? Aksi ini tidak dapat dibatalkan."
    )
  ) {
    try {
      await reservationService.deleteReservation(id);
      fetchReservations(); // Muat ulang data
      alert("Pembelian berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus reservasi:", error);
      alert("Gagal menghapus pembelian.");
    }
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
      <!-- Header dan Filter (tidak berubah) -->
      <div
        class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6"
      >
        <div>
          <h3 class="text-2xl font-bold text-gray-800 mb-1">
            Kelola Pembelian
          </h3>
          <p class="text-gray-600">
            Manajemen semua reservasi yang masuk dari pelanggan.
          </p>
        </div>
      </div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50"
      >
        <div>
          <label
            for="status"
            class="text-sm font-semibold text-gray-600 mb-1 block"
            >Filter Status</label
          >
          <select
            v-model="statusFilter"
            id="status"
            class="w-full border-gray-300 rounded-lg py-2 px-3 focus:ring-teal-500 focus:border-teal-500 transition"
          >
            <option>Semua</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
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
            <option>Terlama</option>
          </select>
        </div>
      </div>

      <!-- State Loading -->
      <div v-if="isLoading" class="text-center py-16">
        <Icon
          icon="mdi:loading"
          class="animate-spin w-12 h-12 text-teal-500 mx-auto"
        />
        <p class="mt-4 text-gray-600">Memuat data pembelian...</p>
      </div>

      <!-- State Error -->
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

      <!-- Tampilan Data -->
      <div v-else class="overflow-x-auto rounded-2xl border border-gray-200/50">
        <div v-if="filteredAndSortedReservations.length > 0">
          <table class="w-full min-w-[1200px]">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase"
                >
                  Pembeli
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase"
                >
                  Penawaran
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase"
                >
                  Total Harga
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase"
                >
                  Tanggal Pesan
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase"
                >
                  Status Bayar
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase"
                >
                  Metode Bayar
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase"
                >
                  Kode Invoice
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase"
                >
                  Status Pesanan
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="reservation in filteredAndSortedReservations"
                :key="reservation.id"
                class="hover:bg-teal-50/50 transition-colors"
              >
                <td class="px-6 py-5">
                  <div class="font-semibold text-gray-900">
                    {{ reservation.user.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ reservation.user.email }}
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="font-semibold text-gray-900">
                    {{ reservation.offer.title }}
                  </div>
                  <div class="text-sm text-gray-500">
                    x{{ reservation.quantity }} porsi
                  </div>
                </td>
                <td class="px-6 py-5 font-bold text-gray-800">
                  {{
                    formatCurrency(
                      reservation.offer.price * reservation.quantity
                    )
                  }}
                </td>
                <td class="px-6 py-5 text-sm text-gray-600">
                  {{ formatDateTime(reservation.created_at) }}
                </td>
                <td class="px-6 py-5">
                  <span
                    v-if="reservation.transaction"
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold capitalize"
                    :class="{
                      'bg-green-100 text-green-800': [
                        'Sudah Bayar',
                        'Lunas',
                      ].includes(reservation.transaction.payment_status),
                      'bg-yellow-100 text-yellow-800':
                        reservation.transaction.payment_status === 'pending',
                      'bg-red-100 text-red-800': [
                        'Kadaluwarsa',
                        'cancelled',
                        'Gagal',
                      ].includes(reservation.transaction.payment_status),
                    }"
                  >
                    {{ reservation.transaction.payment_status }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-5 text-sm text-gray-600 capitalize">
                  {{
                    reservation.transaction
                      ? reservation.transaction.payment_method.replace(
                          /_/g,
                          " "
                        )
                      : "-"
                  }}
                </td>
                <td class="px-6 py-5 text-sm font-mono text-gray-700">
                  {{
                    reservation.transaction
                      ? reservation.transaction.invoice_code
                      : "-"
                  }}
                </td>
                <td class="px-6 py-5">
                  <span
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold capitalize"
                    :class="{
                      'bg-yellow-100 text-yellow-800':
                        reservation.status === 'pending',
                      'bg-green-100 text-green-800':
                        reservation.status === 'confirmed',
                      'bg-blue-100 text-blue-800':
                        reservation.status === 'completed',
                      'bg-red-100 text-red-800':
                        reservation.status === 'cancelled',
                    }"
                  >
                    {{ reservation.status }}
                  </span>
                </td>

                <!-- ▼▼▼ 2. GANTI KOLOM AKSI LAMA DENGAN INI ▼▼▼ -->
                <td class="px-6 py-5">
                  <div class="flex items-center gap-2">
                    <button
                      @click="openEditModal(reservation)"
                      title="Edit Pembelian"
                      class="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                    >
                      <Icon icon="mdi:pencil" class="w-4 h-4" />
                    </button>
                    <button
                      @click="handleDelete(reservation.id)"
                      title="Hapus Pembelian"
                      class="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <Icon icon="mdi:delete" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <!-- ▲▲▲ PERBAIKAN SELESAI ▲▲▲ -->
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pesan jika tidak ada data -->
        <div v-else class="text-center py-16 px-6">
          <Icon
            icon="mdi:database-search-outline"
            class="mx-auto w-12 h-12 text-gray-400"
          />
          <h4 class="mt-4 text-lg font-semibold text-gray-700">
            Pembelian Tidak Ditemukan
          </h4>
          <p class="mt-1 text-gray-500">
            Coba ubah filter status Anda atau tunggu pesanan baru masuk.
          </p>
        </div>
      </div>
    </div>

    <!-- ▼▼▼ 3. TAMBAHKAN MODAL EDIT DI SINI ▼▼▼ -->
    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-95"
        :class="{ 'scale-100': isEditModalOpen }"
      >
        <!-- Modal Header -->
        <div class="p-6 border-b flex justify-between items-center">
          <div>
            <h4 class="text-xl font-bold text-gray-800">Edit Pembelian</h4>
            <p
              v-if="editingReservation?.transaction"
              class="text-sm text-gray-500 font-mono"
            >
              Invoice: {{ editingReservation.transaction.invoice_code }}
            </p>
          </div>
          <button
            @click="closeEditModal"
            class="p-2 rounded-full hover:bg-gray-100"
          >
            <Icon icon="mdi:close" class="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <!-- Modal Body/Form -->
        <div v-if="editingReservation" class="p-6 space-y-4">
          <div>
            <label
              for="order-status"
              class="text-sm font-semibold text-gray-600 mb-1 block"
              >Status Pesanan</label
            >
            <select
              v-model="editingReservation.status"
              id="order-status"
              class="w-full border-gray-300 rounded-lg py-2 px-3 focus:ring-teal-500 focus:border-teal-500 transition capitalize"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div v-if="editingReservation.transaction">
            <label
              for="payment-status"
              class="text-sm font-semibold text-gray-600 mb-1 block"
              >Status Bayar</label
            >
            <select
              v-model="editingReservation.transaction.payment_status"
              id="payment-status"
              class="w-full border-gray-300 rounded-lg py-2 px-3 focus:ring-teal-500 focus:border-teal-500 transition capitalize"
            >
              <option value="pending">Pending</option>
              <option value="Sudah Bayar">Sudah Bayar</option>
              <option value="Lunas">Lunas</option>
              <option value="Gagal">Gagal</option>
              <option value="Kadaluwarsa">Kadaluwarsa</option>
            </select>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            @click="closeEditModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button
            @click="handleSaveChanges"
            class="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
    <!-- ▲▲▲ AKHIR DARI MODAL EDIT ▲▲▲ -->
  </div>
</template>
