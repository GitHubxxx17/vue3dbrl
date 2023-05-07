<template>
  <div class="search_page" style="display: block">
    <header>
      <Search>
        <div class="header_left" @click="closeSearch()">
          <span class="icon iconfont icon-xiangzuojiantou"></span>
        </div>
      </Search>
    </header>
    <div class="container">
      <div id="paragraph"></div>
      <div class="empty" v-if="!searchData.isSuccess">
        <img src="../assets/搜索不到信息.png" alt="" />
        <p class="personal_empty" v-if="mainData.isMemory">
          没有此资源,请去模板社区找找看
        </p>
        <p class="community_empty" v-if="!mainData.isMemory">暂无此资源</p>
      </div>
      <ul class="search_lis" v-if="searchData.isSuccess">
        <li
          class="baseLis_fadeIn"
          v-for="(target, i) in searchData.modelData"
          :key="i"
          @click="lookModle(i)"
        >
          <SearchLi :liData="target"></SearchLi>
        </li>
        <footer></footer>
      </ul>
    </div>
  </div>
</template>

<script setup>
import Search from "../components/global/Search.vue";
import SearchLi from "../components/global/SearchLi.vue";
import { watch } from "vue";
import { userStore, mainStore, tpStore, CommunityStore,learnStore } from "@/stores";
import { reactive } from "vue";
const searchTp = reactive([]);
const communityData = CommunityStore();
let searchData = communityData.searchData;
let userData = userStore();
let mainData = mainStore();
let tpData = tpStore();
let learnData = learnStore();
//监听搜索模板长度变化
watch(
  () => searchData.modelData,
  () => {
    communityData.changeLabel();
  }
);

// 关闭搜索页面
function closeSearch() {
  searchData.isSearch = false;
  setTimeout(() => {
    searchData.searchValue = "";
    searchData.isSuccess = true;
    searchData.modelData = [];
  }, 200);
}

// 点击查看模板
function lookModle(i) {
  // 如果是社区查看模板的话
  if (!searchData.isMemory) {
    communityData.showLi.show = true;
    communityData.showLi.curFlash = communityData.searchData.modelData[i];
  } else {
    learnData.LearningPageIsShow = true;
    tpData.curTp = reactive(communityData.searchData.modelData[i])
  }
}
</script>

<style scoped lang="less">
@vw: 3.75vw;

.search_page {
  background-color: #f4f4f4;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  header {
    z-index: 1000;
    position: fixed;
    top: 0;
    transition: left 0.2s;
    width: 100vw;
    height: (58 / @vw);
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 (30 / @vw) 0 (10 / @vw);

    .header_left {
      width: (30 / @vw);
      height: (30 / @vw);
      line-height: (30 / @vw);
      text-align: center;
      margin-right: (25 / @vw);
      .icon {
        font-weight: 700;
        font-size: (15 / @vw);
      }
    }

    .header_search {
      display: flex;
      align-items: center;
      padding: 0 (10 / @vw);
      width: (280 / @vw);
      height: (30 / @vw);
      border-radius: (15 / @vw);
      background-color: #ecedef;

      input {
        padding: 0 (5 / @vw);
        width: (235 / @vw);
        height: (30 / @vw);
        border-radius: (15 / @vw);
        background-color: #ecedef;
        font-size: (15 / @vw);
        border: 0;
        letter-spacing: 0.23rem;
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
  }

  // .container{
  //     width: 90vmin;
  //     background-color: #fff;
  //     padding: (20/@vw) (10/@vw);
  //     position: absolute;
  //     transform: translate(-50%,-50%);
  //     top: 50%;
  //     left: 50%;
  //     border-radius: (5/@vw);
  //     box-shadow: 0 (20/@vw) (35/@vw) rgba(60, 60, 60, 0.2);

  //     div{
  //         line-height: (35/@vw);
  //         text-align: justify;

  //         mark{
  //             background-color: #ffd161;
  //         }
  //     }
  // }

  .container {
    overflow: scroll;
    width: 100%;
    height: 100%;
    margin-bottom: (70 / @vw);
    position: relative;
    width: 100vw;
    margin-top: (58 / @vw);

    .search_lis {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      transition: all 0.01s;
      display: flex;
      flex-direction: column;
      align-items: center;

      li {
        overflow: hidden;
        position: relative;
        margin-top: 5vw;
        width: (350 / @vw);
        height: (100 / @vw);
        border-radius: (10 / @vw);
        box-shadow: (1 / @vw) (1 / @vw) (6 / @vw) rgba(0, 0, 0, 0.227);
        transition: all 0.5s ease-in-out;
        opacity: 0;
        transition-delay: 0.3s;
      }

      .baseLis_fadeIn {
        margin-top: 4.5vw;
        opacity: 1;
      }

      .baseLis_del {
        animation: baseLis_del 0.5s forwards;
      }

      @keyframes baseLis_del {
        0% {
          height: (100 / @vw);
        }

        99% {
          margin-top: 0;
          height: 0;
        }

        100% {
          margin-top: 0;
          height: 0;
          display: none;
        }
      }
    }

    .empty {
      position: absolute;
      top: 40%;
      left: (50%);
      transform: translate(-50%, -50%);
      text-align: center;
      img {
        width: (200 / @vw);
      }

      p {
        margin-top: (-10 / @vw);
        width: (250 / @vw);
        text-align: center;
        color: #3232324c;
      }
    }
  }

  footer {
    width: 100%;
    height: (80 / @vw);
  }
}
</style>
