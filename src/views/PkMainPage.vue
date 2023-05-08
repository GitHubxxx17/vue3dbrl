<template>
  <div class="pk_page main_page" v-if="mainData.isPk">
    <SelectDiff v-show="pkData.selectIsShow"></SelectDiff>
    <div class="main">
      <div class="header">
        <div class="head_portrait">
          <!-- <img src="@/assets/头像-女学生2.png" alt=" " /> -->
          <img
            :src="
              userData.user.base64 == ''
                ? 'src/assets/头像-女学生2.png'
                : userData.user.base64
            "
          />
        </div>
        <div class="info">
          <div class="com idname">{{ userData.user.nickName }}</div>
          <div class="com integral">
            <i class="iconfont icon-bonus-line"></i>
            <i class="cur">{{ userData.user.points }}</i>
            <i class="fixed"> / 120</i>
          </div>
        </div>
      </div>
      <div class="competition_season">
        <div class="season_title"><i>S1</i> 赛季</div>
        <div class="season_box">
          <div class="rank">
            <div class="season_name" ref="seasonName">初级学士</div>
            <div class="star" ref="star">
              <i class="iconfont icon-shoucang"></i>
              <i class="iconfont icon-shoucang"></i>
              <i class="iconfont icon-shoucang"></i>
              <i class="iconfont icon-shoucang"></i>
              <i class="iconfont icon-shoucang"></i>
            </div>
          </div>
          <div class="role">
            <img :src="seasonRole" class="loading_icon" />
          </div>
          <div class="start_game">
            <button id="start_game" @click="pkData.selectIsShow = true">
              开始匹配
            </button>
          </div>
        </div>
      </div>
      <div class="pk_footer_bg"></div>
      <RankingList></RankingList>
    </div>
  </div>
  <WaitPK v-if="pkData.isEnter"></WaitPK>
  <EnterPK v-if="pkData.entered"></EnterPK>
  <EndPK v-if="pkData.isEnd"></EndPK>
</template>

<script scope setup>
// 引入外部组件
import RankingList from "@/components/PK/RankingList.vue";
import SelectDiff from "@/components/PK/SelectDiff.vue";
import WaitPK from "../components/PK/WaitPK.vue";
import EnterPK from "../components/PK/EnterPK.vue";
import EndPK from "../components/PK/EndPK.vue";
// 引入内置函数
import { ref, onMounted, watch } from "vue";
// 引入数据
import { pkStore, userStore, mainStore } from "@/stores";

let pkData = pkStore(); // 获取pk数据
let userData = userStore(); // 获取用户数据
let mainData = mainStore();

let seasonRole = ref("src/assets/level/1.png"); // 获取段位图片路径
let seasonName = ref(null); // 获取段位名称对象
let star = ref(null); // 获取星星对象

if (mainData.isPk) {
  pkData.selectIsShow = false;
}

// 段位渲染
function season() {
  switch (Math.floor(pkData.stars / 5)) {
    case 0:
      seasonName.value.innerHTML = "初级学士";
      seasonRole.value = "src/assets/level/1.png";
      break;
    case 1:
      seasonName.value.innerHTML = "中级学士";
      seasonRole.value = "src/assets/level/2.png";
      break;
    case 2:
      seasonName.value.innerHTML = "高级学士";
      seasonRole.value = "src/assets/level/3.png";
      break;
    case 3:
      seasonName.value.innerHTML = "初级硕士";
      seasonRole.value = "src/assets/level/4.png";
      break;
    case 4:
      seasonName.value.innerHTML = "高级硕士";
      seasonRole.value = "src/assets/level/5.png";
      break;
    case 5:
      seasonName.value.innerHTML = "博士";
      seasonRole.value = "src/assets/level/6.png";
      break;
    default:
      seasonName.value.innerHTML = "博士";
      seasonRole.value = "src/assets/level/1.png";
      break;
  }
  let starNum = pkData.stars >= 30 ? 5 : pkData.stars % 5;
  for (let i = 0; i < starNum; i++) {
    star.value.children[i].classList.add("active");
  }
}
watch(
  () => pkData.stars,
  () => {
    console.log("pkData.stars改变了");
    season();
  }
);

onMounted(() => {
  season();
});
// 渲染自己的排行
</script>

<style scoped lang="less">
@vw: 3.95vw;
body {
  background-color: #f4f4f4;
}

.pk_page {
  background-color: #f4f4f4;
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: scroll;

  .main {
    font-size: (16 / @vw);
    position: relative;
    width: 100%;
    // height: (700 / @vw);
    // overflow: hidden;

    .header {
      background-color: #a89cd4;
      display: flex;
      justify-content: flex-start;
      padding-left: (20 / @vw);
      padding-top: (20 / @vw);
      padding-bottom: (20 / @vw);
      width: 100%;
      height: (100 / @vw);

      .head_portrait {
        width: (60 / @vw);
        height: (60 / @vw);
        border-radius: 100%;

        img {
          border-radius: 100%;
        }
      }
      .info {
        .com {
          margin-left: (15 / @vw);
          margin-top: (10 / @vw);
        }
        .name {
          margin-bottom: (-5 / @vw);
          color: #fff;
        }
        .integral {
          background-color: rgba(232, 229, 229, 0.357);
          text-align: center;
          padding: 0 (5 / @vw);
          i {
            font-size: (20 / @vw);
            font-style: normal;
          }
          .icon-bonus-line {
            color: #fdb717;
            font-size: (20 / @vw);
          }

          .cur {
            color: #000;
            opacity: 1;
            font-size: (18 / @vw);
          }

          .fixed {
            color: #000;
            opacity: 1;
            font-size: (12 / @vw);
          }
        }
      }
    }

    .competition_season {
      z-index: 1000;
      margin: 0 auto;
      width: (320 / @vw);
      // height:(322/@vw);
      margin-top: (30 / @vw);
      border-radius: 5%;
      // background-color: rgba(152, 116, 180, 0.798);
      background-color: #4d24ac8e;
      box-shadow: (1 / @vw) (2 / @vw) (5 / @vw) (2 / @vw)
        rgba(159, 157, 157, 0.381);

      .season_title {
        padding: (8 / @vw) (18 / @vw);
        width: (300 / @vw);
        font-size: (20 / @vw);
        i {
          font-size: (35 / @vw);
        }
      }
      .season_box {
        margin-left: (-2 / @vw);
        margin-bottom: (25 / @vw);
        width: (324 / @vw);
        // height:(260/@vw);
        border-radius: 5%;
        background-color: #fff;
        border: 3px solid #b5a9e1;
        // border: 3px solid #bba1f3;

        .rank {
          margin: 0 auto;
          margin-top: (15 / @vw);
          width: (150 / @vw);
          text-align: center;
          .season_name {
            font-size: (20 / @vw);
          }
          i {
            font-style: normal;
          }
          .icon-shoucang {
            color: rgb(161, 161, 161);
          }
          .active {
            color: #fdb717;
          }
        }

        .role {
          margin: 0 auto;
          margin-top: (15 / @vw);
          width: (105 / @vw);
          // height: (105/@vw);
          img {
            width: 100%;
            height: 100%;
          }
        }

        .start_game {
          margin: 0 auto;
          margin-top: (20 / @vw);
          margin-bottom: (20 / @vw);
          width: (180 / @vw);

          button {
            display: inline-block;
            width: 100%;
            height: (45 / @vw);
            font-size: (20 / @vw);
            text-align: center;
            border: 0;
            background-color: #ffd161;
          }
        }
      }
    }
  }

  .one {
    margin-top: (10 / @vw);
  }
}
</style>
