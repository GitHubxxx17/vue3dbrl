<template>
  <div>
    <div class="bgc"></div>
    <div class="select_dif_temp">
      <div class="select_dif">
        <div class="tips">
          <span
            >请选择pk难度：<span
              class="iconfont icon-cuowu"
              v-show="selectData.diffErrorTip"
            ></span
          ></span>
          <span class="iconfont icon-guanbi" @click="closeGame()"></span>
        </div>
        <div class="select_card" ref="select_card">
          <button class="button" :class="{ active: selectData.ifDiff[0] }">
            简单
          </button>
          <button class="button" :class="{ active: selectData.ifDiff[1] }">
            中等
          </button>
          <button class="button" :class="{ active: selectData.ifDiff[2] }">
            困难
          </button>
        </div>
      </div>
      <div class="select_temp">
        <div class="tips">
          <span>请选择pk模板：</span
          ><span
            class="iconfont icon-cuowu"
            v-show="selectData.selectErrorTip"
          ></span>
        </div>
        <ul>
          <li
            class="uploadLis_fadeIn"
            v-for="(index, target) in tpData.tp.length"
            :key="index"
            :class="{ active: selectData.ifSelect[target] }"
            @click="ifClickSelect(target)"
          >
            <SelectTemplate
              :target="target"
              :isSelect="selectData.ifSelect[target]"
            ></SelectTemplate>
          </li>
        </ul>
      </div>
      <div class="determine">
        <button class="queding" @click="startGame()">开始匹配</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入外部组件
import SelectTemplate from "../PK/SelectTemplate.vue";
// 引入内置函数
import { ref, reactive, onMounted } from "vue";
// 引入数据
import { pkStore, tpStore, mainStore, userStore } from "@/stores";
import { treeSelectProps } from "vant";

// 获取模板数据
let tpData = tpStore();
let tp = tpData.tp;
let pkData = pkStore(); // 获取pk数据
let userData = userStore(); // 获取用户数据
let mainData = mainStore(); // 获取主要数据-用于修改底部隐藏
let selectData = reactive({
  diffErrorTip: false,
  selectErrorTip: false,
  ifDiff: [false, false, false],
  ifSelect: new Array(tp.length || 0),
});
let rivalMsg = pkData.rivalMsg; // 对手的信息
let enterPkData = pkData.enterPkData; // 获取进入pk的数据

//选择模板
let ifClickSelect = (target) => {
  for (let index = 0; index < selectData.ifSelect.length; index++) {
    if (index == target) {
      selectData.ifSelect[index] = true;
      pkData.selectedModleId = tp[index].modleId; //记录当前选择的模板id
    } else {
      selectData.ifSelect[index] = false;
    }
  }
  selectData.selectErrorTip = false; //选择模板就不显示错误
};
let select_card = ref(null);
//选择困难程度
let ifClickDiff = (target) => {
  for (let index = 0; index < selectData.ifDiff.length; index++) {
    if (index == target) {
      selectData.ifDiff[index] = true;
    } else {
      selectData.ifDiff[index] = false;
    }
    //记录选择模板的难度
    if (target == 0) {
      pkData.difficult = "easy";
    } else if (target == 1) {
      pkData.difficult = "normal";
    } else {
      pkData.difficult = "hard";
    }
  }
  selectData.diffErrorTip = false; //选择了难度之后就不显示
};

// 初始化数据
let initData = () => {
  for (let index = 0; index < selectData.ifDiff.length; index++) {
    selectData.ifDiff[index] = false;
  }
  for (let index = 0; index < selectData.ifSelect.length; index++) {
    selectData.ifSelect[index] = false;
  }
};

// 不开始游戏
let closeGame = () => {
  pkData.selectIsShow = false; // 关闭选择框
  initData(); // 重置选项
};

