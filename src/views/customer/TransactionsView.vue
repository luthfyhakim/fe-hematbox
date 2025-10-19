<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

// --- DATA CONTOH ---
// Di aplikasi nyata, data ini akan diambil dari API
const transactions = ref([
  {
    id: "HB-XYZ123",
    date: "2025-10-08T10:30:00Z",
    status: "Selesai",
    total: 27000,
    items: [{ name: "Burger Keju Super", quantity: 1 }],
  },
  {
    id: "HB-ABC456",
    date: "2025-10-07T18:15:00Z",
    status: "Selesai",
    total: 47000,
    items: [{ name: "Pastry Mix Box Premium", quantity: 1 }],
  },
  {
    id: "HB-DEF789",
    date: "2025-10-05T12:00:00Z",
    status: "Dibatalkan",
    total: 20000,
    items: [{ name: "Kopi Senja Signature", quantity: 1 }],
  },
]);

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getStatusClass = (status) => {
  if (status === "Selesai") return "bg-emerald-100 text-emerald-700";
  if (status === "Dibatalkan") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen font-sans">
    <div class="container mx-auto px-4 sm:px-6 py-8 md:py-12">
      <!-- HEADER -->
      <div class="mb-8">
        <h1
          class="text-4xl md:text-5xl font-bold text-gray-800 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
        >
          Riwayat Transaksi
        </h1>
        <p class="text-gray-600 mt-2 text-lg">
          Lihat semua pesanan yang pernah Anda buat.
        </p>
      </div>

      <!-- DAFTAR TRANSAKSI -->
      <div
        class="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
      >
        <div v-if="transactions.length > 0" class="space-y-4">
          <router-link
            v-for="trx in transactions"
            :key="trx.id"
            :to="{ name: 'invoice', params: { transactionId: trx.id } }"
            class="block p-5 border-2 rounded-2xl transition-all duration-300 group"
            :class="
              trx.status === 'Selesai'
                ? 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50'
                : 'border-gray-200 bg-gray-50 opacity-70 hover:opacity-100'
            "
          >
            <div
              class="flex flex-col sm:flex-row justify-between sm:items-center gap-4"
            >
              <!-- Info Kiri -->
              <div class="flex-grow">
                <div class="flex items-center gap-3 mb-2">
                  <span
                    :class="getStatusClass(trx.status)"
                    class="px-3 py-1 rounded-full text-xs font-bold"
                    >{{ trx.status }}</span
                  >
                  <p class="font-mono text-sm text-gray-700">{{ trx.id }}</p>
                </div>
                <p class="font-bold text-lg text-gray-800">
                  {{ trx.items[0].name }}
                  <span
                    v-if="trx.items.length > 1"
                    class="font-medium text-gray-500"
                    >+ {{ trx.items.length - 1 }} lainnya</span
                  >
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ formatDate(trx.date) }}
                </p>
              </div>

              <!-- Info Kanan -->
              <div
                class="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-0 sm:text-right"
              >
                <p class="text-xl font-black text-emerald-600">
                  {{ formatCurrency(trx.total) }}
                </p>
                <div
                  class="flex items-center gap-1 text-emerald-600 group-hover:translate-x-1 transition-transform"
                >
                  <span class="text-sm font-semibold">Lihat Detail</span>
                  <Icon icon="mdi:arrow-right" class="w-5 h-5" />
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <div v-else class="text-center py-16">
          <Icon icon="mdi:cart-off" class="w-16 h-16 text-gray-300 mx-auto" />
          <h3 class="mt-4 text-xl font-bold text-gray-700">
            Belum Ada Transaksi
          </h3>
          <p class="mt-2 text-gray-500">
            Mulai belanja sekarang untuk melihat riwayat transaksimu di sini!
          </p>
          <router-link
            to="/smart-shopping"
            class="mt-6 inline-block bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Mulai Belanja
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
