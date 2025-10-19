<script setup>
// 1. onMounted sudah di-import
import { onMounted } from "vue";
import { Icon } from "@iconify/vue";
// 2. Impor data terpusat dari store
import { userProfile, fetchUserProfile } from "@/store/userProfileStore.js";
import authService from "@/services/authService.js";

// ==========================================================
// ▼▼▼ BAGIAN YANG HARUS DIPERBAIKI (DITAMBAHKAN) ADA DI SINI ▼▼▼
// ==========================================================
// Memanggil fetchUserProfile() saat komponen pertama kali dimuat
onMounted(() => {
  fetchUserProfile();
});
// ==========================================================
// ▲▲▲ AKHIR DARI BAGIAN YANG DIPERBAIKI ▲▲▲
// ==========================================================

// Helper untuk memformat tanggal
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

// Helper untuk menampilkan role yang user-friendly
const getRoleDisplay = (role) => {
  const roleMap = {
    business: "Akun Bisnis",
    consumer: "Akun Konsumen",
  };
  return roleMap[role] || role;
};

// Helper untuk menghitung waktu relatif
const getTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMonths = Math.floor((now - date) / (1000 * 60 * 60 * 24 * 30));

  if (diffInMonths < 1) {
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    return diffInDays < 1 ? "Hari ini" : `${diffInDays} hari yang lalu`;
  }

  if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} tahun yang lalu`;
};

// Fungsi logout
const logout = () => {
  if (
    confirm(
      "🚪 Anda yakin ingin keluar dari akun?\n\nAnda perlu login kembali untuk mengakses akun Anda."
    )
  ) {
    // Logika logout di sini
    console.log("Logout berhasil");
    authService.logout(); // Contoh memanggil fungsi logout dari service
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6"
  >
    <div class="max-w-6xl mx-auto">
      <!-- HEADER WITH BREADCRUMB -->
      <div class="mb-8">
        <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Icon icon="mdi:home" class="w-4 h-4" />
          <span>Beranda</span>
          <Icon icon="mdi:chevron-right" class="w-4 h-4" />
          <span class="text-teal-600 font-medium">Profil Saya</span>
        </nav>
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-4xl md:text-5xl font-bold text-gray-800 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
            >
              Profil Saya
            </h1>
            <p class="text-gray-600 mt-2 text-lg">
              Kelola informasi akun, keamanan, dan preferensi Anda dengan mudah.
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- SIDEBAR PROFIL -->
        <div class="lg:col-span-1 space-y-6">
          <!-- KARTU PROFIL UTAMA -->
          <div
            class="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20 relative overflow-hidden"
          >
            <div class="absolute inset-0 opacity-5">
              <div
                class="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500"
              ></div>
            </div>
            <div class="relative z-10 text-center">
              <div class="relative inline-block mb-6">
                <img
                  :src="userProfile.avatar_url"
                  alt="Avatar"
                  class="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg mx-auto"
                />
                <div
                  class="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white"
                >
                  <Icon icon="mdi:check" class="w-4 h-4 text-white" />
                </div>
              </div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">
                {{ userProfile.name }}
              </h2>
              <p class="text-gray-500 mb-1">{{ userProfile.email }}</p>
              <p class="text-sm text-gray-400 mb-6">
                Anggota sejak {{ formatDate(userProfile.created_at) }}
              </p>

              <router-link
                :to="{ name: 'customer-profile-edit' }"
                class="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
                <span>Edit Profil</span>
              </router-link>
            </div>
          </div>
          <!-- STATISTIK AKUN -->
          <div
            class="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20"
          >
            <h3
              class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"
            >
              <Icon icon="mdi:chart-line" class="text-teal-500" />
              Statistik Akun
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Status</span>
                <span
                  class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                  >Aktif</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Terakhir Login</span>
                <span class="text-gray-700 font-medium">Hari ini</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">ID Pengguna</span>
                <span class="text-gray-700 font-mono"
                  >#{{ String(userProfile.id).padStart(6, "0") }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- KONTEN UTAMA -->
        <div class="lg:col-span-2 space-y-6">
          <!-- INFORMASI AKUN -->
          <div
            class="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20"
          >
            <h3
              class="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-8"
            >
              <div class="bg-teal-100 p-3 rounded-xl">
                <Icon
                  icon="mdi:card-account-details-outline"
                  class="text-teal-600 w-6 h-6"
                />
              </div>
              Informasi Akun
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-6">
                <div class="group">
                  <label
                    class="text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >Nama Lengkap</label
                  >
                  <div
                    class="mt-2 p-4 bg-gray-50 rounded-xl border-2 border-transparent group-hover:border-teal-200 transition-colors"
                  >
                    <p class="font-semibold text-gray-800">
                      {{ userProfile.name }}
                    </p>
                  </div>
                </div>
                <div class="group">
                  <label
                    class="text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >Alamat Email</label
                  >
                  <div
                    class="mt-2 p-4 bg-gray-50 rounded-xl border-2 border-transparent group-hover:border-teal-200 transition-colors"
                  >
                    <p
                      class="font-semibold text-gray-800 flex items-center gap-2"
                    >
                      <Icon icon="mdi:email" class="w-4 h-4 text-teal-500" />{{
                        userProfile.email
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="space-y-6">
                <div class="group">
                  <label
                    class="text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >Nomor Telepon</label
                  >
                  <div
                    class="mt-2 p-4 bg-gray-50 rounded-xl border-2 border-transparent group-hover:border-teal-200 transition-colors"
                  >
                    <p
                      class="font-semibold text-gray-800 flex items-center gap-2"
                    >
                      <Icon icon="mdi:phone" class="w-4 h-4 text-teal-500" />{{
                        userProfile.phone_number
                      }}
                    </p>
                  </div>
                </div>
                <div class="group">
                  <label
                    class="text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >Jenis Akun</label
                  >
                  <div
                    class="mt-2 p-4 bg-gray-50 rounded-xl border-2 border-transparent group-hover:border-teal-200 transition-colors"
                  >
                    <div class="flex items-center gap-3">
                      <Icon
                        :icon="
                          userProfile.role === 'business'
                            ? 'mdi:briefcase'
                            : 'mdi:account'
                        "
                        class="w-5 h-5 text-teal-500"
                      /><span class="font-semibold text-gray-800">{{
                        getRoleDisplay(userProfile.role)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- PENGATURAN KEAMANAN -->
          <div
            class="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20"
          >
            <h3
              class="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-8"
            >
              <div class="bg-red-100 p-3 rounded-xl">
                <Icon icon="mdi:shield-lock" class="text-red-600 w-6 h-6" />
              </div>
              Pengaturan Keamanan
            </h3>
            <div class="space-y-6">
              <div
                class="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100"
              >
                <div class="flex items-start gap-4">
                  <div class="bg-red-100 p-3 rounded-xl">
                    <Icon icon="mdi:key-variant" class="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-800 mb-1">Ganti Password</h4>
                    <p class="text-gray-600 text-sm">
                      Ubah password Anda secara berkala untuk menjaga keamanan
                      akun.
                    </p>
                    <p class="text-sm text-red-600 mt-2">
                      Terakhir diubah: {{ formatDate(userProfile.updated_at) }}
                    </p>
                  </div>
                </div>
                <!-- <button
                  class="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Icon icon="mdi:pencil" class="w-4 h-4" />
                  Ubah
                </button> -->
                <router-link
                  :to="{ name: 'customer-change-password' }"
                  class="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Icon icon="mdi:pencil" class="w-4 h-4" />
                  Ubah
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
