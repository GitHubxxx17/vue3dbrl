<template>
  <header>
    <div class="header_left">
      <div class="daoru">
        <span class="icon iconfont icon-daoru"></span>
        <div class="name">导入</div>
        <form class="upload_form" ref="upload_form">
          <input
            type="file"
            accept="application/msword, application/pdf "
            name="upLoadFile"
            @change="uploadFile($event)"
          />
        </form>
      </div>
      <span class="shuxian">|</span>
      <div class="kuohao">
        <div class="switch" ref="switchRef" @click="switchWk">
          <div class="ball" ref="ball"></div>
        </div>
        &nbsp;
        <span
          @click="ShowTips($event)"
          class="iconfont icon-tuoyuankaobei"
        ></span>
      </div>
      <div class="tips" ref="tips">打开开关即可自动识别括号挖空</div>
    </div>

    <div class="header_right" @click="popupShow($event)">
      <span
        class="icon iconfont icon-gongxiangtubiaozhuangtaileicaozuolei37"
      ></span>
      <div class="name">保存</div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from "vue";
import { mkStore, tpStore } from "@/stores";
import { upload } from "@/request/api/memory.js";
const props = defineProps(["tp"]);
const mkstore = mkStore();
const tpstore = tpStore();
let ball = ref(null);
let switchRef = ref(null);
let tips = ref(null);
let upload_form = ref(null);
//识别挖空开关
const switchWk = () => {
  if (ball.value.offsetLeft == 0) {
    ball.value.style.left = 25 / 3.95 + "vw";
    ball.value.style.backgroundColor = "#b6a2f0";
    switchRef.value.style.backgroundColor = "#8777ae";
    mkstore.isIdentifyWk = true;
  } else {
    ball.value.style.left = 0 + "px";
    ball.value.style.backgroundColor = "#bfbfbf";
    switchRef.value.style.backgroundColor = "#b1adbb";
    mkstore.isIdentifyWk = false;
  }
};
//展示说明
const ShowTips = (e) => {
  e.stopPropagation();
  mkstore.tipsIsShow = !mkstore.tipsIsShow;
};
//展示弹窗
const popupShow = (e) => {
  e.stopPropagation();
  if (props.tp.modleTitle == "") {
    mkstore.popup2IsShow = true;
    mkstore.popup2Cont = "标题不能为空";
    return;
  }
  for (let x of tpstore.tp) {
    if (props.tp.modleTitle == x.modleTitle) {
      mkstore.popup2IsShow = true;
      mkstore.popup2Cont = "标题不能重复";
      return;
    }
  }
  if (props.tp.label == "标签") {
    mkstore.popup2IsShow = true;
    mkstore.popup2Cont = "标签不能为空";
  } else {
    mkstore.popupisShow = true;
  }
};
//监听说明展示
watch(
  () => mkstore.tipsIsShow,
  (newvalue, oldvalue) => {
    if (newvalue) tips.value.style.transform = "scale(1)";
    if (oldvalue) tips.value.style.transform = "scale(0)";
  }
);
//上传文件
const uploadFile = async (e) => {
  let file = e.target.files[0];
  console.log(file);
  if (e.target.files.length != 0) {
    mkstore.isLoading = true; //上传动画
    let fd = new FormData(upload_form.value);
    let res = await upload(fd);
    console.log(res);
    if (res.data.msg.code == 200) {
      mkstore.isLoading = false;
      let newcontext = res.data.msg.data.context.replaceAll('\n','<br>');
      props.tp.context = newcontext;
      props.tp.modleTitle = file.name;
      e.target.value = "";
      mkstore.popup2IsShow = true;
      mkstore.popup2Cont = "文件解析成功";
    }
  }
};
</script>

<style scoped lang="less">
@vw: 3.95vw;
header {
  margin-top: (10 / @vw);
  width: 100%;
  height: (65 / @vw);
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 (15 / @vw);

  .header_left,
  .header_right {
    position: relative;
    width: (80 / @vw);
    height: (40 / @vw);
    background-color: #eeedf5;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: (10 / @vw);
    box-shadow: (2 / @vw) (2 / @vw) (10 / @vw) rgba(0, 0, 0, 0.418);

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }

    .icon {
      font-size: (25 / @vw);
      margin-right: (5 / @vw);
    }

    .icon {
      font-size: (23 / @vw);
    }
  }

  .header_left {
    width: (175 / @vw);
    padding: 0 (10 / @vw);
    padding-right: (15 / @vw);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .daoru {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: (5 / @vw);
    }

    .shuxian {
      color: #c9c9ca;
    }

    .kuohao {
      margin-left: (8 / @vw);
      display: flex;
      align-items: center;

      .icon-tuoyuankaobei {
        margin-left: (2 / @vw);
        font-size: (14 / @vw);
        color: #a0a0a1;
      }
    }

    .tips {
      display: block;
      position: absolute;
      color: #a0a0a1;
      font-size: (12 / @vw);
      width: (95 / @vw);
      background-color: #fff;
      top: (28 / @vw);
      right: (-80 / @vw);
      padding: (5 / @vw);
      border-radius: (5 / @vw);
      transition: all 0.3s;
      transform-origin: left top;
      transform: scale(0);
    }
  }

  .switch {
    position: relative;
    background-color: #b1adbb;
    width: (45 / @vw);
    height: (20 / @vw);
    border-radius: (60 / @vw);
    box-shadow: inset (1 / @vw) (1 / @vw) (10 / @vw) rgba(0, 0, 0, 0.224);
    transition: 0.3s;
    .ball {
      position: absolute;
      width: (20 / @vw);
      height: (20 / @vw);
      background-color: #bfbfbf;
      border-radius: 50%;
      transition: 0.3s;
      left: 0;
      box-shadow: (1 / @vw) (1 / @vw) (10 / @vw) rgba(0, 0, 0, 0.224);
    }

    .ball.kai {
      background-color: #ffd161;
    }
  }

  .switch.kai {
    background-color: #fac338;
  }
}
</style>