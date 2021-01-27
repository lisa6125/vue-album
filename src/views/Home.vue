<template>
  <div class='container home'>
    <h1 class='text-center'>歡迎使用線上相簿</h1>
    <Photoswipe>
      <div v-masonry="containerId" transition-duration="0.3s" item-selector=".item">
        <div v-masonry-tile class="item" v-for="(item, index) in images" :key="index">
          <div class="post">
            <div class="box d-flex justify-content-start align-items-center mb-2">
              <div class="userpic d-inline-block mr-2">
                <img :src="item.userpicsrc" alt="">
              </div>
              <span>{{item.name}}</span>
            </div>
            <img :src="item.src" v-pswp="item" alt="" />
            <div class="faver">
              <vue-star animate="animate__animated animate__bounce" color="#F05654">
                <i slot="icon" class="fa fa-heart" @click="addnum(item)"></i>
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
  methods: {
    addnum (item) {
      if (item.dbc) {
        item.count++
        this.axios.patch(process.env.VUE_APP_API + '/albums/addcount/' + item._id, {
          count: item.count
        })
      }
      item.dbc = !item.dbc
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_API + '/albums/')
      .then(res => {
        if (res.data.success) {
          this.images = res.data.result.map(image => {
            image.src = process.env.VUE_APP_API + '/albums/file/' + image.file
            image.userpicsrc = process.env.VUE_APP_API + '/albums/file/' + image.userpic
            image.title = image.description
            image.dbc = true
            delete image.file
            delete image.userpic
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
  margin 0 auto
  width 33%
  padding 10px
  @media screen and (max-width:576px) {
    width 100%
  }
  .post{
    padding 10px
    border-radius 10px
    border 3px solid rgba(0,0,0,0.1)
    img{
      width 100%
      height 100%
      object-fit cover
    }
    .faver{
      width 100%
      height: 50px
      position relative
      .VueStar{
        top -20px
        left -20px
        font-size 1.8rem
      }
      span{
        position absolute
        left 60px
        top 18px
      }
    }
    .userpic{
      height 50px
      width 50px
      border-radius 50%
      overflow hidden
      img{
        width 100%
        height 100%
        object-fit cover
      }
    }
  }
}
</style>
