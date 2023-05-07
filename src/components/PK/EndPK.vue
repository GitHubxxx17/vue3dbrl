<template>
  <div class="pk_end animated">
    <div class="ani">
      <div class="vs_title end_pk">vs</div>
      <div class="back_bock" style="opacity: 0">
        <i class="iconfont icon-xiangzuojiantou"></i>
      </div>
      <div class="pk_interface">
        <span
          class="mine animated"
          :class="{
            appearLeft: endPkData.isAppear,
            disLeft: !endPkData.isAppear,
          }"
        >
          <div class="my_box">
            <div class="head_portrait">
              <img
                :src="
                  userData.user.base64 == ''
                    ? 'src/assets/头像-女学生2.png'
                    : userData.user.base64
                "
                alt=" "
              />
            </div>
          </div>
          <div class="idname">{{ userData.user.nickName }}</div>
          <div class="xingxing">
            <i class="add_reduce mine_add_reduce">{{ myStart }}</i>
            <i class="active iconfont icon-shoucang"></i>
          </div>
        </span>
        <span class="win_lose">
          <img class="bgc animated zoom1" :src="gameBgc" alt=" " />
          <img class="win animated zoom2" :src="gameRes" alt=" " />
        </span>
        <span
          class="other animated"
          :class="{
            appearRight: endPkData.isAppear,
            disRight: !endPkData.isAppear,
          }"
        >
          <div class="other_box">
            <div class="ohter_portrait" ref="otherPortrait">
              <!-- <img src="../../assets/头像-女学生2.png" alt=" " /> -->
            </div>
          </div>
          <div class="other_name">{{ rivalMsg.name }}</div>
          <div class="xingxing">
            <i class="add_reduce other_add_reduce">{{ otherStart }}</i>
            <i class="active iconfont icon-shoucang"></i>
          </div>
        </span>
      </div>

      <div
        class="show_answer animated"
        :class="{ appear: endPkData.isAppear, disappear: !endPkData.isAppear }"
      >
        <div class="mine_an" ref="myAnswer"></div>
        <div class="answer" ref="answer"></div>
      </div>

      <button
        class="click_back animated"
        :class="{ appear: endPkData.isAppear, disappear: !endPkData.isAppear }"
        @click="ResetEndPK()"
      >
        点击返回
      </button>
    </div>
  </div>
</template>

<script setup>
// 引入内置函数
import { ref, onMounted } from "vue";
import { pkStore, userStore, mainStore } from "@/stores";
let mainData = mainStore(); // 获取pk数据
let pkData = pkStore(); // 获取pk数据
let userData = userStore(); // 获取用户数据
let enterPkData = pkData.enterPkData;
let endPkData = pkData.endPkData; // 结束pk的数据
let rivalMsg = pkData.rivalMsg; // 结束pk的数据

let myAnswer = ref(null).value; // 我的答案
let answer = ref(null).value; // 正确答案
let otherPortrait = ref(null).value; // 头像

let myStart = ref(0);
let otherStart = ref(0);
let gameBgc = ref("");
let gameRes = ref("");

// 重置结束pk
let ResetEndPK = () => {
  endPkData.isAppear = false;
  setTimeout(() => {
    mainData.footerNavIsShow = true;
    mainData.isPk = true;
    pkData.isEnd = false;
    pkData.resetAnswer();
    pkData.resetRivalMsg();
    pkData.closeWS();
    answer.innerHTML = endPkData.answer;
    myAnswer.innerHTML = endPkData.myAnswer;
  }, 1000);
};
function RefreshWinOrLose(winnerId) {
  if (winnerId == -1) {
    myStart.value = `+0`;
    otherStart.value = `+0`;
    gameBgc.value = "src/assets/PK/win_bgc.png";
    gameRes.value = "src/assets/PK/win.png ";
  } else {
    if (userData.user.token == winnerId) {
      console.log("我赢了");
      myStart.value = `+1`;
      otherStart.value = `-1`;
      gameBgc.value = "src/assets/PK/win_bgc.png";
      gameRes.value = "src/assets/PK/win.png ";
    } else {
      myStart.value = `-1`;
      gameBgc.value = "src/assets/PK/defeat_bgc.png";
      otherStart.value = `+1`;
      gameRes.value = "src/assets/PK/defeat.png ";
    }
  }
}
onMounted(() => {
  otherPortrait.innerHTML = rivalMsg.portrait;
  myAnswer.innerHTML = endPkData.myAnswer;
  answer.innerHTML = endPkData.answer;
  RefreshWinOrLose(endPkData.winnerId);
});
</script>

