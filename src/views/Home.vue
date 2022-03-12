<template>
  <div class="container">
    <section class="section">
      <div class="columns is-multiline">
        <div v-for="video in videos" :key="video.tokenId" class="column is-one-fifth">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">
                {{video.name}}
              </p>
            </header>
            <div class="card-image" style="position:relative;">
              <figure class="image">
                <span class="tag is-danger is-medium is-rounded" style="opacity:70%;position:absolute;top:87%;left:5%;width:90%">{{video.status}}</span>
                <img :src="video.image" :alt="video.name" width="342">
              </figure>
            </div>          
            <div v-if="video.owner" class="card-content">
              <div class="tags">
                <span class="tag is-warning">Owner: {{shortenHex(video.owner)}}</span>
                <span class="tag is-warning">Token: {{video.tokenId}}</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="card-footer-item">
                <button v-if="video.status === 'minted'" @click.prevent="rent(video.tokenId)" class="button is-success">watch for 10 VHS</button>  
                <button v-else class="button" disabled>watch for 10 VHS</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import utils from '../mixins/utils.js'
export default {
  mixins: [utils],
  data() {
    return {  
    }
  },
  computed: {
    videos() {
      return this.$store.getters.videos;
    }
  },
  methods: {
    async getVideos() {
      await this.$store.dispatch("fetchVideos");
    },
    async rent(tokenId) {
      await this.$store.dispatch("rentVideo", { tokenId: tokenId, amount: 10 });
    },
  },
  async mounted() {
    this.getVideos();
  }
}
</script>

<style>

</style>
