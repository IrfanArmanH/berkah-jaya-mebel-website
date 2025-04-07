<template>

  <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
  </head>
  <div class="signup-container">
    <div class="signup-box">
      <h1>Sign Up</h1>
      <form @submit.prevent="register" class="row">
        <div class="col-md-6">
          <div class="input-field mb-3">
            <label for="name">Nama</label>
            <input type="text" id="name" v-model="name" class="form-control" placeholder="Masukan Nama Anda . . ." required />
          </div>

          <div class="input-field mb-3">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" class="form-control"
              placeholder="Masukan Email Anda . . ." required />
          </div>

          <div class="input-field mb-3">
            <label for="address">Alamat</label>
            <input type="text" id="address" v-model="address" class="form-control"
              placeholder="Masukan Alamat Anda . . ." required />
          </div>
        </div>

        <div class="col-md-6">

          <div class="input-field mb-3">
            <label for="phone">Nomor Telepon</label>
            <input type="text" id="phone" v-model="phone" class="form-control"
              placeholder="Masukan Nomor Telepon Anda . . ." required />
          </div>

          <div class="input-field mb-3">
            <label for="password">Password</label>
            <div class="input-group">
              <div class="col-md-6">
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" class="form-control"
                  placeholder="Masukan Password Anda . . ." required/>
              </div>
              <div class="col-md-6">
                <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility('password')">
                  <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="input-field mb-3">
            <label for="confirm-password">Konfirmasi Password</label>
            <div class="input-group">
              <div class="col-md-6">
              <input :type="showConfirmPassword ? 'text' : 'password'" id="confirm-password" v-model="confirmPassword"
                class="form-control" placeholder="Konfirmasi Password Anda . . ." required/>
              </div>
              <div class="col-md-6">
              <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility('confirm')">
                <i :class="showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </button>
            </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <button type="submit" class="signup-btn btn btn-primary">Sign Up</button>
          <br /><br />
        </div>
      </form>
      <p>Sudah Punya Akun? <router-link to="/login">Login</router-link></p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default {
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const address = ref('');
    const phone = ref('');
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const router = useRouter();
    const auth = getAuth();
    const db = getFirestore();

    const togglePasswordVisibility = (type) => {
      if (type === 'password') {
        showPassword.value = !showPassword.value;
      } else if (type === 'confirm') {
        showConfirmPassword.value = !showConfirmPassword.value;
      }
    };

    const register = async () => {
      if (password.value !== confirmPassword.value) {
        alert('Password dan konfirmasi password tidak cocok!');
        return;
      }

      try {
        // Buat pengguna baru di Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Simpan data pengguna ke Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: name.value,
          email: email.value,
          address: address.value,
          phone: phone.value,
          role: "pelanggan" // Tentukan peran pengguna di sini
        });

        console.log('User data saved in Firestore with role!');
        router.push('/login'); // Redirect ke halaman login setelah berhasil registrasi
      } catch (error) {
        console.error('Error during registration:', error);
        alert(error.message);
      }
    };

    return { name, email, password, confirmPassword, address, phone, showPassword, showConfirmPassword, togglePasswordVisibility, register };
  },
};
</script>

<style scoped>
/* Fullscreen and Centering Layout */
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #2d2b5f;
  width: 100%;
}

.signup-box {
  background-color: #3e3674;
  border-radius: 10px;
  padding: 30px;
  width: 100%;
  max-width: 800px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #fff;
  margin-bottom: 20px;
}

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

input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #7b3af5;
  color: #fff;
  font-size: 14px;
}

input[type='text'] {
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

.signup-btn {
  width: 50%;
  padding: 10px;
  background-color: #ffb703;
  border: none;
  border-radius: 90px;
  color: #3e3674;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 40px;
}

.signup-btn:hover {
  background-color: #ffaa00;
}

p {
  color: #fff;
}

a {
  color: #ffb703;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.input-group .btn {
  height: 100%;
  /* Pastikan tombol memiliki tinggi yang sama dengan input */
  border-radius: 0 0.25rem 0.25rem 0;
  /* Membulatkan sudut kanan tombol */
  margin-left: 25px;
  /* Menambahkan jarak ke sebelah kiri tombol */
  color: white;
}

/* Media Queries for Responsive Design */
@media (max-width: 768px) {
  .signup-box {
    width: 90%;
    padding: 20px;
  }

  .signup-btn {
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

  .signup-btn {
    padding: 8px;
    font-size: 14px;
  }
}
</style>
