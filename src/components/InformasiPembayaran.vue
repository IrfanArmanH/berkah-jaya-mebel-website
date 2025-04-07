<template>

    <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    </head>

    <body>
        <div class="informasi-pembelian">
            <div class="container">
                <div class="row">
                    <div class="col-1">
                        <router-link to="/halaman-utama" class="back-arrow">&larr;</router-link>
                    </div>
                    <div class="col-10">
                        <div class="header">
                            <h1>Informasi Pembelian</h1>
                            <p>{{ formatDate(createdAt) }}</p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <p>Status Pesanan: </p>
                        <div class="status-box">{{ orderStatus }}</div>
                        <p>Nama Pelanggan:<br>{{ customerName }}</p>
                        <p>Email Pelanggan:<br>{{ customerEmail }}</p>
                        <p>Alamat Pelanggan:<br>{{ customerAddress }}</p>
                        <p>Opsi Pengiriman:<br>{{ shippingOption }}</p>
                        <p>Pesan:<br>{{ deliveryMessage }}</p>
                    </div>
                    <div class="col-8">
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Nama Produk</th>
                                        <th>Jumlah</th>
                                        <th>Harga</th>
                                        <th>Total Harga</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="cart.length === 0">
                                        <td colspan="4" class="text-center">Belum Ada Pembayaran</td>
                                    </tr>
                                    <tr v-for="item in cart" :key="item.id">
                                        <td>{{ item.nama_produk }}</td>
                                        <td>{{ item.quantity }}</td>
                                        <td>{{ formatRupiah(item.harga) }}</td>
                                        <td>{{ formatRupiah(item.harga * item.quantity) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p class="total-payment">Total Pembayaran: {{ formatRupiah(totalPayment) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getFirestore, doc, getDoc, collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
    setup() {
        const orderId = ref("");
        const createdAt = ref("");
        const customerName = ref("");
        const customerEmail = ref("");
        const customerAddress = ref("");
        const shippingOption = ref("");
        const deliveryMessage = ref("");
        const orderStatus = ref("");
        const totalPayment = ref(0);
        const cart = ref([]);
        const auth = getAuth();
        const db = getFirestore();
        const route = useRoute();

        const fetchOrderData = async () => {
            const user = auth.currentUser;
            if (user) {
                // Ambil semua pesanan berdasarkan user ID, urutkan dan ambil yang terbaru
                const ordersRef = collection(db, 'orders');
                const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'), limit(1));
                const orderSnapshot = await getDocs(ordersQuery);

                if (!orderSnapshot.empty) {
                    const orderData = orderSnapshot.docs[0].data(); // Ambil pesanan terbaru
                    orderId.value = orderSnapshot.docs[0].id; // Ambil ID dokumen pesanan
                    customerName.value = orderData.customerName || "";
                    customerEmail.value = orderData.customerEmail || "";
                    customerAddress.value = orderData.customerAddress || "";
                    shippingOption.value = orderData.shippingOption || "";
                    deliveryMessage.value = orderData.deliveryMessage || "";
                    orderStatus.value = orderData.orderStatus || "";
                    createdAt.value = orderData.createdAt || "";
                    cart.value = orderData.cart || [];
                    totalPayment.value = orderData.totalPayment || 0; // Ambil total pembayaran
                    orderStatus.value = orderData.status || "Menunggu Pembayaran"; // Ambil status pesanan
                }
            }
        };

        const fetchOrderDataRincian = async (id) => {
            const orderDoc = doc(db, 'orders', id); // Mengambil dokumen dari koleksi 'orders'
            const orderSnapshot = await getDoc(orderDoc);

            if (orderSnapshot.exists()) {
                const orderData = orderSnapshot.data(); // Ambil data pesanan
                orderId.value = orderSnapshot.id; // Ambil ID pesanan
                customerName.value = orderData.customerName || "";
                customerEmail.value = orderData.customerEmail || "";
                customerAddress.value = orderData.customerAddress || "";
                shippingOption.value = orderData.shippingOption || "";
                deliveryMessage.value = orderData.deliveryMessage || "";
                orderStatus.value = orderData.orderStatus || "";
                createdAt.value = orderData.createdAt || "";
                cart.value = orderData.cart || []; // Ambil daftar produk dalam pesanan
                totalPayment.value = orderData.totalPayment || 0; // Ambil total pembayaran
            } else {
                console.error('No such order!');
            }
        };

        const formatRupiah = (angka) => {
            const format = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            });
            return format.format(angka);
        };

        onMounted(() => {
            if (route.params.id) {
                fetchOrderDataRincian(route.params.id);
            } else {
                fetchOrderData();
            }
        });

        return {
            orderId,
            createdAt,
            orderStatus,
            customerName,
            customerEmail,
            customerAddress,
            shippingOption,
            deliveryMessage,
            totalPayment,
            cart,
            formatRupiah
        };
    },
    methods: {
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
.informasi-pembelian {
    background-color: #2E1A6B;
    color: #FFFFFF;
    font-family: Arial, sans-serif;
    height: 100vh;
}

.container {
    padding: 20px;
}

.row {
    margin-top: 2%;
}

.header {
    /*H1 header*/
    text-align: center;
    color: #FFC107;
}

.header h1 {
    font-size: 36px;
    font-weight: bold;
}

.header p {
    font-size: 16px;
}

.header .order-id {
    /* Order ID */
    font-size: 18px;
    font-weight: bold;
    color: #FFC107;
}

.status-box,
.delivery-box {
    /* Status Pesanan & Opsi Pengiriman*/
    border: 1px solid #ffffff;
    width: 120px;
    height: 50px;
    margin-bottom: 10px;
}

.table-container {
    margin-top: 20px;
    border: 1px solid white;
    overflow: hidden;
}

.table {
    color: #FFFFFF;
    border: 1px solid #FFFFFF;
    margin: 2% auto;
    /* Tabel akan berada di tengah */
    width: 96%;
    /* Mengurangi lebar agar tidak meluap */

}

.table th,
.table td {
    background-color: #2E1A6B;
    border: 1px solid #ffffff;
    /*tampilan garis tabel*/
    color: #FFFFFF;
}

.table th {
    padding: 2.5%;
}

.table td {
    padding: 3.5%;
}

th {
    text-align: center;
}

.total-payment {
    /* Total Pembayaran */
    font-size: 18px;
    font-weight: bold;
    color: #FFC107;
    margin-top: 20px;
}

.back-arrow {
    font-size: 32px;
    color: #FFC107;
    cursor: pointer;
    text-decoration: none;
}
</style>