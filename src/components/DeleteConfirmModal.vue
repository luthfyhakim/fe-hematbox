<script setup>
import { Icon } from "@iconify/vue";

defineProps({
  modelValue: Boolean, // Untuk v-model
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const handleConfirm = () => {
  emit("confirm");
  closeModal();
};

const closeModal = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm text-center p-8">
      <!-- Ikon Peringatan -->
      <div
        class="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4"
      >
        <Icon icon="mdi:alert-outline" class="w-10 h-10 text-red-500" />
      </div>

      <!-- Konten Teks -->
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Anda Yakin?</h2>
      <p class="text-gray-500 mb-8">
        Tindakan ini akan menghapus data secara permanen dan tidak dapat
        dibatalkan.
      </p>

      <!-- Tombol Aksi -->
      <div class="flex justify-center gap-4">
        <button
          @click="closeModal"
          class="px-6 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-200 w-full"
        >
          Batal
        </button>
        <button
          @click="handleConfirm"
          class="px-6 py-2.5 bg-red-600 border border-transparent rounded-lg text-sm font-semibold text-white hover:bg-red-700 w-full"
        >
          Ya, Hapus
        </button>
      </div>
    </div>
  </div>
</template>
