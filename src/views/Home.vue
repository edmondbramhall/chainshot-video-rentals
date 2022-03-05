<template>
  <div class="container">
    <section class="section">
      <div v-for="video in videos" class="card mb-5">
        <header class="card-header">
          <p class="card-header-title">
            {{ video.title }}
          </p>
        </header>
        <div class="card-content">
          <RouterLink :to="{ name: 'rent', params: { hash: video.id }}">{{video.id}}</RouterLink>
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
    },
  }
}
</script>

<style>

</style>
