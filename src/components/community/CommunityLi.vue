<template>
  <div class="color">
    <div class="upper">
      <div class="left">
        <div class="head_portrait">
          <img
            :src="
              flash.base64 == '' ? 'src/assets/头像-女学生2.png' : flash.base64
            "
          />
        </div>
        <div class="idname1">{{ flash.nickName }}</div>
      </div>
      <div class="right" v-show="ismind" @click="delShow($event)">
        <div class="iconfont icon-shixincaidan"></div>
        <div class="del" v-show="flash.delisShow" @click="ondel">删除</div>
      </div>
    </div>

    <div class="content" @click="showPopup(flash)">
      <h4 class="title ellipsis">{{ flash.modleTitle }}</h4>
      <div class="info_box">
        <div class="info ellipsis" ref="info">
        </div>
      </div>
    </div>
    <div class="click">
      <div class="label">
        <span class="iconfont icon-shuqianguanli"></span>
        <span>{{ flash.modleLabel }}</span>
      </div>
      <div class="toolbar_right">
        <!-- 占位 -->
        <span v-show="ismind"></span>
        <span class="shoucang" ref="shoucang" v-show="!ismind">
          <i
            class="iconfont"
            :class="{
              'icon-shoucang1': !collected,
              'icon-shoucang': collected,
            }"
          ></i>
          <i class="wenzi" :class="{ orange: collected }">收藏</i>
        </span>
        <span class="dainzan" ref="dianzan">
          <i
            class="iconfont"
            :class="{
              'icon-dianzan': !flash.likeStatus,
              'icon-dianzan1': flash.likeStatus,
            }"
          ></i>
          <i class="wenzi" :class="{ orange: flash.likeStatus }">{{
            flash.likeNum == 0 ? "点赞" : flash.likeNum
          }}</i>
          <span class="circle"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入内置函数
import { ref, onMounted } from "vue";
// 引入社区的api
import {
  collect,
  LikeOrDisLike,
  toCommunity,
} from "../../request/api/community";
// 引入数据
import { CommunityStore, tpStore, userStore } from "@/stores";
import useDebounce from "@/hooks/useDebounce.js";
let tpData = tpStore(); // 获取记忆库和收藏库模板
let userData = userStore(); // 获取用户数据
const props = defineProps(["flash"]);
let info = ref(null).value;
let flash = ref(props.flash).value; // 刷新模板数据
let token = userData.user.token;
let ismind = ref(false); // 判断是否是自己的模板
if (userData.user.userId == flash.userId) {
  ismind.value = true;
  flash.delisShow = false;
}
// let delisShow = ref(false); //展示删除
const delShow = (e) => {
  e.stopPropagation();
  flash.delisShow = true;
};

//点击查看模板
const flashStore = CommunityStore();
const showPopup = (flash) => {
  flashStore.showLi.show = true;
  flashStore.showLi.curFlash = flash;
  flashStore.showLi.collected = collected.value;
  flashStore.showLi.ismind = ismind.value;
};

let shoucang = ref(null).value; // 获取收藏对象
let dianzan = ref(null).value; // 获取点赞对象
let collected = ref(false); // 记录是否收藏
let liked = ref(false); // 记录是否点赞

onMounted(() => {
  info.innerHTML = props.flash.content

  for (let index = 0; index < tpData.tp.length; index++) {
    if (tpData.tp[index].modleId == flash.modleId && tpData.tp[index].MStatus) {
      collected.value = true;
    }
  }

  shoucang.onclick = useDebounce(async (e) => {
    // 如果已经是被收藏的则移除收藏
    if (shoucang.children[1].classList.contains("orange")) {
      collected.value = false;
      // 将当前模板从收藏库移除
      for (let index = 0; index < tpData.tp.length; index++) {
        if (
          tpData.tp[index].modleId == flash.modleId &&
          tpData.tp[index].MStatus
        ) {
          console.log("取消收藏成功！！！");
          tpData.tp[index].MStatus = 0;
          collect(tpData.tp[index].modleId, tpData.tp[index].MStatus, token);
          tpData.tp.splice(index, 1);
          break;
        }
      }
    } else {
      collected.value = true;
      let res = await collect(flash.modleId, 1, token);
      console.log("收藏成功！！！", res.data);
      if (res.data.msg.content == "收藏成功") {
        tpData.tp.unshift(props.flash);
        tpData.tp[0].MStatus = 1;
      }
    }
  }, 500);

  dianzan.onclick = useDebounce(async (e) => {
    // 如果已经是被收藏的则移除收藏
    if (dianzan.children[1].classList.contains("orange")) {
      let res = await LikeOrDisLike(flash.modleId, false, token);
      console.log("取消点赞成功", res);
      if (res.data.msg.content == "取消点赞") {
        flash.likeStatus = false;
        flash.likeNum--;
      }
      dianzan.children[0].classList.remove("icon-dianzan1");
      dianzan.children[0].classList.add("icon-dianzan");
      dianzan.children[1].classList.remove("orange");
    } else {
      let res = await LikeOrDisLike(flash.modleId, true, token);
      console.log("点赞成功", res);
      if (res.data.msg.content == "点赞成功") {
        flash.likeStatus = true;
        flash.likeNum = res.data.msg.data.likeNum;
      }
      dianzan.children[0].classList.add("icon-dianzan1");
      dianzan.children[0].classList.remove("icon-dianzan");
      dianzan.children[1].classList.add("orange");
    }
  }, 500);
});

