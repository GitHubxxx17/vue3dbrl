//读取本地存储数据
export function localGetData(name) {
    let data = localStorage.getItem(name);
    if (data !== null) {
        //把字符串转换成对象
        return JSON.parse(data);
    } else {
        return null;
    }
}

//读取session中的数据
export function sessionGetData(name) {
    let data = sessionStorage.getItem(name);
    if (data !== null) {
        //把字符串转换成对象
        return JSON.parse(data);
    } else {
        return null;
    }
}

//保存本地存储数据
export function localSaveData(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

//保存session存储
export function sessionSaveData(name, data) {
    sessionStorage.setItem(name, JSON.stringify(data));
}
