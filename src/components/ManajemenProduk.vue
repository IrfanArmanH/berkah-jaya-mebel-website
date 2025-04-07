<template>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
  </head>
    <body>
        <header>
        <h1>SUBUR RAYA</h1>
        <input type="text" placeholder="Cari...">
        <div class="right-navbar">
          <nav>
            <a href="#">
                <RouterLink to="manajemen-pesanan">Daftar Pesanan</RouterLink>
            </a>
            <a href="#" id="link-login" @click="logout">
              <RouterLink to="/login"> | Logout</RouterLink>
            </a>
          </nav>
        </div>
      </header>
        <main>
            <div id="div-daftar-produk">
                <h1 id="h1-daftar-produk">Daftar Produk</h1>
                <hr><br>
                <button id="tambah-produk">
                    <router-link to="/input-produk" style="color: white; text-decoration: none;"><b>Tambah
                            Produk</b></router-link>
                </button><br>

                <table>
                    <thead>
                        <tr>
                        <th class="nomor">No.</th>
                        <th class="kategori">Kategori</th>
                        <th class="nama-produk">Nama Produk</th>
                        <th>Gambar</th>
                        <th class="stok">Stok</th>
                        <th>Harga</th>
                        <th class="edit-hapus">Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(produk, index) in produkList" :key="produk.id">
                        <td class="nomor">{{ index + 1 }}</td>
                        <td class="kategori">{{ produk.kategori }}</td>
                        <td class="nama-produk">{{ produk.nama_produk }}</td>
                        <td><img :src=produk.gambar alt="Gambar Produk" width="80" height="80" /></td>
                        <td>{{ produk.stok }}</td>
                        <td>{{ formatRupiah(produk.harga) }}</td>
                        <td class="edit-hapus">
                            <div>
                                <button class="warna-edit" @click="editProduct(produk.id)">Edit</button>
                                <button class="warna-hapus" @click="deleteProduct(produk.id)">Hapus</button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
        </main>
    </body>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

export default {
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

        const editProduct = (id) => {
            router.push(`/input-produk/${id}`);
        };

        const deleteProduct = async (id) => {
            const confirmDelete = confirm('Apakah Anda yakin ingin menghapus produk ini?');
            if (confirmDelete) {
                try {
                    const produkRef = doc(db, 'produk', id);
                    await deleteDoc(produkRef);
                    console.log('Produk berhasil dihapus:', id);
                    // Memperbarui daftar produk setelah penghapusan
                    fetchProducts();
                } catch (error) {
                    console.error('Error deleting product:', error);
                    alert('Terjadi kesalahan saat menghapus produk: ' + error.message);
                }
            }
        };

        onMounted(() => {
            // Pastikan status login ada di localStorage
            if (localStorage.getItem('userRole') === 'admin') {
                router.push('/manajemen-produk');
            } else if (localStorage.getItem('userRole') !== 'admin') {
                router.push('/login');
            } else if (localStorage.getItem('isLoggedIn') === null) {
                localStorage.setItem('isLoggedIn', 'false');
                router.push('/');
            }
            fetchProducts();
        });

        return {
            produkList,
            editProduct,
            deleteProduct,
            isLoggedIn,
            logout
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
a {
    text-decoration: none;
    color: rgb(250, 235, 215);
}

a:hover {
  color: #FFC300;
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
    background-color: #21146A;
    margin: 0%;
    padding: 10px;
    /* Add padding to the header */
}

input[type='text'] {
    width: 43%;
    height: 45px;
    outline: none;
    font-size: larger;
}

body {
    margin: 0;
}

main {
    margin-top: 3.5%;
}

h1 {
    color: #FFC300;
    font-weight: bold;
}


#h1-daftar-produk {
    color: #21146A;
    font-size: 48px;
    font-family: Arial, Helvetica, sans-serif;
    padding: 1% 1% 0% 5%;
}


#div-daftar-produk {
    background-color: #ffffff;
    border: 1.5px solid black;
    margin-top: 1%;
    margin-left: 4%;
    margin-right: 4%;
    margin-bottom: 3%;
}

#tambah-produk {
    font-size: larger;
    float: inline-end;
    margin-right: 3%;
    margin-bottom: 1.4%;
    background-color: #FFC300;
    border: 1px solid #FFC300;
    border-radius: 24px;
    color: black;
    padding: 6px 44px;
    transition: 0.2s;
}

#tambah-produk:hover {
    background-color: #d4a404;
}

table,
th,
td {
    border: 1px solid black;
    border-collapse: collapse;
}

table {
    margin-right: auto;
    margin-left: auto;
    width: 93%;
    margin-bottom: 4%;
}

th {
    text-align: center;
    padding: 1%;
    font-family: Arial, Helvetica, sans-serif;
}

td {
    text-align: center;
    padding: 1%;
}


.edit-hapus {
    width: 12%;
    text-align: center;
}

.edit-hapus div {
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: center;
    flex-wrap: nowrap;
}

.edit-hapus button {
    font-weight: 550;
    border: none;
    border-radius: 5px;
}

.nomor {
    width: 5%;
    text-align: center;
    vertical-align: middle;
    /* Menempatkan teks di tengah secara vertikal */
    padding: 10px;
    /* Atur padding jika diperlukan */
}

.warna-edit {
    background-color: #8620F0;
    color: #ffffff;
    padding: 11px 12px;
    transition: 0.3s;
    cursor: pointer;
}

.warna-edit:hover {
    background-color: #6e1bc6;
}

.warna-hapus {
    background-color: red;
    color: #ffffff;
    padding: 11px 7px;
    transition: 0.3s;
    cursor: pointer;
}

.warna-hapus:hover {
    background-color: rgb(193, 7, 7);
}

.nama-produk {
    width: 21.3%;
}

.kategori {
    width: 15%;
}

.stok {
    width: 8.9%;
}
</style>