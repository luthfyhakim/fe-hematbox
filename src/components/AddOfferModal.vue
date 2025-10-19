<!-- <script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue", "save"]);

// State untuk data dari form (tidak berubah)
const newOffer = ref({
  title: "",
  description: "",
  status: "aktif",
  price: null,
  pickup_end: "",
});
const stockInput = ref("");
const validationError = ref("");

// --- ▼▼▼ BAGIAN BARU UNTUK GAMBAR ▼▼▼ ---
const selectedImageFile = ref(null); // Untuk menampung file object
const imagePreviewUrl = ref(null); // Untuk URL preview gambar

// Fungsi untuk menangani saat user memilih file
const handleImageSelection = (event) => {
  const file = event.target.files[0];
  if (!file) {
    selectedImageFile.value = null;
    imagePreviewUrl.value = null;
    return;
  }

  // Simpan file object
  selectedImageFile.value = file;

  // Buat URL sementara untuk preview
  imagePreviewUrl.value = URL.createObjectURL(file);
};
// --- ▲▲▲ AKHIR BAGIAN BARU ---

const handleSave = () => {
  validationError.value = "";
  if (!newOffer.value.title.trim() || !stockInput.value) {
    validationError.value = "Nama Penawaran dan Total Porsi wajib diisi.";
    return;
  }
  // (Validasi lainnya tetap sama)

  const portion = parseInt(stockInput.value, 10) || 0;

  // --- ▼▼▼ PERUBAHAN: Menggunakan FormData untuk mengirim data + file ▼▼▼ ---
  const formData = new FormData();

  // Tambahkan semua data teks ke FormData
  formData.append("title", newOffer.value.title);
  formData.append("description", newOffer.value.description);
  formData.append("price", Number(newOffer.value.price) || 0);
  formData.append("total_portion", portion);
  formData.append("remaining_portion", portion);
  formData.append("pickup_end", newOffer.value.pickup_end);
  formData.append("status", newOffer.value.status.toLowerCase());

  // Tambahkan file gambar jika ada yang dipilih
  if (selectedImageFile.value) {
    formData.append("image", selectedImageFile.value); // 'image' adalah key yang akan diterima backend
  }

  // Kirim FormData ke parent component
  emit("save", formData);
  closeModal();
};

const closeModal = () => {
  emit("update:modelValue", false);

  setTimeout(() => {
    newOffer.value = {
      title: "",
      description: "",
      status: "aktif",
      price: null,
      pickup_end: "",
    };
    stockInput.value = "";
    validationError.value = "";
    // Reset state gambar juga
    selectedImageFile.value = null;
    imagePreviewUrl.value = null;
  }, 300);
};
</script> -->
<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue", "save"]);

// --- PERUBAHAN 1: Ganti state newOffer ---
const newOffer = ref({
  title: "",
  description: "",
  status: "aktif",
  price: null,
  pickup_date: new Date().toISOString().split("T")[0], // Tambah tanggal
  pickup_start_time: "", // Tambah waktu mulai
  pickup_end_time: "", // Ganti jadi waktu berakhir
});
const stockInput = ref("");
const validationError = ref("");

const selectedImageFile = ref(null);
const imagePreviewUrl = ref(null);

const handleImageSelection = (event) => {
  const file = event.target.files[0];
  if (!file) {
    selectedImageFile.value = null;
    imagePreviewUrl.value = null;
    return;
  }
  selectedImageFile.value = file;
  imagePreviewUrl.value = URL.createObjectURL(file);
};

// --- PERUBAHAN 2: Tambahkan helper untuk format waktu ---
const formatToISO = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return "";
  // Menggabungkan tanggal dan waktu, lalu konversi ke format ISO String (UTC)
  // Contoh: "2025-10-09" + "T" + "21:00:00" -> "2025-10-09T21:00:00.000Z"
  return new Date(`${dateStr}T${timeStr}:00`).toISOString();
};

