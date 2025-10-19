<template>
  <section class="bg-green-50">
    <div
      class="container mx-auto px-4 sm:px-6 lg:px-8 py-24 grid md:grid-cols-2 gap-12 items-center"
    >
      <div class="text-center md:text-left">
        <h1 class="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
          Selamatkan <span class="text-[#10B981]">Makanan</span> <br />
          Hemat
          <span
            class="underline decoration-[#10B981] decoration-4 underline-offset-8"
            >Pengeluaran</span
          >
        </h1>
        <p class="mt-4 text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
          Platform marketplace real-time yang menghubungkan bisnis kuliner
          dengan konsumen untuk mengurangi limbah makanan dan menciptakan
          ekonomi berkelanjutan.
        </p>
        <div
          class="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
        >
          <a
            href="#"
            class="bg-[#10B981] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-200 transition-colors shadow-md"
          >
            Mulai Sekarang
          </a>
          <a
            href="#"
            class="bg-white text-[#10B981] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-100 transition-colors border border-[#10B981]"
          >
            Pelajari lebih lanjut
          </a>
        </div>
      </div>

      <div class="relative flex justify-center items-center min-h-[400px]">
        <div
          class="bg-[#10B981] w-full max-w-md h-96 rounded-2xl absolute -bottom-4 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2"
        ></div>

        <img
          src="@assets/hero-image.png"
          alt="Wanita sedang makan burger"
          class="absolute rounded-2xl shadow-xl w-full max-w-md object-cover h-[350px] sm:h-[400px] -bottom-10 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2"
        />

        <!-- <div
          class="absolute top-8 -left-4 sm:-left-8 flex items-center gap-3 bg-white p-3 rounded-lg shadow-lg"
        >
          <div class="bg-green-100 p-2 rounded-lg">
            <svg
              class="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 17l-4.5-4.5L8 8m4 9l4.5-4.5L12 8m-1 9h2a5 5 0 005-5v-1a2 2 0 00-2-2H7a2 2 0 00-2 2v1a5 5 0 005 5z"
              ></path>
            </svg>
          </div>
          <span class="font-semibold text-gray-700">Kirim Kilat</span>
        </div> -->
        <!-- <div
          class="absolute top-8 -left-4 sm:-left-8 flex items-center gap-3 bg-white p-3 rounded-lg shadow-lg"
        >
          <div class="bg-green-100 p-2 rounded-lg">
            <svg
              class="w-6 h-6 text-[#10B981]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17L12 20L15 17M12 4V20M17 19H7C4.79086 19 3 17.2091 3 15V9C3 6.79086 4.79086 5 7 5H17C19.2091 5 21 6.79086 21 9V15C21 17.2091 19.2091 19 17 19Z"
              ></path>
            </svg>
          </div>
          <span class="font-semibold text-[#10B981]">Kirim Kilat</span>
        </div> -->

        <div
          class="absolute top-8 -left-4 sm:-left-8 flex items-center gap-3 bg-white p-3 rounded-lg shadow-lg"
        >
          <div class="bg-green-100 p-2 rounded-lg">
            <Icon
              icon="mdi:truck-delivery-outline"
              class="w-6 h-6 text-[#10B981]"
            />
          </div>
          <span class="font-semibold text-[#10B981]">Kirim Kilat</span>
        </div>

        <!-- <div
          class="absolute bottom-8 -right-4 sm:-right-8 flex items-center gap-3 bg-white p-3 rounded-lg shadow-lg"
        >
          <div class="bg-green-100 p-2 rounded-lg">
            <svg
              class="w-6 h-6 text-[#10B981]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </div>
          <span class="font-semibold text-gray-700">Terdekat</span>
        </div> -->
        <div
          class="absolute bottom-8 -right-4 sm:-right-8 flex items-center gap-3 bg-white p-3 rounded-lg shadow-lg"
        >
          <div class="bg-green-100 p-2 rounded-lg">
            <svg
              class="w-6 h-6 text-[#10B981]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </div>
          <span class="font-semibold text-[#10B981]">Terdekat</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Optional: Add a slight animation to floating cards */
.absolute {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
