<template>
  <div
    class="enterPk animated"
    :class="{ appear: enterPkData.isAppear, disappear: !enterPkData.isAppear }"
  >
    <div class="head_nav_pk">
      <span class="back iconfont icon-xiangzuojiantou" @click="closePK()">
      </span>
      <span>对战</span>
    </div>
    <div class="pk_blood">
      <div
        class="mine animated"
        :class="{
          appearLeft: enterPkData.isAppear,
          disLeft: !enterPkData.isAppear,
        }"
      >
        <div class="blook_change_out mine_blood_change">
          <div class="blook_change_in mine_blood_change" ref="myHP"></div>
        </div>
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
        <div class="name_blood">
          <div class="idname">{{ userData.user.nickName }}</div>
          <div class="blook mine_blook">{{ myBlood }}</div>
        </div>
      </div>
      <div class="time">
        <div class="outercir1">
          <div class="outercir2">
            <div class="outercir3">
              <div class="innercir">{{ enterPkData.gameTime }}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="runle"
        v-if="isHasRun"
        :class="{
          appearRight: enterPkData.isAppear,
          disRight: !enterPkData.isAppear,
        }"
      >
        对手已逃跑
      </div>

      <div
        class="other animated"
        :class="{
          appearRight: enterPkData.isAppear,
          disRight: !enterPkData.isAppear,
        }"
      >
        <div class="blook_change_out other_blood_change">
          <div class="blook_change_in other_blood_change" ref="otherHP"></div>
        </div>
        <div class="name_blood">
          <div class="idname other_name" v-show="!isHasRun">
            {{ rivalMsg.name }}
          </div>
          <div class="blook other_blook" v-show="!isHasRun">
            {{ otherBlood }}
          </div>
        </div>
        <div class="head_portrait" ref="otherPortrait">
          <img src="../../assets/头像/连接断开.png" alt=" " />
        </div>
      </div>
    </div>
    <div class="text_box" ref="PkTemplate"></div>
    <div class="option" ref="option">
      <div class="com" v-for="(k, i) in 4" :key="k" @click="selcetDeal(i)">
        <span class="en" v-if="i == 0">A</span>
        <span class="en" v-else-if="i == 1">B</span>
        <span class="en" v-else-if="i == 2">C</span>
        <span class="en" v-else>D</span>
        <span class="answer">{{ enterPkData.fourOption[i] }}</span>
      </div>
    </div>
  </div>
</template>

<script scoped setup>
// 引入内置函数
import { ref, onMounted, reactive } from "vue";
// 引入数据
import { pkStore, userStore, mainStore } from "@/stores";

// 声明方法
let selcetDeal;

let mainData = mainStore(); // 主要数据
let pkData = pkStore(); // 获取pk数据
let userData = userStore(); // 获取用户数据
let enterPkData = pkData.enterPkData; // 获取进入pk的数据
let endPkData = pkData.endPkData;
let rivalMsg = pkData.rivalMsg; // 获取对手信息

let PkTemplate = ref(null); //获取放pk模板的对象
let option = ref(null); // 获取选项对象
let otherPortrait = ref(null); // 获取对头头像对象
let myHP = ref(null); // 获取己方血条
let otherHP = ref(null); // 获取对方血条

// 渲染血量
let myBlood = ref("100%");
let otherBlood = ref("100%");
let isHasRun = ref(false); // 判断是否逃跑

// 进入endPK
let endPKGame = () => {
  endPkData.isAppear = true;
  pkData.isEnd = true;
  pkData.entered = false;
  enterPkData.isAppear = false;
  pkData.isEnter = false;
};

// 渲染最终答案
function reflashEndAnw() {
  // 渲染答案
  for (let x of enterPkData.endAnswerArr) {
    endPkData.answer += `<div class="an">${x}</div>`;
  }

  //渲染当前用户的答案对错
  for (let i = 0; i < enterPkData.UserSelectArr.length; i++) {
    if (enterPkData.UserSelectArr[i] == "right") {
      endPkData.myAnswer += `<div class="dui">√</div>`;
    } else {
      endPkData.myAnswer += `<div class="cuo">×</div>`;
    }
  }
  // 没有答的话渲染问号
  if (enterPkData.UserSelectArr.length < enterPkData.endAnswerArr.length) {
    for (
      let j = 0;
      j < enterPkData.endAnswerArr.length - enterPkData.UserSelectArr.length;
      j++
    ) {
      endPkData.myAnswer += `<div class="cuo">?</div>`;
    }
  }
}

