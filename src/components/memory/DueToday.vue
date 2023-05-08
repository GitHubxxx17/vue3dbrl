<template>
  <div class="dueToday">
    <div class="bgc"></div>
    <div class="plan_box">
      <div class="record_box">
        <div class="box">
          <div class="com time">
            <div class="com_title">
              <i class="iconfont icon-shijian"></i> 学习时长
            </div>
            <div class="data">
              <span class="cur_data">{{ periodData.studyTime }}</span
              ><span>分钟</span>
            </div>
          </div>
          <div class="splitLine"></div>
          <div class="com page">
            <div class="com_title">
              <i class="iconfont icon-tongji1"></i> 学习篇数
            </div>
            <div class="data">
              <span class="cur_data">{{ periodData.studyNums }}</span
              ><span>篇</span>
            </div>
          </div>
        </div>
      </div>
      <div class="review_list" @click="periodData.removeReciteisShow = true">
        <span>待复习列表</span>
        <span class="numOfArticles">{{ periodData.numOfArticles }}篇</span>
      </div>
      <div class="review_container">
        <div class="today_review">
          <div class="tr_top">
            <h3>
              今日复习任务&nbsp;
              <span class="cur">{{ periodData.reviewNums }}</span
              ><span>/</span
              ><span class="sum">{{
                periodData.reviewNums + periodData.numOfArticles
              }}</span>
            </h3>
            <div class="rule">
              <span class="iconfont icon-zhuyi"></span> 查看生成规则
            </div>
          </div>
          <div class="tr_bottom">
            <div class="review_line" ref="review_line">
              <div class="now_line"></div>
            </div>
            <span
              class="icon iconfont icon-xianshi_xuanze"
              :class="{
                finish:
                  periodData.numOfArticles == 0 && periodData.reviewNums != 0,
              }"
            ></span>
          </div>
        </div>
        <div
          class="review_cycle"
          v-for="(p, i) in state.ModlesOfPeriod"
          :key="p"
        >
          <ReviewCycleVue
            v-if="p.length != 0"
            :tp="p"
            :index="i"
            @getCurTp="getCurTp"
          ></ReviewCycleVue>
        </div>
      </div>
    </div>
  </div>
  <van-popup
    :show="periodData.removeReciteisShow"
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <RemoveRecite :ModlesOfPeriod="state.ModlesOfPeriod"></RemoveRecite>
  </van-popup>
</template>

<script setup>
import ReviewCycleVue from "./ReviewCycle.vue";
import RemoveRecite from "./removeRecite.vue";
import { GetPeriodModle, getstudyData } from "@/request/api/memory.js";
import { reactive, computed, onMounted, ref, onUpdated } from "vue";
import { periodStore,tpStore,learnStore } from "@/stores";

const periodData = periodStore();
const learnData = learnStore();
const tpData = tpStore();
let review_line = ref(null);
const state = reactive({
  ModlesOfPeriod: [], //复习周期
});
//获取当前模板
let getCurTp = (tp) => {
  tpData.curTp = reactive(tp);
  learnData.LearningPageIsShow = true;
  learnData.isReview = true;
}

//获取复习周期
async function GetPeriod() {
  let res = await GetPeriodModle();
  console.log(res.data.msg);
  if (res.data.msg.code) {
    state.ModlesOfPeriod = res.data.msg.data.ModlesOfPeriod;
  }
}

//获取学习时长和学习篇数
async function getStoreDSSD() {
  let res = await getstudyData();
  console.log(res.data.msg);
  if (res.data.msg.data.getSuccess) {
    periodData.studyTime = res.data.msg.data.studyData.studyTime;
    periodData.studyNums = res.data.msg.data.studyData.studyNums;
    periodData.reviewNums = res.data.msg.data.studyData.reviewNums;
  }
}
onMounted(async() => {
  await GetPeriod();
  await getStoreDSSD();
  await changeStore()

});

//渲染页面
const changeStore = async() => {
  //计算当前的篇数
  periodData.numOfArticles = state.ModlesOfPeriod.reduce((pre, cur) => {
    return pre + cur.length;
  }, 0);
  //渲染进度条
  review_line.value.children[0].style.width =
    (periodData.reviewNums /
      (periodData.reviewNums + periodData.numOfArticles)) *
      review_line.value.offsetWidth +
    "px";
}

