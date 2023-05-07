<template>
  <div class="learn_page" @click="closePopup">
    <LearningHeader :tp="tp" :newTp="newTp"></LearningHeader>
    <van-dialog show-cancel-button></van-dialog>
    <div
      class="popup"
      v-show="popupdata.isShow"
      @click="popupdata.isShow = false"
    >
      <div class="popup_box">
        <div class="left" ref="popupCircle">
          <div class="circle">{{ popupdata.state[popupdata.index] }}</div>
        </div>
        <div class="right">
          <div class="score">{{ popupdata.score }}</div>
          <div class="score_title">本次正确率：{{ popupdata.score }}%</div>
        </div>
      </div>
    </div>
    <div class="popup2 ani_show" v-show="tpstore.popupIsShow">
      <div class="popup_box">{{ tpstore.popupCont }}</div>
    </div>
    <div class="popup4" v-show="learnstore.isSystemWk">
      <div class="popup_box" @click="systemWkSelect">
        <div class="dif_title">请选择随机挖空难度：</div>
        <div class="select_diff">
          <div
            v-for="(diff, i) of select_diff.keys()"
            :key="diff"
            class="com"
            :class="{ active: select_active[i] }"
          >
            {{ diff }}
          </div>
        </div>
        <div class="selection">
          <div class="context">选好了</div>
        </div>
      </div>
    </div>
    <div class="container" @mousedown="wakong">
      <div class="text_box" ref="text_box"></div>
    </div>
    <LearningFooter :newTp="newTp"></LearningFooter>
  </div>
</template>

<script setup>
import { onMounted, onUpdated, reactive, ref, watch } from "vue";
import { learnStore, tpStore, periodStore } from "@/stores";
import LearningHeader from "../components/learningPage/LearningHeader.vue";
import LearningFooter from "../components/learningPage/LearningFooter.vue";
import { showConfirmDialog } from "vant";
import {
  getAccuracy,
  MakeModle,
  JudgeStudyRecord,
  GetRecord,
  SaveRecord,
  JoinThePlane,
  FinishOnceReview,
  storeTime,
  autoDig,
} from "@/request/api/memory.js";
//父组件传过来的模板数据
const props = defineProps(["tp"]);
//初始化数据
const learnstore = learnStore();
const tpstore = tpStore();
const periodData = periodStore();
let text_box = ref(null);
let answer = []; //存放默写状态时高亮
let Record = []; //存放学习记录的填空
const newTp = reactive({
  //新的模板标题和标签
  title: props.tp.modleTitle,
  label: props.tp.modleLabel,
  modleId: props.tp.modleId,
});

const popupdata = reactive({
  //提交弹窗的数据
  state: ["陌生", "一般", "熟练"],
  score: "",
  isShow: false,
  index: 0,
});
let popupCircle = ref(null);
function getBackground(i, score) {
  if (i == 0) return `conic-gradient(#fda71c ${score}%, #fef6ea 0%)`;
  if (i == 1) return `conic-gradient(#02c287 ${score}%, #e1fbf2 0%)`;
  if (i == 2) return `conic-gradient(#5133febc ${score}%, #bcb0ffbc 0%)`;
}
// 关闭弹窗
const closePopup = () => {
  tpstore.popupIsShow = false;
  learnstore.isSystemWk = false;
};
//系统挖空选择
let select_diff = new Map([
  ["简单", "easy"],
  ["中等", "normal"],
  ["困难", "hard"],
]); //难度

let curDiff = ref("easy"); //当前选中的难度
let select_active = ref([true, false, false]);
const systemWkSelect = async (e) => {
  e.stopPropagation();
  if (e.target.classList.contains("com")) {
    //当目标为选择难度时
    let i = 0;
    select_diff.forEach((k, v) => {
      if (v == e.target.innerHTML) {
        select_active.value[i] = true;
        curDiff.value = k;
      } else {
        select_active.value[i] = false;
      }
      i++;
    });
  }
  if (e.target.classList.contains("context")) {
    //当目标为确认按钮时
    let res = await autoDig(curDiff.value, props.tp.modleId);
    console.log(res);
    if (res.data.msg.content == "挖空成功") {
      learnstore.isSystemWk = false;
      text_box.value.innerHTML = res.data.msg.data.content;
      for (let i = 0; i < text_box.value.children.length; i++) {
        console.log(text_box.value.children[i]);
        if (text_box.value.children[i].tagName == "DIV") {
          text_box.value.children[i].classList.add("highlight");
        }
      }
    }
  }
};

