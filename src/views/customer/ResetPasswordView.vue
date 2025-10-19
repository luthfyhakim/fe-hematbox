<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
// [BARU] Impor service yang sudah kita siapkan
import authService from "@/services/authService.js";

const router = useRouter();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

// [BARU] State untuk loading dan pesan notifikasi
const isLoading = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);

// [DIPERBAIKI] Fungsi ini sekarang menjadi async untuk memanggil API
const handleSubmit = async () => {
  // Reset notifikasi setiap kali tombol ditekan
  errorMessage.value = null;
  successMessage.value = null;

  // Validasi frontend
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = "Semua field wajib diisi!";
    return;
  }
  if (newPassword.value.length < 8) {
    errorMessage.value = "Password baru minimal harus 8 karakter.";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "Password baru dan konfirmasi tidak cocok!";
    return;
  }

  // Mulai loading
  isLoading.value = true;

  try {
    const passwordData = {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    };

    // Panggil API melalui service
    const response = await authService.changePassword(passwordData);

    // Tampilkan pesan sukses dari backend
    successMessage.value = response.data.message || "Password berhasil diubah!";

    // Arahkan kembali ke halaman profil setelah 2 detik
    setTimeout(() => {
      router.push({ name: "customer-profile" });
    }, 2000);
  } catch (error) {
    // Tangani error dari API (misalnya: password lama salah, dll)
    // if (error.response && error.response.data && error.response.data.error) {
    //   errorMessage.value = error.response.data.error;
    // } else {
    //   errorMessage.value =
    //     "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
    // }
    // ==========================================================
    // ▼▼▼ BLOK CATCH YANG DIPERBAIKI ADA DI SINI ▼▼▼
    // ==========================================================
    if (error.response) {
      // Error datang dari server dengan respons (e.g., 401, 400)
      errorMessage.value =
        error.response.data.error ||
        "Terjadi kesalahan yang tidak diketahui dari server.";
    } else if (error.request) {
      // Request dibuat tapi tidak ada respons (server tidak berjalan atau CORS)
      errorMessage.value =
        "Tidak dapat terhubung ke server. Pastikan server backend Anda berjalan.";
    } else {
      // Error lain saat membuat request
      errorMessage.value =
        "Terjadi kesalahan pada aplikasi. Silakan coba lagi.";
    }
    console.error("Gagal mengubah password:", error);
    // ==========================================================
    // ▲▲▲ AKHIR DARI PERBAIKAN ▲▲▲
    // ==========================================================
  } finally {
    // Hentikan loading, apapun hasilnya (sukses atau gagal)
    isLoading.value = false;
  }
};

const handleCancel = () => {
  router.back();
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100 p-4 md:p-6"
  >
    <div class="max-w-4xl mx-auto">
      <!-- HEADER -->
      <div class="mb-8">
        <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Icon icon="mdi:home" class="w-4 h-4" />
          <span>Beranda</span>
          <Icon icon="mdi:chevron-right" class="w-4 h-4" />
          <router-link
            :to="{ name: 'customer-profile' }"
            class="hover:underline"
            >Profil Saya</router-link
          >
          <Icon icon="mdi:chevron-right" class="w-4 h-4" />
          <span class="text-teal-600 font-medium">Ganti Password</span>
        </nav>
        <h1
          class="text-4xl md:text-5xl font-bold text-gray-800 bg-gradient-to-r from-teal-600 bg-clip-text text-transparent"
        >
          Ganti Password
        </h1>
        <p class="text-gray-600 mt-2 text-lg">
          Untuk keamanan akun, mohon jangan bagikan password Anda kepada siapa
          pun.
        </p>
      </div>

      <!-- FORM CARD -->
      <div
        class="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- [BARU] NOTIFIKASI ERROR & SUKSES -->
          <div
            v-if="errorMessage"
            class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg transition-opacity duration-300"
            role="alert"
          >
            <p class="font-bold">Gagal!</p>
            <p>{{ errorMessage }}</p>
          </div>
          <div
            v-if="successMessage"
            class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg transition-opacity duration-300"
            role="alert"
          >
            <p class="font-bold">Sukses!</p>
            <p>{{ successMessage }}</p>
          </div>

          <!-- FORM FIELDS -->
          <div class="group">
            <label
              for="current-password"
              class="text-sm font-medium text-gray-500 uppercase tracking-wider"
              >Password Lama</label
            >
            <div class="relative mt-2">
              <Icon
                icon="mdi:lock-outline"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-teal-500 transition-colors"
              />
              <input
                type="password"
                id="current-password"
                v-model="currentPassword"
                placeholder="Masukkan password Anda saat ini"
                class="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:outline-none focus:ring-0 transition-all peer"
              />
            </div>
          </div>
          <div class="group">
            <label
              for="new-password"
              class="text-sm font-medium text-gray-500 uppercase tracking-wider"
              >Password Baru</label
            >
            <div class="relative mt-2">
              <Icon
                icon="mdi:key-variant"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-teal-500 transition-colors"
              />
              <input
                type="password"
                id="new-password"
                v-model="newPassword"
                placeholder="Minimal 8 karakter"
                class="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:outline-none focus:ring-0 transition-all peer"
              />
            </div>
          </div>
          <div class="group">
            <label
              for="confirm-password"
              class="text-sm font-medium text-gray-500 uppercase tracking-wider"
              >Konfirmasi Password Baru</label
            >
            <div class="relative mt-2">
              <Icon
                icon="mdi:check-circle-outline"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-teal-500 transition-colors"
              />
              <input
                type="password"
                id="confirm-password"
                v-model="confirmPassword"
                placeholder="Ketik ulang password baru Anda"
                class="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:outline-none focus:ring-0 transition-all peer"
              />
            </div>
          </div>

          <!-- ACTION BUTTONS (Dengan state loading) -->
          <div
            class="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4"
          >
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon
                v-if="isLoading"
                icon="mdi:loading"
                class="w-5 h-5 animate-spin"
              />
              <Icon v-else icon="mdi:content-save" class="w-5 h-5" />
              <span>{{ isLoading ? "Menyimpan..." : "Simpan Perubahan" }}</span>
            </button>
            <button
              type="button"
              @click="handleCancel"
              class="w-full sm:w-auto bg-white text-teal-700 px-5 py-2.5 rounded-lg font-semibold border border-teal-600 hover:bg-gray-100 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
