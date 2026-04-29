<script setup lang="ts"></script>

<template>
  <div class="info-box">
    <div class="title">{{ $t('h5.home.info_t1') }}</div>
    <div class="box">
      <img class="img1" src="@/assets/images/partners2.png" alt="" />
      <section>
        <div class="tt2 flex-box-sb">
          {{ $t('h5.home.info_t2') }}
          <img src="@/assets/images/finger.svg" alt="" />
        </div>
        <p>{{ $t('h5.home.info_p1') }}</p>
      </section>
      <section>
        <div class="tt2 flex-box-sb">
          {{ $t('h5.home.info_t3') }}
          <img src="@/assets/images/cloud.svg" alt="" />
        </div>
        <p>{{ $t('h5.home.info_p2') }}</p>
      </section>
    </div>

    <section class="box2">
      <div class="tt">{{ $t('h5.home.info_t4') }}</div>
      <p>{{ $t('h5.home.info_p3') }}</p>
    </section>

    <div class="tips flex-box-nm">
      <div class="t-it">#{{ $t('h5.home.tips_1') }}</div>
      <div class="t-it">#{{ $t('h5.home.tips_2') }}</div>
      <div class="t-it">#{{ $t('h5.home.tips_3') }}</div>
      <div class="t-it">#{{ $t('h5.home.tips_4') }}</div>
      <div class="t-it">#{{ $t('h5.home.tips_5') }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.info-box {
  width: 100%;
  margin: 50px 0;
  padding: 0 20px;
  box-sizing: border-box;
  .title {
    text-align: center;
    font-size: 18px;
    margin-bottom: 60px;
  }
  .box {
    position: relative;
    padding: 50px 14px 10px;
    border: 1px solid #3f6f8d;
    border-radius: 8px;
    color: var(--cb-fColor);
    font-size: 14px;
    .img1 {
      position: absolute;
      top: -40px;
      left: 50%;
      width: 80px;
      transform: translateX(-50%);
    }
    .tt {
      font-size: 15px;
    }
    section {
      margin-bottom: 10px;
    }
    p {
      line-height: 22px;
      color: var(--cb-fColor8);
    }
  }
  .box2 {
    padding: 50px 0px 8px;
    color: var(--cb-fColor);
    font-size: 18px;
    .tt {
      text-align: center;
      margin-bottom: 20px;
    }
    p {
      color: var(--cb-fColor7);
      font-size: 14px;
      line-height: 22px;
    }
  }
  .tips {
    gap: 10px;
    flex-wrap: wrap;
    .t-it {
      border: 1px solid var(--cb-borderColor2);
      border-radius: 12px;
      padding: 8px 12px;
    }
  }
}
</style>
