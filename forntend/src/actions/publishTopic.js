/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

import { hashHistory } from 'react-router'
import { axiosAjax, axiosFormData } from '../public/index'

import {
    PUBLISH_TOPIC,
    UPLOAD_IMG,
    DELETE_IMG,
    CLEAR
} from '../constants/index'

export const publishTopic = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/forum/publishpost.do', arg, function (data) {
            const actionData = data.value
            dispatch({
                type: PUBLISH_TOPIC,
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
                type: UPLOAD_IMG,
                imgInfo
            })
            if (data.code === 0) {
                fn(imgInfo)
            }
        }, progressFn)
    }
}

export const deleteImg = (index) => {
    return {type: DELETE_IMG, index}
}

export const clear = (index) => {
    return {type: CLEAR, index}
}
