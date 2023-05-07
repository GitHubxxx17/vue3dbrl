<template>
  <div class="newwaitPK" v-if="!mainData.isPk">
    <div
      class="vs_title appear img_box animated"
      :class="{
        appear: waitPkData.isAppear,
        appear_xz: waitPkData.isAppear,
        disappear: !waitPkData.isAppear,
      }"
    >
      <img src="../../assets/PK/WaitPK/rotate.png" alt=" " />
    </div>
    <!-- <div class="vs_title liti appear animated ">v s</div> -->
    <div
      class="mine animated"
      :class="{
        appearup: waitPkData.frameIsAppear,
        disappearup: !waitPkData.frameIsAppear,
      }"
    >
      <div class="back_bock" @click="closeWaitPK()">
        <i class="iconfont icon-xiangzuojiantou"></i>
      </div>

      <div class="corrugated_box">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="head_portrait">
          <img
            :src="
              userData.user.base64 == ''
                ? 'src/assets/头像-女学生2.png'
                : userData.user.base64
            "
          />
        </div>
      </div>
      <div class="idname">{{ userData.user.nickName }}</div>
      <div class="bgc">
        <div class="triangle"></div>
      </div>
    </div>
    <div
      class="other animated"
      :class="{
        appearbottom: waitPkData.frameIsAppear,
        disappearbottom: !waitPkData.frameIsAppear,
      }"
    >
      <div class="bgc">
        <div class="triangle"></div>
      </div>
      <div class="corrugated_box">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="head_portrait" ref="head_portrait">
          <!-- <div class="Unmatched">?</div> -->
          <!-- <img src="./images/头像/头像-女学生2.png " alt=" "> -->
        </div>
      </div>
      <div class="box">
        <div class="other_name">{{ rivalMsg.name }}</div>
        <div class="search">
          <span>正在匹配.....</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入内置函数
import { ref, onMounted, watch } from "vue";
// 引入数据
import { pkStore, userStore, mainStore } from "@/stores";

let pkData = pkStore(); // 获取pk数据
let mainData = mainStore(); // 主要数据
let userData = userStore(); // 获取用户数据
let waitPkData = pkData.waitPkData; // 获取等待pk的数据
let rivalMsg = pkData.rivalMsg; // 对手的信息
let enterPkData = pkData.enterPkData; // 获取进入pk的数据

let head_portrait = ref(null).value; // pk对象的头像


// 加载完之后处理的事件
onMounted(() => {
  head_portrait.innerHTML = rivalMsg.portrait;
});

// 关闭等待pk
function closeWaitPK() {
  pkData.closeWS();
  waitPkData.frameIsAppear = false;
  waitPkData.isAppear = false;
  setTimeout(() => {
    mainData.footerNavIsShow = true;
    mainData.isPk = true;
  }, 1800);
  pkData.resetRivalMsg();
}
</script>

