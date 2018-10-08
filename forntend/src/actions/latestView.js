/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

// import { hashHistory } from 'react-router'
import { axiosAjax } from '../public/index'

import {
    LATESTVIEW
} from '../constants/index'

export const latestView = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/forum/recentViewPosts.do', arg, function (data) {
            const latestViewData = data.value
            dispatch({
                type: LATESTVIEW,
                latestViewData
            })
        })
    }
}
