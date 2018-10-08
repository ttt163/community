/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

// import { hashHistory } from 'react-router'
import { axiosAjax } from '../public/index'

import {
    MY_PRAISE
} from '../constants/index'

export const myPraise = (arg) => {
    return (dispatch) => {
        axiosAjax('POST', '/forum/postupvoteusers.do', arg, function (data) {
            const myPraiseData = data.value
            dispatch({
                type: MY_PRAISE,
                myPraiseData
            })
        })
    }
}
