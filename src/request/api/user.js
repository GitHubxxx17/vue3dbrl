import service from '..';
import { userStore } from '@/stores';
let userstore = userStore();
//获取登录信息
export function PostloginMsg(phone,password) {
    return service({
        method: 'post',
        url: '/user.do/Login',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
            phone: phone,
            password: password
          }
    })
}
//获取注册信息
export function PostregisterloginMsg(phone,username,password) {
    return service({
        method: 'post',
        url: '/user.do/Reg',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
            phone: phone,
            username:username,
            password: password
          }
    })
}
//检查手机号是否被注册
export function checkUsedNumber(phone) {
    return service({
        method: 'get',
        url: `/inf.get/checkUsedNumber?phone=${phone}`,
    })
}
//检查昵称是否被注册
export function checkUserNickName(username) {
    return service({
        method: 'get',
        url: `/inf.get/checkUserNickName?username=${username}`,
    })
}
//获取用户信息
export function getuserMsg() {
    return service({
        method: 'GET',
        url: '/user.do/UserMsg',
        headers: {'authorization': userstore.user.token},
    })
}

//修改用户信息
export function ReMessage(key,value) {
    return service({
        method: 'GET',
        url: `/user.do/ReMessage?${key}=${value}`,
        headers: {'authorization': userstore.user.token},
    })
}

//上传头像
export function uploadImg(fd) {
    return service({
        method: 'post',
        url: `/upload/uploadImg`,
        headers: { 'Content-type': 'application/x-www-form-urlencoded', 'authorization': userstore.user.token },
        data: fd
    })
}