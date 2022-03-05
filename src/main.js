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
            isConnected: false
        }
    },
    mutations: {
        addVideo (state, video) {
            state.videos.unshift(video);
        },
        setIsConnected (state, isConnected) {
            state.isConnected = isConnected;
        }
    },
    getters: {
        isConnected (state) {
            return state.isConnected;
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
            context.commit("setIsConnected", true);
        },
        async getAccounts() {
            const accounts = await provider.send("eth_accounts", []);
            console.log(accounts);
        }
    }
})
   
const app = createApp(App)

app.use(router)
app.use(store);
app.mount('#app')
