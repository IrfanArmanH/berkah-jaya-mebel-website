<template>
    <nav class="header d-flex align-items-center py-3">
      <div class="row w-100 align-items-center px-4">
        <div class="col-3 text-center">
          <RouterLink to="/" class="link-underline link-underline-opacity-0 fw-bold text-white">
            <h2>SUBUR RAYA</h2>
          </RouterLink>
        </div>
        <!-- Search Bar -->
        <div class="col-4">
          <input type="search" class="form-control" placeholder="Cari di sini..." />
        </div>
        <div class="col d-flex justify-content-between align-items-center">
          <RouterLink to="/informasi-toko"
            class="text-white link-underline link-underline-opacity-0 me-5 fw-semibold fs-5">Informasi Toko</RouterLink>
          <div v-if="isLoggedIn">
            <RouterLink to="/pembayaran" class="text-white link-underline link-underline-opacity-0 me-5 fw-semibold fs-5">
              <i class="fas fa-shopping-cart">
                <span v-if="cartItemCount > 0"> {{ cartItemCount }}</span>
              </i>
            </RouterLink>
  
            <RouterLink to="/profil"
              class="bi bi-person text-white link-underline link-underline-opacity-0 me-5 fw-semibold fs-5">
              Pengguna</RouterLink>
          </div>
          <div v-else>
            <RouterLink to="/signup" class="text-white link-underline link-underline-opacity-0 fw-semibold fs-5">Daftar
            </RouterLink>
            <span class="text-white mx-2 fw-semibold fs-5">|</span>
            <RouterLink to="/login" class="link-underline link-underline-opacity-0 text-white fw-semibold fs-5">Login
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
  </template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
    name: 'NavBarUser',
    setup() {
        const auth = getAuth();
        const db = getFirestore();
        const cartItemCount = ref(0);
        const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true');

        const fetchCartCount = async () => {
            const user = auth.currentUser;
            if (user) {
                const cartDoc = await getDoc(doc(db, 'users', user.uid));
                if (cartDoc.exists()) {
                    const cartData = cartDoc.data();
                    cartItemCount.value = cartData.cart ? cartData.cart.length : 0; // Hitung jumlah item unik di keranjang    
                } else {
                    cartItemCount.value = 0;
                }
            }
        };

        onMounted(() => {
            if (isLoggedIn.value) {
                fetchCartCount();
            }
        });

        return {
            isLoggedIn,
            cartItemCount
        };
    },
}
</script>

<style scoped>
h2 {
  color: #ffc300;
}

.header {
  background-color: #21146a;
}

input.form-control {
  border: none;
  border-radius: 5px;
  padding: 10px;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>