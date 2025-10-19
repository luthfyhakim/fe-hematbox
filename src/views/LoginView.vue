<!-- <script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import authService from "@/services/authService"; // <-- TAMBAHKAN INI
import { useRouter } from "vue-router"; // <-- TAMBAHKAN INI

// Helper function untuk mengambil gambar dari folder assets
const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

// State untuk form
// const username = ref("");
// const password = ref("");
const credentials = ref({
  username: "",
  password: "",
});
const errorMessage = ref(null); // <-- TAMBAHKAN INI untuk pesan error

const router = useRouter(); // <-- TAMBAHKAN INI untuk inisialisasi router
const rememberMe = ref(false);
const showPassword = ref(false);

// Fungsi untuk toggle visibilitas password
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Fungsi untuk handle submit form (untuk sekarang hanya menampilkan di console)
// const handleLogin = () => {
//   console.log({
//     username: username.value,
//     password: password.value,
//     rememberMe: rememberMe.value,
//   });
//   // Di sini Anda akan menambahkan logika login sebenarnya
// };
const handleLogin = async () => {
  errorMessage.value = null;
  try {
    const response = await authService.login(credentials.value);
    localStorage.setItem("token", response.data.token);
    router.push("/dashboard"); // Ganti dengan rute tujuan Anda
  } catch (error) {
    console.error("Login gagal:", error.response?.data || error.message);
    errorMessage.value =
      error.response?.data?.message || "Username atau password salah.";
  }
};
</script> -->
<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import authService from "@/services/authService";
import { useRouter } from "vue-router";
// 1. TAMBAHKAN IMPORT INI untuk bisa memeriksa profil bisnis
import businessService from "@/services/businessService";

// Helper function untuk mengambil gambar dari folder assets
const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

// State untuk form
const credentials = ref({
  // username: "",
  email: "", // <-- UBAH MENJADI INI
  password: "",
});
const rememberMe = ref(false);
const showPassword = ref(false);
const errorMessage = ref(null);
const isLoading = ref(false); // <-- [BARU] State untuk loading

const router = useRouter();

// Fungsi untuk toggle visibilitas password
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Fungsi untuk handle submit form yang sudah terhubung API
// const handleLogin = async () => {
//   errorMessage.value = null; // Reset pesan error
//   try {
//     const response = await authService.login(credentials.value);

//     // SIMPAN TOKEN setelah login berhasil
//     localStorage.setItem("token", response.data.token);

//     // Arahkan ke halaman dashboard atau halaman utama
//     router.push("/dashboard"); // Ganti '/dashboard' dengan rute tujuan Anda
//   } catch (error) {
//     console.error("Login gagal:", error.response?.data || error.message);
//     // Tampilkan pesan error ke pengguna
//     errorMessage.value =
//       error.response?.data?.message || "Username atau password salah.";
//   }
// };
// const handleLogin = async () => {
//   errorMessage.value = null; // Reset pesan error
//   try {
//     const response = await authService.login(credentials.value);

//     // 1. SIMPAN TOKEN & DATA PENGGUNA DENGAN BENAR
//     const accessToken = response.data.data.access_token;
//     const user = response.data.user;
//     localStorage.setItem("token", accessToken);
//     localStorage.setItem("user", JSON.stringify(user)); // Simpan data user juga, ini sangat berguna

