/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

// import { hashHistory } from 'react-router'
import { axiosAjax } from '../public/index'

import {
    MY_COLLECT
} from '../constants/index'

export const myCollect = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/forum/favoriteposts.do', arg, function (data) {
            const myCollectData = data.value
            dispatch({
                type: MY_COLLECT,
                myCollectData
            })
        })
    }
}
