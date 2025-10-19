import { ref } from "vue";

export const stats = ref([
  {
    id: 1,
    title: "Total Penawaran",
    value: "8",
    icon: "mdi:tag-outline",
    unit: "Pcs",
    color: "text-purple-600",
    bg: "bg-purple-100",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    id: 2,
    title: "Hemat Biaya",
    value: "Rp 350k",
    icon: "mdi:cash-multiple",
    unit: "",
    color: "text-blue-600",
    bg: "bg-blue-100",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: 3,
    title: "Pengguna Aktif",
    value: "194",
    icon: "mdi:account-group-outline",
    unit: "Orang",
    color: "text-orange-600",
    bg: "bg-orange-100",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    id: 4,
    title: "Total Makanan",
    value: "45kg",
    icon: "mdi:scale-balance",
    unit: "",
    color: "text-pink-600",
    bg: "bg-pink-100",
    gradient: "from-pink-500 to-pink-600",
  },
]);

export const fastOffers = ref([
  {
    id: 1,
    name: "Burger Keju Super",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    distance: 2,
    stock: 5,
    price: 25000,
    rating: 4.5,
    discount: 40,
    originalPrice: 42000,
  },
  {
    id: 2,
    name: "Pastry Mix Box Premium",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    distance: 1.5,
    stock: 8,
    price: 45000,
    rating: 4.8,
    discount: 35,
    originalPrice: 69000,
  },
  {
    id: 3,
    name: "Kopi Senja Signature",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    distance: 3,
    stock: 12,
    price: 18000,
    rating: 4.2,
    discount: 50,
    originalPrice: 36000,
  },
]);

export const favoriteFoods = ref([
  {
    id: 4,
    name: "Nasi Goreng Spesial",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    distance: 2.2,
    stock: 4,
    price: 22000,
    rating: 4.7,
    discount: 45,
    originalPrice: 40000,
  },
  {
    id: 5,
    name: "Paket Sayuran Segar",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
    distance: 4,
    stock: 10,
    price: 35000,
    rating: 4.0,
    discount: 30,
    originalPrice: 50000,
  },
  {
    id: 6,
    name: "Burger Keju Super",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    distance: 2,
    stock: 5,
    price: 25000,
    rating: 4.5,
    discount: 40,
    originalPrice: 42000,
  },
]);

export const stores = ref([
  { id: 1, name: "Baker's Lane", lat: -6.9023, lon: 107.6182 },
  { id: 2, name: "Warung Nusantara", lat: -6.9175, lon: 107.6191 },
  { id: 3, name: "Tani Makmur", lat: -6.8915, lon: 107.6098 },
  { id: 4, name: "Kopi Senja", lat: -6.9248, lon: 107.6322 },
]);
