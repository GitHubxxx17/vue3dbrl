import service from '..';
import { userStore } from '@/stores';
let userstore = userStore();
// 获取所有日期
export function getClockInRecord(year,month){
    return service({
        method: 'get',
        url: `/user.do/getClockInRecord?year=${year}&month=${month + 1}`,
        headers: {'authorization': userstore.user.token},
    })
}

// 打卡
export function clockIn(curDate){
    //定义格式化时间的方法
    function dateFromat(dtstr) {
        const dt = new Date(dtstr);

        const y = dt.getFullYear();
        const m = padZero(dt.getMonth() + 1);
        const d = padZero(dt.getDate());
        return `${y}-${m}-${d}`
    }

    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    return service({
        method: 'post',
        url: `/user.do/clockIn`,
        data:{
            date: dateFromat(curDate)
        },
       headers: { 'Content-Type': 'application/x-www-form-urlencoded',
        'authorization': userstore.user.token 
        }
    })
}