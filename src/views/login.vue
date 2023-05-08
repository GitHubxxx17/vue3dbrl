<template>
  <div class="login_page">
    <div class="bg">
      <div class="square">
        <ul>
          <li v-for="i in 5"></li>
        </ul>
      </div>
      <div class="circle">
        <ul>
          <li v-for="i in 5"></li>
        </ul>
      </div>
    </div>

    <header>
      <!-- <div class="header_btn">
        <a href="./homePage.html">返回</a>
      </div> -->
    </header>
    <div class="mar_box">
      <div class="container">
        <div class="register" @click="changeRegister">
          <div class="logo"></div>
          <form action="./index.html">
            <div class="form_control">
              <input
                class="register_data input"
                type="text"
                name="phone"
                required="required"
                pattern="^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$"
                title="请输入正确的手机号"
                :ref="inputRef"
                v-model="registerdata.phone"
              />
              <label :ref="labelRef">请输入手机号</label>
            </div>
            <div class="form_control">
              <input
                class="register_data input"
                type="text"
                name="username"
                required="required"
                pattern="^[0-9a-zA-Z\u4e00-\u9fa5]{1,6}$"
                title="请输入正确的昵称,不包括特殊字符"
                :ref="inputRef"
                v-model="registerdata.username"
              />
              <label :ref="labelRef">请输入昵称</label>
            </div>
            <div class="form_control">
              <input
                class="register_data input"
                type="password"
                name="password1"
                required="required"
                pattern="^[a-zA-Z0-9_]{6,16}$"
                title="密码为6到16位（字母，数字，下划线）"
                :ref="inputRef"
                v-model="registerdata.password1"
              />
              <label :ref="labelRef">请输入密码</label>
            </div>
            <div class="form_control">
              <input
                class="input"
                type="password"
                name="password2"
                required="required"
                pattern="^[a-zA-Z0-9_]{6,16}$"
                title="密码为6到16位（字母，数字，下划线）"
                :ref="inputRef"
                v-model="registerdata.password2"
              />
              <label :ref="labelRef">请确认密码</label>
            </div>
            <div class="captcha">
              <div class="form_control">
                <input
                  class="input"
                  type="text"
                  name="captcha"
                  required="required"
                  :ref="inputRef"
                  v-model="registerdata.code"
                />
                <label :ref="labelRef">请输入验证码</label>
              </div>
              <canvas
                class="search_canvas"
                ref="canvas"
                @click="changeCode($event)"
              ></canvas>
            </div>
            <div class="err" ref="registerErr">
              <p>请正确填写信息</p>
            </div>
            <button type="button" @click="register($router)">
              <span v-for="i in 4"></span>
              注册
            </button>
          </form>
        </div>

        <div class="login" ref="loginbox" @click="changeLogin">
          <div class="change" ref="change">没有账号，去注册</div>
          <div class="login_box">
            <div class="logo"></div>
            <form action="./index.html" class="form">
              <div class="form_control">
                <input
                  class="login_data input"
                  type="text"
                  name="identification"
                  required="required"
                  pattern="^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$"
                  title="请输入正确的手机号"
                  v-model="Logindata.phone"
                  :ref="inputRef"
                />
                <label :ref="labelRef">请输入手机号</label>
              </div>
              <div class="form_control">
                <input
                  class="login_data input"
                  type="password"
                  name="password"
                  required="required"
                  pattern="^[a-zA-Z0-9_]{6,16}$"
                  v-model="Logindata.password"
                  :ref="inputRef"
                />
                <label :ref="labelRef">请输入密码</label>
              </div>
              <div class="err" ref="loginErr">
                <p>手机号或密码错误</p>
              </div>
              <button type="button" @click="login($router)">
                <span v-for="i in 4"></span>
                登录
              </button>
              <div class="items">
                <input type="checkbox" class="auto" v-model="Logindata.auto" />
                <span>下次自动登录</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  checkUsedNumber,
  checkUserNickName,
  PostloginMsg,
  PostregisterloginMsg,
} from "@/request/api/user.js";
import { localSaveData, sessionSaveData } from "@/hooks/useStorage.js";
import { mainStore } from "@/stores";
let change = ref(null);
let loginbox = ref(null);
let labels = ref([]);
let inputs = ref([]);
let canvas = ref(null);
let loginErr = ref(null);
let registerErr = ref(null);
let mainstore = mainStore();
const Logindata = reactive({
  phone: "",
  password: "",
  auto: false,
});
const registerdata = reactive({
  phone: "",
  username: "",
  password1: "",
  password2: "",
  auto: false,
  checkMsg: 0,
  code: "",
});
const registerCheck = reactive({
  phone: false,
  username: false,
  password1: false,
  password2: false,
  code: false,
});
//获取标签
let labelRef = (el) => {
  labels.value.push(el);
};
//获取input
let inputRef = (el) => {
  inputs.value.push(el);
};
//点击切换到登录
let changeRegister = () => {
  loginbox.value.style.top = "142vw";
  change.value.style.top = "-8vw";
  change.value.innerHTML = "已有账号，去登录";
};
//点击切换到注册
let changeLogin = () => {
  loginbox.value.style.top = "36vw";
  change.value.style.top = "-25vw";
  change.value.innerHTML = "没有账号，去注册";
};
let phoneReg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
let passwordReg = /^[a-zA-Z0-9_]{6,16}$/;
let usernameReg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,6}$/;
//点击登录后进行判断
let login = async ($router) => {
  //判断手机号格式是否正确
  if (phoneReg.test(Logindata.phone) && passwordReg.test(Logindata.password)) {
    let res = await PostloginMsg(Logindata.phone, Logindata.password);
    let msg = res.data.msg;
    //登录成功
    if (msg.data.isSuccess) {
      //将当前登录的用户信息保存到本地
      let curr = {};
      curr["token"] = msg.data.token;
      curr["phone"] = Logindata.phone;
      //如果用户勾选自动登录，则将数据存储在本地
      if (Logindata.auto) {
        localSaveData("auto", true);
        localSaveData("user", curr);
      } else {
        localSaveData("auto", false);
        sessionSaveData("user", curr);
      }
      $router.push("/DueToday");
      mainstore.footerNavIsShow = true;
    } else {
      loginErr.value.style.opacity = 1;
    }
  } else {
    loginErr.value.style.opacity = 1;
  }
};
//点击注册后判断
let register = async ($router) => {
  if (
    registerCheck.phone &&
    registerCheck.username &&
    registerCheck.password1 &&
    registerCheck.password2 &&
    registerCheck.code
  ) {
    let res = await PostregisterloginMsg(
      registerdata.phone,
      registerdata.username,
      registerdata.password1
    );
    let msg = res.data.msg;
    if (msg.data.isSuccess) {
      //将当前注册的用户信息保存到本地
      let curr = {};
      curr["token"] = msg.data.userId;
      curr["phone"] = registerdata.phone;
      localSaveData("auto", false);
      sessionSaveData("user", curr);
      $router.push("/DueToday");
      mainstore.footerNavIsShow = true;
    } else {
      alert("注册失败，请重新注册");
    }
  } else {
    registerErr.value.style.opacity = 1;
  }
};
onMounted(() => {
  createCode();
  let labelStrArr = [];
  for (let i = 0; i < inputs.value.length; i++) {
    labelStrArr.push(labels.value[i].innerHTML);
    inputs.value[i].onblur = () => {
      if (i == 0) {
        if (phoneReg.test(registerdata.phone)) {
          getcheckUsedNumber(registerdata.phone, i); //检查手机号是否被注册
        } else if (inputs.value[i].value != "") {
          labels.value[i].innerHTML = "手机号格式错误";
          labels.value[i].style.color = "red";
          registerCheck.phone = false;
        }
      }
      if (i == 1) {
        if (usernameReg.test(registerdata.username)) {
          getcheckUserNickName(registerdata.username, i); //检查昵称是否被注册
        } else if (inputs.value[i].value != "") {
          labels.value[i].innerHTML = "昵称格式错误";
          labels.value[i].style.color = "red";
          registerCheck.username = false;
        }
      }
      if (
        i == 2 &&
        inputs.value[i].value != "" &&
        !passwordReg.test(inputs.value[i].value) //检查密码格式
      ) {
        labels.value[i].innerHTML = "密码为6到16位(字母,数字,下划线)";
        labels.value[i].style.color = "red";
        registerCheck.password1 = false;
      } else {
        registerCheck.password1 = true;
      }

      if (
        inputs.value[2].value != inputs.value[3].value && //检查两次密码是否一致
        inputs.value[2].value != "" &&
        inputs.value[3].value != ""
      ) {
        labels.value[i].innerHTML = "两次密码不一致";
        labels.value[i].style.color = "red";
        registerCheck.password2 = false;
      } else {
        registerCheck.password2 = true;
      }

      if (
        i == 4 &&
        inputs.value[4].value != "" &&
        registerdata.code.toUpperCase() != code.value.toUpperCase()
      ) {
        labels.value[i].innerHTML = "验证码错误";
        labels.value[i].style.color = "red";
        registerCheck.code = false;
      } else {
        registerCheck.code = true;
      }

      //当input失焦时，如果内容为空删除动画，否则添加
      if (inputs.value[i].value == "") {
        labels.value[i].classList.remove("label_change");
      }
    };
    inputs.value[i].onfocus = () => {
      labels.value[i].innerHTML = labelStrArr[i];
      labels.value[i].style.color = "#000";
      labels.value[i].classList.add("label_change");
      loginErr.value.style.opacity = 0;
      registerErr.value.style.opacity = 0;
    };
  }
});
//检查手机号是否被注册
async function getcheckUsedNumber(phone, i) {
  let res = await checkUsedNumber(phone);
  if (!res.data.msg.data.isOk) {
    labels.value[i].innerHTML = res.data.msg.content;
    labels.value[i].style.color = "red";
    registerCheck.phone = false;
  } else {
    registerCheck.phone = true;
  }
}
//检查昵称是否被注册
async function getcheckUserNickName(username, i) {
  let res = await checkUserNickName(username);
  if (!res.data.msg.data.isOk) {
    labels.value[i].innerHTML = res.data.msg.content;
    labels.value[i].style.color = "red";
    registerCheck.username = false;
  } else {
    registerCheck.username = true;
  }
}
//验证码
let code = ref("");
//将函数返回值赋给code

