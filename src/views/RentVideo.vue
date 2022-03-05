<template>
  <section class="section">
    <h2 class="title">Renting video {{$route.params.hash}}</h2>
    <p><a @click="$router.go(-1)" class="button is-primary">Back</a></p>
  </section>
</template>
<script>
import utils from '../mixins/utils.js'
export default {
  mixins: [utils],
  data() {
    return {  
    }
  },
  async mounted() {
    // this.block = await this.$store.dispatch("getBlock", { 
    //   hash: this.$route.params.hash 
    // });
  }
}
</script>

<style>
</style>
