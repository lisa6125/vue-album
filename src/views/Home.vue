<template>
  <div class='container home'>
    <h1 class='text-center'>歡迎使用線上相簿</h1>
    <Photoswipe>
      <div v-masonry="containerId" transition-duration="0.3s" item-selector=".item">
        <div v-masonry-tile class="item" v-for="(item, index) in images" :key="index">
          <div class="post">
            <img :src="item.src" v-pswp="item" alt="" />
            <div class="faver">
              <vue-star animate="animated bounceIn" color="#F05654">
                <i slot="icon" class="fa fa-heart"></i>
              </vue-star>
              <span>{{item.count}}</span>
            </div>
          </div>
        </div>
      </div>
    </Photoswipe>
  </div>
</template>

<script>
import VueStar from 'vue-star'
export default {
  name: 'Home',
  components: {
    VueStar
  },
  data () {
    return {
      images: []
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_API + '/albums/')
      .then(res => {
        if (res.data.success) {
          this.images = res.data.result.map(image => {
            image.src = process.env.VUE_APP_API + '/albums/file/' + image.file
            image.title = image.description
            delete image.file
            delete image.description
            return image
          })
        } else {
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: res.data.message
          })
        }
      })
      .catch(err => {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: err.response.data.message
        })
      })
  }
}
</script>
<style lang="stylus" scoped>
.item{
  padding 30px
  width: 25%
  .post{
    border 3px solid rgba(0,0,0,0.1)
    border-radius 10px
  }
}
</style>
