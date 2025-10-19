<!-- <script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

// --- DATA CONTOH ---
const allOffers = ref([
  {
    id: 1,
    name: "Burger Keju Super",
    storeName: "Burger Bang",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    distance: 2,
    stock: 5,
    price: 25000,
    rating: 4.5,
    discount: 40,
    originalPrice: 42000,
    description: "Burger keju klasik...",
    lat: -6.9023,
    lon: 107.6182,
  },
  // ... data produk lainnya
]);

const paymentMethods = ref([
  {
    id: "gopay",
    name: "GoPay",
    icon: "simple-icons:gopay",
    description: "Bayar dengan saldo GoPay Anda.",
  },
  {
    id: "dana",
    name: "DANA",
    icon: "simple-icons:dana",
    description: "Gunakan saldo DANA untuk transaksi.",
  },
  {
    id: "ovo",
    name: "OVO",
    icon: "simple-icons:ovo",
    description: "Pembayaran mudah dengan OVO Cash.",
  },
  {
    id: "cod",
    name: "Bayar di Tempat",
    icon: "mdi:cash-multiple",
    description: "Siapkan uang pas saat mengambil pesanan.",
  },
]);

const route = useRoute();
const router = useRouter();
const offer = ref(null);
const quantity = ref(1);
const selectedPayment = ref("gopay");
const voucherCode = ref("");

onMounted(() => {
  const offerId = parseInt(route.params.id);
  // Ambil kuantitas dari query URL, jika tidak ada, default-nya 1
  quantity.value = parseInt(route.query.qty) || 1;

  const foundOffer = allOffers.value.find((o) => o.id === offerId);
  if (foundOffer) {
    offer.value = foundOffer;
  } else {
    router.push({ name: "smart-shopping" });
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const subtotal = computed(() =>
  offer.value ? offer.value.price * quantity.value : 0
);
const adminFee = ref(2000);
const total = computed(() => subtotal.value + adminFee.value);

const handlePayment = () => {
  alert(
    `Pembayaran sebesar ${formatCurrency(total.value)} dengan metode ${
      selectedPayment.value
    } sedang diproses!`
  );
  // Di aplikasi nyata, Anda akan mengirim data ini ke backend
  // lalu mengarahkan ke halaman status pesanan.
  router.push({ name: "customer-orders" }); // Contoh redirect ke halaman pesanan
};
</script> -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import offerService from "@/services/offerService.js";
import transactionService from "@/services/transactionService.js";

const route = useRoute();
const router = useRouter();

// --- STATE DINAMIS ---
const offer = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);
const quantity = ref(1);
const selectedPayment = ref("cod"); // Default ke 'Bayar di Tempat'
const isPaying = ref(false); // State untuk loading tombol bayar

// Data statis untuk metode pembayaran
const paymentMethods = ref([
  {
    id: "gopay",
    name: "GoPay",
    icon: "simple-icons:gopay",
    description: "Bayar dengan saldo GoPay Anda.",
  },
  {
    id: "dana",
    name: "DANA",
    icon: "simple-icons:dana",
    description: "Gunakan saldo DANA untuk transaksi.",
  },
  {
    id: "ovo",
    name: "OVO",
    icon: "simple-icons:ovo",
    description: "Pembayaran mudah dengan OVO Cash.",
  },
  {
    id: "cash_on_pickup",
    name: "Bayar di Tempat",
    icon: "mdi:cash-multiple",
    description: "Siapkan uang pas saat mengambil pesanan.",
  },
]);

// --- MENGAMBIL DATA DARI API ---
onMounted(async () => {
  const offerId = route.params.id;
  if (!offerId) {
    errorMessage.value = "ID Penawaran tidak ditemukan.";
    isLoading.value = false;
    return;
  }

  try {
    const response = await offerService.getOfferById(offerId);
    offer.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data offer:", error);
    errorMessage.value = "Penawaran tidak dapat ditemukan.";
  } finally {
    isLoading.value = false;
  }
});

// --- HELPER & COMPUTED ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const subtotal = computed(() =>
  offer.value ? offer.value.price * quantity.value : 0
);
const adminFee = ref(2000);
const total = computed(() => subtotal.value + adminFee.value);

// --- LOGIKA PEMBAYARAN ---
const handlePayment = async () => {
  if (!selectedPayment.value) {
    alert("Silakan pilih metode pembayaran.");
    return;
  }
  isPaying.value = true;
  errorMessage.value = null;

  const payload = {
    offer_id: offer.value.id,
    quantity: quantity.value,
    payment_method: selectedPayment.value,
  };

  try {
    const response = await transactionService.createCheckout(payload);
    const invoiceCode = response.data.invoice_code;
    // Arahkan ke halaman invoice setelah berhasil
    router.push({ name: "invoice", params: { transactionId: invoiceCode } });
  } catch (error) {
    console.error("Pembayaran Gagal:", error);
    errorMessage.value =
      "Maaf, terjadi kesalahan saat memproses pembayaran Anda.";
  } finally {
    isPaying.value = false;
  }
};

// --- KONFIGURASI GAMBAR ---
const API_BASE_URL = "https://hematbox.sugengaldi.my.id";
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"; // Gambar default
  }
  return `${API_BASE_URL}/${imagePath.replace(/\\/g, "/")}`;
};
</script>