// 退出pk界面
function closePK() {
  if (isHasRun.value) {
    console.log("我也跑了");
    // 如果有人跑了并且自己后跑则
    enterPkData.isAppear = false;
    // 渲染最终答案
    reflashEndAnw();
    setTimeout(() => {
      endPKGame();
      pkData.ws = null;
    }, 1000);
  } else {
    console.log("我没有跑");
    pkData.closeWS();
    enterPkData.isAppear = false;
    setTimeout(() => {
      pkData.entered = false;
      mainData.footerNavIsShow = true;
      mainData.isPk = true;
      pkData.resetRivalMsg();
    }, 1000);
  }
}

// 挂载完成后的处理
let highlightTop; // 记录滚动条高度
onMounted(() => {
  //初始化血条
  myHP.value.style.width = 38.13 + "vw";
  let pkChildren = reactive([]);
  // 刷新模板
  function reflashTemp() {
    enterPkData.answerIndex = 0;
    PkTemplate.value.innerHTML = enterPkData.PkTemplate; // 填pk模板
    otherPortrait.value.innerHTML = rivalMsg.portrait;
    // 置空下列数组
    enterPkData.answerArr = [];
    enterPkData.selectArr = [];
    pkChildren = [];
    // 让模板变为背诵模式
    for (let x of PkTemplate.value.children) {
      if (x.tagName == "DIV") {
        // 判断是否包裹着div标签
        pkChildren.push(x);
        x.classList.add("highlight");
        x.classList.add("recite");
        // 获取答案
        enterPkData.answerArr.push(x.innerHTML);
        enterPkData.endAnswerArr.push(x.innerHTML); // 最终渲染的答案
        enterPkData.selectArr.push(x.innerHTML);
        x.innerHTML = "选择";
      }
    }
    // 加载时就要预先放四个选项
    enterPkData.fourOption.push(enterPkData.answerArr[enterPkData.answerIndex]); //将正确答案放进去
    enterPkData.fourOption = ShuffleOption(
      enterPkData.selectArr,
      enterPkData.fourOption
    ); // 随机填好四个选项
    // 获取当前选择的选项的offsetTop
    highlightTop = pkChildren[enterPkData.answerIndex].offsetTop;
    PkTemplate.value.scrollTo({
      top: highlightTop - 400,
      behavior: "smooth",
    });
  }
  reflashTemp();

  // 随机排列数组
  function sortArr(arr) {
    arr.sort(function () {
      return 0.5 - Math.random();
    });
    return arr.slice(0, 4);
  }

  // 打乱选项
  function ShuffleOption(selectArr, fourOption) {
    while (fourOption.length < 4) {
      // 填四个选项进去
      let randomIndex = Math.round(Math.random() * selectArr.length);
      let target = selectArr[randomIndex];
      // 随机抽取的不是正确答案并且不重复则添加进数据
      if (target != fourOption[0] && fourOption.indexOf(target) == -1) {
        fourOption.push(target);
      }
    }
    return sortArr(fourOption); // 再打乱一下
  }

  //选择答案后
  function updateOption() {
    enterPkData.answerIndex++; // 选择下一个答案
    enterPkData.fourOption = []; // 清空四个选项
    enterPkData.fourOption.push(enterPkData.answerArr[enterPkData.answerIndex]); //将正确答案放进去
    enterPkData.fourOption = ShuffleOption(
      enterPkData.selectArr,
      enterPkData.fourOption
    ); // 随机填好四个选项

    // 获取当前选择的选项的offsetTop
    highlightTop = pkChildren[enterPkData.answerIndex].offsetTop;
    PkTemplate.value.scrollTo({
      top: highlightTop - 400,
      behavior: "smooth",
    });
  }

  // 选项的处理
  selcetDeal = function (index) {
    //题还没有做完时
    if (enterPkData.answerIndex < enterPkData.answerArr.length) {
      // 对比答案是否正确
      if (
        option.value.children[index].children[1].innerHTML ==
        enterPkData.answerArr[enterPkData.answerIndex]
      ) {
        pkChildren[enterPkData.answerIndex].classList.add("right"); // 当前答案正确的话 标绿
        pkChildren[enterPkData.answerIndex].innerHTML =
          enterPkData.answerArr[enterPkData.answerIndex];

        enterPkData.UserSelectArr.push("right"); // 存放当前选择的答案
        pkData.ws.send(
          JSON.stringify({
            answerName: option.value.children[index].children[1].innerHTML,
            answerValue: true,
          })
        );
      } else {
        pkChildren[enterPkData.answerIndex].classList.add("wrong"); // 当前答案不正确的话 标红
        pkChildren[enterPkData.answerIndex].innerHTML =
          enterPkData.answerArr[enterPkData.answerIndex];
        option.value.children[index].classList.add("shake"); // 抖动效果
        enterPkData.UserSelectArr.push("wrong");
        pkData.ws.send(
          JSON.stringify({
            answerName: option.value.children[index].children[1].innerHTML,
            answerValue: false,
          })
        );
      }
      //如果不是最后一个答案的话
      if (enterPkData.answerIndex < enterPkData.answerArr.length - 1) {
        updateOption(); // 更新选项
      } else {
        //如果是最后一个答案的话
        //再次刷新题目
        pkData.ws.send("AGAIN");
        console.log("发送再次刷新模板请求！");
      }
    }
  };

  // WebSocket逻辑
  let isEnd = false; // 是否结束游戏了
  try {
    pkData.ws.onmessage = function (event) {
      console.log("接收到服务器发送的数据：" + event.data);
      // 数据传过来
      if (event.data) {
        let res = JSON.parse(event.data).socketMsg.datas;
        console.log(res);
        //刷新血条
        if (res.hpInf) {
          let hpMsg = res.hpInf;
          let hp = Math.round(hpMsg[0].hp);
          if (hpMsg[0].userId == userData.user.token) {
            console.log(hpMsg);
            myHP.value.style.width = (hp / 100) * 38.13 + "vw";
            myBlood.value = hp + "%";
          } else {
            otherHP.value.style.width = (hp / 100) * 38.13 + "vw";
            otherBlood.value = hp + "%";
          }
          hp = Math.round(hpMsg[1].hp);
          if (hpMsg[1].userId == userData.user.token) {
            myHP.value.style.width = (hp / 100) * 38.13 + "vw";
            myBlood.value = hp + "%";
          } else {
            otherHP.value.style.width = (hp / 100) * 38.13 + "vw";
            otherBlood.value = hp + "%";
          }
        }

        //发送AGAIN之后再刷新模板
        if (res.OPERATE) {
          //刷新模板
          setTimeout(() => {
            enterPkData.PkTemplate = res.digedContent;
            reflashTemp();
          }, 1000);
        }

        if (enterPkData.gameTime <= 0) {
          console.log("结束游戏");
          clearInterval(pkData.gameTimeRecord);
          // 结束游戏
          // pkData.ws.send("plzEndThisFKGame");
        }

        //对方已经逃跑
        if (res.ENEMY_EXIT) {
          console.log(" 对方已跑");
          otherHP.value.style.width = "0";
          setTimeout(() => {
            isHasRun.value = true;
            otherPortrait.value.innerHTML = `<img scr= "../../assets/头像/连接断开.png"/>`;
          }, 700);
          if (userData.user.token != res.runId) {
            endPkData.winnerId = userData.user.token;
            console.log(endPkData.winnerId);
          }
        }

        //比赛结束之后
        if (res.MATCH_END) {
          clearInterval(pkData.gameTimeRecord);
          // 渲染最终答案
          reflashEndAnw();
          isEnd = true;
        }

        if (res.CONNECTION && isEnd) {
          endPkData.winnerId = res.winnerId;
          // 进入pk结束页面
          endPKGame();
        }
      }
    };

    // 连接服务器-失败
    pkData.ws.onerror = function () {
      console.log("WebSocket异常！连接失败！");
    };
  } catch (ex) {
    alert(ex.message);
  }
});
</script>

