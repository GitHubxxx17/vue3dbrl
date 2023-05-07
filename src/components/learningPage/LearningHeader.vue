<template>
  <header class="no-touch">
    <div class="header_left">
      <span class="icon iconfont icon-xiangzuojiantou" @click="exit"></span>
    </div>
    <!-- <div class="title ellipsis11">标题标题标题标题标题标题标题标题标题标题</div> -->
    <input
      class="title ellipsis"
      type="text"
      ref="title"
      disabled
      v-model="newTp.title"
    />
    <div class="header_right">
      <div class="label" @click="showMenu($event)">
        <span>{{ newTp.label }}</span>
      </div>
      <div class="label_menu" ref="label_menu">
        <div class="triangle"></div>
        <ul @click="changeLabel($event)">
          <li v-for="item in label" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onUpdated, watch, reactive } from "vue";
import { learnStore } from "@/stores";
import { showConfirmDialog } from "vant";
//父组件传过来的模板数据
const props = defineProps(["tp", "newTp"]);

//初始化数据
const learnstore = learnStore();
//标签
let label = ["考研", "教资", "通识课"];
let label_menu = ref(null).value;
let title = ref(null).value;
//点击出现下拉列表
const showMenu = (e) => {
  if (learnstore.isEdit) {
    e.stopPropagation();
    label_menu.style.transform = "scale(1)";
  }
};

//事件委托，为li绑定事件
const changeLabel = (e) => {
  if (e.target.tagName == "LI") {
    props.newTp.label = e.target.innerHTML;
    label_menu.style.transform = "scale(0)";
  }
};
//监听编辑
watch(
  () => learnstore.isEdit,
  (newvalue, oldvalue) => {
    if (newvalue) title.disabled = false;
    if (oldvalue) title.disabled = true;
  }
);

let exit = () => {
  //如果目前在自定义状态，则弹出是否退出自定义状态的弹窗
  if (learnstore.isCustom) {
    showConfirmDialog({
      message: "是否退出自定义模式？",
    })
      .then(() => {
        learnstore.isCustom = false; //确认退出
        learnstore.isWk = false;
        learnstore.isEdit = false;
      })
      .catch(() => {
        //取消退出
      });
  }
  //否则退出学习页面
  else {
    if (learnstore.isDictation) {
      showConfirmDialog({
        message: "是否保存当前学习记录？",
        beforeClose: (action) =>
          new Promise((resolve) => {
            setTimeout(() => {
              if (action === "confirm") {
                learnstore.ifSave = true;
                learnstore.LearningPageIsShow = false;
                learnstore.isRecite = false;
                learnstore.isDictation = false;
                resolve(true);
              } else {
                // 拦截取消操作
                learnstore.LearningPageIsShow = false;
                learnstore.isRecite = false;
                learnstore.isDictation = false;
                resolve(true);
              }
            }, 500);
          }),
      });
    } else {
      learnstore.LearningPageIsShow = false;
      learnstore.isRecite = false;
      learnstore.isDictation = false;
    }
  }
};
</script>

<style scoped lang="less">
@vw: 3.95vw;
header {
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  height: (65 / @vw);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 (15 / @vw);
  background-color: #fff;
  box-shadow: 0 (1 / @vw) (6 / @vw) rgba(0, 0, 0, 0.133);
  transition: all 0.4s ease-in-out;
  user-select: none;

  .header_left {
    width: (40 / @vw);
    user-select: none;

    .icon {
      font-weight: 700;
      font-size: (20 / @vw);
    }
  }

  .title {
    width: (200 / @vw);
    text-align: center;
    font-weight: 700;
    font-size: (20 / @vw);
    outline: 0;
    border: none;
    background-color: transparent;
    user-select: none;
  }

  .header_right {
    position: relative;
    user-select: none;

    .label {
      display: block;
      padding: 0 (10 / @vw);
      height: (30 / @vw);
      background-color: #5f4fb8a4;
      text-align: center;
      line-height: (30 / @vw);
      border-radius: (10 / @vw);
      color: #fff;
    }

    .label_menu {
      position: absolute;
      top: (50 / @vw);
      right: (0 / @vw);
      width: (90 / @vw);
      transition: all 0.3s;
      transform: scale(0);
      transform-origin: top center;
      border-radius: (10 / @vw);
      box-shadow: (1 / @vw) (1 / @vw) (6 / @vw) (1 / @vw)
        rgba(121, 121, 121, 0.38);

      .triangle {
        position: absolute;
        top: (-8 / @vw);
        right: (20 / @vw);
        width: (15 / @vw);
        height: (15 / @vw);
        transform: rotate(45deg);
        background-color: rgb(255, 255, 255);
        z-index: 5;
        border: 1px solid rgba(0, 0, 0, 0.132);
      }

      ul {
        position: relative;
        display: inline-block;
        width: 100%;
        height: (160 / @vw);
        padding: (5 / @vw) (10 / @vw);
        background-color: #ffffff;
        text-align: center;
        border-radius: (10 / @vw);
        z-index: 10;

        li {
          display: block;
          width: 100%;
          height: (50 / @vw);
          padding: (10 / @vw) (0 / @vw);
          background-color: #ffffff;
          border-bottom: (1 / @vw) solid #c9c9ca;
          text-align: center;
          line-height: (30 / @vw);
          box-shadow: (2 / @vw) (2 / @vw) (10 / @vw) rgba(255, 255, 255, 0);

          &:last-child {
            border-bottom: (0 / @vw);
          }
        }
      }
    }
  }
}
</style>