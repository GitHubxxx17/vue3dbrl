<script setup>
import { ref, watch } from "vue";
import { RouterLink, RouterView } from "vue-router";
import FooterBar from "./components/global/FooterBar.vue";
import { mainStore } from "./stores";
import UploadPage from "./components/community/UploadPage.vue";
const mainData = mainStore();
import EnterPK from "./components/PK/EnterPK.vue";
</script>

<template>
  <!-- <UploadPage></UploadPage> -->
  <FooterBar v-if="mainData.footerNavIsShow"></FooterBar>
  <router-view> </router-view>
</template>

<style lang="less">
@vw: 3.75vw;
/* 下拉组件的样式 */
.van-toast__text {
  width: (90 / @vw);
  height: (35 / @vw);
  text-align: center;
  line-height: (35 / @vw);
  border-radius: (8 / @vw);
  background-color: #c3c3c3 !important;
}
//按钮切换动画
.hb_btn {
  position: relative;
  flex: 2;
  height: 100%;
  text-align: center;
  line-height: (40 / @vw);
  font-size: (16 / @vw);

  &::after {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scale(0);
    transition: all 0.2s;
    content: "";
    width: (30 / @vw);
    height: (2 / @vw);
    background-color: rgb(92, 78, 175);
    border-radius: (5 / @vw);
  }
}

.btn_line {
  &::after {
    transform: translateX(-50%) scale(1);
  }
}

.slide-right-enter-active,
.slide-right-leave-avtive,
.slide-left-enter-active,
.slide-left-leave-avtive {
  transition: all 0.3s;
}
.slide-right-enter-from,
.slide-left-leave-to {
  left: -100%;
}
.slide-left-enter-to,
.slide-left-leave-from,
.slide-right-enter-to,
.slide-right-leave-from {
  left: 0;
}
.slide-left-enter-from,
.slide-right-leave-to {
  left: 100%;
}

.animated {
  -webkit-animation-duration: 1s; //表示开始动画以前的延时
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  &.infinite {
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }
}

.appear {
  visibility: visible;
  animation-delay: 1.8s;
  animation-name: appear;
}

.disappear {
  visibility: visible;
  animation-delay: 0.3s;
  animation-name: disappear;
}

//出现
@keyframes appear {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

//消失
@keyframes disappear {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