<style lang="less">
@vw: 3.75vw;
.enterPk {
  width: 100%;
  height: 100vh;
  z-index: 10000;
  position: absolute;
  top: 0;
  // left: 100%;
  // background-color: rgb(155, 159, 243);
  background-color: #bba5dd;
  transition: all 0.2s;
  // height: (667/@vw);
  // overflow: hidden;

  .exit_pop_up {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -(50 / @vw);
    margin-left: -(100 / @vw);
    width: (200 / @vw);
    height: (100 / @vw);
    background-color: red;
    z-index: 1000;
  }
  .head_nav_pk {
    margin-top: (20 / @vw);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    //background-color: rgb(155, 159, 243);
    span {
      font-size: (16 / @vw);
      color: #fff;
      margin-left: (15 / @vw);
    }
    .icon-xiangzuojiantou {
      font-weight: 700;
    }
  }
  .pk_blood {
    // background-color: red;
    margin: 0 auto;
    margin-top: (10 / @vw);
    display: flex;
    align-items: center;
    padding: (15 / @vw) 0;
    width: (350 / @vw);
    height: (80 / @vw);
    position: relative;

    .other,
    .mine {
      width: (150 / @vw);
      height: (55 / @vw);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;
      background-color: #90909078;
      border-radius: (10 / @vw);

      .blook_change_out {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: (143 / @vw);
        height: (55 / @vw);
        border-radius: (10 / @vw);
        background-color: rgba(95, 95, 249, 0.346);
        transition: all 1.4s ease-in-out;
        .blook_change_in {
          background-color: rgb(95, 95, 249);
          width: (143 / @vw);
          height: (55 / @vw);
          border-radius: (10 / @vw);
          transition: all 0.7s ease-in-out;
        }
      }

      .head_portrait {
        z-index: 100;
        width: (50 / @vw);
        height: (50 / @vw);
        padding: (3 / @vw);
        margin-left: (5 / @vw);
        background-color: #fff;
        border-radius: 100%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }

      .name_blood {
        z-index: 100;
        color: #fff;
        font-size: (15 / @vw);
        .idname {
          font-size: (10 / @vw);
        }
        .blook {
          text-align: center;
        }
      }
    }

    .other {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background-color: #90909078;

      .blook_change {
        position: absolute;
        display: flex;
        align-items: center;
        width: (143 / @vw);
        height: (55 / @vw);
        border-radius: (10 / @vw);
        background-color: rgb(253, 99, 99);
      }

      .blook_change_out {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: (143 / @vw);
        height: (55 / @vw);
        border-radius: (10 / @vw);
        background-color: rgba(253, 99, 99, 0.334);
        transition: all 1.4s ease-in-out;

        .blook_change_in {
          background-color: rgb(253, 99, 99);
          width: (143 / @vw);
          height: (55 / @vw);
          border-radius: (10 / @vw);
          transition: all 0.7s ease-in-out;
        }
      }

      .head_portrait {
        margin-right: (5 / @vw);
      }
    }

    .time {
      width: (70 / @vw);
      height: (70 / @vw);
      // background-color: rgb(155, 159, 243);
      background-color: #bba5dd;
      z-index: 100;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .outercir1 {
        width: (60 / @vw);
        height: (60 / @vw);
        border-radius: 100%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;

        .outercir2 {
          width: (55 / @vw);
          height: (55 / @vw);
          display: flex;
          background: conic-gradient(rgb(255, 149, 0) 100%, #fff 0%);

          // background-color: rgb(255, 149, 0);
          border-radius: 100%;
          align-items: center;
          justify-content: center;

          .outercir3 {
            width: (40 / @vw);
            height: (40 / @vw);
            background-color: #fff;
            border-radius: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .innercir {
          width: (35 / @vw);
          height: (35 / @vw);
          background-color: rgb(155, 159, 243);
          text-align: center;
          border-radius: 100%;
          line-height: (35 / @vw);
          color: #fff;
          font-size: (16 / @vw);
        }
      }
    }

    .runle {
      z-index: 1000;
      width: (100 / @vw);
      height: (25 / @vw);
      position: absolute;
      top: -(12 / @vw);
      right: 0;
      text-align: end;
      line-height: (25 / @vw);
      font-size: (14 / @vw);
    }
  }

  .text_box {
    margin: (10 / @vw) auto;
    width: (350 / @vw);
    height: 45vh;
    background-color: #fff;
    padding: (10 / @vw);
    overflow: scroll;
    font-size: (18 / @vw);
    line-height: (35 / @vw);
    // text-indent: 2em;
    letter-spacing: 0.15em;
    border-radius: (5 / @vw);
    box-shadow: (2 / @vw) (2 / @vw) (10 / @vw) rgba(0, 0, 0, 0.349);
    user-select: none;
    transition: all 0.3s;

    .highlight {
      display: inline;
      background: rgb(248, 207, 4);
      // transition: all .3s;

      &::selection {
        background: rgb(234, 255, 2) !important;
      }
    }

    .input {
      width: auto;
      background-color: transparent !important;
      color: rgba(188, 56, 244, 0.861) !important;
      border-bottom: (2 / @vw) rgb(0, 0, 0) solid;
      height: (30 / @vw);
      outline: none;
      display: inline;
      // -webkit-user-modify: read-write-plaintext-only;
    }

    .recite {
      height: (35 / @vw);
      background-color: rgb(248, 207, 4) !important;
      color: rgb(248, 207, 4) !important;
      border-radius: (5 / @vw);
      user-select: none;
      padding: 0 (5 / @vw);
    }

    .right {
      color: #000 !important;
      background-color: rgb(58, 255, 81) !important;
    }

    .wrong {
      color: #000 !important;
      background-color: rgb(255, 0, 0) !important;
    }
  }

  .option {
    margin: (8 / @vw) auto;
    width: (350 / @vw);
    background-color: #fff;
    padding: 0 (30 / @vw);
    overflow: scroll;
    font-size: (15 / @vw);
    line-height: (20 / @vw);
    // text-indent: 2em;
    letter-spacing: 0.15em;
    border-radius: (5 / @vw);
    box-shadow: (2 / @vw) (2 / @vw) (10 / @vw) rgba(0, 0, 0, 0.349);

    .com {
      margin: (20 / @vw) 0;
      width: (250 / @vw);
      height: (25 / @vw);
      line-height: (25 / @vw);
      // background-color: red;
      .en {
        display: inline-block;
        width: (30 / @vw);
        height: (30 / @vw);
        background-color: rgb(196, 178, 251);
        border-radius: 100%;
        line-height: (30 / @vw);
        text-align: center;
      }

      .answer {
        margin-left: (10 / @vw);
      }
    }
  }
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
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
</style>
