<template>
  <div class="loading">
    <div class="spinner"></div>
    <div class="text">上传文件中</div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="less">
@vw: 3.95vw;
.loading {
  z-index: 20000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #00000078;
  /* 禁止选取 */
  user-select: none;

  .spinner {
    position: absolute;
    width: (160 / @vw);
    height: (160 / @vw);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .spinner::before,
  .spinner::after {
    content: "";
    position: absolute;
  }

  /* 图形 */
  .spinner::before {
    width: 100%;
    height: 100%;
    background-color: #a08fd5;
    /* 执行动画：动画名 时长 贝塞尔曲线 无限次播放 */
    animation: spinner 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite;
  }

  /* 投影 */
  .spinner::after {
    width: 100%;
    height: (4 / @vw);
    border-radius: 50%;
    background-color: #333;
    bottom: -(40 / @vw);
    animation: shadow 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite;
  }

  /* loading文字 */
  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: (32 / @vw);
    text-transform: uppercase;
    font-weight: 100;
    animation: text 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite;
  }

  /* 定义动画 */
  @keyframes spinner {
    50% {
      border-radius: 50%;
      background-color: #f5e866;
      transform: rotate(360deg) scale(0.5);
    }

    100% {
      background-color: #a08fd5;
      transform: rotate(720deg);
    }
  }

  @keyframes shadow {
    50% {
      transform: scale(0.5);
    }
  }

  @keyframes text {
    0%,
    100% {
      transform: translate(-50%, -50%) scale(1, 1);
    }

    50% {
      transform: translate(-50%, -50%) scale(0.5, 0.5);
      color: #000;
    }
  }
}
</style>