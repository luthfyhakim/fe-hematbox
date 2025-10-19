<script setup>
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import apiClient from "@/services/apiClient";

const props = defineProps({
  offer: {
    type: Object,
    required: true,
  },
  themeColor: {
    type: String,
    default: "emerald",
  },
});

const emit = defineEmits(["goToDetail", "takeOffer"]);

// Fallback image sebagai data URL (tidak perlu network request)
const FALLBACK_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';

// Computed properties sesuai struktur API
// const offerImage = computed(() => {
//   const imageUrl =
//     props.offer.image_url || props.offer.image || props.offer.imageUrl;

//   // Jika ada image_url, tambahkan base URL jika belum lengkap
//   if (imageUrl && !imageUrl.startsWith("http")) {
//     // Coba berbagai kemungkinan base URL
//     const baseUrl =
//       import.meta.env.VITE_API_BASE_URL ||
//       import.meta.env.VITE_API_URL ||
//       "http://127.0.0.1:8000"; // Laravel default
//     return `${baseUrl}/${imageUrl}`;
//   }

//   return imageUrl || FALLBACK_IMAGE;
// });

const offerImage = computed(() => {
  const imageUrl =
    props.offer.image_url || props.offer.image || props.offer.imageUrl;

  // Jika tidak ada image URL, return fallback
  if (!imageUrl) {
    return FALLBACK_IMAGE;
  }

  // Jika sudah URL lengkap (http/https), gunakan langsung
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Jika path relatif, tambahkan base URL Golang
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:8080"; // Golang default port (sesuaikan dengan port Anda)

  // Bersihkan double slash
  const cleanImageUrl = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  return `${cleanBaseUrl}${cleanImageUrl}`;
});

const offerName = computed(
  () =>
    props.offer.title ||
    props.offer.name ||
    props.offer.description ||
    "Nama tidak tersedia"
);

const offerStock = computed(
  () =>
    props.offer.remaining_portion ||
    props.offer.stock ||
    props.offer.quantity ||
    0
);

const offerDiscount = computed(() => {
  // Hitung diskon dari harga asli jika ada
  if (props.offer.original_price && props.offer.price) {
    return Math.round(
      ((props.offer.original_price - props.offer.price) /
        props.offer.original_price) *
        100
    );
  }
  return props.offer.discount || props.offer.discountPercentage || 0;
});

const offerRating = computed(
  () =>
    props.offer.rating ||
    props.offer.rate ||
    props.offer.business?.rating ||
    4.5
);

const offerDistance = computed(
  () =>
    props.offer.distance ||
    props.offer.distanceKm ||
    props.offer.business?.distance ||
    1.5
);

const offerPrice = computed(
  () => props.offer.price || props.offer.discounted_price || 0
);

const offerOriginalPrice = computed(
  () =>
    props.offer.original_price ||
    props.offer.regular_price ||
    props.offer.normalPrice ||
    (props.offer.price ? props.offer.price * 1.5 : 0) // Estimasi harga asli jika tidak ada
);

const estimatedTime = computed(() => Math.round(offerDistance.value * 5));

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const handleDetailClick = () => {
  emit("goToDetail", props.offer.id);
};

const handleTakeClick = () => {
  emit("takeOffer", props.offer.id);
};
</script>

<template>
  <div
    class="bg-white rounded-3xl shadow-lg overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100"
  >
    <div class="relative h-48 w-full overflow-hidden bg-gray-200">
      <img
        :src="offerImage"
        :alt="offerName"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        @error="(e) => (e.target.src = FALLBACK_IMAGE)"
        loading="lazy"
      />

      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
      ></div>

      <div class="absolute top-3 left-3" v-if="offerDiscount > 0">
        <div
          class="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-xl font-black text-sm shadow-lg"
        >
          -{{ offerDiscount }}%
        </div>
      </div>

      <div class="absolute top-3 right-3">
        <div
          class="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg"
        >
          <Icon
            icon="mdi:package-variant-closed"
            :class="`w-4 h-4 text-${themeColor}-600`"
          />

          <span class="text-xs font-bold text-gray-900"
            >{{ offerStock }} tersisa</span
          >
        </div>
      </div>

      <div class="absolute bottom-3 right-3" v-if="offerRating > 0">
        <div
          class="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg"
        >
          <Icon icon="mdi:star" class="w-4 h-4 text-yellow-500" />

          <span class="text-xs font-bold text-gray-900">{{ offerRating }}</span>
        </div>
      </div>
    </div>

    <div class="p-5">
      <h4
        class="font-black text-lg text-gray-900 mb-3 line-clamp-1"
        :title="offerName"
      >
        {{ offerName }}
      </h4>

      <div class="flex items-center gap-4 mb-4">
        <div class="flex items-center gap-1.5 text-gray-600">
          <Icon
            icon="mdi:map-marker"
            :class="`w-4 h-4 text-${themeColor}-600`"
          />

          <span class="text-sm font-semibold">{{ offerDistance }} km</span>
        </div>

        <div class="flex items-center gap-1.5 text-gray-600">
          <Icon icon="mdi:clock-outline" class="w-4 h-4 text-blue-600" />

          <span class="text-sm font-semibold">~{{ estimatedTime }} menit</span>
        </div>
      </div>

      <div class="mb-4 pb-4 border-b border-gray-100">
        <div class="flex items-end gap-2">
          <span class="text-2xl font-black text-gray-900">{{
            formatCurrency(offerPrice)
          }}</span>
        </div>

        <div
          class="flex items-center gap-2 mt-1"
          v-if="offerOriginalPrice > offerPrice"
        >
          <span class="text-sm text-gray-500 line-through">{{
            formatCurrency(offerOriginalPrice)
          }}</span>

          <span
            :class="`text-xs font-bold text-${themeColor}-600 bg-${themeColor}-50 px-2 py-0.5 rounded-full`"
          >
            Hemat
            {{ formatCurrency(offerOriginalPrice - offerPrice) }}
          </span>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          @click="handleDetailClick"
          :class="`flex-1 border-2 border-${themeColor}-500 text-${themeColor}-700 px-4 py-2.5 rounded-xl font-bold hover:bg-${themeColor}-50 transition-all duration-300 flex items-center justify-center gap-2 group`"
        >
          <Icon icon="mdi:information-outline" class="w-4 h-4" />
          <span class="text-sm">Detail</span>
        </button>

        <button
          @click="handleTakeClick"
          :class="`flex-1 bg-gradient-to-r from-${themeColor}-500 to-teal-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2`"
        >
          <Icon icon="mdi:cart-plus" class="w-4 h-4" />
          <span class="text-sm">Ambil</span>
        </button>
      </div>
    </div>
  </div>
</template>
