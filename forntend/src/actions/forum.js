/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

// import { hashHistory } from 'react-router'
import { axiosAjax } from '../public/index'

import {
    FORUM, INTO_FORUM
} from '../constants/index'

export const forumGet = (arg, fn) => {
    let json = {}
    json.pageSize = 100
    json.pageIndex = 1
    json.topRefresh = true
    return (dispatch) => {
        axiosAjax('POST', '/forum/home.do', {...arg, ...json}, function (data) {
            const forumData = data.value || {}
            $.fn.cookie('nickName', forumData.userInfo ? forumData.userInfo.nickName : '')
            $.fn.cookie('appIcon', forumData.appinfo ? forumData.appinfo.appIcon : '')
            dispatch({
                type: FORUM,
                forumData
            })
            fn(forumData.appinfo)
        })
    }
}

export const intoForum = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/forum/readpost.do', arg, function (data) {
            const forumDetail = data.value
            dispatch({
                type: INTO_FORUM,
                forumDetail
            })
        })
    }
}