<style lang="less">
@vw: 3.95vw;
.newwaitPK {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #a48ec53c;

  .mine {
    height: 60vh;
    width: 100%;
    background-color: #f8d63a;
    position: absolute;
    top: 0;
    // margin-top: (-410/@vw);
    // background-color:#fff;
    clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
    .back_bock {
      display: flex;
      align-items: center;
      padding: 0 (15 / @vw);
      width: 100%;
      height: (6vh);
      background-color: #f8d63a;
      color: #fff;
      font-size: 700;

      i {
        width: (40 / @vw);
        height: (6vh);
        line-height: (6vh);
      }
    }

    .corrugated_box {
      // margin-top: (-1/@vw);
      background-color: #f8d63a;
      height: calc(100vh - 66vh);
      display: flex;
      justify-content: center;
      align-items: center;

      .circle {
        width: 25px;
        height: 25px;
        background-color: rgb(250, 149, 6);
        border-radius: 50%;
        position: absolute;
        /* 执行动画：动画名 时长 加速后减速 无限播放 */
        animation: corrugated 3s ease-in-out infinite;
      }
      /* 分别为每个圆形设置不同的宽高、不透明度、动画延迟时间 */

      .circle:nth-child(1) {
        width: calc(25px * 1);
        height: calc(25px * 1);
        opacity: 1;
        animation-delay: 0.12s;
      }

      .circle:nth-child(2) {
        width: calc(25px * 2);
        height: calc(25px * 2);
        opacity: 0.5;
        animation-delay: 0.24s;
      }

      .circle:nth-child(3) {
        width: calc(25px * 3);
        height: calc(25px * 3);
        opacity: 0.33;
        animation-delay: 0.36s;
      }

      .circle:nth-child(4) {
        width: calc(25px * 4);
        height: calc(25px * 4);
        opacity: 0.25;
        animation-delay: 0.48s;
      }

      .circle:nth-child(5) {
        width: calc(25px * 5);
        height: calc(25px * 5);
        opacity: 0.2;
        animation-delay: 0.6s;
      }

      .circle:nth-child(6) {
        width: calc(25px * 6);
        height: calc(25px * 6);
        opacity: 0.16;
        animation-delay: 0.72s;
      }

      .head_portrait {
        z-index: 100;
        width: (105 / @vw);
        height: (105 / @vw);
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        img {
          width: (95 / @vw);
          height: (95 / @vw);
          border-radius: 100%;
        }
      }
    }

    .idname {
      margin-top: (-30 / @vw);
      color: #fff;
      font-size: (16 / @vw);
      // font-weight: 700;
      text-align: center;
    }
  }

  .other {
    position: absolute;
    bottom: 0;
    height: 60vh;
    width: 100%;
    // margin-top: (816/@vw);
    background-color: #a48ec5cf;
    // height: calc(100vh - 110vw);
    clip-path: polygon(0 30%, 100% 0, 100% 100%, 0 100%);
    .corrugated_box {
      margin-top: (-1 / @vw);
      background-color: #a48ec5;
      // margin-top: (-20/@vw);
      height: 60vh;
      display: flex;
      justify-content: center;
      align-items: center;

      .circle {
        // margin-top: (-15vh);
        width: 25px;
        height: 25px;
        background-color: rgba(166, 92, 245, 0.935);
        border-radius: 50%;
        position: absolute;
        /* 执行动画：动画名 时长 加速后减速 无限播放 */
        animation: corrugated 3s ease-in-out infinite;
      }
      /* 分别为每个圆形设置不同的宽高、不透明度、动画延迟时间 */

      .circle:nth-child(1) {
        width: calc(25px * 1);
        height: calc(25px * 1);
        opacity: 1;
        animation-delay: 0.12s;
      }

      .circle:nth-child(2) {
        width: calc(25px * 2);
        height: calc(25px * 2);
        opacity: 0.5;
        animation-delay: 0.24s;
      }

      .circle:nth-child(3) {
        width: calc(25px * 3);
        height: calc(25px * 3);
        opacity: 0.33;
        animation-delay: 0.36s;
      }

      .circle:nth-child(4) {
        width: calc(25px * 4);
        height: calc(25px * 4);
        opacity: 0.25;
        animation-delay: 0.48s;
      }

      .circle:nth-child(5) {
        width: calc(25px * 5);
        height: calc(25px * 5);
        opacity: 0.2;
        animation-delay: 0.6s;
      }

      .circle:nth-child(6) {
        width: calc(25px * 6);
        height: calc(25px * 6);
        opacity: 0.16;
        animation-delay: 0.72s;
      }

      .head_portrait {
        // margin-top: (-15vh);
        z-index: 100;
        width: (105 / @vw);
        height: (105 / @vw);
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;

        .Unmatched {
          background-color: #a48ec5;
          width: (95 / @vw);
          height: (95 / @vw);
          line-height: (95 / @vw);
          border-radius: 100%;
          font-size: (95 / @vw);
          color: #fff;
          text-align: center;
        }
        img {
          width: (95 / @vw);
          height: (95 / @vw);
          border-radius: 100%;
        }
      }
    }

    .box {
      background-color: #a48ec5;
    }

    .other_name {
      margin-top: (-16vh);
      color: #fff;
      height: (30 / @vw);
      font-size: (16 / @vw);
      // font-weight: 700;
      text-align: center;
    }

    .search {
      margin-top: (-10 / @vw);
      padding: (17.8 / @vw) 0;
      width: 100%;
      text-align: center;

      span {
        display: inline-block;
        width: (120 / @vw);
        background-image: linear-gradient(
          to right,
          rgba(239, 239, 239, 0.436),
          rgba(217, 216, 216, 0.574),
          rgba(244, 241, 241, 0.722)
        );
        border-radius: (10 / @vw);
      }
    }
  }
}