//当进入学习页面时将内容添加进去
onMounted(() => {
  if (learnstore.LearningPageIsShow) {
    newTp.title = props.tp.modleTitle.replaceAll('<span class="searched">','').replaceAll('</span>','');
    text_box.value.innerHTML = props.tp.content;
    learnstore.StartTime = new Date().getTime();
  }
});
watch(
  () => props.tp,
  () => {
    text_box.value.innerHTML = props.tp.content;
    newTp.title = props.tp.modleTitle.replaceAll('<span class="searched">','').replaceAll('</span>','');
    newTp.label = props.tp.modleLabel;
    newTp.modleId = props.tp.modleId;
    learnstore.haveRecord = false;
  }
);

watch(
  () => learnstore.LearningPageIsShow,
  async (newvalue, oldvalue) => {
    if (newvalue) {
      //当进入学习页面时把时间设置到当前时间
      learnstore.StartTime = new Date().getTime();
    }
    if (oldvalue) {
      //离开页面时将总时间计算出来，如果超过1分钟就将时间存储到后端
      learnstore.EndTime = new Date().getTime();
      let AllTime = (learnstore.EndTime - learnstore.StartTime) / 1000;
      console.log(AllTime);
      if (AllTime / 60 >= 1) {
        let res = await storeTime(
          Math.round(periodData.studyTime + AllTime / 60)
        );
        console.log(res);
      }
    }
  }
);

//监听编辑
watch(
  () => learnstore.isEdit,
  (newvalue) => {
    if (newvalue) {
      text_box.value.setAttribute("contenteditable", true);
    } else {
      text_box.value.setAttribute("contenteditable", false);
    }
  }
);

//选中文本进行挖空
let wakong = () => {
  //获取当前选中的文本对象
  let txt = window.getSelection();
  if (learnstore.isWk && txt.toString().length > 0) {
    //如果选中范围在高亮内部则取消挖空
    if (
      txt.anchorNode.parentNode === txt.focusNode.parentNode &&
      txt.anchorNode.parentNode.className == "highlight" &&
      txt.focusNode.parentNode.className == "highlight"
    ) {
      CancelHollowing(txt.anchorNode.parentNode);
      return;
    }
    //判断是否需要合并div
    let n = 0;
    // 获取当前selection对象下的range对象
    let range = txt.getRangeAt(0);
    // 创造新节点并将选中文本放进去
    let newNode = document.createElement("div");
    newNode.setAttribute("class", "highlight");
    newNode.innerHTML = range.toString();
    if (
      txt.anchorNode.parentNode.className == "container" ||
      txt.focusNode.parentNode.className == "container"
    ) {
      return;
    }
    if (
      txt.anchorNode.parentNode.className != "text_box" &&
      txt.anchorNode.parentNode.className != "highlight"
    ) {
      return;
    }
    if (txt.anchorNode.parentNode.className == "text_box") {
      if (txt.focusNode.parentNode.className == "highlight") {
      } else if (txt.focusNode.parentNode.className == "text_box") {
      } else {
        return;
      }
    }
    if (txt.anchorNode.parentNode.className == "highlight") {
      if (txt.focusNode.parentNode.className == "highlight") {
      } else if (txt.focusNode.parentNode.className == "text_box") {
      } else {
        return;
      }
    }

    //将选中的文本区域在页面删除并插入新节点
    txt.deleteFromDocument();
    range.insertNode(newNode);

    let len = text_box.value.children.length;
    //清除高亮标签后面的空文本
    function clean(x) {
      if (x.nextSibling) {
        if (x.nextSibling.textContent == "") {
          text_box.value.removeChild(x.nextSibling);
        }
      }
    }
    for (let i = 0; i < len; i++) {
      let x = text_box.value.children[i];
      if (x.tagName != "DIV") continue;
      //如果两个标签相邻时合并
      clean(x); //清除空标签
      while (x.nextSibling.className == "highlight") {
        // 将第二个节点的内容添加到第一个节点中，并且从页面中删除
        x.innerHTML += text_box.value.children[i + 1].innerHTML;
        len--;
        text_box.value.removeChild(text_box.value.children[i + 1]);
        clean(x); //清除空标签
      }
    }
  }
};

