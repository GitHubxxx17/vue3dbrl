import service from '..';
import { userStore } from '@/stores';
let userstore = userStore();
//获取排行榜信息
export function getRankingList() {
    return service({
        method: 'get',
        url: 'inf.get/rankingList',
    })
}

export function getUserRank(){
    return service({
        method: 'post',
        url: '/user.do/userRanking',
        data:{},
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': userstore.user.token }
    })
}
