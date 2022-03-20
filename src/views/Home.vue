<template>
  <div class="container">
    <section class="section">
      <div v-if="videos.length === 0" class="notification is-danger is-size-4">
        Oh no! There are no videos on this site at all. What are you waiting for? <router-link to="/submit">Submit one now - earn VHS tokens!</router-link>
      </div>
      <div v-else class="columns is-multiline">
        <div v-for="video in videos" :key="video.tokenId" class="column is-one-fifth">
          <div class="card">
            <header class="card-header">
              <p class="tag cover-id">VHS#{{video.tokenId}}</p> 
              <p class="card-header-title">{{video.name}}</p>
            </header>
            <div class="card-image" style="position:relative;">
              <figure class="image">
                <span v-if="video.status.value === videoStatus.Accepted.value" class="tag is-success is-medium is-rounded cover-flash">{{video.status.label}}</span>
                <span v-else class="tag is-danger is-medium is-rounded cover-flash">{{video.status.label}}</span>
                <img :src="video.image" :alt="video.name" width="342">
              </figure>
            </div>          
            <div v-if="video.owner" class="card-content">
              <div class="tags">
                <span class="tag is-warning">Owner: {{shortenHex(video.owner)}}</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="card-footer-item">
                <button v-if="video.status.value === videoStatus.Accepted.value" @click.prevent="rent(video.tokenId)" class="button is-success">watch for 10 VHS</button>
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
import { videoStatus } from '../../shared/videoStatus.js';

export default {
  mixins: [utils],
  data() {
    return {  
      videoStatus: videoStatus
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
      try {
        await this.$store.dispatch("rentVideo", { tokenId: tokenId, amount: 10 });
        this.$router.push({ name: 'rent', params: { tokenId: tokenId } });
      } catch (ex) {
          this.$emit("contractError", ex);
      }
    },
  },
  async mounted() {
    this.getVideos();
  }
}
</script>

<style>

</style>