//选中文本取消挖空
function CancelHollowing(e) {
  //获取当前选中的文本对象
  let txt = window.getSelection();
  let range = txt.getRangeAt(0);
  //将选中节点的文本内容克隆一份
  let nonestr = document.createTextNode("");
  let text = document.createTextNode(range.toString());
  //将选中节点删除
  txt.deleteFromDocument();
  //在原来的位置重新将文本插入
  range.insertNode(nonestr);
  let textArr = e.childNodes;
  console.log(textArr);
  //在原标签前面插入新节点
  function newNode(i) {
    let newNode = document.createElement("div");
    newNode.setAttribute("class", "highlight");
    newNode.innerHTML = textArr[i].textContent;
    text_box.value.insertBefore(newNode, e);
  }

  //当挖空区域在高亮标签的开头时
  if (textArr[0].textContent == "") {
    text_box.value.insertBefore(text, e);
    newNode(2);
  } else {
    //当挖空区域在高亮标签的中间或结尾时
    newNode(0);
    text_box.value.insertBefore(text, e);
    //如果在结尾还有需要插入的高亮标签时
    if (textArr[1].textContent == "" && textArr[2].textContent != "") {
      newNode(2);
    }
  }
  //将旧高亮标签删除
  text_box.value.removeChild(e);
}
//监听保存
watch(
  () => learnstore.isSave,
  async (newvalue) => {
    if (newvalue) {
      props.tp.content = text_box.value.innerHTML;
      let res = await MakeModle(
        props.tp.content,
        newTp.title,
        1,
        tpstore.switchLabel(false, newTp.label),
        props.tp.modleId
      );
      console.log(res);
      if (res.data.msg.code == 200) {
        props.tp.modleTitle = newTp.title;
        props.tp.modleLabel = newTp.label;
        learnstore.isSave = false;
      }
    }
  }
);

//监听自定义
watch(
  () => learnstore.isCustom,
  async (newvalue, oldvalue) => {
    if (newvalue) {
      await checkReviewRecord(); //判断是否有学习记录
      if (learnstore.haveRecord) {
        showConfirmDialog({
          message:
            "检测到您有学习记录，重新挖空后会将学习记录清除，您确定要继续吗？",
        })
          .then(async () => {
            learnstore.restart = 1;
            await EnterDictation(); //清除学习记录
            learnstore.haveRecord = false;
          })
          .catch(() => {
            //取消退出
            learnstore.isCustom = false;
          });
      }
      text_box.value.innerHTML = props.tp.content;
    }
    if (oldvalue) {
      learnstore.isWk = false;
      learnstore.isEdit = false;
      // learnstore.isSave = false;
    }
  }
);

//监听背诵,事件委托绑定事件
watch(
  () => learnstore.isRecite,
  (newvalue, oldvalue) => {
    //当前为背诵状态且有高亮时
    let highlight = [];
    for (let x of text_box.value.children) {
      if (x.tagName == "DIV") {
        highlight.push(x);
      }
    }
    if (highlight.length == 0) learnstore.isRecite = false;
    if (newvalue && highlight.length > 0) {
      text_box.value.innerHTML = props.tp.content;
      for (let x of text_box.value.children) {
        if (x.tagName == "DIV") x.classList.add("recite"); //为每个子节点添加背诵属性
      }
      //事件委托绑定切换答案事件
      text_box.value.onclick = (e) => {
        if (e.target.classList.contains("highlight"))
          e.target.classList.toggle("recite");
      };
    }
    if (oldvalue) {
      text_box.value.innerHTML = props.tp.content;
    }
  }
);

