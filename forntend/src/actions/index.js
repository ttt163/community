/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

// import { hashHistory } from 'react-router'
import { axiosAjax, browserLanguage } from '../public/index'
// import { forumGet } from './forum'

import {
    LOGIN,
    SETLANGUAGE,
    SETSKIN,
    TOKEN,
    SHOWORHIDE,
    WX_SIGN,
    INTER
} from '../constants/index'

// 登录请求
export const login = (arg, forumObj) => {
    return (dispatch) => {
        axiosAjax('POST', '/user/officialaccountlogin.do', arg, function (data) {
            dispatch({
                type: LOGIN,
                data
            })
            if (data.result === 1) {
                $.fn.cookie('appId', arg.appId)
                $.fn.cookie('userName', arg.userName)
                $.fn.cookie('sign', arg.sign)
                $.fn.cookie('login', true)
                dispatch(loginShow('none'))
                window.location.reload()
                // dispatch(forumGet({...forumObj}))
                // dispatch(wxSign({...forumObj, url: window.location.href.split('#')[0]}))
                // hashHistory.push('/')
            } else if (data.result === 0) {
                alert('账号密码输入有误~ 请重新输入')
                return false
            }
        })
    }
}

// 获取token请求
export const getToken = (arg, password) => {
    let obj = {
        ...arg,
        strType: 1,
        passportName: arg.userName,
        password: password
    }

    return (dispatch) => {
        axiosAjax('POST', '/login/createtoken.do', arg, function (data) {
            const tokenData = data.token
            $.fn.cookie('token', tokenData)
            obj.token = tokenData
            arg.token = tokenData
            dispatch({
                type: TOKEN,
                tokenData
            })
            if (data.result === 1) {
                dispatch(login(obj, arg))
            }
        })
    }
}

// 游客获取token
export const visitorGetToken = (arg, fn) => {
    return (dispatch) => {
        axiosAjax('POST', '/login/createtoken.do', arg, function (data) {
            const tokenData = data.token
            $.fn.cookie('token', tokenData)
            dispatch({
                type: TOKEN,
                tokenData
            })
            if (data.result === 1) {
                $.fn.cookie('appId', arg.appId)
                $.fn.cookie('userName', arg.userName)
                $.fn.cookie('sign', arg.sign)
                fn(tokenData)
            } else {
                alert(data.desc)
            }
        })
    }
}

// 微信获取
export const wxSign = (arg, shareData) => {
    return (dispatch) => {
        axiosAjax('POST', '/weixin/createsign.do', arg, function (data) {
            let value = data.value
            if (data.result === 1) {
                window.wx.config({
                    debug: false,
                    appId: value.appId,
                    timestamp: value.timestamp,
                    nonceStr: value.nonceStr,
                    signature: value.signature,
                    jsApiList: [
                        // 所有要调用的 API 都要加到这个列表中
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareQZone'
                    ]
                })

                let title = shareData.title
                let link = shareData.link
                let imgUrl = shareData.imgUrl
                let desc = shareData.desc

                window.wx.ready(function () {
                    window.wx.onMenuShareTimeline({
                        title: title,
                        link: link,
                        imgUrl: imgUrl,
                        success: function (res) {
                            alert('分享成功')
                        },
                        cancel: function (res) {
                            alert('您已取消分享')
                        }
                    })

                    window.wx.onMenuShareAppMessage({
                        title: title,
                        desc: desc,
                        link: link,
                        imgUrl: imgUrl,
                        success: function (res) {
                            alert('分享成功')
                        },
                        cancel: function (res) {
                            alert('您已取消分享')
                        }
                    })

                    window.wx.onMenuShareQQ({
                        title: title,
                        desc: desc,
                        link: link,
                        imgUrl: imgUrl,
                        success: function () {
                            alert('分享成功')
                        },
                        cancel: function () {
                            alert('您已取消分享')
                        }
                    })

                    window.wx.onMenuShareQZone({
                        title: title,
                        desc: desc,
                        link: link,
                        imgUrl: imgUrl,
                        success: function () {
                            alert('分享成功')
                        },
                        cancel: function () {
                            alert('您已取消分享')
                        }
                    })
                })

                dispatch({
                    type: WX_SIGN,
                    data
                })
            } else {
                alert(data.desc)
            }
        })
    }
}

export const setLanguage = (languageType) => {
    return {
        type: SETLANGUAGE,
        language: {
            footer: {
                forum: '论坛',
                film: '电影',
                personal: '个人'
            }
        }
    }
}

export const setSkin = (styleName) => {
    return {
        type: SETSKIN,
        styleName
    }
}

export const loginShow = (display) => {
    return {
        type: SHOWORHIDE,
        display
    }
}

export const international = () => {
    let arg = {
        lang: browserLanguage()
    }
    return (dispatch) => {
        axiosAjax('POST', '/i18n/getI18n.do', arg, function (data) {
            dispatch({
                type: INTER,
                data
            })
        })
    }
}
