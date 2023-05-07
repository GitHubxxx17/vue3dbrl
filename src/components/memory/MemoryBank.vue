<template>
  <div class="MemoryBank">
    <div
      class="my_base"
      :class="{
        clip_path_show: !mainstore.changeBank,
        clip_path_hidden: mainstore.changeBank,
      }"
    >
      <ul class="base_lis" v-if="state.myTp.length != 0">
        <li v-for="tp in state.myTp" :key="tp">
          <Tp
            :tp="tp"
            @touchstart="goTouchstart($event)"
            @touchmove="goTouchmove($event)"
            @touchend="goTouchend($event, tp)"
          ></Tp>
        </li>
      </ul>
      <div v-else class="base_none_1" style="display: block"></div>
      <div
        class="base_bottom"
        :class="{ base_bottom_del: tpstore.isDelete }"
      ></div>
    </div>
    <div
      class="collection_base"
      :class="{
        clip_path_show: mainstore.changeBank,
        clip_path_hidden: !mainstore.changeBank,
      }"
    >
      <ul class="base_lis" v-if="state.colTp.length != 0">
        <li v-for="tp in state.colTp" :key="tp">
          <Tp
            :tp="tp"
            @touchstart="goTouchstart($event)"
            @touchmove="goTouchmove($event)"
            @touchend="goTouchend($event, tp)"
          ></Tp>
        </li>
      </ul>
      <div v-else class="base_none_2" style="display: block"></div>
      <div class="base_bottom"></div>
    </div>
  </div>
</template>

<script setup>
import Tp from "./Tp.vue";
import LearningPage from "@/views/LearnPage.vue";
import { reactive, watch } from "vue";
import { tpStore, mainStore, learnStore } from "@/stores";
import { UserMemory } from "@/request/api/memory.js";
//初始化数据
const tpstore = tpStore();
const mainstore = mainStore();
const learnstore = learnStore();
tpstore.getTp(UserMemory); //获取用户模板
const state = reactive({
  myTp: tpstore.tp.filter((v) => {
    if (!v.MStatus) return v;
  }),
  colTp: tpstore.tp.filter((v) => {
    if (v.MStatus) return v;
  }),
});

watch(
  () => tpstore.tp.length,
  () => {
    state.myTp = tpstore.tp.filter((v) => {
      if (!v.MStatus) return v;
    });
    state.colTp = tpstore.tp.filter((v) => {
      if (v.MStatus) return v;
    });
  }
);

let EnterLearn = (tp) => {
  tpstore.curTp = reactive(tp);
  learnstore.LearningPageIsShow = true;
  learnstore.isReview = false;
};

const touch = reactive({
  time: 0, //开始触摸屏幕的时间
  l: 0, //是否滑动屏幕
  disX: 0, //开始触摸屏幕的位置
});
//触摸开始
function goTouchstart(e) {
  touch.l = 0;
  touch.time = new Date().getSeconds();
  touch.disX = e.changedTouches[0].clientX;
}
//开始滑动
function goTouchmove(e) {
  touch.l = e.changedTouches[0].clientX - touch.disX;
}
//触摸结束
//手如果在1秒内就释放，则取消长按事件
function goTouchend(e, tp) {
  if (touch.l == 0) {
    if (Math.abs(new Date().getSeconds() - touch.time) > 0.5) {
      tpstore.isDelete = true;
    } else {
      if (!tpstore.isDelete) {
        EnterLearn(tp); //点击事件
      } else {
        if (!tp.del) {
          tp.del = true;
          tpstore.delnum++;
        } else {
          tp.del = !tp.del;
          tpstore.delnum += tp.del ? 1 : -1;
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
@vw: 3.95vw;
.MemoryBank {
  width: 100vw;
  height: 80vh;
  position: relative;
  overflow: hidden;
  background-color: #f6f7fb;
  transition: all 0.3s;

  .collection_base,
  .my_base {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 110vh;
    transition: all 0.5s;
    overflow: scroll;

    //隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }

    ul {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    .baseLis_fadeIn {
      margin-top: 4vw;
      opacity: 1;
    }

    .baseLis_del2 {
      animation: baseLis_del2 1s forwards;
    }

    .select {
      display: none;
    }

    li {
      overflow: hidden;
      position: relative;
      top: 0;
      left: 0;
      margin: 4vw 0 0 3vw;
      width: (180 / @vw);
      height: (150 / @vw);
      border-radius: (10 / @vw);
      box-shadow: (1 / @vw) (2 / @vw) (6 / @vw) (1 / @vw)
        rgba(121, 121, 121, 0.38);
      transition: all 0.5s ease-in-out;
      // transition-delay: .3s;
    }

    .base_none_1,
    .base_none_2 {
      display: none;
      width: 100%;
      margin-top: calc((100vh - (400 / @vw)));
      height: (400 / @vw);
      background-image: url(@/assets/images/kong.png);
      background-size: cover;
    }

    .base_none_2 {
      background-image: url(@/assets/images/kong.png);
    }
  }

  .base_bottom {
    height: (260 / @vw);
    width: 100%;
  }

  .base_bottom_del {
    height: (220 / @vw);
  }

  .my_base {
    clip-path: circle(100%);
  }

  .collection_base {
    background-color: #f6f7fb;
    z-index: 100;
    transform-origin: top right;
    clip-path: circle((26.5 / @vw) at 87vw -7vw);
    transition: all 0.5s;

    li {
      transition: all 0.3s ease-in-out;
    }
  }

  .clip_path_show {
    clip-path: circle(100%);
  }

  .clip_path_hidden {
    clip-path: circle((26.5 / @vw) at 87vw -7vw);
  }
}
</style>
