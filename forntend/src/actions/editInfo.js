/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

// import { hashHistory } from 'react-router'
import { axiosAjax, axiosFormData } from '../public/index'

import {
    EDITINFO_UPIMG, EDITINFO_UPLOADIMG, EDITINFO_UPNICK, EDITINFO_UPGENDER, PERSONAL_INFO
} from '../constants/index'

// 更改头像
export const getPersonalInfo = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/user/getUserPersonalInfo.do', arg, function (data) {
            dispatch({
                type: PERSONAL_INFO,
                data
            })
        })
    }
}

// 上传头像
export const uploadImg = (arg, fn, progressFn) => {
    return (dispatch) => {
        axiosFormData('POST', '/picture/upload.do', arg, function (data) {
            const imgInfo = data.data.source_url
            dispatch({
                type: EDITINFO_UPLOADIMG,
                imgInfo
            })
            if (data.code === 0) {
                fn(imgInfo)
            }
        }, progressFn)
    }
}

// 更改头像
export const updateHeadImg = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/user/setUserIcon.do', arg, function (data) {
            dispatch({
                type: EDITINFO_UPIMG,
                data
            })
        })
    }
}

// 更改昵称
export const updateNickName = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/user/setUserNickName.do', arg, function (data) {
            dispatch({
                type: EDITINFO_UPNICK,
                data
            })
            $.fn.cookie('nickName', arg.nickName)
        })
    }
}

// 更改性别
export const updateGender = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/user/setUserSex.do', arg, function (data) {
            dispatch({
                type: EDITINFO_UPGENDER,
                data
            })
        })
    }
}

// export const clear = (index) => {
//     return {type: CLEAR, index}
// }
