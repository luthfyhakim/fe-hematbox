// Lokasi: src/store/profileStore.js

import { reactive } from "vue";
import apiClient from "@/services/apiClient"; // Pastikan path benar

export const businessProfile = reactive({
  id: null, // Tambahkan ID
  name: "Memuat Data Bisnis...",
  description: "Sedang memuat detail profil...",
  address: "Memuat lokasi...",
  phone: "...",
  email: "...",
  logoUrl: "https://via.placeholder.com/150?text=Logo", // Placeholder
  latitude: 0,
  longitude: 0,
  operatingHours: [],
});

// export async function fetchBusinessProfile() {
//   try {
//     // [PERBAIKAN KRUSIAL URL] Pastikan TIDAK ADA ID atau variabel lain di sini.
//     const response = await apiClient.get("/businesses/me");
//     const profileData = response.data;

//     // Asumsi respons langsung mengembalikan DTO, atau ambil dari kunci 'data'
//     const businessDetail = profileData.data || profileData; // --- MAPPING FIELD SESUAI BUSSINESSDetailResponse DTO Go ---

//     businessProfile.id = businessDetail.id;
//     // Data Dasar
//     businessProfile.name = businessDetail.business_name; // Sesuai DTO Go
//     businessProfile.address = businessDetail.address;
//     // Data Kontak (BERSARANG)
//     businessProfile.phone = businessDetail.contact_person.PhoneNumber;
//     businessProfile.email =
//       businessDetail.contact_person.Email || "Email Belum Tersedia"; // Sesuaikan jika DTO Anda punya field Email

//     // Data Lokasi (BERSARANG)
//     businessProfile.latitude = parseFloat(businessDetail.location.Latitude);
//     businessProfile.longitude = parseFloat(businessDetail.location.Longitude);

//     // Data Tambahan
//     businessProfile.description = "Profil bisnis dimuat."; // Tambahkan description default // URL Logo
//     if (businessDetail.image_url) {
//       businessProfile.logoUrl = `https://hematbox.sugengaldi.my.id/${businessDetail.image_url}`;
//     } // [OPSIONAL] Mapping Jam Operasional jika ada // businessProfile.operatingHours = businessDetail.offers; // Gantilah ini dengan field jam operasional jika sudah ada
//   } catch (error) {
//     console.error("Gagal mengambil detail bisnis:", error); // Tampilkan pesan error di UI
//     businessProfile.name = "Gagal Memuat Data Bisnis";
//     businessProfile.description =
//       "Pastikan Anda sudah login dan server backend berjalan.";
//   }
// }
export async function fetchBusinessProfile() {
  try {
    const response = await apiClient.get("/businesses/me");

    // Langsung gunakan response.data
    const businessDetail = response.data;

    businessProfile.id = businessDetail.id;

    // Data Dasar
    businessProfile.name = businessDetail.business_name;
    businessProfile.address = businessDetail.address;

    // [BENAR] Mengambil deskripsi dari data API dengan fallback
    businessProfile.description =
      businessDetail.description || "Deskripsi bisnis belum diatur.";

    // [BENAR] Menggunakan .phone_number (snake_case)
    businessProfile.phone = businessDetail.contact_person.phone_number;
    // [BENAR] Menggunakan .email (snake_case)
    businessProfile.email =
      businessDetail.contact_person.email || "Email Belum Tersedia";

    // [BENAR] Menggunakan .latitude (snake_case)
    businessProfile.latitude = parseFloat(businessDetail.location.latitude);
    // [BENAR] Menggunakan .longitude (snake_case)
    businessProfile.longitude = parseFloat(businessDetail.location.longitude);

    // [BENAR] Logika lengkap untuk URL Logo
    if (businessDetail.image_url) {
      if (businessDetail.image_url.startsWith("http")) {
        businessProfile.logoUrl = businessDetail.image_url;
      } else {
        businessProfile.logoUrl = `https://hematbox.sugengaldi.my.id/${businessDetail.image_url}`;
      }
    } else {
      // Sediakan placeholder jika tidak ada gambar dari API
      businessProfile.logoUrl = "https://via.placeholder.com/150?text=Logo";
    }
  } catch (error) {
    console.error("Gagal mengambil detail bisnis:", error);
    businessProfile.name = "Gagal Memuat Data Bisnis";
    businessProfile.description =
      "Pastikan Anda sudah login dan server backend berjalan.";
  }
}