<style scoped lang="less">
@vw: 3.95vw;
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
.pk_end {
  background-color: #bba5dd;
  // background-color: #9182f6;
  width: 100%;
  height: (100vh);
  overflow: hidden;

  .end_pk {
    width: 100%;
    height: (100 / @vw);
    margin-left: (-35%);
    margin-top: (-90 / @vw);
    color: #ffffff39;
    font-size: (200 / @vw);
    font-weight: 700;
    z-index: 0;
  }

  .back_bock {
    margin-top: (5 / @vw);
    display: flex;
    align-items: center;
    padding: 0 (15 / @vw);
    width: 100%;
    height: 6vh;
    color: #fff;
  }

  .pk_interface {
    position: relative;
    display: flex;
    justify-content: space-between;

    .mine {
      margin-top: (20 / @vw);
      // margin-right: (70/@vw);
      display: inline-block;
      width: 40%;
      // height: calc(100vh -  10.66vw);
      .my_box {
        display: flex;
        padding-right: (15 / @vw);
        justify-content: flex-end;
        align-items: center;
        width: (120 / @vw);
        height: (80 / @vw);
        background-image: linear-gradient(to right, #9a8fb46c, #562eae95);
        // background-image: linear-gradient(to right,rgba(225, 205, 250, 0.619),rgba(144, 26, 248, 0.588));
        color: #fff;
        border-radius: 0 (50 / @vw) (50 / @vw) 0;

        .head_portrait {
          width: (65 / @vw);
          height: (65 / @vw);
          background-color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 100%;
          img {
            width: (60 / @vw);
            height: (60 / @vw);
            border-radius: 100%;
          }
        }
      }
      .idname {
        margin-top: (10 / @vw);
        width: (120 / @vw);
        text-align: center;
        color: #fff;
        font-size: (14 / @vw);
      }

      .xingxing {
        margin-top: (10 / @vw);
        width: (120 / @vw);
        text-align: center;
        font-size: (20 / @vw);
        // color: #f8d63a;

        i {
          color: #000000;
          display: inline-block;
          font-style: normal;
        }

        .icon-shoucang {
          color: #f8d63a;
          font-size: (20 / @vw);
        }
      }
    }

    .win_lose {
      position: absolute;
      top: (20 / @vw);
      left: 50%;
      margin-left: (-60 / @vw);
      // margin-top: (-5/@vw);
      // margin-left: (30/@vw);
      width: (120 / @vw);

      .bgc {
        position: absolute;
        top: 2vh;
        left: 1vh;
        // width: (180/@vw);
        height: (70 / @vw);
      }

      .win {
        position: absolute;
        top: 4vh;
        left: 3vh;
        width: (80 / @vw);
        height: auto;
        // height: (90/@vw);
      }

      .win.lose {
        top: 5vh;
        left: 0vh;
        width: (135 / @vw);
      }
    }

    .other {
      width: 40%;
      .other_box {
        margin-top: (20 / @vw);
        margin-left: (40 / @vw);
        display: flex;
        align-items: center;
        width: (120 / @vw);
        height: (80 / @vw);
        padding-left: (15 / @vw);
        background-image: linear-gradient(to left, #f2efdc48, #f4d452d2);
        border-radius: (50 / @vw) 0 0 (50 / @vw);
        color: #fff;

        .ohter_portrait {
          width: (65 / @vw);
          height: (65 / @vw);
          background-color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 100%;
          overflow: hidden;
          img {
            width: (60 / @vw);
            height: (60 / @vw);
            border-radius: 100%;
          }
        }
      }

      .other_name {
        text-align: right;
        margin-left: (20 / @vw);
        margin-top: (10 / @vw);
        width: (120 / @vw);
        // text-align: center;
        color: #fff;
        font-size: (14 / @vw);
      }

      .xingxing {
        // margin-left: (10/@vw);
        margin-top: (10 / @vw);
        width: (120 / @vw);
        text-align: right;
        font-size: (20 / @vw);
        color: #000000;

        i {
          display: inline-block;
          font-style: normal;
        }

        .icon-shoucang {
          color: #f8d63a;
          font-size: (20 / @vw);
        }
      }
    }
  }

  .pk_interface2 {
    margin: 0 auto;
    margin-top: (30 / @vw);
    padding: 0 (5 / @vw);
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: (280 / @vw);
    height: (120 / @vw);
    background-color: #562eae95;
    color: #fff;

    .win_lose {
      position: absolute;
      top: (28 / @vw);
      left: (50%);
      margin-left: (-50 / @vw);
      width: (100 / @vw);
      height: (100 / @vw);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #fff;
      text-align: center;
      background-image: linear-gradient(#9182f6 50%, #6e51cc 50%);
      // background-color: #fff;
      border-radius: 100%;

      .circle {
        width: (70 / @vw);
        height: (70 / @vw);
        // background-color: #fff;
        border: 2px solid #fff;
        text-align: center;
        background-image: linear-gradient(#9182f6 50%, #6e51cc 50%);
        border-radius: 100%;
      }
      .lose {
        position: absolute;
        width: (100 / @vw);
        background-color: #fff;
        color: #6e51cc;
        transform: rotate(45deg);
      }
    }

    .mine {
      flex: 5;
      .head_portrait {
        margin: 0 auto;
        width: (50 / @vw);
        height: (50 / @vw);
        img {
          width: (50 / @vw);
          height: (50 / @vw);
          border-radius: 100%;
        }
      }

      .idname {
        margin-top: (10 / @vw);
        text-align: center;
        font-size: (12 / @vw);
      }
    }
    .blood {
      flex: 4.5;
    }

    .other {
      flex: 5;
      .ohter_portrait {
        margin: 0 auto;
        width: (50 / @vw);
        height: (50 / @vw);
        img {
          width: (50 / @vw);
          height: (50 / @vw);
          border-radius: 100%;
        }
      }

      .other_name {
        margin-top: (10 / @vw);
        text-align: center;
        font-size: (12 / @vw);
      }
    }
  }

  .show_answer {
    margin: 0 (20 / @vw);
    margin-top: (20 / @vw);
    height: (100vh - 45vw);
    display: flex;
    justify-content: space-between;
    border-radius: (10 / @vw);
    padding: (10 / @vw) (20 / @vw);
    background-color: rgba(255, 255, 255, 0.183);
    color: #fff;
    font-weight: 500;
    font-size: (14 / @vw);
    overflow: scroll;

    .mine_an {
      flex: 1;
      line-height: (30 / @vw);
      font-size: (18 / @vw);

      div {
        text-align: center;
      }
    }

    .answer {
      flex: 1;
      line-height: (30 / @vw);
    }

    .an {
      text-align: center;
    }

    .other_an {
      text-align: right;
      flex: 1;
      line-height: (30 / @vw);
      font-size: (18 / @vw);
    }
  }

  .click_back {
    display: block;
    width: (150 / @vw);
    height: (50 / @vw);
    border: 0;
    margin: 0 auto;
    margin-top: (15 / @vw);
    font-size: (16 / @vw);
    // background-color: #fdbe3b;
    background-color: #fff;
    border-radius: (50 / @vw);
  }
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

.appearRight {
  -webkit-animation-name: appearRight;
  animation-name: appearRight;
}

.appearLeft {
  -webkit-animation-name: appearLeft;
  animation-name: appearLeft;
}

.disRight {
  animation-name: disRight;
}

.disLeft {
  animation-name: disLeft;
}

.appear {
  animation-delay: 0.8s;
}

//从右滑出的动画
@keyframes appearRight {
  from {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

//从左滑出动画
@keyframes appearLeft {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

//从右滑走的动画
@keyframes disRight {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  80% {
    opacity: 1;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  100% {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
}

//从左滑走动画
@keyframes disLeft {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  80% {
    opacity: 1;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  100% {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}

//缩放动画

@keyframes zoom1 {
  0% {
    -webkit-transform: scale(0.5);
    opacity: 0;
  }
  100% {
    -webkit-transform: scale(1);
    opacity: 1;
  }
}

@keyframes zoom2 {
  0% {
    -webkit-transform: scale(0.5);
    opacity: 0;
  }
  80% {
    -webkit-transform: scale(1.2);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    opacity: 1;
  }
}

.zoom1 {
  animation: zoom1 0.4s linear;
  -webkit-animation: zoom1 0.4s linear;
}

.zoom2 {
  animation: zoom2 0.8s linear;
  -webkit-animation: zoom2 0.8s linear;
}
</style>
