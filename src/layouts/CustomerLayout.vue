<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import CustomerSidebar from "../components/CustomerSidebar.vue";
import { Icon } from "@iconify/vue";
// Impor data profil pengguna dari store untuk memastikan data selalu sinkron
import { userProfile } from "@/store/userProfileStore.js";

const router = useRouter();
// State untuk mengontrol menu dropdown
const isProfileMenuOpen = ref(false);

// Fungsi untuk logout
const logout = () => {
  // Di aplikasi nyata, Anda akan menghapus sesi login di sini
  isProfileMenuOpen.value = false;
  router.push({ name: "login" });
};
</script>

<template>
  <div class="flex h-screen bg-slate-100 font-sans">
    <!-- Sidebar Customer -->
    <CustomerSidebar />

    <!-- Konten Utama -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="bg-white border-b border-gray-200 p-4 flex justify-end items-center flex-shrink-0 relative z-10"
      >
        <div class="flex items-center gap-6">
          <button class="text-gray-500 hover:text-gray-700 relative">
            <Icon icon="mdi:bell-outline" class="w-6 h-6" />
            <span
              class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
            ></span>
          </button>

          <!-- Bagian profil dengan data dinamis -->
          <div class="relative">
            <!-- Tombol untuk membuka/menutup menu -->
            <button
              @click="isProfileMenuOpen = !isProfileMenuOpen"
              class="flex items-center gap-3 cursor-pointer"
            >
              <!-- [TERHUBUNG] Avatar ini mengambil URL gambar dari userProfileStore.js -->
              <img
                :src="userProfile.avatar_url"
                alt="User Avatar"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <!-- [TERHUBUNG] Nama ini mengambil nama dari userProfileStore.js -->
                <p class="font-semibold text-sm text-gray-800">
                  {{ userProfile.name }}
                </p>
                <p class="text-xs text-gray-500">Pelanggan</p>
              </div>
            </button>

            <!-- Menu Dropdown -->
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="isProfileMenuOpen"
                class="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="py-1">
                  <!-- Link ke Profil Customer -->
                  <router-link
                    :to="{ name: 'customer-profile' }"
                    @click="isProfileMenuOpen = false"
                    class="group flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors w-full text-left"
                  >
                    <Icon
                      icon="mdi:account-circle-outline"
                      class="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors"
                    />
                    <span>Profil Saya</span>
                  </router-link>

                  <div class="border-t border-gray-100 my-1"></div>

                  <!-- Tombol Logout -->
                  <button
                    @click="logout"
                    class="group flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 w-full text-left transition-colors"
                  >
                    <Icon
                      icon="mdi:logout"
                      class="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors"
                    />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
