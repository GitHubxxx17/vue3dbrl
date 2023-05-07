<template>
  <div class="cycle">
    <div class="cycle_title">
      <span>复 习 周 期 {{digitChange(index)}}</span>
    </div>
    <ul>
      <li v-for="t in tp" :key="t">
        <span class="title">{{t.modleTitle}}</span>
        <span class="goReview" @click="goReview(t)">去复习</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {tpStore} from "@/stores"
const tpData = tpStore();
const props = defineProps(["tp","index"]);
const emit = defineEmits(["getCurTp"])//获取父组件传来的方法
let goReview = (t) => {
  
    for(let tp of tpData.tp){
      if(tp.modleId == t.modleId)
        emit('getCurTp',tp)
    }
}
//数字转换成文字
function digitChange(i) {
    let arr = ['一', '二', '三', '四', '五', '六', '七', '八'];
    return arr[i];
}
</script>

<style scoped lang="less">
@vw: 3.95vw;

.cycle {
  margin-bottom: (20 / @vw);

  .cycle_title {
    z-index: 10;
    position: relative;
    height: (30 / @vw);
    text-align: center;
    line-height: (30 / @vw);

    span {
      color: rgba(70, 70, 70, 0.705);
      font-size: (15 / @vw);
      padding: 0 (10 / @vw);
      z-index: 10;
      background-color: #fff;
    }

    &::after {
      z-index: -1;
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 100%;
      border: 1px dashed rgba(166, 164, 164, 0.57);
    }
  }

  ul {
    li {
      margin-top: (20 / @vw);
      padding: 0 (10 / @vw);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: (15 / @vw);

      .modleId {
        display: none;
      }

      .title {
        width: (200 / @vw);
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
</style>
