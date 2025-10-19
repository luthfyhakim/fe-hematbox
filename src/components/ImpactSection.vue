<script setup>
import { ref, computed } from "vue";
import { useTransition } from "@vueuse/core";
import { Icon } from "@iconify/vue";

// Data mentah untuk statistik
const rawImpacts = {
  foodSaved: 10000,
  userSavings: 500000000,
  partnersJoined: 500,
  transactions: 80000,
};

// Ref untuk menampung angka yang akan dianimasikan, dimulai dari 0
const foodSaved = ref(0);
const userSavings = ref(0);
const partnersJoined = ref(0);
const transactions = ref(0);

// Gunakan useTransition untuk membuat animasi counter
const foodSavedTransition = useTransition(foodSaved, {
  duration: 2000,
});
const userSavingsTransition = useTransition(userSavings, {
  duration: 2000,
});
const partnersJoinedTransition = useTransition(partnersJoined, {
  duration: 2000,
});
const transactionsTransition = useTransition(transactions, {
  duration: 2000,
});

// Mulai animasi dengan mengubah nilai ref ke nilai target
foodSaved.value = rawImpacts.foodSaved;
userSavings.value = rawImpacts.userSavings;
partnersJoined.value = rawImpacts.partnersJoined;
transactions.value = rawImpacts.transactions;

// Computed property untuk memformat angka
const formattedFoodSaved = computed(
  () => Math.round(foodSavedTransition.value).toLocaleString("id-ID") + "+"
);
const formattedUserSavings = computed(
  () => "Rp " + Math.round(userSavingsTransition.value / 1000000) + " Juta+"
);
const formattedPartners = computed(
  () => Math.round(partnersJoinedTransition.value).toLocaleString("id-ID") + "+"
);
const formattedTransactions = computed(
  () => Math.round(transactionsTransition.value).toLocaleString("id-ID") + "+"
);

// Gabungkan data untuk ditampilkan di template
const impacts = ref([
  {
    value: formattedFoodSaved,
    label: "Makanan Terselamatkan",
    // PERUBAHAN 1: Mengganti ikon menjadi satu ikon apel saja & menghapus icon2
    icon: "mdi:food-apple-outline",
    iconColor: "text-green-500 bg-green-100",
  },
  {
    value: formattedUserSavings,
    label: "Penghematan Pengguna",
    icon: "mdi:piggy-bank-outline",
    iconColor: "text-blue-500 bg-blue-100",
  },
  {
    value: formattedPartners,
    label: "Mitra Bergabung",
    icon: "mdi:handshake-outline",
    iconColor: "text-orange-500 bg-orange-100",
  },
  {
    value: formattedTransactions,
    label: "Transaksi Berhasil",
    icon: "mdi:check-decagram-outline",
    iconColor: "text-purple-500 bg-purple-100",
  },
]);
</script>

<template>
  <section class="py-20 bg-green-50/50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-800">
          Dampak Nyata yang Telah Kita Ciptakan Bersama
        </h2>
        <p class="text-gray-600 mt-3 text-lg">
          Setiap transaksi di HematBox berkontribusi pada perubahan positif bagi
          lingkungan dan masyarakat.
        </p>
      </div>

      <div
        class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
      >
        <div
          v-for="impact in impacts"
          :key="impact.label"
          class="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
        >
          <div
            class="w-16 h-16 rounded-full inline-flex items-center justify-center mb-4"
            :class="impact.iconColor"
          >
            <Icon :icon="impact.icon" class="w-9 h-9" />
          </div>
          <p class="text-3xl lg:text-4xl font-extrabold text-[#10B981]">
            {{ impact.value }}
          </p>
          <p class="mt-2 text-gray-600">{{ impact.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
