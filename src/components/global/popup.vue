<template>
  <teleport to="#app">
    <div class="popup ani_show" v-show="show">
      <div class="popup_box">{{ text }}</div>
    </div>
  </teleport>
</template>

<script setup>
import { nextTick } from "vue";

const props = defineProps(["show", "text"]);

</script>

<style scoped lang="less">
@vw: 3.95vw;
.popup {
  z-index: 20000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  .popup_box {
    position: absolute;
    width: (140 / @vw);
    height: (60 / @vw);
    top: 8%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    z-index: 10000;
    border-radius: (10 / @vw);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: (18 / @vw);
    box-shadow: (2 / @vw) (2 / @vw) (6 / @vw) (2 / @vw)
      rgba(121, 121, 121, 0.38);
  }
}
.ani_show {
  animation: ani_show 3s forwards;
}

@keyframes ani_show {
  0% {
    opacity: 0.1;
    top: -10%;
  }

  40% {
    opacity: 1;
    top: 1%;
  }

  70% {
    opacity: 1;
    top: 1%;
  }

  100% {
    opacity: 0.1;
    top: -15%;
  }
}
</style>