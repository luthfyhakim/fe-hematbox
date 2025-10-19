<!-- <script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

// Helper function untuk mengambil gambar dari folder assets
const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

// State untuk form registrasi
const email = ref("");
const username = ref("");
const password = ref("");
const showPassword = ref(false);

// Fungsi untuk toggle visibilitas password
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Fungsi untuk handle submit form
const handleRegister = () => {
  console.log({
    email: email.value,
    username: username.value,
    password: password.value,
  });
  // Di sini Anda akan menambahkan logika registrasi sebenarnya
};
</script> -->
<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import authService from "@/services/authService";
import { useRouter } from "vue-router";

// Helper function untuk gambar
const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

// Menampung semua data form dalam satu objek
const userData = ref({
  name: "",
  email: "",
  password: "",
  phone_number: "",
  role: "customer", // Nilai default
});

// State lainnya
const showPassword = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);
const router = useRouter();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Fungsi untuk mengirim data ke API saat tombol Register diklik
const handleRegister = async () => {
  errorMessage.value = null;
  successMessage.value = null;
  try {
    await authService.register(userData.value);
    successMessage.value = "Registrasi berhasil! Anda akan dialihkan...";

    // Alihkan ke halaman login setelah 2 detik
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.error ||
      "Registrasi gagal. Periksa kembali data Anda.";
    console.error("Registrasi gagal:", error);
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
          <h1 class="text-3xl font-bold mb-2 text-gray-800">Register</h1>
          <p class="text-gray-500 mb-8">
            Lengkapi form dibawah ini dengan data anda yang valid
          </p>

          <!-- <form @submit.prevent="handleRegister">
            <div class="mb-5">
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-600"
                >Email</label
              >
              <input
                v-model="email"
                type="email"
                id="email"
                placeholder="Enter your Email Address"
                class="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <div class="mb-5">
              <label
                for="username"
                class="block mb-2 text-sm font-medium text-gray-600"
                >User name</label
              >
              <input
                v-model="username"
                type="text"
                id="username"
                placeholder="Enter your User Username"
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
                  v-model="password"
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

            <button
              type="submit"
              class="w-full bg-[#10B981] text-white py-3 rounded-full font-semibold text-lg hover:bg-green-600 transition-colors duration-300 mt-8"
            >
              Register
            </button>
          </form> -->
          <form @submit.prevent="handleRegister">
            <div class="mb-5">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-600"
                >Nama Lengkap</label
              >
              <input
                v-model="userData.name"
                type="text"
                id="name"
                placeholder="Masukkan Nama Lengkap Anda"
                class="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <div class="mb-5">
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-600"
                >Email</label
              >
              <input
                v-model="userData.email"
                type="email"
                id="email"
                placeholder="Masukkan Alamat Email Anda"
                class="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <div class="mb-5">
              <label
                for="phone_number"
                class="block mb-2 text-sm font-medium text-gray-600"
                >Nomor Telepon</label
              >
              <input
                v-model="userData.phone_number"
                type="tel"
                id="phone_number"
                placeholder="Contoh: 081234567890"
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
                  v-model="userData.password"
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

            <div class="mb-5">
              <label class="block mb-2 text-sm font-medium text-gray-600"
                >Daftar sebagai</label
              >
              <div class="flex gap-x-6 mt-2">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="userData.role"
                    value="consumer"
                    class="text-[#10B981] focus:ring-[#10B981]"
                  />
                  <span class="ml-2 text-sm text-gray-700">Pelanggan</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="userData.role"
                    value="business"
                    class="text-[#10B981] focus:ring-[#10B981]"
                  />
                  <span class="ml-2 text-sm text-gray-700">Mitra Bisnis</span>
                </label>
              </div>
            </div>

            <p
              v-if="successMessage"
              class="text-green-500 text-sm my-4 text-center"
            >
              {{ successMessage }}
            </p>
            <p
              v-if="errorMessage"
              class="text-red-500 text-sm my-4 text-center"
            >
              {{ errorMessage }}
            </p>

            <button
              type="submit"
              class="w-full bg-[#10B981] text-white py-3 rounded-full font-semibold text-lg hover:bg-green-600 transition-colors duration-300 mt-4"
            >
              Register
            </button>
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
