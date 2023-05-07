//防抖函数
export default (func, delay) => {
    let time = null; //time用来控制事件的触发
    return function () {
        if (time !== null) {
            clearTimeout(time);
        }
        time = setTimeout(() => {
            func.call(this);
            //利用call(),让this的指针从指向window 转成指向目标dom
        }, delay);
    };
}