<template>
  <div class="container">
    <section class="section">
      <h2 class="title">Moderate {{videos.length}} videos</h2>
      <div class="box">
        <div class="level">
          <p class="level-item is-size-4">{{acceptedCount}} videos accepted</p>
          <p class="level-item is-size-4">{{rejectedCount}} videos rejected</p>
          <button @click.prevent="submit" class="level-item button is-primary">submit moderation session</button>
        </div>
      </div>
      <div class="columns is-multiline">
        <div v-for="video in videos" :key="video.tokenId" class="column is-one-fifth">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">
                {{video.name}}
              </p>
            </header>
            <div class="card-image">
              <figure class="image">
                <span v-if="isAccepted(video.tokenId)" class="tag is-success is-medium is-rounded cover-flash">Accepting</span>
                <span v-if="isRejected(video.tokenId)" class="tag is-danger is-medium is-rounded cover-flash">Rejecting</span>
                <img :src="video.image" :alt="video.name" width="342">
              </figure>
            </div>          
            <div class="card-footer">      
              <div class="card-footer-item">
                <div class="buttons">
                  <button @click.prevent="accept(video.tokenId)" class="button is-success">accept</button>
                  <button @click.prevent="reject(video.tokenId)" class="button is-danger">reject</button>
                </div>
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
import { videoStatus } from '../../shared/videoStatus.js'
export default {
  mixins: [utils],
  data() {
    return {  
      videos: [],
      videoStatus: videoStatus,
      moderationSessionData: []
    }
  },
  computed: {
    videos() {
      return this.$store.getters.videosAwaitingModeration;
    },
    acceptedCount() {
      return this.moderationSessionData.filter(v => v.value === videoStatus.Accepted.value).length;      
    },
    rejectedCount() {
      return this.moderationSessionData.filter(v => v.value === videoStatus.Rejected.value).length;      
    }
  },
  methods: {
    accept(tokenId) {
      this.moderationSessionData[tokenId] = videoStatus.Accepted;
    },
    reject(tokenId) {
      this.moderationSessionData[tokenId] = videoStatus.Rejected;
    },
    isAccepted(tokenId) {
      return this.moderationSessionData[tokenId] === videoStatus.Accepted;
    },
    isRejected(tokenId) {
      return this.moderationSessionData[tokenId] === videoStatus.Rejected;
    },
    async submit() {
      try {
        await this.$store.dispatch("submitModeration", this.moderationSessionData);
        this.$router.push({ path: '/' });          
      } catch (ex) {
          this.$emit("contractError", ex);
      }
    },
    async getVideos() {
      await this.$store.dispatch("fetchVideos");
    },
  },
  async mounted() {
    this.getVideos();
  }
}
</script>

<style>

</style>
