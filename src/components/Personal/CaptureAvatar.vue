<template>
  <div class="CaptureAvatar_page">
    <div class="CaptureBox" id="CaptureBox">
      <!-- 底层-存放需要截取而显示的照片 -->
      <img id="canvas_img" :src="curImg" class="canvas_img" ref="img_obj" />
      <!-- 截取的蒙版和截取区域 -->
      <div class="canvas_bg"></div>
      <canvas id="canvas" class="canvas" ref="can_obj"></canvas>
      <div id="canvas_div" class="canvas_div" ref="canvas_div"></div>
      <div class="canvas_btn">
        <a
          href="javascript:void(0);"
          class="canvas_cancel"
          @click="userData.CaptureAvatarIsShow = false"
          >取消</a
        >
        <a href=" javascript:void(0); " class="canvas_ok" @click="save_img"
          >确定</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import userCaptureAvatar from "@/hooks/userCaptureAvatar.js";
import { userStore } from "@/stores";
const props = defineProps(["curImg"]);
const emit = defineEmits(['onSaveImg']);
const userData = userStore();
let img_obj = ref(null).value;
let canvas_div = ref(null).value;
let can_obj = ref(null).value;
onMounted(() => {
  //等图片加载完成后调用裁剪图片函数
  img_obj.onload = () => {
    userCaptureAvatar(can_obj, img_obj, canvas_div);
  };
});
//保存图片
function save_img() {
  let fd = new FormData();
  let base64 = can_obj.toDataURL("image/jpeg", 1 || 0.8);
  let tofile = dataURLtoFile(base64, "image", "image/jpeg");
  fd.append("image", tofile);
  emit('onSaveImg',fd,base64);
}

//将base64转换成文件
function dataURLtoFile(dataURL, fileName, fileType) {
  let arr = dataURL.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: fileType || "image/jpg" });
}
</script>

<style scoped lang="less">
@vw: 3.95vw;
.CaptureBox {
  position: relative;
  width: (100vw);
  height: (100vh);
  overflow: hidden;

  .canvas_img,
  .canvas,
  .canvas_div,
  .canvas_btn,
  .canvas_bg {
    position: absolute;
  }

  .canvas_div,
  .canvas_bg {
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }

  .canvas_img {
    left: 50%;
    top: 50%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .canvas_img_ani {
    transition: all 0.3s;
  }

  .canvas_bg {
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 2;
  }

  .canvas {
    left: 50%;
    border: 1px solid #fff;
    top: 50%;
    width: (250 / @vw);
    height: (250 / @vw);
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  .canvas_div {
    z-index: 100;
  }

  .canvas_btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: (60 / @vw);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 (20 / @vw);
    background-color: #333;
    z-index: 1000;

    a {
      color: #fff;
      width: (60 / @vw);
      height: (30 / @vw);
      line-height: (30 / @vw);
      text-decoration: none;
      text-align: center;
    }

    .canvas_ok {
      height: (30 / @vw);
      background-color: purple;
      border-radius: (8 / @vw);
    }
  }
}
</style>