//点击canvas图片更换验证码
let changeCode = (e) => {
  createCode();
  e.stopPropagation();
  inputs.value[4].focus();
};

function rand() {
  //去掉i,I,l,o,O等易混淆字母
  var str = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  //将字符串分隔为数组
  var arr = str.split("");
  //随机字符在[0,56]之间
  var ranNum = Math.floor(Math.random() * 57);
  var captcha = arr[ranNum];
  return captcha;
}

function drawline(canvas, context) {
  //若省略beginPath，则每点击一次验证码会累积干扰线的条数
  context.beginPath();
  //起点与终点在canvas宽高内随机
  context.moveTo(
    Math.floor(Math.random() * canvas.value.width),
    Math.floor(Math.random() * canvas.value.height)
  );
  context.lineTo(
    Math.floor(Math.random() * canvas.value.width),
    Math.floor(Math.random() * canvas.value.height)
  );
  context.lineWidth = 1;
  context.strokeStyle = "#000";
  context.stroke();
}

/*生成验证码*/
function createCode() {
  //每次生成code先将其清空防止叠加
  code.value = "";
  var context = canvas.value.getContext("2d");
  context.clearRect(0, 0, canvas.value.width, canvas.value.height);
  context.strokeStyle = "#FFF";
  context.strokeRect(0, 0, canvas.value.width, canvas.value.height);

  //生成干扰线，数量随意
  for (let i = 0; i < 30; i++) {
    drawline(canvas, context);
  }

  //循环生成5位验证码
  for (let k = 0; k < 5; k++) {
    context.font = "76px Arial";
    //将初始状态保存
    context.save();
    //获得-1到1的随机数
    var rA = 1 - Math.random() * 2;
    //获取随机倾斜角
    var angle = rA / 8;
    var ranNum = rand();
    //旋转生成的随机字符
    context.rotate(angle);
    //把rand()生成的随机数文本依次填充到canvas中，注意x坐标
    context.fillText(ranNum, 20 + 45 * k, 100);
    //恢复初始状态，以便下一次循环
    context.restore();
    code.value += ranNum;
  }
}
</script>

