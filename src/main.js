import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLY77ZHK9UMRLSgtYvOMIqgPAHQKkCbhY",
    authDomain: "toko-mebel.firebaseapp.com",
    projectId: "toko-mebel",
    storageBucket: "toko-mebel.appspot.com",
    messagingSenderId: "446406153575",
    appId: "1:446406153575:web:20f7e57a8bfa03c2a18bc2"
  };

initializeApp(firebaseConfig);

const app = createApp(App);
app.use(router);
app.mount("#app");