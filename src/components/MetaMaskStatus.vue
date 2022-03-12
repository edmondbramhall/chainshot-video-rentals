<template>
  <p class="navbar-item"><span class="tag is-small is-light"> </span></p>
  <div class="navbar-item">
    <div class="buttons">
      <button v-if="isConnected" class="button is-success">
        <span class="icon">
          <i class="fa-solid fa-circle"></i>
        </span>
        <span>connected (account: {{shortenHex(connectedAccount)}}, balance: {{connectedAccountBalance}} VHS)</span>    
      </button>    
    </div> 
  </div>
</template>
<script>
import utils from '../mixins/utils.js'
import { ethers } from 'ethers'
export default {
  mixins: [ utils ],
  data() {
    return {  
    }
  },
  computed: {
    isConnected() {
      return this.$store.getters.isConnected;
    },
    connectedAccount() {
      return this.$store.getters.connectedAccount;
    },
    connectedAccountBalance() {
      return ethers.utils.formatEther(this.$store.getters.connectedAccountBalance);
    },
  },
  methods: {
    // async network() {
    //   return this.$store.dispatch("getNetwork");
    // },
    // async connect() {
    //   await this.$store.dispatch("connectToWeb3");
    // },
    async handleAccountsChanged(accounts) {
      console.log("accounts changed event", accounts);
      // if (accounts.length === 0) {
      //   await this.$store.dispatch("updateConnectedAccount", null);
      // } else if (accounts[0] !== this.$store.getters.connectedAccount) {
      //   await this.$store.dispatch("updateConnectedAccount", accounts[0]);
      // }
    },     
    handleChainChanged(chainId) {
      window.location.reload();
    },
    isMetaMaskInstalled() {
      return Boolean(window.ethereum && window.ethereum.isMetaMask);
    }
  },
  async mounted() {
    if (!this.isMetaMaskInstalled()) {
      alert('You must install MetaMask to use this Dapp!');
    } else {
      ethereum.on('accountsChanged', (accounts) => this.handleAccountsChanged(accounts));
      ethereum.on('chainChanged', (chainId) => this.handleChainChanged(chainId));
    }
    // ethereum.on('connect', (connectionInfo) => console.log('connect', connectionInfo));
    // ethereum.on('disconnect', (error) => console.log('disconnect', error));
    // ethereum.on('message', (message) => console.log('message', message));
    //ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }
}
</script>

<style>

</style>
