import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { ethers } from 'ethers'

// let _provider = new ethers.providers.EtherscanProvider("homestead", import.meta.env.VITE_ETHERSCANAPIKEY);
const provider = new ethers.providers.Web3Provider(window.ethereum);
const store = createStore({
    state () {
        return {
            videos: [],
            connectedAccount: null
        }
    },
    mutations: {
        addVideo (state, video) {
            state.videos.unshift(video);
        },
        setConnectedAccount (state, account) {
            state.connectedAccount = account;
        }
    },
    getters: {
        connectedAccount (state) {
            return state.connectedAccount;
        },
        isConnected (state) {
            return state.connectedAccount !== null;
        },
        videos (state) {
            return state.videos;
        },
        videosAwaitingModeration (state) {
            return state.videos;
        },
    },
    actions: {
        async fetchVideos(context) {
            try {
                const resp = await axios.get('https://localhost:3054/videos');
                for (let i = 0; i < resp.data.length; i++) {
                    context.commit("addVideo", resp.data[i]);
                }
            } catch (err) {
                // Handle Error Here
                console.error(err);
            }
        },
        async connectToWeb3(context) {
            await provider.send("eth_requestAccounts", []);
            const accounts = await provider.send("eth_accounts", []);
            context.commit("setConnectedAccount", accounts[0]);
        },
        async updateConnectedAccount(context, account) {
            context.commit("setConnectedAccount", account);
        }
    }
})
   
const app = createApp(App)

app.use(router)
app.use(store);
app.mount('#app')
