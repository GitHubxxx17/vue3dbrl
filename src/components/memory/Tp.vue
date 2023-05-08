<template>
  <div class="tp_inner">
    <div class="content">
      <h4 class="title ellipsis">{{ tp.modleTitle }}</h4>
      <div class="info ellipsis" ref="info"></div>
    </div>
    <div class="select" v-show="tpData.isDelete" :class="{ selected: tp.del }">
      <i class="iconfont icon-xuanze1"></i>
    </div>
    <div class="tip">
      <div class="label">
        <span class="iconfont icon-shuqianguanli"></span>
        <span class="label_title">{{ tp.modleLabel }}</span>
      </div>
      <div class="learning" :class="classObj">
        <span>{{ tp.studyStatus }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch,onMounted } from "vue";
import { tpStore } from "@/stores";
const props = defineProps(["tp"]);
const tpData = tpStore();
let info = ref(null)
watch(
  () => props.tp.studyStatus,
  () => {
    classObj = reactive({
      startlearn: props.tp.studyStatus == "学习中",
      reviewing: props.tp.studyStatus == "复习中",
      learned: props.tp.studyStatus == "已学习",
    });
  }
);
let classObj = reactive({
  startlearn: props.tp.studyStatus == "学习中",
  reviewing: props.tp.studyStatus == "复习中",
  learned: props.tp.studyStatus == "已学习",
});
onMounted(() => {
  info.value.innerHTML = props.tp.content
})
</script>

<style scoped lang="less">
@vw: 3.95vw;
.tp_inner {
  position: absolute;
  left: 0;
  background-color: #fff;
  width: 100%;
  height: 100%;
  // padding: 0 (15 / @vw);

  transition: all 0.3s ease-in-out;

  .content {
    width: 100%;
    padding: 0 (15 / @vw);

    h4 {
      position: relative;
      width: 100%;
      margin: (15 / @vw) 0 (10 / @vw) 0;
      font-size: (18 / @vw);
      color: #2f2f2f;
      font-weight: 600;
      letter-spacing: 0.1em;
    }

    .info {
      font-size: (14 / @vw);
      width: 100%;
      height: (48 / @vw);
      position: relative;
      -webkit-line-clamp: 2;
      padding: (12 / @vw) 0 0 0;
      color: #949393;
      word-break: break-all;

      &::after {
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        width: 100%;
        height: (1.5 / @vw);
        background-color: #f4f4f4;
      }

      .highlight {
        display: inline;
      }
    }
  }

  .tip {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: (40 / @vw);
    width: 100%;
    padding: 0 (10 / @vw);

    .label {
      display: inline-block;
      padding: 0 (10 / @vw);
      line-height: (20 / @vw);
      // padding: 0 (10/@vw);
      text-align: center;
      border-radius: (10 / @vw);
      // font-size: (20 / @vw);
      background-color: #ab97c974;

      span {
        color: #323232;
        font-size: (12 / @vw);
      }

      .icon-shuqianguanli {
        font-size: (14 / @vw);
      }
    }

    .learning {
      display: inline-block;
      // width: 50%;
      padding: 0 (10 / @vw);
      line-height: (20 / @vw);
      border-radius: (10 / @vw);
      // padding: 0 (10/@vw);
      text-align: center;

      background-color: #2323188d;

      span {
        color: #fff;
        font-size: (12 / @vw);
      }

      .icon-shuqianguanli {
        font-size: (14 / @vw);
      }
    }

    .startlearn {
      background-color: #ffd161;
    }

    .learned {
      background-color: #4e932ead;
    }

    .reviewing {
      background-color: #5f4fb8a4;
    }
  }

  .select {
    display: block;
    position: absolute;
    top: (10 / @vw);
    right: (10 / @vw);
    background-color: rgb(255, 255, 255);
    width: (30 / @vw);
    height: (30 / @vw);
    line-height: (30 / @vw);
    text-align: center;
    color: transparent;
    border: 1px solid #afafaf;
    border-radius: 100%;
  }

  .selected {
    background-color: #a48ec5;
    color: #fff;
    border: 0;
  }
}
</style>