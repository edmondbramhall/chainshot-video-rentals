<template>
  <section class="section">
    <h2 class="title">Submit video</h2>
    <div class="columns">
      <div class="column">
        <form @submit.prevent="mint" action="#" method="POST">
          <div class="field">
            <label class="label">Video title</label>
            <div class="control">
              <input v-model="movieData.title" class="input" type="text" placeholder="Anaconda">
            </div>
          </div>
          <div class="field">
            <label class="label">Release date</label>
            <div class="control">
              <input v-model="movieData.releaseDate" class="input" type="input" placeholder="1997-04-11">
            </div>
          </div>
          <div class="field">
            <label class="label">Description</label>
            <div class="control has-icons-left has-icons-right">
              <textarea v-model="movieData.description" class="textarea" placeholder="The heartmoving story of giant snake trying to make her way in the world, and the people who love her."></textarea>
            </div>
          </div>
          <div class="field">
            <label class="label">Image url</label>
            <div class="control has-icons-right">
              <input v-model="movieData.imageUrl" class="input" type="text" placeholder="">
              <span class="icon is-small is-right">
                <i class="fas fa-image"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">Video url</label>
            <div class="control has-icons-right">
              <input v-model="movieData.videoUrl" class="input" type="text" placeholder="">
              <span class="icon is-small is-right">
                <i class="fas fa-video"></i>
              </span>
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-link">Submit</button>
            </div>
          </div>
        </form>
      </div>
      <div class="column">
        <h3 class="subtitle">Shortcut! Enter <a href="https://www.themoviedb.org/" target="_blank">TMDB</a> id</h3>
        <form @submit.prevent="populateFormFromTmdb" action="#" method="POST">
          <div class="field has-addons">
            <div class="control">
              <input v-model="tmdbId" class="input" type="text" placeholder="9360">
            </div>
            <div class="control">
              <button class="button">Populate form</button>
            </div>
          </div>
        </form>
        <div v-if="movieData.title !== null" class="card mt-4" style="width:342px">
          <div class="card-header">
            <p class="card-header-title">{{movieData.title}} ({{movieData.releaseDate}})</p>
          </div>
          <div class="card-image">
            <figure class="image">
              <img :src="movieData.imageUrl" :alt="movieData.title" width="342">
            </figure>
          </div>          
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import axios from 'axios'
import utils from '../mixins/utils.js'
export default {
  mixins: [utils],
  data() {
    return {  
      tmdbIds: [33518, 10489, 9362, 40466, 9360, 9825, 578, 38258, 28452, 87710, 26178, 14372, 9599, 11298, 814, 9426, 55784, 1091],
      tmdbId: null,
      movieData: {
        title: null,
        releaseDate: null,
        description: null,
        imageUrl: null,
        videoUrl: null
      }
    }
  },
  methods: {
    getRandomTmdbId() {
      return this.tmdbIds[Math.floor(Math.random() * this.tmdbIds.length)];
    },
    async mint() {
      try {
        await this.$store.dispatch("mintVideoNft", this.movieData);
        this.$router.push({ path: '/' });
      } catch (ex) {
          this.$emit("contractError", ex);
      }
    },
    async populateFormFromTmdb() {
      const getResult = await axios.get(`https://api.themoviedb.org/3/movie/${this.tmdbId}?api_key=${import.meta.env.VITE_TMDB_APIKEY}&append_to_response=videos`);
      const movieJson = getResult.data;
      this.movieData.imageUrl = `https://image.tmdb.org/t/p/w342${movieJson.poster_path}`;
      this.movieData.releaseDate = movieJson.release_date;
      this.movieData.title = movieJson.title;
      this.movieData.description = movieJson.overview;
      this.movieData.videoUrl = `https://www.youtube.com/watch?v=${movieJson.videos.results[0].key}`;
    }
  },
  mounted() {
    this.tmdbId = this.getRandomTmdbId();
  }
}
</script>

<style>
</style>
