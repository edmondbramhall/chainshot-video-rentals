import { Contract, ethers } from "ethers";
import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import axios  from 'axios'
import DKToast from 'vue-dk-toast'

import VHSToken from '../app/artifacts/contracts/VHSToken.sol/VHSToken.json'
import VideoNFT from '../app/artifacts/contracts/VideoNFT.sol/VideoNFT.json'
import contractConfig from '../app/__config.json'
import videoStatus from '../shared/videoStatus.js';
import Metamask from './meta-detector/MetaMask';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const dappWallet = new ethers.Wallet(`${import.meta.env.VITE_PRIVATE_KEY}`, provider);
const nftContractAsDapp = new ethers.Contract(contractConfig.nftAddress, VideoNFT.abi, dappWallet);
const store = createStore({
    state () {
        return {
            videos: [],
            connectedAccount: null,
            connectedAccountBalance: 0
        }
    },
    mutations: {
        updateVideos (state, videos) {
            state.videos = videos;
        },
        setConnectedAccount (state, payload) {
            state.connectedAccount = payload.account;
            state.connectedAccountBalance = payload.balance;
        },
    },
    getters: {
        connectedAccount (state) {
            return state.connectedAccount;
        },
        connectedAccountBalance (state) {
            return state.connectedAccountBalance;
        },
        isConnected (state) {
            return state.connectedAccount !== null;
        },
        videos (state) {
            return state.videos.filter(v => v.status !== videoStatus.Rejected);
        },
        videosAwaitingModeration (state) {
            return state.videos.filter(v => v.status === videoStatus.Pending);
        },
    },
    actions: {
        async getVideo(context, payload) {
            return context.getters.videos.find(x => x.tokenId === payload);
        },
        async getNetwork(context) {
            return await provider.getNetwork();
        },
        async getVideosFromContract(context) {
            let videos = [];
            const nftContract = new ethers.Contract(contractConfig.nftAddress, VideoNFT.abi, provider.getSigner());
            const totalSupply = await nftContract.totalSupply();
            for (let i = 0; i < totalSupply; i++) {
              const tokenId = await nftContract.tokenByIndex(i);
              const uri = await nftContract.tokenURI(tokenId);
              const owner = await nftContract.ownerOf(tokenId);
              try {
                const resp = await axios.get(`https://gateway.pinata.cloud/ipfs/${uri}`);
                const movieJson = resp.data;
                movieJson.owner = owner;
                movieJson.tokenId = tokenId;
                videos.push(movieJson);
                } catch (err) {
                    // Handle Error Here
                    console.error(err);
                }
            }
            return videos;
        },
        async fetchVideos(context) {
            try {
                const resp = await axios.get('https://localhost:3054/videos');
                context.commit("updateVideos", resp.data.map(v => v.pinataContent));
            } catch (err) {
                // Handle Error Here
                console.error(err);
            }
        },
        async updateConnectedAccountBalance(context, address = context.state.connectedAccount) {
            const contract = new ethers.Contract(contractConfig.vhsTokenAddress, VHSToken.abi, provider.getSigner());
            const balance = await contract.balanceOf(address);
            context.commit("setConnectedAccount", { account: address, balance: balance });
        },
        async rentVideo(context, payload) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();        
            //const amountInWei = ethers.utils.parseUnits(payload.amount.toString(), "ether");
            const contract = new ethers.Contract(contractConfig.nftAddress, VideoNFT.abi, signer);
            const tokenContract = new ethers.Contract(contractConfig.vhsTokenAddress, VHSToken.abi, signer);
            await tokenContract.approve(contractConfig.nftAddress, amountInWei);
            //return await contract.rentVideo(contractConfig.vhsTokenAddress, payload.tokenId, amountInWei);
            return await contract.rentVideo(payload.tokenId, 2); // 2 days
        },
        async submitModeration(context, payload) {
            let items = [];
            for (var key in payload) {
                items.push({ 
                    tokenId: key, 
                    moderator: context.state.connectedAccount, 
                    status: payload[key]
                });
            }
            const itemsForContract = items.map(i => { 
                return { 
                    tokenId: i.tokenId, moderator: i.moderator, status: i.status.value
                }
            });
            //await nftContractAsDapp.moderateVideo(contractConfig.vhsTokenAddress, itemsForContract, ethers.utils.parseUnits("5", "ether"));
            await nftContractAsDapp.moderateVideo(itemsForContract);
            for (let i = 0; i < items.length; i++) {
                const videosResponse = await axios.put(`https://localhost:3054/videos/${items[i].tokenId}/status`, items[i].status, null);
                context.commit("updateVideos", videosResponse.data.map(v => v.pinataContent));    
            }
        },
        async mintVideoNft(context, movieData) {
            const movieJson = {
                pinataMetadata: {
                    name: movieData.title
                },
                pinataContent: {
                    description: movieData.description, 
                    external_url: "https://localhost:3000/rent/id", 
                    image: movieData.imageUrl, 
                    name: movieData.title,
                    youtube_url : movieData.videoUrl,
                    attributes: [
                        {
                            "trait_type": "Release date", 
                            "value": movieData.releaseDate
                        }
                    ]
                }
            };
            try {
                const resp = await axios.post(`https://api.pinata.cloud/pinning/pinJSONToIPFS`, movieJson, {
                    headers: {
                        pinata_api_key: import.meta.env.VITE_PINATA_APIKEY,
                        pinata_secret_api_key: import.meta.env.VITE_PINATA_APISECRET
                    }
                });
                await nftContractAsDapp.safeMint(context.state.connectedAccount, resp.data.IpfsHash);
                movieJson.pinataContent.tokenId = context.state.videos.length;
                movieJson.pinataContent.owner = context.state.connectedAccount;
                movieJson.pinataContent.status = videoStatus.Unverified;
                const videosResponse = await axios.post(`https://localhost:3054/videos`, movieJson, null);
                context.commit("updateVideos", videosResponse.data.map(v => v.pinataContent));
            } catch (err) {
                // Handle Error Here
                console.error(err);
            } 
        },
        async updateVideoAfterMint(context, payload) {
            // update token balance for connected wallet
            const videosResponse = await axios.put(`https://localhost:3054/videos/${payload.tokenId}/status`, videoStatus.Pending, null);
            context.commit("updateVideos", videosResponse.data.map(v => v.pinataContent));
            await context.dispatch("updateConnectedAccountBalance");
        },
        async updateAfterRent(context) {
            await context.dispatch("updateConnectedAccountBalance");
        },
        async updateAfterModeration(context) {
            await context.dispatch("updateConnectedAccountBalance");
        },
        async updateConnectedAccount(context, account) {
            context.commit("setConnectedAccount", account);
        },
    }
})
   
const app = createApp(App)
app.use(router)
app.use(store);
app.use(DKToast);
app.provide('metamask', new Metamask());
app.provide('nftContractAsDapp', nftContractAsDapp);
app.mount('#app')
