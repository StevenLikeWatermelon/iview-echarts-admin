import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import {purchaseManageCheckApproval, purchaseManageInCreator, purchaseManageGetWorkFlow, purchaseManageCheckTaskCreater} from './getData.js';
/**
 * 判断是否为空
 */
export const isset = (name) => {
    if (name === '' || name === null || name === undefined){
        return true;
    } else {
        return false;
    }
}
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return false;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
}
export const setToken = (version, valid_path) => {
    const token = {};
    const key = '12345678';

    function encryptByDES (message, key) {
      var keyHex = CryptoJS.enc.Utf8.parse(key)
      var option = {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7}
      var encrypted = CryptoJS.DES.encrypt(message, keyHex, option)
      return encrypted.ciphertext.toString()
    }

    token.session_id = Cookies.get('session_id');
    token.user_no = Cookies.get('user_no');
    token.version =  version ? version : 'v1';
    token.valid_path =  valid_path ? valid_path : '';
    token.licence = new Date().getTime();

    return encryptByDES(JSON.stringify(token), key);
}

/**
 * 验证登录
 */
export const verifyLogin = _this => {
    if( isset(getStore('sess_id')) ){
        //清除session
        Cookies.remove('phone');
        Cookies.remove('password');
        Cookies.remove('sess_id');
        Cookies.remove('username');
        //清除localstorage
        removeStore('phone');
        removeStore('password');
        removeStore('sess_id');
        removeStore('username');
        //清除角色相关信息
        removeStore('roles');
        removeStore('default_roleId');
        //清除状态码
        removeStore('status_code');

        _this.$Notice.close('greeting');
        _this.$store.commit('clearOpenedSubmenu');
        // 回复默认样式
        let themeLink = document.querySelector('link[name="theme"]');
        themeLink.setAttribute('href', '');
        // 清空打开的页面等数据，但是保存主题数据
        let theme = '';
        if (localStorage.theme) {
            theme = localStorage.theme;
        }
        localStorage.clear();
        if (theme) {
            localStorage.theme = theme;
        }
        _this.$router.push({
            path: '/login'
        });
    }
}

/**
 * 筛选数组并生成json格式
 */
export const notempty = (arr) => {
    //白名单请求数组
    let whiteParamsList = [
        'numPerPage',
        'pageNum'
    ];
    //结果数组
    let resultArr = {};
    for (let i in arr) {
        for (let j in whiteParamsList){
            if (i !== j && arr[i] !== undefined && arr[i] !== ''){
                resultArr[i] = arr[i];
            }
        }
    }
    return resultArr;
};

/**
 * 加密生成
 */
export const encryptByDES = (message, key) => {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const option = {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7};
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, option);
    return encrypted.ciphertext.toString();
}


/**
 * 饼状图占比计算
 */
export const getPercentWithPrecision = (valueList, idx, precision) => {
    if (!valueList[idx]) {
        return 0;
    }
    let sum = 0;
    let currentSum = 0;
    valueList.forEach(item => {
        sum += +item;
    });
    if (sum === 0) {
        return 0;
    }
    let digits = Math.pow(10, precision);
    let votesPerQuota = valueList.map(x => (isNaN(x) ? 0 : x) / sum * digits * 100);
    let targetSeats = digits * 100;
    let seats = votesPerQuota.map(x => Math.floor(x));
    seats.forEach(item => {
        currentSum += +item;
    });
    let remainder = votesPerQuota.map((votes, index) => votes - seats[index]);
    // Has remainding votes.
    while (currentSum < targetSeats) {
        // Find next largest remainder.
        var max = Number.NEGATIVE_INFINITY;
        var maxId = null;
        for (var i = 0, len = remainder.length; i < len; ++i) {
            if (remainder[i] > max) {
                max = remainder[i];
                maxId = i;
            }
        }
        // Add a vote to max remainder.
        ++seats[maxId];
        remainder[maxId] = 0;
        ++currentSum;
    }
    return seats[idx] / digits;
}

// 手动按字段名排序方法
const dateErp = /^(\d{4})-(\d{2})-(\d{2})$/;
export const sortBy = (name, isDes) => {
    return (pre, next) => {
        let preVal, nexVal;
        if (typeof pre === 'object' && typeof next === 'object') {
            preVal = pre[name];
            nexVal = next[name];

            if (preVal == undefined) {
                return Math.random() > 0.5;
            }
            if (isNaN(preVal) || preVal === '') {
                // console.log(11)
                preVal = preVal == '' ? 0 : (dateErp.test(preVal.substring(0,10)) ? new Date(preVal).getTime() : preVal);
                nexVal = nexVal == '' ? 0 : (dateErp.test(nexVal.substring(0,10)) ? new Date(nexVal).getTime() : nexVal);
                return isDes ? ((preVal == nexVal) ? 0 : ((preVal < nexVal) ? 1 : -1)) : ((preVal == nexVal) ? 0 : ((preVal < nexVal) ? -1 : 1)); 
            } else {
                // console.log(preVal, nexVal, (preVal - nexVal))
                return isDes ? ((preVal == nexVal) ? 0 : ((preVal - nexVal < 0) ? 1 : -1)) : ((preVal == nexVal) ? 0 : ((preVal - nexVal < 0) ? -1 : 1)); 
            }

        }
    }
}