// --- PERUBAHAN 3: Perbarui logika handleSave ---
const handleSave = () => {
  validationError.value = "";
  if (
    !newOffer.value.title.trim() ||
    !stockInput.value ||
    !newOffer.value.pickup_date ||
    !newOffer.value.pickup_start_time ||
    !newOffer.value.pickup_end_time
  ) {
    validationError.value =
      "Semua field (Nama, Porsi, Tanggal, Waktu) wajib diisi.";
    return;
  }

  const portion = parseInt(stockInput.value, 10) || 0;

  const formData = new FormData();

  formData.append("title", newOffer.value.title);
  formData.append("description", newOffer.value.description);
  formData.append("price", Number(newOffer.value.price) || 0);
  formData.append("total_portion", portion);
  formData.append("remaining_portion", portion);
  formData.append("status", newOffer.value.status.toLowerCase());

  // Kirim pickup_start dan pickup_end dalam format ISO
  formData.append(
    "pickup_start",
    formatToISO(newOffer.value.pickup_date, newOffer.value.pickup_start_time)
  );
  formData.append(
    "pickup_end",
    formatToISO(newOffer.value.pickup_date, newOffer.value.pickup_end_time)
  );

  if (selectedImageFile.value) {
    formData.append("image", selectedImageFile.value);
  }

  emit("save", formData);
  closeModal();
};

