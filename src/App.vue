<template>
  <div>
    <nav class="navbar is-white has-shadow" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <RouterLink to="/" class="navbar-item subtitle">Evil Ed's Video Rentals</RouterLink>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <RouterLink to="/submit" class="navbar-item">Submit video</RouterLink>
          <RouterLink to="/moderate" class="navbar-item">Moderate videos</RouterLink>
        </div>
        <div class="navbar-end">
          <meta-mask-status></meta-mask-status>
        </div>
      </div>
    </nav>
    <RouterView />
    <div v-if="!isConnected" class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        <article class="message is-warning">
          <div class="message-header">
            <p>Please connect your wallet to use this site!</p>
          </div>
          <div class="message-body">
            <div class="buttons" style="justify-content:center;">
              <button v-if="!isConnected" @click="connect" class="button is-primary is-large">
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
import MetaMaskStatus from './components/MetaMaskStatus.vue'
const { ethereum } = window;
export default {
  inject: ['nftContractAsDapp'],
  components: {
    MetaMaskStatus
  },
  data() {
    return {  
      // selectedNetwork: "homestead",
      // selectedAccount: ""
    }
  },
  computed: {
    isConnected() {
      return this.$store.getters.connectedAccount !== null;
    }
  },
  methods: {
    popToast(msg) {
      this.$toast(msg, {
        slotLeft: '<i class="fa fa-bell"></i>',
        positionX: 'center',
        positionY: 'top'
      })
    },
    async connect() {
      await this.$store.dispatch("connectToWeb3");
    },
    // changeNetwork() {
    //   this.$store.dispatch("changeNetwork", {
    //     networkName: this.selectedNetwork
    //   });    
    // },
    // showAccount() {
    //   if (this.selectedAccount.length > 0) {
    //     this.$router.push({ name: "account", params: { hash: this.selectedAccount} });
    //     this.selectedAccount = "";
    //   }
    // }
  },
  async mounted() {
    this.nftContractAsDapp.on("Minted", async (tokenId, to) => {
        await this.$store.dispatch('updateVideoAfterMint', { tokenId, to });
        this.popToast(`VideoNFT ${tokenId} was successfully minted! The owner is ${to}.`);
    });                
    this.nftContractAsDapp.on("Rented", async (tokenId, renter, owner, amount) => {
        await this.$store.dispatch('updateAfterRent');
        this.popToast(`${renter} rented VideoNFT ${tokenId} from ${owner} for ${amount}!`);
    });
  }
}
</script>
<style>
@import '@/assets/base.css';
</style>