// 旋转img的样式
.vs_title {
  z-index: 100;
  position: fixed;
  top: 50%;
  left: 50%;
  width: (150 / @vw);
  height: (100 / @vw);
  margin-left: (-70 / @vw);
  margin-top: -20%;
  font-size: (90 / @vw);
  text-transform: uppercase;
}

.img_box {
  margin-left: -18%;
  margin-top: -19%;
  width: (130 / @vw);
  height: (130 / @vw);
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    transition: all 10s;
    opacity: 1;
    width: 100%;
    height: 100%;
  }
}

.appearup {
  -webkit-animation-name: appearup;
  animation-delay: 1s;
  animation-name: appearup;
  animation-timing-function: ease-in-out;
  // animation: appearup 1s ease-out alternate-reverse infinite;
}

.appearbottom {
  -webkit-animation-name: appearbottom;
  animation-delay: 1s;
  animation-name: appearbottom;
  animation-timing-function: ease-in-out;
  // animation: appearbottom 1s ease-out alternate-reverse infinite;
}

.disappearup {
  -webkit-animation-name: disappearup;
  animation-delay: 1s;
  animation-name: disappearup;
  animation-timing-function: ease-in-out;
  // animation: appearup 1s ease-out alternate-reverse infinite;
}

.disappearbottom {
  -webkit-animation-name: disappearbottom;
  animation-delay: 1s;
  animation-name: disappearbottom;
  animation-timing-function: ease-in-out;
  // animation: appearbottom 1s ease-out alternate-reverse infinite;
}

.appear_xz {
  visibility: visible;
  animation-delay: 1s;
  animation: xz 1s linear infinite;
}

// 波纹动画
@keyframes corrugated {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(0.7);
  }
  75% {
    transform: scale(1);
  }
}

//从上滑出动画
@keyframes appearup {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  50% {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  52% {
    opacity: 1;
    -webkit-transform: translate3d(0, 0%, 0);
    transform: translate3d(0, 0%, 0);
    animation-timing-function: ease-in;
  }
  65% {
    opacity: 1;
    -webkit-transform: translate3d(0, -6%, 0);
    transform: translate3d(0, -6%, 0);
  }
  68% {
    opacity: 1;
    -webkit-transform: translate3d(0, -6%, 0);
    transform: translate3d(0, -6%, 0);
  }
  90% {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes disappearup {
  0% {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  100% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}

//从下滑出动画
@keyframes appearbottom {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
  50% {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  52% {
    opacity: 1;
    -webkit-transform: translate3d(0, 0%, 0);
    transform: translate3d(0, 0%, 0);
    animation-timing-function: ease-in;
  }
  65% {
    opacity: 1;
    -webkit-transform: translate3d(0, 6%, 0);
    transform: translate3d(0, 6%, 0);
  }
  68% {
    opacity: 1;
    -webkit-transform: translate3d(0, 6%, 0);
    transform: translate3d(0, 6%, 0);
  }
  90% {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes disappearbottom {
  0% {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  100% {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}

// 旋转动画
@keyframes xz {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