// --- PERUBAHAN 4: Perbarui logika closeModal ---
const closeModal = () => {
  emit("update:modelValue", false);
  setTimeout(() => {
    newOffer.value = {
      title: "",
      description: "",
      status: "aktif",
      price: null,
      pickup_date: new Date().toISOString().split("T")[0],
      pickup_start_time: "",
      pickup_end_time: "",
    };
    stockInput.value = "";
    validationError.value = "";
    selectedImageFile.value = null;
    imagePreviewUrl.value = null;
  }, 300);
};
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="modelValue"
          class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform"
        >
          <div
            class="p-6 border-b flex justify-between items-center bg-gray-50/50"
          >
            <div class="flex items-center gap-3">
              <Icon
                icon="mdi:package-variant-plus"
                class="w-8 h-8 text-teal-500"
              />
              <h2 class="text-2xl font-bold text-gray-800">
                Tambah Penawaran Baru
              </h2>
            </div>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-200"
            >
              <Icon icon="mdi:close" class="w-6 h-6" />
            </button>
          </div>

          <div class="p-8 max-h-[70vh] overflow-y-auto">
            <form @submit.prevent="handleSave" class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1"
                  >Gambar Penawaran</label
                >
                <div class="mt-1">
                  <div
                    v-if="imagePreviewUrl"
                    class="mb-3 relative w-full h-48 rounded-lg overflow-hidden"
                  >
                    <img
                      :src="imagePreviewUrl"
                      alt="Preview Gambar"
                      class="w-full h-full object-cover"
                    />
                    <button
                      @click="handleImageSelection({ target: { files: [] } })"
                      class="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition"
                    >
                      <Icon icon="mdi:close" class="w-5 h-5" />
                    </button>
                  </div>

                  <label
                    for="add-image"
                    class="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div
                      class="flex flex-col items-center justify-center pt-5 pb-6"
                    >
                      <Icon
                        icon="mdi:cloud-upload-outline"
                        class="w-10 h-10 mb-3 text-gray-400"
                      />
                      <p class="mb-2 text-sm text-gray-500">
                        <span class="font-semibold">Klik untuk upload</span>
                        atau seret gambar
                      </p>
                      <p class="text-xs text-gray-500">PNG, JPG atau JPEG</p>
                    </div>
                    <input
                      id="add-image"
                      type="file"
                      class="hidden"
                      @change="handleImageSelection"
                      accept="image/png, image/jpeg, image/jpg"
                    />
                  </label>
                </div>
              </div>
              <div class="relative">
                <label
                  for="add-title"
                  class="block text-sm font-semibold text-gray-700 mb-1"
                  >Nama Penawaran</label
                >
                <Icon
                  icon="mdi:tag-outline"
                  class="w-5 h-5 text-gray-400 absolute left-3 top-[42px]"
                />
                <input
                  v-model="newOffer.title"
                  type="text"
                  id="add-title"
                  placeholder="Contoh: Magic Box Pizza"
                  required
                  class="pl-10 pr-4 py-2.5 mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                />
              </div>

              <div class="relative">
                <label
                  for="add-description"
                  class="block text-sm font-semibold text-gray-700 mb-1"
                  >Deskripsi Singkat</label
                >
                <textarea
                  v-model="newOffer.description"
                  id="add-description"
                  rows="2"
                  placeholder="Contoh: Berisi 3 potong pizza aneka rasa"
                  class="px-4 py-2.5 mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="relative">
                  <label
                    for="add-price"
                    class="block text-sm font-semibold text-gray-700 mb-1"
                    >Harga</label
                  >
                  <Icon
                    icon="mdi:cash"
                    class="w-5 h-5 text-gray-400 absolute left-3 top-[42px]"
                  />
                  <input
                    v-model="newOffer.price"
                    type="number"
                    id="add-price"
                    placeholder="20000"
                    required
                    class="pl-10 pr-4 py-2.5 mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  />
                </div>
                <div class="relative">
                  <label
                    for="add-stock"
                    class="block text-sm font-semibold text-gray-700 mb-1"
                    >Total Porsi</label
                  >
                  <Icon
                    icon="mdi:package-variant-closed"
                    class="w-5 h-5 text-gray-400 absolute left-3 top-[42px]"
                  />
                  <input
                    v-model="stockInput"
                    type="number"
                    id="add-stock"
                    placeholder="5"
                    required
                    class="pl-10 pr-4 py-2.5 mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="relative">
                  <label
                    for="add-expires"
                    class="block text-sm font-semibold text-gray-700 mb-1"
                    >Waktu Berakhir</label
                  >
                  <Icon
                    icon="mdi:clock-outline"
                    class="w-5 h-5 text-gray-400 absolute left-3 top-[42px]"
                  />
                  <input
                    v-model="newOffer.pickup_end"
                    type="time"
                    id="add-expires"
                    class="pl-10 pr-4 py-2.5 mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  />
                </div>
                <div class="relative">
                  <label
                    for="add-status"
                    class="block text-sm font-semibold text-gray-700 mb-1"
                    >Status</label
                  >
                  <Icon
                    icon="mdi:check-circle-outline"
                    class="w-5 h-5 text-gray-400 absolute left-3 top-[42px]"
                  />
                  <select
                    v-model="newOffer.status"
                    id="add-status"
                    class="pl-10 pr-4 py-2.5 mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="tidak_aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div> -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    for="add-pickup-date"
                    class="block text-sm font-semibold text-gray-700 mb-1"
                    >Tanggal Pickup</label
                  >
                  <input
                    v-model="newOffer.pickup_date"
                    type="date"
                    id="add-pickup-date"
                    required
                    class="px-4 py-2.5 mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  />
                </div>
                <div class="relative">
                  <label
                    for="add-status"
                    class="block text-sm font-semibold text-gray-700 mb-1"
                    >Status</label
                  >
                  <Icon
                    icon="mdi:check-circle-outline"
                    class="w-5 h-5 text-gray-400 absolute left-3 top-[42px]"
                  />
                  <select
                    v-model="newOffer.status"
                    id="add-status"
                    class="pl-10 pr-4 py-2.5 mt-1 block w-full ..."
                  >
                    <option value="aktif">Aktif</option>
                    <option value="tidak_aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="relative">
                  <label
                    for="add-pickup-start"
                    class="block text-sm font-semibold text-gray-700 mb-1"
                    >Waktu Mulai</label
                  >
                  <Icon
                    icon="mdi:clock-start"
                    class="w-5 h-5 text-gray-400 absolute left-3 top-[42px]"
                  />
                  <input
                    v-model="newOffer.pickup_start_time"
                    type="time"
                    id="add-pickup-start"
                    required
                    class="pl-10 pr-4 py-2.5 mt-1 block w-full border ..."
                  />
                </div>
                <div class="relative">
                  <label
                    for="add-pickup-end"
                    class="block text-sm font-semibold text-gray-700 mb-1"
                    >Waktu Berakhir</label
                  >
                  <Icon
                    icon="mdi:clock-end"
                    class="w-5 h-5 text-gray-400 absolute left-3 top-[42px]"
                  />
                  <input
                    v-model="newOffer.pickup_end_time"
                    type="time"
                    id="add-pickup-end"
                    required
                    class="pl-10 pr-4 py-2.5 mt-1 block w-full border ..."
                  />
                </div>
              </div>
            </form>

            <Transition
              enter-active-class="transition-opacity duration-300 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
            >
              <div
                v-if="validationError"
                class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2"
              >
                <Icon icon="mdi:alert-circle-outline" class="w-5 h-5" />
                <span>{{ validationError }}</span>
              </div>
            </Transition>
          </div>

          <div
            class="p-6 bg-gray-50/70 rounded-b-2xl flex justify-end gap-4 border-t"
          >
            <button
              @click="closeModal"
              type="button"
              class="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-base font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              Batal
            </button>
            <button
              @click="handleSave"
              type="button"
              class="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 border border-transparent rounded-lg text-base font-semibold text-white hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Simpan Penawaran
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
