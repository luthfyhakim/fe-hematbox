<!-- <script setup>
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";

// Props & Emits tetap sama
const props = defineProps({
  modelValue: Boolean,
  offer: Object,
});
const emit = defineEmits(["update:modelValue", "save"]);

const isVisible = ref(props.modelValue);
const offerData = ref({});
const imagePreview = ref(null);
const isDragging = ref(false);

// Helper untuk format tanggal dari DB ke input datetime-local
const formatDateTimeForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

watch(
  () => props.modelValue,
  (newValue) => {
    isVisible.value = newValue;
    if (newValue && props.offer) {
      offerData.value = {
        ...props.offer,
        pickup_start: formatDateTimeForInput(props.offer.pickup_start),
        pickup_end: formatDateTimeForInput(props.offer.pickup_end),
        image: null,
      };
      imagePreview.value = props.offer.image_url
        ? `https://hematbox.sugengaldi.my.id/${props.offer.image_url}`
        : null;
    }
  }
);

const processFile = (file) => {
  if (file && file.type.startsWith("image/")) {
    offerData.value.image = file;
    const reader = new FileReader();
    reader.onload = (e) => (imagePreview.value = e.target.result);
    reader.readAsDataURL(file);
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  processFile(file);
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  processFile(file);
};

const closeModal = () => {
  emit("update:modelValue", false);
};

const saveOffer = () => {
  const formData = new FormData();
  for (const key in offerData.value) {
    if (
      key !== "image" &&
      key !== "image_url" &&
      offerData.value[key] !== null
    ) {
      formData.append(key, offerData.value[key]);
    }
  }

  if (offerData.value.image) {
    formData.append("image", offerData.value.image);
  }

  emit("save", { id: props.offer.id, data: formData });
  closeModal();
};
</script> -->
<!-- <script setup>
import { ref, watch, computed } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  modelValue: Boolean,
  offer: Object,
});
const emit = defineEmits(["update:modelValue", "save"]);

const isVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

// State baru yang disamakan dengan AddOfferModal
const offerData = ref({});
const validationError = ref("");
const imagePreview = ref(null);
const selectedImageFile = ref(null);

// Helper untuk memisahkan string ISO menjadi tanggal (YYYY-MM-DD) dan waktu (HH:MM)
const splitDateTime = (isoString) => {
  if (!isoString) return { date: "", time: "" };
  try {
    const d = new Date(isoString);
    // Mengatasi masalah timezone agar tanggal sesuai dengan waktu lokal
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    const date = localDate.toISOString().split("T")[0];
    const time = localDate.toTimeString().slice(0, 5);
    return { date, time };
  } catch (e) {
    return { date: "", time: "" };
  }
};

// Memuat dan memformat data ketika modal dibuka
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && props.offer) {
      const start = splitDateTime(props.offer.pickup_start);
      const end = splitDateTime(props.offer.pickup_end);

      offerData.value = {
        ...props.offer,
        pickup_date: start.date,
        pickup_start_time: start.time,
        pickup_end_time: end.time,
      };

      selectedImageFile.value = null;
      validationError.value = "";

      imagePreview.value = props.offer.image_url
        ? `https://hematbox.sugengaldi.my.id/${props.offer.image_url}`
        : null;
    }
  }
);

const handleImageSelection = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedImageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const closeModal = () => {
  emit("update:modelValue", false);
};

// Mengirim data dengan format waktu yang sudah benar
const saveOffer = () => {
  validationError.value = "";
  if (
    !offerData.value.title ||
    !offerData.value.pickup_date ||
    !offerData.value.pickup_start_time ||
    !offerData.value.pickup_end_time
  ) {
    validationError.value = "Judul, tanggal, dan waktu wajib diisi.";
    return;
  }

  const formData = new FormData();

  formData.append("title", offerData.value.title);
  formData.append("description", offerData.value.description);
  formData.append("price", Number(offerData.value.price) || 0);
  formData.append("total_portion", Number(offerData.value.total_portion) || 0);
  formData.append(
    "remaining_portion",
    Number(offerData.value.remaining_portion) || 0
  );
  formData.append("status", offerData.value.status);

  // GABUNGKAN tanggal dan waktu menjadi format ISO String (UTC)
  const pickupStartISO = new Date(
    `${offerData.value.pickup_date}T${offerData.value.pickup_start_time}:00`
  ).toISOString();
  const pickupEndISO = new Date(
    `${offerData.value.pickup_date}T${offerData.value.pickup_end_time}:00`
  ).toISOString();

  formData.append("pickup_start", pickupStartISO);
  formData.append("pickup_end", pickupEndISO);

  if (selectedImageFile.value) {
    formData.append("image", selectedImageFile.value);
  }

  emit("save", { id: props.offer.id, data: formData });
  closeModal();
};
</script> -->
// EditOfferModal.vue

