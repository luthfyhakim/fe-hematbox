<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import offerService from "@/services/offerService.js"; // <-- TAMBAHKAN INI

// --- DATA DARI DATABASE (Sesuai struktur database asli) ---
// const allOffers = ref([
//   // {
//   //   id: 7,
//   //   business_id: 2,
//   //   title: "Magic Box Nasi Goreng",
//   //   description: "Paket surplus makan malam hemat",
//   //   price: 15000.0,
//   //   total_portion: 20,
//   //   remaining_portion: 0,
//   //   pickup_start: "2025-09-25 17:00:00.000",
//   //   pickup_end: "2025-09-25 20:00:00.000",
//   //   created_at: "2025-09-23 13:56:21.526",
//   //   updated_at: "2025-09-27 15:28:32.534",
//   //   image_url: "uploads/offers/1758635781-download.jpeg",
//   //   status: "tidak_aktif",
//   // },
//   // {
//   //   id: 8,
//   //   business_id: 2,
//   //   title: "Magic Box Nasi Goreng",
//   //   description: "Paket surplus makan malam hemat",
//   //   price: 15000.0,
//   //   total_portion: 20,
//   //   remaining_portion: 20,
//   //   pickup_start: "2025-09-25 17:00:00.000",
//   //   pickup_end: "2025-09-25 20:00:00.000",
//   //   created_at: "2025-09-23 13:56:22.152",
//   //   updated_at: "2025-09-23 13:56:22.152",
//   //   image_url: "uploads/offers/1758635782-download.jpeg",
//   //   status: "aktif",
//   // },
//   // {
//   //   id: 9,
//   //   business_id: 2,
//   //   title: "Magic Box Nasi Goreng",
//   //   description: "Paket surplus makan malam hemat",
//   //   price: 15000.0,
//   //   total_portion: 20,
//   //   remaining_portion: 5,
//   //   pickup_start: "2025-09-25 17:00:00.000",
//   //   pickup_end: "2025-09-25 20:00:00.000",
//   //   created_at: "2025-09-23 14:54:44.650",
//   //   updated_at: "2025-09-28 05:53:08.616",
//   //   image_url: "",
//   //   status: "aktif",
//   // },
//   // {
//   //   id: 10,
//   //   business_id: 2,
//   //   title: "Magic Box Nasi Goreng",
//   //   description: "Paket surplus makan malam hemat",
//   //   price: 15000.0,
//   //   total_portion: 20,
//   //   remaining_portion: 20,
//   //   pickup_start: "2025-09-25 17:00:00.000",
//   //   pickup_end: "2025-09-25 20:00:00.000",
//   //   created_at: "2025-09-23 14:55:14.065",
//   //   updated_at: "2025-09-23 14:55:14.065",
//   //   image_url: "uploads/offers/1758639314-download.jpeg",
//   //   status: "aktif",
//   // },
//   // {
//   //   id: 11,
//   //   business_id: 2,
//   //   title: "Magic Box Nasi Goreng",
//   //   description: "Paket surplus makan malam hemat",
//   //   price: 15000.0,
//   //   total_portion: 20,
//   //   remaining_portion: 20,
//   //   pickup_start: "2025-09-25 17:00:00.000",
//   //   pickup_end: "2025-09-25 20:00:00.000",
//   //   created_at: "2025-09-23 16:29:01.572",
//   //   updated_at: "2025-09-23 16:29:01.572",
//   //   image_url: "uploads/offers/1758644941-download.jpeg",
//   //   status: "aktif",
//   // },
//   // Data dari SmartShoppingView (ID 1-6)
//   {
//     id: 1,
//     title: "Burger Keju Super",
//     description: "Burger keju klasik dengan daging premium dan saus spesial.",
//     price: 25000,
//     total_portion: 10,
//     remaining_portion: 5,
//     pickup_start: "2025-10-08 17:00:00",
//     pickup_end: "2025-10-08 20:00:00",
//     image_url:
//       "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
//     status: "aktif",
//   },
//   {
//     id: 2,
//     title: "Pastry Mix Box Premium",
//     description: "Kotak kejutan berisi aneka pastry lezat sisa hari ini.",
//     price: 45000,
//     total_portion: 15,
//     remaining_portion: 8,
//     pickup_start: "2025-10-08 17:00:00",
//     pickup_end: "2025-10-08 20:00:00",
//     image_url:
//       "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop",
//     status: "aktif",
//   },
//   {
//     id: 3,
//     title: "Kopi Senja Signature",
//     description: "Sisa Kopi susu gula aren signature kami hari ini.",
//     price: 18000,
//     total_portion: 20,
//     remaining_portion: 12,
//     pickup_start: "2025-10-08 17:00:00",
//     pickup_end: "2025-10-08 20:00:00",
//     image_url:
//       "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
//     status: "aktif",
//   },
//   {
//     id: 4,
//     title: "Nasi Goreng Spesial",
//     description: "Nasi goreng surplus dengan bumbu rahasia dan isian lengkap.",
//     price: 22000,
//     total_portion: 10,
//     remaining_portion: 4,
//     pickup_start: "2025-10-08 17:00:00",
//     pickup_end: "2025-10-08 20:00:00",
//     image_url:
//       "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
//     status: "aktif",
//   },
//   {
//     id: 5,
//     title: "Paket Sayuran Segar",
//     description:
//       "Kumpulan sayuran hidroponik segar yang tidak terjual hari ini.",
//     price: 35000,
//     total_portion: 12,
//     remaining_portion: 10,
//     pickup_start: "2025-10-08 17:00:00",
//     pickup_end: "2025-10-08 20:00:00",
//     image_url:
//       "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop",
//     status: "aktif",
//   },
//   {
//     id: 6,
//     title: "Burger Keju Super (Copy)",
//     description: "Burger keju klasik dengan daging premium dan saus spesial.",
//     price: 25000,
//     total_portion: 10,
//     remaining_portion: 5,
//     pickup_start: "2025-10-08 17:00:00",
//     pickup_end: "2025-10-08 20:00:00",
//     image_url:
//       "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
//     status: "aktif",
//   },

