<template>
  <div class="container">
    <section class="section">
      <div class="columns is-multiline">
        <div v-for="video in videos" class="column is-one-fifth">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">
                {{video.name}}
              </p>
            </header>
            <div class="card-image">
              <figure class="image">
                <img :src="video.image" :alt="video.name" width="342">
              </figure>
            </div>          
            <div class="card-content">
              <span class="tag is-warning">Owner: {{shortenHex(video.owner)}}</span>
              <!-- <RouterLink :to="{ name: 'rent', params: { hash: video.id }}">{{video.id}}</RouterLink> -->
            </div>
            <div class="card-footer">
              <div class="card-footer-item">
                <button @click.prevent="rent()" class="button is-success">watch for 10 VHS</button>  
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
      videos: []
    }
  },
  methods: {
    async getVideos() {
      this.videos = await this.$store.dispatch("getVideos");
    },
    async rent() {
      await this.$store.dispatch("rentVideo", 100);
    },
  },
  async mounted() {
    this.getVideos();
  }
}
</script>

<style>

</style>