<script setup>
import { ref, watch, computed } from "vue"; // <-- TAMBAHKAN 'computed'
import { Icon } from "@iconify/vue";

const props = defineProps({
  modelValue: Boolean, // Ini adalah nilai dari v-model
  offer: Object,
});
const emit = defineEmits(["update:modelValue", "save"]);

// --- INI PERBAIKANNYA ---
// Gunakan computed property untuk menyinkronkan prop 'modelValue' dengan state internal
// Ini adalah cara standar untuk menangani v-model pada komponen
const isVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
// --- AKHIR PERBAIKAN ---

// State lain tetap sama
const offerData = ref({});
const validationError = ref("");
const imagePreview = ref(null);
const selectedImageFile = ref(null);
const isDragging = ref(false); // <-- State ini penting untuk UI drag-and-drop

// Fungsi utama untuk memproses file
const processFile = (file) => {
  if (file && file.type.startsWith("image/")) {
    selectedImageFile.value = file; // Simpan file untuk di-upload
    imagePreview.value = URL.createObjectURL(file); // Tampilkan preview gambar baru
  }
};

// Fungsi ini dipanggil saat user memilih file lewat tombol "Klik untuk upload"
const handleFileChange = (event) => {
  const file = event.target.files[0];
  processFile(file);
};

// Fungsi ini dipanggil saat user melepaskan file di area dropzone
const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  processFile(file);
};

// Helper untuk memisahkan string ISO menjadi tanggal (YYYY-MM-DD) dan waktu (HH:MM)
const splitDateTime = (isoString) => {
  if (!isoString) return { date: "", time: "" };
  try {
    const d = new Date(isoString);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    const date = localDate.toISOString().split("T")[0];
    const time = localDate.toTimeString().slice(0, 5);
    return { date, time };
  } catch (e) {
    return { date: "", time: "" };
  }
};

// Watcher untuk memuat data ketika modal dibuka (ini sudah benar)
watch(
  () => props.offer, // Lebih baik watch props.offer langsung
  (newOffer) => {
    if (newOffer) {
      const start = splitDateTime(newOffer.pickup_start);
      const end = splitDateTime(newOffer.pickup_end);

      offerData.value = {
        ...newOffer,
        pickup_date: start.date,
        pickup_start_time: start.time,
        pickup_end_time: end.time,
      };

      selectedImageFile.value = null;
      validationError.value = "";

      imagePreview.value = newOffer.image_url
        ? `https://hematbox.sugengaldi.my.id/${newOffer.image_url}`
        : null;
    }
  },
  { immediate: true, deep: true } // immediate:true agar data terisi saat komponen dibuat
);

const handleImageSelection = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedImageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const closeModal = () => {
  isVisible.value = false; // Setter dari computed akan otomatis emit event
};

// Fungsi saveOffer Anda sudah benar
const saveOffer = () => {
  validationError.value = "";
  if (
    !offerData.value.title ||
    !offerData.value.pickup_date ||
    !offerData.value.pickup_start_time ||
    !offerData.value.pickup_end_time
  ) {
    validationError.value = "Judul, tanggal, dan waktu wajib diisi.";
    return;
  }

  const formData = new FormData();
  formData.append("title", offerData.value.title);
  formData.append("description", offerData.value.description);
  formData.append("price", Number(offerData.value.price) || 0);
  formData.append("total_portion", Number(offerData.value.total_portion) || 0);
  formData.append(
    "remaining_portion",
    Number(offerData.value.remaining_portion) || 0
  );
  formData.append("status", offerData.value.status);

  const pickupStartISO = new Date(
    `${offerData.value.pickup_date}T${offerData.value.pickup_start_time}:00`
  ).toISOString();
  const pickupEndISO = new Date(
    `${offerData.value.pickup_date}T${offerData.value.pickup_end_time}:00`
  ).toISOString();

  formData.append("pickup_start", pickupStartISO);
  formData.append("pickup_end", pickupEndISO);

  if (selectedImageFile.value) {
    formData.append("image", selectedImageFile.value);
  }

  emit("save", { id: props.offer.id, data: formData });
  closeModal();
};
</script>

