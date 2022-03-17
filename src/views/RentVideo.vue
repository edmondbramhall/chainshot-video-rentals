<template>
  <section v-if="video !== null" class="section">
    <h2 class="title">Renting VHS#{{video.tokenId}} {{video.name}}</h2>
    <p><a @click="$router.go(-1)" class="button is-primary">Back</a></p>
  </section>
</template>
<script>
import utils from '../mixins/utils.js'
export default {
  mixins: [utils],
  data() {
    return {  
      video: null
    }
  },
  async mounted() {
    this.video = await this.$store.dispatch('getVideo', this.$route.params.tokenId);
  }
}
</script>