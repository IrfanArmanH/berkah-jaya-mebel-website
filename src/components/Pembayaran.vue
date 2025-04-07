<template>

    <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    </head>

    <body>
        <div class="body-pembayaran">
            <div class="container">
                <div class="row">
                    <div class="col-1">
                        <router-link to="/halaman-utama" class="back-arrow">&larr;</router-link>
                    </div>
                    <div class="col-10">
                        <div class="header">
                            <h1>Konfirmasi Pembayaran</h1>
                            <p>{{ currentDate }}</p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Nama Produk</th>
                                        <th>Jumlah</th>
                                        <th>Harga</th>
                                        <th>Total Harga</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="cart.length === 0">
                                        <td colspan="5" class="text-center">Keranjang Anda kosong</td>
                                    </tr>
                                    <tr v-for="item in cart" :key="item.nama_produk">
                                        <td>{{ item.nama_produk }}</td>
                                        <td>{{ item.quantity }}</td>
                                        <td>{{ formatRupiah(item.harga) }}</td>
                                        <td>{{ formatRupiah(item.totalPrice) }}</td>
                                        <td>
                                            <button class="btn btn-danger" @click="removeItem(item)">Hapus</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="total-payment">
                            Total Pembayaran: {{ formatRupiah(totalPayment + shippingCost) }}
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="info-section">
                            <h5>Nama Pelanggan:</h5>
                            <p>{{ customerName }}</p>
                        </div>
                        <div class="info-section">
                            <h5>Email Pelanggan:</h5>
                            <p>{{ customerEmail }}</p>
                        </div>
                        <div class="info-section">
                            <h5>Alamat Pelanggan:</h5>
                            <textarea class="form-control" rows="2">{{ customerAddress }}</textarea>
                        </div>
                        <div class="info-section">
                            <h5>Opsi Pengiriman:</h5>
                            <button
                                :class="['btn', { 'btn-warning': shippingOption === 'Ambil Sendiri', 'btn-light': shippingOption !== 'Ambil Sendiri' }]"
                                @click="selectShipping('Ambil Sendiri')">Ambil Sendiri</button>
                            <button
                                :class="['btn', { 'btn-warning': shippingOption === 'Diantar', 'btn-light': shippingOption !== 'Diantar' }]"
                                @click="selectShipping('Diantar')">Diantar +Rp. 15.000</button>
                        </div>
                        <div class="info-section">
                            <h5>Pesan Pengiriman (Optional):</h5>
                            <textarea class="form-control" rows="2" v-model="deliveryMessage"></textarea>
                        </div>
                        <div class="info-section">
                            <button class="order-button" @click="placeOrder">Pesan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
    setup() {
        const cart = ref([]);
        const customerName = ref("");
        const customerEmail = ref("");
        const customerAddress = ref("");
        const orderStatus = ref("");
        const deliveryMessage = ref("");
        const currentDate = ref(new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        const totalPayment = ref(0);
        const shippingCost = ref(0);
        const shippingOption = ref("Ambil Sendiri"); // State untuk menyimpan opsi pengiriman yang dipilih
        const router = useRouter();
        const auth = getAuth();
        const db = getFirestore();

        const fetchCartAndUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                // Ambil data keranjang
                const cartDoc = await getDoc(doc(db, 'users', user.uid));
                if (cartDoc.exists()) {
                    cart.value = cartDoc.data().cart || [];
                    totalPayment.value = cart.value.reduce((total, item) => total + item.totalPrice, 0);
                } else {
                    cart.value = [];
                    totalPayment.value = 0;
                }

                // Ambil data pengguna
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    customerName.value = userData.name || "";
                    customerEmail.value = userData.email || "";
                    customerAddress.value = userData.address || "";
                }
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

        const removeItem = async (item) => {
            const confirmDelete = confirm('Apakah Anda yakin ingin menghapus produk ini?');
            if (confirmDelete) {

                cart.value = cart.value.filter(cartItem => cartItem.nama_produk !== item.nama_produk);
                const user = auth.currentUser;
                if (user) {
                    const cartRef = doc(db, 'users', user.uid);
                    await setDoc(cartRef, { cart: cart.value }, { merge: true });
                }
                totalPayment.value = cart.value.reduce((total, item) => total + item.totalPrice, 0);
            }
        };

        const selectShipping = (option) => {
            shippingOption.value = option;
            shippingCost.value = option === 'Diantar' ? 15000 : 0; // Tambah biaya jika Diantar
        };

        const placeOrder = async () => {
            const auth = getAuth(); // Mendapatkan instance auth
            const user = auth.currentUser;
            if (user) {
                const orderData = {
                    customerName: customerName.value,
                    customerEmail: customerEmail.value,
                    customerAddress: customerAddress.value,
                    deliveryMessage: deliveryMessage.value,
                    shippingOption: shippingOption.value,
                    orderStatus: "Pending", // Menambahkan status pesanan
                    cart: cart.value,
                    totalPayment: totalPayment.value + shippingCost.value,
                    createdAt: new Date()
                };

                // Membuat ID unik untuk setiap pemesanan
                const ordersRef = doc(db, 'orders', `${user.uid}-${new Date().getTime()}`); // Menggunakan timestamp sebagai bagian dari ID
                await setDoc(ordersRef, { ...orderData }, { merge: true });

                // Memperbarui stok produk berdasarkan cart
                for (const item of cart.value) {
                    if (item.id_produk && item.quantity) { // Pastikan ID dan kuantitas ada
                        const productRef = doc(db, 'produk', item.id_produk); // Ganti 'products' dengan 'produk'
                        await updateDoc(productRef, {
                            stok: increment(-item.quantity) // Mengurangi stok
                        });
                        // Mengosongkan cart pengguna
                        const cartRef = doc(db, 'users', user.uid);
                        await setDoc(cartRef, { cart: [] }, { merge: true });
                    } else {
                        console.error("Item tidak valid:", item);
                    }
                }
                // Navigasi ke halaman informasi pembayaran
                router.push('/informasi-pembayaran');
            }
        };

        onMounted(() => {
            fetchCartAndUserData();
        });

        return {
            cart,
            customerName,
            customerEmail,
            customerAddress,
            deliveryMessage,
            currentDate,
            totalPayment,
            shippingCost,
            formatRupiah,
            removeItem,
            selectShipping,
            placeOrder,
            shippingOption,
            orderStatus
        };
    },
};
</script>

