<template>
  <div class="Making_page" @click="hiddenSome">
    <MkheaderVue :tp="Newtp"></MkheaderVue>
    <LoadingVue v-show="mkstore.isLoading"></LoadingVue>
    <div class="popup" v-show="mkstore.popupisShow">
      <div class="popup_box" @click="popupShow($event)">
        <button @click="save">直接保存</button>
        <button @click="EnterLearning()">进入编辑</button>
      </div>
    </div>
    <div class="popup2 modify_succani2" v-show="mkstore.popup2IsShow">
      <div class="popup_box">{{ mkstore.popup2Cont }}</div>
    </div>
    <!-- <Popup :show="mkstore.popup2IsShow" :text="mkstore.popup2Cont"></Popup> -->
    <div class="container">
      <div class="title">
        <div class="label" @click="showMenu($event)">
          <div class="label_cont">
            <span>{{ Newtp.label }}</span>
            <span class="icon iconfont icon-xiangxiajiantou"></span>
          </div>
          <div class="label_menu" ref="label_menu">
            <div class="triangle"></div>
            <ul @click="changeLabel($event)">
              <li>考研</li>
              <li>教资</li>
              <li>通识课</li>
            </ul>
          </div>
        </div>

        <input type="text" v-model="Newtp.modleTitle" />
      </div>
      <div class="text_box" ref="text_box" contenteditable="true">
        
      </div>
    </div>
  </div>
</template>

<script setup>
import Popup from "../components/global/popup.vue"
import MkheaderVue from "../components/MakingPage/Mkheader.vue";
import LoadingVue from "../components/MakingPage/Loading.vue";
import { reactive, ref, watch } from "vue";
import { mkStore, tpStore } from "@/stores";
import { MakeModle,UserMemory } from "@/request/api/memory.js";
const mkstore = mkStore();
const tpstore = tpStore();
const Newtp = reactive({
  context: "",
  modleTitle: "",
  label: "标签",
});
let text_box = ref(null).value;
let label_menu = ref(null).value;
mkstore.popup2IsShow = false;
mkstore.popupisShow = false;
mkstore.tipsIsShow = false;
//点击隐藏
const hiddenSome = () => {
  label_menu.style.transform = "scale(0)";
  mkstore.tipsIsShow = false;
  mkstore.popupisShow = false;
  mkstore.popup2IsShow = false;
};
//点击保存弹窗取消冒泡
const popupShow = (e) => {
  e.stopPropagation();
};
//点击出现下拉列表
const showMenu = (e) => {
  e.stopPropagation();
  label_menu.style.transform = "scale(1)";
};
//事件委托，为li绑定事件
const changeLabel = (e) => {
  e.stopPropagation();
  if (e.target.tagName == "LI") {
    Newtp.label = e.target.innerHTML;
    label_menu.style.transform = "scale(0)";
  }
};
//监听内容改变
watch(
  () => Newtp.context,
  () => {
    text_box.innerHTML = Newtp.context;
  }
);
//点击保存
async function save() {
  let res = await MakeModle(
    text_box.innerHTML,
    Newtp.modleTitle,
    0,
    tpstore.switchLabel(false, Newtp.label)
  );
  console.log(res);
  if (res.data.msg.code == 200) {
    tpstore.getTp(UserMemory);//获取用户模板
    mkstore.popup2IsShow = true;
    mkstore.popup2Cont = "保存成功";
    mkstore.popupisShow = false;
  }
}

const EnterLearning = () => {
  
}
</script>