<template>
  <Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isVisible"
      class="fixed inset-0 bg-gradient-to-br from-black/70 via-emerald-900/20 to-black/70 z-40 flex items-center justify-center p-4 backdrop-blur-md"
      @click="closeModal">
      <Transition enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 scale-90 rotate-3" enter-to-class="opacity-100 scale-100 rotate-0"
        leave-active-class="transition-all duration-300 ease-in" leave-from-class="opacity-100 scale-100 rotate-0"
        leave-to-class="opacity-0 scale-90 -rotate-3">
        <div v-if="isVisible" @click.stop
          class="bg-gradient-to-br from-white via-emerald-50/30 to-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-2 border-emerald-100/50 overflow-hidden relative">
          <!-- Decorative gradient overlay -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400">
          </div>

          <!-- Header dengan gradient -->
          <div
            class="flex justify-between items-center p-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white relative overflow-hidden">
            <!-- Decorative circles -->
            <div class="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl"></div>

            <div class="relative z-10 flex items-center gap-3">
              <div class="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                <Icon icon="mdi:pencil-box" class="w-6 h-6" />
              </div>
              <h3 class="text-2xl font-bold tracking-tight">Edit Penawaran</h3>
            </div>
            <button @click="closeModal"
              class="relative z-10 p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-all duration-200 hover:scale-110 hover:rotate-90">
              <Icon icon="mdi:close" class="w-6 h-6" />
            </button>
          </div>

          <div class="p-6 space-y-6 overflow-y-auto">
            <!-- Form Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Judul -->
              <div class="group">
                <label for="title" class="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                  <Icon icon="mdi:format-title" class="w-4 h-4 text-emerald-600" />
                  Judul Penawaran
                </label>
                <div class="relative">
                  <input id="title" v-model="offerData.title" type="text"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 group-hover:border-emerald-300"
                    placeholder="Masukkan judul menarik" />
                </div>
              </div>

              <!-- Harga -->
              <div class="group">
                <label for="price" class="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                  <Icon icon="mdi:cash" class="w-4 h-4 text-emerald-600" />
                  Harga
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">Rp</span>
                  <input id="price" v-model.number="offerData.price" type="number"
                    class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 group-hover:border-emerald-300"
                    placeholder="0" />
                </div>
              </div>
            </div>

            <!-- Deskripsi -->
            <div class="group">
              <label for="description" class="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                <Icon icon="mdi:text-box" class="w-4 h-4 text-emerald-600" />
                Deskripsi
              </label>
              <textarea id="description" v-model="offerData.description" rows="3"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 resize-none group-hover:border-emerald-300"
                placeholder="Jelaskan penawaran Anda..."></textarea>
            </div>

            <!-- Porsi & Status -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div class="group">
                <label for="total_portion" class="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                  <Icon icon="mdi:food" class="w-4 h-4 text-emerald-600" />
                  Total Porsi
                </label>
                <input id="total_portion" v-model.number="offerData.total_portion" type="number"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 group-hover:border-emerald-300" />
              </div>

              <div class="group">
                <label for="remaining_portion"
                  class="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                  <Icon icon="mdi:food-variant" class="w-4 h-4 text-emerald-600" />
                  Sisa Porsi
                </label>
                <input id="remaining_portion" v-model.number="offerData.remaining_portion" type="number"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 group-hover:border-emerald-300" />
              </div>

              <div class="group">
                <label for="status" class="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                  <Icon icon="mdi:toggle-switch" class="w-4 h-4 text-emerald-600" />
                  Status
                </label>
                <select id="status" v-model="offerData.status"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 appearance-none bg-white cursor-pointer group-hover:border-emerald-300">
                  <option value="aktif">✓ Aktif</option>
                  <option value="tidak_aktif">✕ Tidak Aktif</option>
                </select>
              </div>
            </div>

            <!-- Waktu Pickup -->
            <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="group">
                <label
                  for="pickup_start"
                  class="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2"
                >
                  <Icon
                    icon="mdi:clock-start"
                    class="w-4 h-4 text-emerald-600"
                  />
                  Waktu Mulai Ambil
                </label>
                <input
                  id="pickup_start"
                  v-model="offerData.pickup_start"
                  type="datetime-local"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 group-hover:border-emerald-300"
                />
              </div>

              <div class="group">
                <label
                  for="pickup_end"
                  class="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2"
                >
                  <Icon icon="mdi:clock-end" class="w-4 h-4 text-emerald-600" />
                  Waktu Selesai Ambil
                </label>
                <input
                  id="pickup_end"
                  v-model="offerData.pickup_end"
                  type="datetime-local"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 group-hover:border-emerald-300"
                />
              </div>
            </div> -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="group">
                <label for="edit-pickup-date" class="text-sm font-bold ...">
                  <Icon icon="mdi:calendar" class="w-4 h-4 ..." />
                  Tanggal Pickup
                </label>
                <input id="edit-pickup-date" v-model="offerData.pickup_date" type="date" required
                  class="w-full px-4 py-3 border-2 ..." />
              </div>
              <div class="group"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="group">
                <label for="edit-pickup-start-time" class="text-sm font-bold ...">
                  <Icon icon="mdi:clock-start" class="w-4 h-4 ..." />
                  Waktu Mulai Ambil
                </label>
                <input id="edit-pickup-start-time" v-model="offerData.pickup_start_time" type="time" required
                  class="w-full px-4 py-3 border-2 ..." />
              </div>
              <div class="group">
                <label for="edit-pickup-end-time" class="text-sm font-bold ...">
                  <Icon icon="mdi:clock-end" class="w-4 h-4 ..." />
                  Waktu Selesai Ambil
                </label>
                <input id="edit-pickup-end-time" v-model="offerData.pickup_end_time" type="time" required
                  class="w-full px-4 py-3 border-2 ..." />
              </div>
            </div>

            <!-- Upload Gambar -->
            <div>
              <label class="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                <Icon icon="mdi:image" class="w-4 h-4 text-emerald-600" />
                Ganti Gambar (Opsional)
              </label>

              <div v-if="!imagePreview" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop" :class="[
                  'mt-2 flex justify-center px-6 py-8 border-3 border-dashed rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden',
                  isDragging
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400 scale-105 shadow-lg'
                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-300 hover:border-emerald-400 hover:shadow-md hover:scale-102',
                ]" @click="$refs.fileInput.click()">
                <div class="space-y-3 text-center relative z-10">
                  <div
                    class="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon icon="mdi:cloud-upload-outline" class="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-700 font-medium">
                      <span class="font-bold text-emerald-600 text-base">Klik untuk upload</span>
                      <br />
                      atau seret dan lepas gambar di sini
                    </p>
                    <p class="text-xs text-gray-500 mt-2">
                      PNG, JPG, GIF hingga 10MB
                    </p>
                  </div>
                </div>
                <input ref="fileInput" type="file" @change="handleFileChange" accept="image/*" class="hidden" />
              </div>

              <div v-else class="mt-3 relative w-full max-w-xs mx-auto group">
                <div
                  class="relative rounded-2xl overflow-hidden shadow-xl ring-4 ring-emerald-100 group-hover:ring-emerald-300 transition-all duration-300">
                  <img :src="imagePreview" alt="Preview"
                    class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  </div>
                </div>
                <button @click="
                  imagePreview = null;
                selectedImageFile =
                  null; /* <-- UBAH INI, agar file baru batal di-upload */
                "
                  class="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-pink-500 p-2.5 rounded-full shadow-xl text-white hover:scale-110 hover:rotate-90 transition-all duration-300 ring-4 ring-white">
                  <Icon icon="mdi:delete" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div
            class="flex justify-end items-center p-6 border-t-2 border-gray-100 gap-4 bg-gradient-to-r from-gray-50 via-white to-gray-50">
            <button @click="closeModal"
              class="px-8 py-3 rounded-xl font-bold shadow-md transition-all duration-300 transform focus:outline-none focus:ring-4 bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95 focus:ring-gray-300 hover:shadow-lg">
              Batal
            </button>
            <button @click="saveOffer"
              class="px-8 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 transform focus:outline-none focus:ring-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 active:scale-95 focus:ring-emerald-300 hover:shadow-xl hover:shadow-emerald-500/50 relative overflow-hidden group">
              <span class="relative z-10 flex items-center gap-2">
                <Icon icon="mdi:content-save" class="w-5 h-5" />
                Simpan Perubahan
              </span>
              <div
                class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              </div>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
