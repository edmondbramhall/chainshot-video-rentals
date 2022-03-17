<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{video.name}}
      </p>
    </header>
    <div class="card-image">
      <figure class="image">
        <span class="tag is-success is-medium is-rounded cover-flash">Accepting</span>
        <img :src="video.image" :alt="video.name" width="342">
      </figure>
    </div>          
    <div class="card-footer">      
      <div class="card-footer-item">
        <div class="buttons">
          <button @click="$emit('accepted', video.tokenId)" class="button is-success">accept</button>
          <button @click="$emit('rejected', video.tokenId)" class="button is-danger">reject</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '../mixins/utils.js'
import { ethers } from 'ethers'
export default {
  mixins: [ utils ],
  props: {
    video: Object
  },
  methods: {
  },
  mounted() {
    console.log(this.video)
  }
}
</script>

<style>

</style>