//监听默写
watch(
  () => learnstore.isDictation,
  async (newvalue, oldvalue) => {
    let highlight = [];
    for (let x of text_box.value.children) {
      if (x.tagName == "DIV") {
        highlight.push(x);
      }
    }
    if (highlight.length == 0) learnstore.isDictation = false;
    //当前为默写状态且有高亮时
    if (newvalue && highlight.length > 0) {
      text_box.value.innerHTML = props.tp.content;
      answer = [];
      for (let x of text_box.value.children){
        if(x.tagName == "DIV")
          answer.push(x.innerHTML);
      } 
      await checkReviewRecord(); //判断是否有学习记录
      if (learnstore.haveRecord) {
        showConfirmDialog({
          message: learnstore.isReview
            ? "测到您有复习记录，请问是否继续上次的学习？"
            : "测到您有学习记录，请问是否继续上次的学习？",
        })
          .then(async () => {
            learnstore.restart = 0;
            await learnGetRecord();
            await EnterDictation();
          })
          .catch(async () => {
            //取消退出
            learnstore.restart = 1;
            await learnGetRecord();
            await EnterDictation();
          });
      }
      if (!learnstore.haveRecord) EnterDictation();
      async function EnterDictation() {
        for (let i = 0, j = 0; i < text_box.value.children.length; i++) {
          let x = text_box.value.children[i];
          if (x.tagName != "DIV") continue;

          //添加隐藏数据，通过伪元素可以撑开盒子的宽度
          x.setAttribute("data-after", answer[i]);
          x.setAttribute("contenteditable", true);
          x.classList.add("input");
          if (learnstore.restart == 1) x.innerHTML = "";
          else x.innerHTML = Record[j] || "";
          j++;
          // 点击可输入答案
          x.onclick = (e) => {
            if (x.innerHTML == "") {
              x.innerHTML = " ";
            }
            e.stopPropagation();
          };
          x.onfocus = () => {
            let text = x.innerText;
            x.onkeyup = () => {
              text = x.innerText;
            };
            x.onkeydown = () => {
              x.setAttribute("data-after", answer[i].substring(text.length));
            };
          };
          x.onblur = () => {
            x.onkeydown = null;
            x.onkeyup = null;
          };
        }
      }
    }
    if (oldvalue && !learnstore.isRecite) {
      text_box.value.innerHTML = props.tp.content;
    }
  }
);

//监听提交事件
watch(
  () => learnstore.isSubmit,
  (newvalue) => {
    if (newvalue) {
      showConfirmDialog({
        message: "您已经答完了吗?",
        beforeClose: (action) =>
          new Promise((resolve) => {
            setTimeout(async () => {
              if (action === "confirm") {
                //如果当前为复习
                if (learnstore.isReview) {
                  finishOnceReview();
                } else {
                  joinThePlane("复习中"); //否则将模板放进复习周期
                }
                let myanswer = {}; //存储答案
                for (let i = 0,j=0; i < text_box.value.children.length; i++) {
                  if(text_box.value.children[i].tagName == "DIV"){
                    myanswer[answer[j]+''] = text_box.value.children[i].innerHTML.replace(
                    /&nbsp;/g,
                    ""
                  );
                  console.log(answer[j],myanswer);
                  j++;
                  }
                  
                }
                console.log(myanswer);
                let res = await getAccuracy(myanswer);
                let msg = res.data.msg;
                console.log(msg);
                if (msg.content == "计算成功") {
                  let score = msg.data.total; //总分
                  let accuracy = msg.data.accuracy; //答案的正确率数组
                  console.log(score);
                  popupdata.score = score;
                  popupdata.isShow = true;
                  if (score < 60) {
                    popupdata.index = 0;
                  } else if (score < 80) {
                    popupdata.index = 1;
                  } else {
                    popupdata.index = 2;
                  }
                  popupCircle.value.style.background = getBackground(
                    popupdata.index,
                    popupdata.score
                  );
                  learnstore.isDictation = false;
                  //添加点击事件
                  for (let i = 0; i < text_box.value.children.length; i++) {
                    let flag = false;
                    let x = text_box.value.children[i];
                    if (x.tagName != "DIV") continue;
                    if (x.innerHTML != "") {
                      x.onclick = () => {
                        //点击切换正确答案
                        if (flag) {
                          x.innerHTML = answer[i];
                          x.classList.add("rightAnswer");
                          removeColor(x);
                          flag = false;
                        } else {
                          x.innerHTML = myanswer[answer[i]];
                          addColor(x, accuracy[i]);
                          x.classList.remove("rightAnswer");
                          flag = true;
                        }
                      };
                      x.onclick();
                    } else {
                      x.onclick = null;
                      x.innerHTML = answer[i];
                      x.classList.add("rightAnswer");
                      x.removeAttribute("data-after");
                    }

                    //移除颜色
                    function removeColor(x) {
                      for (let i = 1; i < 7; i++) {
                        x.classList.remove(`myAnswer${i}`);
                      }
                    }

                    //添加颜色
                    function addColor(x, accuracy) {
                      if (accuracy <= 20) {
                        removeColor(x);
                        x.classList.add("myAnswer1");
                      } else if (accuracy <= 40) {
                        removeColor(x);
                        x.classList.add("myAnswer2");
                      } else if (accuracy <= 50) {
                        removeColor(x);
                        x.classList.add("myAnswer3");
                      } else if (accuracy <= 70) {
                        removeColor(x);
                        x.classList.add("myAnswer4");
                      } else if (accuracy <= 90) {
                        removeColor(x);
                        x.classList.add("myAnswer5");
                      } else if (accuracy <= 100) {
                        removeColor(x);
                        x.classList.add("myAnswer6");
                      }
                    }
                  }
                  resolve(true);
                }
              } else {
                learnstore.isSubmit = false;
                // 拦截取消操作
                resolve(true);
              }
            }, 500);
          }),
      });
    }
  }
);

