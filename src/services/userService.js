import apiClient from "./apiClient";

export default {
  /**
   * Memperbarui data profil pengguna.
   * @param {Object} userData - Data dari userProfile store.
   * @param {File|null} avatarFile - File gambar baru jika ada.
   */
  updateProfile(userData, avatarFile) {
    const formData = new FormData();

    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("phone_number", userData.phone_number);

    // Backend Anda harus disiapkan untuk menerima 'avatar'
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    // Endpoint ini harus cocok dengan endpoint update profil di backend
    return apiClient.put("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