<template>
  <div v-if="offer" class="bg-gray-50 min-h-screen font-sans">
    <div class="container mx-auto px-4 sm:px-6 py-8 md:py-12">
      <!-- BREADCRUMB -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <router-link :to="{ name: 'smart-shopping' }"
          class="hover:underline hover:text-emerald-600">Penawaran</router-link>
        <Icon icon="mdi:chevron-right" class="w-4 h-4" />
        <router-link :to="{ name: 'offer-detail', params: { id: offer.id } }"
          class="hover:underline hover:text-emerald-600">{{ offer.name }}</router-link>
        <Icon icon="mdi:chevron-right" class="w-4 h-4" />
        <span class="font-medium text-gray-700">Pembayaran</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- KOLOM KIRI: Opsi Pembayaran & Detail -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Pilihan Metode Pembayaran -->
          <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">
              Pilih Metode Pembayaran
            </h2>
            <div class="space-y-4">
              <div v-for="method in paymentMethods" :key="method.id" @click="selectedPayment = method.id"
                class="p-5 border-2 rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-300"
                :class="selectedPayment === method.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-gray-200 hover:border-emerald-300'
                  ">
                <Icon :icon="method.icon" class="w-8 h-8 text-emerald-600" />
                <div>
                  <p class="font-bold text-gray-800">{{ method.name }}</p>
                  <p class="text-sm text-gray-500">{{ method.description }}</p>
                </div>
                <div class="ml-auto w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all"
                  :class="selectedPayment === method.id
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-gray-300'
                    ">
                  <Icon v-if="selectedPayment === method.id" icon="mdi:check-bold" class="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          <!-- Voucher & Promo -->
          <!-- <div
            class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
          >
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
              Punya Kode Promo?
            </h2>
            <div class="flex gap-4">
              <input
                type="text"
                v-model="voucherCode"
                placeholder="Masukkan kode voucher"
                class="w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-transparent focus:border-emerald-500 focus:ring-0 transition-colors"
              />
              <button
                class="bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Terapkan
              </button>
            </div>
          </div> -->
        </div>

        <!-- KOLOM KANAN: Ringkasan Pesanan (Sticky) -->
        <div class="lg:sticky lg:top-6 self-start">
          <div class="bg-white rounded-3xl shadow-2xl p-8 border-2 border-emerald-200 space-y-4">
            <h2 class="text-2xl font-bold text-gray-800 text-center mb-4">
              Ringkasan Pesanan
            </h2>

            <!-- Detail Item -->
            <div class="flex gap-4 pb-4 border-b">
              <img :src="getImageUrl(offer.image_url)" :alt="offer.title"
                class="w-24 h-24 rounded-2xl object-cover shadow-md" />
              <div>
                <p class="font-bold text-lg text-gray-800">{{ offer.title }}</p>
                <p class="text-sm text-gray-500">
                  {{ offer.business.business_name }}
                </p>
                <p class="text-lg font-black text-gray-900 mt-1">
                  {{ formatCurrency(offer.price) }}
                  <span class="text-sm font-medium text-gray-600">x {{ quantity }}</span>
                </p>
              </div>
            </div>

            <!-- Rincian Harga -->
            <div class="space-y-2 pb-4 border-b">
              <div class="flex justify-between">
                <p class="text-gray-600">Subtotal</p>
                <p class="font-semibold text-gray-800">
                  {{ formatCurrency(subtotal) }}
                </p>
              </div>
              <div class="flex justify-between">
                <p class="text-gray-600">Biaya Layanan</p>
                <p class="font-semibold text-gray-800">
                  {{ formatCurrency(adminFee) }}
                </p>
              </div>
            </div>

            <!-- Total Harga -->
            <div class="flex justify-between items-center">
              <p class="text-lg font-bold text-gray-900">Total Pembayaran</p>
              <p class="text-2xl font-black text-emerald-600">
                {{ formatCurrency(total) }}
              </p>
            </div>

            <!-- Tombol Bayar -->
            <button @click="handlePayment"
              class="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
              <Icon icon="mdi:shield-check-outline" class="w-6 h-6" />
              <span>Bayar Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
