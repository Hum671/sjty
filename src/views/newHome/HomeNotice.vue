<script setup lang="ts">
const router = useRouter()

const appName = import.meta.env.VITE_APP_NAME

function goTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="home-notice">
    <div class="top-sec">
      <h1>{{ appName }} {{ $t('h5.home.shengtai') }}</h1>
      <div class="t2 flex-box-nm">
        <div class="xinji">{{ $t('h5.home.xinjiyuan') }}</div>
      </div>
      <h3>{{ $t('h5.home.caifuweidu') }}</h3>
    </div>

    <div class="num-item">
      <div class="item">
        <div class="value">10+</div>
        <div class="label">{{ $t('h5.home.baiwanyh') }}</div>
      </div>
      <div class="item">
        <div class="value">$25,756,346</div>
        <div class="label">{{ $t('h5.home.24hchengjiao') }}</div>
      </div>
      <div class="item">
        <div class="value">100+</div>
        <div class="label">{{ $t('h5.home.youzhizichan') }}</div>
      </div>
    </div>

    <div class="btns">
      <van-button size="large" class="btn-submit" block @click="goTo('/pledge')">
        {{ $t('h5.home.kaishizhiya') }}
      </van-button>
      <van-button size="large" class="btn-submit btn2" block @click="goTo('/markets')">
        {{ $t('h5.contract.market.begin_buy') }}
      </van-button>
    </div>

    <div class="section1">
      <div class="t1 flex-box-nm">
        <h1>{{ appName }}</h1>
        <h2>{{ $t('h5.home.shengtai') }}</h2>
      </div>
      <p>{{ $t('h5.home.zuigaonianjiang') }}756%</p>
      <p>{{ $t('h5.home.tanxingcunqu') }}</p>
      <p>{{ $t('h5.home.duochongjiang') }}</p>
    </div>

    <div class="section2">
      <div class="top">
        <img src="@/assets/images/hf.png" alt="" />
        <div>{{ $t('h5.home.chengnuo') }}</div>
      </div>
      <div class="desc">
        {{ $t('h5.home.tuanduishouyi', { unit: 'USDT', lowvalue: '1000USDT' }) }}
      </div>
    </div>

    <div class="section2">
      <div class="top">
        <img src="@/assets/images/hs.png" alt="" />
        <div>{{ $t('h5.home.savebaozhang') }}</div>
      </div>
      <div class="desc">{{ $t('h5.home.zhishengshenhuo') }}</div>
    </div>

    <div class="section2 section3">
      <div class="top">
        <div>{{ $t('h5.home.dailijiagnli') }}</div>
      </div>
      <div class="desc">{{ $t('h5.home.zhiyayongjinjiang') }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-notice {
  padding: 40px 0 20px;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  h1,
  h2,
  h3 {
    line-height: 0;
  }
  .top-sec {
    h1,
    h2,
    h3 {
      font-size: 22px;
      margin-bottom: 30px;
    }
    h2 {
      color: var(--cb-fColor2);
    }
  }
  .t2 {
    justify-content: center;
    margin: 0 auto;
    width: 90vw;
    box-sizing: border-box;
    .xinji {
      font-size: 22px;
      font-weight: bold;
      word-break: break-word;
      white-space: normal;
      overflow-wrap: break-word;
      color: var(--cb-fColor2);
    }
    img {
      width: 65px;
      margin-left: 20px;
    }
  }
  .num-item {
    padding: 40px 0 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    .value {
      color: var(--cb-fColor2);
      font-size: 22px;
      font-weight: 700;
    }
    .label {
      margin-top: 14px;
      color: var(--cb-fColor3);
      font-size: 12px;
    }
  }

  .btns {
    padding: 15px 0 26px;
    .btn-submit {
      margin: 20px auto;
      height: 45px;
      width: 90%;
      font-size: 14px;
      color: #fff;
      background-color: var(--cb-btnBgc);
      border-radius: 50px;
    }

    .btn2 {
      color: var(--cb-fColor2);
      background-color: var(--cb-btnBgc2);
    }
  }

  .section1 {
    padding: 20px 0 40px;
    background: url(@/assets/images/cardbg.png) no-repeat;
    background-size: 100% 100%;
    border-radius: 12px;
    .t1 {
      width: 100%;
      justify-content: center;
      text-align: center;
      h1,
      h2,
      h3 {
        font-size: 24px;
        font-weight: normal;
      }
      h1 {
        color: var(--cb-fColor2);
        margin-right: 10px;
      }
    }
    p {
      font-size: 14px;
      color: var(--cb-fColor3);
    }
  }

  .section2 {
    margin-bottom: 14px;
    padding: 20px 20px;
    background: url(@/assets/images/cardbg.png) no-repeat;
    background-size: 200%;
    border-radius: 12px;
    .top {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 18px;
      img {
        width: 50px;
      }
    }
    .desc {
      margin-top: 16px;
      text-align: left;
      font-size: 14px;
      color: var(--cb-fColor3);
      line-height: 23px;
      font-weight: 400;
    }
  }
  .section3 {
    background: var(--cb-btnBgc);
    color: #fff;
    .desc {
      color: #fff;
    }
  }
}
</style>
