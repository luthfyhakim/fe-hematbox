// Lokasi file: src/services/apiClient.js

import axios from "axios";

const apiClient = axios.create({
  // URL dasar untuk semua endpoint API Anda
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://hematbox.sugengaldi.my.id/api/v1",
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

/**
 * Interceptor: Kode ini berjalan secara otomatis SEBELUM setiap request dikirim.
 * Tugasnya adalah memeriksa localStorage, dan jika ada 'token',
 * token tersebut akan ditambahkan ke header Authorization.
 */
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    // [DIPERBAIKI] Menggunakan 'access_token' agar konsisten
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
