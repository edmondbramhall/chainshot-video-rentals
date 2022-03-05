<template>
  <div class="buttons">
    <button v-if="!isConnected" @click="connect" class="button">
      <span class="icon">
        <i class="fa-regular fa-circle"></i>
      </span>
      <span>connect to Web3</span>    
    </button>
    <button v-else @click="connect" class="button is-success">
      <span class="icon">
        <i class="fa-solid fa-circle"></i>
      </span>
      <span>connected (account: {{shortenHex(connectedAccount)}})</span>    
    </button>    
  </div> 
</template>
<script>
import utils from '../mixins/utils.js'
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
    }
  },
  methods: {
    async connect() {
      await this.$store.dispatch("connectToWeb3");
    },
    async handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        await this.$store.dispatch("updateConnectedAccount", null);
      } else if (accounts[0] !== this.$store.getters.connectedAccount) {
        await this.$store.dispatch("updateConnectedAccount", accounts[0]);
      }
    },     
    handleChainChanged(chainId) {
      window.location.reload();
    }       
  },
  mounted() {
    ethereum.on('accountsChanged', (accounts) => this.handleAccountsChanged(accounts));
    ethereum.on('chainChanged', (chainId) => this.handleChainChanged(chainId));
    // ethereum.on('connect', (connectionInfo) => console.log('connect', connectionInfo));
    // ethereum.on('disconnect', (error) => console.log('disconnect', error));
    // ethereum.on('message', (message) => console.log('message', message));
    //ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }
}
</script>

<style>

</style>
