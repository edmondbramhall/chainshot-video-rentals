<template>
  <div>
    <nav class="navbar is-light" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <RouterLink to="/" class="navbar-item subtitle">Ed's Video Rentals</RouterLink>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <RouterLink to="/submit" class="navbar-item">Submit video</RouterLink>
          <RouterLink to="/moderate" class="navbar-item">Moderate videos</RouterLink>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">  
            <meta-mask-status></meta-mask-status>
          </div>
        </div>
      </div>
    </nav>
    <RouterView />
  </div>
</template>
<script>
import { RouterLink, RouterView } from 'vue-router'
import MetaMaskStatus from './components/MetaMaskStatus.vue'
const { ethereum } = window;
export default {
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

  },
  methods: {
    isMetaMaskInstalled() {
      return Boolean(ethereum && ethereum.isMetaMask);
    }
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
    await this.$store.dispatch("fetchVideos");
    if (!this.isMetaMaskInstalled())
      alert('You must install MetaMask to use this Dapp!');
  }
}
</script>
<style>
@import '@/assets/base.css';
</style>
