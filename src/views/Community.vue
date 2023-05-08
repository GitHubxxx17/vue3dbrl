<template>
  <div class="community" @click="delHidden">
    <header>
      <ClickSearch>
        <div class="upload" @click="communityData.isUpLoad = true">
          <div
            class="iconfont icon-zhongguohangtiantubiaoheji-weizhuanlunkuo-"
          ></div>
          <div class="text">上传</div>
        </div>
      </ClickSearch>

      <div class="label">
        <ul>
          <li
            v-for="(k, index) of lableData"
            :key="k"
            :class="{ active: selectLable[index] }"
            @click="clickLable(index)"
          >
            <span>{{ lableData[index] }}</span>
          </li>
        </ul>
      </div>
    </header>

    <main>
      <div class="zhanwei"></div>
      <van-pull-refresh
        v-model="isLoading"
        :disabled="disabled"
        @refresh="onRefresh"
      >
        <ul class="community_ul" ref="flash_ul">
          <li v-for="(flash, i) in communityData.flashCommunity" :key="flash">
            <CommunityLi :flash="flash"></CommunityLi>
          </li>
          <div
            class="footer_loading"
            v-show="communityData.loading"
            ref="footerLoading"
          >
            <span
              class="icon iconfont icon-a-zhongzhishuaxin"
              :class="{ rotateLoading: communityData.loading }"
            ></span>
            <span>正在加载中······</span>
          </div>
          <div class="footer_end" v-show="communityData.lodingEnd">
            已经到底啦~~
          </div>
        </ul>
      </van-pull-refresh>
    </main>
  </div>
  <!-- 右侧弹出 社区资料详情 -->
  <van-popup
    v-model:show="showLi.show"
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <ViewTemplate></ViewTemplate>
  </van-popup>
  <!-- 上传页面 -->
  <van-popup
    v-model:show="communityData.isUpLoad"
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <UploadPage></UploadPage>
  </van-popup>
  <!-- 搜索界面 -->
  <van-popup
    :show="searchData.isSearch"
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <SearchPage></SearchPage>
  </van-popup>
</template>

<script setup>
// 引入内部模板组件
import ClickSearch from "../components/global/ClickSearch.vue";
import CommunityLi from "../components/community/CommunityLi.vue";
import ViewTemplate from "../components/community/ViewTemplate.vue";
import UploadPage from "../components/community/UploadPage.vue";
import SearchPage from "../views/SearchPage.vue";
// 引入vue内置函数
import { ref, onMounted, provide, watchEffect, watch } from "vue";
// 引入社区获取模板api
import { getTempByLable, getRandomTemp } from "../request/api/community";
// 引入数据
import { CommunityStore, userStore, mainStore } from "@/stores";
// 引入外部组件
import { showToast } from "vant";

let communityData = CommunityStore(); // 获取社区数据
let userstore = userStore(); // 引入用户数据
let searchData = communityData.searchData;
searchData.isMemory = false;
let lableData = ["系统模板", "教资", "考研", "通识课"]; // 社区标签
let selectLable = ref([true, false, false, false]); //记录社区标签的选择情况
let showLi = communityData.showLi; // 获取右侧弹出层的数据
const delHidden = () => {
  for (let x of communityData.flashCommunity) {
    if (x.delisShow) {
      x.delisShow = false;
    }
  }
};


//获取社区模板
async function getTempData(modleLabel, pageIndex, token) {
  communityData.curPageIndex = 0;
  let getTempData = await getTempByLable(modleLabel, pageIndex, token);
  communityData.flashCommunity = getTempData.data.msg.data.modleList || [];
}
getTempData(0, 0, userstore.user.token); // 默认进入社区就是系统模板

//下拉刷新模板的组件使用
const isLoading = ref(false);
let disabled = ref(false); // 是否禁用刷新
const onRefresh = async () => {
  let getTempData = await getRandomTemp(
    communityData.curModelIndex,
    userstore.user.token
  );
  setTimeout(() => {
    communityData.flashCommunity = getTempData.data.msg.data.modle;
    if (communityData.flashCommunity) {
      showToast("刷新成功");
      communityData.curPageIndex = 0;
    } else {
      showToast("暂无模板");
    }

    isLoading.value = false;
  }, 1000);
};

// 点击选择标签
let clickLable = (target) => {
  communityData.curModelIndex = target; // 修改当前处于的标签下标
  for (let index = 0; index < selectLable.value.length; index++) {
    if (index != target) {
      selectLable.value[index] = false;
    } else {
      selectLable.value[index] = true;
    }
  }
  flash_ul.value.scrollTop = 0;
  getTempData(target, 0, userstore.user.token); // 获取当前target标签下的模板
};
//挂载后处理的事件
let flash_ul = ref(null); // 获取社区展示列表
let footerLoading = ref(null); // 获取正在加载
onMounted(() => {
  flash_ul.value.addEventListener("scroll", function () {
    if (flash_ul.value.scrollTop > 0) {
      disabled.value = true;
    } else {
      disabled.value = false;
    }
    //当滚动到底部且当前没有进行加载动画和有模板时
    if (
      this.clientHeight + this.scrollTop >= this.scrollHeight &&
      !communityData.loading &&
      !communityData.lodingEnd
    ) {
      communityData.loading = true;
      //等待后端数据
      setTimeout(async () => {
        communityData.loading = false;
        communityData.curPageIndex++;
        let res = await getTempByLable(
          communityData.curModelIndex,
          communityData.curPageIndex,
          userstore.user.token
        );
        console.log(res);
        if (res.data.msg.content == "无模板") {
          //如果没有模板则将到底显示
          communityData.lodingEnd = true;
          communityData.loading = false;
        } else {
          communityData.flashCommunity.push(...res.data.msg.data.modleList); //有模板则加入小菠萝数据中
        }
      }, 800);
    }
  });
});

