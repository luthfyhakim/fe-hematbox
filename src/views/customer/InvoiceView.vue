<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import transactionService from "@/services/transactionService.js"; // <-- Import service

// --- STATE DINAMIS ---
const route = useRoute();
const router = useRouter();
const transactionDetails = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);

// --- MENGAMBIL DATA DARI API ---
onMounted(async () => {
  const transactionId = route.params.transactionId;
  if (!transactionId) {
    router.push({ name: "customer-transactions" });
    return;
  }

  try {
    const response = await transactionService.getTransactionByInvoiceCode(
      transactionId
    );
    transactionDetails.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil detail transaksi:", error);
    errorMessage.value = "Transaksi tidak ditemukan atau terjadi kesalahan.";
  } finally {
    isLoading.value = false;
  }
});

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
  if (value === null || isNaN(value)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (timestamp) => {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getPaymentMethodDetails = (methodId) => {
  const methods = {
    cash_on_pickup: { name: "Bayar di Tempat", icon: "mdi:cash-multiple" },
    gopay: { name: "GoPay", icon: "simple-icons:gopay" },
    dana: { name: "DANA", icon: "simple-icons:dana" },
    ovo: { name: "OVO", icon: "simple-icons:ovo" },
  };
  return methods[methodId] || { name: methodId, icon: "mdi:credit-card" };
};

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
  }
  return `http://localhost:8080/${imagePath.replace(/\\/g, "/")}`;
};
</script>
<template>
  <div class="bg-gray-50 min-h-screen font-sans py-12 px-4 sm:px-6">
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <Icon
        icon="mdi:loading"
        class="w-12 h-12 text-emerald-500 animate-spin"
      />
    </div>

    <div v-else-if="errorMessage" class="max-w-2xl mx-auto text-center">
      <Icon
        icon="mdi:alert-circle-outline"
        class="w-16 h-16 text-red-500 mx-auto"
      />
      <h1 class="text-2xl font-bold text-red-700 mt-4">Gagal Memuat Data</h1>
      <p class="text-gray-600 mt-2">{{ errorMessage }}</p>
      <button
        @click="router.back()"
        class="mt-6 bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl"
      >
        Kembali
      </button>
    </div>

    <div v-else-if="transactionDetails" class="max-w-2xl mx-auto">
      <div class="bg-white rounded-3xl shadow-2xl border border-gray-100">
        <div class="p-8 text-center bg-emerald-600 rounded-t-3xl">
          <Icon
            icon="mdi:check-decagram"
            class="w-16 h-16 text-white mx-auto animate-bounce"
          />
          <h1 class="text-3xl font-bold text-white mt-4">Transaksi Berhasil</h1>
          <p class="text-emerald-100 mt-2">
            Terima kasih! Pesanan Anda telah dikonfirmasi.
          </p>
        </div>

        <div class="p-8 space-y-6">
          <div class="pb-6 border-b border-gray-200">
            <div class="flex justify-between items-center text-sm mb-4">
              <span class="text-gray-500">No. Invoice</span>
              <span class="font-mono font-bold text-gray-800">{{
                transactionDetails.invoice_code
              }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500">Tanggal Transaksi</span>
              <span class="font-semibold text-gray-800">{{
                formatDate(transactionDetails.created_at)
              }}</span>
            </div>
          </div>

          <div class="pb-6 border-b border-gray-200">
            <h2 class="font-bold text-lg mb-4 text-gray-800">Detail Pesanan</h2>
            <div
              class="flex gap-4"
              v-if="
                transactionDetails.reservation &&
                transactionDetails.reservation.offer
              "
            >
              <img
                :src="
                  getImageUrl(transactionDetails.reservation.offer.image_url)
                "
                :alt="transactionDetails.reservation.offer.title"
                class="w-24 h-24 rounded-2xl object-cover shadow-md"
              />
              <div>
                <p class="font-bold text-lg text-gray-800">
                  {{ transactionDetails.reservation.offer.title }}
                </p>
                <p class="text-sm text-gray-500">
                  {{
                    transactionDetails.reservation.offer.business.business_name
                  }}
                </p>
                <p class="text-lg font-black text-gray-900 mt-1">
                  {{
                    formatCurrency(transactionDetails.reservation.offer.price)
                  }}
                  <span class="text-sm font-medium text-gray-600"
                    >x {{ transactionDetails.reservation.quantity }}</span
                  >
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 class="font-bold text-lg mb-4 text-gray-800">
              Rincian Pembayaran
            </h2>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <p class="text-gray-600">Subtotal</p>
                <p class="font-semibold text-gray-800">
                  {{
                    formatCurrency(
                      transactionDetails.amount - transactionDetails.service_fee
                    )
                  }}
                </p>
              </div>
              <div class="flex justify-between">
                <p class="text-gray-600">Biaya Layanan</p>
                <p class="font-semibold text-gray-800">
                  {{ formatCurrency(transactionDetails.service_fee) }}
                </p>
              </div>
              <div
                class="flex justify-between font-bold text-lg border-t border-dashed pt-3 mt-3"
              >
                <p class="text-gray-900">Total Pembayaran</p>
                <p class="text-emerald-600">
                  {{ formatCurrency(transactionDetails.amount) }}
                </p>
              </div>
            </div>
            <div
              class="mt-6 flex items-center gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-200"
            >
              <Icon
                :icon="
                  getPaymentMethodDetails(transactionDetails.payment_method)
                    .icon
                "
                class="w-8 h-8 text-emerald-600"
              />
              <div>
                <p class="text-xs text-gray-600">Dibayar dengan</p>
                <p class="font-bold text-gray-800">
                  {{
                    getPaymentMethodDetails(transactionDetails.payment_method)
                      .name
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-15%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