const ondel = async () => {
  let res = await toCommunity(flash.modleId, 0);
  console.log(res);
  if (!res.data.msg.data.isPublic) {
    for (let i = 0; i < flashStore.flashCommunity.length; i++) {
      if (flashStore.flashCommunity[i].modleId == flash.modleId) {
        flashStore.flashCommunity.splice(i, 1);
      }
    }
  }
};
</script>

<style scoped lang="less">
@vw: 3.95vw;

.modleId {
  display: none;
}

.color {
  background-color: #fff;
  padding-top: (10 / @vw);
  box-shadow: (1 / @vw) (2 / @vw) (5 / @vw) (2 / @vw) rgba(159, 157, 157, 0.381);

  .upper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 (20 / @vw);
    height: (42 / @vw);

    .left {
      display: flex;
      align-items: center;
      height: (42 / @vw);
      // background-color:#fff;
    }

    .head_portrait {
      width: (42 / @vw);
      height: (42 / @vw);
      border-radius: 100%;

      img {
        border-radius: 100%;
      }
    }

    .idname1 {
      font-size: (14 / @vw);
      margin-left: (10 / @vw);
    }

    .right {
      width: (50 / @vw);
      height: (30 / @vw);
      position: relative;
      text-align: center;

      .icon-shixincaidan {
        top: 0;
        position: absolute;
        margin-left: (10 / @vw);
        width: (30 / @vw);
        height: (30 / @vw);
        line-height: (30 / @vw);
        text-align: center;
      }

      .del {
        top: (30 / @vw);
        position: absolute;
        width: (50 / @vw);
        height: (30 / @vw);
        text-align: center;
        margin-top: (-5 / @vw);
        line-height: (30 / @vw);
        background-color: rgba(216, 214, 214, 0.68);
        border-radius: (5 / @vw);
      }
    }
  }

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .content {
    margin: 0 (15 / @vw);
    margin-top: (5 / @vw);
    padding: 0 (25 / @vw);
    border-radius: (10 / @vw);
    // background-color:#75599c7a ;

    h4 {
      margin-bottom: (5 / @vw);
      padding-top: (15 / @vw);
      font-size: (18 / @vw);
    }

    .info_box {
      .info {
        font-size: (14 / @vw);
        line-height: (25 / @vw);
        height: (52 / @vw);
        word-break: break-all;
      }

      .highlight {
        display: inline;
        // background: #fdbe3b;
        color: #000;
      }
    }
  }
}

.click {
  position: relative;
  height: (50 / @vw);
  line-height: (30 / @vw);
  padding: 0 (20 / @vw);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    display: inline-block;
    margin-top: (5 / @vw);
    height: (25 / @vw);
    width: auto;
    border-radius: (20 / @vw);
    line-height: (25 / @vw);
    padding: 0 (10 / @vw);
    text-align: left;
    // background-color: rgba(222, 222, 222, 0.543);
    background-color: #ab97c974;

    span {
      color: #323232;
      font-size: (12 / @vw);
    }

    .icon-shuqianguanli {
      font-size: (14 / @vw);
    }
  }

  // i{
  //     text-align: center;
  //     display: inline-block;
  //     width: (30/@vw);
  //     height: (20/@vw);
  //     background-color: #dedcdc;
  //     border-radius: 15%;
  // }
  .icon-shixincaidan {
    line-height: (20 / @vw);
  }

  .inter_box {
    position: absolute;
    top: (12 / @vw);
    right: (60 / @vw);
    width: (0 / @vw);
    overflow: hidden;
    transition: width 0.6s;

    .interactive {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: (160 / @vw);

      .hidden {
        display: none !important;
      }

      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: (80 / @vw);
        height: (25 / @vw);
        color: #fff;
        background-color: #656464;
        font-size: (13 / @vw);

        i {
          font-style: normal;
          line-height: (20 / @vw);
          color: #fff;
          background-color: #656464;
        }

        .icon-jifenhuiyuan {
          font-weight: 700;
        }
      }

      .yellow {
        color: rgba(254, 211, 20, 0.943);
      }
    }
  }

  .toolbar_right {
    height: 100%;
    width: (150 / @vw);
    display: flex;
    align-items: center;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: (5 / @vw);
      font-size: (14 / @vw);
      flex: 1;
      text-align: center;

      .wenzi {
        margin-left: (5 / @vw);
      }
    }

    .dainzan {
      position: relative;

      .circle {
        display: none;
        width: (5 / @vw);
        height: (5 / @vw);
        background-color: transparent;
        border-radius: 50%;
        position: absolute;
        top: 60%;
        left: 26%;
        transition: all 0.5s;
        transform: translate(-50%, -50%) scale(0);
        box-shadow: 0 -26px 0 rgba(210, 105, 30, 0.509),
          0 26px 0 rgba(210, 105, 30, 0.509),
          -26px 0 0 rgba(210, 105, 30, 0.509),
          26px 0 0 rgba(210, 105, 30, 0.509),
          -18px -18px 0 rgba(210, 105, 30, 0.509),
          18px -18px 0 rgba(210, 105, 30, 0.509),
          18px 18px 0 rgba(210, 105, 30, 0.509),
          -18px 18px 0 rgba(210, 105, 30, 0.509);
      }

      .blink_circle {
        animation: blink 0.5s ease-in-out forwards;
        animation-delay: 0.3s;
      }

      @keyframes blink {
        0% {
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 0.8;
        }

        50% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }

        100% {
          transform: translate(-50%, -50%) scale(1.1);
          opacity: 0;
        }
      }
    }

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
</style>
