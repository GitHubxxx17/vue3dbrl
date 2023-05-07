<template>
  <div class="search">
    <slot></slot>
    <div class="searchBar">
      <input type="text" v-model="searchData.searchValue" />
      <button @click="onSearch($event)">
        <span class="icon iconfont icon-sousuo3"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { userStore, CommunityStore } from "@/stores";
import { SearchModel } from "@/request/api/community.js";
import useDebounce from "@/hooks/useDebounce.js";
const userData = userStore();
const communityData = CommunityStore();
let searchData = communityData.searchData;

async function getSearchModel(modelTitle, common, token) {
  let models = await SearchModel(modelTitle, common, token);
  let modelData = models.data.msg.data;
  searchData.modelData = modelData.modleList || [];
  searchData.isSuccess = modelData.searchModle;
}
const onSearch = useDebounce((e) => {
  let common = 1;
  // 判断是否在记忆库
  if (searchData.isMemory) {
    common = 0;
  }
  getSearchModel(searchData.searchValue, common, userData.user.token);
}, 300);
</script>

<style scoped lang="less">
@vw: 3.95vw;
// 社区上传搜索框的样式 记得搬到社区上传那里！
.search {
  transition: all 0.2s;
  height: (50 / @vw);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 0 (10 / @vw);
  padding-top: (5 / @vw);
  transition: all 0.2s;
  font-size: (12 / @vw);
  text-align: center;
}

.calendar {
  .icon {
    font-size: (35 / @vw);
  }
}

.upload {
  .icon-zhongguohangtiantubiaoheji-weizhuanlunkuo- {
    font-size: (26 / @vw);
  }

  .text {
    font-size: (12 / @vw);
  }
}

.searchBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 (5 / @vw);
  margin-right: (8 / @vw);
  width: (280 / @vw);
  height: (30 / @vw);
  border-radius: (15 / @vw);
  background-color: #ecedef;

  input {
    padding: 0 (5 / @vw);
    width: (240 / @vw);
    height: (30 / @vw);
    border-radius: (15 / @vw);
    background-color: #ecedef;
    // border: (1 / @vw) solid #000;
    border: 0;
  }

  button {
    width: (30 / @vw);
    height: (30 / @vw);
    border-radius: 50%;
    border: none;
    background-color: transparent;

    .icon {
      font-size: (20 / @vw);
    }
  }
}
</style>
