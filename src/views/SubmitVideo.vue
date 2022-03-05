<template>
  <section class="section">
    <h2 class="title">Submit video</h2>
    <p><a @click="$router.go(-1)" class="button is-primary">Back</a></p>
  </section>
</template>
<script>
import utils from '../mixins/utils.js'
export default {
  mixins: [utils],
  data() {
    return {  
      // isLoaded: false,
      // tx: null,
      // hash: null
    }
  },
  async mounted() {
    // this.hash = this.$route.params.hash;
    // this.tx = await this.$store.dispatch("fetchTransaction", { 
    //   txHash: this.hash 
    // });
    // this.isLoaded = true;
  }
}
</script>

<style>
</style>