//   // Data asli dari OfferDetailView (ID 7-11)
//   {
//     id: 7,
//     business_id: 2,
//     title: "Magic Box Nasi Goreng",
//     description: "Paket surplus makan malam hemat",
//     price: 15000.0,
//     total_portion: 20,
//     remaining_portion: 0,
//     pickup_start: "2025-09-25 17:00:00.000",
//     pickup_end: "2025-09-25 20:00:00.000",
//     image_url: "uploads/offers/1758635781-download.jpeg",
//     status: "tidak_aktif",
//   },
//   {
//     id: 8,
//     business_id: 2,
//     title: "Magic Box Nasi Goreng",
//     description: "Paket surplus makan malam hemat",
//     price: 15000.0,
//     total_portion: 20,
//     remaining_portion: 20,
//     pickup_start: "2025-09-25 17:00:00.000",
//     pickup_end: "2025-09-25 20:00:00.000",
//     image_url: "uploads/offers/1758635782-download.jpeg",
//     status: "aktif",
//   },
//   {
//     id: 9,
//     business_id: 2,
//     title: "Magic Box Nasi Goreng",
//     description: "Paket surplus makan malam hemat",
//     price: 15000.0,
//     total_portion: 20,
//     remaining_portion: 5,
//     pickup_start: "2025-09-25 17:00:00.000",
//     pickup_end: "2025-09-25 20:00:00.000",
//     image_url: "",
//     status: "aktif",
//   },
//   {
//     id: 10,
//     business_id: 2,
//     title: "Magic Box Nasi Goreng",
//     description: "Paket surplus makan malam hemat",
//     price: 15000.0,
//     total_portion: 20,
//     remaining_portion: 20,
//     pickup_start: "2025-09-25 17:00:00.000",
//     pickup_end: "2025-09-25 20:00:00.000",
//     image_url: "uploads/offers/1758639314-download.jpeg",
//     status: "aktif",
//   },
//   {
//     id: 11,
//     business_id: 2,
//     title: "Magic Box Nasi Goreng",
//     description: "Paket surplus makan malam hemat",
//     price: 15000.0,
//     total_portion: 20,
//     remaining_portion: 20,
//     pickup_start: "2025-09-25 17:00:00.000",
//     pickup_end: "2025-09-25 20:00:00.000",
//     image_url: "uploads/offers/1758644941-download.jpeg",
//     status: "aktif",
//   },
// ]);

const route = useRoute();
const router = useRouter();
const offer = ref(null);
const isLoading = ref(true); // <-- TAMBAHKAN INI
const errorMessage = ref(null); // <-- TAMBAHKAN INI

