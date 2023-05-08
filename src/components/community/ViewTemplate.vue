<template>
  <div class="viewTemplate">
    <div class="view_box">
      <header>
        <div
          class="back iconfont icon-xiangzuojiantou"
          @click="flashStore.showLi.show = false"
        ></div>
        <div class="user_box">
          <div class="head_portrait">
            <img
              :src="
                flashStore.showLi.curFlash.base64 == ''
                  ? 'src/assets/头像-女学生2.png'
                  : flashStore.showLi.curFlash.base64
              "
            />
          </div>
          <div class="idname">{{ flashStore.showLi.curFlash.nickName }}</div>
        </div>
      </header>
      <main>
        <div class="template_box">
          <div class="label">
            <span class="iconfont icon-shuqianguanli"></span>
            <span>{{ flashStore.showLi.curFlash.modleLabel }}</span>
          </div>
          <div class="modleId"></div>
          <div class="title">
            <h3 ref="title"></h3>
          </div>
          <div class="text_box" ref="text_box"></div>
        </div>
      </main>
      <footer class="scroll_top">
        <div class="bcg"></div>
        <div class="interactive">
          <span
            class="shoucang"
            ref="del"
            v-if="flashStore.showLi.ismind"
            @click="ondel"
          >
            <i class="iconfont icon-a-shanchulajitong"></i>&nbsp;&nbsp;<i
              class="vt_text"
              >删除</i
            >
          </span>
          <span
            class="shoucang"
            ref="shoucang"
            v-if="!flashStore.showLi.ismind"
            @click="oncollect"
          >
            <i
              class="iconfont"
              :class="{
                'icon-shoucang1': !flashStore.showLi.collected,
                'icon-shoucang': flashStore.showLi.collected,
              }"
            ></i
            >&nbsp;&nbsp;<i
              class="vt_text"
              :class="{ orange: flashStore.showLi.collected }"
              >收藏</i
            >
          </span>
          <span>|</span>
          <span class="dainzan" ref="dianzan"
            ><i
              class="iconfont"
              :class="{
                'icon-dianzan': !flashStore.showLi.curFlash.likeStatus,
                'icon-dianzan1': flashStore.showLi.curFlash.likeStatus,
              }"
            ></i
            >&nbsp;&nbsp;
            <i
              class="vt_text"
              :class="{ orange: flashStore.showLi.curFlash.likeStatus }"
              >{{
                flashStore.showLi.curFlash.likeNum == 0
                  ? "点赞"
                  : flashStore.showLi.curFlash.likeNum
              }}</i
            ></span
          >
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { showDialog } from "vant";
import { ref, onMounted, watch, reactive } from "vue";
// 引入数据
import { CommunityStore, tpStore, userStore } from "@/stores";
import useDebounce from "@/hooks/useDebounce.js";
import { collect, LikeOrDisLike, toCommunity } from "@/request/api/community";
// const show = inject("show");
//退出查看模板
const flashStore = CommunityStore();
let tpData = tpStore(); // 获取记忆库和收藏库模板
let userData = userStore(); // 获取用户数据

let text_box = ref(null);
let title = ref(null);
let shoucang = ref(null); // 获取收藏对象
let dianzan = ref(null); // 获取点赞对象
let del = ref(null); //删除

//当进入浏览页面时将内容添加进去
onMounted(() => {
  if (flashStore.showLi.show) {
    text_box.value.innerHTML = flashStore.showLi.curFlash.content;
    title.value.innerHTML = flashStore.showLi.curFlash.modleTitle;
  }

  dianzan.value.onclick = useDebounce(async (e) => {
    // 如果已经是被收藏的则移除收藏
    if (dianzan.value.children[1].classList.contains("orange")) {
      let res = await LikeOrDisLike(
        flashStore.showLi.curFlash.modleId,
        false,
        userData.user.token
      );
      console.log("取消点赞成功", res);
      if (res.data.msg.content == "取消点赞") {
        flashStore.showLi.curFlash.likeStatus = false;
        flashStore.showLi.curFlash.likeNum--;
      }
      dianzan.value.children[0].classList.remove("icon-dianzan1");
      dianzan.value.children[0].classList.add("icon-dianzan");
      dianzan.value.children[1].classList.remove("orange");
    } else {
      let res = await LikeOrDisLike(
        flashStore.showLi.curFlash.modleId,
        true,
        userData.user.token
      );
      console.log("点赞成功", res);
      if (res.data.msg.content == "点赞成功") {
        flashStore.showLi.curFlash.likeStatus = true;
        flashStore.showLi.curFlash.likeNum = res.data.msg.data.likeNum;
      }
      dianzan.value.children[0].classList.add("icon-dianzan1");
      dianzan.value.children[0].classList.remove("icon-dianzan");
      dianzan.value.children[1].classList.add("orange");
    }
  }, 500);
});
watch(
  () => flashStore.showLi.curFlash,
  () => {
    text_box.value.innerHTML = flashStore.showLi.curFlash.content;
  }
);

