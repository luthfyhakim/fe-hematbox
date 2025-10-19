<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
// [BARU] Import 'useTransition' untuk animasi angka
import { useTransition } from "@vueuse/core";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

// --- Data asli (sebagai target animasi) ---
const stats = ref([
  {
    name: "Total Penjualan (Bulan Ini)",
    target: 7500000,
    change: "+12%",
    icon: "mdi:cash-multiple",
    gradient: "from-emerald-500 to-teal-500",
    formatter: (val) =>
      `Rp ${new Intl.NumberFormat("id-ID").format(val / 100000)} Jt`,
  },
  {
    name: "Penawaran Terjual",
    target: 342,
    change: "+21",
    icon: "mdi:package-variant-closed",
    gradient: "from-blue-500 to-cyan-500",
    formatter: (val) => Math.round(val),
  },
  {
    name: "Pelanggan Baru",
    target: 45,
    change: "+5",
    icon: "mdi:account-plus-outline",
    gradient: "from-indigo-500 to-purple-500",
    formatter: (val) => Math.round(val),
  },
  {
    name: "Limbah Terkurangi",
    target: 89,
    change: "-3 Kg",
    icon: "mdi:scale-balance",
    gradient: "from-amber-500 to-orange-500",
    formatter: (val) => `${Math.round(val)} Kg`,
  },
]);

// --- [BARU] Logika Animasi Angka ---
// 1. Buat 'source' ref yang dimulai dari 0 untuk setiap angka
const animatedSources = ref([0, 0, 0, 0]);

// 2. Buat 'transitioned' ref menggunakan useTransition
const animatedValues = useTransition(animatedSources, {
  duration: 1500, // Durasi animasi dalam milidetik (1.5 detik)
  transition: [0.7, 0, 0.3, 1], // Kurva easing (opsional)
});

// 3. Mulai animasi saat komponen dimuat
onMounted(() => {
  animatedSources.value = stats.value.map((s) => s.target);
});

// --- Data Grafik (tidak berubah) ---
const chartData = ref({
  labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
  datasets: [
    {
      label: "Penjualan Minggu Ini",
      backgroundColor: "rgba(20, 184, 166, 0.1)",
      borderColor: "#10B981",
      tension: 0.4,
      fill: true,
      data: [120000, 190000, 150000, 250000, 220000, 300000, 280000],
    },
  ],
});
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { ticks: { color: "#4B5563" }, grid: { color: "#E5E7EB" } },
    x: { ticks: { color: "#4B5563" }, grid: { display: false } },
  },
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6"
  >
    <div class="max-w-7xl mx-auto">
      <div
        v-motion
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
        class="mb-8"
      >
        <h1 class="text-3xl font-bold text-gray-800">Analytics</h1>
        <p class="text-gray-600 mt-1">
          Lacak metrik dan performa bisnis Anda dari waktu ke waktu.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="(stat, index) in stats"
          :key="stat.name"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: { delay: 200 + index * 100 },
          }"
          :class="`bg-gradient-to-br ${stat.gradient}`"
          class="p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 text-white relative overflow-hidden"
        >
          <div
            class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"
          ></div>

          <div class="relative z-10">
            <div class="flex justify-between items-start">
              <p class="text-sm font-semibold text-white/80">{{ stat.name }}</p>
              <Icon :icon="stat.icon" class="w-7 h-7 text-white/90" />
            </div>
            <p class="text-3xl font-bold mt-2">
              {{ stat.formatter(animatedValues[index]) }}
            </p>
            <p class="text-xs text-white/70 mt-1">
              {{ stat.change }} vs minggu lalu
            </p>
          </div>
        </div>
      </div>

      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 700 } }"
        class="bg-white/70 backdrop-blur-lg p-6 sm:p-8 rounded-3xl shadow-xl border border-white/20"
      >
        <h3 class="text-2xl font-bold text-gray-800 mb-1">Tren Penjualan</h3>
        <p class="text-gray-600 mb-6">
          Visualisasi pendapatan selama 7 hari terakhir.
        </p>
        <div class="h-96">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>
