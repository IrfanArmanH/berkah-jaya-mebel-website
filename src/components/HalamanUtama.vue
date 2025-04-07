<template>
  <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
  </head>

  <body>
    <NavBarUser />
    <main>
      <div id="carouselExample" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="./image/banner1.png" class="d-block w-100" alt="Banner" height="400" />
          </div>
          <div class="carousel-item">
            <img src="./image/banner2.png" class="d-block w-100" alt="Banner 2" height="400" />
          </div>
          <div class="carousel-item">
            <img src="./image/banner3.png" class="d-block w-100" alt="Banner 3" height="400" />
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <h1 id="h1Kategori">KATEGORI</h1>
      <hr>
      <div id="div-kategori">
        <div class="row-kategori">
          <div class="container-kategori">
            <a href="">
              <img src="./image/material-symbols--table-bar-outline-purple.png" alt="Avatar" id="meja-icon">
              Setup Meja
            </a>
          </div>
          <div class="container-kategori">
            <a href="">
              <img src="./image/mdi--cupboard-outline-purple.png" alt="Avatar" id="lemari-icon">
              Lemari
            </a>
          </div>
          <div class="container-kategori">
            <a href="">
              <img src="./image/lucide-lab--pillow-purple.png" alt="Avatar" id="bantal-icon">
              Bantal & Guling
            </a>
          </div>
          <div class="container-kategori">
            <a href="">
              <img src="./image/lucide--bed-purple.png" alt="Avatar" id="ranjang-icon">
              Ranjang
            </a>
          </div>
          <div class="container-kategori">
            <a href="">
              <img src="./image/hugeicons--chair-02-purple.png" alt="Avatar" id="kursi-icon">
              Kursi
            </a>
          </div>
          <div class="container-kategori">
            <a href="">
              <img src="./image/game-icons--clothesline-purple.png" alt="Avatar" id="jemuran-icon">
              Jemuran
            </a>
          </div>
        </div>
      </div>

      <div id="div-produk">
        <div class="row">
          <div class="container" v-for="(produk, index) in produkList" :key="produk.id"
            @click="detailProduct(produk.id)">
            <img :src="produk.gambar" alt="Gambar Produk" />
            <h4><b>{{ produk.nama_produk }}</b></h4>
            <p>{{ formatRupiah(produk.harga) }}</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  </body>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import NavBarUser from './NavBarUser.vue';
import Footer from './Footer.vue';

export default {
  components: {
    NavBarUser,
    Footer
  },
  setup() {
    const db = getFirestore();
    const produkList = ref([]);
    const router = useRouter();
    const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true');

    const logout = () => {
      // Hapus semua data session dari localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userUID');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');

      // Update status login dan refresh halaman
      isLoggedIn.value = false;
      window.location.reload();
    };

    const fetchProducts = async () => {
      try {
        const produkCollection = collection(db, 'produk');
        const produkSnapshot = await getDocs(produkCollection);
        produkList.value = produkSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log('Fetched products:', produkList.value);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const detailProduct = (id) => {
      router.push(`/detail-produk/${id}`);
    };

    onMounted(() => {
      // Pastikan status login ada di localStorage
      if (localStorage.getItem('userRole') === 'admin') {
        router.push('/manajemen-pesanan');
      } else if (localStorage.getItem('userRole') !== 'admin') {
        router.push('/halaman-utama');
      } else if (localStorage.getItem('isLoggedIn') === null) {
        localStorage.setItem('isLoggedIn', 'false');
        router.push('/');
      }
      fetchProducts();
    });

    return {
      isLoggedIn,
      logout,
      produkList,
      detailProduct
    };
  },
  methods: {
        formatRupiah(angka) {
            const format = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            });
            return format.format(angka);
        }
    },
};
</script>

<style scoped>
nav a {
  text-decoration: none;
  color: rgb(250, 235, 215);
  font-weight: 550;
}

nav a:hover {
  color: #c3c2c2;
}

input[type='text'] {
  width: 38%;
  height: 45px;
  outline: none;
  font-size: larger;
  border-radius: 6px;
  border: none;
  padding: 0 16px;
}

header h1 a {
  text-decoration: none;
  color: #dec820;
}

#link-login {
  color: #ffc300;
}

#link-login:hover {
  color: #cb9d05;
}

#banner {
  width: 93%;
  margin-top: 4%;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.right-navbar {
  float: right;
  font-size: 28px;
  padding-right: 4%;
}

header h1 {
  padding-left: 2.5%;
}

header {
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #21146a;
  margin: 0%;
  padding: 10px;
  /* Add padding to the header */
}

footer {
  background-color: #21146a;
  /*Background Footer*/
  padding-bottom: 1%;
  /*Agar tidak ada margin pada footer dengan body*/
}

body {
  margin: 0;
}

#h1Kategori {
  text-align: center;
  font-weight: 400;
  color: #8620f0;
  font-size: 48px;
  font-family: Arial, Helvetica, sans-serif;
  padding: 2% 1% 0% 2%;
}

