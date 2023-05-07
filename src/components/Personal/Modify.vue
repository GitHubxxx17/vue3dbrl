<template>
  <div class="modify" @click="modifyErr.style.opacity = 0;">
    <div class="modify_box">
      <div class="modify_title">
        <div class="left" @click="userstore.ModifyisShow = false">
          <i class="iconfont icon-xiangzuojiantou"></i>
        </div>
        <div class="modify_what">{{state.modifyArr[index]}}</div>
      </div>
    </div>

    <div class="Modify_interface">
      <input type="text" v-model="state.value"/>
      <div class="modify_err" ref="modifyErr">{{state.modifyErrArr[index]}}</div>
      <div class="confirm" @click="confirm($router,$event)">
        <button>确认修改</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref,watch,onMounted} from 'vue';
import {userStore} from "@/stores";
import {ReMessage} from "@/request/api/user.js"
const props = defineProps(['index'])
let userstore = userStore();
let modifyErr = ref(null).value;
const state = reactive({
  key:['nickName','phone','password'],
  modifyArr:['修改昵称', '修改手机号', '修改密码'],
  modifyErrArr:['昵称格式错误', '手机号格式错误', '密码格式错误'],
  Reg:[/^[0-9a-zA-Z\u4e00-\u9fa5]{1,6}$/,/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,/^[a-zA-Z0-9_]{6,16}$/],
  value:'',
})

const confirm = async ($router,e) => {
  e.stopPropagation();
  if(state.Reg[props.index].test(state.value)){
    let res = await ReMessage(state.key[props.index],state.value);
    if(res.data.msg.data.isSuccess){
      userstore.user[state.key[props.index]] = state.value;
      userstore.ModifyisShow = false;
    }else{
       modifyErr.innerHTML = res.data.msg.content;
       modifyErr.style.opacity = '1';
    }
    console.log(res)
  }else{
    modifyErr.innerHTML = state.modifyErrArr[props.index];
    modifyErr.style.opacity = '1';
  }
}

//进入修改页面时改变输入框的内容
onMounted(() => {
  state.value = userstore.user[state.key[props.index]] || ''
})
watch(()=>props.index,()=> {
    state.value = userstore.user[state.key[props.index]] || ''
})
</script>

<style scoped lang="less">
@vw: 3.95vw;
.modify {
  width: 100%;
  height: 100vh;
  background-color: #f4f4f4;

  .modify_box {
    background-color: #fff;
    padding: 0 (55 / @vw) 0 (15 / @vw);

    .modify_title {
      display: flex;
      justify-content: space-between;
      height: (60 / @vw);
      line-height: (60 / @vw);
      font-size: (20 / @vw);
      .left {
        flex: 1.4;
        text-align: center;
        line-height: (60 / @vw);
      }
      .icon-xiangzuojiantou {
        font-size: (20 / @vw);
      }

      .modify_what {
        flex: 8.6;
        text-align: center;
      }
    }
  }

  .Modify_interface {
    margin-top: (20 / @vw);
    padding: 0 (30 / @vw);

    input {
      padding: 0 (20 / @vw);
      display: block;
      width: 100%;
      height: (60 / @vw);
      line-height: (60 / @vw);
      font-size: (20 / @vw);
      border: 0;
      border-bottom: 1px solid rgb(174, 172, 172);
    }

    .modify_err {
      font-size: (18 / @vw);
      color: red;
      opacity: 0;
      transition: all 0.3s;
      margin: (20 / @vw) auto;
    }

    .confirm {
      margin: 0 auto;
      margin-top: (10 / @vw);
      width: (250 / @vw);
      button {
        width: (250 / @vw);
        height: (50 / @vw);
        background-color: #ffd161;
        border: 0;
        font-size: (20 / @vw);
        border-radius: (5 / @vw);
      }
    }
  }
}
</style>