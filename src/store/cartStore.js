// src/stores/cartStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCartStore = defineStore("cart", () => {
  // State
  const items = ref([]); // Menyimpan item-item di keranjang

  // Getters (Computed Properties)
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.new_price * item.quantity,
      0
    );
  });

  // Actions (Methods)
  function addItem(offer) {
    const existingItem = items.value.find((item) => item.id === offer.id);

    if (existingItem) {
      // Jika item sudah ada, tambah jumlahnya
      existingItem.quantity++;
    } else {
      // Jika item baru, tambahkan ke keranjang
      items.value.push({ ...offer, quantity: 1 });
    }
  }

  function removeItem(offerId) {
    items.value = items.value.filter((item) => item.id !== offerId);
  }

  function clearCart() {
    items.value = [];
  }

  return { items, totalItems, totalPrice, addItem, removeItem, clearCart };
});
