/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

import { hashHistory } from 'react-router'
import { axiosAjax, axiosFormData } from '../public/index'

import {
    PUBLISH_COMMENT,
    COMMENT_UPIMG,
    COMMENT_DELIMG,
    CLEAR
} from '../constants/index'

export const publishComment = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/forum/replypost.do', arg, function (data) {
            const actionData = data.value
            console.log(data)
            dispatch({
                type: PUBLISH_COMMENT,
                actionData
            })
            if (data.result === 1) {
                dispatch(clear({}))
                hashHistory.goBack(-1)
            } else if (data.result === -1706) {
                alert('有敏感字请重新输入~')
                return false
            }
        })
    }
}

export const uploadImg = (arg, fn, progressFn) => {
    return (dispatch) => {
        axiosFormData('POST', '/picture/upload.do', arg, function (data) {
            const imgInfo = data.data.source_url
            dispatch({
                type: COMMENT_UPIMG,
                imgInfo
            })
            if (data.code === 0) {
                fn(imgInfo)
            }
        }, progressFn)
    }
}

export const deleteImg = (index) => {
    return {type: COMMENT_DELIMG, index}
}

export const clear = (index) => {
    return {type: CLEAR, index}
}
