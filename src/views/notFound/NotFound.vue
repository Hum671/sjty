<template name="keep-alive-404">
  <div class="box">
    <Navbar2 title="404" :is-show-right="false" class="navbar" />

    <div class="no">404 Page not found!</div>
  </div>
</template>

<style lang="less" scoped>
.box {
  height: 100%;
  .no {
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
}
</style>
