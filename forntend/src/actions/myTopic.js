/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

// import { hashHistory } from 'react-router'
import { axiosAjax } from '../public/index'

import {
    MYTOPIC
} from '../constants/index'

export const myTopic = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/forum/myposts.do', arg, function (data) {
            const myTopic = data.value
            dispatch({
                type: MYTOPIC,
                myTopic
            })
        })
    }
}
