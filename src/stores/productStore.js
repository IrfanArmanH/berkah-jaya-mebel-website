export default {
  state() {
    return {
      product: {
        name: 'Kursi Gaming',
        price: 100000,
        stock: 30,
        category: 'Kursi',
        brand: 'SAMSUNG',
        warrantyPeriod: '12 Bulan',
        warrantyType: 'Garansi Produsen',
        shippingCity: 'Kota Samarinda',
      },
      products: [
        {
          name: 'Set Meja',
          image:
            '../src/components/image/material-symbols--table-bar-outline-purple.png',
        },
        {
          name: 'Lemari',
          image: '../src/components/image/mdi--cupboard-outline-purple.png',
        },
        {
          name: 'Bantal & Guling',
          image: '../src/components/image/lucide-lab--pillow-purple.png',
        },
        {
          name: 'Ranjang',
          image: '../src/components/image/lucide--bed-purple.png',
        },
        {
          name: 'Kursi',
          image: '../src/components/image/hugeicons--chair-02-purple.png',
        },
        {
          name: 'Jemuran',
          image: '../src/components/image/game-icons--clothesline-purple.png',
        },
      ],
    };
  },
  mutations: {
    updateStock(state, quantity) {
      if (state.product.stock >= quantity) {
        state.product.stock -= quantity;
      } else {
        console.warn('Stok tidak mencukupi.');
      }
    },
  },
};
