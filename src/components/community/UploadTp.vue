<template>
  <div class="content">
    <div class="title_label">
      <h4 class="title ellipsis">{{ tp.modleTitle }}</h4>
      <div class="label">{{ tp.modleLabel }}</div>
    </div>
    <div class="info_box">
      <div class="info ellipsis" ref="info"></div>
    </div>
  </div>
  <div class="select">
    <div class="circle" :class="{selected: isUpload ? tp.common : !tp.common}">
      <i class="iconfont icon-xuanze1"></i>
    </div>
  </div>
</template>

<script setup>
import {onMounted,ref} from 'vue';
const props = defineProps(['tp','isUpload']);
let info = ref(null).value;
onMounted(() => {
  info.innerHTML = props.tp.content
})
</script>
<style scoped lang="less">
@vw: 3.95vw;
.content {
  width: (100%);
  padding: (15 / @vw) 0;
  border-bottom: 1px solid #e4e4e4;

  .title_label {
    width: (100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: (10 / @vw);

    .title {
      width: (200 / @vw);
    }

    .label {
      height: (25 / @vw);
      line-height: (25 / @vw);
      padding: 0 (8 / @vw);
      font-size: (12 / @vw);
      border-radius: (10 / @vw);
      background-color: #aba3ca89;
    }
  }

  .info_box {
    width: (90%);
    line-height: (25 / @vw);
    margin-top: (10 / @vw);
    font-size: (13 / @vw);

    .info {
      word-break: break-all;
      -webkit-line-clamp: 1;
    }

    .highlight {
      display: inline;
    }
  }

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}

.select {
  padding-left: (20 / @vw);
  padding-right: (10 / @vw);
  height: (40 / @vw);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-left: 2px solid #e5e5e5;

  .circle {
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
