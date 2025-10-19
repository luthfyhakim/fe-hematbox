<script setup>
import { ref } from "vue"; // 1. Tambahkan ref
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
// Impor data terpusat dari store
import { userProfile } from "@/store/userProfileStore.js";
// 2. Impor service yang akan kita buat
import userService from "@/services/userService.js";

const router = useRouter();
// 3. Buat ref untuk menampung file gambar baru
const avatarFile = ref(null);

// Fungsi untuk menangani pratinjau gambar saat dipilih
// const handleAvatarChange = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     userProfile.avatar_url = URL.createObjectURL(file);
//     // Di aplikasi nyata, Anda akan mengunggah 'file' ini ke server
//   }
// };

// 4. Perbarui fungsi handleAvatarChange
const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    avatarFile.value = file; // Simpan file untuk di-upload
    userProfile.avatar_url = URL.createObjectURL(file); // Tampilkan pratinjau
  }
};

// const saveChanges = () => {
//   // Di aplikasi nyata, Anda akan mengirim data ini ke API
//   alert("Profil berhasil diperbarui!");
//   router.push({ name: "customer-profile" });
// };
// 5. Implementasikan fungsi saveChanges
const saveChanges = async () => {
  try {
    // Panggil service untuk mengirim data ke API
    await userService.updateProfile(userProfile, avatarFile.value);

    alert("Profil berhasil diperbarui!");
    router.push({ name: "customer-profile" });
  } catch (error) {
    console.error("Gagal menyimpan profil:", error);
    alert("Terjadi kesalahan saat menyimpan perubahan.");
  }
};

const cancelEdit = () => {
  // Di aplikasi nyata, Anda perlu me-reset data dari store atau mengambil ulang dari API
  if (confirm("Perubahan yang belum disimpan akan hilang. Lanjutkan?")) {
    router.back();
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- HEADER -->
      <div class="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-4xl font-bold text-gray-800">Edit Profil</h1>
          <p class="text-gray-600 mt-2">
            Perbarui informasi personal dan foto profil Anda.
          </p>
        </div>
      </div>

      <!-- KONTEN UTAMA: LAYOUT 2 KOLOM -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- KOLOM KIRI: FOTO PROFIL -->
        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Foto Profil</h3>
            <div class="relative group inline-block">
              <img
                :src="userProfile.avatar_url"
                alt="Avatar"
                class="w-40 h-40 rounded-full object-cover ring-4 ring-teal-100 mx-auto"
              />
              <label
                for="avatar-upload"
                class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div class="text-center">
                  <Icon icon="mdi:camera-flip-outline" class="w-8 h-8" />
                  <span class="text-xs font-semibold mt-1 block"
                    >Ganti Foto</span
                  >
                </div>
              </label>
              <input
                type="file"
                id="avatar-upload"
                class="hidden"
                @change="handleAvatarChange"
                accept="image/*"
              />
            </div>
            <h4 class="text-xl font-bold text-gray-800 mt-6">
              {{ userProfile.name }}
            </h4>
            <p class="text-sm text-gray-500">{{ userProfile.email }}</p>
          </div>
        </div>

        <!-- KOLOM KANAN: FORM EDIT -->
        <div class="lg:col-span-2">
          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <h3
              class="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-8"
            >
              <div class="bg-teal-100 p-3 rounded-xl">
                <Icon
                  icon="mdi:card-account-details-outline"
                  class="text-teal-600 w-6 h-6"
                />
              </div>
              Informasi Personal
            </h3>
            <form @submit.prevent="saveChanges" class="flex flex-col h-full">
              <div class="space-y-6 flex-grow">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Nama Lengkap</label
                  >
                  <div class="relative">
                    <Icon
                      icon="mdi:account-outline"
                      class="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                    />
                    <input
                      type="text"
                      id="name"
                      v-model="userProfile.name"
                      class="w-full pl-11 p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Alamat Email</label
                  >
                  <div class="relative">
                    <Icon
                      icon="mdi:email-outline"
                      class="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                    />
                    <input
                      type="email"
                      id="email"
                      v-model="userProfile.email"
                      class="w-full pl-11 p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Nomor Telepon</label
                  >
                  <div class="relative">
                    <Icon
                      icon="mdi:phone-outline"
                      class="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                    />
                    <input
                      type="tel"
                      id="phone"
                      v-model="userProfile.phone_number"
                      class="w-full pl-11 p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition"
                    />
                  </div>
                </div>
              </div>

              <!-- Tombol aksi sekarang ada di bawah form -->
              <div
                class="flex justify-end gap-3 pt-8 mt-8 border-t border-gray-200"
              >
                <button
                  type="button"
                  @click="cancelEdit"
                  class="bg-white text-teal-700 px-5 py-2.5 rounded-lg font-semibold border border-teal-600 hover:bg-gray-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 flex items-center gap-2 transition-all"
                >
                  <Icon icon="mdi:content-save" class="w-5 h-5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
