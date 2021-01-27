<template lang="pug">
  div#app
    b-navbar(toggleable='lg' type='dark' variant='info')
      b-container
        b-navbar-brand(to='/') 線上相簿
        b-navbar-toggle(target='nav-collapse')
        b-collapse#nav-collapse(is-nav)
          b-navbar-nav.ml-auto
            b-nav-item(v-if="albumuser._id.length === 0" to='/login') 登入
            b-nav-item(v-if="albumuser._id.length === 0" to='/reg') 註冊
            .mypic(v-if="albumuser._id.length > 0")
              img(:src='albumuser.file' v-if="albumuser._id.length > 0")
            b-nav-item(v-if="albumuser._id.length > 0" to='/album') 我的相簿
            b-nav-item(v-if="albumuser._id.length > 0" @click="logout") 登出
    router-view
</template>

<script>
export default {
  name: 'App',
  computed: {
    albumuser () {
      return this.$store.state.albumuser
    }
  },
  methods: {
    logout () {
      this.axios.delete(process.env.VUE_APP_API + '/users/logout')
        .then(res => {
          // 如果登出成功
          if (res.data.success) {
            this.$swal({
              icon: 'success',
              title: '成功',
              text: '登出成功'
            })

            // 清除 vuex
            this.$store.commit('logout')

            // 導回首頁
            if (this.$route.path !== '/') {
              this.$router.push('/')
            }
          } else {
            this.$swal({
              icon: 'error',
              title: '錯誤',
              text: res.data.message
            })
          }
        })
        .catch(error => {
          // 如果回來的狀態碼不是 200，直接 alert 錯誤訊息
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: error.response.data.message
          })
        })
    },
    heartbeat () {
      this.axios.get(process.env.VUE_APP_API + '/users/heartbeat')
        .then(res => {
          // 如果 vuex 是登入中
          if (this.albumuser._id.length > 0) {
            // 但是後端沒登入
            if (!res.data) {
              this.$swal({
                icon: 'error',
                title: '錯誤',
                text: '登入時效已過'
              })
              // 登出
              this.$store.commit('logout')
              // 導回首頁
              if (this.$route.path !== '/') {
                this.$router.push('/')
              }
            }
          }
        })
        .catch((err) => {
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: '發生錯誤'
          })
          console.log(err)
          // 登出
          this.$store.commit('logout')
          // 導回首頁
          if (this.$route.path !== '/') {
            this.$router.push('/')
          }
        })
    }
  },
  mounted () {
    this.heartbeat()
    setInterval(() => {
      this.heartbeat()
    }, 5000)
  }
}
</script>

<style lang="stylus" scoped>
.mypic{
  height 50px
  width 50px
  background white
  border-radius 50%
  overflow hidden
  img{
    width 100%
    height 100%
    object-fit cover
  }
}
</style>