<style scoped lang="less">
@vw: 3.95vw;
.Making_page {
  z-index: 1000;
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #aba3ca;
  overflow: hidden;
  transition: all 0.3s;

  .popup2 {
    z-index: 20000;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    .popup_box {
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
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: (18 / @vw);
      box-shadow: (2 / @vw) (2 / @vw) (6 / @vw) (2 / @vw)
        rgba(121, 121, 121, 0.38);
    }
  }

  .popup {
    z-index: 20000;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #00000078;

    .popup_box {
      position: absolute;
      width: (180 / @vw);
      height: (170 / @vw);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      z-index: 10000;
      border-radius: (10 / @vw);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      button {
        width: (120 / @vw);
        height: (50 / @vw);
        border: none;
        border-radius: (20 / @vw);
        box-shadow: (2 / @vw) (2 / @vw) (7 / @vw) rgba(0, 0, 0, 0.296);
        background-color: #978ed0;
        outline: none;
        font-size: (18 / @vw);

        &:last-child {
          margin-top: (25 / @vw);
        }
      }
    }
  }

  .container {
    width: 100%;
    margin-top: (20 / @vw);
    margin-bottom: (80 / @vw);

    .title {
      margin: 0 auto;
      width: (370 / @vw);
      height: (40 / @vw);
      box-shadow: (2 / @vw) (2 / @vw) (5 / @vw) rgba(0, 0, 0, 0.418);
      display: flex;
      border-radius: (5 / @vw);
      background-color: #eeedf5;

      .label {
        position: relative;
        width: (100 / @vw);
        height: 100%;
        text-align: center;
        line-height: (40 / @vw);
        font-size: (18 / @vw);
        border-right: (1 / @vw) solid rgb(150, 150, 150);
        border-radius: (5 / @vw) 0 0 (5 / @vw);
        // background-color: ;

        .icon {
          margin-left: (4 / @vw);
          font-size: (16 / @vw);
          font-weight: 700;
        }

        .label_menu {
          position: absolute;
          top: (50 / @vw);
          left: (6 / @vw);
          width: (90 / @vw);
          transition: all 0.3s;
          transform: scale(0);
          transform-origin: top center;
          border-radius: (10 / @vw);
          box-shadow: (1 / @vw) (1 / @vw) (6 / @vw) (1 / @vw)
            rgba(121, 121, 121, 0.38);

          .triangle {
            position: absolute;
            top: (-18 / @vw);
            left: (20 / @vw);
            width: 0px;
            height: 0px;
            z-index: 1000;
            border: 10px solid #000;
            border-top-color: transparent;
            border-bottom-color: #ffffff;
            border-left-color: transparent;
            border-right-color: transparent;
          }

          ul {
            width: 100%;
            height: (160 / @vw);
            padding: (5 / @vw) (10 / @vw);
            background-color: #ffffff;

            border-radius: (10 / @vw);

            li {
              width: 100%;
              height: (50 / @vw);
              padding: (10 / @vw) (0 / @vw);
              background-color: #ffffff;
              border-bottom: (1 / @vw) solid #c9c9ca;
              text-align: center;
              line-height: (30 / @vw);

              &:last-child {
                border-bottom: (0 / @vw);
              }
            }
          }
        }
      }

      input {
        border-radius: (5 / @vw);
        width: 100%;
        height: 100%;
        padding: (5 / @vw);
        font-size: (18 / @vw);
        border: none;
        background-color: #eeedf5;
        padding: 0 (10 / @vw);
        letter-spacing: 0.05rem;
      }
    }

    .text_box {
      background-color: rgb(250, 250, 250);
      margin: (20 / @vw) auto;
      width: (370 / @vw);
      height: 66vh;
      padding: (10 / @vw);
      overflow: scroll;
      outline: none;
      font-size: (18 / @vw);
      border-radius: (5 / @vw);
      box-shadow: (2 / @vw) (2 / @vw) (10 / @vw) rgba(0, 0, 0, 0.349);
      line-height: (35 / @vw);
      letter-spacing: 0.1rem;
      word-break: break-all;
    }
  }
}

.modify_succani2 {
  animation: modify_succani2 3s forwards;
}

@keyframes modify_succani2 {
  0% {
    opacity: 0.1;
    top: -10%;
  }

  40% {
    opacity: 1;
    top: 1%;
  }

  70% {
    opacity: 1;
    top: 1%;
  }

  100% {
    opacity: 0.1;
    top: -15%;
  }
}
</style>