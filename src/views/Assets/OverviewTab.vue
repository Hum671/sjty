<script setup lang="ts"></script>

<template>
  <div class="overview-box">
    <div class="balance-box">
      <TotalBalances />
      <div class="btns flex-box-sb">
        <van-button class="btn" color="#0052ff">{{ $t('deposit') }}</van-button>
        <van-button class="btn" color="#0052ff">
          {{ $t('Withdraw') }}
        </van-button>
        <van-button class="btn" color="#0052ff">
          {{ $t('Transfer') }}
        </van-button>
      </div>
    </div>
    <div class="cell-item flex-box-sb">
      <div class="left flex-box-nm">
        <SpotAccountIcon class="icon" />
        <div class="label">{{ $t('Spot_Account') }}</div>
      </div>
      <div class="right">{{ 0 }} U</div>
    </div>
    <div class="cell-item flex-box-sb">
      <div class="left flex-box-nm">
        <DolaAccount class="icon" />
        <div class="label">{{ $t('Financial_Account') }}</div>
      </div>
      <div class="right">{{ 0 }} U</div>
    </div>
    <van-divider />
    <div class="cell-item flex-box-sb">
      <div class="left flex-box-nm">
        <TeamIcon class="icon" />
        <div class="label">{{ $t('My_team') }}</div>
      </div>
      <van-icon name="arrow" size="18" />
    </div>
    <div class="cell-item flex-box-sb">
      <div class="left flex-box-nm">
        <InvestmentIcon class="icon" />
        <div class="label">{{ $t('My_investment') }}</div>
      </div>
      <van-icon name="arrow " size="18" />
    </div>
    <div class="cell-item flex-box-sb">
      <div class="left flex-box-nm">
        <VipIcon class="icon" />
        <div class="label">{{ $t('VIP_level') }}</div>
      </div>
      <van-icon name="arrow" size="18" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.overview-box {
  margin-top: 20px;
  padding: 0 16px;
  .balance-box {
    .btns {
      margin: 30px 0 45px;
      .btn {
        width: 30%;
      }
    }
  }
  .cell-item {
    margin: 30px 0;
    .icon {
      font-size: 24px;
      margin-right: 13px;
    }
    .label {
      font-size: 14px;
    }
  }
}
</style>