<style scoped>
.body-pembayaran {
    background-color: #2E1A6B;
    color: #FFFFFF;
    font-family: Arial, sans-serif;
    height: 100vh;
}

.container {
    padding-top: 50px;
}

.header {
    text-align: center;
    color: #FFC107;
}

.header h1 {
    font-size: 36px;
}

.header p {
    font-size: 14px;
    color: #B0A8B9;
}

.back-arrow {
    font-size: 32px;
    color: #FFC107;
    cursor: pointer;
    text-decoration: none;
}

.table-container {
    border: 1px solid #FFFFFF;
    padding: 20px;
    margin-top: 20px;
}

.table th,
.table td {
    background-color: #2E1A6B;
    color: #FFFFFF;
    border: 1px solid #FFFFFF;
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

.table th {
    background-color: #2E1A6B;
}

.info-section {
    margin-top: 20px;
}

.info-section h5 {
    color: #FFC107;
}

.info-section .form-control {
    background-color: #6A1B9A;
    color: #FFFFFF;
    border: none;
}

.info-section .btn {
    border: none;
    margin-right: 10px;
    color: white;
}

.info-section .btn.active {
    background-color: #FFC107;
    color: #2E1A6B;
}

.total-payment {
    color: #FFC107;
    font-size: 18px;
    margin-top: 20px;
    font-weight: bold;
    font-size: 1.2em;
}

.order-button {
    background-color: #FFC107;
    color: #2E1A6B;
    border: none;
    padding: 10px 20px;
    font-size: 18px;
    border-radius: 5px;
    margin-top: 20px;
    text-decoration: none;
}

.btn-warning {
    background-color: #FFC107;
    color: black;
}

.btn-light {
    background-color: #6A1B9A;
}
</style>