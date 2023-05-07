<template>
  <div class="removeRecite">
    <header>
      <div class="headBox">
        <div class="back" @click="periodData.removeReciteisShow = false">
          <span class="iconfont icon-xiangzuojiantou"></span>
        </div>
        <div class="title">待复习列表</div>
        <div class="zhanwei"></div>
      </div>
      <div class="reciteCon">
        <ul>
          <li v-for="tp in tpList" :key="tp">
            <span class="title">{{tp.modleTitle}}</span>
            <span class="goReview" @click="delReview(tp)">移除</span>
          </li>
        </ul>
      </div>
    </header>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { periodStore } from "@/stores";
import { RemoveFromPlan } from "@/request/api/memory.js";
const periodData = periodStore();
const props = defineProps(["ModlesOfPeriod"]);
let tpList = reactive(
  props.ModlesOfPeriod.reduce(function (prev, cur) {
    return prev.concat(cur);
  }, [])//将二维数组扁平化成一维数组
);
const delReview = async(tp) => {
  let res = await RemoveFromPlan(tp.modleId);
  console.log(res);
  
}
</script>

<style scoped lang="less">
@vw: 3.95vw;

.removeRecite {
  width: 100vw;
  height: 100vh;
  background-color: #f6f7fb;
  overflow: hidden;
}
.headBox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: (10 / @vw) (10 / @vw);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: (50 / @vw);
  background-color: #fff;

  .back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: (40 / @vw);
    height: 100%;
  }

  .title {
    margin-left: -(15 / @vw);
  }
}

.reciteCon {
  margin-top: (65 / @vw);
  padding: 0 (20 / @vw);
  width: 100%;
  height: 100vh;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  ul {
    li {
      margin-bottom: (15 / @vw);
      padding: (10 / @vw) (15 / @vw);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: (15 / @vw);
      height: (45 / @vw);
      background-color: #fff;
      border-radius: (8 / @vw);
      transition: all 0.3s;

      .title {
        width: (250 / @vw);
      }

      .modleId {
        display: none;
      }

      .goReview {
        background-color: #6c60aeb1;
        padding: (5 / @vw) (10 / @vw);
        font-size: (13 / @vw);
        color: #fff;
        border-radius: (10 / @vw);
        background: linear-gradient(to right, #7167abd6 55%, #957abd);
      }
    }
  }
}

.review_del {
  animation: review_del 0.6s forwards;
}

@keyframes review_del {
  0% {
    height: (45 / @vw);
    opacity: 1;
    margin-bottom: (15 / @vw);
    padding: (10 / @vw) (15 / @vw);
  }
  50% {
    opacity: 0;
  }
  100% {
    height: 0;
    opacity: 0;
    margin-bottom: 0;
    padding: 0 (15 / @vw);
  }
}
</style>