onUpdated(() => {
  //渲染进度条
  review_line.value.children[0].style.width =
    (periodData.reviewNums /
      (periodData.reviewNums + periodData.numOfArticles)) *
      review_line.value.offsetWidth +
    "px";
});

</script>

<style scoped lang="less">
@vw: 3.95vw;
.dueToday {
  width: 100vw;
  height: calc(100vh - 24.8vw - 17.7vw);
  background-color: #f6f7fb;
  transition: all 0.3s;

  .bgc {
    width: auto;
    height: (10 / @vw);
  }

  .record_box {
    margin-bottom: (20 / @vw);
    padding: (0 / @vw) (15 / @vw);
    width: 100%;
    border-radius: 5%;

    .box {
      // padding: (5/@vw) 0;
      padding-top: (5 / @vw);
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1.5px solid #e2e2e2;
      border-radius: (10 / @vw);

      .splitLine {
        width: (1 / @vw);
        height: (60 / @vw);
        background-color: #e2e2e2;
      }

      .com {
        width: 45%;
        height: (80 / @vw);
        text-align: center;

        .com_title {
          line-height: (40 / @vw);
          font-size: (16 / @vw);
        }

        .data {
          font-size: (20 / @vw);
          color: #8076b5;

          span {
            font-size: (15 / @vw);
          }

          .cur_data {
            font-weight: 700;
            font-size: (20 / @vw);
            margin-right: (5 / @vw);
          }
        }
      }

      .time {
        background: url(@/assets/images/云1.png) no-repeat;
        background-position: bottom left;
        background-position: (50 / @vw) (41 / @vw);
        background-size: (100 / @vw) (40 / @vw);

        .icon-shijian {
          font-size: (20 / @vw);
          color: rgba(233, 155, 20, 0.806);
          font-weight: 700;
        }
      }

      .page {
        background: url(@/assets/images/云1.png) no-repeat;

        .icon-tongji1 {
          font-size: (19 / @vw);
          color: rgba(233, 155, 20, 0.797);
        }
      }
    }
  }

  .plan_footer {
    width: 100%;
    height: (30 / @vw);
  }

  .plan_box {
    overflow: hidden;
    padding-top: (15 / @vw);
    background-color: #fff;
    height: 100%;
    width: 100%;
    overflow: scroll;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .review_list {
    margin: 0 auto;
    padding-top: (10 / @vw);
    height: 7%;
    width: (350 / @vw);
    // background-color: #fff;
    padding: 0 (20 / @vw);
    border-radius: (5 / @vw);
    border: 1px solid #d7d7d7b4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: (14 / @vw);

    .numOfArticles {
      color: #5f4fb8;
      font-size: (18 / @vw);
    }
  }

  .review_container {
    margin: (10 / @vw) (15 / @vw);
    width: (365 / @vw);
    padding: 0 (20 / @vw);

    .today_review {
      width: 100%;
      height: (85 / @vw);

      .tr_top {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: (10 / @vw);
        height: (50 / @vw);

        h3 {
          font-weight: 545;
          font-size: (18 / @vw);

          span {
            font-weight: 600;
            font-size: (20 / @vw);
          }
        }

        .rule {
          font-size: (14 / @vw);
          color: #acacac;

          .icon-zhuyi {
            font-size: (12 / @vw);
          }
        }
      }

      .tr_bottom {
        width: 100%;
        height: (35 / @vw);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .review_line {
          height: (6 / @vw);
          width: (290 / @vw);
          border-radius: (10 / @vw);
          background-color: #dbd4f7aa;

          .now_line {
            width: 0;
            height: 100%;
            background-color: #5f4fb8;
            border-radius: (10 / @vw);
          }
        }

        span {
          border-radius: 100%;
          background-color: #e5e4e9;
          color: #fff;
          font-size: (25 / @vw);
        }

        .finish {
          background-color: #5f4fb8;
        }
      }
    }

    .review_cycle {
      margin-top: (20 / @vw);
      width: 100%;
      // background-color: #aba3ca;
    }
  }
}
</style>
