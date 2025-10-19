<script setup>
// 1. Tambahkan onMounted
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AdminSidebar from "../components/AdminSidebar.vue";
import { Icon } from "@iconify/vue";

// 2. Impor store dan service yang kita butuhkan
import { businessProfile, fetchBusinessProfile } from "@/store/profileStore.js";
import authService from "@/services/authService.js";

const router = useRouter();
const route = useRoute();
const isProfileMenuOpen = ref(false);

const pageTitle = computed(() => {
  return route.meta.title || "Dashboard";
});

// 3. Panggil fetchBusinessProfile saat komponen pertama kali dimuat
onMounted(() => {
  fetchBusinessProfile();
});

// 4. Perbaiki fungsi logout agar memanggil service terpusat
const logout = () => {
  isProfileMenuOpen.value = false;
  // Panggil fungsi logout dari authService yang akan membersihkan localStorage
  authService.logout();
};
</script>

<template>
  <div class="flex h-screen bg-slate-100 font-sans">
    <AdminSidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="bg-white border-b border-gray-200 p-4 flex justify-between items-center flex-shrink-0 relative z-10"
      >
        <h1 class="text-xl font-bold text-gray-800">
          {{ pageTitle }}
        </h1>

        <div class="flex items-center gap-6">
          <div class="relative w-64">
            <input
              type="text"
              placeholder="Cari..."
              class="w-full py-2 pl-4 pr-10 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
            />
            <Icon
              icon="mdi:magnify"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
          </div>
          <button class="text-gray-500 hover:text-gray-700 relative">
            <Icon icon="mdi:bell-outline" class="w-6 h-6" />
            <span
              class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
            ></span>
          </button>

          <div class="relative">
            <button
              @click="isProfileMenuOpen = !isProfileMenuOpen"
              class="flex items-center gap-3 cursor-pointer"
            >
              <img
                :src="businessProfile.logoUrl"
                alt="User Avatar"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p class="font-semibold text-sm text-gray-800">
                  {{ businessProfile.name }}
                </p>
                <p class="text-xs text-gray-500 capitalize">
                  {{ businessProfile.role }}
                </p>
              </div>
            </button>

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
                  <router-link
                    :to="{ name: 'business-profile' }"
                    @click="isProfileMenuOpen = false"
                    class="group flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200 w-full text-left"
                  >
                    <Icon
                      icon="mdi:storefront-outline"
                      class="w-5 h-5 text-teal-600 group-hover:text-teal-600 transition-colors duration-200"
                    />
                    <span class="text-teal-600">Profil Bisnis</span>
                  </router-link>

                  <div class="border-t border-gray-100 my-1"></div>

                  <button
                    @click="logout"
                    class="group flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 w-full text-left transition-colors duration-200"
                  >
                    <Icon
                      icon="mdi:logout"
                      class="w-5 h-5 text-teal-600 group-hover:text-red-600 transition-colors duration-200"
                    />
                    <span class="text-teal-600">Logout</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto bg-slate-100 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
