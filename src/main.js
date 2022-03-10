import { Contract, ethers } from "ethers";
import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import axios  from 'axios'

import VideoRentals from '../app/artifacts/contracts/VideoRentals.sol/VideoRentals.json'
import VideoNFT from '../app/artifacts/contracts/VideoNFT.sol/VideoNFT.json'
import contractConfig from '../app/__config.json'

//todo: the issue here is that we can't instantiate the provider if the browser doesn't
//have metamask installed
const provider = new ethers.providers.Web3Provider(window.ethereum);
const store = createStore({
    state () {
        return {
            videos: [],
            connectedAccount: null,
            connectedAccountBalance: 0
        }
    },
    mutations: {
        addVideo (state, video) {
            state.videos.unshift(video);
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
        async getVideos(context) {
            let videos = [];
            const nftContract = new ethers.Contract(contractConfig.nftAddress, VideoNFT.abi, provider.getSigner());
            const totalSupply = await nftContract.totalSupply();
            for (let i = 1; i < totalSupply; i++) {
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
            const contract = new ethers.Contract(contractConfig.rentalsAddress, VideoRentals.abi, provider.getSigner());
            const balance = contract.balanceOf(accounts[0]);
            context.commit("setConnectedAccount", { account: accounts[0], balance: balance });
        },
        async hitFaucet(context) {
            const dappWallet = new ethers.Wallet(`${import.meta.env.VITE_PRIVATE_KEY}`, provider);
            const ercContract = new ethers.Contract(contractConfig.rentalsAddress, VideoRentals.abi, dappWallet);
            ercContract.on("Rental", (renter, owner, amount) => {
                console.log(`${renter} rented a video from ${owner} for ${ethers.utils.formatEther(amount)}`);
            });            
            return await ercContract.faucet(context.state.connectedAccount, 10000);
        },
        async rentVideo(context, amount) {
            const ownerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
            const signer = await provider.getSigner();
            // console.log('renting video');
            // console.log('contract ' + contractConfig.rentalsAddress);            
            // console.log('signer ' + await signer.getAddress());
            const contract = new ethers.Contract(contractConfig.rentalsAddress, VideoRentals.abi, signer);
            return await contract.rentVideo(ownerAddress, amount);
        },
        async mintVideoNft(context, movieData) {
            console.log('minting nft');
            console.log('contract ' + contractConfig.nftAddress);            
            console.log('private key ' + import.meta.env.VITE_PRIVATE_KEY);
            console.log('destination ' + context.state.connectedAccount);
            console.log('minting NFT for ', movieData);
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
                console.log(resp.data.IpfsHash);
                const dappWallet = new ethers.Wallet(`${import.meta.env.VITE_PRIVATE_KEY}`, provider);
                const contract = new ethers.Contract(contractConfig.nftAddress, VideoNFT.abi, dappWallet);
                return await contract.safeMint(context.state.connectedAccount, resp.data.IpfsHash);
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
app.mount('#app')
