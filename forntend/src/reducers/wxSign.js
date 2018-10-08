/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { WX_SIGN } from '../constants/index'

const wxSign = (state = {}, action) => {
    switch (action.type) {
        case WX_SIGN:
            return action.data
        default:
            return state
    }
}

export default wxSign