//     // 2. ARAHKAN BERDASARKAN PERAN (ROLE) PENGGUNA
//     switch (user.role) {
//       case "consumer":
//         router.push("/customer");
//         break;
//       case "business":
//         router.push("/business");
//         break;
//       case "superadmin":
//         router.push("/superadmin");
//         break;
//       default:
//         // Jika role tidak dikenali, arahkan ke halaman utama
//         router.push("/");
//         break;
//     }
//   } catch (error) {
//     console.error("Login gagal:", error.response?.data || error.message);
//     errorMessage.value =
//       error.response?.data?.error || "Email atau password salah.";
//   }
// };
// 2. GANTI TOTAL FUNGSI HANDLELOGIN DENGAN LOGIKA BARU INI
const handleLogin = async () => {
  errorMessage.value = null;
  isLoading.value = true; // <-- [BARU] Mulai loading
  try {
    const response = await authService.login(credentials.value);

    // Simpan token dan data pengguna
    const accessToken = response.data.data.access_token;
    const user = response.data.user;
    // localStorage.setItem("token", accessToken);

    // ==========================================================
    // ▼▼▼ PERBAIKAN UTAMA ADA DI SINI ▼▼▼
    // ==========================================================
    // Simpan token dengan kunci 'access_token' agar sesuai dengan apiClient.js
    localStorage.setItem("access_token", accessToken);
    // ==========================================================
    // ▲▲▲ AKHIR DARI PERBAIKAN ▲▲▲
    // ==========================================================
    localStorage.setItem("user", JSON.stringify(user));

    // Periksa peran (role) pengguna
    if (user.role === "business") {
      // Jika rolenya bisnis, coba ambil profil bisnisnya
      try {
        await businessService.getMyBusinessProfile();
        // JIKA BERHASIL (200 OK): Profil sudah ada, arahkan ke dashboard
        router.push("/business");
      } catch (error) {
        // JIKA GAGAL (404 Not Found): Profil belum ada
        if (error.response && error.response.status === 404) {
          // Arahkan ke halaman pembuatan profil
          router.push("/business/create-profile");
        } else {
          // Error lain (misal: 500), tampilkan pesan
          errorMessage.value = "Gagal memverifikasi profil bisnis Anda.";
        }
      }
    } else if (user.role === "consumer") {
      router.push("/customer");
    } else {
      router.push("/");
    }
  } catch (error) {
    console.error("Login gagal:", error.response?.data || error.message);
    errorMessage.value =
      error.response?.data?.error || "Email atau password salah.";
  }
};
</script>

<template>
  <div class="min-h-screen flex">
    <div
      class="hidden lg:flex w-1/2 bg-gradient-to-br from-green-200 to-[#10B981] relative items-center justify-center overflow-hidden"
    >
      <img
        :src="getImageUrl('logo.png')"
        alt="HematBox Logo"
        class="w-64 h-64 object-contain z-10 animate-float"
      />
      <div
        class="absolute -top-16 -left-16 w-80 h-80 border-[20px] border-green-300/30 rounded-full animate-spin-slow"
      ></div>
      <div
        class="absolute -bottom-16 -right-16 w-80 h-80 border-[20px] border-green-300/30 rounded-full animate-spin-slow [animation-direction:reverse;]"
      ></div>
    </div>

    <div
      class="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8"
    >
      <div
        class="w-full max-w-md"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { duration: 800, ease: 'easeOut' },
        }"
      >
        <div class="bg-white p-8 rounded-2xl shadow-lg w-full">
          <h1 class="text-3xl font-bold mb-2 text-gray-800">Login</h1>
          <p class="text-gray-500 mb-8">
            Lengkapi form dibawah ini dengan data anda yang valid
          </p>

          <form @submit.prevent="handleLogin">
            <!-- <div class="mb-5"> -->
            <!-- <label
                for="username"
                class="block mb-2 text-sm font-medium text-gray-600"
                >User name</label
              >
              <input
                v-model="credentials.username"
                type="text"
                id="username"
                placeholder="Enter your Username"
                class="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-300"
              /> -->
            <!-- <label for="email">Email</label>
              <input
                v-model="credentials.Email"
                type="email"
                id="email"
                placeholder="Enter your Email"
              />
            </div> -->
            <div class="mb-5">
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-600"
              >
                Email
              </label>

              <input
                v-model="credentials.email"
                type="email"
                id="email"
                placeholder="Enter your Email"
                class="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div class="mb-5">
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-600"
                >Password</label
              >
              <div class="relative">
                <input
                  v-model="credentials.password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  placeholder="Enter your Password"
                  class="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-300 pr-12"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600"
                >
                  <Icon
                    :icon="
                      showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'
                    "
                    class="w-5 h-5"
                  />
                </button>
              </div>
            </div>
            <div class="flex items-center justify-between mb-8">
              <div class="flex items-center">
                <input
                  v-model="rememberMe"
                  id="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-[#10B981] border-gray-300 rounded focus:ring-[#10B981]"
                />
                <label
                  for="remember-me"
                  class="ml-2 block text-sm text-gray-700"
                  >Remember Me</label
                >
              </div>
              <a href="#" class="text-sm text-[#10B981] hover:underline"
                >Forgot Password?</a
              >
            </div>
            <button
              type="submit"
              class="w-full bg-[#10B981] text-white py-3 rounded-full font-semibold text-lg hover:bg-green-600 transition-colors duration-300"
            >
              Login
            </button>
            <p
              v-if="errorMessage"
              class="text-red-500 text-sm mt-4 text-center"
            >
              {{ errorMessage }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Menambahkan keyframes untuk animasi custom */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Mengaplikasikan animasi menggunakan class utility */
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-spin-slow {
  animation: spin-slow 50s linear infinite;
}
</style>
