import { createApp } from "vue";
import { createPinia } from "pinia"; // 1. IMPOR createPinia
import "./style.css";
import App from "./App.vue";
import { Icon } from "@iconify/vue";
import { MotionPlugin } from "@vueuse/motion";
import router from "./router";

// createApp(App).mount("#app");

// createApp(App).component("Icon", Icon).mount("#app");
// app.use(MotionPlugin);

// 1. Buat instance aplikasi dan simpan di variabel
const app = createApp(App);
const pinia = createPinia(); // 2. BUAT INSTANCE PINIA

// 2. Daftarkan semua plugin DAN komponen global di sini
app.use(MotionPlugin);
app.use(pinia); // 3. DAFTARKAN PINIA KE APLIKASI VUE
app.use(router);
app.component("Icon", Icon); // <-- Konfigurasi Icon Anda tetap ada di sini

// 3. Mount aplikasi sebagai langkah terakhir
app.mount("#app");
