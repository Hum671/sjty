<template>
  <van-overlay class="ovler2" :show="true" z-index="100">
    <div class="wrapper">
      <div class="container">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </van-overlay>
</template>

<style lang="less" scoped>
.ovler2 {
  --van-overlay-background: rgba(240, 240, 240, 0.7);
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .container {
    width: 300px;
    height: 300px;
    /* 相对定位 */
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    /* 自定义属性--h（即色相） */
    --h: calc(var(--percent) / 100 * 360);
    /* hsl函数使用色相、饱和度、亮度来定义颜色 */
    color: hsl(var(--h), 100%, 75%);
    /* 执行动画：动画名称 时长 线性的 无限次播放 */
    animation: changecolor 5s linear infinite;
    span {
      /* 绝对定位 */
      position: absolute;
      /* 自定义属性 可通过var函数进行调用 */
      --diameter: calc(10% + (var(--n) - 1) * 30%);
      width: var(--diameter);
      height: var(--diameter);
      border-style: solid;
      /* currentColor代表当前元素被应用上的color颜色值，如果当前元素没有在css里指定一个color值，那它的颜色值就从父级元素继承而来 */
      border-color: currentColor transparent;
      border-width: 10px 10px 0 0;
      border-radius: 50%;
      /* 执行动画：动画名称 线性的 无限次播放 */
      animation: rotating linear infinite;
      /* 计算并设置动画时长 */
      animation-duration: calc(5s / (9 - var(--n) + 1));

      /* 为每一个span元素设置自定义属性--n */
      &:nth-child(1) {
        --n: 1;
      }
      &:nth-child(2) {
        --n: 2;
      }
      &:nth-child(3) {
        --n: 3;
      }
      &:nth-child(4) {
        --n: 4;
      }
      &:nth-child(5) {
        --n: 5;
      }
      &:nth-child(6) {
        --n: 6;
      }
      &:nth-child(7) {
        --n: 7;
      }
      &:nth-child(8) {
        --n: 8;
      }
      &:nth-child(9) {
        --n: 9;
      }
    }
  }

  /* 定义动画 */
  /* 旋转 */
  @keyframes rotating {
    to {
      transform: rotate(1turn);
    }
  }
  /* 通过改变自定义属性--percent来改变颜色 */
  @keyframes changecolor {
    0%,
    100% {
      --percent: 0;
    }
    10% {
      --percent: 10;
    }
    20% {
      --percent: 20;
    }
    30% {
      --percent: 30;
    }
    40% {
      --percent: 40;
    }
    50% {
      --percent: 50;
    }
    60% {
      --percent: 60;
    }
    70% {
      --percent: 70;
    }
    80% {
      --percent: 80;
    }
    90% {
      --percent: 90;
    }
  }
}
</style>
