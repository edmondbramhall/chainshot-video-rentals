import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { nftContractAsDapp, store } from './store/store.js'
import DKToast from 'vue-dk-toast'
import Metamask from './meta-detector/MetaMask';
   
const app = createApp(App)

app.use(router)
app.use(store);
app.use(DKToast);

app.provide('metamask', new Metamask());
app.provide('nftContractAsDapp', nftContractAsDapp);

app.mount('#app')
