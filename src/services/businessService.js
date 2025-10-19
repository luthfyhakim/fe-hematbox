// src/services/businessService.js

import apiClient from "./apiClient";

export default {
  /**
   * Memperbarui profil bisnis.
   * Karena ada kemungkinan upload file, kita gunakan FormData.
   * @param {number} businessId - ID dari bisnis yang akan diupdate.
   * @param {object} profileData - Objek dari businessProfile store.
   */

  /**
   * (UNTUK LANGKAH 3)
   * Memeriksa/mengambil profil bisnis milik pengguna yang sedang login.
   * Dipanggil dari LoginView.vue.
   */

  // ▼▼▼ TAMBAHKAN FUNGSI BARU INI ▼▼▼
  /**
   * Mengambil semua data bisnis (publik).
   * Ini akan memanggil endpoint GET /api/v1/businesses
   */
  getBusinesses() {
    return apiClient.get("/businesses");
  },
  // ▲▲▲ FUNGSI BARU DITAMBAHKAN ▲▲▲

  getMyBusinessProfile() {
    return apiClient.get("/businesses/me");
  },
  getMyBusiness() {
    // NAMA FUNGSI DIPERBAIKI (sebelumnya getMyBusinessProfile)
    return apiClient.get("/businesses/me");
  },

  /**
   * (UNTUK LANGKAH 4)
   * Membuat profil bisnis baru.
   * Dipanggil dari CreateProfileView.vue.
   * @param {FormData} profileData - Data profil dari form (termasuk file).
   */
  createProfile(profileData) {
    // Axios akan otomatis mengatur header Content-Type menjadi 'multipart/form-data'
    // saat mendeteksi data yang dikirim adalah instance dari FormData.
    return apiClient.post("/businesses", profileData);
  },

  // updateBusinessProfile(businessId, profileData) {
  //   const formData = new FormData();

  //   // Tambahkan semua field ke formData
  //   formData.append("business_name", profileData.name);
  //   formData.append("address", profileData.address);
  //   formData.append("description", profileData.description); // Pastikan backend sudah punya field ini
  //   formData.append("phone_number", profileData.phone);
  //   formData.append("latitude", profileData.latitude);
  //   formData.append("longitude", profileData.longitude);

  // Untuk file gambar, kita perlu logika tambahan.
  // Jika logoUrl adalah blob (pratinjau), kita perlu file aslinya.
  // Ini adalah implementasi yang lebih kompleks, untuk sekarang kita kirim data teks dulu.
  // formData.append('image_url', fileObject);

  // FUNGSI BARU YANG DITAMBAHKAN
  getMyBusinessOffers() {
    return apiClient.get("/businesses/me/offers");
  },

  // ▼▼▼ TAMBAHKAN FUNGSI YANG HILANG DI SINI ▼▼▼
  /**
   * Mengambil semua reservasi/pembelian dari bisnis milik pengguna yang sedang login.
   */
  getMyBusinessReservations() {
    return apiClient.get("/businesses/me/reservations");
  },
  // ▲▲▲ FUNGSI DITAMBAHKAN ▲▲▲

  updateBusinessProfile(businessId, profileData, logoFile) {
    const formData = new FormData();

    // Tambahkan semua field teks ke formData
    formData.append("business_name", profileData.name);
    formData.append("address", profileData.address);
    formData.append("description", profileData.description);
    formData.append("phone_number", profileData.phone);
    formData.append("latitude", profileData.latitude);
    formData.append("longitude", profileData.longitude);

    // Tambahkan file gambar jika ada yang baru dipilih
    if (logoFile) {
      // formData.append("image_url", logoFile);
      // BENAR: Gunakan kunci "image" agar konsisten
      formData.append("image", logoFile);
    }

    // Kirim sebagai PUT request
    return apiClient.put(`/businesses/${businessId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // Trik untuk metode PUT dengan FormData
      params: {
        _method: "PUT",
      },
    });
  },
  // INI BAGIAN YANG PALING PENTING UNTUK DITAMBAHKAN
  getBusinessById(id) {
    return apiClient.get(`/businesses/${id}`);
  },
};
