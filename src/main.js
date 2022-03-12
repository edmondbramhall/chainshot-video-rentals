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

const provider = new ethers.providers.Web3Provider(window.ethereum);
const dappWallet = new ethers.Wallet(`${import.meta.env.VITE_PRIVATE_KEY}`, provider);
const contract = new ethers.Contract(contractConfig.nftAddress, VideoNFT.abi, dappWallet);
// contract.on("Minted", (tokenId, to) => {
//     // find video by tokenId
//     // update video status to minted
//     // update token balance
//     // show event alert
//     console.log(`Minted: ${tokenId} ${to}, update video status to minted.`);
//     //this.$toast(`Minted: ${tokenId} ${to}, update video status to minted.`)
// });                
// contract.on("Rented", (tokenId, renter, owner, amount) => {
//     // update token balance
//     // show event alert
//     console.log(`Rented: ${tokenId} ${renter} ${owner} ${amount}`);
// });

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
            return state.videos;
        },
        videosAwaitingModeration (state) {
            return state.videos;
        },
    },
    actions: {
        async getNetwork(context) {
            return await provider.getNetwork();
        },
        // async getVideos(context) {
        //     let videos = [];
        //     const nftContract = new ethers.Contract(contractConfig.nftAddress, VideoNFT.abi, provider.getSigner());
        //     const totalSupply = await nftContract.totalSupply();
        //     for (let i = 0; i < totalSupply; i++) {
        //       const tokenId = await nftContract.tokenByIndex(i);
        //       const uri = await nftContract.tokenURI(tokenId);
        //       const owner = await nftContract.ownerOf(tokenId);
        //       try {
        //         const resp = await axios.get(`https://gateway.pinata.cloud/ipfs/${uri}`);
        //         const movieJson = resp.data;
        //         movieJson.owner = owner;
        //         movieJson.tokenId = tokenId;
        //         videos.push(movieJson);
        //         } catch (err) {
        //             // Handle Error Here
        //             console.error(err);
        //         }
        //     }
        //     return videos;
        // },
        async fetchVideos(context) {
            try {
                const resp = await axios.get('https://localhost:3054/videos');
                context.commit("updateVideos", resp.data.map(v => v.pinataContent));
                // for (let i = 0; i < resp.data.length; i++) {
                //     context.commit("addVideo", resp.data[i].pinataContent);
                // }
            } catch (err) {
                // Handle Error Here
                console.error(err);
            }
        },
        async connectToWeb3(context) {
            await provider.send("eth_requestAccounts", []);
            const accounts = await provider.send("eth_accounts", []);
            const contract = new ethers.Contract(contractConfig.vhsTokenAddress, VHSToken.abi, provider.getSigner());
            const balance = await contract.balanceOf(accounts[0]);
            context.commit("setConnectedAccount", { account: accounts[0], balance: balance });
        },
        async rentVideo(context, payload) {
            const ownerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
            const signer = await provider.getSigner();
            // console.log('renting video');
            // console.log('contract ' + contractConfig.rentalsAddress);            
            // console.log('signer ' + await signer.getAddress());
            const contract = new ethers.Contract(contractConfig.nftAddress, VideoNFT.abi, signer);
            return await contract.rentVideo(contractConfig.vhsTokenAddress, payload.tokenId, ethers.utils.parseEther(payload.amount.toString()));
        },
        async mintVideoNft(context, movieData) {
            // console.log('minting nft');
            // console.log('contract ' + contractConfig.nftAddress);            
            // console.log('private key ' + import.meta.env.VITE_PRIVATE_KEY);
            // console.log('destination ' + context.state.connectedAccount);
            // console.log('minting NFT for ', movieData);
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
                await contract.safeMint(contractConfig.vhsTokenAddress, context.state.connectedAccount, resp.data.IpfsHash, ethers.utils.parseUnits("50", "ether"));
                movieJson.pinataContent.tokenId = context.state.videos.length + 1;
                movieJson.pinataContent.owner = context.state.connectedAccount;
                movieJson.pinataContent.status = "pending";
                const videosReponse = await axios.post(`https://localhost:3054/videos`, movieJson, null);
                context.commit("updateVideos", videosReponse.data);
            } catch (err) {
                // Handle Error Here
                console.error(err);
            } 
        },
        async updateConnectedAccount(context, account) {
            context.commit("setConnectedAccount", account);
        },
        // async getNetwork (context) {
        //     const network = await provider.getNetwork();
        //     return `${network.name}, ${network.chainId}`;
        // }
    }
})
   
const app = createApp(App)
app.use(router)
app.use(store);
app.use(DKToast);
app.provide('contract', contract);
app.mount('#app')