#div-produk {
  margin-top: 1%;
  margin-left: 9%;
  margin-right: 9%;
  margin-bottom: 3%;
}

#div-kategori {
  margin-top: 1%;
  margin-left: 9%;
  margin-right: 9%;
  margin-bottom: 3%;
}

.container h4 {
  /* nama mebel*/
  font-size: medium;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  margin-top: 0%;
  margin-bottom: 0%;
}

.container p {
  /* Deskripsi mebel*/
  font-size: 1.1em;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
  font-weight: 700;
}

.container img {
  /*gambar mebel dalam kartu*/
  width: 100%;
  height: 200px;
  margin: 0%;
}

.container:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.container {
  background-color: #ffc300;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 20.9%;

  margin-top: 1%;
  margin-right: 1.1%;
  margin-left: 1.1%;
  margin-bottom: 3%;
  cursor: pointer;
}

.container h4,
.container p {
  /*nama mebel & deskripsi*/
  margin-left: 2.9%;
  /*mengatur jarak nama & deskripsi*/
  justify-content: center;
  flex-wrap: wrap;
  /*Jika teks nama mebel penuh maka dia akan lanjut dibawah*/
}

.row {
  display: flex;
  flex-direction: row;
  /*Menampilkan kartu secara per baris*/
  justify-content: center;
  /*Menampilkan kartu di tengah2 secara horizontal*/
  flex-wrap: wrap;
  /*Agar setiap kartu baru yang muncul dia akan ke bawah*/
}

ul {
  list-style: none;
  /* list jam buka dan list kontak*/
}

.footer {
  color: rgb(250, 235, 215);
  display: flex;
  flex-direction: column;
  /*agar elemen yg setiap elemen 
                              yg beda diatur secara vertikal*/
  margin-left: 4.9%;
  margin-top: 1%;
}

.footer a {
  color: rgb(250, 235, 215);
  text-decoration: none;
}

.footer h2 {
  color: #ffc300;
}

.footer p {
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  padding: 0;
}

.footer ul {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-wrap: wrap;
  padding: 0;
}

#row-footer {
  display: flex;
  flex-direction: row;
  /*Agar menampilkan Alamat, Jam OP, 
                         Kontak, Sosmed secara per baris */
}

.footer p,
footer ul {
  /*Font h2, p, ul*/
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: large;
  font-weight: 400;
}

.footer h2 {
  margin-bottom: 0;
  padding-bottom: 0;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 1.5em;
}

footer img {
  width: 20px;
  height: 20px;
}

#copyright h2 {
  color: #ffffff;
  padding-left: 2%;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
  font-weight: 100;
}

#id-kontak {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 20%;
}

#id-Operasional {
  flex-grow: 1;
  margin-left: 10%;
}

.container-kategori {
  font-size: medium;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  text-align: center;
  transition: 1s;
  font-weight: 900;
  background-color: #ffffff;
  border: 1px solid #8620f0;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 20.9%;
  margin-top: 1%;
  margin-right: 1.1%;
  margin-left: 1.1%;
  margin-bottom: 3%;
}

.container-kategori:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  background-color: #8620f0;
}

.container-kategori img {
  width: 100%;
  height: 190px;
  margin: 0%;
}

.container-kategori,
.row-kategori {
  margin: 0;
  padding: 12px 16px;
}

.row-kategori {
  display: flex;
  flex-direction: row;
  /*Menampilkan kartu secara per baris*/
  justify-content: center;
  /*Menampilkan kartu di tengah2 secara horizontal*/
  flex-wrap: wrap;
  /*Agar setiap kartu baru yang muncul dia akan ke bawah*/
}

.container-kategori a:hover img {
  transition: 0.9s;
  /* Transisi halus untuk perubahan gambar */
}

.container-kategori a {
  text-decoration: none;
  color: #8620f0;
  transition: color 0.9s;
}

.container-kategori a:hover {
  color: #ffffff;
  /* Warna teks saat dihover (tomato) */
}

#meja-icon:hover {
  content: url('./image/material-symbols--table-bar-outline.png');
  /* Ganti dengan path gambar yang ingin ditampilkan saat hover */
}

.container-kategori img {
  transition: 1s;
  /* Animasi halus untuk efek berganti gambar */
}

#lemari-icon:hover {
  content: url('./image/mdi--cupboard-outline.png');
  /* Ganti dengan path gambar yang ingin ditampilkan saat hover */
}

#bantal-icon:hover {
  content: url('./image/lucide-lab--pillow.png');
  /* Ganti dengan path gambar yang ingin ditampilkan saat hover */
}

#ranjang-icon:hover {
  content: url('./image/lucide--bed.png');
  /* Ganti dengan path gambar yang ingin ditampilkan saat hover */
}

#kursi-icon:hover {
  content: url('./image/hugeicons--chair-02.png');
  /* Ganti dengan path gambar yang ingin ditampilkan saat hover */
}

#jemuran-icon:hover {
  content: url('./image/game-icons--clothesline.png');
  /* Ganti dengan path gambar yang ingin ditampilkan saat hover */
}
</style>
