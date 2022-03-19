<template>
  <div class="container">
    <section class="section">
      <div v-if="videos.length === 0" class="notification is-danger is-size-4">
        No videos found in NFT contract!
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
                <!-- <span v-if="video.status.value === videoStatus.Accepted.value" class="tag is-success is-medium is-rounded cover-flash">{{video.status.label}}</span>
                <span v-else class="tag is-danger is-medium is-rounded cover-flash">{{video.status.label}}</span> -->
                <img :src="video.image" :alt="video.name" width="342">
              </figure>
            </div>          
            <div v-if="video.owner" class="card-content">
              <div class="tags">
                <span class="tag is-warning">Owner: {{shortenHex(video.owner)}}</span>
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
      videos: [],
      videoStatus: videoStatus
    }
  },
  async mounted() {
    try {
      this.videos = await this.$store.dispatch("fetchVideosFromContract");
    } catch (ex) {
        this.$emit("contractError", ex);
    }
  }
}
</script>

<style>

</style>
