<template>
  <div class="modleId">{{ tp[target].modleId }}</div>
  <div class="content">
    <div class="title_label">
      <h3 class="title ellipsis">{{ tp[target].modleTitle }}</h3>
      <div class="label">
        <span>#</span>
        <span class="label_title">{{ tp[target].modleLabel }}</span>
      </div>
    </div>
  </div>
  <div class="select">
    <div class="circle" :class="{selected : isSelect}">
      <i class="iconfont icon-xuanze1"></i>
    </div>
  </div>
</template>

<script setup>
//引入内置函数
import { ref } from "vue";
//引入数据
import { tpStore } from "@/stores";

let props = defineProps(["target","isSelect"]);

// 获取模板数据
let tpData = tpStore();
let tp = tpData.tp;
</script>

<style scoped lang="less">
@vw: 3.95vw;

.modleId {
  display: none;
}

.content {
  padding: (10 / @vw) 0;

  h3 {
    font-size: (14 / @vw);
  }

  .title_label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: (200 / @vw);
    padding-right: (10 / @vw);

    .title {
      width: (120 / @vw);
    }

    .label {
      height: (22 / @vw);
      line-height: (22 / @vw);
      padding: 0 (8 / @vw);
      font-size: (12 / @vw);
      border-radius: (10 / @vw);
      color: #fff;
      background-color: #aba3cac6;
    }
  }
}

.select {
  padding-left: (10 / @vw);
  padding-right: (5 / @vw);
  height: (30 / @vw);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-left: 1.5px solid #e5e5e5;

  .circle {
    width: (22 / @vw);
    height: (22 / @vw);
    line-height: (22 / @vw);
    text-align: center;
    color: transparent;
    border: 1px solid #afafaf;
    border-radius: 100%;
  }

  .selected {
    background-color: #5f4fb8a4;
    color: #fff;
    border: 0;
  }
}
</style>
