<script setup lang="ts" name="keepAliveWhitePaper">
// import Pdfh5 from 'pdfh5'
// import 'pdfh5/css/pdfh5.css'

const route = useRoute()
// const loading = ref(false)
// const bookRef = ref()

// onMounted(async () => {
//   loading.value = true
//   const pdfh5 = new Pdfh5(
//     bookRef.value,
//     {
//       pdfurl: new URL(`./${import.meta.env.VITE_APP_NAME}.pdf`, import.meta.url).href,
//     },
//     {
//       maxZoom: 1,
//     },
//   )
//   //监听完成事件
//   pdfh5.on('complete', function (status, msg, time) {
//     loading.value = false
//     pdfh5.zoomEnable(true)
//   })
// })

// onUnmounted(() => {
//   loading.value = false
// })
</script>

<template>
  <div class="bgc">
    <Navbar2 :title="route.query.title" :is-show-right="false" back-path="/home" />
    <!-- <div ref="bookRef" id="white-page"></div>
    <Loading v-if="loading" /> -->
    <img class="book" src="./FinCEN.png" alt="" />
  </div>
</template>

<style lang="less" scoped>
.bgc {
  position: relative;
  background-color: #fff;
  width: 100vw;
  height: calc(var(--vh, 1vh) * 100);
}
.book {
  position: relative;
  z-index: 2;
  width: 100%;
}
.loading {
  z-index: 1 !important;
  height: calc(var(--vh, 1vh) * 100);
  width: 100vw;
}
#white-page {
  width: 100vw;
  height: 100dvh;
  height: -webkit-fill-available;
  height: calc(var(--vh, 1vh) * 100);
  .loading {
    height: 80vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
