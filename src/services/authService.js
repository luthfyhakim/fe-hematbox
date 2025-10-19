// import axios from "axios";
// ✅ Mengimpor apiClient yang terpusat, bukan axios
import apiClient from "./apiClient";
import router from "@/router"; // Impor router untuk redirect

// 1. Konfigurasi instance Axios
// const apiClient = axios.create({
//   // URL dasar ini harus cocok dengan grup rute di Go Anda
//   baseURL:
//     import.meta.env.VITE_API_BASE_URL || "https://hematbox.sugengaldi.my.id/api/v1/auth",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// 2. Interceptor (PENTING untuk Otentikasi)
// Interceptor ini akan berjalan SEBELUM setiap permintaan dikirim.
// Tugasnya adalah memeriksa apakah ada token di localStorage,
// dan jika ada, melampirkannya ke header Authorization.
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 3. Ekspor semua fungsi yang dibutuhkan
export default {
  /**
   * Mengirim data login ke backend.
   * @param {object} credentials - Objek berisi { username, password }.
   */
  /**
   * Mengirim data login ke backend.
   * @param {object} credentials - Objek berisi { email, password }.
   */
  login(credentials) {
    return apiClient.post("/auth/login", credentials);
  },

  /**
   * Mengirim data registrasi ke backend.
   * @param {object} userData - Objek berisi data pengguna baru.
   */
  register(userData) {
    return apiClient.post("/auth/register", userData);
  },

  /**
   * Mengambil data profil pengguna yang sedang login.
   * (Interceptor akan otomatis melampirkan token).
   */
  getProfile() {
    return apiClient.get("/auth/profile");
  },

  /**
   * Memperbarui data profil pengguna.
   * @param {object} profileData - Data baru untuk profil.
   */
  updateProfile(profileData) {
    return apiClient.put("/profile", profileData);
  },
  logout() {
    // Hapus token dan data pengguna dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Arahkan kembali ke halaman login
    router.push({ name: "login" });
  },
  /**
   * Proses logout.
   */
  // logout() {
  //   // Hapus token dari localStorage
  //   localStorage.removeItem("token");
  //   // Arahkan ke halaman login
  //   router.push({ name: "Login" }); // Pastikan Anda punya route bernama 'Login'
  // },

  // Anda bisa tambahkan fungsi lain sesuai router.go di sini
  // seperti forgotPassword, resetPassword, dll.
  // ==========================================================
  // ▼▼▼ FUNGSI YANG HILANG ADA DI SINI ▼▼▼
  // ==========================================================
  /**
   * Mengirim data perubahan password ke backend untuk user yang sudah login.
   * @param {object} passwordData - Berisi currentPassword dan newPassword.
   */
  changePassword(passwordData) {
    // Menggunakan POST ke /auth/reset-password (sesuai pendekatan "hybrid" kita)
    return apiClient.post("/auth/reset-password", {
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword,
    });
  },
  // ==========================================================
  // ▲▲▲ AKHIR DARI FUNGSI YANG HILANG ▲▲▲
  // ==========================================================
};
