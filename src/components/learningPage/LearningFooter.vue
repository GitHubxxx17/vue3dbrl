<template>
  <footer class="no-touch">
    <div class="footer_1" v-show="!learnstore.isCustom">
      <ul>
        <li class="custom" @click="custom">
          <span class="icon iconfont icon-tiku"></span>
          <div class="name">自定义</div>
        </li>
        <li
          class="recite"
          @click="recite"
          :class="{ choice: learnstore.isRecite }"
        >
          <span class="icon iconfont icon-yanjing"></span>
          <div class="name">背诵</div>
        </li>
        <li
          class="dictation"
          @click="dictation"
          :class="{ choice: learnstore.isDictation }"
        >
          <span class="icon iconfont icon-zhinengmoxie"></span>
          <div class="name">默写</div>
        </li>
        <li class="tijiao" @click="submit" :class="{ choice: learnstore.isSubmit }">
          <span class="icon iconfont icon-tijiao"></span>
          <div class="name">提交</div>
        </li>
      </ul>
    </div>
    <div class="footer_2" v-show="learnstore.isCustom">
      <ul>
        <li class="bianji" @click="edit" :class="{ choice: learnstore.isEdit }">
          <span class="icon iconfont icon-tiku"></span>
          <div class="name">编辑</div>
        </li>
        <li class="wakong" @click="wakong" :class="{ choice: learnstore.isWk }">
          <span class="icon iconfont icon--wakuangjiankong"></span>
          <div class="name">挖空</div>
        </li>
        <li class="SystemWakong" @click="SystemWakong" :class="{ choice: learnstore.isSystemWk }">
          <span class="icon iconfont icon-watian"></span>
          <div class="name">系统挖空</div>
        </li>
        <li class="save" @click="save">
          <span class="icon iconfont icon-tijiao"></span>
          <div class="name">保存</div>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { learnStore,tpStore } from "@/stores";
import { showConfirmDialog } from "vant";
const props = defineProps(['newTp']);
//标签
let label = ["考研", "教资", "通识课"];
//初始化数据
let learnstore = learnStore();
const tpData = tpStore();
//点击进入自定义
let custom = () => {
  learnstore.isCustom = true;
  learnstore.isRecite = false;
  learnstore.isDictation = false;
  learnstore.isSubmit = false;
};
//点击进入背诵
let recite = () => {
  learnstore.isRecite = !learnstore.isRecite;
  learnstore.isDictation = false;
  learnstore.isSubmit = false;
};
//点击进入默写
let dictation = () => {
  learnstore.isDictation = !learnstore.isDictation;
  learnstore.isRecite = false;
  learnstore.isSubmit = false;
};
//点击提交
let submit = () => {
  if (learnstore.isDictation) {
    learnstore.isSubmit = true;
  }
};

//点击进入挖空
let wakong = () => {
  learnstore.isWk = true;
  learnstore.isEdit = false;
};

//点击进入系统挖空
let SystemWakong = (e) => {
  e.stopPropagation();
  learnstore.isSystemWk = true;
  learnstore.isWk = false;
  learnstore.isEdit = false;
};
//点击进入编辑
let edit = () => {
  learnstore.isEdit = true;
  learnstore.isWk = false;
};

//点击保存
let save = () => {
  learnstore.isSave = false;
  showConfirmDialog({
    message: "是否保存当前更改？",
    beforeClose: (action) =>
      new Promise((resolve) => {
        setTimeout(() => {
          if (action === "confirm") {
            for(let x of tpData.tp){
              if(props.newTp.title == x.modleTitle && props.newTp.modleId != x.modleId){

                tpData.popupIsShow = true;
                tpData.popupCont = '标题不能重复';
                resolve(true);
                return;
              }
            }
            learnstore.isSave = true;
            learnstore.isCustom = false; //确认退出
            resolve(true);
          } else {
            // 拦截取消操作
            resolve(true);
          }
        }, 500);
      }),
  });
};
</script>

<style scoped lang="less">
@vw: 3.95vw;
footer {
  width: 100%;
  height: (90 / @vw);
  z-index: 100;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: all 0.3s;

  // background-color: #b8b2c9;
  &::after {
    z-index: -1;
    content: "";
    width: 100%;
    height: (110 / @vw);
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(
      to top,
      rgb(255, 255, 255) 80%,
      transparent
    );
  }

  .footer_1,
  .footer_2 {
    width: 100%;
    height: 100%;
  }

  ul {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  li {
    height: 100%;
    flex: 4;
    font-size: (14 / @vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #a1a4b4;
    transition: all 0.2s ease-in-out;

    .icon {
      font-size: (26 / @vw);
    }

    .name {
      margin-top: (8 / @vw);
      position: relative;
    }
  }

  .footer_2 {
    li {
      &:nth-child(2) .icon,
      &:nth-child(3) .icon {
        font-size: (30 / @vw);
      }
    }
  }

  .choice {
    color: rgb(132, 179, 255) !important;
  }
}
</style>