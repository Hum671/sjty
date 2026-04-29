<script setup lang="ts"></script>

<template>
  <div class="loader">
    <div class="horizontal">
      <div class="circlesup">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
      <div class="circlesdwn">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
    </div>
    <div class="vertical">
      <div class="circlesup">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
      <div class="circlesdwn">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.loader {
  text-align: center;
  user-select: none;
  cursor: default;
}

.vertical {
  position: absolute;
  top: 0px;
  left: 0px;
  transform: rotate(90deg);
}

.horizontal {
  position: absolute;
  top: 0px;
  left: 0px;
  transform: rotate(0deg);
}

.circlesup {
  position: absolute;
  top: -22px;
  right: 57px;
}

.circlesdwn {
  position: absolute;
  top: 22px;
  right: -57px;
  transform: rotate(180deg);
}

.circle {
  position: absolute;
  width: 57px;
  height: 81px;
  transform: rotate(292deg);
  animation: orbit 2s infinite;
  z-index: 5;
}

.circle:after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 100%;
  background: #ff3c38;
}

.circle:nth-child(2) {
  animation-delay: 100ms;
  z-index: 4;
}

.circle:nth-child(2):after {
  background: #ff6d00;
  transform: scale(0.8, 0.8);
}

.circle:nth-child(3) {
  animation-delay: 225ms;
  z-index: 3;
}

.circle:nth-child(3):after {
  background: #ff9e00;
  transform: scale(0.6, 0.6);
}

.circle:nth-child(4) {
  animation-delay: 350ms;
  z-index: 2;
}

.circle:nth-child(4):after {
  background: #ffc300;
  transform: scale(0.4, 0.4);
}

.circle:nth-child(5) {
  animation-delay: 475ms;
  z-index: 1;
}

.circle:nth-child(5):after {
  background: #ffe066;
  transform: scale(0.2, 0.2);
}

@keyframes orbit {
  0% {
    transform: rotate(45deg);
  }

  5% {
    transform: rotate(45deg);
    animation-timing-function: ease-out;
  }

  70% {
    transform: rotate(405deg);
    animation-timing-function: ease-in;
  }

  100% {
    transform: rotate(405deg);
  }
}

@keyframes text {
  0% {
    transform: scale(0.2, 0.2);
    animation-timing-function: ease-out;
  }

  50% {
    transform: scale(1, 1);
    animation-timing-function: ease-out;
  }

  60% {
    transform: scale(1, 1);
    animation-timing-function: ease-out;
  }

  100% {
    transform: scale(0.2, 0.2);
  }
}
</style>