//监听社区模板数组长度变化
watch(
  () => communityData.flashCommunity,
  () => {
    communityData.changeLabel();
  }
);

watchEffect(() => {
  // 监听是否显示到底部了没有
  if (communityData.flashCommunity) {
    let len = communityData.flashCommunity.length;
    if (len < 3) {
      communityData.lodingEnd = true;
    } else {
      communityData.lodingEnd = false;
    }
  } else {
    // 没有模板的情况
    communityData.lodingEnd = true;
  }
});
</script>

<style scoped lang="less">
@vw: 3.75vw;

// 社区主题的样式
.community {
  background-color: #f4f4f4;
  z-index: 1000;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  transition: all 0.2s;

  .popup_box {
    display: none;
    position: absolute;
    width: (140 / @vw);
    // padding: 0(20/@vw);
    height: (60 / @vw);
    top: 8%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    z-index: 10000;
    border-radius: (10 / @vw);
    text-align: center;
    line-height: (60 / @vw);
    font-size: (18 / @vw);
    box-shadow: (2 / @vw) (2 / @vw) (6 / @vw) (2 / @vw)
      rgba(121, 121, 121, 0.38);
  }

  .dianzan_fast {
    animation: dianzan_fast 3s forwards;
  }

  @keyframes dianzan_fast {
    0% {
      opacity: 0.1;
      top: -10%;
    }
    40% {
      opacity: 1;
      top: 8%;
    }
    70% {
      opacity: 1;
      top: 8%;
    }
    100% {
      opacity: 0.1;
      top: -15%;
    }
  }

  header {
    z-index: 1000;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: (90 / @vw);
    background-color: #fff;
    transition: all 0.2s;

    .search {
      transition: all 0.2s;
      height: (48 / @vw);
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      padding: 0 (10 / @vw);
      transition: all 0.2s;
      font-size: (12 / @vw);
      text-align: center;
      color: rgb(92, 78, 175);

      .upload {
        .icon-zhongguohangtiantubiaoheji-weizhuanlunkuo- {
          font-size: (26 / @vw);
        }

        .sz {
          font-weight: 700;
          font-size: (12 / @vw);
        }
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
        width: (250 / @vw);
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
          color: #979797;
        }
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

    .label {
      height: (30 / @vw);

      ul {
        display: flex;
        justify-content: space-evenly;
        padding: 0 (15 / @vw);
        padding-bottom: (20 / @vw);

        li {
          text-align: center;
          border-bottom: (0 / @vw) solid #ab97c9;
          padding: (10 / @vw) (11 / @vw);

          span {
            font-size: (14 / @vw);
          }
        }

        .active {
          border-bottom: (2 / @vw) solid rgb(92, 78, 175);
          transition: all 0.1s;
        }
      }
    }
  }

  main {
    position: relative;

    .zhanwei {
      width: 100%;
      height: (105 / @vw);
    }
    // 社区模板样式
    li {
      display: block;
      padding: 0 (10 / @vw);
      border-radius: (10 / @vw);
      margin-bottom: (20 / @vw);
      background-color: #f4f4f4;
      padding-bottom: (5 / @vw);
    }

    .com_loading_up {
      position: absolute;
      top: (40 / @vw);
      left: 50%;
      transform: translateX(-50%);
      width: (45 / @vw);
      height: (45 / @vw);
      border-radius: 50%;
      background-color: #ffffff;
      box-shadow: (1 / @vw) (1 / @vw) (5 / @vw) rgba(0, 0, 0, 0.191);
      line-height: (45 / @vw);
      text-align: center;
      z-index: 100;

      .icon {
        display: block;
        color: #a68ad0;
        font-size: (25 / @vw);
        font-weight: 700;
      }
    }

    .com_loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: (200 / @vw);
      height: (200 / @vw);
      background: url(../images/加载.gif) no-repeat;
      background-size: cover;
    }

    .commutity_box {
      width: 100%;
      height: (100vh);
      overflow: scroll;
    }

    .community_ul {
      height: calc(100vh - 17vw);
      border-radius: (10 / @vw);
      overflow: scroll;
      position: relative;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .footer_loading {
      width: 100%;
      height: 40vw;
      // height: (40 / @vw);
      display: flex;
      justify-content: center;
      color: #a46df7;
      font-size: (16 / @vw);
      .icon {
        font-size: (22 / @vw);
        font-weight: 700;
        width: (22 / @vw);
        height: (22 / @vw);
      }
      span {
        &:last-child {
          padding-left: (10 / @vw);
        }
      }
    }

    .footer_end {
      width: 100%;
      height: 40vw;
      display: flex;
      justify-content: center;
      color: #a46df7;
      font-size: (16 / @vw);
    }
  }

  .community_footer {
    width: 100%;
    height: (70 / @vw);
  }
}

.scale {
  animation-duration: 0.5s;
  animation: scale 0.5s linear;
}

@keyframes scale {
  0% {
    scale: 1;
  }

  25% {
    scale: 1.2;
  }

  50% {
    scale: 1.2;
  }

  75% {
    scale: 0.8;
  }

  85% {
    scale: 0.8;
  }

  100% {
    scale: 1;
  }
}

.rotateLoading {
  animation: rotateLoading 0.7s linear infinite;
}

@keyframes rotateLoading {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}

.comlifadein {
  animation: comlifadein 0.8s ease-out;
}

@keyframes comlifadein {
  0% {
    margin-top: (30 / @vw);
    opacity: 0;
  }

  100% {
    margin-top: 0;
    opacity: 1;
  }
}
</style>
