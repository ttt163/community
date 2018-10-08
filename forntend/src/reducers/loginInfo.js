/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { LOGIN, SHOWORHIDE } from '../constants/index'
import {} from '../'

const loginInfo = (state = {display: 'none'}, action) => {
    switch (action.type) {
        case LOGIN:
            return {...state, ...action.data}
        case SHOWORHIDE:
            return {...state, display: action.display}
        default:
            return state
    }
}

export default loginInfo