//连接WebSocket
function ConnectionWS(params) {
  try {
    pkData.ws = new WebSocket(
      `ws://110.41.21.66:8080/ReciteMemory/PK/userId=${userData.user.token}/${pkData.selectedModleId}/${pkData.difficult}`
    );

    //连接服务器-成功
    pkData.ws.onopen = function (event) {
      console.log("已经与服务器建立了连接当前连接状态：" + this.readyState);
    };

    let msgCount = 0; //接收信息的次数

    pkData.ws.onmessage = function (event) {
      console.log("接收到服务器发送的数据：" + event.data);
      msgCount++; // 记录发送信息的次数
      // 数据传过来
      if (event.data) {
        let res = JSON.parse(event.data).socketMsg.datas;
        console.log(res);

        // 连接成功后发送 START 开始游戏
        // 当其为第一次通信时才发送
        if (res.CONNECTION && msgCount == 1) {
          this.send("START");
          console.log("已经向服务器发送START信号！");
        }

        //当匹配成功后获取双方信息渲染，并且发送 Ready 开始答题
        if (res.MATCH_SUCCESS) {
          // timeCount = res.timeLimits - 3;// 控制时间差
          enterPkData.gameTime = res.timeLimits - 3; // 渲染pk时间
          //刷新信息
          rivalMsg.name = res.enemyInf.nickName; // 获取对手的姓名
          rivalMsg.portrait = `<img src="${
            res.enemyInf.base64 == ""
              ? "src/assets/头像-女学生2.png"
              : res.enemyInf.base64
          }"/>`; // 获取对手的头像
          enterPkData.PkTemplate = res.context; // 获取模板内容

          // 发送准备好的信号
          pkData.ws.send("READY");
          console.log("已经向服务器发送Ready信号！");
        }

        //判断匹配是否成功，成功后渲染挖空内容和答题的答案,当isReady为true即可进入pk界面
        if (res.isReady) {
          setTimeout(() => {
            pkData.resetWaitPK(); // 重置waitPk
            // 1s 之后开始倒计时
            setTimeout(() => {
              pkData.gameTimeRecord = setInterval(() => {
                enterPkData.gameTime--;
              }, 1000);
            }, 1000);
          }, 1500);
          console.log("我已经准备好啦！");
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
}

// 开始游戏
let startGame = () => {
  let count_diff = false; //记录是否选择困难程度
  let count_select = false; //记录是否选择模板
  // 查看是否选择了困难程度
  for (let per of selectData.ifDiff) {
    if (per) {
      count_diff = true;
    }
  }
  if (!count_diff) {
    selectData.diffErrorTip = true; //没有选择困难程度则报错
  }
  // 查看是否选择了模板
  for (let per of selectData.ifSelect) {
    if (per) {
      count_select = true;
    }
  }
  if (!count_select) {
    selectData.selectErrorTip = true; // 没有选择模板则报错
  }
  // 可以开始游戏
  if (count_diff && count_select) {
    pkData.selectIsShow = false; // 关闭选择框
    // 初始化数据
    initData();
    // 重置等待pk页面
    pkData.waitPkData.frameIsAppear = true;
    pkData.waitPkData.isAppear = true;

    pkData.isEnter = true; // 进入等待pk的界面
    mainData.footerNavIsShow = false; // 隐藏底部导航栏
    mainData.isPk = false; //隐藏pk主页面
    // 发起请求
    setTimeout(() => {
      ConnectionWS();
    }, 1000);
  }
};

//挂载完成后的处理
onMounted(() => {
  // 选择pk难度
  let buttons = [...select_card.value.children];
  for (let index = 0; index < buttons.length; index++) {
    buttons[index].addEventListener("click", () => {
      ifClickDiff(index);
    });
  }
});
</script>

<style scoped lang="less">
@vw: 3.95vw;
.bgc {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #5251516f;
  z-index: 1000;
  // z-index: 0;
}

.select_dif_temp {
  padding-top: (10 / @vw);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: (300 / @vw);
  height: (380 / @vw);
  z-index: 10000;
  border-radius: (20 / @vw);
  background-color: #fdfffc;
  // box-shadow:  (1 / @vw)  (2 / @vw) (5/ @vw) (2/ @vw) rgba(159, 157, 157, 0.381);
  .select_dif {
    padding: (10 / @vw) (15 / @vw);

    .tips {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .icon-guanbi {
        color: #d3d5d2;
        font-size: (23 / @vw);
      }

      .icon-cuowu {
        color: red;
      }
    }
  }

  .select_card {
    padding: (15 / @vw) (10 / @vw);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .button {
      display: inline-block;
      text-align: center;
      width: (60 / @vw);
      height: (30 / @vw);
      padding: (5 / @vw) (5 / @vw);
      font-size: (14 / @vw);
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      outline: none;
      color: #fff;
      background-color: #5f4fb8a4;
      border: none;
      border-radius: (15 / @vw);
      box-shadow: 0 (3 / @vw) rgba(153, 153, 153, 0.707);
    }
    .active {
      background-color: #392b84c8;
    }

    .button:active {
      background-color: #5f4fb8c8;
      box-shadow: 0 (3 / @vw) rgba(120, 120, 120, 0.753);
      transform: translateY((3px));
    }
  }

  .select_temp {
    padding: 0 (5 / @vw);

    .tips {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0 (10 / @vw);
      padding-bottom: (10 / @vw);
      span {
        text-align: center;
      }
      .icon-cuowu {
        color: red;
      }
    }

    ul {
      width: 100%;
      height: (175 / @vw);
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-x: hidden;
      overflow-y: scroll;
    }

    li {
      margin-top: (10 / @vw);
      background-color: #f5f4f8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 (5 / @vw);
      padding-left: (10 / @vw);
      border-bottom: (1 / @vw) solid #959595;
      border-radius: (10 / @vw);
    }

    .active {
      border: 1px solid #5f4fb8a4;
    }
  }

  .determine {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: (55 / @vw);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #5f4fb8a4;
    // background-color: #a48ec5;

    border-radius: 0 0 (20 / @vw) (20 / @vw);

    .queding {
      padding: 0 (20 / @vw);
      // width: (100/@vw);
      height: (35 / @vw);
      line-height: (35 / @vw);
      text-align: center;
      font-size: (15 / @vw);
      color: #fff;
      border: 1px solid #fff;
      border-radius: (20 / @vw);
      background-color: #978ed0;
    }

    .queding:hover {
      background-color: #8378cc;
    }

    .queding:active {
      background-color: #8378cc;
      transform: translateY(2.5px);
    }
  }
}
</style>
