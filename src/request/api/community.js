import service from '..';

// 上传模板
export function toCommunity(id,common,token) {
    return service({
        method: 'post',
        url: '/modle/toCommunity',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': token },
        data:{
            modleId:id,
            common:common
        }
    })
}

// 根据标签获取模板
export function getTempByLable(modleLabel,pageIndex,token) {
    return service({
        method: 'get',
        url: `/inf.get/getModlesByTag?modleLabel=${modleLabel}&pageIndex=${pageIndex}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': token }
    })
}

// 刷新随机模板
export function getRandomTemp(modleLabel,token) {
    return service({
        method: 'get',
        url: `/inf.get/getRandomModles?modleLabel=${modleLabel}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': token }
    })
}

// 收藏或取消收藏
export function collect(modleId,mStatus,token){
    return service({
        method: 'get',
        url: `/modle/Collection?modleId=${modleId}&mStatus=${mStatus}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': token }
    })   
}
// 点赞或取消点赞
export function LikeOrDisLike(modleId,likeStatus,token){
    return service({
        method: 'get',
        url: `/modle/LikeOrDisLike?modleId=${modleId}&likeStatus=${likeStatus}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': token }
    })   
}

//搜索
export function SearchModel(modleTitle,common,token){
    return service({
        method: 'get',
        url: `/modle/SearchModel?modleTitle=${modleTitle}&common=${common}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': token }
    })   
}
