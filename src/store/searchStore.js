import { ref } from "vue";

// Ini akan menyimpan kata kunci pencarian secara global
export const searchQuery = ref("");

// Fungsi helper untuk mengubah kata kunci dari komponen mana pun
export function setSearchQuery(query) {
  searchQuery.value = query;
}
