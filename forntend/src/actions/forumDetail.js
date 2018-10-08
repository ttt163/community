/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

import { hashHistory } from 'react-router'
import { axiosAjax } from '../public/index'

import {
    FORUM_DETAIL, DEL_COMMENT, DEL_FORUM, PRAISE_FORUM, COLLECT_FORUM
} from '../constants/index'

export const forumDetail = (arg, fn) => {
    return (dispatch) => {
        axiosAjax('POST', '/forum/readpost.do', arg, function (data) {
            const forumDetailData = data.value || {}
            dispatch({
                type: FORUM_DETAIL,
                forumDetailData
            })
            fn(forumDetailData.postInfo)
        })
    }
}

// 删除评论
export const delComment = (arg, index) => {
    return (dispatch) => {
        axiosAjax('POST', '/forum/deletereply.do', arg, function (data) {
            if (data.result === 1) {
                dispatch({
                    type: DEL_COMMENT,
                    index
                })
            }
        })
    }
}

// 删除帖子
export const delForum = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/forum/deletepost.do', arg, function (data) {
            dispatch({
                type: DEL_FORUM,
                data
            })
            if (data.result === 1) {
                alert('删除成功')
                hashHistory.push('/forum')
            }
        })
    }
}

// 点赞帖子
export const praiseForum = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/forum/upvotepost.do', arg, function (data) {
            dispatch({
                type: PRAISE_FORUM,
                data
            })
            if (data.result === 1) {
                console.log(data)
            }
        })
    }
}

// 收藏帖子
export const collectForum = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/forum/favoritepost.do', arg, function (data) {
            dispatch({
                type: COLLECT_FORUM,
                data
            })
            if (data.result === 1) {
                console.log(data)
            }
        })
    }
}
