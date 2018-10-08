/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

// import { hashHistory } from 'react-router'
// import { axiosAjax } from '../public/index'

import {
    SELECTDATA
} from '../constants/index'

export const selectDataGet = (arg) => {
    let selectData = arg
    return (dispatch) => {
        dispatch({
            type: SELECTDATA,
            selectData
        })
    }
}
