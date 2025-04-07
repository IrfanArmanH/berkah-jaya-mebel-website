import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/components/LoginView.vue';
import SignupView from '@/components/SignupView.vue';
import ProfilView from '@/components/ProfilView.vue';
import ManajemenProduk from '@/components/ManajemenProduk.vue';
import DetailProduk from '@/components/DetailProduk.vue';
import HalamanUtama from '@/components/HalamanUtama.vue';
import ManajemenPesanan from '@/components/ManajemenPesanan.vue';
import InputProduk from '@/components/InputProduk.vue';
import InformasiToko from '@/components/InformasiToko.vue';
import Pembayaran from '@/components/Pembayaran.vue';
import InformasiPembayaran from '@/components/InformasiPembayaran.vue';

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignupView },
  { path: '/profil', name: 'Profil', component: ProfilView },
  { path: '/manajemen-produk', name: 'ManajemenProduk', component: ManajemenProduk},
  { path: '/detail-produk', name: 'DetailProduk', component: DetailProduk },
  { path: '/detail-produk/:id?', name: 'DetailProduk', component: DetailProduk },
  { path: '/halaman-utama', name: 'HalamanUtama', component: HalamanUtama },
  { path: '/manajemen-pesanan', name: 'ManajemenPesanan', component: ManajemenPesanan},
  { path: '/input-produk', name: 'InputProduk', component: InputProduk },
  { path: '/input-produk/:id?', name: 'InputProduk', component: InputProduk },
  { path: '/informasi-toko', name: 'InformasiToko', component: InformasiToko },
  { path: '/pembayaran', name: 'Pembayaran', component: Pembayaran },
  { path: '/informasi-pembayaran', name: 'InformasiPembayaran', component: InformasiPembayaran},
  { path: '/informasi-pembayaran/:id?', name: 'InformasiPembayaran', component: InformasiPembayaran},
  { path: '/', redirect: '/halaman-utama' }, // Default ke halaman utama
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
