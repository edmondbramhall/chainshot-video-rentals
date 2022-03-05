<template>
  <div class="container">
    <section class="section">
      <h2 class="title">Moderate videos</h2>
      <div v-for="video in videos" class="card mb-5">
        <header class="card-header">
          <p class="card-header-title">
            {{ video.title }}
          </p>
        </header>
        <div class="card-content">
          <div class="buttons">
            <button class="button is-success">accept</button>
            <button class="button is-danger">reject</button>
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
      return this.$store.getters.videosAwaitingModeration;
    },
  }
}
</script>

<style>

</style>