const oncollect = useDebounce(async (e) => {
  // 如果已经是被收藏的则移除收藏
  if (shoucang.value.children[1].classList.contains("orange")) {
    flashStore.showLi.collected = false;
    // 将当前模板从收藏库移除
    for (let index = 0; index < tpData.tp.length; index++) {
      if (
        tpData.tp[index].modleId == flashStore.showLi.curFlash.modleId &&
        tpData.tp[index].MStatus
      ) {
        console.log("取消收藏成功！！！");
        tpData.tp[index].MStatus = 0;
        collect(
          tpData.tp[index].modleId,
          tpData.tp[index].MStatus,
          userData.user.token
        );
        tpData.tp.splice(index, 1);
        break;
      }
    }
  } else {
    flashStore.showLi.collected = true;
    let res = await collect(
      flashStore.showLi.curFlash.modleId,
      1,
      userData.user.token
    );
    console.log("收藏成功！！！", res.data);
    if (res.data.msg.content == "收藏成功") {
      tpData.tp.unshift(flashStore.showLi.curFlash);
      tpData.tp[0].MStatus = 1;
    }
  }
}, 500);

const ondel = async () => {
  let res = await toCommunity(flashStore.showLi.curFlash.modleId, 0);
  console.log(res);
  if (!res.data.msg.data.isPublic) {
    flashStore.showLi.show = false;
    for (let i = 0; i < flashStore.flashCommunity.length; i++) {
      if (
        flashStore.flashCommunity[i].modleId ==
        flashStore.showLi.curFlash.modleId
      ) {
        flashStore.flashCommunity.splice(i, 1);
      }
    }
  }
};
</script>

<style scoped lang="less">
@vw: 3.95vw;
.viewTemplate {
  background-color: #f4f4f4;
  width: 100%;
  height: 100vh;
  z-index: 10000;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.2s;
  overflow: hidden;

  .view_box {
    width: 100%;
    header {
      display: flex;
      align-items: center;
      padding: 0 (15 / @vw);
      width: 100%;
      height: (50 / @vw);
      background-color: #fff;

      .icon-xiangzuojiantou {
        font-weight: 700;
      }

      .user_box {
        display: flex;
        align-items: center;
        margin-left: (20 / @vw);
        .head_portrait {
          width: (30 / @vw);
          height: (30 / @vw);

          img {
            width: 100%;
            height: 100%;
            border-radius: 100%;
          }
        }

        .idname {
          margin-left: (10 / @vw);
          font-size: (14 / @vw);
        }
      }
    }

    .template_box {
      width: 100%;
      height: 100vh;
      margin-top: (10 / @vw);
      padding: 0 (10 / @vw);
      padding-top: (10 / @vw);
      background-color: #fff;

      .label {
        display: inline-block;
        width: auto;
        height: (25 / @vw);
        border-radius: (20 / @vw);
        padding: 0 (10 / @vw);
        text-align: left;
        background-color: #ab97c974;
        line-height: (25 / @vw);
        span {
          color: #323232;
          font-size: (12 / @vw);
        }

        .icon-shuqianguanli {
          font-size: (14 / @vw);
        }
      }

      .title {
        margin-top: (10 / @vw);
        font-size: (18 / @vw);
        padding-bottom: (15 / @vw);
        border-bottom: 1px solid #9c9c9c31;
        text-align: center;
      }
    }
    footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      // height: (45/@vw);
      transition: all 0.2s;
      .bcg {
        width: 100%;
        height: (2 / @vw);
        background-color: #f4f4f4;
      }
      .interactive {
        width: 100%;
        height: (40 / @vw);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 (50 / @vw);
        background-color: #fff;
        color: #cdcccc;
        span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: (80 / @vw);
          // padding: (20/@vw);
          text-align: center;
          text-align: center;
          color: #323232;
          i {
            font-style: normal;
          }

          .icon-shoucang1,
          .icon-dianzan {
            font-size: (20 / @vw);
          }

          .icon-shoucang {
            font-size: (18 / @vw);
            // background-color: yellow;
            color: rgb(255, 174, 0);
          }

          .orange {
            color: rgb(255, 174, 0);
          }

          .icon-dianzan1 {
            font-size: (20 / @vw);
            // background-color: yellow;
            color: rgb(255, 174, 0);
          }
        }
      }
    }
  }
}

.text_box {
  padding: (10 / @vw);
  overflow: scroll;
  font-size: (16 / @vw);
  line-height: (35 / @vw);
  letter-spacing: 0.15em;
  height: 77%;
  padding-bottom: (25 / @vw);
  word-break: break-all;

  .highlight {
    display: inline;
    background: rgb(248, 207, 4);
    transition: all 0.3s;

    &::selection {
      background: rgb(234, 255, 2) !important;
    }
  }

  .input {
    width: auto;
    background-color: transparent;
    color: rgba(188, 56, 244, 0.861);
    border-bottom: (2 / @vw) rgb(0, 0, 0) solid;
    height: (30 / @vw);
    outline: none;
    display: inline;
    // -webkit-user-modify: read-write-plaintext-only;
  }

  .recite {
    height: (30 / @vw);
    background-color: darkgray !important;
    color: darkgray !important;
    border-radius: (5 / @vw);
    user-select: none;
  }
}
</style>
