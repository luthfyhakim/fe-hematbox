import { createRouter, createWebHistory } from "vue-router";

// --- PERBAIKAN: Gunakan alias '@' yang menunjuk langsung ke folder 'src' ---
// Layouts & Views Publik
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";

// Layouts & Views Admin
import AdminLayout from "@/layouts/AdminLayout.vue";
import SuperadminDashboard from "@/views/superadmin/DashboardView.vue";
import BusinessDashboard from "@/views/business/DashboardView.vue";
// import CustomerDashboard from "@/views/customer/DashboardView.vue";
import KelolaPenawaranView from "@/views/business/KelolaPenawaranView.vue";
import AnalyticsView from "@/views/business/AnalyticsView.vue";
import ProfileBisnisView from "@/views/business/ProfileBisnisView.vue";
import EditProfileView from "@/views/business/EditProfileView.vue";
import CreateProfileView from "@/views/business/CreateProfileView.vue";
import KelolaPembelianView from "@/views/business/KelolaPembelianView.vue";

// --- [BARU] Layouts & Views Customer ---
import CustomerLayout from "@/layouts/CustomerLayout.vue"; // Import layout baru
// [DIUBAH] Impor JelajahiView sebagai pengganti CustomerDashboard
import JelajahiView from "@/views/customer/JelajahiView.vue";
import CustomerDashboard from "@/views/customer/DashboardView.vue";
import CustomerOrdersView from "@/views/customer/OrdersView.vue"; // Import view baru
import CustomerFavoritesView from "@/views/customer/FavoritesView.vue"; // Import view baru
import CustomerProfileView from "@/views/customer/ProfileView.vue"; // Import view baru
import EditCustomerProfileView from "@/views/customer/EditProfileView.vue";
import SmartShoppingView from "@/views/customer/SmartShoppingView.vue";
// --- [BARU] Impor halaman baru Reset Password ---
import ResetPasswordView from "@/views/customer/ResetPasswordView.vue";
import OfferDetailView from "@/views/customer/OfferDetailView.vue";
import CheckoutView from "@/views/customer/CheckoutView.vue";
import TransactionsView from "@/views/customer/TransactionsView.vue";
import InvoiceView from "@/views/customer/InvoiceView.vue";
import BusinessProfileView from "@/views/customer/BusinessProfileView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rute untuk Halaman Utama (menggunakan DefaultLayout)
    {
      path: "/",
      component: DefaultLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
        },
      ],
    },
    // ▼▼▼ TAMBAHKAN BLOK ROUTE BARU INI ▼▼▼
    // {
    //   path: "toko/:id", // URL akan menjadi /toko/1, /toko/2, dst.
    //   name: "business-profile",
    //   component: BusinessProfileView,
    //   meta: { title: "Profil Toko" },
    // },
    // ▲▲▲ AKHIR BLOK ROUTE BARU ▲▲▲

    // --- [PERUBAHAN] RUTE PUBLIK BARU UNTUK JELAJAHI ---
    // ▼▼▼ 2. LETAKKAN RUTE PROFIL SEBAGAI BLOK MANDIRI DI SINI ▼▼▼
    // {
    //   path: "/toko/:id", // Path HARUS diawali dengan "/" karena ini rute top-level
    //   component: DefaultLayout, // Tetap gunakan layout yang sama
    //   children: [
    //     {
    //       path: "", // Path kosong karena URL sudah ditentukan oleh parent
    //       name: "business-profile",
    //       component: BusinessProfileView,
    //       meta: { title: "Profil Toko" },
    //     },
    //   ],
    // },
    // ▲▲▲ AKHIR DARI BLOK RUTE PROFIL ▲▲▲
    // Rute Publik untuk melihat Profil Bisnis oleh Customer
    {
      path: "/toko/:id", // URL akan menjadi /toko/123, /toko/abc, dll.
      component: DefaultLayout, // Menggunakan layout publik standar
      children: [
        {
          path: "", // Path kosong karena URL sudah ditentukan oleh parent
          name: "public-business-profile", // Beri nama yang unik
          component: BusinessProfileView,
          meta: { title: "Profil Toko" },
        },
      ],
    },
    // ▲▲▲ AKHIR BLOK RUTE BARU ▲▲▲

    {
      path: "/jelajahi", // URL: /jelajahi
      component: DefaultLayout, // Menggunakan layout publik
      children: [
        {
          path: "",
          name: "jelajahi",
          component: JelajahiView,
          meta: { title: "Jelajahi Penawaran" },
        },
      ],
    },

    // --- [BARU] RUTE PUBLIK UNTUK SMART SHOPPING ---
    // Halaman ini sekarang akan menggunakan DefaultLayout (header & footer landing page)
    {
      path: "/smart-shopping", // URL baru yang lebih singkat
      component: DefaultLayout,
      children: [
        {
          path: "",
          name: "smart-shopping",
          component: SmartShoppingView,
          meta: { title: "Smart Shopping" },
        },
      ],
    },
    // {
    //   path: "/offer/:id", // URL dinamis dengan parameter ID
    //   name: "offer-detail",
    //   component: OfferDetailView,
    //   meta: { title: "Detail Penawaran" },
    // },

    // {
    //   path: "/offer/:id/checkout", // URL checkout yang terhubung dengan offer
    //   name: "checkout",
    //   component: CheckoutView,
    //   meta: { title: "Pembayaran" },
    // },
    // ✅ [PERBAIKAN STRUKTUR] Rute untuk Offer (Detail & Checkout) digabung di sini
    {
      path: "/offer",
      component: DefaultLayout, // Menggunakan layout yang sama
      children: [
        // {
        //   path: "transactions", // URL -> /offer/transactions
        //   name: "offer-transactions",
        //   component: TransactionsView,
        //   meta: { title: "Riwayat Transaksi" },
        // },
        {
          path: ":id",
          name: "offer-detail",
          component: OfferDetailView,
          meta: { title: "Detail Penawaran" },
        },
        {
          path: ":id/checkout",
          name: "checkout",
          component: CheckoutView,
          meta: { title: "Pembayaran" },
        },
      ],
    },
    // ▼▼▼ RUTE INVOICE BARU DITAMBAHKAN DI SINI ▼▼▼
    {
      path: "/invoice/:transactionId?",
      component: DefaultLayout,
      children: [
        {
          path: "",
          name: "invoice",
          component: InvoiceView,
          meta: { title: "Detail Transaksi" },
        },
      ],
    },
    // ▲▲▲ RUTE INVOICE BARU SELESAI ▲▲▲
    // {
    //   path: "/invoice/:transactionId", // URL -> /invoice/HB-XYZ123
    //   component: DefaultLayout, // Dibungkus layout agar punya header & footer
    //   children: [
    //     {
    //       path: "",
    //       name: "invoice",
    //       component: InvoiceView,
    //       meta: { title: "Detail Transaksi" },
    //     },
    //   ],
    // },

    // --- PERBAIKAN: Rute Login dan Register dipisah agar lebih jelas ---
    // Rute untuk Halaman Login (menggunakan AuthLayout)
    {
      path: "/login",
      component: AuthLayout,
      children: [
        {
          path: "",
          name: "login",
          component: LoginView,
        },
      ],
    },
    // Rute untuk Halaman Register (menggunakan AuthLayout)
    {
      path: "/register",
      component: AuthLayout,
      children: [
        {
          path: "",
          name: "register",
          component: RegisterView,
        },
      ],
    },

    // Rute untuk Superadmin
    {
      path: "/superadmin",
      component: AdminLayout,
      meta: { requiresAuth: true, role: "superadmin" },
      children: [
        {
          path: "",
          name: "superadmin-dashboard",
          component: SuperadminDashboard,
        },
      ],
    },
    // Rute untuk Admin Bisnis
    {
      path: "/business",
      component: AdminLayout,
      meta: { requiresAuth: true, role: "business" },
      children: [
        { path: "", name: "business-dashboard", component: BusinessDashboard },
        {
          path: "offers", // URL -> /business/offers
          name: "business-offers",
          component: KelolaPenawaranView,
        },
        // ▼▼▼ LETAKKAN BLOK ROUTE BARU ANDA DI SINI ▼▼▼
        {
          path: "pembelian", // URL akan menjadi /business/pembelian
          name: "business-pembelian",
          // Gunakan variabel yang sudah diimpor di atas
          component: KelolaPembelianView,
          meta: { requiresAuth: true, role: "business" },
        },
        // ▲▲▲ ROUTE BARU DITAMBAHKAN DI SINI ▲▲▲
        {
          path: "analytics", // URL -> /business/analytics
          name: "business-analytics",
          component: AnalyticsView,
        },
        {
          path: "profile", // URL -> /business/profile
          name: "business-profile",
          component: ProfileBisnisView,
        },
        {
          path: "profile/edit", // URL -> /business/profile/edit (Halaman Edit)
          name: "business-profile-edit",
          component: EditProfileView,
        },
        // 2. TAMBAHKAN RUTE BARU DI SINI
        // {
        //   path: "create-profile", // URL -> /business/create-profile
        //   name: "business-create-profile",
        //   component: CreateProfileView,
        // },
      ],
    },
    // 1. TAMBAHKAN BLOK RUTE BARU DI SINI (SEBAGAI TOP-LEVEL ROUTE)
    {
      path: "/business/create-profile", // Path lengkap
      component: AuthLayout, // Gunakan layout minimalis seperti halaman login
      meta: { requiresAuth: true, role: "business" }, // Keamanan tetap terjaga
      children: [
        {
          path: "", // Path kosong karena sudah didefinisikan di parent
          name: "business-create-profile",
          component: CreateProfileView,
          meta: { title: "Buat Profil Bisnis" },
        },
      ],
    },
    // Rute untuk Admin Pelanggan
    // {
    //   path: "/customer",
    //   component: AdminLayout,
    //   meta: { requiresAuth: true, role: "customer" },
    //   children: [
    //     { path: "", name: "customer-dashboard", component: CustomerDashboard },
    //   ],
    // },
    // --- [DIUBAH] Rute untuk Customer ---
    {
      path: "/customer",
      component: CustomerLayout, // Gunakan CustomerLayout baru
      meta: { requiresAuth: true, role: "customer" },
      children: [
        {
          path: "",
          name: "customer-dashboard",
          component: CustomerDashboard,
          meta: { title: "Jelajahi" },
        },
        // // [PERBAIKAN] Arahkan path dasar '/customer' ke halaman 'jelajahi'
        // {
        //   path: "",
        //   redirect: "/customer/jelajahi",
        // },
        // // [PERBAIKAN] Beri path 'jelajahi' secara eksplisit
        // {
        //   path: "jelajahi",
        //   name: "customer-jelajahi",
        //   component: JelajahiView,
        //   meta: { title: "Jelajahi Penawaran" }, // Title yang lebih deskriptif
        // },
        {
          path: "orders",
          name: "customer-orders",
          component: CustomerOrdersView,
          meta: { title: "Pesanan Saya" },
        },
        {
          path: "favorites",
          name: "customer-favorites",
          component: CustomerFavoritesView,
          meta: { title: "Favorit" },
        },
        {
          path: "profile",
          name: "customer-profile",
          component: CustomerProfileView,
          meta: { title: "Profil Saya" },
        },
        {
          path: "profile/edit",
          name: "customer-profile-edit",
          component: EditCustomerProfileView,
          meta: { title: "Edit Profil" },
        },
        // --- [BARU] Tambahkan rute untuk halaman Ganti Password ---
        {
          path: "profile/change-password",
          name: "customer-change-password",
          component: ResetPasswordView,
          meta: { title: "Ganti Password" },
        },
        // {
        //   path: "smart-shopping",
        //   name: "customer-smart-shopping",
        //   component: SmartShoppingView,
        //   meta: { title: "Smart Shopping" },
        // },
        {
          path: "transactions", // URL -> /customer/transactions
          name: "customer-transactions",
          component: TransactionsView,
          meta: { title: "Riwayat Transaksi" },
        },
        // {
        //   path: "invoice/:transactionId", // URL -> /customer/invoice/HB-XYZ123
        //   name: "invoice",
        //   component: InvoiceView,
        //   meta: { title: "Detail Transaksi" },
        // },
      ],
    },
  ],
});

// Anda bisa menambahkan route guard di sini jika perlu
// router.beforeEach(...)

export default router;
