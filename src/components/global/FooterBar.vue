<template>
  <div class="footer_nav">
    <footer>
      <ul>
        <li v-for="(n,i) of 5" :key="i"  @click="changeBtn(i,$router)" :class="{choose:btnData.btnState[i]}">
          <span class="icon iconfont" :class="btnData.icon[i]"></span>
          <div class="name">{{btnData.name[i]}}</div>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script setup>
import { ref,reactive } from "vue";
const btnData = reactive({
  btnState: [true,false,false,false,false],
  routerUrl:['/DueToday','/PkMainPage','/MakingPage','/Community','/Personal'],
  icon:['icon-tiku1','icon-PK1','icon-tianjia1','icon-ziyuangongxiang','icon-yonghu'],
  name:['学习','PK','','社区','我的']
})
const changeBtn = (i,$router) => {
  //改变路由路径
  $router.push(btnData.routerUrl[i]);
  for(let i = 0;i < btnData.btnState.length;i++){
    btnData.btnState[i] = false
  }
  btnData.btnState[i] = true
};

</script>

<style scoped lang="less">
@vw: 3.95vw;
.footer_nav {
  z-index: 2000;
  position: fixed;
  bottom: 0;
  left: 0;

  footer {
    height: (70 / @vw);
    width: 100vw;
    background-color: #fff;

    ul {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }

    li {
      height: 100%;
      flex: 5;
      font-size: (14 / @vw);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #a1a4b4;
      transition: all 0.2s ease-in-out;

      &:nth-child(2) {
        .icon {
          margin-top: (2 / @vw);
          font-size: (26 / @vw);
        }

        .name {
          margin-top: (2 / @vw);
        }
      }

      .icon {
        font-size: (30 / @vw);
      }

      .name {
        position: relative;
      }
    }

    .choose {
      color: rgb(92, 78, 175) !important;
    }
  }
}
</style>
