import { reactive } from "vue";
import apiClient from "@/services/apiClient";

export const userProfile = reactive({
  id: null,
  name: "Memuat nama...",
  email: "Memuat email...",
  phone_number: "...",
  role: "",
  avatar_url: "https://via.placeholder.com/150", // Placeholder awal
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export async function fetchUserProfile() {
  try {
    const response = await apiClient.get("/auth/profile");
    // Respons GET /auth/profile Anda sepertinya tidak dibungkus 'data' lagi, jadi langsung saja
    const userData = response.data;
    // const userData = response.data.data; // Sesuaikan dengan struktur respons Anda

    // Update state dengan data dari server
    userProfile.id = userData.id;
    userProfile.name = userData.name;
    userProfile.email = userData.email;
    userProfile.phone_number = userData.phone_number;
    userProfile.role = userData.role;
    userProfile.created_at = userData.created_at;
    userProfile.updated_at = userData.updated_at;

    // Logika untuk menangani URL Avatar
    if (userData.avatar_url) {
      // Jika ada avatar dari backend, buat URL lengkapnya
      userProfile.avatar_url = `https://hematbox.sugengaldi.my.id/${userData.avatar_url}`;
    } else {
      // Jika tidak ada, gunakan avatar default berdasarkan inisial nama
      userProfile.avatar_url = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userData.name
      )}&background=0D8ABC&color=fff`;
    }
  } catch (error) {
    console.error("Gagal mengambil profil pengguna:", error);
    // Jika gagal, tampilkan pesan error
    userProfile.name = "Gagal memuat data";
    userProfile.email = "Tidak dapat terhubung ke server.";
  }
}
