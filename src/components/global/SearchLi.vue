<template>
  <div class="tp_inner">
    <div class="modleId">{{ liData.modleId }}</div>
    <div class="content">
      <h3 class="title ellipsis" ref="modelTitle"></h3>
    </div>
    <div class="bottom_box">
      <div class="info ellipsis" ref="modleInfo"></div>
      <div class="tip">
        <div class="date">{{ liData.createTime }}</div>
        <div class="label">
          <span class="iconfont icon-shuqianguanli"></span>
          <span>{{ liData.modleLabel }}</span>
        </div>
      </div>
    </div>
    <div class="common"></div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import { CommunityStore } from "@/stores";
const props = defineProps(["liData"]);
let liData = props.liData;
const communityData = CommunityStore();
let searchData = communityData.searchData;

let modleInfo = ref(null).value;
let modelTitle = ref(null).value;
let tempTitle = ""; // 暂替modelTitle

// 给关键字加样式
for (let i = 0; i < searchData.searchValue.length; i++) {
  if (searchData.searchValue[i] == " " || searchData.searchValue[i] == `.`) {
    continue;
  }
  //匹配字符
  // g ：表示全局（global）模式，即模式将被应用于所有字符串，而非在发现第一个匹配项时立即停止；
  //i： 表示不区分大小写（case -insensitive） 模式， 即在确定匹配项时忽略模式与字符串的大小写；
  let pattern = new RegExp(`${searchData.searchValue[i]}`, "gi");
  let pattern_span1 = new RegExp(`<span class="searched">`, "gi");
  let pattern_span2 = new RegExp(`</span>`, "gi");
  let pattern_span3 = new RegExp(`m`, "gi");
  let pattern_span4 = new RegExp(`k`, "gi");
  let judge_change = false;

  if (
    searchData.searchValue[i] == "s" ||
    searchData.searchValue[i] == "p" ||
    searchData.searchValue[i] == "a" ||
    searchData.searchValue[i] == "n" ||
    searchData.searchValue[i] == "c" ||
    searchData.searchValue[i] == "l" ||
    searchData.searchValue[i] == "e" ||
    searchData.searchValue[i] == "r" ||
    searchData.searchValue[i] == "h" ||
    searchData.searchValue[i] == "d" ||
    searchData.searchValue[i] == ">" ||
    searchData.searchValue[i] == "<" ||
    searchData.searchValue[i] == "/"
  ) {
    if (liData.modleTitle.indexOf(`<span class="searched">`)) {
      console.log("sdgsdgs");
    }
    tempTitle = liData.modleTitle.replace(pattern_span1, `m`);
    tempTitle = tempTitle.replace(pattern_span2, `k`);
    judge_change = true;
  }
  if (judge_change) {
    tempTitle = tempTitle.replace(
      pattern,
      (match) => `<span class="searched">${match}</span>`
    );
    tempTitle = tempTitle.replace(pattern_span3, `<span class="searched">`);
    tempTitle = tempTitle.replace(pattern_span4, `</span>`);
    judge_change = false;
  } else {
    tempTitle = liData.modleTitle.replace(
      pattern,
      (match) => `<span class="searched">${match}</span>`
    );
  }
  liData.modleTitle = tempTitle;
}

onMounted(() => {
  modelTitle.innerHTML = liData.modleTitle;
  modleInfo.innerHTML = liData.content;
});
</script>

<style lang="less">
@vw: 3.75vw;

.tp_inner {
  position: absolute;
  left: 0;
  background-color: #fff;
  width: (350 / @vw);
  height: 100%;
  padding-left: (15 / @vw);
  // display: flex;
  // align-items: center;
  transition: all 0.3s ease-in-out;

  .common,
  .modleId {
    display: none;
  }
}

.content {
  margin-top: (15 / @vw);
  h3 {
    width: (310 / @vw);
    font-size: (20 / @vw);
    span {
      border-radius: (5 / @vw);
      background-color: #ffc561;
    }
  }
}

.bottom_box {
  width: (320 / @vw);
  margin-top: (15 / @vw);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .info {
    font-size: (14 / @vw);
    width: (220 / @vw);
    height: (18 / @vw);
  }

  .highlight {
    display: inline;
  }
}

.tip {
  .date {
    display: none;
  }

  .label {
    width: auto;
    border-radius: (20 / @vw);
    line-height: (25 / @vw);
    padding: 0 (10 / @vw);
    text-align: center;
    font-size: (20 / @vw);
    background-color: #ab97c974;

    span {
      color: #323232;
      font-size: (14 / @vw);
    }

    .icon-shuqianguanli {
      font-size: (14 / @vw);
    }
  }
}
</style>
