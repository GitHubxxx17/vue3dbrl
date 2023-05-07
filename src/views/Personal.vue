<template>
  <div class="personal">
    <div class="person_main" style="display: block">
      <div class="modify_succ">修改成功</div>
      <div class="personal_box">
        <div class="head_portrait">
          <form class="img_form">
            <input
              type="file"
              accept=".jpg"
              name="image"
              @change="upLoadAvatar($event)"
            />
          </form>
          <img
            :src="
              userstore.user.base64 == ''
                ? 'src/assets/头像-女学生2.png'
                : userstore.user.base64
            "
          />
        </div>
        <div class="idname_box modify_lis" @click="EnterModify(0)">
          <div class="nicheng">昵称</div>
          <div class="right">
            <div class="idname modify_value">
              {{ userstore.user.nickName || "?" }}
            </div>
            <i class="iconfont icon-xiangyoujiantou"></i>
          </div>
        </div>
        <div class="common mail_box modify_lis" @click="EnterModify(1)">
          <div class="title_box">修改手机号</div>
          <div class="right">
            <div class="phone modify_value"></div>
            <i class="right iconfont icon-xiangyoujiantou"></i>
          </div>
        </div>
        <div class="common modify_lis" @click="EnterModify(2)">
          <div class="title_box">修改密码</div>
          <i class="right iconfont icon-xiangyoujiantou"></i>
        </div>
      </div>
      <div class="system_settings">
        <div
          class="common"
          v-for="(item, i) in settingsText"
          :key="item"
          @click="Entersetting(i)"
        >
          <div class="title_box">{{ item }}</div>
          <i class="right iconfont icon-xiangyoujiantou"></i>
        </div>
      </div>
      <div class="exit" @click="exit($router)">
        <button>退出登录</button>
      </div>
    </div>
  </div>
  <van-popup
    :show="userstore.ModifyisShow"
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <Modify :index="index"></Modify>
  </van-popup>
  <van-popup
    :show="userstore.TutorialIsShow"
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <NoviceTutorial></NoviceTutorial>
  </van-popup>
  <van-popup
    :show="userstore.CaptureAvatarIsShow"
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <CaptureAvatar :curImg="curImg" @onSaveImg="onSaveImg"></CaptureAvatar>
  </van-popup>
</template>

<script setup>
import { reactive, ref } from "vue";
import { userStore } from "@/stores";
import {uploadImg} from "@/request/api/user.js"
import Modify from "../components/Personal/Modify.vue";
import NoviceTutorial from "../components/Personal/NoviceTutorial.vue";
import CaptureAvatar from "../components/Personal/CaptureAvatar.vue";
let settingsText = ref(["新手教程", "显示设置", "关于我们"]);
let userstore = userStore();
let index = ref(0);
let curImg = ref('');
//退出登录
let exit = ($router) => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  $router.push("/login");
};
//进入修改页面
let EnterModify = (i) => {
  index.value = i;
  userstore.ModifyisShow = true;
};
//进入新手教程
let Entersetting = (i) => {
  if (i == 0) userstore.TutorialIsShow = true;
};
//上传头像
let upLoadAvatar = (e) => {
  let fileList = e.target.files;
  if (fileList) {
    
    // let fd = new FormData();
    let reader = new FileReader();
    reader.readAsDataURL(fileList[0]);//将读取到的文件转换成路径
     reader.onloadend = function (e) {
            curImg.value = e.target.result;
            userstore.CaptureAvatarIsShow = true;
        };
  }
};
//保存头像
let onSaveImg = async (fd,base64) => {
  let res = await uploadImg(fd);
  console.log(res);
  userstore.CaptureAvatarIsShow = false;
  if(res.data.msg.data.uploadSuccess){
    userstore.user.base64 = base64;
  }
}
</script>

<style scoped lang="less">
@vw: 3.95vw;
.personal {
  z-index: 1000;
  position: absolute;
  top: 0;
  transition: all 0.3s;
  width: 100vw;
  height: calc(100% - 17vw);
  background-color: #f4f4f4;
  overflow: hidden;
  .person_main {
    width: 100%;
    height: 100%;
    .modify_succ {
      z-index: 500;
      position: absolute;
      top: -10%;
      left: 50%;
      transform: translateX(-50%);
      width: (150 / @vw);
      height: (40 / @vw);
      // border-radius: (10 / @vw);
      background-color: #eae5ff;
      text-align: center;
      line-height: (40 / @vw);
      font-size: (20 / @vw);
    }

    .modify_succani {
      animation: modify_succani 2s 0.2s;
    }

    @keyframes modify_succani {
      0% {
        top: -10%;
      }
      50% {
        top: 4%;
      }
      70% {
        top: 4%;
      }
      100% {
        top: -10%;
      }
    }

    .system_settings,
    .personal_box {
      background-color: #fff;
      padding: 0 (30 / @vw);
      // border-radius: 5%;
      .head_portrait {
        margin: 0 auto;
        position: relative;
        width: (110 / @vw);
        height: (110 / @vw);
        display: flex;
        justify-content: center;

        input {
          width: 100%;
          height: 100%;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 100%;
          z-index: 11;
        }

        img {
          width: (110 / @vw);
          height: (110 / @vw);
          border-radius: 100%;
        }
      }

      .idname_box {
        margin-top: (15 / @vw);
        display: flex;
        justify-content: space-between;

        .nicheng {
          height: (60 / @vw);
          line-height: (60 / @vw);
        }

        .right {
          display: flex;
          justify-content: space-between;
          height: (60 / @vw);
          line-height: (60 / @vw);
          .idname {
            color: #8d8a8a;
            margin-right: (5 / @vw);
          }
        }
      }

      .phone {
        color: #8d8a8a;
        margin-right: (5 / @vw);
      }

      .common {
        display: flex;
        justify-content: space-between;

        .title_box {
          height: (60 / @vw);
          line-height: (60 / @vw);
        }

        .right {
          display: flex;
          justify-content: space-between;
          height: (60 / @vw);
          line-height: (60 / @vw);
        }
      }
    }

    .personal_box {
      padding-top: (20 / @vw);
    }

    .system_settings {
      margin-top: (15 / @vw);
    }

    .exit {
      margin: 0 auto;
      margin-top: (20 / @vw);
      width: (240 / @vw);
      button {
        width: (250 / @vw);
        height: (50 / @vw);
        // background-color: rgba(248, 200, 8, 0.425);
        background-color: #ffd161;
        border: 0;
        font-size: (20 / @vw);
        border-radius: (5 / @vw);
      }
    }
  }
}
</style>