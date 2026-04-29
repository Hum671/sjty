<script setup lang="ts">
import { getQuestions } from '@/api/home'
import { formatToLocaleTime } from '@/utils/utils'

const questions = ref<any[]>([])

watchEffect(() => {
  getQuestions(1).then((res) => {
    questions.value = res.data
  })
})
</script>

<template>
  <div>
    <div class="item" v-for="(item, index) of questions" :key="index">
      <div class="content">
        <h2 class="title">{{ item.sort }}.{{ item.title }}</h2>
        <span>{{ item.content }}</span>
        <div class="info">
          <div class="left">
            <van-icon name="like-o" class="like" />
            <div>{{ item.likesNum }}k+</div>
          </div>
          <div class="date">
            {{ formatToLocaleTime(item.createTime) }}
          </div>
        </div>
      </div>
      <van-divider />
    </div>
  </div>
</template>

<style lang="less" scoped>
.content {
  padding: 0 16px;
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;

    .left {
      display: flex;
      align-items: center;
      .like {
        margin-right: 8px;
        font-size: 16px;
      }
    }
    .date {
      color: #999999;
    }
  }
}
</style>
