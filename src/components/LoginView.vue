<template>
  <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    </head>
  <div class="login-container">
    <div class="login-box">
      <h1>Log In</h1>
      <!-- Form login -->
      <form @submit.prevent="signIn">
        <div class="input-field">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Masukan Email Anda . . ." required/>
        </div>

        <div class="input-field">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Masukan Password Anda . . ." required/>
        </div>

        <!-- Lupa Password -->
        <a href="" class="lupa-password">Lupa Password ?</a>

        <!-- Tombol Log In -->
        <button type="submit" class="login-btn">Login</button>
      </form>

      <!-- Divider dan Tombol Login dengan Google -->
      <div class="divider"></div>
      <br /><br />
      <button class="google-btn" @click="loginWithGoogle">Login with Google</button>

      <!-- Link ke Sign Up -->
      <p><router-link to="/signup">Sign Up</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const email = ref('');
const password = ref('');
const errMsg = ref();
const router = useRouter();
const auth = getAuth();
const db = getFirestore();

const signIn = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log('Successfully logged in!');

    // Dapatkan UID pengguna
    const user = userCredential.user;
    
    // Ambil data pengguna dari Firestore untuk mendapatkan role
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Tambahkan item ke localStorage tanpa pengecekan
      localStorage.setItem('userUID', user.uid);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('isLoggedIn', "true");

      // Redirect berdasarkan role
      if (userData.role === 'admin') {
        router.push('/manajemen-pesanan'); // Redirect ke halaman admin
      } else if (userData.role === 'pelanggan') {
        router.push('/halaman-utama'); // Redirect ke halaman pelanggan
      } else {
        console.error('Role tidak dikenali:', userData.role);
      }
    } else {
      console.error('User document does not exist!');
    }
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        errMsg.value = 'Invalid email';
        break;
      case 'auth/user-not-found':
        errMsg.value = 'No account with that email was found';
        break;
      case 'auth/wrong-password':
        errMsg.value = 'Incorrect password';
        break;
      default:
        errMsg.value = 'Email or password was incorrect';
        break;
    }
  }
};
</script>

<style scoped>
/* Fullscreen and Centering Layout */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #21146A;
  width: 100%;
}

.login-box {
  background-color: #3e3674;
  border-radius: 10px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #fff;
  margin-bottom: 20px;
}

/* Tombol Login dengan Google */
.google-btn {
  width: 100%;
  padding: 10px;
  background-color: #ffffff;
  border: none;
  border-radius: 90px;
  color: #3e3674;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
}

.google-btn:hover {
  background-color: #e0e0e0;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0;
}

/* Tampilan Divider */
.divider hr {
  border: none;
  border-top: 1px solid #fff;
  width: 40%;
}

.divider span {
  color: #fff;
  margin: 0 10px;
}

/* Form Input Fields */
.input-field {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  font-size: 14px;
  color: #fff;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #7b3af5;
  color: #fff;
  font-size: 14px;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* Lupa Password */
.lupa-password {
  display: block;
  margin-bottom: 20px;
  margin-left: 3%;
  font-size: 14px;
  color: #da2f11;
  /* Warna merah */
  text-align: left;
  /* Posisi kiri */
  text-decoration: none;
}

.lupa-password:hover {
  text-decoration: underline;
}

/* Tombol Login */
.login-btn {
  width: 50%;
  /* Tombol tidak terlalu memanjang */
  padding: 10px;
  background-color: #ffb703;
  border: none;
  border-radius: 90px;
  color: #3e3674;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #ffaa00;
}

/* Link ke Sign Up */
a {
  color: #ffb703;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Media Queries for Responsive Design */
@media (max-width: 768px) {
  .login-box {
    width: 90%;
    padding: 20px;
  }

  .login-btn {
    font-size: 14px;
  }

  .google-btn {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 24px;
  }

  input {
    font-size: 12px;
    padding: 8px;
  }

  .login-btn,
  .google-btn {
    padding: 8px;
    font-size: 14px;
  }
}
</style>
