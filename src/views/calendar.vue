<template>
  <div class="calendar_page">
    <div class="left" @click="$router.push('/DueToday')">
      <span class="icon iconfont icon-fanhui"></span>
    </div>
    <!-- 背景紫色 -->
    <div class="bcg"></div>
    <div class="calendar">
      <div class="calendar_header">
        <span class="month_picker" @click="showMonth($event)">{{
          monthPicker
        }}</span>
        <div class="year_picker">
          <span class="year_change" @click="prevYear()">
            <pre>&lt;</pre>
          </span>
          <span>{{ header_year }}</span>
          <span class="year_change" @click="nextYear()">
            <pre>></pre>
          </span>
        </div>
      </div>
      <div class="calendar_body">
        <div class="calendar_week_day">
          <div v-for="item in week" :key="item">{{ item }}</div>
        </div>
        <!-- 存放日期 -->
        <div class="calendar_days" ref="calendar_days"></div>
      </div>
      <div class="month_list" ref="month_list"></div>
      <div class="calendar_footer">
        <div class="clock">
          <div class="situation">{{ isClock }}</div>
          <button class="situation" @click="lockInFun(curDate)">
            {{ isQianDao }}
          </button>
        </div>
        <div class="dailySignature">
          <div class="box">
            <div class="title">今日日签</div>
            <div class="record_box">
              <div>做不到别人眼中的强者也没有关系，做到最好的自己就好。</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入内置函数
import { ref, onMounted, isReactive } from "vue";
// 引入外部数据
import { getClockInRecord, clockIn } from "../request/api/calendar";

// 处理数据的函数
// 调用函数获取打卡日期
let clock_day = []; //获取打卡天数
async function getClockInRecordFun(year, month) {
  let clockInRecord = await getClockInRecord(year, month);
  let dateList = clockInRecord.data.msg.data.dateList; //打卡的日期
  let searchSuccess = clockInRecord.data.msg.data.searchSuccess; //判断是否获取成功

  if (searchSuccess) {
    for (let i = 0; i < dateList.length; i++) {
      if (dateList[i].split("-")[2].charAt(0) == "0") {
        clock_day[i] = dateList[i].split("-")[2].split("0")[1];
      } else {
        clock_day[i] = dateList[i].split("-")[2];
      }
    }
  }
}
// 获取是否为闰年
let isLeapYear = (year) => {
  return (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  );
};
//获取各月的天数
let getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};
let prevYear; // 上一年
let nextYear; // 下一年
let showMonth; // 展示月份列表
// 打卡方法
async function lockInFun(curDate) {
  let clockData = await clockIn(curDate);
  console.log(clockData);
  let isSuccessClock = clockData.data.msg.data.isSuccess;
  if (isSuccessClock) {
    today.classList.add("clock_in");
    isClock.value = "今日已打卡";
    isQianDao.value = "已签到";
  }
}

let week = ref(["周日", "周一", "周二", "周三", "周四", "周五", "周六"]); // 星期
const month_names = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
]; // 记录月份
let curDate = new Date(); // 获取日期时间戳
let curMonth = ref(curDate.getMonth()); // 月份数据的下标
let monthPicker = ref(month_names[curMonth.value]); // 记录动态月份
let calendar_days = ref(null); // 记录动态日期表
let header_year = ref(curDate.getFullYear()); // 记录动态年份
let month_list = ref(null); //月份列表显示
let isClock = ref("今日还未打卡"); // 显示是否打卡
let isQianDao = ref("签到"); // 显示是否签到
let today; // 记录当天标签
let showCenter = ref(false);
onMounted(() => {
  // 生成日历
  async function generateCalendar(year, month) {
    // 每月的天数
    let days_of_month = [
      31,
      getFebDays(year),
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    //获取时间Date对象用于处理日期和时间
    let currDate = new Date();

    //返回表示年份的4位数
    if (!year) {
      year = currDate.getFullYear();
    }

    // 渲染当前月份
    monthPicker.value = `${month_names[month]}`;
    header_year.value = year;
    clock_day = [];
    //获取打卡日
    await getClockInRecordFun(header_year.value, curMonth.value);
    calendar_days.value.innerHTML = "";
    //获取每个月的第一天
    let first_day = new Date(year, month, 1);
    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
      let day = document.createElement("div");

      // 标记打卡
      if (i >= first_day.getDay()) {
        for (let x of clock_day) {
          if (x == i - (first_day.getDay() - 1)) {
            day.classList.add("clock_in");
          }
        }
        day.innerHTML = i - first_day.getDay() + 1;
        // 判断当天是否打卡
        if (
          i - first_day.getDay() + 1 === currDate.getDate() &&
          year === currDate.getFullYear() &&
          month === currDate.getMonth()
        ) {
          day.classList.add("curr_date");
          if (day.classList.contains("clock_in")) {
            isClock.value = "今日已打卡";
            isQianDao.value = "已签到";
          }
          today = day;
        }
      }
      calendar_days.value.appendChild(day);
    }
  }
  generateCalendar(header_year.value, curMonth.value);

  // 上一年
  prevYear = () => {
    --header_year.value;
    generateCalendar(header_year.value, curMonth.value);
  };

  // 下一年
  nextYear = () => {
    ++header_year.value;
    generateCalendar(header_year.value, curMonth.value);
  };

  //月份显示渲染
  month_names.forEach((e, index) => {
    let month = document.createElement("div");
    month.innerHTML = `<div data-month="${index}">${e}</div>`;
    month.querySelector("div").onclick = (e) => {
      month_list.value.classList.remove("show");
      monthPicker.value = month_names[index];
      curMonth.value = index;
      generateCalendar(header_year.value, index);
      e.stopPropagation();
    };
    month_list.value.appendChild(month);
  });

  // 展示月份列表
  showMonth = (e) => {
    month_list.value.classList.add("show");
    e.stopPropagation();
  };
});
</script>