// --- TAMBAHKAN FUNGSI INI ---
const goToCheckout = () => {
  if (offer.value) {
    router.push({ name: "checkout", params: { id: offer.value.id } });
  }
};

// Computed properties
const stockPercentage = computed(() => {
  if (!offer.value) return 0;
  return (offer.value.remaining_portion / offer.value.total_portion) * 100;
});

const stockStatus = computed(() => {
  const percentage = stockPercentage.value;
  if (percentage === 0)
    return {
      text: "HABIS",
      color: "bg-gradient-to-r from-red-500 to-red-600",
      textColor: "text-red-600",
      bgLight: "bg-red-50",
    };
  if (percentage <= 25)
    return {
      text: "HAMPIR HABIS",
      color: "bg-gradient-to-r from-orange-500 to-amber-600",
      textColor: "text-orange-600",
      bgLight: "bg-orange-50",
    };
  if (percentage <= 50)
    return {
      text: "TERBATAS",
      color: "bg-gradient-to-r from-yellow-500 to-amber-500",
      textColor: "text-yellow-600",
      bgLight: "bg-yellow-50",
    };
  return {
    text: "TERSEDIA",
    color: "bg-gradient-to-r from-green-500 to-emerald-600",
    textColor: "text-green-600",
    bgLight: "bg-green-50",
  };
});

// onMounted(() => {
//   const offerId = parseInt(route.params.id);
//   const foundOffer = allOffers.value.find((o) => o.id === offerId);

//   if (foundOffer) {
//     offer.value = foundOffer;
//   } else {
//     router.push({ name: "smart-shopping" });
//   }
// });
// OfferDetailView.vue

