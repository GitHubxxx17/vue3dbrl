<template>
  <div class="upload_page">
    <header>
      <div
        class="back iconfont icon-xiangzuojiantou"
        @click="CommunityData.isUpLoad = false"
      ></div>
      <div class="uploadMP selected" @click="uploadTocommon">
        {{ isUpLoad ? "上传" : "取消上传" }}
      </div>
    </header>
    <div class="select_btns">
      <div
        class="hb_btn"
        :class="{ btn_line: isUpLoad }"
        @click="isUpLoad = true"
      >
        未上传
      </div>
      <div
        class="hb_btn"
        :class="{ btn_line: !isUpLoad }"
        @click="isUpLoad = false"
      >
        已上传
      </div>
    </div>
    <div class="container">
      <div class="container_scroll" :class="{ scroll: !isUpLoad }">
        <div class="notUploaded">
          <ul>
            <li
              v-for="tp in state.unUploadTp"
              :key="tp"
              @click="changeUpload(tp)"
            >
              <UploadTp :tp="tp" :isUpload="isUpLoad"></UploadTp>
            </li>
          </ul>
          <footer></footer>
        </div>
        <div class="Uploaded">
          <ul>
            <li
              v-for="tp in state.UploadTp"
              :key="tp"
              @click="changeUpload(tp)"
            >
              <UploadTp :tp="tp" :isUpload="isUpLoad"></UploadTp>
            </li>
          </ul>
          <footer></footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UploadTp from "./UploadTp.vue";
// 引入内置函数
import { reactive, ref, onMounted, watch } from "vue";
// 引入数据
import { CommunityStore, tpStore, userStore } from "@/stores";
import { toCommunity } from "@/request/api/community.js";
// 获取社区数据
const CommunityData = CommunityStore();
//获取用户模板
const tpData = tpStore();
let userstore = userStore();
let isUpLoad = ref(true);
const state = reactive({
  UploadTp: tpData.tp.filter((v) => {
    if (v.common && !v.MStatus) return v;
  }), //已上传的模板
  unUploadTp: tpData.tp.filter((v) => {
    if (!v.common && !v.MStatus) return v;
  }), //未上传的模板
});

//改变上传状态
const changeUpload = (tp) => {
  tp.common = tp.common == 0 ? 1 : 0;
};

//点击上传到社区
const uploadTocommon = () => {
  if (isUpLoad.value) {
    let upload = state.unUploadTp.filter((v) => {
      if (v.common) return v;
    }); //将勾选的模板放进一个数组
    console.log(upload)
    if (upload.length > 0) {
      for (let i = 0; i < upload.length; i++) {
        ToCommunity(upload[i].modleId, upload[i].common);
      }
      CommunityData.isUpLoad = false;
    }
  } else{
    let upload = state.UploadTp.filter((v) => {
      if (!v.common) return v;
    }); //将取消勾选的模板放进一个数组
    // console.log(upload)
    if (upload.length > 0) {
      for (let i = 0; i < upload.length; i++) {
        ToCommunity(upload[i].modleId, upload[i].common);
      }
      CommunityData.isUpLoad = false;
    }
  }
};
watch(
  () => CommunityData.isUpLoad,
  (newvalue) => {
    if (newvalue) {
      state.UploadTp = tpData.tp.filter((v) => {
        if (v.common && !v.MStatus) return v;
      }); //已上传的模板
      state.unUploadTp = tpData.tp.filter((v) => {
        if (!v.common && !v.MStatus) return v;
      }); //未上传的模板
    }
  }
);
//将模板上传到社区
async function ToCommunity(modleId, common) {
  let res = await toCommunity(modleId, common, userstore.user.token);
  console.log(res);
  if (res.data.msg.data.isPublic) {
  }
}
</script>

<style scoped lang="less">
@vw: 3.95vw;
.upload_page {
  z-index: 10000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition: left 0.2s;
  background-color: #ededed;
  overflow: hidden;

  header {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 (15 / @vw);
    width: 100%;
    height: (50 / @vw);
    background-color: #ffffff;
    // box-shadow: 0 (1 / @vw) (10 / @vw) rgba(0, 0, 0, 0.141);

    .icon-xiangzuojiantou {
      font-weight: 700;
    }

    .user_box {
      display: flex;
      align-items: center;
      margin-left: (20 / @vw);
    }

    .uploadMP {
      position: relative;
      width: (75 / @vw);
      height: (35 / @vw);
      background-color: #e1e1e1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: (10 / @vw);
      transition: all 0.3s;
      // box-shadow: (2 / @vw) (2 / @vw) (10 / @vw) rgba(0, 0, 0, 0.418);
    }

    .selected {
      background-color: #a48ec5;
      color: #fff;
      border: 0;
    }
  }

  .select_btns {
    margin-top: (50 / @vw);
    width: 100%;
    height: (40 / @vw);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    .hb_btn {
      font-weight: 200;
    }
  }

  .container {
    position: relative;
    width: 100vw;

    .container_scroll {
      position: absolute;
      top: 0;
      left: 0;
      width: 200vw;
      height: 100%;
      display: flex;
      transition: all 0.1s;
    }

    .scroll {
      left: -100vw;
    }

    .notUploaded,
    .Uploaded {
      width: 100vw;
      height: 88vh;
      overflow: scroll;
    }

    ul {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    li {
      width: 100vw;
      margin-top: (10 / @vw);
      background-color: rgb(255, 255, 255);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 (20 / @vw);
      opacity: 1;
    }
  }

  footer {
    width: 100%;
    height: (25 / @vw);
  }
}
</style>
