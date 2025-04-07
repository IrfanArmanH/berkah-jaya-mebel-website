<template>
  <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
  </head>

  <body>
    <div class="body-inputProduk">
      <RouterLink to="/manajemen-produk">
        <img src="./image/line-md--arrow-up.png" alt="" id="arrow">
      </RouterLink>
      <div id="div-daftar-produk">
        <h1 id="h1-daftar-produk">{{ isEditMode ? 'Edit Produk' : 'Input Produk' }}</h1>
        <hr><br>
        <div class="form-container">
          <label for="kategori">Kategori Produk:</label>
          <select v-model="kategori" name="kategori" id="kategori" required>
            <option value="" disabled>Pilih Kategori</option>
            <option value="Set Meja">Set Meja</option>
            <option value="Lemari">Lemari</option>
            <option value="Bantal & Guling">Bantal & Guling</option>
            <option value="Ranjang">Ranjang</option>
            <option value="Kursi">Kursi</option>
            <option value="Jemuran">Jemuran</option>
          </select>

          <label for="nama">Nama Produk:</label>
          <input type="text" id="nama" name="nama" v-model="nama_produk" placeholder="Masukkan Nama Produk . . ." required />

          <label for="deskripsi">Deskripsi Produk:</label>
          <textarea id="deskripsi" name="deskripsi" v-model="deskripsi" placeholder="Masukkan Deskripsi Produk . . ." required></textarea>

          <label for="stok">Stok Produk:</label>
          <input type="number" id="stok" name="stok" v-model="stok" placeholder="Masukkan Jumlah Stok Produk . . ." required />

          <label for="harga">Harga Produk:</label>
          <input type="number" id="harga" name="harga" v-model="harga" placeholder="Masukkan Harga Produk . . ." required />
          
          <label for="gambar">Gambar Produk:</label>
          <input type="text" id="gambar" name="gambar" v-model="gambar" placeholder="Masukkan Link Gambar Produk . . ." required />
        </div>
        <br>
        <button @click="isEditMode ? updateProduk() : tambahProduk()"><b>{{ isEditMode ? 'Update' : 'Input' }}</b></button>
      </div>
    </div>
  </body>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export default {
  setup() {
    const id_produk = ref('');
    const nama_produk = ref('');
    const kategori = ref('');
    const deskripsi = ref('');
    const harga = ref(0);
    const stok = ref(0);
    const gambar = ref('');
    const router = useRouter();
    const route = useRoute();
    const db = getFirestore();
    const isEditMode = ref(false);

    const generateRandomId = () => {
      return 'prod-' + Math.random().toString(36).substr(2, 9);
    };

    const fetchProduct = async (id) => {
      const productDoc = doc(db, 'produk', id);
      const productSnapshot = await getDoc(productDoc);
      if (productSnapshot.exists()) {
        const productData = productSnapshot.data();
        id_produk.value = productData.id_produk; // Ambil ID produk dari Firestore
        nama_produk.value = productData.nama_produk;
        kategori.value = productData.kategori;
        deskripsi.value = productData.deskripsi;
        harga.value = productData.harga;
        stok.value = productData.stok;
        gambar.value = productData.gambar;
      } else {
        console.error('No such product!');
      }
    };

    const tambahProduk = async () => {
      if (!nama_produk.value || !kategori.value || harga.value <= 0 || stok.value < 0 || !gambar.value) {
        alert('Pastikan semua field diisi dengan benar.');
        return;
      }

      try {
        const produkRef = doc(db, "produk", id_produk.value || generateRandomId());
        await setDoc(produkRef, {
          id_produk: id_produk.value || generateRandomId(),
          nama_produk: nama_produk.value,
          kategori: kategori.value,
          deskripsi: deskripsi.value,
          harga: harga.value,
          stok: stok.value,
          gambar: gambar.value,
        });

        console.log('Produk berhasil ditambahkan!');
        resetForm();
        router.push('/manajemen-produk');
      } catch (error) {
        console.error('Error adding product:', error);
        alert('Terjadi kesalahan saat menambahkan produk: ' + error.message);
      }
    };

    const updateProduk = async () => {
      if (!nama_produk.value || !kategori.value || harga.value <= 0 || stok.value < 0 || !gambar.value) {
        alert('Pastikan semua field diisi dengan benar.');
        return;
      }

      try {
        const produkRef = doc(db, "produk", route.params.id); // Menggunakan ID dari URL
        await setDoc(produkRef, {
          id_produk: id_produk.value,
          nama_produk: nama_produk.value,
          kategori: kategori.value,
          deskripsi: deskripsi.value,
          harga: harga.value,
          stok: stok.value,
          gambar: gambar.value,
        });

        console.log('Produk berhasil diperbarui!');
        resetForm();
        router.push('/manajemen-produk');
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Terjadi kesalahan saat memperbarui produk: ' + error.message);
      }
    };

    const resetForm = () => {
      id_produk.value = generateRandomId(); // Reset ID produk ke ID acak
      nama_produk.value = '';
      kategori.value = '';
      deskripsi.value = '';
      harga.value = 0;
      stok.value = 0;
      gambar.value = '';
    };

    onMounted(() => {
      if (route.params.id) {
        isEditMode.value = true; // Menandakan kita dalam mode edit
        fetchProduct(route.params.id); // Memuat data produk untuk diedit
      } else {
        id_produk.value = generateRandomId(); // Generate ID produk acak saat input baru
      }
    });

    return {
      id_produk,
      nama_produk,
      kategori,
      deskripsi,
      harga,
      stok,
      gambar,
      tambahProduk,
      updateProduk,
      isEditMode
    };
  },
};
</script>

<style scoped>
.body-inputProduk {
  background-color: #21146A;
  height: 100vh;
  margin: 0;
  overflow: hidden;
}

.form-container {
  display: grid;
  grid-template-columns: 12% 70%;
  /* Kolom pertama untuk label, kolom kedua untuk input */
  gap: 8px;
  /* Jarak antar elemen */
  width: 100%;
  /* Mengisi lebar penuh */
  margin-left: 15%;
}

label {
  text-align: left;
  padding: 10px;
}

input[type="text"],
input[type="number"],
textarea,
select {
  width: 80%;
  padding: 10px;
  box-sizing: border-box;
  background-color: #8620F0;
  border: none;
  border-radius: 10px;
  color: #ffffff;
}

#div-daftar-produk {
  background-color: #21146A;
  border: 1.5px solid black;
  margin-top: 1%;
  margin-left: 4%;
  margin-right: 4%;
  margin-bottom: 3%;
  border: 2px solid #ffffff;
}

#h1-daftar-produk {
  color: #FFC300;
  font-size: 48px;
  font-family: Arial, Helvetica, sans-serif;
  padding: 1% 1% 0% 5%;
  text-align: center;
}


img {
  transform: rotate(-90deg);
  width: 30px;
  height: 30px;
  margin-top: 2.5%;
  margin-left: 4%;
  margin-bottom: 0;
}

button {
  display: flex;
  justify-content: center;
  font-size: 1.7em;
  padding: 9px 28px;
  border-radius: 21px;
  border: none;
  background-color: #FFC300;
  margin-bottom: 2.2%;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
}

button:hover {
  color: #ffffff;
}

label {
  color: #ffffff;
}
</style>