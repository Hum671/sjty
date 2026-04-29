<template>
  <div>
    <HeaderCpn />
    <HomeDesc />
    <HomeBanner />
    <HomeBanner2 />
    <HomeNoticeBar />
    <MarketsView class="m-list" />
    <HomeTrend />
    <Download />
    <HomeInfo />
  </div>
</template>

<style lang="less" scoped>
.btns {
  margin: 15px;
  gap: 10px;
  .btn1,
  .btn2 {
    flex: 1;
    border-radius: 5px;
    background-color: #f6f7fb;
    padding: 12px 15px;
  }
}
.container {
  padding-bottom: env(safe-area-inset-bottom);
}
:deep(.van-notice-bar__content) {
  font-size: 14px;
}

.m-list {
  height: auto !important;
  min-height: auto;
}
</style>