<script>
import { defineComponent } from "vue";
import { mainStore } from "../stores";
export default defineComponent({
  beforeRouteLeave(to, from, next) {
    let mainData = mainStore();
    mainData.footerNavIsShow = true;
    next();
  },
});
</script>

<style lang="less">
@vw: 3.95vw;
.calendar_page {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: #f4f4f4;
  transition: all 0.3s ease-in-out;
  overflow: scroll;
  // background: url(../images/日签/dailyCard7.png) no-repeat;
  background-size: cover;

  .left {
    z-index: 10000;
    position: absolute;
    top: (20 / @vw);
    left: (15 / @vw);

    .icon {
      color: #fff;
      font-weight: 700;
      font-size: (30 / @vw);
    }
  }

  .bcg {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    // height: (240/@vw);
    height: 45vh;
    // background-color: #aea0d5;
    background-image: linear-gradient(to bottom, #aea0d5 70%, transparent);
  }

  .calendar {
    z-index: 100;
    margin-top: (30 / @vw);
    height: max-content;
    width: (395 / @vw);
    // background-color:  #fdfdfd;
    border-radius: (30 / @vw);
    padding: (20 / @vw);
    position: relative;
    overflow: hidden;

    .calendar_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: (25 / @vw);
      font-weight: 600;
      color: #fdfdfd;
      padding: (10 / @vw);

      .month_picker {
        padding: (5 / @vw) (10 / @vw);
        border-radius: (10 / @vw);
        &:hover {
          background-color: #c2c2c4;
        }
      }

      .year_picker {
        display: flex;
        align-items: center;

        .year_change {
          height: (40 / @vw);
          width: (40 / @vw);
          border-radius: 50%;
          display: grid;
          place-items: center;
          margin: 0 (10 / @vw);
        }
      }
    }

    .calendar_body {
      background-color: #fdfdfd;
      padding: (10 / @vw);
      box-shadow: (1 / @vw) (2 / @vw) (5 / @vw) (2 / @vw)
        rgba(159, 157, 157, 0.381);
      border-radius: 1%;
      transition: all 0.3s;
      min-height: (300 / @vw);

      .calendar_week_day {
        font-size: (16 / @vw);
        height: (50 / @vw);
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        font-weight: 600;

        div {
          display: grid;
          place-items: center;
          color: #c3c2c8;
        }
      }

      .calendar_days {
        font-size: (16 / @vw);
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: (2 / @vw);
        color: #151426;
        transition: all 0.6s;

        div {
          width: (40 / @vw);
          height: (40 / @vw);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: (5 / @vw);
          position: relative;

          animation: to-top 1s forwards;
          transition: all 0.3s;
          border-radius: 50%;
          border: 0.0625rem solid transparent;

          span {
            position: absolute;

            &:nth-child(1),
            &:nth-child(3) {
              width: (2 / @vw);
              height: 0;
              background-color: #151426;
            }

            &:nth-child(1) {
              bottom: 0;
              left: 0;
            }

            &:nth-child(3) {
              top: 0;
              right: 0;
            }

            &:nth-child(2),
            &:nth-child(4) {
              width: 0;
              height: (2 / @vw);
              background-color: #151426;
            }

            &:nth-child(2) {
              top: 0;
              left: 0;
            }

            &:nth-child(4) {
              bottom: 0;
              right: 0;
            }
          }

          &:hover span {
            transition: width 0.2s ease-in-out, height 0.2s ease-in-out;
          }

          &:hover span:nth-child(1),
          &:hover span:nth-child(3) {
            height: 100%;
          }

          &:hover span:nth-child(2),
          &:hover span:nth-child(4) {
            height: 100%;
          }

          &:hover span:nth-child(2) {
            transition-delay: 0.2s;
          }

          &:hover span:nth-child(3) {
            transition-delay: 0.4s;
          }

          &:hover span:nth-child(4) {
            transition-delay: 0.6s;
          }

          &.curr_date {
            //background-color: #0000ff;
            color: #000;
            border-radius: 50%;
            border: 0.0425rem solid #aea0d5;
          }

          &.clock_in {
            background-color: #aea0d5;
            border: 0;
            color: #fff;
            border-radius: 50%;
          }

          &.curr_date span {
            display: none;
          }
        }
      }
    }

    .calendar_footer {
      margin-top: (15 / @vw);
      padding: (10 / @vw);

      .clock {
        font-size: (16 / @vw);
        margin-bottom: (20 / @vw);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 (20 / @vw);
        width: 100%;
        height: (50 / @vw);
        text-align: center;
        line-height: (50 / @vw);
        // background-color: #eeedf5;
        background-color: #ffffff;
        border-radius: (5 / @vw);

        box-shadow: (1 / @vw) (1 / @vw) (6 / @vw) (1 / @vw)
          rgba(121, 121, 121, 0.163);

        .situation {
          transition: all 0.3s;
        }

        button {
          font-size: (16 / @vw);
          display: inline-block;
          width: (70 / @vw);
          height: (30 / @vw);
          line-height: (30 / @vw);
          background-color: #e1d5ed;
          border: 0;
        }
      }

      .dailySignature {
        position: relative;
        margin-top: 5vh;
        // background-color: red;
        background: url(../images/复习/暂无书籍\ 2.png) no-repeat;
        background-position: (60 / @vw) (-30 / @vw);
        background-size: (100 / @vw) (50 / @vw);
        background-size: cover;
        border-radius: (10 / @vw);

        // background-size: cover;
        background-color: #fff;
        box-shadow: (1 / @vw) (1 / @vw) (6 / @vw) (1 / @vw)
          rgba(121, 121, 121, 0.163);

        .box {
          padding: (20 / @vw) (10 / @vw);
          border-radius: (10 / @vw);
          background-color: rgba(255, 255, 255, 0.518);
        }
      }

      .title {
        color: #000;
        font-size: (20 / @vw);
        // font-family: cursive;
        width: (140 / @vw);
        padding: (0 / @vw);
        margin-left: (-10 / @vw);
        text-align: center;
        // background-color: #9a7aec89;
        border-radius: (10 / @vw);
      }

      .record_box {
        margin-top: (10 / @vw);
        // font-family: cursive;
        padding: (5 / @vw) (15 / @vw);
        border-left: 0.125rem solid rgba(0, 0, 0, 0.319);
      }
    }
  }

  .month_list {
    font-size: (16 / @vw);
    position: absolute;
    width: (369 / @vw);
    height: (333 / @vw);
    top: (82 / @vw);
    left: (10 / @vw);
    background-color: #fdfdfd;
    padding: (20 / @vw);
    grid-template-columns: repeat(3, auto);
    gap: (5 / @vw);
    display: grid;
    visibility: hidden;
    pointer-events: none;
    box-shadow: (1 / @vw) (2 / @vw) (5 / @vw) (2 / @vw)
      rgba(159, 157, 157, 0.381);
    border-radius: 1%;

    &.show {
      transform: scale(1);
      visibility: visible;
      pointer-events: visible;
      transition: all 0.2s ease-in-out;
    }

    & > div {
      display: grid;
      place-items: center;
    }

    & > div > div {
      width: 100%;
      padding: (5 / @vw) (20 / @vw);
      border-radius: (10 / @vw);
      text-align: center;
      color: #151426;
    }

    & > div:hover {
      background-color: #e1d5ed;
    }
  }

  @keyframes to-top {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>