//学习记录
//监听是否保存学习记录
watch(
  () => learnstore.ifSave,
  (newvalue) => {
    if (newvalue) {
      let blanks = { arr: [] };
      for (let i = 0; i < text_box.value.children.length; i++) {
        if (text_box.value.children[i].tagName == "DIV")
          blanks.arr.push(
            text_box.value.children[i].innerHTML.replace(/&nbsp;/g, " ")
          );
      }
      learnSaveRecord(JSON.stringify(blanks));
    }
  }
);
//检测是否有学习记录
async function checkReviewRecord() {
  learnstore.ifReviewRecord = learnstore.isReview ? 1 : 0;
  let res = await JudgeStudyRecord(newTp.modleId, learnstore.ifReviewRecord);
  console.log(res);
  learnstore.haveRecord = res.data.msg.data.haveRecord;
}
//获取学习记录
async function learnGetRecord() {
  let url = learnstore.isReview ? "GetReviewRecord" : "GetStudyRecord";
  let res = await GetRecord(url, newTp.modleId, learnstore.restart);
  console.log(res);
  Record = res.data.msg.data.record;
}
//保存学习记录
async function learnSaveRecord(blanks) {
  let url = learnstore.isReview ? "SaveReviewRecord" : "SaveStudyRecord";
  let res = await SaveRecord(url, newTp.modleId, blanks, 1);
  console.log(res);
  learnstore.ifSave = false;
}

//复习计划
//将模板放进复习周期
async function joinThePlane(studyStatus) {
  let res = await JoinThePlane(props.tp.modleId, studyStatus);
  console.log(res);
  if (res.data.msg.code == 200) {
    props.tp.studyStatus = studyStatus;
  }
}
//完成复习
async function finishOnceReview() {
  let res = await FinishOnceReview(props.tp.modleId);
  console.log(res);
}
</script>

