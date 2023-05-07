<template>
  <div class="pk_footer" :style="{ top: topValue }">
    <div class="ranking_list">
      <div class="laiqu" @click="topValue == '70%' ? topValue = '0%' : topValue = '70%'">一</div>
      <div class="title_nav">
        <div class="rank_title">
          <i class="iconfont icon-paihangbang_paiming"></i> 排行榜公示
        </div>
        <div class="rank_pic">
          <!-- <img src=" " alt=" "> -->
        </div>
      </div>
      <div class="mine">
        <div class="com mine_title">
          <p>我的</p>
          <p>成绩</p>
        </div>
        <div class="head_portrait">
          <img :src="userData.user.base64 == '' ? 'src/assets/头像-女学生2.png': userData.user.base64" alt=" " />
        </div>
        <div class="idname">{{ userRankData.user.nickName }}</div>
        <div class="com rank">第 {{ userRankData.userRanking }} 名</div>
        <div class="com score">{{ userRankData.user.stars }} 颗星</div>
      </div>
      <div class="others">
        <div
          class="others_nav"
          v-for="(index, target) in rankTopData.length"
          :key="index"
        >
          <div class="left one">
            <span class="rank">
              <img src="../../assets/PK/金牌.png" v-if="index == 1" />
              <img src="../../assets/PK/银牌.png" v-else-if="index == 2" />
              <img src="../../assets/PK/铜牌.png" v-else-if="index == 3" />
              <i v-else>{{ index }}</i>
            </span>
            <span>{{ rankTopData[target].nickName }}</span>
          </div>
          <div class="right one">{{ rankTopData[target].stars }} 颗星</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入内置函数
import { ref, reactive } from "vue";
//  引入外部数据
import { getRankingList, getUserRank } from "../../request/api/pk";
import {userStore } from "@/stores";
import { pkStore } from "../../stores";

let userData = userStore();// 获取用户数据
let topValue = ref('70%');//排行榜展开高度
let pkData = pkStore();// 获取pk数据

// 拉去排行榜前十信息
let rankTopData = reactive([]);
async function getRankTopData() {
  let rankingList = await getRankingList();
  rankTopData.push(...rankingList.data.msg.data.ranking);
}
// 获取用户排行信息
let userRankData = reactive({
  user: {},
  userRanking: 1,
});
async function getUserRankData() {
  let getUserRankList = await getUserRank();
  userRankData.user = getUserRankList.data.msg.data.userData.user;
  userRankData.userRanking = getUserRankList.data.msg.data.userData.userRanking;
  pkData.stars = userRankData.user.stars;
}
getRankTopData();
getUserRankData();
</script>

<style scoped lang="less">
@vw: 3.95vw;
.pk_footer {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 70%;
  left: 0;
  transition: all 0.3s;
}

.pk_footer_bg {
  width: 100%;
  height: 40vw;
}

.ranking_list {
  z-index: 100;
  width: 100vw;
  height: calc(100vh - 17vw);
  transition: all 0.2s;
  // background-color: #fff;
  // border-radius: 6% 6% 0 0;
  border-radius: (20 / @vw) (20 / @vw) 0 0;
  overflow: scroll;
  background: #fff url("../../assets/PK/排行榜.png") no-repeat;

  .laiqu {
    width: 100%;
    height: (40 / @vw);
    text-align: center;
    background-color: #fff;
    border-radius: 6% 6% 0 0;
  }
  .title_nav {
    display: flex;
    justify-content: space-between;
    padding: 0 (20 / @vw);
    padding-top: (10 / @vw);

    .rank_title {
      font-size: (20 / @vw);

      .icon-paihangbang_paiming {
        font-size: (20 / @vw);
      }
    }
    .rank_pic {
      width: (40 / @vw);
      height: (40 / @vw);
    }
  }

  .mine {
    font-size: (16 / @vw);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 0 auto;
    width: (340 / @vw);
    height: (60 / @vw);
    text-align: center;
    // background-color: red;
    border-radius: 5% 5% 5% 5%;
    box-shadow: (1 / @vw) (2 / @vw) (5 / @vw) (2 / @vw)
      rgba(159, 157, 157, 0.381);

    .com {
      color: #998bce;
      font-weight: 700;
    }

    .head_portrait {
      width: (50 / @vw);
      height: (50 / @vw);
      border-radius: 100%;
      img {
        border-radius: 100%;
      }
    }
  }

  .others {
    margin: 0 auto;
    margin-top: (20 / @vw);
    margin-bottom: (20 / @vw);
    width: (355 / @vw);
    // height: (60/@vw);
    background-color: rgba(255, 255, 255, 0.905);

    box-shadow: (1 / @vw) (2 / @vw) (3 / @vw) (1 / @vw)
      rgba(159, 157, 157, 0.381);

    .others_nav {
      display: flex;
      justify-content: space-between;
      height: (50 / @vw);
      align-items: center;
      padding: 0 (20 / @vw);
      // padding-top: (10/@vw);

      .left {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .rank {
          display: inline-block;
          width: (60 / @vw);

          i {
            display: inline-block;
            width: (60 / @vw);
            // height: (40/@vw);
            // line-height: (40/@vw);
            padding: 0 (8 / @vw);
          }

          img {
            display: inline-block;
            width: (24 / @vw);
            height: (26 / @vw);

            margin-left: (2 / @vw);
            // padding: 0 (8/@vw);
          }

          .tong {
            width: (22 / @vw);
            height: (24 / @vw);
          }
          .ten {
            padding: 0 (3 / @vw);
          }
        }

        .name {
          display: inline-block;
          text-align: right;
          width: (90 / @vw);
        }
      }

      .right {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
