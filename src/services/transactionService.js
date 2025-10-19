// Lokasi file: src/services/transactionService.js

import apiClient from "./apiClient";

export default {
  /**
   * Mengirim data checkout untuk membuat reservasi dan transaksi baru.
   * @param {object} checkoutData - Berisi { offer_id, quantity, payment_method }
   */
  createCheckout(checkoutData) {
    // Memanggil: POST /api/v1/checkout
    return apiClient.post("/checkout", checkoutData);
  },

  /**
   * Mengambil semua riwayat transaksi untuk pengguna yang sedang login.
   */
  getUserTransactions() {
    // Memanggil: GET /api/v1/customer/transactions
    return apiClient.get("/customer/transactions");
  },

  /**
   * Mengambil detail satu invoice berdasarkan kodenya.
   * @param {string} invoiceCode - Kode unik invoice, contoh: "HB-XYZ123"
   */
  //   getInvoiceByCode(invoiceCode) {
  //     // Memanggil: GET /api/v1/invoices/:invoice_code
  //     return apiClient.get(`/invoices/${invoiceCode}`);
  //   },
  // --- FUNGSI INI SEHARUSNYA SEPERTI INI ---
  getTransactionByInvoiceCode(invoiceCode) {
    // Pastikan endpoint-nya sesuai dengan backend Anda
    return apiClient.get(`/transactions/${invoiceCode}`);
  },
};
