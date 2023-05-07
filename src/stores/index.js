import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
//主要的数据，控制部分组件的显示隐藏
export const mainStore = defineStore('main', {
  state: () => {
    return {
      footerNavIsShow: true,//底部导航栏展示
      changeBank: false,//记忆库切换
      LearningPageIsShow: false,//学习页面展示
      isPk: true,//pk页面是否显示
    }
  },
  actions: {

  }
})
//复习页面的数据
export const periodStore = defineStore('periodStore', {
  state: () => {
    return {
      studyTime: 0,//学习时长
      studyNums: 0,//已学习篇数
      numOfArticles: 0,//需要复习的篇数
      reviewNums: 0,//已复习篇数
      removeReciteisShow: false//复习列表页面展示
    }
  },
  actions: {

  }
})
//学习页面数据
export const learnStore = defineStore('learnStore', {
  state: () => {
    return {
      LearningPageIsShow: false,//学习页面展示
      isCustom: false,//学习页面是否自定义
      isDictation: false,//是否默写
      isRecite: false,//是否背诵
      isEdit: false,//是否编辑
      isWk: false,//是否挖空
      isSystemWk: false,//是否系统挖空
      isSubmit: false,//是否提交
      isSave: false,//是否保存
      isReview: false,//是否处于复习
      ifReviewRecord: 0,//判断是否是复习记录
      haveRecord: false,//是否有学习记录
      restart: 0,//判断是否获取或删除学习记录
      ifSave: false,//判断保存学习记录
      StartTime: 0,//进入页面的时间
      EndTime: 0,//离开页面的时间
    }
  },
  getters: {

  },
  actions: {

  }
})
//制作模板页面的数据
export const mkStore = defineStore('mkStore', {
  state: () => {
    return {
      popupisShow: false,//是否展示弹窗
      isLoading: false,//是否展示加载动画
      isSave: false,//是否保存
      isIdentifyWk: false,//是否识别挖空
      tipsIsShow: false,//是否展示tips
      popup2IsShow: false,//是否展示弹窗2
      popup2Cont: ''//弹窗2内容
    }
  },
})

//用户数据
export const userStore = defineStore('user', {
  state: () => {
    return {
      user: {},
      isLogin: false,//是否登录
      ModifyisShow: false,//修改信息页面是否展示
      TutorialIsShow: false,//新手教程页面是否展示
      CaptureAvatarIsShow: false//裁剪头像页面是否展示
    }
  },
})
// 社区的模板数据
export const CommunityStore = defineStore('CommunityStore', {
  state: () => {
    return {
      isUpLoad: false,
      curModelIndex: 0,// 当前标签
      curPageIndex: 0,// 当前页数
      loading: false,// 是否正在加载
      lodingEnd: false,// 是否加载完成
      flashCommunity: [],
      showLi: {
        show: false,//是否显示查看模板界面
        curFlash: {//当前的模板数据
        }
      },
      searchData:{
        searchValue:"",// 记录搜索的字样
        isSuccess: true,// 记录是否查找成功
        isMemory: true,// 是否进入了记忆库搜索
        isSearch: false,//搜索页面是否显示
        modelData:[],// 搜索出来的内容
      }
    }
  },
  getters: {

  },
  actions: {
    changeLabel(){
      this.flashCommunity.forEach((t) => {
        if (t.modleLabel == 1)
          t.modleLabel = '教资';
        else if (t.modleLabel == 2)
          t.modleLabel = '考研';
        else if (t.modleLabel == 3)
          t.modleLabel = '通识课';
      })
      this.searchData.modelData.forEach((t) => {
        if (t.modleLabel == 1)
          t.modleLabel = '教资';
        else if (t.modleLabel == 2)
          t.modleLabel = '考研';
        else if (t.modleLabel == 3)
          t.modleLabel = '通识课';
      })
    }
  }
})

//用户记忆库数据
export const tpStore = defineStore('tp', {
  state: () => {
    return {
      tp: [],
      popupIsShow: false,//是否展示弹窗
      popupCont: '',//弹窗内容
      isDelete: false,//是否进入删除
      delnum: 0,//删除的数量
      curTp:{}
    }
  },

  getters: {

  },

  actions: {
    switchLabel(flag, label) {//标签转换
      if (flag && this.tp) {
        this.tp.forEach((t) => {
          if (t.modleLabel == 1)
            t.modleLabel = '教资';
          else if (t.modleLabel == 2)
            t.modleLabel = '考研';
          else if (t.modleLabel == 3)
            t.modleLabel = '通识课';
        })
      } else {
        if (label == '教资') return 1
        if (label == '考研') return 2
        if (label == '通识课') return 3
      }
    },
    async getTp(UserMemory) {//获取记忆库模板
      let res = await UserMemory();
      console.log(res);
      this.tp = res.data.msg.data.userModle || [];
      this.switchLabel(true, 1);
    }
  }
})


//pk数据
export const pkStore = defineStore('pkStore', {
  state: () => {
    return {
        ws: null,// WebSocket
        selectIsShow: false,// 选择界面是否出现
        isEnter: false,// 是否进入等待pk的界面
        entered: false,// 是否进入pk界面
        isEnd: false,// 是否进入pk结束的界面
        difficult: "hard",// 选择的模板的难度
        selectedModleId:-1,// 选择的模板ID
        gameTimeRecord:null,// 计时器
        stars:0,// 星星数量
        waitPkData:{//  等待界面的数据
          isAppear: true,// 是否出现
          frameIsAppear: true,// pk两个三角是否出现
        },
        enterPkData:{
          isAppear:false,// 是否显示动画
          gameTime:"",// 比赛时间
          answerIndex: 0,// 当前选择的是哪一个答案
          PkTemplate:``,// pk的模板
          answerArr:[],// 存放答案
          selectArr:[],// 存放选择选项
          UserSelectArr:[],// 存放当前用户选择的答案是否正确,用于最后渲染pk结束界面
          endAnswerArr:[],// 存放最后的所有答案
          fourOption:[],// 四个选项
        },
        endPkData:{
          isAppear:false,// 是否显示动画
          myAnswer:``,// 我的答案
          answer:``,// 正确答案
          winnerId: -1,// 胜利者ID
        },
        rivalMsg:{// 对手信息
          name:"???",// 对手的名称
          portrait:`<div class="Unmatched">?</div>`,// 对手的头像
        }
    }
  },

  getters: {

  },

  actions: {
    resetAnswer() {//置空渲染界面的答案
      this.endPkData.myAnswer = ``;
      this.endPkData.answer = ``;
    },
    closeWS() {
      this.ws.close();
      console.log("已经与服务器断开连接当前连接状态：" + this.ws.readyState);
      this.ws = null;
    },
    resetRivalMsg() { // 重置对手信息
      this.rivalMsg.portrait = `<div class="Unmatched">?</div>`; //对手头像
      this.rivalMsg.name = "???"; //对手姓名 
    },
    resetWaitPK(){
       // 等待pk的消失动画
      this.waitPkData.frameIsAppear = false;
      this.waitPkData.isAppear = false;
      this.entered = true; // 进入pk界面
      this.enterPkData.isAppear = true;
    },
  }

})