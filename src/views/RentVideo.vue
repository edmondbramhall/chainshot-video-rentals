<template>
  <section v-if="video" class="section">
    <h2 class="title"><span class="has-text-weight-normal">Renting #{{video.tokenId}}</span> {{video.name}} <span class="has-text-weight-normal">({{video.attributes[0].value}})</span></h2>
    <iframe width="1020" height="630" :src="videoEmbedUrl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
  computed: {
    videoEmbedUrl() {
      return this.video.youtube_url.replace("watch?v=", "embed/");
    }
  },
  async mounted() {
    this.video = await this.$store.dispatch('getVideo', this.$route.params.tokenId);
  }
}
</script>