<style lang="less">
@vw: 3.95vw;
.van-dialog__message {
  font-size: (18 / @vw);
}
.learn_page {
  z-index: 10000;
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f2f7fc;
  transition: left 0.4s ease-in-out;
  overflow: hidden;

  .popup {
    z-index: 20000;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #0000001d;

    .popup_box {
      position: absolute;
      width: (300 / @vw);
      left: 50%;
      bottom: 5%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      z-index: 10000;
      border-radius: (10 / @vw);
      display: flex;
      padding: (10 / @vw) (20 / @vw);
      justify-content: space-between;
      align-items: center;
      height: (150 / @vw);
      font-size: (20 / @vw);

      .left {
        width: 40%;
        height: (100 / @vw);
        // background: conic-gradient(#5133febc 100%, #bcb0ffbc 0%); //陌生
        // background: conic-gradient(#5133febc 100%, #bcb0ffbc 0%);//熟练
        // background: conic-gradient(#02c287 100%, #e1fbf2 0%);//一般
        border-radius: 100%;
        padding: (8 / @vw);

        .circle {
          width: 100%;
          height: 100%;
          background-color: #fff;
          border-radius: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .right {
        width: 50%;
        height: (100 / @vw);
        padding: (20 / @vw) 0;
        font-size: (16 / @vw);

        .score {
          color: #fea31f; //陌生
          // color: #5133febc;//熟练
          // color: #02c287;//一般
          font-size: (26 / @vw);
          margin-bottom: (5 / @vw);
        }

        .score_title {
          padding-top: (5 / @vw);
          border-top: 1px solid #57575718;
          color: #57575799;
          font-size: (14 / @vw);
        }
      }
    }
  }

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

  .popup4 {
    z-index: 20000;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #0000001d;

    .popup_box {
      position: absolute;
      width: (300 / @vw);
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      z-index: 10000;
      border-radius: (10 / @vw);
      padding: (20 / @vw) (30 / @vw);
      height: (200 / @vw);
      font-size: (18 / @vw);

      .dif_title {
        font-size: (20 / @vw);
      }

      .select_diff {
        margin-top: (20 / @vw);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .com {
          text-align: center;
          padding: (10 / @vw);
          flex: 1;
          margin: 0 (5 / @vw);
          border-radius: (5 / @vw);
          font-size: (16 / @vw);

          // width: 15.18987342vw;
          // height: 7.59493671vw;
          // padding: 1.26582278vw 1.26582278vw;
          // font-size: 3.5443038vw;
          // text-decoration: none;
          // outline: none;
          // color: #fff;
          // background-color: #5f4fb8a4;
          // border: none;
          // border-radius: 3.79746835vw;
          // box-shadow: 0 0.75949367vw rgb(153 153 153 / 71%);
        }

        .active {
          background-color: #5f4fb8a4;
        }
      }

      .selection {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: (45 / @vw);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid #d4d2d2;
        background-color: #5f4fb8a4;
        border-radius: 0 0 (10 / @vw) (10 / @vw);

        .context {
          color: #fff;
          width: (150 / @vw);
          height: (30 / @vw);
          line-height: (30 / @vw);
          border-radius: (20 / @vw);
          border: 1px solid #fff;
        }
      }
    }
  }

  .container {
    margin-top: (65 / @vw);
    z-index: 0;
    width: 100%;
    background-color: #f2f7fcc5;
    // background-color: #f3f2fc;

    .text_box {
      margin: 0 auto;
      width: (370 / @vw);
      // height: 80vh;
      height: calc(100vh - 38vw);
      padding: (10 / @vw);
      padding-top: (14 / @vw);
      overflow: scroll;
      font-size: (18 / @vw);
      outline: 0;
      border: none;
      letter-spacing: (7 / @vw);
      word-break: break-all;

      &::-webkit-scrollbar {
        display: none;
      }

      &::selection {
        background: #fdbe3b !important;
      }

      .highlight {
        position: relative;
        display: inline;
        background: #fdbe3b;
        transition: all 0.3s;
        outline: 0;
        border: none;
        border-radius: (5 / @vw);

        &::selection {
          background: #fdbe3b !important;
        }
      }

      .input {
        width: auto;
        background-color: transparent;
        color: rgb(117, 74, 255);
        outline: none;
        display: inline;
        user-select: none !important;
        position: relative;
        border-bottom: (2 / @vw) rgb(63, 63, 63) solid;
        position: relative;
        border-radius: 0;

        &::after {
          // position: absolute;
          // left: 0;
          color: transparent !important;
          content: attr(data-after);
          // border-bottom: (2 / @vw) rgb(63, 63, 63) solid;
          height: (30 / @vw);
          width: 100%;
        }
      }

      .myAnswer1 {
        color: #cc1212;
        font-weight: 700;
        border-bottom: none;
      }

      .myAnswer2 {
        color: rgb(255, 255, 255);
        background-color: #d35b5b;
        font-weight: 700;
      }

      .myAnswer3 {
        color: rgb(255, 255, 255);
        background-color: #e47c7c;
        font-weight: 700;
      }

      .myAnswer4 {
        color: rgb(255, 255, 255);
        background-color: #a1e09f;
        font-weight: 700;
      }

      .myAnswer5 {
        color: rgb(255, 255, 255);
        background-color: #86c080;
        font-weight: 700;
      }

      .myAnswer6 {
        color: rgb(255, 255, 255);
        color: #39bd2b;
        font-weight: 700;
      }

      .noneAnswer {
        border-bottom: (2 / @vw) rgb(63, 63, 63) solid;
      }

      .rightAnswer {
        color: #333;
        background: #fdbe3b;
        border-bottom: none;
        // border-radius: (5 / @vw);
      }
    }

    .recite {
      height: (30 / @vw);
      background-color: darkgray !important;
      color: darkgray !important;
      border-radius: (5 / @vw);
      user-select: none;
    }
  }

  .ani_show {
    animation: ani_show 3s forwards;
  }

  @keyframes ani_show {
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
}
</style>