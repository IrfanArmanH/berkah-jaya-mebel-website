<template>
  <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
  </head>

  <div class="profile-container">
    <button class="back-btn" @click="goBack">Kembali</button>
    <button class="logout-btn" @click="logout">Logout</button>

    <div class="profile-box">
      <h1>Profil Akun</h1>

      <div class="profile-pic">
        <div class="profile-pic-frame">
          <font-awesome-icon :icon="['fas', 'user']" class="fas fa-user" />
        </div>
        <div class="edit-icon">
          <font-awesome-icon :icon="['fas', 'plus']" class="fas fa-plus" />
        </div>
      </div>

      <form @submit.prevent="saveProfile">
        <div class="input-field">
          <label for="name">Nama</label>
          <input type="text" id="name" v-model="name" placeholder="Masukan Nama Anda . . ." />
        </div>

        <div class="input-field">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Masukan Email Anda . . ." />
        </div>

        <div class="input-field">
          <label for="address">Alamat</label>
          <input type="text" id="address" v-model="address" placeholder="Masukan Alamat Anda . . ." />
        </div>

        <div class="input-field">
          <label for="phone">No Telp</label>
          <input type="text" id="phone" v-model="phone" placeholder="Masukan Nomor Telepon Anda . . ." />
        </div>

        <div class="input-field">
          <label for="password">Password Baru</label>
          <input type="password" id="password" v-model="newPassword" placeholder="Masukan Password Baru . . ." />
        </div>

        <div class="input-field">
          <label for="confirmPassword">Konfirmasi Password Baru</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Konfirmasi Password Baru . . ." />
        </div>

        <button type="submit" class="save-btn">Simpan</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, updatePassword } from 'firebase/auth';

export default {
  setup() {
    const name = ref('');
    const email = ref('');
    const address = ref('');
    const phone = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const role = ref('pelanggan');
    const router = useRouter();
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true');

    const loadUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          name.value = userData.name || '';
          email.value = userData.email || '';
          address.value = userData.address || ''; // updated to address
          phone.value = userData.phone || ''; // updated to phone
        } else {
          console.error("User document does not exist!");
        }
      } else {
        console.error("User not authenticated!");
      }
    };

    const saveProfile = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          name: name.value,
          email: email.value,
          address: address.value, // updated to address
          phone: phone.value, // updated to phone
          role: role.value // Static role value
        });

        // Update email if it has changed
        if (email.value !== user.email) {
          try {
            await updateEmail(user, email.value);
          } catch (error) {
            console.error("Error updating email:", error);
            alert("Gagal memperbarui email. Pastikan email valid dan sudah terverifikasi.");
          }
        }

        // Update password if provided and matches confirmation
        if (newPassword.value && newPassword.value === confirmPassword.value) {
          try {
            await updatePassword(user, newPassword.value);
          } catch (error) {
            console.error("Error updating password:", error);
            alert("Gagal memperbarui password. Pastikan password valid.");
          }
        }
        alert("Profil berhasil diperbarui!");
      }
    };

    const logout = () => {
      // Hapus semua data session dari localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userUID');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');

      // Update status login dan refresh halaman
      isLoggedIn.value = false;
      window.location.reload();
    }

    const goBack = () => {
      router.push('/halaman-utama');
    };

    onMounted(() => {
      // Pastikan status login ada di localStorage
      if (localStorage.getItem('userRole') === 'pelanggan') {
        router.push('/profil');
      }
      else {
        router.push('/');
      }
      loadUserData();
    });

    return {
      name,
      email,
      address,
      phone,
      newPassword,
      confirmPassword,
      logout,
      saveProfile,
      goBack,
      isLoggedIn
    };
  },
};
</script>

<style scoped>
/* Container utama */
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #21146a;
  /* Background sesuai tema */
  padding: 20px;
}

/* Tombol Kembali dan Logout */
.back-btn,
.logout-btn {
  position: fixed;
  top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1000;
  /* Pastikan tombol berada di atas elemen lain */
}

.back-btn {
  left: 10%;
  background-color: #FFC300;
  /* Warna tombol kembali */
}

.back-btn:hover {
  color: #fff;
}

.logout-btn {
  right: 10%;
  background-color: #DA2F11;
  /* Warna tombol logout */
}

.logout-btn:hover {
  color: #fff;
}

/* Box Profil */
.profile-box {
  background-color: #21146a;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  /* Lebar yang diinginkan */
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Judul */
h1 {
  color: #fff;
  margin-bottom: 30px;
}

/* Profil Picture */
.profile-pic {
  position: relative;
  display: flex;
  justify-content: center;
}

.profile-pic-frame {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background-color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fa-user {
  font-size: 100px;
  color: black;
}

.fa-plus {
  color: black;
  cursor: pointer;
}

.fa-plus:hover {
  color: white;
}

.edit-icon {
  position: relative;
  top: 130px;
  right: 60px;
  background-color: #FFC300;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

/* Input Field */
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

input[type='text'],
input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: #7b3af5;
  color: #fff;
  font-size: 14px;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* Tombol Simpan */
.save-btn {
  width: 100%;
  padding: 12px;
  background-color: #ffaa00;
  border: none;
  border-radius: 10px;
  color: #3e3674;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 6%;
}

.save-btn:hover {
  background-color: #ffb703;
}

/* Responsivitas */
@media (max-width: 768px) {
  .profile-box {
    padding: 30px;
    max-width: 90%;
  }

  .back-btn,
  .logout-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .profile-box {
    padding: 20px;
  }

  .profile-pic img {
    width: 150px;
    /* Lebar yang lebih kecil untuk perangkat kecil */
    height: 150px;
  }

  .edit-icon {
    width: 30px;
    height: 30px;
    font-size: 18px;
  }

  input {
    font-size: 12px;
    padding: 10px;
  }

  .save-btn {
    padding: 10px;
    font-size: 14px;
  }
}
</style>
