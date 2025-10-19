<script setup>
import { ref, computed } from "vue";

const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

const testimonials = ref([
  {
    id: 1,
    name: "Chef John Doe",
    image: "chef.png",
    rating: 5,
    review:
      "HematBox luar biasa! Saya bisa mengurangi limbah makanan di restoran saya sekaligus mendapatkan penghasilan tambahan. Platformnya sangat mudah digunakan.",
  },
  {
    id: 2,
    name: "Maria S.",
    image: "customer1.png",
    rating: 4,
    review:
      "Aplikasi ini sangat membantu saya menghemat uang dan menemukan makanan enak yang hampir terbuang. Konsepnya brilian dan mudah dipakai!",
  },
  {
    id: 3,
    name: "Pak Budi",
    image: "customer2.png",
    rating: 5,
    review:
      "Sebagai pemilik toko roti, HematBox adalah solusi sempurna untuk produk yang tidak terjual di akhir hari. Sangat direkomendasikan untuk bisnis F&B!",
  },
  {
    id: 4,
    name: "Ani K.",
    image: "customer3.png",
    rating: 4,
    review:
      "Pengalaman yang sangat positif. Makanan berkualitas dengan harga diskon, dan yang terpenting, saya merasa ikut berkontribusi untuk lingkungan.",
  },
]);

const currentIndex = ref(0);
const currentTestimonial = computed(
  () => testimonials.value[currentIndex.value]
);

const showNext = () => {
  currentIndex.value = (currentIndex.value + 1) % testimonials.value.length;
};

const showPrev = () => {
  currentIndex.value =
    (currentIndex.value - 1 + testimonials.value.length) %
    testimonials.value.length;
};

const goToTestimonial = (index) => {
  currentIndex.value = index;
};
</script>

<template>
  <section class="py-20 bg-green-50/50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-800">Apa Kata Mereka?</h2>
        <p class="text-gray-600 mt-3 text-lg">
          Dengar langsung pengalaman para pengguna dan mitra kami.
        </p>
      </div>

      <div class="max-w-3xl mx-auto grid md:grid-cols-3 items-center gap-8">
        <div class="hidden md:flex justify-end">
          <button
            @click="showPrev"
            class="p-3 rounded-full border border-[#10B981] text-[#10B981] hover:bg-green-100 transition-colors duration-300 shadow-sm"
            aria-label="Previous testimonial"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        </div>

        <div class="md:col-span-1 relative">
          <Transition name="fade" mode="out-in">
            <div
              :key="currentTestimonial.id"
              class="bg-white p-8 pt-20 rounded-2xl shadow-xl text-center relative"
            >
              <img
                :src="getImageUrl(currentTestimonial.image)"
                :alt="currentTestimonial.name"
                class="w-28 h-28 rounded-full mx-auto absolute -top-14 left-1/2 -translate-x-1/2 border-4 border-white object-cover"
              />
              <p class="mt-6 text-gray-600 italic">
                "{{ currentTestimonial.review }}"
              </p>
              <div class="mt-6">
                <h4 class="font-bold text-lg text-gray-800">
                  {{ currentTestimonial.name }}
                </h4>
                <div class="flex justify-center mt-2">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="w-5 h-5"
                    :class="
                      i <= currentTestimonial.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="hidden md:flex justify-start">
          <button
            @click="showNext"
            class="p-3 rounded-full border border-[#10B981] text-[#10B981] hover:bg-green-100 transition-colors duration-300 shadow-sm"
            aria-label="Next testimonial"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>

        <div class="md:hidden col-span-full flex justify-center gap-2 mt-8">
          <button
            v-for="(testi, index) in testimonials"
            :key="testi.id"
            @click="goToTestimonial(index)"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="
              index === currentIndex
                ? 'bg-green-600'
                : 'bg-gray-300 hover:bg-gray-400'
            "
            :aria-label="'Go to testimonial ' + (index + 1)"
          ></button>
        </div>

        <div
          class="md:hidden col-span-full flex justify-between px-4 mt-4 text-gray-700"
        >
          <button
            @click="showPrev"
            class="p-3 rounded-full border border-[#10B981] text-[#10B981] hover:bg-green-100 transition-colors duration-300 shadow-sm"
            aria-label="Previous testimonial"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <button
            @click="showNext"
            class="p-3 rounded-full border border-[#10B981] text-[#10B981] hover:bg-green-100 transition-colors duration-300 shadow-sm"
            aria-label="Next testimonial"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
