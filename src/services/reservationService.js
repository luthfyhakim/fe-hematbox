// src/services/reservationService.js
import apiClient from "./apiClient";

export default {
  /**
   * Mengupdate data reservasi (termasuk status pesanan & pembayaran).
   * @param {number} id - ID Reservasi
   * @param {object} payload - Berisi { status, payment_status }
   */
  updateReservation(id, payload) {
    return apiClient.put(`/reservations/${id}`, payload);
  },

  /**
   * Menghapus sebuah reservasi.
   * @param {number} id - ID Reservasi
   */
  deleteReservation(id) {
    return apiClient.delete(`/reservations/${id}`);
  },
};
