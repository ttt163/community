/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：public function
 */

import axios from 'axios'
import { hashHistory } from 'react-router'
import { loginShow } from '../actions/index'
import store from '../store/index'
import Qs from 'qs'

export const axiosAjax = (type, url, params, fn) => {
    axios({
        method: type,
        // url: url,
        url: 'community' + url,
        data: Qs.stringify(params)
    }).then(function (response) {
        const data = response.data
        console.log(data)
        if (data.result === -100) {
            alert('参数不对, 重新请求试试~')
            // hashHistory.push('/')
            // store.dispatch(loginShow('block'))
            return
        }
        if (data.result === -500) {
            alert('返回值-500, 请求出现错误, 请稍后重试 ~')
            // hashHistory.push('/')
            // store.dispatch(loginShow('block'))
            return
        }
        if (data.code === -1705) {
            alert('用户不存在, 请注册蓝港通行证后重新登录~')
            $.fn.cookie('login', null)
            $.fn.cookie('token', null)
            hashHistory.push('/')
            store.dispatch(loginShow('block'))
            return
        }
        if (data.result !== -1701 && data.result !== -1702) {
            fn.call(this, data)
        } else {
            alert('登录过期, 请重新登录 !')
            $.fn.cookie('token', null)
            $.fn.cookie('login', null)
            store.dispatch(loginShow('block'))
            hashHistory.push('/')
            // hashHistory.push('/login')
            console.log(data.desc)
        }
    }).catch(function (error) {
        alert('请求出现错误: ' + error)
        // hashHistory.push('/')
        // store.dispatch(loginShow('block'))
    })
}

export const axiosFormData = (type, url, params, fn, callback) => {
    axios({
        onUploadProgress: (progressEvent) => {
            console.log(progressEvent)
            if (progressEvent.lengthComputable) {
                return callback(progressEvent)
            }
        },
        method: type,
        // url: url,
        url: 'community' + url,
        data: params,
        maxContentLength: 5000,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(function (response) {
        const data = response.data
        console.log(data)
        if (data.code === 0) {
            fn.call(this, data)
        } else {
            if (data.code === -1701 || data.code === -1702) {
                alert('登录过期, 请重新登录 !')
                hashHistory.push('/')
                store.dispatch(loginShow('block'))
                // hashHistory.push('/login')
            }
            if (data.code === -1705) {
                alert('用户不存在, 请注册蓝港通行证后重新登录~')
                $.fn.cookie('token', null)
                hashHistory.push('/')
                store.dispatch(loginShow('block'))
                // hashHistory.push('/login')
            }
            console.log(data.message)
        }
    }).catch(function (error) {
        console.log(error)
        alert('上传失败了~~')
    })
}

export const equipOrientation = () => {
    (function () {
        let init = function () {
            let updateOrientation = function () {
                let orientation = window.orientation
                switch (orientation) {
                    case 90:
                    case -90:
                        orientation = 'landscape' // 这里是横屏
                        break
                    default:
                        orientation = 'portrait' // 这里是竖屏
                        break
                }
                // html根据不同的旋转状态，加上不同的class，横屏加上landscape，竖屏
                // 加上portrait
                document.body.parentNode.setAttribute('class', orientation)
            }
            // 每次旋转，调用这个事件。
            window.addEventListener('orientationchange', updateOrientation, false)
            // 事件的初始化
            updateOrientation()
        }
        window.addEventListener('DOMContentLoaded', init, false)
    })()
}

export const browserLanguage = () => {
    const language = navigator.browserLanguage ? navigator.browserLanguage : navigator.language
    let lang = ''

    if (language.indexOf('en') > -1) {
        lang = 'en'
    } else if (language.indexOf('ko') > -1) {
        lang = 'ko'
    } else if (language.indexOf('fr') > -1) {
        lang = 'french'
    } else if (language.indexOf('de') > -1) {
        lang = 'german'
    } else if (language.indexOf('ja') > -1) {
        lang = 'japanese'
    } else if (language.indexOf('indo') > -1) {
        lang = 'indo'
    } else if (language.indexOf('th') > -1) {
        lang = 'th'
    } else if (language.indexOf('es') > -1) {
        lang = 'Spanish'
    } else if (language.indexOf('sv') > -1) {
        lang = 'swedish'
    } else if (language.indexOf('zh') > -1) {
        lang = 'zh'
    } else if (language.indexOf('zh-tw') > -1) {
        lang = 'zh-tw'
    } else {
        lang = 'english'
    }

    return lang
}

// 时间戳转化为 时间格式
const zero = (m) => { return m < 10 ? '0' + m : m }

export const getLocalTime = (nS) => {
    let date = new Date(parseInt(nS) * 1000)
    // let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = date.getDate()
    let h = date.getHours()
    let m = date.getMinutes()
    // let s = date.getSeconds()
    return M + zero(D) + ' ' + zero(h) + ':' + zero(m)
}

const format = (date) => {
    let time = new Date(date)
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()
    // let h = time.getHours()
    // let mm = time.getMinutes()
    // let s = time.getSeconds()
    if (date) {
        return y + '-' + zero(m) + '-' + zero(d)
    } else {
        return ''
    }
}
// 发帖时间
export const getTime = (publishTime, requestTime) => {
    let limit = parseInt((requestTime - publishTime))
    let content = ''
    if (limit < 60) {
        content = '刚刚'
    } else if (limit >= 60 && limit < 3600) {
        content = Math.floor(limit / 60) + ' 分钟前'
    } else if (limit >= 3600 && limit < 86400) {
        content = Math.floor(limit / 3600) + ' 小时前'
    } else if (limit >= 86400 && limit < 172800) {
        content = '昨天'
    } else if (limit >= 172800 && limit < 259200) {
        content = '前天'
    } else if (limit >= 259200 && limit < 2592000) {
        content = Math.floor(limit / 86400) + ' 天前'
    } else if (limit >= 2592000 && limit < 31104000) {
        content = Math.floor(limit / 2592000) + ' 个月前'
    } else {
        content = format(publishTime) || '时间格式错误'
    }
    return content
}

// 是否是微信登录
const userAgent = window.navigator.userAgent.toLowerCase()

export const isWeixin = () => {
    let flag = false
    if (userAgent.indexOf('micromessenger') > 0) {
        flag = true
    }
    return flag
}

export const getQueryString = (name) => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    const r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
}

export const pureContent = (item) => {
    let format = /<[^>]+>/g
    return item.replace(format, '')
}
