<template>
  <div class="memory_base">
    <header class="">
      <div class="header_top">
        <!-- 头部搜索框 -->
        <ClickSearch v-show="!tpstore.isDelete">
          <div class="calendar" @click="$router.push('/calendar')">
            <span class="icon iconfont icon-a-riqirili"></span>
          </div>
        </ClickSearch>
        <!-- 长按删除 -->
        <div class="ht_2" v-show="tpstore.isDelete">
          <div class="header_left" @click="tpstore.isDelete = false">
            <span class="icon iconfont icon-guanbi"></span>
          </div>
          <div class="delnum">共{{ tpstore.delnum }}项</div>
          <div class="header_right" @click="delTp()">
            <span class="icon iconfont icon-a-shanchulajitong"></span>
          </div>
        </div>
      </div>
      <!-- 记忆库导航栏 -->
      <div class="header_bottom" v-if="!tpstore.isDelete">
        <div
          class="today_plan_btn hb_btn"
          @click="changeBtn($router, true)"
          :class="{ btn_line: cur }"
        >
          今日计划
        </div>
        <div
          class="base_btn hb_btn"
          @click="changeBtn($router, false)"
          :class="{ btn_line: !cur }"
        >
          <span>{{ Banktitle }}</span>
          <div
            class="icon_btn"
            v-show="!cur"
            @click="mainstore.changeBank = !mainstore.changeBank"
          >
            <span class="icon iconfont icon-jiantou_zuoyouqiehuan_o"></span>
          </div>
        </div>
      </div>
    </header>
    <div class="container" :class="{ container_del: tpstore.isDelete }">
      <router-view> </router-view>
    </div>
  </div>
  <van-popup
    :show="searchData.isSearch"
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <SearchPage></SearchPage>
  </van-popup>
   <van-popup
    :show="learnstore.LearningPageIsShow"
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <LearningPage :tp="tpstore.curTp"></LearningPage>
  </van-popup>
</template>

<script setup>
import LearningPage from "@/views/LearnPage.vue";
import ClickSearch from "../components/global/ClickSearch.vue";
import DueToday from "../components/memory/DueToday.vue";
import MemoryBank from "../components/memory/MemoryBank.vue";
import SearchPage from "./SearchPage.vue";
import { ref, reactive, watch, onMounted, onUpdated } from "vue";
import { userStore, mainStore, tpStore ,CommunityStore,learnStore} from "@/stores";
import { getuserMsg } from "@/request/api/user.js";
import { UserMemory, deleteModle } from "@/request/api/memory.js";

let userstore = userStore();
let mainstore = mainStore();
let tpstore = tpStore();
const communityData = CommunityStore();
let learnstore = learnStore();
let searchData = communityData.searchData;

let cur = ref(true);
let Banktitle = ref("记忆库");
//获取用户数据
async function GetuserMsg() {
  let res = await getuserMsg();
  let msg = res.data.msg;
  userstore.user = Object.assign(userstore.user, msg.data.user); //将两个对象合并然后替换
}

// 搜索
searchData.isSearch = false;
searchData.isMemory = true;

onMounted(() => {
  if (userstore.isLogin) {
    GetuserMsg();
    tpstore.getTp(UserMemory); //获取用户模板
  }
});
const changeBtn = ($router, flag) => {
  cur.value = flag;
  if (flag) {
    $router.push("/DueToday");
    Banktitle.value = "记忆库";
  } else {
    $router.push("/MemoryBank");
    if (mainstore.changeBank) {
      Banktitle.value = "收藏库";
    } else {
      Banktitle.value = "个人库";
    }
  }
};
watch(
  () => mainstore.changeBank,
  (newvalue) => {
    if (newvalue) {
      Banktitle.value = "收藏库";
    } else {
      Banktitle.value = "个人库";
    }
  }
);
//点击删除模板
const delTp = async () => {
  let res = null;
  for (let x of tpstore.tp) {
    if (x.del) {
      res = await deleteModle("deleteModle", x.modleId);
      console.log(res);
    }
  }
  tpstore.isDelete = false;
  if (res.data.msg.data.deleteSuccess) {
    tpstore.getTp(UserMemory); //获取用户模板
  }
};
</script>

<style scoped lang="less">
@vw: 3.95vw;
.memory_base {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition: left 0.2s;
  background-color: #f6f7fb;
  overflow: hidden;

  .calendar {
    .icon {
      font-size: (35 / @vw);
    }
  }

  header {
    z-index: 1000;
    position: fixed;
    left: 0;
    top: 0;
    transition: left 0.2s;
    width: 100vw;
    background-color: #fff;

    .header_top {
      width: 100%;
      z-index: 100;
      height: (58 / @vw);
    }

    .header_bottom {
      width: 100%;
      z-index: 50;
      height: (40 / @vw);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    // 记忆库搜索框样式
    .search {
      padding: 0 (15 / @vw);
      width: 100%;
      height: (58 / @vw);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ht_2 {
      padding: 0 (15 / @vw);
      width: 100%;
      height: (58 / @vw);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ht_2 {
      padding: 0 (20 / @vw);
      font-size: (20 / @vw);

      .icon {
        font-size: (25 / @vw) !important;
      }
    }

    .header_left,
    .header_right {
      .icon {
        font-size: (35 / @vw);
      }
    }

    .header_btn {
      width: (40 / @vw);
      height: (40 / @vw);
      border-radius: 50%;
      border: (1 / @vw) solid #000;
      text-align: center;
      line-height: (40 / @vw);
    }

    .icon_btn {
      z-index: 1000;
      position: absolute;
      top: 0;
      right: (35 / @vw);
      width: (40 / @vw);
      height: (40 / @vw);
      border-radius: 50%;
      background-color: #fff;
      text-align: center;
      line-height: (40 / @vw);

      .icon {
        color: #a89cd4;
        font-size: (25 / @vw);
        font-weight: 700;
        // animation: sss .4s infinite;
      }
    }

    .change_ani {
      animation: changeani 1s;
    }
  }

  .container {
    position: relative;
    width: 100vw;
    margin-top: (98 / @vw);
  }

  .container_del {
    margin-top: (58 / @vw);
  }
}

.slide-right-enter-active,
.slide-right-leave-avtive,
.slide-left-enter-active,
.slide-left-leave-avtive {
  transition: all 0.3s;
}
.slide-right-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
.slide-left-enter-to,
.slide-left-leave-from,
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}
.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
