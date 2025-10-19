// // src/services/offerService.js

// // Mengimpor apiClient yang terpusat
// import apiClient from "./apiClient";

// export default {
//   /**
//    * Mengambil semua data penawaran.
//    * Tidak perlu menambahkan header otorisasi secara manual karena
//    * sudah ditangani oleh Axios Interceptor di apiClient.js.
//    */
//   getOffers() {
//     // Permintaan ini sekarang akan otomatis menyertakan header 'Authorization: Bearer <token>'
//     return apiClient.get("/offers");
//   },

//   // ▼▼▼ TAMBAHKAN FUNGSI YANG HILANG DI SINI ▼▼▼
//   /**
//    * Mengambil satu data penawaran berdasarkan ID.
//    */
//   getOfferById(id) {
//     // Akan memanggil endpoint seperti GET /offers/13
//     return apiClient.get(`/offers/${id}`);
//   },
//   // ▲▲▲ FUNGSI SELESAI DITAMBAHKAN ▲▲▲

//   /**
//    * Menambahkan penawaran baru.
//    */
//   createOffer(offerData) {
//     // Tambahkan token otomatis dari apiClient, hanya override Content-Type jika perlu
//     return apiClient.post("/offers", offerData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   },

//   /**
//    * Memperbarui penawaran yang sudah ada.
//    */
//   updateOffer(offerId, offerData) {
//     // Tambahkan token otomatis dari apiClient
//     return apiClient.put(`/offers/${offerId}`, offerData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   },

//   /**
//    * Menghapus penawaran.
//    */
//   deleteOffer(offerId) {
//     // Tambahkan token otomatis dari apiClient
//     return apiClient.delete(`/offers/${offerId}`);
//   },
// };
// src/services/offerService.js

// Mengimpor apiClient yang terpusat
import apiClient from "./apiClient";

export default {
  /**
   * Mengambil semua data penawaran.
   */
  getOffers() {
    return apiClient.get("/offers");
  },

  /**
   * Mengambil satu data penawaran berdasarkan ID.
   */
  getOfferById(id) {
    return apiClient.get(`/offers/${id}`);
  },

  /**
   * Menambahkan penawaran baru.
   */
  createOffer(offerData) {
    // ▼▼▼ PERBAIKAN: Hapus objek headers dari sini ▼▼▼
    return apiClient.post("/offers", offerData);
  },

  /**
   * Memperbarui penawaran yang sudah ada.
   */
  updateOffer(offerId, offerData) {
    // ▼▼▼ PERBAIKAN: Hapus objek headers dari sini juga ▼▼▼
    return apiClient.put(`/offers/${offerId}`, offerData);
  },

  /**
   * Menghapus penawaran.
   */
  // deleteOffer(offerId) {
  //   return apiClient.delete(`/offers/${offerId}`);
  // },
  /**
   * Menghapus penawaran.
   * @param {number} businessId - ID bisnis pemilik penawaran.
   * @param {number} offerId - ID penawaran yang akan dihapus.
   */
  deleteOffer(businessId, offerId) {
    // INI ADALAH BAGIAN YANG PALING PENTING UNTUK DIPERBAIKI
    return apiClient.delete(`/businesses/${businessId}/offers/${offerId}`);
  },
};
