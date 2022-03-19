<template>
  <div>
    <nav class="navbar is-white has-shadow" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <RouterLink to="/" class="navbar-item subtitle">Evil Ed's Video Store</RouterLink>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <RouterLink to="/submit" class="navbar-item">Submit video</RouterLink>
          <RouterLink to="/moderate" class="navbar-item">Moderate videos</RouterLink>
          <RouterLink to="/enumerate" class="navbar-item">Enumerate videos</RouterLink>
        </div>
        <div class="navbar-end">
          <meta-mask-status></meta-mask-status>
        </div>
      </div>
    </nav>
    <RouterView @contractError="handleContractError" />
    <div v-if="!isConnected" class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        <article class="message is-warning">
          <div class="message-header">
            <p>Please connect your wallet to use this site!</p>
          </div>
          <div class="message-body">
            <div class="buttons" style="justify-content:center;">
              <button @click="connect" class="button is-primary is-large">
                <span class="icon">
                  <i class="fa-regular fa-circle"></i>
                </span>
                <span>Connect wallet</span>    
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
<script>
import { RouterLink, RouterView } from 'vue-router'
import { ethers } from "ethers";
import MetaMaskStatus from './components/MetaMaskStatus.vue'
import { videoStatus, getStatus } from '../shared/videoStatus.js';
const { ethereum } = window;
export default {
  inject: ['nftContractAsDapp', 'metamask'],
  components: {
    MetaMaskStatus
  },
  data() {
    return {  
    }
  },
  computed: {
    isConnected() {
      return this.$store.getters.connectedAccount !== null;
    }
  },
  methods: {
    handleContractEvent(msg) {
      this.$toast(msg, {
        slotLeft: '<i class="fa fa-bell"></i>',
        positionX: 'center',
        positionY: 'top'
      })
    },
    handleContractError(ex) {
      const msg = `${ex.data.code}: ${ex.data.message}`;
      this.$toast(msg, {
        duration: 5000,
        slotLeft: '<i class="fa fa-triangle-exclamation"></i>',
        type: 'error', // 'success', 'error' and 'passive'
        positionX: 'center',
        positionY: 'top',
        disableClick: true
      })
    },
    async connect() {
      await this.metamask.connect();
    },
  },
  async mounted() {
    this.metamask.on('EVENT_ACCOUNT_CONNECTED', () => {
      this.$store.dispatch("updateConnectedAccountBalance", this.metamask.user);
    }); // The account was connected
    this.metamask.on('EVENT_ACCOUNT_DISCONNECTED', () => { 
      window.location.reload()
    }); // The account was disconnected
    this.metamask.on('EVENT_ACCOUNT_REMEMBERED', () => { 
      this.$store.dispatch("updateConnectedAccountBalance", this.metamask.user);
    }); // The account was remembered
    this.metamask.on('EVENT_ACCOUNT_SWITCHED', () => { 
      this.$store.dispatch("updateConnectedAccountBalance", this.metamask.user);
    }); // The account was switched
    // other available events that we're considering out of scope
    this.metamask.on('EVENT_METAMASK_FOUND', () => { console.log('EVENT_METAMASK_FOUND'); });         // MetaMask is installed
    this.metamask.on('ERROR_METAMASK_NOT_FOUND', () => { console.log('ERROR_METAMASK_NOT_FOUND'); });     // MetaMask is not installed
    this.metamask.on('ERROR_MULTIPLE_WALLETS', () => { console.log('ERROR_MULTIPLE_WALLETS'); });       // Multiple wallets were found
    this.metamask.on('EVENT_CHAIN_CONNECTED', () => { console.log('EVENT_CHAIN_CONNECTED'); });        // The chain is connected
    this.metamask.on('ERROR_CHAIN_UNAVAILABLE', () => { console.log('ERROR_CHAIN_UNAVAILABLE'); });      // The chain could not be fetched
    this.metamask.on('ERROR_ACCOUNT_NOT_FOUND', () => { console.log('ERROR_ACCOUNT_NOT_FOUND'); });      // The account was not found
    this.metamask.on('ERROR_ACCOUNT_UNAVAILABLE', () => { console.log('ERROR_ACCOUNT_UNAVAILABLE'); });    // The account could not be fetched
    this.metamask.on('ERROR_PERMISSION_REFUSED', () => { console.log('ERROR_PERMISSION_REFUSED'); });     // The connection attempt was refused
    this.metamask.on('ERROR_PERMISSION_FAILED', () => { console.log('ERROR_PERMISSION_FAILED'); });      // The connection attempt failed
    this.metamask.on('EVENT_CHAIN_SWITCHED', () => { console.log('EVENT_CHAIN_SWITCHED'); });         // The chain was switched    
    await this.metamask.init();
    this.nftContractAsDapp.on("Minted", async (tokenId, to) => {
        await this.$store.dispatch('updateVideoAfterMint', { tokenId, to });
        this.handleContractEvent(`VideoNFT ${tokenId} was successfully minted! The owner is ${to}.`);
    });                
    this.nftContractAsDapp.on("Rented", async (tokenId, renter, owner, amount, days) => {
        await this.$store.dispatch('updateAfterRent');
        this.handleContractEvent(`${renter} rented VideoNFT ${tokenId} from ${owner} for ${days} days - cost ${ethers.utils.formatEther(amount)}!`);
    });
    this.nftContractAsDapp.on("ModerationComplete", async (tokenId, moderationInfo) => {
        await this.$store.dispatch('updateAfterModeration');
        this.handleContractEvent(`Moderation complete for VideoNFT ${tokenId}! Final status: ${getStatus(moderationInfo.status).label}.`);
    });
  }
}
</script>
<style>
@import '@/assets/base.css';
</style>
