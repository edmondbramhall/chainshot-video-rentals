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
      <span>connected {{selectedAddress}}</span>    
    </button>    
  </div> 
</template>
<script>
export default {
  data() {
    return {  
    }
  },
  computed: {
    isConnected() {
      return this.$store.getters.isConnected;
    },
    selectedAddress() {
      return ethereum.selectedAddress;
    }
  },
  methods: {
    async connect() {
      await this.$store.dispatch("connectToWeb3");
      await this.$store.dispatch("getAccounts");
    }
  },
  mounted() {
    ethereum.on('accountsChanged', (accounts) => console.log('accountsChanged', accounts));
    ethereum.on('chainChanged', (chainId) => console.log('chainChanged', chainId));
    ethereum.on('connect', (connectionInfo) => console.log('connect', connectionInfo));
    ethereum.on('disconnect', (error) => console.log('disconnect', error));
    ethereum.on('message', (message) => console.log('message', message));
    //ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }
}
</script>

<style>

</style>