<style scoped lang="less">
@vw: 3.95vw;

.bg {
  z-index: 0;
  position: absolute;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(to top, #e3c5eb, #a9c1ed, #e3c5eb);
}

ul li {
  position: absolute;
  border: 1px solid #fff;
  background-color: #fff;
  width: 30px;
  height: 30px;
  list-style: none;
  opacity: 0;
}

.square li {
  top: 40vh;
  left: 60vw;
  /* 执行动画：动画名 时长 线性的 无限次播放 */
  animation: square 10s linear infinite;
}

.square li:nth-child(2) {
  top: 80vh;
  left: 10vw;
  /* 设置动画延迟时间 */
  animation-delay: 2s;
}

.square li:nth-child(3) {
  top: 80vh;
  left: 85vw;
  /* 设置动画延迟时间 */
  animation-delay: 4s;
}

.square li:nth-child(4) {
  top: 10vh;
  left: 70vw;
  /* 设置动画延迟时间 */
  animation-delay: 6s;
}

.square li:nth-child(5) {
  top: 10vh;
  left: 10vw;
  /* 设置动画延迟时间 */
  animation-delay: 8s;
}

.circle li {
  bottom: 0;
  left: 15vw;
  /* 执行动画 */
  animation: circle 10s linear infinite;
}

.circle li:nth-child(2) {
  left: 35vw;
  /* 设置动画延迟时间 */
  animation-delay: 2s;
}

.circle li:nth-child(3) {
  left: 55vw;
  /* 设置动画延迟时间 */
  animation-delay: 6s;
}

.circle li:nth-child(4) {
  left: 75vw;
  /* 设置动画延迟时间 */
  animation-delay: 4s;
}

.circle li:nth-child(5) {
  left: 90vw;
  /* 设置动画延迟时间 */
  animation-delay: 8s;
}

/* 定义动画 */
@keyframes square {
  0% {
    transform: scale(0) rotateY(0deg);
    opacity: 1;
  }

  100% {
    transform: scale(5) rotateY(1000deg);
    opacity: 0;
  }
}

@keyframes circle {
  0% {
    transform: scale(0) rotateY(0deg);
    opacity: 1;
    bottom: 0;
    border-radius: 0;
  }

  100% {
    transform: scale(5) rotateY(1000deg);
    opacity: 0;
    bottom: 90vh;
    border-radius: 50%;
  }
}

header {
  position: relative;
  top: 0;
  left: 0;
  height: (60 / @vw);
  width: 100%;
  padding: (10 / @vw);
  .header_btn {
    width: (40 / @vw);
    height: (40 / @vw);
    background-color: rgba(255, 255, 255, 0.681);
    border-radius: 50%;
    font-size: (14 / @vw);

    a {
      text-align: center;
      line-height: (40 / @vw);
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
}

.mar_box {
  width: 100%;
  margin-top: calc((100vh - 165vw) / 2);

  .container {
    position: relative;
    margin: 0 auto;
    width: (304 / @vw);
    height: (574 / @vw);
    border-radius: (5 / @vw);
    box-shadow: (5 / @vw) (5 / @vw) (20 / @vw) rgb(0 0 0 / 10%);
    overflow: hidden;
    transition: all 0.5s linear;
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.526);

    .register {
      width: 100%;
      height: 100%;
      padding-top: (28 / @vw);
      // background: linear-gradient(to bottom, #a7bfe8, #6190e8);
      transition: all 0.3s linear;

      // backdrop-filter: blur(20px);
      .logo {
        width: (230 / @vw);
        height: (43 / @vw);
        background-size: cover;
        margin: 0 auto (20 / @vw);
      }

      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        .err {
          opacity: 0;
          position: absolute;
          top: 78%;
          left: 10%;
          color: red;
          transition: 0.2s;
        }

        .show {
          display: block;
        }

        .captcha {
          position: relative;
          height: (58 / @vw);
          width: (248 / @vw);
          margin: (20 / @vw) 0 0;
          display: flex;
          justify-content: space-between;
          color: #fac0e7;

          label {
            top: (16 / @vw);
          }

          .label_change {
            transform: scale(0.8) translateY(-(26 / @vw));
          }

          input {
            font-size: (16 / @vw);
            width: (110 / @vw);
            margin: 0;
          }

          canvas {
            width: 48%;
            height: (48 / @vw);
            background-color: #fff;
            border: 1px solid #000000;
          }
        }
      }
    }

    .form_control {
      position: relative;
      font-size: (16 / @vw);
      color: #000;

      label {
        position: absolute;
        top: (18 / @vw);
        left: 0;
        transition: all 0.5s;
        transform-origin: left top;
        pointer-events: none;
      }

      .label_change {
        transform: scale(0.8) translateY(-(22 / @vw));
      }

      input {
        background-color: transparent !important;
        padding: (8 / @vw) 0;
        height: (48 / @vw);
        width: (248 / @vw);
        margin: (6 / @vw) 0;
        font-size: (16 / @vw);
        border: none;
        color: #000;
        border-bottom: (1 / @vw) solid #000;
        transition: all 0.5s;

        &:focus {
          border-bottom: (2 / @vw) solid #fac0e7;
        }
      }
    }

    button {
      position: relative;
      cursor: pointer;
      margin-top: (26 / @vw);
      font-size: (20 / @vw);
      height: (58 / @vw);
      width: (248 / @vw);
      text-align: center;
      line-height: (58 / @vw);
      font-weight: bolder;
      border: 0;
      overflow: hidden;
      background-image: linear-gradient(200deg, #e3c5eb, #a9c1ed, #e3c5eb);
      color: #000;
      transition: all 0.1s;
      box-shadow: (3 / @vw) (3 / @vw) (6 / @vw) rgba(0, 0, 0, 0.526);

      span {
        position: absolute;
        display: block;

        &:nth-child(1) {
          top: 0;
          left: -100%;
          width: 100%;
          height: (2 / @vw);
          background: linear-gradient(90deg, transparent, #3a7fff);
          animation: btn-anim1 1s linear infinite;
        }

        &:nth-child(2) {
          top: -100%;
          right: 0;
          width: (2 / @vw);
          height: 100%;
          background: linear-gradient(180deg, transparent, #3a7fff);
          animation: btn-anim2 1s linear infinite;
          animation-delay: 0.25s;
        }

        &:nth-child(3) {
          bottom: 0;
          right: -100%;
          width: 100%;
          height: (2 / @vw);
          background: linear-gradient(270deg, transparent, #3a7fff);
          animation: btn-anim3 1s linear infinite;
          animation-delay: 0.5s;
        }

        &:nth-child(4) {
          bottom: -100%;
          left: 0;
          width: (2 / @vw);
          height: 100%;
          background: linear-gradient(360deg, transparent, #3a7fff);
          animation: btn-anim4 1s linear infinite;
          animation-delay: 0.75s;
        }
      }

      &:active {
        box-shadow: 0 0 0 rgba(0, 0, 0, 0.526);
      }
    }

    .login {
      z-index: 1000;
      background-color: #fff;
      position: absolute;
      top: 36vw;
      width: 100%;
      display: flex;
      justify-content: center;
      transition: all 0.3s linear;

      .change {
        font-size: (16 / @vw);
        position: absolute;
        top: -25vw;
        height: (24 / @vw);
        line-height: (24 / @vw);
        font-size: (14 / @vw);
        color: rgba(16, 16, 16, 1);
        transition: all 0.4s linear;
        pointer-events: none;
      }

      .login_box {
        .logo {
          width: (230 / @vw);
          height: (43 / @vw);
          background-size: cover;
          margin: 0 auto (20 / @vw);
        }

        form {
          .err {
            opacity: 0;
            position: absolute;
            top: 60%;
            left: 10%;
            color: red;
            transition: 0.2s;
          }

          button {
            margin: (41 / @vw) 0 (20 / @vw);
          }

          .items {
            height: (20 / @vw);
            font-size: (14 / @vw);

            .auto {
              vertical-align: middle;
              width: (24 / @vw);
              height: (18 / @vw);
              background-color: rgba(255, 255, 255, 1);
              text-align: center;
              border: 1px solid rgba(187, 187, 187, 1);
            }
          }
        }
      }

      &::after {
        z-index: -1;
        position: absolute;
        top: -(50 / @vw);
        content: "";
        width: (700 / @vw);
        height: (500 / @vw);
        border-radius: 50%;
        background-color: aliceblue;
        transition: all 0.4s linear;
      }
    }
  }
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }

  50%,
  100% {
    top: 100%;
  }
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }

  50%,
  100% {
    right: 100%;
  }
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }

  50%,
  100% {
    bottom: 100%;
  }
}
</style>