//对于字符串和数字混着写的列排序，统一按照字符串排序
export const specialSortBy = (name, isDes) => {
    return (pre, next) => {
        let preVal, nexVal;
        if (typeof pre === 'object' && typeof next === 'object') {
            preVal = pre[name];
            nexVal = next[name];
            return isDes ? ((preVal == nexVal) ? 0 : ((preVal < nexVal) ? 1 : -1)) : ((preVal == nexVal) ? 0 : ((preVal < nexVal) ? -1 : 1)); 
        }
    }
};
// 手动校验权限

export const manualCheck = (authName) => {
    if (getStore('notRouteAuth')) {
        let notRouteAuthObj = JSON.parse(getStore('notRouteAuth'));
        let hasAuth = false;
        for (let key in notRouteAuthObj) {
            if (key === authName) {
                hasAuth = true;
            }
        }
        
        return hasAuth;
    }
}
// 浏览器前端导出下载

export const browserDwon = (res, isXml) => {
    //创建一个blob对象,file的一种
    let resType = isXml ? 'xml' : 'text/csv';
    let resName = isXml ? '.xml' : '.csv';
    const buf = new TextEncoder();
    let blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), buf.encode(res.data)], { type: resType });
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    //配置下载的文件名
    const time = new Date();
    const y = time.getFullYear();
    const m = time.getMonth()+1;
    const d = time.getDate();
    const h = time.getHours();
    const mm = time.getMinutes();
    const s = time.getSeconds();
    let fileTime;
    if (res.fileName) {
        fileTime = res.fileName;
    } else {
        fileTime = y + '-' + m + '-' + d + '_' + h + '-' + mm + '-' + s;
    }
    link.download = fileTime + resName;
    link.click();
    return true
}

export const downloadFile = (fileName, content) => {
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', false, false);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
}

export const isCurrentApprover = (vm, orderId) => {
    return new Promise (success => {
        purchaseManageCheckApproval(vm, {
            order_no: orderId
        }).then(res => {
            if (res && res.status == 1) {
                success(!!res.data.is_processer);
            } else {
                success(false);
            }
        });
    });
}

export const isFinalApprover = (vm, orderId) => {
    return new Promise(success => {
        purchaseManageCheckApproval(vm, {
            order_no: orderId
        }).then(res => {
            if (res && res.status == 1) {
                success(!!res.data.is_final);
            } else {
                success(false);
            }
        });
    });
}

export const isLastApprover = (vm, orderId) => {
    return new Promise(success => {
        purchaseManageCheckApproval(vm, {
            order_no: orderId
        }).then(res => {
            if (res && res.status == 1) {
                success(!!res.data.is_last_step);
            } else {
                success(false);
            }
        });
    });
}

export const isInCreaters = (vm, modalName, type) => {
    return new Promise(success => {
        let params = {
            model_name: modalName
        };
        if (typeof type !== undefined) {
            params.type = type
        }
        purchaseManageInCreator(vm, params).then(res => {
            if (res && res.status == 1) {
                success(!!res.data);
            } else {
                success(false);
            }
        });
    });
}
export const isTaskCreater = (vm, orderId) => {
    return new Promise(success => {
        purchaseManageCheckTaskCreater(vm, {
            order_no: orderId
        }).then(res => {
            if (res && res.status == 1) {
                success(!!res.data);
            } else {
                success(false);
            }
        })
    })
}
export const closeCurrentPage = (vm) => {
    vm.$store.commit('removeTag', vm.$route.name);
    vm.$store.commit('closePage', vm.$route.name);
    localStorage.pageOpenedList = JSON.stringify(vm.$store.state.pageOpenedList)
}

export const getSpecialDateRange = () => {
    let currentDate = new Date();
    let currentDateYear = currentDate.getFullYear();
    let currentDateMonth = currentDate.getMonth() + 1;
    let currentDay = currentDate.getDate();

    let time2 = currentDateYear + '-' + currentDateMonth + '-' + currentDay;

    let time1, time1Year, time1Month;
    if( currentDay >= 26) {
        time1Year = currentDateYear;
        time1Month = currentDateMonth;
        time1 = time1Year + '-' + time1Month + '-26';

    } else {
        if (currentDate.getMonth() == 0) {
            time1Year = currentDateYear - 1;
            time1Month = 12;
            time1 = time1Year + '-' + time1Month + '-26';

        } else {
            time1Year = currentDateYear;
            time1Month = currentDateMonth - 1;
            time1 = time1Year + '-' + time1Month + '-26';

        }
    }
    return [time1, time2];
}

export const tableRowClassName = ({row, rowIndex}) => {
    if (row.checked) {
      return 'warning-row';
    }
};