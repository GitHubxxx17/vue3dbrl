import service from '..';
import { userStore, mkStore } from '@/stores';
let userstore = userStore();
let mkstore = mkStore();
//获取用户模板
export function UserMemory() {
    return service({
        method: 'GET',
        url: '/modle/UserMemory',
        headers: { 'authorization': userstore.user.token },
    })
}
//制作模板
export function MakeModle(context, modleTitle, overWrite, modleLabel, modleId) {
    return service({
        method: 'post',
        url: '/modle/MakeModle',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': userstore.user.token },
        data: {
            context: context,
            modleTitle: modleTitle,
            overWrite: overWrite,
            modleLabel: modleLabel,
            modleId: modleId || null
        }
    })
}
//删除模板或取消收藏
export function deleteModle(url, modleId) {
    return service({
        method: 'post',
        url: `/modle/${url}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': userstore.user.token },
        data: {
            modleId: modleId
        }
    })
}
//上传文件
export function upload(fd) {
    return service({
        method: 'post',
        url: `/upload/parseContent?kuohao=${mkstore.isIdentifyWk}`,
        headers: { 'Content-type': 'application/x-www-form-urlencoded', 'authorization': userstore.user.token },
        data: fd
    })
}
//获取正确率
export function getAccuracy(data) {
    return service({
        method: 'post',
        url: '/inf.get/getAccuracy',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': userstore.user.token },
        data: {
            matchStr: JSON.stringify(data)
        },
    })
}
//系统挖空
export function autoDig(difficulty,modleId) {
    return service({
        method: 'post',
        url: `/modle/autoDig`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': userstore.user.token },
        data: {
            difficulty: difficulty,
            modleId: modleId
        }
    })
}

//学习记录
//判断是否有学习记录
export function JudgeStudyRecord(modleId, ifReviewRecord) {
    return service({
        method: 'get',
        url: `/modle/JudgeStudyRecord?modleId=${modleId}&ifReviewRecord=${ifReviewRecord}`,
        headers: { 'authorization': userstore.user.token },
    })
}
//获取学习记录
export function GetRecord(url, modleId, restart) {
    return service({
        method: 'get',
        url: `/modle/${url}?modleId=${modleId}&restart=${restart}`,
        headers: { 'authorization': userstore.user.token },
    })
}
//保存学习记录
export function SaveRecord(url, modleId,blanks ,ifSave) {
    return service({
        method: 'post',
        url: `/modle/${url}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': userstore.user.token },
        data: {
            modleId: modleId,
            blanks: blanks,
            ifSave: ifSave
        },
    })
}



//复习计划
//获取学习时长和学习篇数
export function getstudyData() {
    return service({
        method: 'get',
        url: `/inf.get/studyData`,
        headers: {'authorization': userstore.user.token },
    })
}
//获取复习计划
export function GetPeriodModle() {
    return service({
        method: 'get',
        url: `/review/GetPeriodModle`,
        headers: {'authorization': userstore.user.token },
    })
}
//添加到复习计划
export function JoinThePlane(modleId,studyStatus) {
    return service({
        method: 'get',
        url: `/review/JoinThePlane?modleId=${modleId}&studyStatus=${studyStatus}`,
        headers: {'authorization': userstore.user.token },
    })
}
//完成复习
export function FinishOnceReview(modleId) {
    return service({
        method: 'get',
        url: `/review/JoinThePlane?modleId=${modleId}`,
        headers: {'authorization': userstore.user.token },
    })
}
//移出复习计划
export function RemoveFromPlan(modleId) {
    return service({
        method: 'get',
        url: `/review/RemoveFromPlan?modleId=${modleId}&studyStatus=已学习`,
        headers: {'authorization': userstore.user.token },
    })
}
//保存学习时间
export function storeTime(time) {
    return service({
        method: 'post',
        url: `/user.do/storeDSSD`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'authorization': userstore.user.token },
        data: {
            studyTime: time
        },
    })
}
