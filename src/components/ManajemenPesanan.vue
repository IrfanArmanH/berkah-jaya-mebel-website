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
            <RouterLink to="/manajemen-produk">Daftar Produk</RouterLink>
          </a>
          <a href="#" id="link-login" @click="logout">
            <RouterLink to="/login"> | Logout</RouterLink>
          </a>
        </nav>
      </div>
    </header>
    <main>
      <div id="div-daftar-produk">
        <h1 id="h1-daftar-produk">Daftar Pesanan</h1>
        <hr><br>

        <table>
          <thead>
            <tr>
              <th class="nomor">No.</th>
              <th>Waktu Pesan</th>
              <th class="nama-pelanggan">Nama Pelanggan</th>
              <th class="alamat">Alamat</th>
              <th class="pengiriman">Jenis Pengiriman</th>
              <th>Total Harga</th>
              <th>Status</th>
              <th class="edit-hapus">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in orders" :key="order.id">
              <td class="nomor">{{ index + 1 }}</td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td class="nama-pelanggan">{{ order.customerName }}</td>
              <td class="alamat">{{ order.customerAddress }}</td>
              <td class="pengiriman">{{ order.shippingOption }}</td>
              <td>{{ formatRupiah(order.totalPayment) }}</td>
              <td>{{ order.orderStatus }}</td>
              <td class="edit-hapus">
                <div>
                  <button class="warna-edit" @click="viewDetails(order.id)">Rincian</button>
                  <select v-model="order.orderStatus" @change="updateStatus(order.id, order.orderStatus)" :class="{
                    'status-Berhasil': order.orderStatus === 'Berhasil',
                    'status-pending': order.orderStatus === 'Pending',
                    'status-ditolak': order.orderStatus === 'Ditolak'
                  }">
                    <option value="Berhasil">Berhasil</option>
                    <option value="Pending">Pending</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>
              </td>
            </tr>
            <tr v-if="orders.length === 0">
              <td colspan="8" class="text-center">Tidak ada pesanan tersedia</td>
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
import { getFirestore, collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';

export default {
  setup() {
    const orders = ref([]);
    const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true');
    const router = useRouter();
    const db = getFirestore();

    const fetchOrders = async () => {
      const ordersCollection = collection(db, 'orders');
      const orderSnapshot = await getDocs(ordersCollection);
      orders.value = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const logout = () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userUID');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');

      isLoggedIn.value = false;
      window.location.reload();
    };

    const viewDetails = (id) => {
      router.push(`/informasi-pembayaran/${id}`);
    };

    const updateStatus = async (id, newStatus) => {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, {
        orderStatus: newStatus
      });
      console.log(`Status pesanan dengan ID: ${id} telah diubah menjadi: ${newStatus}`);
    };

    onMounted(() => {
      if (localStorage.getItem('userRole') === 'admin') {
        fetchOrders();
      } else {
        router.push('/login');
      }
    });

    return {
      orders,
      isLoggedIn,
      logout,
      viewDetails,
      updateStatus,
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
    },
    formatDate(timestamp) {
      // Jika timestamp adalah objek Timestamp dari Firebase
      if (timestamp instanceof Timestamp) {
        const date = timestamp.toDate(); // Konversi ke objek Date
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
        return date.toLocaleString('id-ID', options);
      }
      return 'Invalid date'; // Jika bukan objek Timestamp
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
  width: 38%;
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
  border: 2px solid #21146A;
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
  width: 16%;
  text-align: center;
}

.edit-hapus div {
  display: flex;
  flex-direction: row;
  gap: 11px;
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
  transition: 0.2s;
  cursor: pointer;
}

.warna-edit:hover {
  background-color: #6e1bc6;
}

.warna-hapus {
  background-color: #FFC300;
  ;
  color: #000000;
  padding: 11px 16px;
  transition: 0.2s;
  cursor: pointer;
}

.warna-hapus:hover {
  background-color: #d0a105;
}

.alamat {
  width: 18%;
}

.nama-pelanggan {
  width: 14%;
}

.pengiriman {
  width: 14%;
}

.status-Berhasil {
  background-color: #d4edda;
  /* Hijau */
}

.status-pending {
  background-color: #fff3cd;
  /* Kuning */
}

.status-ditolak {
  background-color: #f8d7da;
  /* Merah */
}
</style>