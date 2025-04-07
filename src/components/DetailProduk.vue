<template>

    <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    </head>

    <body>
        <NavBarUser />
        <div class="container mt-4">
            <div class="row">
                <div class="col-md-4 text-center">
                    <img :src="produk.gambar" alt="Product Image" class="product-image">
                </div>
                <div class="col-md-8">
                    <h3>{{ produk.nama_produk }}</h3>
                    <h4>{{ formatRupiah(produk.harga) }}</h4>
                    <h5>Pengiriman</h5>
                    <p><i class="fas fa-truck"></i> Pengiriman Ke <select>
                            <option>Kota</option>
                        </select></p>
                    <p>Ongkos Kirim <select>
                            <option>Rp 15.000</option>
                        </select></p>
                    <p>Estimasi tiba 2-5 hari</p>
                </div>
            </div>

            <div class="specifications">
                <h5>SPESIFIKASI</h5>
                <table class="table">
                    <tbody>
                        <tr>
                            <td>Kategori</td>
                            <td>{{ produk.kategori }}</td>
                        </tr>
                        <tr>
                            <td>Stok</td>
                            <td>{{ produk.stok }}</td>
                        </tr>
                        <tr>
                            <td>Masa Garansi</td>
                            <td>12 Bulan</td>
                        </tr>
                        <tr>
                            <td>Jenis Garansi</td>
                            <td>Garansi Produsen</td>
                        </tr>
                        <tr>
                            <td>Dikirim Dari</td>
                            <td>Kota Samarinda</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="description">
                <h5>Deskripsi Produk</h5>
                <p>{{ produk.deskripsi }}</p>
            </div>

            <div class="order-section">
                <h5>ATUR JUMLAH DAN CATATAN</h5>
                <p>{{ produk.nama_produk }}</p>
                <p>Stok: {{ produk.stok }}</p>
                <div class="input-group mb-3">
                    <button class="btn btn-outline-light" type="button" @click="decreaseQuantity">-</button>
                    <input type="text" class="form-control text-center" v-model="quantity" readonly>
                    <button class="btn btn-outline-light" type="button" @click="increaseQuantity">+</button>
                </div>
                <h4>Total: {{ formatRupiah(totalPrice) }}</h4>
                <button class="btn btn-warning btn-lg w-100" @click="addToCart">Beli</button>
            </div>
        </div><!--div class container mt-4 -->
        <Footer />
    </body>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getFirestore, doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavBarUser from './NavBarUser.vue';
import Footer from './Footer.vue';

export default {
    components: {
        NavBarUser,
        Footer
    },
    setup() {
        const produk = ref({
            nama_produk: '',
            kategori: '',
            harga: 0,
            stok: 0,
            gambar: ''
        });
        const route = useRoute();
        const db = getFirestore();
        const router = useRouter();
        const auth = getAuth();
        const quantity = ref(1); // Tambahkan untuk menyimpan jumlah
        const totalPrice = ref(0); // Untuk menyimpan total harga

        const fetchProduct = async (id) => {
            const productDoc = doc(db, 'produk', id);
            const productSnapshot = await getDoc(productDoc);
            if (productSnapshot.exists()) {
                produk.value = productSnapshot.data(); // Mengambil seluruh data produk
                totalPrice.value = produk.value.harga;
            } else {
                console.error('No such product!');
            }
        };

        onMounted(() => {
            if (localStorage.getItem('userRole') === 'pelanggan') {
                if (route.params.id) {
                    fetchProduct(route.params.id);
                }
            } else {
                router.push('/login');
            }
        });

        const increaseQuantity = () => {
            if (quantity.value < produk.value.stok) {
                quantity.value++;
                updateTotalPrice();
            }
        };

        const decreaseQuantity = () => {
            if (quantity.value > 1) {
                quantity.value--;
                updateTotalPrice();
            }
        };

        const updateTotalPrice = () => {
            totalPrice.value = produk.value.harga * quantity.value; // Mengupdate total harga
        };

        // Fungsi untuk menambahkan produk ke keranjang
        const addToCart = async () => {
            const user = auth.currentUser;
            if (!user) {
                alert('Silakan login untuk melanjutkan!');
                router.push('/login');
                return;
            }

            const cartItem = {
                ...produk.value,
                quantity: quantity.value,
                totalPrice: totalPrice.value
            };

            // Simpan ke Firestore
            const cartRef = doc(db, 'users', user.uid); // Menggunakan ID pengguna
            await setDoc(cartRef, {
                cart: arrayUnion(cartItem) // Pastikan arrayUnion diimpor
            }, { merge: true }); // Merge untuk memastikan data yang ada tidak hilang

            alert(`${cartItem.nama_produk} telah ditambahkan ke keranjang!`);
            router.push('/halaman-utama');
        };

        const formatRupiah = (angka) => {
            const format = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            });
            return format.format(angka);
        };

        return {
            produk,
            quantity,
            totalPrice,
            increaseQuantity,
            decreaseQuantity,
            formatRupiah,
            addToCart
        };
    },
};
</script>

<style scoped>
body {
    font-family: Arial, sans-serif;
    padding: 0;
    margin: 0;
}

.navbar {
    background-color: #3A0CA3;
}

.navbar-brand {
    color: #F4A261;
    font-weight: bold;
}

.navbar-nav .nav-link {
    color: white;
}

.product-image {
    width: 100%;
    max-width: 200px;
    height: auto;
}

.specifications,
.description,
.order-section {
    background-color: white;
    padding: 10px;
    margin-top: 20px;
    border: 1px solid #E9C46A;
}

.specifications h5,
.description h5,
.order-section h5 {
    background-color: #9B5DE5;
    color: white;
    padding: 10px;
    margin: -10px -10px 10px -10px;
}

.order-section {
    background-color: #3A0CA3;
    color: white;
}

.order-section .btn {
    background-color: #F4A261;
    color: black;
    font-weight: bold;
}


/* FOOTER CSS */

.footer {
    background-color: #3A0CA3;
    color: white;
    padding: 20px 0 20px 0;
    margin-top: 20px;
    width: 100%;
}

.footer a {
    color: white;
}

.footer h5 {
    color: #F4A261;
}

.footer p {
    margin-bottom: 5px;
}
</style>