onMounted(async () => {
  const offerId = route.params.id;
  isLoading.value = true;
  errorMessage.value = null;

  // Pastikan ada ID di URL
  if (!offerId) {
    errorMessage.value = "ID Penawaran tidak valid.";
    isLoading.value = false;
    return;
  }

  try {
    // Panggil API untuk mendapatkan detail satu penawaran
    const response = await offerService.getOfferById(offerId); // Asumsi Anda punya fungsi ini di service
    offer.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil detail penawaran:", error);
    errorMessage.value =
      "Gagal memuat data penawaran. Mungkin tidak ditemukan.";
    // Opsional: Arahkan kembali jika benar-benar tidak ada
    // setTimeout(() => router.push({ name: 'smart-shopping' }), 2000);
  } finally {
    isLoading.value = false;
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatTime = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// const getImageUrl = (imagePath) => {
//   if (!imagePath) {
//     return "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop";
//   }
//   if (imagePath.startsWith("http")) {
//     return imagePath;
//   }
//   return `http://localhost:3000/${imagePath}`;
// };
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    // URL gambar default jika tidak ada gambar dari database
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
  }
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Ganti port ke 8080 DAN ganti semua karakter `\` menjadi `/`
  return `http://localhost:8080/${imagePath.replace(/\\/g, "/")}`;
};
</script>

<template>
  <div
    class="bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 min-h-screen"
  >
    <div
      class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-xl"
    >
      <div class="max-w-6xl mx-auto px-4 py-5">
        <div class="flex items-center justify-between">
          <button
            @click="router.back()"
            class="flex items-center gap-2 text-white hover:bg-white/20 px-4 py-2.5 rounded-xl transition-all font-semibold backdrop-blur-sm"
          >
            <Icon icon="mdi:arrow-left" class="w-6 h-6" />
            <span>Kembali</span>
          </button>

          <div class="flex items-center gap-2">
            <button
              class="text-white hover:bg-white/20 p-2.5 rounded-xl transition-all backdrop-blur-sm"
            >
              <Icon icon="mdi:share-variant" class="w-6 h-6" />
            </button>
            <button
              class="text-white hover:bg-white/20 p-2.5 rounded-xl transition-all backdrop-blur-sm"
            >
              <Icon icon="mdi:heart-outline" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center min-h-[70vh]">
      <div class="text-center">
        <Icon
          icon="mdi:loading"
          class="w-16 h-16 text-emerald-500 animate-spin mx-auto"
        />
        <p class="mt-4 text-xl font-semibold text-gray-700">Memuat data...</p>
      </div>
    </div>

    <div
      v-else-if="errorMessage"
      class="flex items-center justify-center min-h-[70vh]"
    >
      <div class="text-center">
        <Icon
          icon="mdi:alert-circle-outline"
          class="w-16 h-16 text-red-500 mx-auto"
        />
        <p class="mt-4 text-xl font-semibold text-red-700">
          {{ errorMessage }}
        </p>
      </div>
    </div>

    <div v-else-if="offer" class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div
            class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <div class="relative group">
              <img
                :src="getImageUrl(offer.image_url)"
                :alt="offer.title"
                class="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              ></div>

              <div class="absolute top-4 right-4">
                <span
                  :class="`${
                    offer.status === 'aktif'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600'
                  } text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl backdrop-blur-sm flex items-center gap-2`"
                >
                  <span
                    class="w-2 h-2 rounded-full bg-white animate-pulse"
                  ></span>
                  {{ offer.status === "aktif" ? "Aktif" : "Tidak Aktif" }}
                </span>
              </div>

              <div class="absolute top-4 left-4">
                <div
                  class="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl shadow-xl backdrop-blur-sm flex items-center gap-2 font-bold"
                >
                  <Icon icon="mdi:gift" class="w-5 h-5" />
                  <span>Magic Box</span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex items-start gap-3 mb-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Icon icon="mdi:food" class="w-7 h-7 text-white" />
              </div>
              <div>
                <h1
                  class="text-3xl font-black text-gray-900 mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                >
                  {{ offer.title }}
                </h1>
                <p class="text-gray-600 text-lg">
                  {{ offer.description }}
                </p>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-6 mt-6">
              <h3
                class="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 uppercase tracking-wide"
              >
                <Icon
                  icon="mdi:clock-outline"
                  class="w-6 h-6 text-emerald-600"
                />
                Waktu Pengambilan
              </h3>
              <div
                class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200"
              >
                <div class="flex items-center gap-3 mb-2">
                  <Icon icon="mdi:calendar" class="w-5 h-5 text-blue-600" />
                  <p class="text-sm font-semibold text-blue-900">
                    {{ formatDate(offer.pickup_start) }}
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <Icon icon="mdi:clock" class="w-5 h-5 text-blue-600" />
                  <p class="text-xl font-black text-blue-900">
                    {{ formatTime(offer.pickup_start) }} -
                    {{ formatTime(offer.pickup_end) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 mt-6 pt-6">
              <div class="flex items-center justify-between mb-4">
                <h3
                  class="text-sm font-bold text-gray-700 uppercase tracking-wide"
                >
                  Status Stok
                </h3>
                <span
                  :class="`${stockStatus.color} text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg`"
                >
                  {{ stockStatus.text }}
                </span>
              </div>
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner"
                >
                  <div
                    :class="`h-full ${stockStatus.color} transition-all duration-700 shadow-lg`"
                    :style="`width: ${stockPercentage}%`"
                  ></div>
                </div>
                <span
                  class="text-lg font-black text-gray-900 min-w-[80px] text-right"
                >
                  {{ offer.remaining_portion }}/{{ offer.total_portion }}
                </span>
              </div>
              <div
                :class="`${
                  stockStatus.bgLight
                } rounded-lg p-3 border-2 ${stockStatus.textColor.replace(
                  'text-',
                  'border-'
                )}`"
              >
                <p
                  class="text-sm font-bold text-center"
                  :class="stockStatus.textColor"
                >
                  <Icon icon="mdi:information" class="w-4 h-4 inline mr-1" />
                  {{ Math.round(stockPercentage) }}% stok masih tersedia
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h3
              class="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3"
            >
              <Icon icon="mdi:star-circle" class="w-8 h-8 text-emerald-600" />
              Keuntungan
            </h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div
                class="flex items-start gap-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <Icon icon="mdi:tag" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <p class="font-bold text-gray-900 mb-1">Harga Hemat</p>
                  <p class="text-sm text-gray-600">
                    Dapatkan makanan dengan harga terjangkau
                  </p>
                </div>
              </div>
              <div
                class="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <Icon icon="mdi:clock-fast" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <p class="font-bold text-gray-900 mb-1">Pengambilan Mudah</p>
                  <p class="text-sm text-gray-600">
                    Ambil sesuai jadwal yang ditentukan
                  </p>
                </div>
              </div>
              <div
                class="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <Icon icon="mdi:earth" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <p class="font-bold text-gray-900 mb-1">Kurangi Food Waste</p>
                  <p class="text-sm text-gray-600">
                    Bantu mengurangi pemborosan makanan
                  </p>
                </div>
              </div>
              <div
                class="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <Icon icon="mdi:shield-check" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <p class="font-bold text-gray-900 mb-1">Kualitas Terjamin</p>
                  <p class="text-sm text-gray-600">
                    Makanan segar dan berkualitas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-20">
            <div
              class="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-8 shadow-xl border-2 border-emerald-200 hover:shadow-2xl transition-all duration-300"
            >
              <div class="text-center mb-8">
                <div
                  class="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg"
                >
                  <Icon icon="mdi:flash" class="w-4 h-4" />
                  <span>Best Deal</span>
                </div>
                <p class="text-sm text-gray-600 font-semibold mb-2">
                  Total Harga
                </p>
                <p
                  class="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2"
                >
                  {{ formatCurrency(offer.price) }}
                </p>
                <p class="text-xs text-gray-500">per porsi</p>
              </div>

              <button
                @click="goToCheckout"
                :disabled="
                  offer.status !== 'aktif' || offer.remaining_portion === 0
                "
                :class="
                  offer.status === 'aktif' && offer.remaining_portion > 0
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1'
                    : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                "
                class="w-full py-4 rounded-xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 mb-6 transform active:scale-95"
              >
                <Icon icon="mdi:cart" class="w-6 h-6" />
                {{
                  offer.remaining_portion === 0
                    ? "Stok Habis"
                    : "Pesan Sekarang"
                }}
                <Icon icon="mdi:arrow-right" class="w-5 h-5" />
              </button>

              <div class="space-y-4 pt-6 border-t-2 border-emerald-200">
                <div
                  class="flex justify-between items-center text-sm bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200"
                >
                  <span
                    class="text-gray-700 font-semibold flex items-center gap-2"
                  >
                    <Icon icon="mdi:clock" class="w-4 h-4 text-blue-600" />
                    Jam Ambil
                  </span>
                  <span class="font-black text-blue-900">
                    {{ formatTime(offer.pickup_start) }} -
                    {{ formatTime(offer.pickup_end) }}
                  </span>
                </div>
                <div
                  class="flex justify-between items-center text-sm bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200"
                >
                  <span
                    class="text-gray-700 font-semibold flex items-center gap-2"
                  >
                    <Icon
                      icon="mdi:package-variant"
                      class="w-4 h-4 text-purple-600"
                    />
                    Tersisa
                  </span>
                  <span class="font-black text-purple-900">
                    {{ offer.remaining_portion }} porsi
                  </span>
                </div>
                <div
                  class="flex justify-between items-center text-sm bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200"
                >
                  <span
                    class="text-gray-700 font-semibold flex items-center gap-2"
                  >
                    <Icon
                      icon="mdi:check-circle"
                      class="w-4 h-4 text-amber-600"
                    />
                    Status
                  </span>
                  <span
                    :class="`font-black ${
                      offer.status === 'aktif'
                        ? 'text-green-600'
                        : 'text-gray-600'
                    }`"
                  >
                    {{ offer.status === "aktif" ? "✓ Aktif" : "✗ Tidak Aktif" }}
                  </span>
                </div>
              </div>

              <div class="mt-6 pt-6 border-t-2 border-emerald-200">
                <p
                  class="text-center text-xs text-gray-600 flex items-center justify-center gap-2 bg-green-50 p-3 rounded-lg border border-green-200"
                >
                  <Icon
                    icon="mdi:shield-check"
                    class="w-5 h-5 text-green-600"
                  />
                  <span class="font-semibold"
                    >Pembayaran 100% aman & terpercaya</span
                  >
                </p>
              </div>
            </div>

            <div
              class="mt-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 shadow-xl text-white"
            >
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <Icon icon="mdi:information" class="w-6 h-6" />
                </div>
                <div>
                  <p class="font-black text-lg mb-3">Cara Pengambilan</p>
                  <ul class="text-sm space-y-2 text-blue-50">
                    <li class="flex items-start gap-2">
                      <Icon
                        icon="mdi:check-circle"
                        class="w-5 h-5 flex-shrink-0 mt-0.5"
                      />
                      <span>Lakukan pemesanan terlebih dahulu</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon
                        icon="mdi:check-circle"
                        class="w-5 h-5 flex-shrink-0 mt-0.5"
                      />
                      <span>Tunjukkan kode booking saat pengambilan</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon
                        icon="mdi:check-circle"
                        class="w-5 h-5 flex-shrink-0 mt-0.5"
                      />
                      <span>Ambil sesuai jadwal yang ditentukan</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
